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
    .from("forum_reply_likes")
    .select("reply_id")
    .eq("reply_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: reply } = await supabase
    .from("forum_replies")
    .select("likes_count")
    .eq("id", id)
    .single();

  if (!reply) {
    return NextResponse.json({ error: "Resposta não encontrada" }, { status: 404 });
  }

  if (existing) {
    await supabase.from("forum_reply_likes").delete().eq("reply_id", id).eq("user_id", user.id);
    await supabase
      .from("forum_replies")
      .update({ likes_count: Math.max(0, reply.likes_count - 1) })
      .eq("id", id);
    return NextResponse.json({ liked: false, likes_count: Math.max(0, reply.likes_count - 1) });
  }

  await supabase.from("forum_reply_likes").insert({ reply_id: id, user_id: user.id });
  await supabase
    .from("forum_replies")
    .update({ likes_count: reply.likes_count + 1 })
    .eq("id", id);
  return NextResponse.json({ liked: true, likes_count: reply.likes_count + 1 });
}
