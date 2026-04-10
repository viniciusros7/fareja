import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("post_comments")
    .select(`
      id, content, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role)
    `)
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
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

  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Comentário vazio" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: id, author_id: user.id, content: content.trim() })
    .select(`
      id, content, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
