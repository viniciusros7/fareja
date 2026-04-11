import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category_id");
  const sort = searchParams.get("sort") ?? "recent";
  const cursor = searchParams.get("cursor");

  let query = supabase
    .from("forum_topics")
    .select(`
      id, category_id, author_id, title, content, images,
      views_count, replies_count, likes_count,
      is_pinned, is_solved, status, created_at, updated_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      kennel:kennels(id, name, slug, plan),
      category:forum_categories(id, name, slug)
    `)
    .limit(PAGE_SIZE);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (sort === "popular") {
    query = query.order("likes_count", { ascending: false }).order("created_at", { ascending: false });
  } else if (sort === "unanswered") {
    query = query.eq("replies_count", 0).order("created_at", { ascending: false });
  } else {
    // recent — pinned first, then by updated_at
    query = query.order("is_pinned", { ascending: false }).order("updated_at", { ascending: false });
  }

  if (cursor) {
    query = query.lt("updated_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    topics: data ?? [],
    nextCursor: data && data.length === PAGE_SIZE
      ? data[data.length - 1].updated_at
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
  const { category_id, title, content, images = [] } = body;

  if (!category_id?.trim()) {
    return NextResponse.json({ error: "Categoria obrigatória" }, { status: 400 });
  }
  if (!title?.trim()) {
    return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });
  }
  if (!content?.trim()) {
    return NextResponse.json({ error: "Conteúdo obrigatório" }, { status: 400 });
  }

  const { data: topic, error } = await supabase
    .from("forum_topics")
    .insert({
      category_id,
      author_id: user.id,
      title: title.trim(),
      content: content.trim(),
      images,
    })
    .select(`
      id, category_id, author_id, title, content, images,
      views_count, replies_count, likes_count,
      is_pinned, is_solved, status, created_at, updated_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      kennel:kennels(id, name, slug, plan),
      category:forum_categories(id, name, slug)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ topic }, { status: 201 });
}
