"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";

type FavoriteType = "breed" | "kennel";

interface FavoriteRow {
  breed_id: string | null;
  kennel_id: string | null;
}

export function useFavorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const supabase = createClient();
    setLoading(true);
    supabase
      .from("favorites")
      .select("breed_id, kennel_id")
      .eq("user_id", user.id)
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else {
          setFavorites((data as FavoriteRow[]) ?? []);
        }
        setLoading(false);
      });
  }, [user]);

  const isFavorited = useCallback(
    (type: FavoriteType, id: string): boolean => {
      if (type === "breed") return favorites.some((f) => f.breed_id === id);
      return favorites.some((f) => f.kennel_id === id);
    },
    [favorites]
  );

  const toggle = useCallback(
    async (type: FavoriteType, id: string) => {
      if (!user) return;
      const supabase = createClient();

      if (isFavorited(type, id)) {
        const query = supabase.from("favorites").delete().eq("user_id", user.id);
        if (type === "breed") {
          await query.eq("breed_id", id);
          setFavorites((prev) => prev.filter((f) => f.breed_id !== id));
        } else {
          await query.eq("kennel_id", id);
          setFavorites((prev) => prev.filter((f) => f.kennel_id !== id));
        }
      } else {
        const row =
          type === "breed"
            ? { user_id: user.id, breed_id: id, kennel_id: null }
            : { user_id: user.id, kennel_id: id, breed_id: null };
        const { data } = await supabase
          .from("favorites")
          .insert(row)
          .select("breed_id, kennel_id")
          .single();
        if (data) setFavorites((prev) => [...prev, data as FavoriteRow]);
      }
    },
    [user, isFavorited]
  );

  return { favorites, loading, error, isFavorited, toggle };
}
