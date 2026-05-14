import TopbarEditorial from "@/components/home/editorial/TopbarEditorial";
import HeroEditorial from "@/components/home/editorial/HeroEditorial";
import { ApplicationStatusBanner } from "@/components/ApplicationStatusBanner";
import FichaTecnica from "@/components/home/editorial/FichaTecnica";
import MiniCTACriadores from "@/components/home/editorial/MiniCTACriadores";
import FundadoresBanner from "@/components/home/editorial/FundadoresBanner";
import RaizesSpread from "@/components/home/editorial/RaizesSpread";
import Manifesto from "@/components/home/editorial/Manifesto";
import VerificationSeal from "@/components/home/editorial/VerificationSeal";
import ClosingCTA from "@/components/home/editorial/ClosingCTA";
import FootEditorial from "@/components/home/editorial/FootEditorial";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function HomePage() {
  const supabase = await createClient();
  const [{ count: profilesCount }, { count: kennelsCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("kennels").select("*", { count: "exact", head: true }).eq("status", "approved"),
  ]);

  return (
    <div style={{ background: "var(--color-cream-bg)", overflow: "hidden" }}>
      <TopbarEditorial />
      <ApplicationStatusBanner />
      <HeroEditorial />
      <FichaTecnica profilesCount={profilesCount ?? 0} kennelsCount={kennelsCount ?? 0} />
      <MiniCTACriadores />
      <FundadoresBanner />
      <RaizesSpread />
      <Manifesto />
      <VerificationSeal />
      <ClosingCTA />
      <FootEditorial />
    </div>
  );
}
