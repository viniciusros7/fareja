import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
  }

  const role = profile?.role ?? "client";
  const canDelete =
    post.author_id === user.id ||
    role === "approver" ||
    role === "super_admin";

  if (!canDelete) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  await supabase.from("posts").update({ status: "removed" }).eq("id", id);

  return NextResponse.json({ ok: true });
}
