import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const [{ count: members }, { count: founders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "client"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_founder", true),
  ]);

  return NextResponse.json({
    members: members ?? 0,
    founders: founders ?? 0,
  });
}
