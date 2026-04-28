"use client";

import { Wrench, Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import { useUser } from "@/lib/hooks/useUser";
import AccessDenied from "@/components/layout/AccessDenied";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminUsuariosPage() {
  const { user, loading: userLoading } = useUser();
  const { isAdmin, loading: roleLoading } = useRole();

  if (userLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AccessDenied message="A gestão de usuários é restrita a super administradores." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">Usuários</h1>
          <p className="text-sm text-earth-500">Gestão de usuários e roles da plataforma.</p>
        </div>
      </div>

      <AdminNav active="usuarios" />

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-earth-100 flex items-center justify-center mb-4">
          <Wrench className="w-7 h-7 text-earth-400" />
        </div>
        <h2 className="font-display text-lg font-semibold text-earth-700 mb-2">Em desenvolvimento</h2>
        <p className="text-sm text-earth-400 max-w-xs leading-relaxed">
          A gestão de usuários estará disponível em breve. Use o SQL Editor do Supabase
          para operações manuais de role.
        </p>
      </div>
    </div>
  );
}
