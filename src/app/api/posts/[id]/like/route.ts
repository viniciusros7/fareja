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
    .from("post_likes")
    .select("post_id")
    .eq("post_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: post } = await supabase
    .from("posts")
    .select("likes_count")
    .eq("id", id)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
  }

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", id).eq("user_id", user.id);
    await supabase
      .from("posts")
      .update({ likes_count: Math.max(0, post.likes_count - 1) })
      .eq("id", id);
    return NextResponse.json({ liked: false, likes_count: Math.max(0, post.likes_count - 1) });
  }

  await supabase.from("post_likes").insert({ post_id: id, user_id: user.id });
  await supabase
    .from("posts")
    .update({ likes_count: post.likes_count + 1 })
    .eq("id", id);
  return NextResponse.json({ liked: true, likes_count: post.likes_count + 1 });
}
