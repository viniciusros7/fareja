"use client";

import { useState } from "react";
import {
  ShieldCheck, CheckCircle2, XCircle, Clock, Eye,
  ChevronDown, ChevronUp, MapPin, Phone, Mail,
  Gem, Sparkles, Star, AlertTriangle, Search,
} from "lucide-react";

// Simulated pending kennels (in production these come from Supabase)
const pendingKennels = [
  {
    id: "pending-1",
    name: "Canil Patas Douradas",
    owner_name: "Ana Carolina Silva",
    owner_email: "ana@patasdouradas.com.br",
    city: "Campinas",
    state: "SP",
    phone: "(19) 99999-1234",
    breeds: ["Labrador Retriever", "Golden Retriever"],
    kc_registry: "CBKC #7823",
    kc_entity: "CBKC",
    years_active: 8,
    plan_requested: "premium" as const,
    description: "Criação familiar focada em Labradores e Goldens com testes de displasia e cardíacos em todos os reprodutores.",
    documents: ["Registro CBKC", "Laudos veterinários", "Fotos instalações (12)", "Testes DNA reprodutores"],
    submitted_at: "2026-04-03T10:00:00Z",
    status: "pending" as const,
  },
  {
    id: "pending-2",
    name: "Von Haus Braun",
    owner_name: "Marcos Oliveira",
    owner_email: "marcos@vonhausbraun.com.br",
    city: "Joinville",
    state: "SC",
    phone: "(47) 99999-5678",
    breeds: ["Rottweiler"],
    kc_registry: "CBKC #9102",
    kc_entity: "CBKC",
    years_active: 15,
    plan_requested: "basic" as const,
    description: "Criação seletiva de Rottweilers com foco em temperamento equilibrado e saúde. Todos os filhotes socializados desde o nascimento.",
    documents: ["Registro CBKC", "Laudos veterinários", "Fotos instalações (8)", "Certificados de exposição"],
    submitted_at: "2026-04-05T14:30:00Z",
    status: "pending" as const,
  },
];

const approvedKennels = [
  { id: "1", name: "Canil Good Leisure", city: "São Lourenço da Serra", state: "SP", plan: "super_premium" as const, status: "approved" as const, verified_at: "2026-01-15", breeds: ["Golden Retriever", "Beagle"] },
  { id: "2", name: "Canil Estrela do Sul", city: "São Paulo", state: "SP", plan: "basic" as const, status: "approved" as const, verified_at: "2026-02-01", breeds: ["Golden Retriever", "Labrador Retriever"] },
  { id: "3", name: "Von Falkenberg", city: "Curitiba", state: "PR", plan: "premium" as const, status: "approved" as const, verified_at: "2026-01-20", breeds: ["Pastor Alemão", "Malinois"] },
  { id: "4", name: "Canil Terra Dourada", city: "Belo Horizonte", state: "MG", plan: "basic" as const, status: "approved" as const, verified_at: "2026-02-10", breeds: ["Bulldog Francês", "Pug"] },
];

const planLabel: Record<string, { label: string; cls: string }> = {
  basic: { label: "Verificado", cls: "bg-earth-100 text-earth-600" },
  premium: { label: "Premium", cls: "bg-brand-600 text-white" },
  super_premium: { label: "Elite", cls: "bg-gradient-to-r from-brand-600 to-brand-500 text-white" },
};

const statusLabel: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pendente", cls: "bg-yellow-50 text-yellow-700" },
  approved: { label: "Aprovado", cls: "bg-forest-50 text-forest-600" },
  rejected: { label: "Rejeitado", cls: "bg-red-50 text-red-700" },
};

export default function AdminAprovarPage() {
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLog, setActionLog] = useState<string[]>([]);

  const handleApprove = (kennelName: string) => {
    setActionLog((prev) => [`✅ ${kennelName} aprovado em ${new Date().toLocaleString("pt-BR")}`, ...prev]);
  };

  const handleReject = (kennelName: string) => {
    setActionLog((prev) => [`❌ ${kennelName} rejeitado: "${rejectReason}" em ${new Date().toLocaleString("pt-BR")}`, ...prev]);
    setShowRejectModal(null);
    setRejectReason("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="text-2xl font-semibold text-yellow-700">{pendingKennels.length}</div>
          <div className="text-xs text-yellow-600">Pendentes</div>
        </div>
        <div className="p-4 rounded-xl bg-forest-50 border border-forest-200">
          <div className="text-2xl font-semibold text-forest-600">{approvedKennels.length}</div>
          <div className="text-xs text-forest-500">Aprovados</div>
        </div>
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
          <div className="text-2xl font-semibold text-brand-600">
            R$ {approvedKennels.reduce((acc, k) => acc + (k.plan === "super_premium" ? 350 : k.plan === "premium" ? 250 : 150), 0)}
          </div>
          <div className="text-xs text-brand-500">Receita mensal</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-earth-100 rounded-lg mb-5">
        <button
          onClick={() => setTab("pending")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
            tab === "pending" ? "bg-white text-earth-900 shadow-sm" : "text-earth-500"
          }`}
        >
          <Clock className="w-4 h-4" />
          Pendentes ({pendingKennels.length})
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
            tab === "approved" ? "bg-white text-earth-900 shadow-sm" : "text-earth-500"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Aprovados ({approvedKennels.length})
        </button>
      </div>

      {/* ── PENDING ── */}
      {tab === "pending" && (
        <div className="space-y-4">
          {pendingKennels.map((kennel) => {
            const expanded = expandedId === kennel.id;
            const pl = planLabel[kennel.plan_requested];

            return (
              <div key={kennel.id} className="rounded-xl border border-earth-200 bg-white overflow-hidden">
                {/* Summary row */}
                <button
                  onClick={() => setExpandedId(expanded ? null : kennel.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-earth-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-700 flex items-center justify-center font-semibold text-sm shrink-0">
                    {kennel.name.split(" ").slice(-1)[0]?.charAt(0) ?? "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-earth-900 truncate">{kennel.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${pl.cls}`}>{pl.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-50 text-yellow-700">Pendente</span>
                    </div>
                    <div className="text-xs text-earth-400 mt-0.5">
                      {kennel.city}, {kennel.state} · {kennel.years_active} anos · Enviado em {new Date(kennel.submitted_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {expanded ? <ChevronUp className="w-4 h-4 text-earth-400" /> : <ChevronDown className="w-4 h-4 text-earth-400" />}
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="px-4 pb-4 border-t border-earth-100 space-y-4">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Responsável</h4>
                        <div className="text-sm text-earth-700">{kennel.owner_name}</div>
                        <div className="flex items-center gap-1.5 text-xs text-earth-500 mt-1">
                          <Mail className="w-3 h-3" /> {kennel.owner_email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-earth-500 mt-0.5">
                          <Phone className="w-3 h-3" /> {kennel.phone}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Detalhes</h4>
                        <div className="text-xs text-earth-600 space-y-1">
                          <div>Registro: {kennel.kc_registry} ({kennel.kc_entity})</div>
                          <div>Raças: {kennel.breeds.join(", ")}</div>
                          <div>Plano solicitado: {pl.label}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Descrição</h4>
                      <p className="text-sm text-earth-600 leading-relaxed">{kennel.description}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-earth-400 uppercase mb-2">Documentos enviados</h4>
                      <div className="flex flex-wrap gap-2">
                        {kennel.documents.map((doc) => (
                          <span key={doc} className="px-3 py-1.5 rounded-lg bg-earth-50 text-xs text-earth-600 border border-earth-200">
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleApprove(kennel.name)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-forest-500 text-white text-sm font-semibold rounded-xl hover:bg-forest-600 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprovar canil
                      </button>
                      <button
                        onClick={() => setShowRejectModal(kennel.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </div>

                    {/* Reject modal */}
                    {showRejectModal === kennel.id && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                          <AlertTriangle className="w-4 h-4" />
                          Motivo da rejeição
                        </div>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Descreva o motivo (será enviado ao criador)..."
                          className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-300 placeholder:text-earth-300 resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(kennel.name)}
                            disabled={!rejectReason.trim()}
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

          {pendingKennels.length === 0 && (
            <div className="text-center py-12 text-earth-400 text-sm">
              Nenhum canil pendente de aprovação.
            </div>
          )}
        </div>
      )}

      {/* ── APPROVED ── */}
      {tab === "approved" && (
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

          {approvedKennels
            .filter((k) => !searchQuery || k.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((kennel) => {
              const pl = planLabel[kennel.plan];
              return (
                <div key={kennel.id} className="p-4 rounded-xl border border-earth-200 bg-white flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center font-semibold text-sm shrink-0">
                    {kennel.name.split(" ").filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-earth-900 truncate">{kennel.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${pl.cls}`}>{pl.label}</span>
                    </div>
                    <div className="text-xs text-earth-400 mt-0.5">
                      {kennel.city}, {kennel.state} · {kennel.breeds.join(", ")} · Verificado em {new Date(kennel.verified_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium text-earth-600 border border-earth-200 rounded-lg hover:bg-earth-50">
                    Gerenciar
                  </button>
                </div>
              );
            })}
        </div>
      )}

      {/* Action log */}
      {actionLog.length > 0 && (
        <div className="mt-8 p-4 rounded-xl bg-earth-50 border border-earth-200">
          <h4 className="text-xs font-semibold text-earth-500 mb-2">Log de ações</h4>
          <div className="space-y-1">
            {actionLog.map((log, i) => (
              <div key={i} className="text-xs text-earth-600">{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
