import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Heart,
  Dna,
  Syringe,
  Home,
  Star,
  ArrowRight,
  CheckCircle2,
  AtSign,
  Users,
  PawPrint,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verificação rigorosa",
    desc: "Cada canil passa por análise documental e validação de registro no Kennel Club antes de ser aprovado.",
    color: "bg-brand-100 text-brand-600",
  },
  {
    icon: Dna,
    title: "Testes genéticos",
    desc: "Reprodutores com exames de DNA, displasia e testes cardíacos comprovados e documentados.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Syringe,
    title: "Saúde garantida",
    desc: "Filhotes vacinados, vermifugados e microchipados antes da entrega ao novo tutor.",
    color: "bg-forest-50 text-forest-500",
  },
  {
    icon: Home,
    title: "Bem-estar animal",
    desc: "Instalações aprovadas pelo CRMV, sem superlotação, com socialização adequada dos filhotes.",
    color: "bg-red-50 text-red-700",
  },
];

const steps = [
  {
    num: "01",
    title: "Canil envia documentação",
    desc: "Registro CBKC, fotos das instalações, laudos de saúde dos reprodutores e histórico de ninhadas.",
  },
  {
    num: "02",
    title: "Equipe Fareja analisa",
    desc: "Verificação documental completa. Cada informação é cruzada com registros oficiais.",
  },
  {
    num: "03",
    title: "Selo de verificação",
    desc: "Canil aprovado recebe o selo ★ Verificado e fica visível para milhares de compradores.",
  },
  {
    num: "04",
    title: "Clientes encontram",
    desc: "Busca por raça, localização, filhotes disponíveis e avaliações reais de outros tutores.",
  },
];

const stats = [
  { value: "35+", label: "Anos de experiência familiar no ramo" },
  { value: "100%", label: "Canis verificados individualmente" },
  { value: "0", label: "Tolerância com criadores irregulares" },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100/60 via-brand-50/30 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 text-brand-600 rounded-full text-xs font-semibold mb-6 animate-fade-in-up">
            <Star className="w-3.5 h-3.5" />
            Plataforma pioneira no Brasil
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-brand-900 tracking-tight leading-[1.1] mb-5 animate-fade-in-up animate-delay-1">
            Seu filhote merece{" "}
            <span className="text-brand-600">procedência</span>
          </h1>

          <p className="text-lg text-earth-500 max-w-xl mx-auto mb-8 animate-fade-in-up animate-delay-2 leading-relaxed">
            Encontre canis verificados com registro oficial, testes de saúde e
            instalações aprovadas. Chega de comprar no escuro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animate-delay-3">
            <Link
              href="/buscar"
              className="flex items-center gap-2 px-7 py-3.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
            >
              <Search className="w-4 h-4" />
              Buscar canis verificados
            </Link>
            <Link
              href="/para-criadores"
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-brand-600 bg-white border border-brand-200 rounded-full hover:bg-brand-50 transition-colors"
            >
              Sou criador
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-14 animate-fade-in-up animate-delay-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-semibold text-brand-600">
                  {s.value}
                </div>
                <div className="text-xs text-earth-400 mt-1 leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-900 mb-3">
            Por que a Fareja existe
          </h2>
          <p className="text-earth-500 max-w-lg mx-auto">
            Milhares de filhotes são vendidos sem nenhuma garantia de origem.
            Nós mudamos isso.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl border border-earth-200 bg-white card-hover"
            >
              <div
                className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mb-4`}
              >
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-earth-800 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-earth-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-y border-earth-200 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-900 mb-3">
              Como funciona
            </h2>
            <p className="text-earth-500">
              Um processo transparente para criadores e compradores.
            </p>
          </div>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-display font-semibold text-lg shrink-0">
                  {s.num}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-semibold text-earth-800 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-earth-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community CTA ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Comunidade */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-semibold text-brand-900 mb-2">
              Comunidade Fareja
            </h3>
            <p className="text-sm text-earth-500 leading-relaxed mb-5">
              Compartilhe experiências, tire dúvidas e conecte-se com criadores
              verificados e outros tutores apaixonados.
            </p>
            <Link
              href="/comunidade"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Explorar comunidade
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* AtSign */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center mb-5">
              <AtSign className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-semibold text-brand-900 mb-2">
              Siga no Instagram
            </h3>
            <p className="text-sm text-earth-500 leading-relaxed mb-5">
              Bastidores dos canis, dicas de cuidados, depoimentos de tutores e
              os filhotes mais fofos do Brasil.
            </p>
            <a
              href="https://instagram.com/fareja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
            >
              @fareja
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust / social proof ── */}
      <section className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-forest-50 text-forest-500 text-sm font-medium mb-6">
          <BadgeCheck className="w-5 h-5" />
          Fundada por uma família com 35 anos no ramo de criação
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-900 mb-4">
          Criado por quem entende de criação responsável
        </h2>
        <p className="text-earth-500 max-w-lg mx-auto leading-relaxed mb-8">
          A Fareja nasceu da necessidade real de separar criadores sérios de
          pessoas que apenas cruzam cães sem responsabilidade. Nosso compromisso
          é com a qualidade de vida dos animais e a confiança dos tutores.
        </p>
        <Link
          href="/para-criadores"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          <PawPrint className="w-4 h-4" />
          Cadastre seu canil
        </Link>
      </section>
    </div>
  );
}
