"use client";

import Link from "next/link";
import {
  DollarSign, TrendingUp, ShieldCheck, Users, Settings,
  MessageCircle, Gem, Star, ArrowUpRight, Loader2,
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import { useUser } from "@/lib/hooks/useUser";
import AccessDenied from "@/components/layout/AccessDenied";

const monthlyRevenue = [
  { month: "Nov", value: 750 },
  { month: "Dez", value: 900 },
  { month: "Jan", value: 900 },
  { month: "Fev", value: 1050 },
  { month: "Mar", value: 1050 },
  { month: "Abr", value: 1100 },
];

const payments = [
  { id: "pay-1", kennel: "Canil Good Leisure", plan: "super_premium", amount: 350, date: "2026-04-01", status: "paid" },
  { id: "pay-2", kennel: "Von Falkenberg", plan: "premium", amount: 250, date: "2026-04-01", status: "paid" },
  { id: "pay-3", kennel: "Canil Estrela do Sul", plan: "basic", amount: 150, date: "2026-04-01", status: "paid" },
  { id: "pay-4", kennel: "Canil Terra Dourada", plan: "basic", amount: 150, date: "2026-04-01", status: "paid" },
  { id: "pay-5", kennel: "Canil Patas Douradas", plan: "premium", amount: 250, date: "2026-03-01", status: "paid" },
  { id: "pay-6", kennel: "Von Haus Braun", plan: "basic", amount: 150, date: "2026-03-01", status: "overdue" },
];

const planLabel: Record<string, { label: string; cls: string }> = {
  basic: { label: "Verificado", cls: "bg-earth-100 text-earth-700" },
  premium: { label: "Premium", cls: "bg-brand-100 text-brand-700" },
  super_premium: { label: "Elite", cls: "bg-gradient-to-r from-brand-600 to-brand-500 text-white" },
};

const statusLabel: Record<string, { label: string; cls: string }> = {
  paid: { label: "Pago", cls: "bg-forest-50 text-forest-600" },
  overdue: { label: "Atrasado", cls: "bg-red-50 text-red-600" },
  pending: { label: "Pendente", cls: "bg-yellow-50 text-yellow-700" },
};

const maxValue = Math.max(...monthlyRevenue.map((m) => m.value));

function AdminNav() {
  const tabs = [
    { key: "aprovar", label: "Aprovar canis", href: "/admin/aprovar", icon: ShieldCheck },
    { key: "financeiro", label: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
    { key: "usuarios", label: "Usuários", href: "/admin/usuarios", icon: Users },
    { key: "configuracoes", label: "Configurações", href: "/admin/configuracoes", icon: Settings },
  ];

  return (
    <div className="flex gap-1 p-1 bg-earth-100 rounded-lg mb-6 overflow-x-auto">
      {tabs.map(({ key, label, href, icon: Icon }) => (
        <Link
          key={key}
          href={href}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
            key === "financeiro" ? "bg-white text-earth-900 shadow-sm" : "text-earth-500 hover:text-earth-700"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}

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

  const currentMonthTotal = payments
    .filter((p) => p.date.startsWith("2026-04") && p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);

  const basicCount = payments.filter((p) => p.plan === "basic" && p.status === "paid").length;
  const premiumCount = payments.filter((p) => p.plan === "premium" && p.status === "paid").length;
  const eliteCount = payments.filter((p) => p.plan === "super_premium" && p.status === "paid").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">
            Financeiro
          </h1>
          <p className="text-sm text-earth-500">Receitas, planos e pagamentos da plataforma.</p>
        </div>
      </div>

      {/* Admin nav tabs */}
      <AdminNav />

      {/* Revenue cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 col-span-2 sm:col-span-1">
          <div className="text-xs text-brand-500 mb-1">Receita em abril</div>
          <div className="text-2xl font-semibold text-brand-700">R$ {currentMonthTotal}</div>
          <div className="flex items-center gap-1 text-xs text-forest-500 mt-1">
            <TrendingUp className="w-3 h-3" />
            +5% vs março
          </div>
        </div>
        <div className="p-4 rounded-xl bg-earth-50 border border-earth-200">
          <div className="text-xs text-earth-500 mb-1">Verificado</div>
          <div className="text-xl font-semibold text-earth-700">{basicCount}x</div>
          <div className="text-xs text-earth-400 mt-1">R$ 150/mês</div>
        </div>
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
          <div className="text-xs text-brand-500 mb-1">Premium</div>
          <div className="text-xl font-semibold text-brand-700">{premiumCount}x</div>
          <div className="text-xs text-brand-400 mt-1">R$ 250/mês</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200">
          <div className="text-xs text-brand-600 mb-1">Elite</div>
          <div className="text-xl font-semibold text-brand-700">{eliteCount}x</div>
          <div className="text-xs text-brand-400 mt-1">R$ 350/mês</div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 rounded-xl border border-earth-200 bg-white mb-6">
        <h3 className="text-sm font-semibold text-earth-700 mb-4">Receita mensal (últimos 6 meses)</h3>
        <div className="flex items-end gap-3 h-32">
          {monthlyRevenue.map((item) => {
            const heightPct = Math.round((item.value / maxValue) * 100);
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-earth-500 font-medium">R${item.value}</span>
                <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                  <div
                    className="w-full rounded-t-md bg-brand-400 hover:bg-brand-600 transition-colors"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-earth-400">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payments list */}
      <div className="rounded-xl border border-earth-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-earth-100">
          <h3 className="text-sm font-semibold text-earth-700">Histórico de pagamentos</h3>
        </div>
        <div className="divide-y divide-earth-100">
          {payments.map((pay) => {
            const pl = planLabel[pay.plan];
            const sl = statusLabel[pay.status];
            return (
              <div key={pay.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-earth-800 truncate">{pay.kennel}</div>
                  <div className="text-xs text-earth-400 mt-0.5">
                    {new Date(pay.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${pl.cls}`}>
                  {pl.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sl.cls}`}>
                  {sl.label}
                </span>
                <span className="text-sm font-semibold text-earth-800 w-16 text-right">
                  R$ {pay.amount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
