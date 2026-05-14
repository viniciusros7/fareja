"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";

// Module-level shared state — one fetch + one channel per session
let _count = 0;
let _initialized = false;
let _channelUserId: string | null = null;
const _subscribers = new Set<(c: number) => void>();

function broadcast(c: number) {
  _count = c;
  _subscribers.forEach((fn) => fn(c));
}

async function initCount() {
  if (_initialized) return;
  _initialized = true;
  try {
    const r = await fetch("/api/notifications");
    if (!r.ok) return;
    const { data } = await r.json();
    broadcast((data ?? []).filter((n: { read: boolean }) => !n.read).length);
  } catch {
    _initialized = false;
  }
}

function initRealtime(userId: string) {
  if (_channelUserId === userId) return;
  _channelUserId = userId;

  const supabase = createClient();
  supabase
    .channel(`notif-count-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `recipient_id=eq.${userId}`,
      },
      () => { broadcast(_count + 1); }
    )
    .subscribe();
}

export function decrementNotificationCount() {
  broadcast(Math.max(0, _count - 1));
}

export function clearNotificationCount() {
  broadcast(0);
  _initialized = false;
}

export function useNotificationCount(): number {
  const { user, loading } = useUser();
  const [count, setCount] = useState(_count);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      _count = 0;
      _initialized = false;
      _channelUserId = null;
      setCount(0);
      return;
    }

    const fn = (c: number) => setCount(c);
    _subscribers.add(fn);
    setCount(_count);
    initCount();
    initRealtime(user.id);

    return () => { _subscribers.delete(fn); };
  }, [user?.id, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return count;
}
