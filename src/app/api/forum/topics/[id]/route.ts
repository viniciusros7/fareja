import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: topic, error } = await supabase
    .from("forum_topics")
    .select(`
      id, category_id, author_id, title, content, images,
      views_count, replies_count, likes_count,
      is_pinned, is_solved, status, created_at, updated_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      category:forum_categories(id, name, slug)
    `)
    .eq("id", id)
    .single();

  if (error || !topic) {
    return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
  }

  const { data: kennelRow } = await supabase
    .from("kennels")
    .select("id, name, slug, plan")
    .eq("owner_id", topic.author_id)
    .eq("status", "approved")
    .maybeSingle();

  // increment views atomically (fire and forget — non-critical counter)
  supabase.rpc("increment_topic_views", { topic_id: id }).then(({ error }) => {
    if (error) console.error("[views_count] increment failed:", id, error.message);
  });

  return NextResponse.json({ topic: { ...topic, kennel: kennelRow ?? null } });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: topic } = await supabase
    .from("forum_topics")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!topic) {
    return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isMod = profile && ["approver", "super_admin"].includes(profile.role);
  const isAuthor = topic.author_id === user.id;

  if (!isAuthor && !isMod) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (isAuthor || isMod) {
    if (body.title !== undefined) updates.title = body.title;
    if (body.content !== undefined) updates.content = body.content;
    if (body.is_solved !== undefined) updates.is_solved = body.is_solved;
    if (body.status !== undefined) updates.status = body.status;
  }
  if (isMod) {
    if (body.is_pinned !== undefined) updates.is_pinned = body.is_pinned;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("forum_topics")
    .update(updates)
    .eq("id", id)
    .select(`
      id, category_id, author_id, title, content, images,
      views_count, replies_count, likes_count,
      is_pinned, is_solved, status, created_at, updated_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      category:forum_categories(id, name, slug)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: kennelRow } = await supabase
    .from("kennels")
    .select("id, name, slug, plan")
    .eq("owner_id", updated.author_id)
    .eq("status", "approved")
    .maybeSingle();

  return NextResponse.json({ topic: { ...updated, kennel: kennelRow ?? null } });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: topic } = await supabase
    .from("forum_topics")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!topic) {
    return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isMod = profile && ["approver", "super_admin"].includes(profile.role);

  if (topic.author_id !== user.id && !isMod) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { error } = await supabase
    .from("forum_topics")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
