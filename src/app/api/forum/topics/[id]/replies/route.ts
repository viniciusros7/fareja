import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forum_replies")
    .select(`
      id, topic_id, author_id, content, images,
      likes_count, is_best_answer, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role)
    `)
    .eq("topic_id", id)
    .order("is_best_answer", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const replies = data ?? [];
  const authorIds = [...new Set(replies.map((r) => r.author_id).filter(Boolean))];
  const kennelMap = new Map<string, { id: string; name: string; slug: string; plan: string }>();

  if (authorIds.length > 0) {
    const { data: kennels } = await supabase
      .from("kennels")
      .select("id, name, slug, plan, owner_id")
      .in("owner_id", authorIds)
      .eq("status", "approved");
    for (const k of kennels ?? []) kennelMap.set(k.owner_id, { id: k.id, name: k.name, slug: k.slug, plan: k.plan });
  }

  return NextResponse.json({ replies: replies.map((r) => ({ ...r, kennel: kennelMap.get(r.author_id) ?? null })) });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { content, images = [] } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Conteúdo obrigatório" }, { status: 400 });
  }

  const { data: topic } = await supabase
    .from("forum_topics")
    .select("id, status")
    .eq("id", id)
    .single();

  if (!topic) {
    return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
  }

  if (topic.status === "closed") {
    return NextResponse.json({ error: "Tópico fechado" }, { status: 403 });
  }

  const { data: reply, error } = await supabase
    .from("forum_replies")
    .insert({
      topic_id: id,
      author_id: user.id,
      content: content.trim(),
      images,
    })
    .select(`
      id, topic_id, author_id, content, images,
      likes_count, is_best_answer, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: kennelRow } = await supabase
    .from("kennels")
    .select("id, name, slug, plan")
    .eq("owner_id", user.id)
    .eq("status", "approved")
    .maybeSingle();

  return NextResponse.json({ reply: { ...reply, kennel: kennelRow ?? null } }, { status: 201 });
}
