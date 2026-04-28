"use client";

import {
  DollarSign, Loader2, Construction,
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import { useUser } from "@/lib/hooks/useUser";
import AccessDenied from "@/components/layout/AccessDenied";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminFinanceiroPage() {
  const { user, loading: userLoading } = useUser();
  const { loading: roleLoading, isAdmin } = useRole();

  if (userLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AccessDenied message="A área financeira é restrita a super administradores." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">Financeiro</h1>
          <p className="text-sm text-earth-500">Receitas, planos e pagamentos da plataforma.</p>
        </div>
      </div>

      <AdminNav active="financeiro" />

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-earth-100 flex items-center justify-center mb-4">
          <Construction className="w-7 h-7 text-earth-400" />
        </div>
        <h2 className="font-display text-lg font-semibold text-earth-700 mb-2">Em desenvolvimento</h2>
        <p className="text-sm text-earth-400 max-w-sm leading-relaxed">
          O módulo financeiro estará disponível em breve. Aqui você poderá visualizar receitas,
          planos ativos e histórico de pagamentos.
        </p>
      </div>
    </div>
  );
}
