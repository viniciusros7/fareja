import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 10;

const KENNEL_DAILY_LIMITS: Record<string, number> = {
  basic: 3,
  premium: 10,
  super_premium: Infinity,
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor"); // created_at of last item

  let query = supabase
    .from("posts")
    .select(`
      id, author_id, content, images, thumbnails,
      likes_count, comments_count, status, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      kennel:kennels(id, name, plan, slug)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    posts: data ?? [],
    nextCursor: data && data.length === PAGE_SIZE
      ? data[data.length - 1].created_at
      : null,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { content, images = [], thumbnails = [] } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Conteúdo obrigatório" }, { status: 400 });
  }

  // Get user role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "client";

  // Daily limit for kennel role
  if (role === "kennel") {
    const { data: kennel } = await supabase
      .from("kennels")
      .select("plan")
      .eq("owner_id", user.id)
      .single();

    const plan = kennel?.plan ?? "basic";
    const limit = KENNEL_DAILY_LIMITS[plan] ?? 3;

    if (limit !== Infinity) {
      const since = new Date();
      since.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", user.id)
        .gte("created_at", since.toISOString());

      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          { error: `Limite de ${limit} posts por dia atingido para o plano ${plan}.` },
          { status: 429 }
        );
      }
    }
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      content: content.trim(),
      images,
      thumbnails,
      status: "published",
      // required legacy columns
      title: content.trim().slice(0, 100),
      type: "photo",
    })
    .select(`
      id, author_id, content, images, thumbnails,
      likes_count, comments_count, status, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      kennel:kennels(id, name, plan, slug)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post }, { status: 201 });
}
