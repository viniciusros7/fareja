import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function calcScore(data: {
  has_cbkc: boolean;
  has_health_tests: boolean;
  has_contract: boolean;
  experience_years: number;
  litter_size: number;
}): { score: number; suggested_plan: "verificado" | "premium" | "elite" } {
  let score = 0;
  if (data.has_cbkc) score += 30;
  if (data.has_health_tests) score += 25;
  if (data.has_contract) score += 15;
  if (data.experience_years >= 5) score += 20;
  else if (data.experience_years >= 2) score += 10;
  else if (data.experience_years >= 1) score += 5;
  if (data.litter_size >= 10) score += 10;
  else if (data.litter_size >= 5) score += 5;

  const suggested_plan =
    score >= 71 ? "elite" : score >= 41 ? "premium" : "verificado";
  return { score, suggested_plan };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json();
  const {
    full_name, email, phone, city, state,
    kennel_name, breed, experience_years,
    has_cbkc, has_health_tests, has_contract, litter_size,
  } = body;

  if (!full_name || !email || !city || !state || !kennel_name || !breed) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const { score, suggested_plan } = calcScore({
    has_cbkc: !!has_cbkc,
    has_health_tests: !!has_health_tests,
    has_contract: !!has_contract,
    experience_years: Number(experience_years) || 0,
    litter_size: Number(litter_size) || 0,
  });

  const { error } = await supabase.from("kennel_applications").insert({
    user_id: user.id,
    full_name,
    email,
    phone: phone || null,
    city,
    state,
    kennel_name,
    breed,
    experience_years: Number(experience_years) || 0,
    has_cbkc: !!has_cbkc,
    has_health_tests: !!has_health_tests,
    has_contract: !!has_contract,
    litter_size: Number(litter_size) || 0,
    score,
    suggested_plan,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ score, suggested_plan });
}
