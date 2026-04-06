"use client";

import Link from "next/link";
import {
  CheckCircle2, Star, ArrowRight, ShieldCheck, TrendingUp,
  Users, PenLine, Sparkles, PawPrint, Zap, Crown,
} from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Canil Verificado",
    price: "R$ 150",
    period: "/mês",
    description: "Presença completa na plataforma com selo de verificação.",
    highlight: false,
    features: [
      "Selo ★ Verificado Fareja",
      "Perfil completo com fotos",
      "Cadastro de reprodutores e filhotes",
      "Avaliações de clientes",
      "Contato direto com compradores",
      "Painel de gestão de filhotes",
      "Suporte por email",
    ],
  },
  {
    id: "premium",
    name: "Canil Premium",
    price: "R$ 250",
    period: "/mês",
    description: "Máxima visibilidade e ferramentas exclusivas para seu canil.",
    highlight: true,
    features: [
      "Tudo do plano Verificado",
      "Destaque nas pesquisas",
      "Publicação de artigos e dicas",
      "Badge Premium no perfil",
      "Prioridade no suporte",
      "Relatório mensal de visitas",
      "Integração com Google Reviews",
      "Acesso antecipado a novidades",
    ],
  },
];

const benefits = [
  {
    icon: Users,
    title: "Acesso a compradores qualificados",
    desc: "Pessoas que buscam procedência, não apenas preço. Clientes dispostos a pagar mais por qualidade.",
  },
  {
    icon: ShieldCheck,
    title: "Diferenciação do mercado",
    desc: "Seu selo de verificação comprova que você é um criador sério, separando-o de cruzadores irresponsáveis.",
  },
  {
    icon: TrendingUp,
    title: "Justificativa de preço",
    desc: "Mostre ao comprador todo o investimento em estrutura, saúde e genética que está por trás do valor cobrado.",
  },
  {
    icon: PenLine,
    title: "Construa autoridade",
    desc: "Publique artigos e dicas na comunidade, mostrando seu conhecimento e atraindo clientes qualificados.",
  },
];

const steps = [
  { num: "1", title: "Preencha o cadastro", desc: "Informe dados do canil, registro no Kennel Club, raças e fotos das instalações." },
  { num: "2", title: "Envie a documentação", desc: "Registro CBKC/SOBRACI, laudos veterinários, testes genéticos dos reprodutores." },
  { num: "3", title: "Análise da equipe Fareja", desc: "Nossa equipe verifica cada documento e cruza com registros oficiais." },
  { num: "4", title: "Canil aprovado e publicado", desc: "Seu perfil fica visível para todos os compradores da plataforma." },
];

export default function ParaCriadoresPage() {
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
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-earth-900 tracking-tight mb-4">
            Seu canil merece ser <span className="text-brand-600">reconhecido</span>
          </h1>
          <p className="text-base text-earth-500 max-w-lg mx-auto leading-relaxed">
            Cadastre-se na Fareja e mostre aos compradores que seus filhotes têm
            procedência, saúde e qualidade comprovadas.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Pricing */}
      <section className="bg-white border-y border-earth-200 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-semibold text-earth-900 mb-2">
              Planos
            </h2>
            <p className="text-sm text-earth-500">
              Investimento mensal com cancelamento a qualquer momento.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border-2 ${
                  plan.highlight
                    ? "border-brand-600 bg-brand-50/30 relative"
                    : "border-earth-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-600 text-white rounded-full text-[10px] font-semibold">
                      <Sparkles className="w-3 h-3" />
                      Mais popular
                    </span>
                  </div>
                )}
                <h3 className="font-display text-lg font-semibold text-earth-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-earth-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="font-display text-3xl font-semibold text-brand-600">
                    {plan.price}
                  </span>
                  <span className="text-sm text-earth-400">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-earth-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "bg-brand-100 text-brand-600 hover:bg-brand-200"
                  }`}
                >
                  Começar agora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-semibold text-earth-900 text-center mb-10">
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
          <h3 className="font-display text-xl font-semibold text-earth-900 mb-2">
            Pronto para dar o próximo passo?
          </h3>
          <p className="text-sm text-earth-500 mb-5">
            Cadastre seu canil e faça parte da primeira plataforma brasileira de
            criadores verificados.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors">
            <Zap className="w-4 h-4" />
            Cadastrar meu canil
          </button>
        </div>
      </section>
    </div>
  );
}
