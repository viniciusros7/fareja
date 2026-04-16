"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheck, DollarSign, Users, Settings,
  MessageCircle, ClipboardList,
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";

export function AdminNav({ active }: { active: string }) {
  const { role } = useRole();
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/candidaturas/count")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setPendingCount(data.count); });
  }, []);

  const superAdminTabs = [
    { key: "aprovar", label: "Aprovar canis", href: "/admin/aprovar", icon: ShieldCheck },
    { key: "candidaturas", label: "Candidaturas", href: "/admin/candidaturas", icon: ClipboardList, badge: pendingCount },
    { key: "financeiro", label: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
    { key: "usuarios", label: "Usuários", href: "/admin/usuarios", icon: Users },
    { key: "configuracoes", label: "Configurações", href: "/admin/configuracoes", icon: Settings },
  ];

  const approverTabs = [
    { key: "aprovar", label: "Aprovar canis", href: "/admin/aprovar", icon: ShieldCheck },
    { key: "candidaturas", label: "Candidaturas", href: "/admin/candidaturas", icon: ClipboardList, badge: pendingCount },
    { key: "mensagens", label: "Mensagens", href: "/admin/mensagens", icon: MessageCircle },
  ];

  const tabs = role === "super_admin" ? superAdminTabs : approverTabs;

  return (
    <div className="flex gap-1 p-1 bg-earth-100 rounded-lg mb-6 overflow-x-auto">
      {tabs.map(({ key, label, href, icon: Icon, badge }) => (
        <Link
          key={key}
          href={href}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
            active === key
              ? "bg-white text-earth-900 shadow-sm"
              : "text-earth-500 hover:text-earth-700"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
          {badge != null && badge > 0 && (
            <span className="inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-brand-600 text-white text-[10px] font-semibold">
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
