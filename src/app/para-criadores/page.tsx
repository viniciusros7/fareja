"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, ShieldCheck, TrendingUp,
  Users, PenLine, Sparkles, PawPrint, Zap, Crown,
  Stethoscope, Store, MessageCircle, Camera, Gem, Trophy,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";

const plans = [
  {
    id: "basic",
    name: "Canil Verificado",
    description: "Presença completa na plataforma com selo de verificação.",
    tier: "basic" as const,
    features: [
      "Selo ★ Verificado Fareja",
      "Perfil completo com fotos",
      "Cadastro de reprodutores e filhotes",
      "Avaliações de clientes",
      "Contato direto com compradores",
      "Painel de gestão de filhotes",
      "1 foto ou vídeo por dia no feed",
      "Suporte por email",
    ],
  },
  {
    id: "premium",
    name: "Canil Premium",
    description: "Mais visibilidade e ferramentas para crescer.",
    tier: "premium" as const,
    features: [
      "Tudo do plano Verificado",
      "Destaque nas pesquisas",
      "Publicação de artigos e dicas",
      "Badge Premium no perfil",
      "5 fotos ou vídeos por dia no feed",
      "Prioridade no suporte",
      "Relatório mensal de visitas",
      "Integração com Google Reviews",
    ],
  },
  {
    id: "super_premium",
    name: "Canil Elite",
    description: "O máximo em visibilidade, parcerias e engajamento.",
    tier: "super_premium" as const,
    features: [
      "Tudo do plano Premium",
      "Super destaque nas pesquisas (topo)",
      "Fotos e vídeos ilimitados no feed",
      "Respostas ilimitadas na comunidade",
      "Recomendar veterinários parceiros",
      "Recomendar casas de ração parceiras",
      "Badge Elite dourado exclusivo",
      "Posts patrocinados no feed",
      "Relatório semanal detalhado",
      "Suporte prioritário por WhatsApp",
    ],
  },
];

const benefits = [
  {
    icon: Users,
    title: "Compradores qualificados",
    desc: "Pessoas que buscam procedência, não apenas preço.",
  },
  {
    icon: ShieldCheck,
    title: "Diferenciação do mercado",
    desc: "Seu selo comprova que você é um criador sério.",
  },
  {
    icon: TrendingUp,
    title: "Justificativa de preço",
    desc: "Mostre o investimento por trás do valor cobrado.",
  },
  {
    icon: PenLine,
    title: "Construa autoridade",
    desc: "Artigos e dicas que atraem clientes qualificados.",
  },
  {
    icon: Stethoscope,
    title: "Rede de parceiros",
    desc: "Indique veterinários e casas de ração de confiança.",
  },
  {
    icon: Camera,
    title: "Feed visual",
    desc: "Mostre seu dia a dia e filhotes no feed da comunidade.",
  },
];

const steps = [
  { num: "1", title: "Preencha o cadastro", desc: "Dados do canil, registro no Kennel Club, raças e fotos das instalações." },
  { num: "2", title: "Envie a documentação", desc: "Registro CBKC/SOBRACI, laudos veterinários, testes genéticos." },
  { num: "3", title: "Análise da equipe Fareja", desc: "Verificação documental e cruzamento com registros oficiais." },
  { num: "4", title: "Canil aprovado", desc: "Perfil visível para todos os compradores da plataforma." },
];

function ParaCriadoresContent() {
  const { user } = useUser();
  const { isKennel, isApprover, isAdmin, loading: roleLoading } = useRole();
  const [founderCount, setFounderCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats/growth")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setFounderCount(d.founders); });
  }, []);

  const showFounderBanner = !!user && (isKennel || isApprover || isAdmin);

  const ctaHref = !user
    ? "/login"
    : isKennel
    ? "/painel"
    : "/criadores/candidatar";

  const ctaLabel = !user
    ? "Entrar para candidatar"
    : isKennel
    ? "Acessar meu painel"
    : "Candidatar meu canil";

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100/40 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 text-brand-600 rounded-full text-xs font-semibold mb-5">
            <Crown className="w-3.5 h-3.5" />
            Para criadores e canis
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-brand-900 tracking-tight mb-4">
            Seu canil merece ser <span className="text-brand-600">reconhecido</span>
          </h1>
          <p className="text-base text-earth-500 max-w-lg mx-auto leading-relaxed">
            Cadastre-se na Fareja e mostre aos compradores que seus filhotes têm
            procedência, saúde e qualidade comprovadas.
          </p>
        </div>
      </section>

      {/* Founder Program Banner — only for kennel/admin */}
      {showFounderBanner && (
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100/60 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-amber-900 leading-tight">
                    Programa Canis Fundadores
                  </h2>
                </div>
              </div>

              <ul className="space-y-1.5 mb-5 text-sm text-amber-800 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                  Isenção total de pagamento por <strong>1 ano</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                  Após o primeiro ano, <strong>preço exclusivo permanente de fundador</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                  Badge <strong>Canil Fundador 🏆</strong> no perfil e nos resultados de busca
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                  Prioridade em novos recursos e funcionalidades
                </li>
              </ul>

              {/* Counter */}
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between text-[11px] font-medium mb-1.5 text-amber-700">
                    <span>Vagas de fundador preenchidas</span>
                    {founderCount !== null && (
                      <span className="font-semibold">{founderCount} / 10</span>
                    )}
                  </div>
                  <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    {founderCount !== null && (
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, founderCount * 10)}%` }}
                      />
                    )}
                  </div>
                </div>
                {founderCount !== null && founderCount < 10 && (
                  <span className="text-xs text-amber-600 shrink-0 font-medium">
                    {10 - founderCount} {10 - founderCount === 1 ? "vaga restante" : "vagas restantes"}
                  </span>
                )}
                {founderCount !== null && founderCount >= 10 && (
                  <span className="text-xs font-semibold text-amber-700 shrink-0">Esgotado</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="p-5 rounded-xl border border-earth-200 bg-white">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-3">
                <b.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-earth-800 mb-1">{b.title}</h3>
              <p className="text-xs text-earth-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing — 3 plans */}
      <section className="bg-white border-y border-earth-200 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-semibold text-brand-900 mb-2">
              Planos
            </h2>
            <p className="text-sm text-earth-500">
              Complete o questionário de candidatura para receber seu plano sugerido e conhecer os valores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const isSuperPremium = plan.tier === "super_premium";
              const isPremium = plan.tier === "premium";
              const isHighlight = isPremium;

              return (
                <div
                  key={plan.id}
                  className={`p-6 rounded-2xl border-2 relative ${
                    isSuperPremium
                      ? "border-brand-600 bg-gradient-to-b from-brand-50/50 to-white ring-1 ring-brand-200"
                      : isHighlight
                      ? "border-brand-400 bg-brand-50/20"
                      : "border-earth-200 bg-white"
                  }`}
                >
                  {isSuperPremium && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-full text-[10px] font-semibold shadow-md">
                        <Gem className="w-3 h-3" />
                        Máximo destaque
                      </span>
                    </div>
                  )}
                  {isHighlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-600 text-white rounded-full text-[10px] font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Mais popular
                      </span>
                    </div>
                  )}

                  <h3 className="font-display text-lg font-semibold text-brand-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-earth-500 mb-4">{plan.description}</p>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-earth-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          isSuperPremium ? "text-brand-500" : "text-forest-500"
                        }`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={roleLoading ? "#" : ctaHref}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isSuperPremium
                        ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 shadow-md"
                        : isHighlight
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : "bg-brand-100 text-brand-600 hover:bg-brand-200"
                    }`}
                  >
                    {ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Super Premium highlights */}
          <div className="mt-10 p-6 rounded-2xl bg-brand-50/50 border border-brand-200">
            <h3 className="font-display text-lg font-semibold text-brand-900 mb-4 text-center">
              Exclusivo do plano Elite
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Stethoscope className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-earth-800 mb-1">Veterinários parceiros</h4>
                <p className="text-xs text-earth-500">Indique veterinários de confiança. Seus clientes recebem a recomendação diretamente no perfil do canil.</p>
              </div>
              <div className="text-center p-4">
                <Store className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-earth-800 mb-1">Casas de ração parceiras</h4>
                <p className="text-xs text-earth-500">Compartilhe onde comprar a melhor ração. Parcerias com desconto para seus clientes e produtores locais.</p>
              </div>
              <div className="text-center p-4">
                <MessageCircle className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-earth-800 mb-1">Engajamento ilimitado</h4>
                <p className="text-xs text-earth-500">Respostas ilimitadas na comunidade + fotos e vídeos sem limite no feed. Máximo engajamento com seu público.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-semibold text-brand-900 text-center mb-10">
          Como funciona o cadastro
        </h2>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-display font-semibold shrink-0">
                {s.num}
              </div>
              <div className="pt-1">
                <h3 className="text-sm font-semibold text-earth-800 mb-0.5">{s.title}</h3>
                <p className="text-xs text-earth-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-4 pb-16 text-center">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200">
          <PawPrint className="w-8 h-8 text-brand-600 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-brand-900 mb-2">
            Pronto para dar o próximo passo?
          </h3>
          <p className="text-sm text-earth-500 mb-5">
            Cadastre seu canil e faça parte da primeira plataforma brasileira de
            criadores verificados.
          </p>
          <Link
            href={roleLoading ? "#" : ctaHref}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            {ctaLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ParaCriadoresPage() {
  return <ParaCriadoresContent />;
}
