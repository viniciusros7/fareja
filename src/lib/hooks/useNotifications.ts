"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";

export type NotifType =
  | "post_like"
  | "post_comment"
  | "forum_reply"
  | "forum_topic_like"
  | "forum_reply_like";

export type NotifTargetType = "post" | "forum_topic" | "forum_reply";

export interface NotifActor {
  id: string;
  name: string | null;
  avatar: string | null;
  created_at: string;
}

export interface NotificationGroup {
  groupKey: string;
  type: NotifType;
  targetType: NotifTargetType;
  targetId: string;
  preview: string | null;
  totalCount: number;
  unreadCount: number;
  latestAt: string;
  recentActors: NotifActor[];
}

function mapRow(row: Record<string, unknown>): NotificationGroup {
  return {
    groupKey:     row.group_key as string,
    type:         row.type as NotifType,
    targetType:   row.target_type as NotifTargetType,
    targetId:     row.target_id as string,
    preview:      row.preview as string | null,
    totalCount:   Number(row.total_count),
    unreadCount:  Number(row.unread_count),
    latestAt:     row.latest_at as string,
    recentActors: (row.recent_actors as NotifActor[]) ?? [],
  };
}

export function useNotifications() {
  const { user, loading: userLoading } = useUser();
  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchGroups = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc("get_grouped_notifications", {
      p_user_id: user.id,
      p_limit: 30,
    });
    if (error) { setLoading(false); return; }
    const mapped = (data ?? []).map(mapRow);
    setGroups(mapped);
    setUnreadTotal(mapped.reduce((s: number, g: NotificationGroup) => s + g.unreadCount, 0));
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setGroups([]);
      setUnreadTotal(0);
      setLoading(false);
      return;
    }
    fetchGroups();
  }, [user, userLoading, fetchGroups]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notif-grouped-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        () => { fetchGroups(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, fetchGroups]);

  async function markAsRead(group: NotificationGroup) {
    if (!user || group.unreadCount === 0) return;
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString(), read: true })
      .eq("recipient_id", user.id)
      .eq("type", group.type)
      .eq("target_type", group.targetType)
      .eq("target_id", group.targetId)
      .is("read_at", null);
    setGroups((prev) =>
      prev.map((g) => g.groupKey === group.groupKey ? { ...g, unreadCount: 0 } : g)
    );
    setUnreadTotal((prev) => Math.max(0, prev - group.unreadCount));
  }

  async function markAllAsRead() {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString(), read: true })
      .eq("recipient_id", user.id)
      .is("read_at", null);
    setGroups((prev) => prev.map((g) => ({ ...g, unreadCount: 0 })));
    setUnreadTotal(0);
  }

  return { groups, unreadTotal, loading, markAsRead, markAllAsRead, refresh: fetchGroups };
}
