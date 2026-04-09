"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";

interface UseRoleReturn {
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isApprover: boolean;
  isKennel: boolean;
}

export function useRole(): UseRoleReturn {
  const { user, loading: userLoading } = useUser();
  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setRole((data?.role as UserRole) ?? "client");
        setRoleLoading(false);
      });
  }, [user, userLoading]);

  return {
    role,
    loading: userLoading || roleLoading,
    isAdmin: role === "super_admin",
    isApprover: role === "approver" || role === "super_admin",
    isKennel: role === "kennel",
  };
}
