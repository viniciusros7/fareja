import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteFile } from "@/lib/r2";

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json();
  const { key } = body;

  if (!key || typeof key !== "string") {
    return NextResponse.json({ error: "key obrigatória" }, { status: 400 });
  }

  if (!key.startsWith(`feed-previews/${user.id}/`)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  try {
    await deleteFile(key);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Falha ao deletar" }, { status: 502 });
  }
}
