import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ count: 0 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["approver", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ count: 0 });
  }

  const { count } = await supabase
    .from("kennel_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return NextResponse.json({ count: count ?? 0 });
}
