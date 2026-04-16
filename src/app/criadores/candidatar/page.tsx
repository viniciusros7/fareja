"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight, ChevronLeft, CheckCircle2, Loader2, PawPrint,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";

const STATES = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
  "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
  "RO","RR","RS","SC","SE","SP","TO",
];

const DRAFT_KEY = "fareja_candidatura_draft";

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  kennel_name: string;
  breed: string;
  experience_years: number;
  has_cbkc: boolean;
  has_health_tests: boolean;
  has_contract: boolean;
  litter_size: number;
}

const EMPTY: FormData = {
  full_name: "", email: "", phone: "", city: "", state: "SP",
  kennel_name: "", breed: "", experience_years: 0,
  has_cbkc: false, has_health_tests: false, has_contract: false, litter_size: 0,
};

function calcScore(d: FormData): number {
  let s = 0;
  if (d.has_cbkc) s += 30;
  if (d.has_health_tests) s += 25;
  if (d.has_contract) s += 15;
  if (d.experience_years >= 5) s += 20;
  else if (d.experience_years >= 2) s += 10;
  else if (d.experience_years >= 1) s += 5;
  if (d.litter_size >= 10) s += 10;
  else if (d.litter_size >= 5) s += 5;
  return s;
}

function planFromScore(s: number): "verificado" | "premium" | "elite" {
  if (s >= 71) return "elite";
  if (s >= 41) return "premium";
  return "verificado";
}

const PLAN_INFO = {
  verificado: {
    label: "Canil Verificado",
    colorClass: "bg-earth-100 text-earth-700 border-earth-200",
    desc: "Presença completa com selo de verificação.",
  },
  premium: {
    label: "Canil Premium",
    colorClass: "bg-brand-100 text-brand-700 border-brand-200",
    desc: "Mais visibilidade e ferramentas para crescer.",
  },
  elite: {
    label: "Canil Elite",
    colorClass: "bg-amber-100 text-amber-700 border-amber-200",
    desc: "O máximo em visibilidade e engajamento.",
  },
} as const;

const STEPS = ["Você", "Seu canil", "Qualificações", "Revisão"];

export default function CandidatarPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      full_name: prev.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch {}
  }, [form]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed(): boolean {
    if (step === 0) return !!(form.full_name.trim() && form.email.trim() && form.city.trim() && form.state);
    if (step === 1) return !!(form.kennel_name.trim() && form.breed.trim());
    return true;
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/criadores/candidatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar candidatura.");
        setSubmitting(false);
        return;
      }
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      router.push(`/criadores/candidatar/obrigado?plano=${data.suggested_plan}&score=${data.score}`);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setSubmitting(false);
    }
  }

  if (loading) {
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
          Faça login para continuar
        </h2>
        <p className="text-sm text-earth-500 mb-5">
          Você precisa estar logado para enviar uma candidatura.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          Entrar
        </Link>
      </div>
    );
  }

  const score = calcScore(form);
  const plan = planFromScore(score);
  const planInfo = PLAN_INFO[plan];

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300";

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-2">
        <Link href="/para-criadores" className="text-xs text-earth-400 hover:text-brand-600 transition-colors">
          ← Para criadores
        </Link>
      </div>
      <h1 className="font-display text-2xl font-semibold text-earth-900 mb-6">
        Candidatura de criador
      </h1>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-earth-500">
            Etapa {step + 1} de {STEPS.length}
          </span>
          <span className="text-xs font-medium text-brand-600">{STEPS[step]}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-brand-600" : "bg-earth-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-earth-200 p-6 shadow-sm">
        {/* Step 0: Dados pessoais */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-earth-900">Sobre você</h2>
              <p className="text-sm text-earth-500 mt-1">Informações de contato do responsável pelo canil.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Nome completo *</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="Seu nome completo"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="seu@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Telefone / WhatsApp</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(11) 99999-9999"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-earth-600 mb-1.5">Cidade *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="São Paulo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-earth-600 mb-1.5">Estado *</label>
                <select
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400"
                >
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Dados do canil */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-earth-900">Seu canil</h2>
              <p className="text-sm text-earth-500 mt-1">Informações sobre seu trabalho como criador.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Nome do canil *</label>
              <input
                type="text"
                value={form.kennel_name}
                onChange={(e) => set("kennel_name", e.target.value)}
                placeholder="Ex: Canil Terra Firme"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Raça principal *</label>
              <input
                type="text"
                value={form.breed}
                onChange={(e) => set("breed", e.target.value)}
                placeholder="Ex: Golden Retriever"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">
                Anos de experiência como criador
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={form.experience_years}
                onChange={(e) => set("experience_years", Math.max(0, parseInt(e.target.value) || 0))}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Step 2: Qualificações */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-earth-900">Qualificações</h2>
              <p className="text-sm text-earth-500 mt-1">Quanto mais qualificações, maior o plano sugerido.</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-earth-200 cursor-pointer hover:bg-earth-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.has_cbkc}
                  onChange={(e) => set("has_cbkc", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#B85C2F]"
                />
                <div>
                  <span className="text-sm font-medium text-earth-800">Registro CBKC / SOBRACI</span>
                  <p className="text-xs text-earth-500 mt-0.5">
                    Meus reprodutores têm registro em entidade oficial reconhecida. (+30 pts)
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-earth-200 cursor-pointer hover:bg-earth-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.has_health_tests}
                  onChange={(e) => set("has_health_tests", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#B85C2F]"
                />
                <div>
                  <span className="text-sm font-medium text-earth-800">Testes de saúde e genéticos</span>
                  <p className="text-xs text-earth-500 mt-0.5">
                    Realizo exames de displasia, OFA, teste genético ou equivalentes. (+25 pts)
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-earth-200 cursor-pointer hover:bg-earth-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.has_contract}
                  onChange={(e) => set("has_contract", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#B85C2F]"
                />
                <div>
                  <span className="text-sm font-medium text-earth-800">Contrato de venda</span>
                  <p className="text-xs text-earth-500 mt-0.5">
                    Todos os filhotes saem com contrato formal garantindo procedência. (+15 pts)
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">
                Filhotes produzidos por ano (estimativa)
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={form.litter_size}
                onChange={(e) => set("litter_size", Math.max(0, parseInt(e.target.value) || 0))}
                className={inputClass}
              />
              <p className="text-[11px] text-earth-400 mt-1">≥5 filhotes: +5 pts · ≥10 filhotes: +10 pts</p>
            </div>

            {/* Live score preview */}
            <div className={`p-4 rounded-xl border ${planInfo.colorClass} flex items-center justify-between`}>
              <div>
                <div className="text-xs font-medium opacity-70">Plano sugerido</div>
                <div className="font-display text-lg font-semibold">{planInfo.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{planInfo.desc}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-semibold">{score}</div>
                <div className="text-xs opacity-70">pontos</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Revisão */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-earth-900">Revisar candidatura</h2>
              <p className="text-sm text-earth-500 mt-1">Confira os dados antes de enviar.</p>
            </div>

            <div className="p-4 rounded-xl bg-earth-50 border border-earth-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-500">Nome</span>
                <span className="font-medium text-earth-800">{form.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Email</span>
                <span className="font-medium text-earth-800">{form.email}</span>
              </div>
              {form.phone && (
                <div className="flex justify-between">
                  <span className="text-earth-500">Telefone</span>
                  <span className="font-medium text-earth-800">{form.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-earth-500">Localização</span>
                <span className="font-medium text-earth-800">{form.city}, {form.state}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-earth-50 border border-earth-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-500">Canil</span>
                <span className="font-medium text-earth-800">{form.kennel_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Raça</span>
                <span className="font-medium text-earth-800">{form.breed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Experiência</span>
                <span className="font-medium text-earth-800">
                  {form.experience_years} {form.experience_years === 1 ? "ano" : "anos"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-earth-50 border border-earth-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-500">CBKC/SOBRACI</span>
                <span className={`font-medium ${form.has_cbkc ? "text-forest-600" : "text-earth-400"}`}>
                  {form.has_cbkc ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Testes de saúde</span>
                <span className={`font-medium ${form.has_health_tests ? "text-forest-600" : "text-earth-400"}`}>
                  {form.has_health_tests ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Contrato de venda</span>
                <span className={`font-medium ${form.has_contract ? "text-forest-600" : "text-earth-400"}`}>
                  {form.has_contract ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Filhotes/ano</span>
                <span className="font-medium text-earth-800">{form.litter_size}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${planInfo.colorClass} flex items-center justify-between`}>
              <div>
                <div className="text-xs font-medium opacity-70">Plano sugerido</div>
                <div className="font-display text-lg font-semibold">{planInfo.label}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-semibold">{score}</div>
                <div className="text-xs opacity-70">pontos</div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className={`flex gap-3 mt-6 ${step > 0 ? "justify-between" : "justify-end"}`}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-earth-600 border border-earth-200 rounded-xl hover:bg-earth-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {submitting ? "Enviando..." : "Enviar candidatura"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
