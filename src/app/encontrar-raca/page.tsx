"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, PawPrint, RotateCcw, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { BreedRow } from "@/lib/queries/breeds";
import BreedImage from "@/components/BreedImage";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Answers = {
  space:      string | null; // Q1
  experience: string | null; // Q2
  time:       string | null; // Q3
  alone:      string | null; // Q4
  activity:   string | null; // Q5
  kids:       string | null; // Q6
  coat:       string | null; // Q7
  climate:    string | null; // Q8
  goal:       string | null; // Q9
  noise:      string | null; // Q10
};

type AnswerKey = keyof Answers;

const EMPTY_ANSWERS: Answers = {
  space: null, experience: null, time: null, alone: null, activity: null,
  kids: null, coat: null, climate: null, goal: null, noise: null,
};

// ─── Constantes de scoring ────────────────────────────────────────────────────

const COLD_WEATHER_BREEDS = new Set([
  "Siberian Husky", "Alaskan Malamute", "Samoyed", "Saint Bernard",
  "Bernese Mountain Dog", "Chow Chow", "Newfoundland", "Komondor",
  "Kuvasz", "Akita Inu", "American Akita", "Rough Collie",
]);

const VOCAL_BREEDS = new Set([
  "Beagle", "Dachshund", "Miniature Schnauzer", "Standard Schnauzer",
  "Giant Schnauzer", "Miniature Pinscher", "Yorkshire Terrier",
  "Jack Russell Terrier", "Wire Fox Terrier", "German Spitz (Pomeranian)",
  "Basset Hound",
]);

// MAX_SCORE = 40 (4 pts × 10 perguntas)
// Pergunta pulada = 2 pts neutros (não afeta ranking relativo)
const MAX_SCORE = 40;

// ─── Scorers individuais (0–4 pts; null → 2 neutro) ──────────────────────────

function q1Space(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const size = b.size ?? "medium";
  const apt  = b.good_for_apartments ?? false;
  const tbl: Record<string, Record<string, number>> = {
    apt_small: { small: 3, medium: 1, large: 0, giant: 0 },
    apt_large: { small: 3, medium: 3, large: 1, giant: 0 },
    casa_sem:  { small: 3, medium: 4, large: 3, giant: 1 },
    casa_com:  { small: 2, medium: 3, large: 4, giant: 4 },
    sitio:     { small: 1, medium: 2, large: 4, giant: 4 },
  };
  const base   = tbl[ans]?.[size] ?? 2;
  const bonus  = (ans === "apt_small" || ans === "apt_large") && apt ? 1 : 0;
  return Math.min(4, base + bonus);
}

function q2Experience(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const train  = b.trainability ?? 3;
  const energy = b.energy_level ?? 3;
  const group  = (b.breed_group ?? "").toLowerCase();
  const isWork = /trabalho|pastoreio|working|herding|guard/i.test(group);
  switch (ans) {
    case "first": {
      // Ideal: alta trainability (5) + energia baixa (2) para iniciantes
      const s = 4 - Math.abs(train - 5) * 0.5 - Math.abs(energy - 2) * 0.5;
      return Math.min(4, Math.max(0, Math.round(s)));
    }
    case "had_before": return train >= 4 ? 4 : train === 3 ? 3 : 1;
    case "experienced": return 2;
    case "professional": return isWork ? 4 : train >= 4 ? 3 : 2;
    default: return 2;
  }
}

function q3Time(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const ex    = b.exercise_needs ?? 3;
  const ideal = ans === "little" ? 1 : ans === "moderate" ? 3 : 5;
  return Math.max(0, 4 - Math.abs(ex - ideal));
}

function q4Alone(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const fr = b.friendliness ?? 3;
  switch (ans) {
    case "lots":      return Math.min(4, Math.max(0, 5 - fr)); // raças independentes
    case "sometimes": return 2;
    case "rarely":    return Math.min(4, Math.max(0, fr - 1)); // raças apegadas ok
    default:          return 2;
  }
}

function q5Activity(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const energy = b.energy_level ?? 3;
  const ideal  = ans === "sedentary" ? 1 : ans === "moderate" ? 3 : ans === "active" ? 4 : 5;
  return Math.max(0, 4 - Math.abs(energy - ideal));
}

function q6Kids(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const ok   = b.good_with_kids ?? true;
  const size = b.size ?? "medium";
  switch (ans) {
    case "young_kids":   return !ok ? 0 : size === "small" ? 3 : 4;
    case "older_kids":   return ok ? 4 : 1;
    case "teens_adults":
    case "no_kids":      return 2;
    default:             return 2;
  }
}

function q7Coat(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const gr    = b.grooming_needs ?? 3;
  const ideal = ans === "long" ? 5 : ans === "medium" ? 3 : 1;
  return Math.max(0, 4 - Math.abs(gr - ideal));
}

function q8Climate(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const cold = COLD_WEATHER_BREEDS.has(b.name_en);
  switch (ans) {
    case "hot":       return cold ? 0 : 4;
    case "temperate": return 2;
    case "cold":      return cold ? 4 : 2;
    default:          return 2;
  }
}

function q9Goal(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const fr     = b.friendliness ?? 3;
  const energy = b.energy_level ?? 3;
  const train  = b.trainability ?? 3;
  const group  = (b.breed_group ?? "").toLowerCase();
  const size   = b.size ?? "medium";
  const isGuard  = /guarda|trabalho|working|moloss|mastim/i.test(group);
  const isHerd   = /pastoreio|herding|pastor/i.test(group);
  const isLarge  = size === "large" || size === "giant";
  switch (ans) {
    case "companion": return Math.min(4, Math.max(0, fr - 1));
    case "guard":
      if (isGuard && isLarge)            return 4;
      if (isGuard || (isLarge && train >= 4)) return 3;
      return 1;
    case "sport":     return Math.min(4, Math.round((energy + train - 2) / 2));
    case "work":
      if (isHerd && train >= 4) return 4;
      if (isHerd || train >= 5) return 3;
      return train >= 4 ? 2 : 1;
    default: return 2;
  }
}

function q10Noise(b: BreedRow, ans: string | null): number {
  if (!ans) return 2;
  const vocal = VOCAL_BREEDS.has(b.name_en);
  switch (ans) {
    case "problem":      return vocal ? 0 : 4;
    case "dont_care":    return 2;
    case "prefer_vocal": return vocal ? 4 : 2;
    default:             return 2;
  }
}

function scoreBreed(b: BreedRow, a: Answers): number {
  return (
    q1Space(b, a.space)         + q2Experience(b, a.experience) +
    q3Time(b, a.time)           + q4Alone(b, a.alone)           +
    q5Activity(b, a.activity)   + q6Kids(b, a.kids)             +
    q7Coat(b, a.coat)           + q8Climate(b, a.climate)       +
    q9Goal(b, a.goal)           + q10Noise(b, a.noise)
  );
}

function matchPct(score: number): number {
  return Math.round((score / MAX_SCORE) * 100);
}

// ─── Definição das perguntas ──────────────────────────────────────────────────

interface QuestionDef {
  key: AnswerKey;
  title: string;
  subtitle?: string;
  columns: 1 | 2;
  options: { value: string; emoji: string; label: string; desc: string }[];
}

const QUESTIONS: QuestionDef[] = [
  {
    key: "space",
    title: "Qual o tamanho do seu espaço?",
    columns: 1,
    options: [
      { value: "apt_small", emoji: "🏢", label: "Apartamento pequeno",      desc: "Estúdio ou até 60 m², sem área externa" },
      { value: "apt_large", emoji: "🏬", label: "Apartamento grande",        desc: "Acima de 60 m², com varanda ou terraço" },
      { value: "casa_sem",  emoji: "🏠", label: "Casa sem quintal",          desc: "Área interna ampla, sem espaço externo cercado" },
      { value: "casa_com",  emoji: "🏡", label: "Casa com quintal",          desc: "Espaço externo cercado para o cão correr" },
      { value: "sitio",     emoji: "🌿", label: "Sítio ou terreno grande",   desc: "Muito espaço livre — sem limitação de tamanho" },
    ],
  },
  {
    key: "experience",
    title: "É sua primeira vez com cão?",
    columns: 1,
    options: [
      { value: "first",        emoji: "🐾", label: "Sim, nunca tive cão",             desc: "Quero uma raça calma e fácil de ensinar" },
      { value: "had_before",   emoji: "🐕", label: "Já tive, mas faz tempo",          desc: "Tenho noção básica e quero uma raça gentil" },
      { value: "experienced",  emoji: "🦮", label: "Tenho boa experiência com cães",  desc: "Me sinto confortável com qualquer temperamento" },
      { value: "professional", emoji: "🏆", label: "Sou criador ou profissional",     desc: "Prefiro raças de trabalho ou mais exigentes" },
    ],
  },
  {
    key: "time",
    title: "Quanto tempo disponível você tem para o pet por dia?",
    columns: 1,
    options: [
      { value: "little",   emoji: "⏱️", label: "Pouco — trabalho fora o dia todo",  desc: "Menos de 2 horas de interação real" },
      { value: "moderate", emoji: "🕐", label: "Moderado — algumas horas em casa",   desc: "2 a 4 horas de presença no dia" },
      { value: "lots",     emoji: "🏠", label: "Muito — home office ou aposentado",  desc: "Mais de 4 horas disponível para o cão" },
    ],
  },
  {
    key: "alone",
    title: "O cão ficará sozinho muitas horas por dia?",
    columns: 1,
    options: [
      { value: "lots",      emoji: "🔓", label: "Sim, mais de 6 horas",         desc: "Preciso de uma raça mais independente" },
      { value: "sometimes", emoji: "⏳", label: "Às vezes, 3 a 6 horas",        desc: "Alguma independência é útil" },
      { value: "rarely",    emoji: "🤝", label: "Raramente — quase sempre em casa", desc: "Pode ser uma raça mais apegada" },
    ],
  },
  {
    key: "activity",
    title: "Qual é o seu nível de atividade física?",
    columns: 2,
    options: [
      { value: "sedentary",   emoji: "🛋️", label: "Sedentário / calmo", desc: "Caminhadas curtas ocasionais" },
      { value: "moderate",    emoji: "🚶", label: "Moderado",            desc: "Caminhadas regulares todo dia" },
      { value: "active",      emoji: "🏃", label: "Ativo",               desc: "Corrida, trilhas, academia" },
      { value: "very_active", emoji: "🚴", label: "Muito ativo",         desc: "Ciclismo, esportes, canicross" },
    ],
  },
  {
    key: "kids",
    title: "Tem crianças em casa?",
    columns: 2,
    options: [
      { value: "young_kids",   emoji: "👶", label: "Sim — bebês ou crianças pequenas", desc: "Até 5 anos de idade" },
      { value: "older_kids",   emoji: "👧", label: "Sim — crianças maiores",            desc: "6 a 12 anos" },
      { value: "teens_adults", emoji: "👦", label: "Adolescentes ou adultos",           desc: "13 anos ou mais" },
      { value: "no_kids",      emoji: "🧑", label: "Não tenho crianças",               desc: "Apenas adultos em casa" },
    ],
  },
  {
    key: "coat",
    title: "Sobra tempo para cuidar do visual do pet?",
    subtitle: "Considera escovação, tosa e banhos frequentes.",
    columns: 1,
    options: [
      { value: "long",   emoji: "✂️", label: "Sim, adoro cuidar!",    desc: "Pelo longo, escovação diária, tosa frequente" },
      { value: "medium", emoji: "🪮", label: "Um pouco, sem exagero", desc: "Pelagem média, manutenção moderada" },
      { value: "short",  emoji: "🐾", label: "Prefiro praticidade",   desc: "Pelo curto, banho mensal e pronto" },
    ],
  },
  {
    key: "climate",
    title: "O clima onde você mora é:",
    columns: 1,
    options: [
      { value: "hot",       emoji: "☀️", label: "Quente o ano todo",  desc: "Norte, Nordeste, litoral — raramente frio" },
      { value: "temperate", emoji: "🌤️", label: "Temperado / variado", desc: "Sudeste, Centro-Oeste — estações definidas" },
      { value: "cold",      emoji: "❄️", label: "Frio ou serrano",    desc: "Sul, Serra Gaúcha, serras de SC e MG" },
    ],
  },
  {
    key: "goal",
    title: "O que você mais busca no seu cão?",
    columns: 2,
    options: [
      { value: "companion", emoji: "❤️", label: "Companhia e carinho",   desc: "Amigo fiel, afetuoso e sempre presente" },
      { value: "guard",     emoji: "🛡️", label: "Guarda e proteção",    desc: "Alerta, territorial, protetor da família" },
      { value: "sport",     emoji: "🎾", label: "Esporte e atividade",   desc: "Parceiro para agility, corrida ou trilhas" },
      { value: "work",      emoji: "🌾", label: "Trabalho ou pastoreio", desc: "Fazenda, pastoreio, cão de serviço" },
    ],
  },
  {
    key: "noise",
    title: "Latidos são um problema para você?",
    columns: 1,
    options: [
      { value: "problem",      emoji: "🔇", label: "Sim — tenho vizinhos próximos ou moro em apto", desc: "Prefiro uma raça mais silenciosa" },
      { value: "dont_care",    emoji: "😌", label: "Não me importo muito",                           desc: "Latir ocasionalmente é normal" },
      { value: "prefer_vocal", emoji: "🔔", label: "Prefiro um cão mais vocal",                     desc: "Latidos de alerta são bem-vindos" },
    ],
  },
];

// ─── Helpers de exibição ──────────────────────────────────────────────────────

const sizeLabels: Record<string, string> = {
  small: "Pequeno", medium: "Médio", large: "Grande", giant: "Gigante",
};
const coatLabels: Record<string, string> = {
  short: "Pelo curto", medium: "Pelo médio", long: "Pelo longo", hairless: "Sem pelo",
};
function energyLabel(n: number | null): string {
  const map: Record<number, string> = {
    1: "Energia muito baixa", 2: "Energia baixa", 3: "Energia média",
    4: "Energia alta", 5: "Energia muito alta",
  };
  return map[n ?? 3] ?? "Energia média";
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TOTAL_STEPS = QUESTIONS.length; // 10

export default function EncontrarRacaPage() {
  const [breeds, setBreeds]             = useState<BreedRow[]>([]);
  const [breedsLoading, setBreedsLoading] = useState(true);
  const [step, setStep]                 = useState(0);
  const [answers, setAnswers]           = useState<Answers>(EMPTY_ANSWERS);

  useEffect(() => {
    createClient()
      .from("breeds")
      .select("*")
      .order("name_pt")
      .then(({ data }) => {
        setBreeds((data as BreedRow[]) ?? []);
        setBreedsLoading(false);
      });
  }, []);

  const currentQ = step >= 1 && step <= TOTAL_STEPS ? QUESTIONS[step - 1] : null;

  function advance() {
    setStep((s) => (s < TOTAL_STEPS ? s + 1 : TOTAL_STEPS + 1));
  }

  function handleSelect(value: string) {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.key]: value }));
    advance();
  }

  function handleSkip() {
    // Pular: limpa a resposta dessa pergunta (neutro no scoring) e avança
    if (currentQ) setAnswers((prev) => ({ ...prev, [currentQ.key]: null }));
    advance();
  }

  function goBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  function reset() {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
  }

  const scoredBreeds =
    step === TOTAL_STEPS + 1
      ? [...breeds]
          .map((b) => ({ breed: b, score: scoreBreed(b, answers) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
      : [];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-6">
            <PawPrint className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-brand-900 mb-3">
            Qual é a raça ideal para mim?
          </h1>
          <p className="text-earth-500 max-w-sm mx-auto mb-8 leading-relaxed">
            Responda {TOTAL_STEPS} perguntas rápidas e descubra as 10 raças mais compatíveis
            com o seu estilo de vida — entre {breedsLoading ? "…" : breeds.length} raças avaliadas.
          </p>
          {breedsLoading ? (
            <div className="flex items-center justify-center gap-2 text-earth-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando raças...
            </div>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
            >
              Começar
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ── Perguntas ─────────────────────────────────────────────────────── */}
      {currentQ && (
        <div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-earth-400">Pergunta {step} de {TOTAL_STEPS}</span>
              <span className="text-brand-600 font-semibold">
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-earth-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-300"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          {/* Voltar + Pular */}
          <div className="flex items-center justify-between mb-5">
            {step > 1 ? (
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-earth-600 bg-white border border-earth-200 rounded-full hover:bg-earth-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleSkip}
              className="text-sm text-earth-400 hover:text-earth-600 transition-colors"
            >
              Pular
            </button>
          </div>

          {/* Título da pergunta */}
          <h2
            className={`font-display text-2xl font-semibold text-brand-900 ${
              currentQ.subtitle ? "mb-2" : "mb-6"
            }`}
          >
            {currentQ.title}
          </h2>
          {currentQ.subtitle && (
            <p className="text-sm text-earth-400 mb-6">{currentQ.subtitle}</p>
          )}

          {/* Opções */}
          <div
            className={
              currentQ.columns === 2
                ? "grid grid-cols-2 gap-3"
                : "space-y-3"
            }
          >
            {currentQ.options.map((opt) => {
              const selected = answers[currentQ.key] === opt.value;
              const isGrid   = currentQ.columns === 2;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`rounded-2xl border-2 bg-white text-left transition-all group ${
                    selected
                      ? "border-brand-500 bg-brand-50"
                      : "border-earth-200 hover:border-brand-400 hover:bg-brand-50"
                  } ${isGrid ? "p-4" : "p-4 flex items-center gap-4"}`}
                >
                  <div className={isGrid ? "text-3xl mb-3" : "text-2xl shrink-0"}>
                    {opt.emoji}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-700">
                      {opt.label}
                    </div>
                    <div className="text-xs text-earth-400 mt-0.5 leading-relaxed">
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Resultado ─────────────────────────────────────────────────────── */}
      {step === TOTAL_STEPS + 1 && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-900 mb-1">
            Suas raças ideais
          </h2>
          <p className="text-sm text-earth-500 mb-6">
            As {scoredBreeds.length} raças mais compatíveis entre {breeds.length} avaliadas.
          </p>

          {breedsLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-earth-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Calculando resultados...
            </div>
          ) : (
            <div className="space-y-4">
              {scoredBreeds.map(({ breed, score }, i) => {
                const pct  = matchPct(score);
                const tags = (breed.temperament_pt ?? "")
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .slice(0, 3);

                return (
                  <div
                    key={breed.id}
                    className="rounded-2xl border border-earth-200 bg-white overflow-hidden"
                  >
                    {/* Foto */}
                    <div className="relative h-44 w-full">
                      <BreedImage
                        nameEn={breed.name_en}
                        alt={breed.name_pt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 576px"
                        fallbackSeed={i + 70}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm">
                          #{i + 1}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                            pct >= 80
                              ? "bg-forest-600 text-white"
                              : pct >= 60
                              ? "bg-white/90 text-brand-700"
                              : "bg-white/90 text-earth-600"
                          }`}
                        >
                          {pct}% match
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold text-brand-900">
                        {breed.name_pt}
                      </h3>
                      <p className="text-xs text-earth-400 mb-3">{breed.name_en}</p>

                      {/* Badges de atributos */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {breed.size && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-earth-100 text-earth-600">
                            {sizeLabels[breed.size]}
                          </span>
                        )}
                        {breed.energy_level && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                            {energyLabel(breed.energy_level)}
                          </span>
                        )}
                        {breed.coat && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700">
                            {coatLabels[breed.coat]}
                          </span>
                        )}
                        {breed.good_with_kids && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-forest-50 text-forest-600">
                            Bom com crianças
                          </span>
                        )}
                        {breed.good_for_apartments && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-brand-100 text-brand-600">
                            Apto p/ apartamento
                          </span>
                        )}
                      </div>

                      {/* Descrição */}
                      {breed.description_pt && (
                        <p className="text-sm text-earth-500 leading-relaxed line-clamp-2 mb-3">
                          {breed.description_pt}
                        </p>
                      )}

                      {/* Tags de temperamento */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tags.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-brand-100 text-brand-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex gap-2">
                        <Link
                          href="/racas"
                          className="flex-1 flex items-center justify-center py-2.5 text-sm font-semibold text-earth-700 bg-earth-50 border border-earth-200 rounded-xl hover:bg-earth-100 transition-colors"
                        >
                          Ver catálogo
                        </Link>
                        <Link
                          href="/canis"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                        >
                          <PawPrint className="w-3.5 h-3.5" />
                          Encontrar criadores
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Link
              href="/racas"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Ver todas as raças →
            </Link>
            <button
              onClick={reset}
              className="flex items-center gap-2 text-sm font-medium text-earth-500 hover:text-brand-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Refazer o quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
