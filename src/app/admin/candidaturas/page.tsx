"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList, CheckCircle2, XCircle, Clock,
  Mail, Phone, MapPin, Loader2, AlertTriangle,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";
import { createClient } from "@/lib/supabase/client";
import { AdminNav } from "@/components/admin/AdminNav";
import AccessDenied from "@/components/layout/AccessDenied";

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  kennel_name: string;
  breed: string;
  experience_years: number;
  has_cbkc: boolean;
  has_health_tests: boolean;
  has_contract: boolean;
  litter_size: number;
  score: number;
  suggested_plan: string;
  status: "pending" | "approved" | "rejected";
  reject_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const PLAN_LABELS: Record<string, { label: string; cls: string }> = {
  verificado: { label: "Verificado", cls: "bg-earth-100 text-earth-700" },
  premium: { label: "Premium", cls: "bg-brand-600 text-white" },
  elite: { label: "Elite", cls: "bg-amber-500 text-white" },
};

type FilterStatus = "pending" | "approved" | "rejected";

export default function AdminCandidaturasPage() {
  const { user, loading: userLoading } = useUser();
  const { isApprover, loading: roleLoading } = useRole();
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [apps, setApps] = useState<Application[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isApprover) return;
    const supabase = createClient();
    setDataLoading(true);
    supabase
      .from("kennel_applications")
      .select("*")
      .eq("status", filter)
      .order("created_at", { ascending: filter === "pending" })
      .then(({ data }) => {
        setApps((data ?? []) as Application[]);
        setDataLoading(false);
      });
  }, [user, isApprover, filter]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  async function handleAction(id: string, action: "approve" | "reject", reason?: string) {
    setActionLoading(id);
    const res = await fetch(`/api/admin/candidaturas/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(`Erro: ${data.error}`);
      setActionLoading(null);
      return;
    }
    setApps((prev) => prev.filter((a) => a.id !== id));
    setExpandedId(null);
    setShowRejectModal(null);
    setRejectReason("");
    showToast(action === "approve" ? "✅ Candidatura aprovada." : "❌ Candidatura rejeitada.");
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

  const FILTER_LABELS: Record<FilterStatus, string> = {
    pending: "Pendentes",
    approved: "Aprovadas",
    rejected: "Rejeitadas",
  };

  const FILTER_ICONS = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-earth-900 text-white text-sm font-medium shadow-xl">
          {toastMessage}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">Candidaturas</h1>
          <p className="text-sm text-earth-500">Criadores que desejam ingressar na plataforma.</p>
        </div>
      </div>

      <AdminNav active="candidaturas" />

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-earth-100 rounded-lg mb-5">
        {(["pending", "approved", "rejected"] as const).map((s) => {
          const Icon = FILTER_ICONS[s];
          return (
            <button
              key={s}
              onClick={() => { setFilter(s); setExpandedId(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
                filter === s ? "bg-white text-earth-900 shadow-sm" : "text-earth-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              {FILTER_LABELS[s]}
              {s === "pending" && !dataLoading && filter !== "pending" && apps.length > 0 && null}
            </button>
          );
        })}
      </div>

      {dataLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-12 text-earth-400 text-sm">
          Nenhuma candidatura {filter === "pending" ? "pendente" : filter === "approved" ? "aprovada" : "rejeitada"}.
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const expanded = expandedId === app.id;
            const pl = PLAN_LABELS[app.suggested_plan] ?? PLAN_LABELS.verificado;
            const isActing = actionLoading === app.id;

            return (
              <div key={app.id} className="rounded-xl border border-earth-200 bg-white overflow-hidden">
                <button
                  onClick={() => setExpandedId(expanded ? null : app.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-earth-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-semibold text-sm shrink-0">
                    {app.kennel_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-earth-900">{app.kennel_name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${pl.cls}`}>
                        {pl.label}
                      </span>
                      <span className="text-[10px] text-earth-400 font-medium">{app.score} pts</span>
                    </div>
                    <div className="text-xs text-earth-400 mt-0.5">
                      {app.full_name} · {app.city}, {app.state} · {app.breed} ·{" "}
                      {new Date(app.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-earth-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-earth-400 shrink-0" />
                  )}
                </button>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-earth-100 space-y-4">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Contato</h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-earth-600">
                            <Mail className="w-3.5 h-3.5 text-earth-400 shrink-0" />
                            {app.email}
                          </div>
                          {app.phone && (
                            <div className="flex items-center gap-2 text-xs text-earth-600">
                              <Phone className="w-3.5 h-3.5 text-earth-400 shrink-0" />
                              {app.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-earth-600">
                            <MapPin className="w-3.5 h-3.5 text-earth-400 shrink-0" />
                            {app.city}, {app.state}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Qualificações</h4>
                        <div className="space-y-1 text-xs">
                          <div className={app.has_cbkc ? "text-forest-600" : "text-earth-400"}>
                            {app.has_cbkc ? "✓" : "✗"} Registro CBKC/SOBRACI
                          </div>
                          <div className={app.has_health_tests ? "text-forest-600" : "text-earth-400"}>
                            {app.has_health_tests ? "✓" : "✗"} Testes de saúde
                          </div>
                          <div className={app.has_contract ? "text-forest-600" : "text-earth-400"}>
                            {app.has_contract ? "✓" : "✗"} Contrato de venda
                          </div>
                          <div className="text-earth-600">
                            {app.experience_years} {app.experience_years === 1 ? "ano" : "anos"} de experiência
                          </div>
                          <div className="text-earth-600">{app.litter_size} filhotes/ano</div>
                        </div>
                      </div>
                    </div>

                    {app.reject_reason && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                        <strong>Motivo da rejeição:</strong> {app.reject_reason}
                      </div>
                    )}

                    {filter === "pending" && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleAction(app.id, "approve")}
                          disabled={isActing}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-forest-500 text-white text-sm font-semibold rounded-xl hover:bg-forest-600 transition-colors disabled:opacity-60"
                        >
                          {isActing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Aprovar
                        </button>
                        <button
                          onClick={() => setShowRejectModal(app.id)}
                          disabled={isActing}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
                        >
                          <XCircle className="w-4 h-4" />
                          Rejeitar
                        </button>
                      </div>
                    )}

                    {showRejectModal === app.id && (
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
                            onClick={() => handleAction(app.id, "reject", rejectReason)}
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
        </div>
      )}
    </div>
  );
}
