"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PawPrint, User, Dog, FileText, Star, MessageCircle,
  Stethoscope, Store, BarChart3, Settings, Gem, Loader2,
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import { useUser } from "@/lib/hooks/useUser";
import AccessDenied from "@/components/layout/AccessDenied";

const navItems = [
  { href: "/painel", label: "Visão geral", icon: BarChart3 },
  { href: "/painel/perfil", label: "Perfil do canil", icon: User },
  { href: "/painel/filhotes", label: "Filhotes", icon: Dog },
  { href: "/painel/reprodutores", label: "Reprodutores", icon: PawPrint },
  { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/painel/comunidade", label: "Comunidade", icon: MessageCircle },
  { href: "/painel/parceiros", label: "Parceiros", icon: Stethoscope },
  { href: "/painel/configuracoes", label: "Configurações", icon: Settings },
];

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const { loading: roleLoading, isKennel } = useRole();

  if (userLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!user || !isKennel) {
    return <AccessDenied message="O painel de canil é exclusivo para criadores verificados." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
          GL
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-semibold text-brand-900">
              Canil Good Leisure
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white">
              <Gem className="w-2.5 h-2.5" />
              Elite
            </span>
          </div>
          <p className="text-xs text-earth-500">São Lourenço da Serra, SP · 37 anos</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="hidden md:block w-52 shrink-0">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/painel" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-100 text-brand-700"
                      : "text-earth-500 hover:bg-earth-50 hover:text-earth-700"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden overflow-x-auto pb-2 mb-4 flex gap-1.5 w-full">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  active
                    ? "bg-brand-100 text-brand-600 border-brand-300"
                    : "bg-white text-earth-500 border-earth-200"
                }`}
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
