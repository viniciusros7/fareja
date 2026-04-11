import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("forum_topic_likes")
    .select("topic_id")
    .eq("topic_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: topic } = await supabase
    .from("forum_topics")
    .select("likes_count")
    .eq("id", id)
    .single();

  if (!topic) {
    return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
  }

  if (existing) {
    await supabase.from("forum_topic_likes").delete().eq("topic_id", id).eq("user_id", user.id);
    await supabase
      .from("forum_topics")
      .update({ likes_count: Math.max(0, topic.likes_count - 1) })
      .eq("id", id);
    return NextResponse.json({ liked: false, likes_count: Math.max(0, topic.likes_count - 1) });
  }

  await supabase.from("forum_topic_likes").insert({ topic_id: id, user_id: user.id });
  await supabase
    .from("forum_topics")
    .update({ likes_count: topic.likes_count + 1 })
    .eq("id", id);
  return NextResponse.json({ liked: true, likes_count: topic.likes_count + 1 });
}
