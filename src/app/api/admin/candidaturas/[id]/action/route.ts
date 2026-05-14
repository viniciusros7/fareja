import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["approver", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await request.json();
  const { action, reason, approval_message } = body;

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }
  if (action === "reject" && !reason?.trim()) {
    return NextResponse.json({ error: "Motivo obrigatório para rejeição" }, { status: 400 });
  }

  if (action === "approve") {
    const { data, error } = await supabase.rpc("approve_kennel_application", {
      application_id: id,
      reviewer_id: user.id,
      approval_message: approval_message ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, kennel_id: data });
  }

  const { error } = await supabase.rpc("reject_kennel_application", {
    application_id: id,
    reviewer_id: user.id,
    reason: reason.trim(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
