import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profileRes, topicsRes, repliesRes, likedRes, kennelRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url, bio, role, created_at, privacy_accepted, privacy_accepted_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("forum_topics")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id),
    supabase
      .from("forum_replies")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id),
    supabase
      .from("forum_topic_likes")
      .select("id:topic_id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("kennels")
      .select("id, name, slug, plan, cover_url, logo_url, city, state, created_at")
      .eq("owner_id", user.id)
      .single(),
  ]);

  const profile = profileRes.data;
  const kennel = kennelRes.data ?? null;

  // Member rank: count profiles created before this user
  const { count: memberRank } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .lte("created_at", profile?.created_at ?? new Date().toISOString());

  // Kennel thumbnail grid (last 9 posts)
  let kennelPosts: { id: string; thumbnail_url: string | null }[] = [];
  if (kennel) {
    const { data: posts } = await supabase
      .from("posts")
      .select("id, thumbnail_url")
      .eq("kennel_id", kennel.id)
      .order("created_at", { ascending: false })
      .limit(9);
    kennelPosts = posts ?? [];
  }

  // Favorites received (how many users favorited this kennel)
  let favoritesReceived = 0;
  if (kennel) {
    const { count } = await supabase
      .from("kennel_favorites")
      .select("id:kennel_id", { count: "exact", head: true })
      .eq("kennel_id", kennel.id);
    favoritesReceived = count ?? 0;
  }

  return NextResponse.json({
    profile,
    stats: {
      forum_topics: topicsRes.count ?? 0,
      forum_replies: repliesRes.count ?? 0,
      liked_posts: likedRes.count ?? 0,
      member_rank: memberRank ?? 0,
    },
    kennel,
    kennel_posts: kennelPosts,
    favorites_received: favoritesReceived,
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, string> = {};
  if (typeof body.full_name === "string") updates.full_name = body.full_name.trim();
  if (typeof body.bio === "string") updates.bio = body.bio.trim();

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("id, full_name, bio")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
