"use client";

import Link from "next/link";
import { Loader2, PawPrint, Lock } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";
import type { UserRole } from "@/types";

interface AuthGateProps {
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
  loginMessage?: string;
  loginDescription?: string;
}

export default function AuthGate({
  requiredRoles,
  fallback,
  children,
  loginMessage = "Faça login para continuar",
  loginDescription,
}: AuthGateProps) {
  const { user, loading: userLoading } = useUser();
  const { role, loading: roleLoading } = useRole();

  const loading = userLoading || (!!user && !!requiredRoles && roleLoading);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!user) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-4">
          <PawPrint className="w-7 h-7 text-brand-600" />
        </div>
        <h2 className="font-display text-xl font-semibold text-earth-900 mb-2 max-w-xs mx-auto">
          {loginMessage}
        </h2>
        {loginDescription && (
          <p className="text-sm text-earth-500 max-w-sm mx-auto mb-5 leading-relaxed">
            {loginDescription}
          </p>
        )}
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

  if (requiredRoles && role && !requiredRoles.includes(role)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-earth-100 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-earth-400" />
        </div>
        <h2 className="font-display text-xl font-semibold text-earth-900 mb-2">
          Acesso restrito
        </h2>
        <p className="text-sm text-earth-500 max-w-sm mx-auto mb-5 leading-relaxed">
          Esta área é exclusiva para criadores verificados do Fareja.
        </p>
        <Link
          href="/para-criadores/cadastro"
          className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          Quero cadastrar meu canil
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
