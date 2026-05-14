"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PawPrint, User, Dog, FileText, Star, MessageCircle,
  Stethoscope, BarChart3, Settings, Gem, Loader2, Heart,
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import { useUser } from "@/lib/hooks/useUser";

const kennelNavItems = [
  { href: "/painel", label: "Visão geral", icon: BarChart3 },
  { href: "/painel/perfil", label: "Perfil", icon: User },
  { href: "/painel/filhotes", label: "Filhotes", icon: Dog },
  { href: "/painel/reprodutores", label: "Reprodutores", icon: PawPrint },
  { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/comunidade", label: "Comunidade", icon: MessageCircle },
  { href: "/painel/parceiros", label: "Parceiros", icon: Stethoscope },
  { href: "/painel/configuracoes", label: "Configurações", icon: Settings },
];

const clientNavItems = [
  { href: "/painel", label: "Início", icon: BarChart3 },
  { href: "/painel/perfil", label: "Perfil", icon: User },
  { href: "/painel/favoritos", label: "Favoritos", icon: Heart },
  { href: "/painel/configuracoes", label: "Configurações", icon: Settings },
];

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const { loading: roleLoading, isKennel, isApprover } = useRole();

  if (userLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-4">
          <PawPrint className="w-7 h-7 text-brand-600" />
        </div>
        <h2 className="font-display text-xl font-semibold text-earth-900 mb-2">
          Entre para gerenciar seu perfil e favoritos
        </h2>
        <p className="text-sm text-earth-500 max-w-sm mx-auto mb-5 leading-relaxed">
          Acesse seu painel, gerencie favoritos e acompanhe suas atividades.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          Entrar
        </Link>
        <p className="mt-3 text-xs text-earth-400">
          Não tem conta?{" "}
          <Link href="/login" className="text-brand-600 hover:underline font-medium">
            Criar conta grátis
          </Link>
        </p>
      </div>
    );
  }

  const navItems = (isKennel || isApprover) ? kennelNavItems : clientNavItems;
  const displayName = user.user_metadata?.full_name ?? user.email ?? "Usuário";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
          {initials}
        </div>
        <div>
          {(isKennel || isApprover) ? (
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-semibold text-brand-900">
                Painel do Criador
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white">
                <Gem className="w-2.5 h-2.5" />
                Criador
              </span>
            </div>
          ) : (
            <h1 className="font-display text-xl font-semibold text-brand-900">
              Olá, {displayName.split(" ")[0]}
            </h1>
          )}
          <p className="text-xs text-earth-500">{user.email}</p>
        </div>
      </div>

      {/* Mobile nav — fora do flex row para não esticar pela altura do content */}
      <div className="md:hidden overflow-x-auto pb-2 mb-4 flex gap-1.5">
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

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="hidden md:block w-52 shrink-0">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/painel" && pathname.startsWith(item.href));
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

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
