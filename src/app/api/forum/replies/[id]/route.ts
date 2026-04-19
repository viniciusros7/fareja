import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { data: reply } = await supabase
    .from("forum_replies")
    .select("author_id, topic_id")
    .eq("id", id)
    .single();

  if (!reply) {
    return NextResponse.json({ error: "Resposta não encontrada" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isMod = profile && ["approver", "super_admin"].includes(profile.role);
  const isReplyAuthor = reply.author_id === user.id;

  const { data: topic } = await supabase
    .from("forum_topics")
    .select("author_id")
    .eq("id", reply.topic_id)
    .single();

  const isTopicAuthor = topic?.author_id === user.id;

  if (!isReplyAuthor && !isTopicAuthor && !isMod) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (isReplyAuthor || isMod) {
    if (body.content !== undefined) updates.content = body.content;
  }
  if (isTopicAuthor || isMod) {
    if (body.is_best_answer !== undefined) {
      // If marking as best answer, unmark previous best answer first
      if (body.is_best_answer) {
        await supabase
          .from("forum_replies")
          .update({ is_best_answer: false })
          .eq("topic_id", reply.topic_id)
          .eq("is_best_answer", true);
        // Mark topic as solved
        await supabase
          .from("forum_topics")
          .update({ is_solved: true })
          .eq("id", reply.topic_id);
      }
      updates.is_best_answer = body.is_best_answer;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("forum_replies")
    .update(updates)
    .eq("id", id)
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
    .eq("owner_id", updated.author_id)
    .eq("status", "approved")
    .maybeSingle();

  return NextResponse.json({ reply: { ...updated, kennel: kennelRow ?? null } });
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

  const { data: reply } = await supabase
    .from("forum_replies")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!reply) {
    return NextResponse.json({ error: "Resposta não encontrada" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isMod = profile && ["approver", "super_admin"].includes(profile.role);

  if (reply.author_id !== user.id && !isMod) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { error } = await supabase
    .from("forum_replies")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
