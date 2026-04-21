import TopbarEditorial from "@/components/home/editorial/TopbarEditorial";
import HeroEditorial from "@/components/home/editorial/HeroEditorial";
import FichaTecnica from "@/components/home/editorial/FichaTecnica";
import MiniCTACriadores from "@/components/home/editorial/MiniCTACriadores";
import FundadoresBanner from "@/components/home/editorial/FundadoresBanner";
import RaizesSpread from "@/components/home/editorial/RaizesSpread";
import Manifesto from "@/components/home/editorial/Manifesto";
import VerificationSeal from "@/components/home/editorial/VerificationSeal";
import ClosingCTA from "@/components/home/editorial/ClosingCTA";
import FootEditorial from "@/components/home/editorial/FootEditorial";

export default function HomePage() {
  return (
    <div style={{ background: "var(--color-cream-bg)", overflow: "hidden" }}>
      <TopbarEditorial />
      <HeroEditorial />
      <FichaTecnica />
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
