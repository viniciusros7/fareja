"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import PrivacyModal from "@/components/PrivacyModal";

const FULLSCREEN_PATHS = ["/comunidade/feed/novo"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullscreen = FULLSCREEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (fullscreen) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-0 page-enter">{children}</main>
      <Footer />
      <BottomNav />
      <PrivacyModal />
    </>
  );
}
