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

  const { data, error } = await supabase.rpc("toggle_topic_like", {
    p_topic_id: id,
    p_user_id: user.id,
  });

  if (error || !data?.[0]) {
    return NextResponse.json(
      { error: error?.message ?? "Erro ao processar like" },
      { status: 500 }
    );
  }

  return NextResponse.json({ liked: data[0].liked, likes_count: data[0].likes_count });
}
