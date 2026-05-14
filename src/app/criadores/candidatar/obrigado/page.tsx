"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, PawPrint, Loader2 } from "lucide-react";

const PLANS = [
  {
    id: "verificado",
    name: "Canil Verificado",
    price: "R$ 150",
    borderClass: "border-earth-200",
    badgeClass: "bg-earth-100 text-earth-700",
    features: [
      "Selo Verificado Fareja",
      "Perfil completo com fotos",
      "Cadastro de reprodutores e filhotes",
      "1 foto ou vídeo por dia no feed",
    ],
  },
  {
    id: "premium",
    name: "Canil Premium",
    price: "R$ 250",
    borderClass: "border-brand-400",
    badgeClass: "bg-brand-600 text-white",
    features: [
      "Tudo do plano Verificado",
      "Destaque nas pesquisas",
      "5 fotos ou vídeos por dia",
      "Relatório mensal de visitas",
    ],
  },
  {
    id: "elite",
    name: "Canil Elite",
    price: "R$ 350",
    borderClass: "border-amber-400",
    badgeClass: "bg-amber-500 text-white",
    features: [
      "Tudo do plano Premium",
      "Super destaque nas buscas (topo)",
      "Fotos e vídeos ilimitados",
      "Suporte prioritário por WhatsApp",
    ],
  },
] as const;

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const plano = searchParams.get("plano") ?? "verificado";
  const score = parseInt(searchParams.get("score") ?? "0");
  const planData = PLANS.find((p) => p.id === plano) ?? PLANS[0];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Success */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-500 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-earth-900 mb-2">
          Candidatura recebida!
        </h1>
        <p className="text-sm text-earth-500 max-w-sm mx-auto leading-relaxed">
          A equipe Fareja vai revisar sua candidatura e entrar em contato em até 5 dias úteis.
        </p>
      </div>

      {/* Score + suggested plan */}
      <div className="mb-8 p-5 rounded-2xl bg-brand-50 border-2 border-brand-200 text-center">
        <div className="text-xs font-medium text-brand-600 mb-1">Sua pontuação</div>
        <div className="font-display text-4xl font-semibold text-brand-700 mb-3">{score} pts</div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600 text-white text-sm font-semibold">
          <PawPrint className="w-4 h-4" />
          Plano sugerido: {planData.name}
        </div>
        <p className="text-xs text-brand-600/70 mt-3 leading-relaxed">
          O plano final é definido após a análise documental da equipe Fareja.
        </p>
      </div>

      {/* Plans comparison */}
      <h2 className="font-display text-lg font-semibold text-earth-900 mb-4 text-center">
        Comparativo de planos
      </h2>

      <div className="space-y-3 mb-8">
        {PLANS.map((p) => {
          const isSelected = p.id === plano;
          return (
            <div
              key={p.id}
              className={`p-4 rounded-xl border-2 ${
                isSelected ? p.borderClass : "border-earth-100"
              } ${isSelected ? "bg-white shadow-sm" : "bg-earth-50/50"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.badgeClass}`}>
                    {p.name}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-brand-600 font-medium">← sugerido para você</span>
                  )}
                </div>
                <span className="text-sm font-semibold text-earth-700">{p.price}/mês</span>
              </div>
              <ul className="space-y-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-earth-600">
                    <CheckCircle2 className="w-3 h-3 text-forest-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="text-center space-y-3">
        <Link
          href="/para-criadores"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          Ver benefícios completos
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div>
          <Link href="/" className="text-xs text-earth-400 hover:text-brand-600 transition-colors">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
        </div>
      }
    >
      <ObrigadoContent />
    </Suspense>
  );
}
