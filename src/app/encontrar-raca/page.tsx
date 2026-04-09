"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Home, Users, Clock, Ruler,
  RotateCcw, PawPrint, Scissors, Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { BreedRow } from "@/lib/queries/breeds";
import BreedImage from "@/components/BreedImage";

type HousingAnswer = "casa" | "apartamento";
type KidsAnswer = "sim" | "nao";
type WalksAnswer = "pouco" | "medio" | "muito";
type SizeAnswer = "pequeno" | "medio" | "grande";
type CoatAnswer = "long" | "medium" | "short";

interface Answers {
  housing: HousingAnswer | null;
  kids: KidsAnswer | null;
  walks: WalksAnswer | null;
  size: SizeAnswer | null;
  coat: CoatAnswer | null;
}

const MAX_SCORE = 20; // 4 pts × 5 dimensões

function scoreBreed(breed: BreedRow, answers: Answers): number {
  let score = 0;

  // Moradia (0–4 pts)
  if (answers.housing === "apartamento") {
    if (breed.good_for_apartments) score += 4;
    else if (breed.size === "small") score += 2;
  } else {
    score += 2;
  }

  // Crianças (0–4 pts)
  if (answers.kids === "sim") {
    score += breed.good_with_kids ? 4 : 0;
  } else {
    score += 2;
  }

  // Exercício/passeios (0–4 pts) — exercise_needs 1–5
  const exercise = breed.exercise_needs ?? 3;
  const idealExercise = answers.walks === "pouco" ? 1 : answers.walks === "medio" ? 3 : 5;
  score += Math.max(0, 4 - Math.abs(exercise - idealExercise));

  // Porte (0–4 pts)
  const sizeScore: Record<SizeAnswer, Record<string, number>> = {
    pequeno: { small: 4, medium: 2, large: 0, giant: 0 },
    medio:   { small: 2, medium: 4, large: 2, giant: 0 },
    grande:  { small: 0, medium: 2, large: 4, giant: 4 },
  };
  score += sizeScore[answers.size ?? "medio"]?.[breed.size ?? "medium"] ?? 2;

  // Pelagem/cuidados (0–4 pts) — grooming_needs 1–5
  const grooming = breed.grooming_needs ?? 3;
  const idealGrooming = answers.coat === "long" ? 5 : answers.coat === "medium" ? 3 : 1;
  score += Math.max(0, 4 - Math.abs(grooming - idealGrooming));

  return score;
}

function matchPercent(score: number): number {
  return Math.max(0, Math.round((score / MAX_SCORE) * 100));
}

const sizeLabels: Record<string, string> = {
  small: "Pequeno", medium: "Médio", large: "Grande", giant: "Gigante",
};
const coatLabels: Record<string, string> = {
  short: "Pelo curto", medium: "Pelo médio", long: "Pelo longo", hairless: "Sem pelo",
};

function energyLabel(level: number | null): string {
  const map: Record<number, string> = { 1: "Muito baixa", 2: "Baixa", 3: "Média", 4: "Alta", 5: "Muito alta" };
  return map[level ?? 3] ?? "Média";
}

const TOTAL_STEPS = 5;
const RESULT_STEP = TOTAL_STEPS + 1;

export default function EncontrarRacaPage() {
  const [breeds, setBreeds] = useState<BreedRow[]>([]);
  const [breedsLoading, setBreedsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    housing: null, kids: null, walks: null, size: null, coat: null,
  });

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

  function handleAnswer(key: keyof Answers, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStep(step < TOTAL_STEPS ? step + 1 : RESULT_STEP);
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  function reset() {
    setAnswers({ housing: null, kids: null, walks: null, size: null, coat: null });
    setStep(0);
  }

  const scoredBreeds =
    step === RESULT_STEP
      ? [...breeds]
          .map((b) => ({ breed: b, score: scoreBreed(b, answers) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)
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

      {/* Intro */}
      {step === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-6">
            <PawPrint className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-brand-900 mb-3">
            Qual raça é para mim?
          </h1>
          <p className="text-earth-500 max-w-sm mx-auto mb-8 leading-relaxed">
            Responda {TOTAL_STEPS} perguntas rápidas e descubra as 6 raças mais compatíveis com o seu estilo de vida.
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
              Começar quiz
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Perguntas 1–5 */}
      {step >= 1 && step <= TOTAL_STEPS && (
        <div>
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-brand-600" : "bg-earth-200"}`}
              />
            ))}
          </div>

          {/* Back + step label */}
          <div className="flex items-center justify-between mb-4">
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
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
              Pergunta {step} de {TOTAL_STEPS}
            </p>
          </div>

          {/* Q1 — Moradia */}
          {step === 1 && (
            <>
              <h2 className="font-display text-2xl font-semibold text-brand-900 mb-6">
                Você mora em casa ou apartamento?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "casa", label: "Casa", emoji: "🏡", desc: "Com quintal ou espaço externo" },
                  { value: "apartamento", label: "Apartamento", emoji: "🏢", desc: "Espaço mais limitado" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer("housing", opt.value)}
                    className={`p-5 rounded-2xl border-2 bg-white text-left transition-all group ${
                      answers.housing === opt.value ? "border-brand-500 bg-brand-50" : "border-earth-200 hover:border-brand-400 hover:bg-brand-50"
                    }`}
                  >
                    <div className="text-3xl mb-3">{opt.emoji}</div>
                    <div className="text-base font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                    <div className="text-xs text-earth-400 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Q2 — Crianças */}
          {step === 2 && (
            <>
              <h2 className="font-display text-2xl font-semibold text-brand-900 mb-6">
                Tem crianças em casa?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "sim", label: "Sim", emoji: "👧", desc: "Crianças convivem com o pet" },
                  { value: "nao", label: "Não", emoji: "🧑", desc: "Adultos apenas" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer("kids", opt.value)}
                    className={`p-5 rounded-2xl border-2 bg-white text-left transition-all group ${
                      answers.kids === opt.value ? "border-brand-500 bg-brand-50" : "border-earth-200 hover:border-brand-400 hover:bg-brand-50"
                    }`}
                  >
                    <div className="text-3xl mb-3">{opt.emoji}</div>
                    <div className="text-base font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                    <div className="text-xs text-earth-400 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Q3 — Passeios */}
          {step === 3 && (
            <>
              <h2 className="font-display text-2xl font-semibold text-brand-900 mb-6">
                Quanto tempo tem para passeios por dia?
              </h2>
              <div className="space-y-3">
                {[
                  { value: "pouco", label: "Pouco tempo", emoji: "⏱️", desc: "Menos de 30 minutos" },
                  { value: "medio", label: "Tempo médio", emoji: "🕐", desc: "Cerca de 1 hora" },
                  { value: "muito", label: "Bastante tempo", emoji: "🏃", desc: "Mais de 2 horas" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer("walks", opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 bg-white text-left transition-all group ${
                      answers.walks === opt.value ? "border-brand-500 bg-brand-50" : "border-earth-200 hover:border-brand-400 hover:bg-brand-50"
                    }`}
                  >
                    <div className="text-2xl">{opt.emoji}</div>
                    <div>
                      <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                      <div className="text-xs text-earth-400">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Q4 — Porte */}
          {step === 4 && (
            <>
              <h2 className="font-display text-2xl font-semibold text-brand-900 mb-6">
                Qual porte de cão você prefere?
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "pequeno", label: "Pequeno", emoji: "🐩", desc: "Até 10 kg" },
                  { value: "medio", label: "Médio", emoji: "🐕", desc: "10–25 kg" },
                  { value: "grande", label: "Grande", emoji: "🦮", desc: "Acima de 25 kg" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer("size", opt.value)}
                    className={`p-4 rounded-2xl border-2 bg-white text-left transition-all group ${
                      answers.size === opt.value ? "border-brand-500 bg-brand-50" : "border-earth-200 hover:border-brand-400 hover:bg-brand-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{opt.emoji}</div>
                    <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                    <div className="text-xs text-earth-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Q5 — Pelagem */}
          {step === 5 && (
            <>
              <h2 className="font-display text-2xl font-semibold text-brand-900 mb-2">
                No seu dia a dia, sobra um tempinho para cuidar do visual do pet?
              </h2>
              <p className="text-sm text-earth-400 mb-6">Escolha o que combina mais com sua rotina.</p>
              <div className="space-y-3">
                {[
                  { value: "long", label: "Sim, adoro cuidar!", emoji: "✂️", desc: "Pelos longos, escovação diária e tosa profissional frequente" },
                  { value: "medium", label: "Um pouco, sem exagero", emoji: "🪮", desc: "Pelagem média, manutenção moderada" },
                  { value: "short", label: "Prefiro praticidade", emoji: "🐾", desc: "Pelo curto, baixa manutenção" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer("coat", opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 bg-white text-left transition-all group ${
                      answers.coat === opt.value ? "border-brand-500 bg-brand-50" : "border-earth-200 hover:border-brand-400 hover:bg-brand-50"
                    }`}
                  >
                    <div className="text-2xl">{opt.emoji}</div>
                    <div>
                      <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                      <div className="text-xs text-earth-400">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Resultado */}
      {step === RESULT_STEP && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-900 mb-1">
            Suas raças ideais
          </h2>
          <p className="text-sm text-earth-500 mb-6">
            As {scoredBreeds.length} raças mais compatíveis com você, entre {breeds.length} disponíveis.
          </p>

          {breedsLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-earth-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Calculando resultados...
            </div>
          ) : (
            <div className="space-y-4">
              {scoredBreeds.map(({ breed, score }, i) => {
                const pct = matchPercent(score);
                return (
                  <div key={breed.id} className="rounded-2xl border border-earth-200 bg-white overflow-hidden">
                    {/* Image */}
                    <div className="relative h-40 w-full">
                      <BreedImage
                        nameEn={breed.name_en}
                        alt={breed.name_pt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 576px"
                        fallbackSeed={i + 70}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white">
                          #{i + 1}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-brand-700">
                          {pct}% match
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold text-brand-900 mb-0.5">
                        {breed.name_pt}
                      </h3>
                      <p className="text-xs text-earth-400 mb-2">{breed.name_en}</p>
                      <p className="text-sm text-earth-500 leading-relaxed mb-3">
                        {breed.description_pt}
                      </p>

                      {/* Attributes */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {breed.size && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-earth-100 text-earth-600">
                            {sizeLabels[breed.size]}
                          </span>
                        )}
                        {breed.energy_level && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                            Energia {energyLabel(breed.energy_level)}
                          </span>
                        )}
                        {breed.coat && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700">
                            {coatLabels[breed.coat]}
                          </span>
                        )}
                        {breed.good_with_kids && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-forest-50 text-forest-600">
                            Bom com crianças
                          </span>
                        )}
                        {breed.good_for_apartments && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-100 text-brand-600">
                            Apto para apartamento
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/buscar?breed=${encodeURIComponent(breed.name_pt)}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                      >
                        <PawPrint className="w-3.5 h-3.5" />
                        Ver canis com {breed.name_pt}
                      </Link>
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
