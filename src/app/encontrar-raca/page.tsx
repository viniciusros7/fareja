"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Home, Users, Clock, Ruler, RotateCcw, PawPrint } from "lucide-react";
import { breedGuide } from "@/lib/mock-data";
import type { BreedGuide } from "@/types";

type HousingAnswer = "casa" | "apartamento";
type KidsAnswer = "sim" | "nao";
type WalksAnswer = "pouco" | "medio" | "muito";
type SizeAnswer = "pequeno" | "medio" | "grande";

interface Answers {
  housing: HousingAnswer | null;
  kids: KidsAnswer | null;
  walks: WalksAnswer | null;
  size: SizeAnswer | null;
}

// placedog IDs para cada raça (mapeamento fixo)
const breedImageId: Record<string, number> = {
  "Shih Tzu": 70,
  "Lhasa Apso": 71,
  "Maltês": 72,
  "Golden Retriever": 73,
  "Beagle": 74,
  "Labrador Retriever": 75,
  "Pastor Alemão": 76,
  "Malinois": 77,
  "Bulldog Francês": 78,
  "Pug": 79,
  "Border Collie": 80,
  "Yorkshire Terrier": 81,
  "Poodle": 82,
  "Rottweiler": 83,
  "Spitz Alemão": 84,
};

function scoreBreed(breed: BreedGuide, answers: Answers): number {
  let score = 0;

  // Moradia
  if (answers.housing === "apartamento") {
    if (breed.apartment_friendly === "yes") score += 3;
    else if (breed.apartment_friendly === "with_limitations") score += 1;
    else score -= 2;
  } else {
    score += 1; // casa aceita qualquer raça
  }

  // Crianças
  if (answers.kids === "sim") {
    score += breed.good_with_kids ? 2 : -2;
  }

  // Passeios
  if (answers.walks === "pouco") {
    if (breed.energy_level === "low") score += 3;
    else if (breed.energy_level === "medium") score += 1;
    else score -= 1;
  } else if (answers.walks === "medio") {
    if (breed.energy_level === "medium") score += 3;
    else score += 1;
  } else {
    if (breed.energy_level === "high") score += 3;
    else if (breed.energy_level === "medium") score += 1;
  }

  // Porte
  if (answers.size === "pequeno") {
    if (breed.size === "small") score += 3;
    else if (breed.size === "medium") score += 1;
    else score -= 1;
  } else if (answers.size === "medio") {
    if (breed.size === "medium") score += 3;
    else if (breed.size === "small") score += 1;
  } else {
    if (breed.size === "large" || breed.size === "giant") score += 3;
    else if (breed.size === "medium") score += 1;
    else score -= 1;
  }

  return score;
}

const sizeLabels: Record<string, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  giant: "Gigante",
};

const energyLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const steps = [
  { id: 1, question: "Onde você mora?", icon: Home },
  { id: 2, question: "Tem crianças em casa?", icon: Users },
  { id: 3, question: "Quanto tempo tem para passeios por dia?", icon: Clock },
  { id: 4, question: "Qual porte prefere?", icon: Ruler },
];

export default function EncontrarRacaPage() {
  const [step, setStep] = useState(0); // 0=intro, 1-4=perguntas, 5=resultado
  const [answers, setAnswers] = useState<Answers>({
    housing: null,
    kids: null,
    walks: null,
    size: null,
  });

  const totalSteps = 4;

  function handleAnswer(key: keyof Answers, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setStep(5);
    }
  }

  function reset() {
    setAnswers({ housing: null, kids: null, walks: null, size: null });
    setStep(0);
  }

  const topBreeds =
    step === 5
      ? [...breedGuide]
          .map((b) => ({ breed: b, score: scoreBreed(b, answers) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((x) => x.breed)
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
            Responda 4 perguntas rápidas e descubra as 3 raças mais compatíveis com o seu estilo de vida.
          </p>
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
          >
            Começar quiz
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Perguntas 1–4 */}
      {step >= 1 && step <= 4 && (
        <div>
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < step ? "bg-brand-600" : "bg-earth-200"
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">
            Pergunta {step} de {totalSteps}
          </p>

          {/* Q1 */}
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
                    className="p-5 rounded-2xl border-2 border-earth-200 bg-white hover:border-brand-400 hover:bg-brand-50 text-left transition-all group"
                  >
                    <div className="text-3xl mb-3">{opt.emoji}</div>
                    <div className="text-base font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                    <div className="text-xs text-earth-400 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Q2 */}
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
                    className="p-5 rounded-2xl border-2 border-earth-200 bg-white hover:border-brand-400 hover:bg-brand-50 text-left transition-all group"
                  >
                    <div className="text-3xl mb-3">{opt.emoji}</div>
                    <div className="text-base font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                    <div className="text-xs text-earth-400 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Q3 */}
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
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-earth-200 bg-white hover:border-brand-400 hover:bg-brand-50 text-left transition-all group"
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

          {/* Q4 */}
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
                    className="p-4 rounded-2xl border-2 border-earth-200 bg-white hover:border-brand-400 hover:bg-brand-50 text-left transition-all group"
                  >
                    <div className="text-3xl mb-2">{opt.emoji}</div>
                    <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-700">{opt.label}</div>
                    <div className="text-xs text-earth-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Back */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 flex items-center gap-1.5 text-sm text-earth-400 hover:text-earth-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar
            </button>
          )}
        </div>
      )}

      {/* Resultado */}
      {step === 5 && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-900 mb-1">
            Suas raças ideais
          </h2>
          <p className="text-sm text-earth-500 mb-6">
            Baseado nas suas respostas, aqui estão as 3 raças mais compatíveis com você.
          </p>

          <div className="space-y-4">
            {topBreeds.map((breed, i) => {
              const imgId = breedImageId[breed.name] ?? (70 + i);
              return (
                <div key={breed.name} className="rounded-2xl border border-earth-200 bg-white overflow-hidden">
                  {/* Image */}
                  <div className="relative h-40 w-full">
                    <Image
                      src={`https://placedog.net/600/240?id=${imgId}`}
                      alt={breed.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 576px"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white">
                        #{i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-brand-900 mb-1">
                      {breed.name}
                    </h3>
                    <p className="text-sm text-earth-500 leading-relaxed mb-3">
                      {breed.description}
                    </p>

                    {/* Attributes */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-earth-100 text-earth-600">
                        {sizeLabels[breed.size]}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                        Energia {energyLabels[breed.energy_level]}
                      </span>
                      {breed.good_with_kids && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-forest-50 text-forest-600">
                          Bom com crianças
                        </span>
                      )}
                      {breed.traits.slice(0, 2).map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-100 text-brand-600">
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/buscar?breed=${encodeURIComponent(breed.name)}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                    >
                      <PawPrint className="w-3.5 h-3.5" />
                      Ver canis com {breed.name}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Refazer */}
          <button
            onClick={reset}
            className="mt-6 flex items-center gap-2 mx-auto text-sm font-medium text-earth-500 hover:text-brand-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Refazer o quiz
          </button>
        </div>
      )}
    </div>
  );
}
