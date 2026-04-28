"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";

export type ApplicationStatus = "pending" | "approved" | "rejected" | "none";

export interface ApplicationData {
  id: string;
  status: ApplicationStatus;
  kennel_name: string | null;
  reject_reason: string | null;
  approval_message: string | null;
  reviewed_at: string | null;
}

interface UseApplicationStatusReturn {
  status: ApplicationStatus;
  application: ApplicationData | null;
  loading: boolean;
}

export function useApplicationStatus(): UseApplicationStatusReturn {
  const { user, loading: userLoading } = useUser();
  const [status, setStatus] = useState<ApplicationStatus>("none");
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setStatus("none");
      setApplication(null);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function load() {
      const { data } = await supabase
        .from("kennel_applications")
        .select("id, status, kennel_name, reject_reason, approval_message, reviewed_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setStatus(data.status as ApplicationStatus);
        setApplication(data as ApplicationData);
      } else {
        setStatus("none");
        setApplication(null);
      }
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel(`app-status-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "kennel_applications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as ApplicationData;
          setStatus(row.status);
          setApplication(row);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userLoading]);

  return { status, application, loading };
}
