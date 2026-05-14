import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteFile } from "@/lib/r2";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const keys: string[] = Array.isArray(body.keys) ? body.keys : body.key ? [body.key] : [];

  if (keys.length === 0) {
    return NextResponse.json({ error: "Nenhuma chave fornecida" }, { status: 400 });
  }

  // Only allow deleting preview files owned by the user
  const invalid = keys.find((k) => !k.startsWith(`posts/preview/${user.id}/`));
  if (invalid) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  await Promise.allSettled(keys.map((k) => deleteFile(k)));
  return NextResponse.json({ ok: true });
}
