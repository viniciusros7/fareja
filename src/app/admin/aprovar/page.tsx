"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheck, CheckCircle2, XCircle, Clock, Eye,
  ChevronDown, ChevronUp, MapPin, Phone, Mail,
  Gem, Sparkles, AlertTriangle, Search,
  DollarSign, Users, Settings, MessageCircle, Loader2,
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import { useUser } from "@/lib/hooks/useUser";
import AccessDenied from "@/components/layout/AccessDenied";
import { createClient } from "@/lib/supabase/client";

async function adminFetch(url: string, body: Record<string, unknown>): Promise<{ error?: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? `Erro ${res.status}` };
  }
  return {};
}

interface PendingKennel {
  id: string;
  name: string;
  city: string;
  state: string;
  phone: string | null;
  breeds: string[] | null;
  kc_registry: string | null;
  kc_entity: string | null;
  years_active: number | null;
  plan: string;
  description: string | null;
  submitted_at: string;
  owner: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
}

interface ApprovedKennel {
  id: string;
  name: string;
  city: string;
  state: string;
  plan: string;
  verified_at: string | null;
  breeds: string[] | null;
}

const planLabel: Record<string, { label: string; cls: string }> = {
  basic: { label: "Verificado", cls: "bg-earth-100 text-earth-600" },
  premium: { label: "Premium", cls: "bg-brand-600 text-white" },
  super_premium: { label: "Elite", cls: "bg-gradient-to-r from-brand-600 to-brand-500 text-white" },
};

function AdminNav({ active }: { active: string }) {
  const { role } = useRole();

  const superAdminTabs = [
    { key: "aprovar", label: "Aprovar canis", href: "/admin/aprovar", icon: ShieldCheck },
    { key: "financeiro", label: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
    { key: "usuarios", label: "Usuários", href: "/admin/usuarios", icon: Users },
    { key: "configuracoes", label: "Configurações", href: "/admin/configuracoes", icon: Settings },
  ];

  const approverTabs = [
    { key: "aprovar", label: "Aprovar canis", href: "/admin/aprovar", icon: ShieldCheck },
    { key: "mensagens", label: "Mensagens", href: "/admin/mensagens", icon: MessageCircle },
  ];

  const tabs = role === "super_admin" ? superAdminTabs : approverTabs;

  return (
    <div className="flex gap-1 p-1 bg-earth-100 rounded-lg mb-6 overflow-x-auto">
      {tabs.map(({ key, label, href, icon: Icon }) => (
        <Link
          key={key}
          href={href}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
            active === key ? "bg-white text-earth-900 shadow-sm" : "text-earth-500 hover:text-earth-700"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}

export default function AdminAprovarPage() {
  const { user, loading: userLoading } = useUser();
  const { role, loading: roleLoading, isApprover } = useRole();
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pending, setPending] = useState<PendingKennel[]>([]);
  const [approved, setApproved] = useState<ApprovedKennel[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isApprover) return;
    const supabase = createClient();

    async function load() {
      setDataLoading(true);
      const [pendingRes, approvedRes] = await Promise.all([
        supabase
          .from("kennels")
          .select(`
            id, name, city, state, phone, breeds, kc_registry, kc_entity,
            years_active, plan, description, created_at,
            owner:profiles!owner_id(id, full_name, email)
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: true }),
        supabase
          .from("kennels")
          .select("id, name, city, state, plan, verified_at, breeds")
          .eq("status", "approved")
          .order("verified_at", { ascending: false }),
      ]);

      setPending(
        (pendingRes.data ?? []).map((k) => ({
          ...k,
          submitted_at: k.created_at,
          owner: Array.isArray(k.owner) ? k.owner[0] ?? null : k.owner,
        }))
      );
      setApproved(approvedRes.data ?? []);
      setDataLoading(false);
    }

    load();
  }, [user, isApprover]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  async function handleApprove(kennel: PendingKennel) {
    setActionLoading(kennel.id);
    const { error } = await adminFetch("/api/admin/approve", {
      kennel_id: kennel.id,
      owner_id: kennel.owner?.id ?? null,
    });

    if (error) {
      showToast(`Erro ao aprovar: ${error}`);
      setActionLoading(null);
      return;
    }

    setPending((prev) => prev.filter((k) => k.id !== kennel.id));
    showToast(`✅ ${kennel.name} aprovado com sucesso.`);
    setExpandedId(null);
    setActionLoading(null);
  }

  async function handleReject(kennel: PendingKennel) {
    if (!rejectReason.trim()) return;
    setActionLoading(kennel.id);
    const { error } = await adminFetch("/api/admin/reject", {
      kennel_id: kennel.id,
      reason: rejectReason.trim(),
    });

    if (error) {
      showToast(`Erro ao rejeitar: ${error}`);
      setActionLoading(null);
      return;
    }

    setPending((prev) => prev.filter((k) => k.id !== kennel.id));
    showToast(`❌ ${kennel.name} rejeitado.`);
    setShowRejectModal(null);
    setRejectReason("");
    setExpandedId(null);
    setActionLoading(null);
  }

  if (userLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!user || !isApprover) {
    return <AccessDenied message="Esta área é restrita a aprovadores e administradores." />;
  }

  const filteredApproved = approved.filter(
    (k) => !searchQuery || k.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-earth-900 text-white text-sm font-medium shadow-xl">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">
            Painel administrativo
          </h1>
          <p className="text-sm text-earth-500">Gerencie cadastros de canis e aprovações.</p>
        </div>
      </div>

      <AdminNav active="aprovar" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="text-2xl font-semibold text-yellow-700">
            {dataLoading ? "—" : pending.length}
          </div>
          <div className="text-xs text-yellow-600">Pendentes de aprovação</div>
        </div>
        <div className="p-4 rounded-xl bg-forest-50 border border-forest-200">
          <div className="text-2xl font-semibold text-forest-600">
            {dataLoading ? "—" : approved.length}
          </div>
          <div className="text-xs text-forest-500">Canis aprovados</div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-earth-100 rounded-lg mb-5">
        <button
          onClick={() => setTab("pending")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
            tab === "pending" ? "bg-white text-earth-900 shadow-sm" : "text-earth-500"
          }`}
        >
          <Clock className="w-4 h-4" />
          Pendentes ({dataLoading ? "…" : pending.length})
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
            tab === "approved" ? "bg-white text-earth-900 shadow-sm" : "text-earth-500"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Aprovados ({dataLoading ? "…" : approved.length})
        </button>
      </div>

      {dataLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
        </div>
      )}

      {/* ── PENDING ── */}
      {!dataLoading && tab === "pending" && (
        <div className="space-y-4">
          {pending.map((kennel) => {
            const expanded = expandedId === kennel.id;
            const pl = planLabel[kennel.plan] ?? planLabel.basic;
            const isActing = actionLoading === kennel.id;

            return (
              <div key={kennel.id} className="rounded-xl border border-earth-200 bg-white overflow-hidden">
                <button
                  onClick={() => setExpandedId(expanded ? null : kennel.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-earth-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-700 flex items-center justify-center font-semibold text-sm shrink-0">
                    {kennel.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-earth-900 truncate">{kennel.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${pl.cls}`}>{pl.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-50 text-yellow-700">Pendente</span>
                    </div>
                    <div className="text-xs text-earth-400 mt-0.5">
                      {kennel.city}, {kennel.state} · Enviado em {new Date(kennel.submitted_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {expanded ? <ChevronUp className="w-4 h-4 text-earth-400" /> : <ChevronDown className="w-4 h-4 text-earth-400" />}
                </button>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-earth-100 space-y-4">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Responsável</h4>
                        <div className="text-sm text-earth-700">{kennel.owner?.full_name ?? "—"}</div>
                        {kennel.owner?.email && (
                          <div className="flex items-center gap-1.5 text-xs text-earth-500 mt-1">
                            <Mail className="w-3 h-3" /> {kennel.owner.email}
                          </div>
                        )}
                        {kennel.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-earth-500 mt-0.5">
                            <Phone className="w-3 h-3" /> {kennel.phone}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Detalhes</h4>
                        <div className="text-xs text-earth-600 space-y-1">
                          {kennel.kc_registry && (
                            <div>Registro: {kennel.kc_registry}{kennel.kc_entity ? ` (${kennel.kc_entity})` : ""}</div>
                          )}
                          {kennel.breeds && kennel.breeds.length > 0 && (
                            <div>Raças: {kennel.breeds.join(", ")}</div>
                          )}
                          {kennel.years_active && (
                            <div>{kennel.years_active} anos de atividade</div>
                          )}
                          <div>Plano solicitado: {pl.label}</div>
                        </div>
                      </div>
                    </div>

                    {kennel.description && (
                      <div>
                        <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Descrição</h4>
                        <p className="text-sm text-earth-600 leading-relaxed">{kennel.description}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleApprove(kennel)}
                        disabled={isActing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-forest-500 text-white text-sm font-semibold rounded-xl hover:bg-forest-600 transition-colors disabled:opacity-60"
                      >
                        {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Aprovar canil
                      </button>
                      <button
                        onClick={() => setShowRejectModal(kennel.id)}
                        disabled={isActing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </div>

                    {showRejectModal === kennel.id && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                          <AlertTriangle className="w-4 h-4" />
                          Motivo da rejeição
                        </div>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Descreva o motivo (será registrado)..."
                          className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-300 placeholder:text-earth-300 resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(kennel)}
                            disabled={!rejectReason.trim() || isActing}
                            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            Confirmar rejeição
                          </button>
                          <button
                            onClick={() => { setShowRejectModal(null); setRejectReason(""); }}
                            className="px-4 py-2 bg-white border border-earth-200 text-earth-600 text-xs font-semibold rounded-lg"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {pending.length === 0 && (
            <div className="text-center py-12 text-earth-400 text-sm">
              Nenhum canil pendente de aprovação.
            </div>
          )}
        </div>
      )}

      {/* ── APPROVED ── */}
      {!dataLoading && tab === "approved" && (
        <div className="space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Buscar canil aprovado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>

          {filteredApproved.map((kennel) => {
            const pl = planLabel[kennel.plan] ?? planLabel.basic;
            return (
              <div key={kennel.id} className="p-4 rounded-xl border border-earth-200 bg-white flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center font-semibold text-sm shrink-0">
                  {kennel.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-earth-900 truncate">{kennel.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${pl.cls}`}>{pl.label}</span>
                  </div>
                  <div className="text-xs text-earth-400 mt-0.5">
                    {kennel.city}, {kennel.state}
                    {kennel.breeds && kennel.breeds.length > 0 && ` · ${kennel.breeds.join(", ")}`}
                    {kennel.verified_at && ` · Verificado em ${new Date(kennel.verified_at).toLocaleDateString("pt-BR")}`}
                  </div>
                </div>
                <Link
                  href={`/canis/${kennel.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-earth-600 border border-earth-200 rounded-lg hover:bg-earth-50"
                >
                  Ver perfil
                </Link>
              </div>
            );
          })}

          {filteredApproved.length === 0 && (
            <div className="text-center py-12 text-earth-400 text-sm">
              {searchQuery ? "Nenhum resultado para a busca." : "Nenhum canil aprovado ainda."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
