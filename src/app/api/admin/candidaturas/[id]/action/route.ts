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
  const { action, reason } = body;

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }
  if (action === "reject" && !reason?.trim()) {
    return NextResponse.json({ error: "Motivo obrigatório para rejeição" }, { status: 400 });
  }

  const { data: app } = await supabase
    .from("kennel_applications")
    .select("id, user_id, status")
    .eq("id", id)
    .single();

  if (!app) return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 });
  if (app.status !== "pending") {
    return NextResponse.json({ error: "Candidatura não está pendente" }, { status: 409 });
  }

  const now = new Date().toISOString();

  if (action === "approve") {
    const { error: updateError } = await supabase
      .from("kennel_applications")
      .update({ status: "approved", reviewed_by: user.id, reviewed_at: now })
      .eq("id", id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    // Check if this kennel qualifies for the Founders Program (first 10)
    const { count: founderCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_founder", true);

    const isNewFounder = (founderCount ?? 0) < 10;
    const founderNumber = isNewFounder ? (founderCount ?? 0) + 1 : null;
    const founderFreeUntil = isNewFounder
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await supabase
      .from("profiles")
      .update({
        role: "kennel",
        ...(isNewFounder && {
          is_founder: true,
          founder_number: founderNumber,
          founder_free_until: founderFreeUntil,
        }),
      })
      .eq("id", app.user_id);

    return NextResponse.json({ success: true, is_founder: isNewFounder, founder_number: founderNumber });
  }

  const { error: updateError } = await supabase
    .from("kennel_applications")
    .update({
      status: "rejected",
      reject_reason: reason.trim(),
      reviewed_by: user.id,
      reviewed_at: now,
    })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
