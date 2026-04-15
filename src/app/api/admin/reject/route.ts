import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // 1. Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // 2. Verificar role server-side
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["approver", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  // 3. Ler payload
  const body = await request.json();
  const { kennel_id, reason } = body;

  if (!kennel_id) {
    return NextResponse.json({ error: "kennel_id obrigatório" }, { status: 400 });
  }
  if (!reason?.trim()) {
    return NextResponse.json({ error: "Motivo da rejeição obrigatório" }, { status: 400 });
  }

  // 4. Verificar que o canil existe e está pendente
  const { data: kennel } = await supabase
    .from("kennels")
    .select("id, status")
    .eq("id", kennel_id)
    .single();

  if (!kennel) {
    return NextResponse.json({ error: "Canil não encontrado" }, { status: 404 });
  }
  if (kennel.status !== "pending") {
    return NextResponse.json({ error: "Canil não está pendente" }, { status: 409 });
  }

  // 5. Rejeitar canil
  const { error: kennelError } = await supabase
    .from("kennels")
    .update({
      status: "rejected",
      rejected_reason: reason.trim(),
      reviewed_by: user.id,
    })
    .eq("id", kennel_id);

  if (kennelError) {
    return NextResponse.json({ error: kennelError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
