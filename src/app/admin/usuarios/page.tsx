"use client";

import Link from "next/link";
import { ShieldCheck, Wrench } from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import AccessDenied from "@/components/layout/AccessDenied";

export default function AdminUsuariosPage() {
  const { role, loading } = useRole();

  if (loading) return null;
  if (role !== "approver" && role !== "super_admin") return <AccessDenied />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-brand-900">Administração</h1>
          <p className="text-xs text-earth-500">Gestão de usuários</p>
        </div>
      </div>

      <div className="flex gap-1 mb-8 border-b border-earth-200 pb-0 -mb-px">
        {[
          { href: "/admin/aprovar", label: "Aprovações" },
          { href: "/admin/financeiro", label: "Financeiro" },
          { href: "/admin/usuarios", label: "Usuários" },
          { href: "/admin/mensagens", label: "Mensagens" },
          { href: "/admin/configuracoes", label: "Configurações" },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab.href === "/admin/usuarios"
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-earth-500 hover:text-earth-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-earth-100 flex items-center justify-center mb-4">
          <Wrench className="w-7 h-7 text-earth-400" />
        </div>
        <h2 className="font-display text-lg font-semibold text-earth-700 mb-2">
          Em desenvolvimento
        </h2>
        <p className="text-sm text-earth-400 max-w-xs leading-relaxed">
          A gestão de usuários estará disponível em breve. Use o SQL Editor do Supabase
          para operações manuais de role.
        </p>
      </div>
    </div>
  );
}
