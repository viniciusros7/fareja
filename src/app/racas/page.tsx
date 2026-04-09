"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, ChevronDown, ChevronUp, ArrowLeft, Loader2,
  Weight, Ruler, Clock, PawPrint,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { BreedRow } from "@/lib/queries/breeds";
import BreedImage from "@/components/BreedImage";

const sizeLabels: Record<string, string> = {
  small: "Pequeno", medium: "Médio", large: "Grande", giant: "Gigante",
};
const coatLabels: Record<string, string> = {
  short: "Pelo curto", medium: "Pelo médio", long: "Pelo longo", hairless: "Sem pelo",
};
const sizeFilters = [
  { value: "all", label: "Todos os portes" },
  { value: "small", label: "Pequeno" },
  { value: "medium", label: "Médio" },
  { value: "large", label: "Grande" },
  { value: "giant", label: "Gigante" },
];
const coatFilters = [
  { value: "all", label: "Todas as pelagens" },
  { value: "short", label: "Pelo curto" },
  { value: "medium", label: "Pelo médio" },
  { value: "long", label: "Pelo longo" },
];

function EnergyDots({ level }: { level: number | null }) {
  const n = level ?? 0;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i <= n ? "bg-brand-500" : "bg-earth-200"}`}
        />
      ))}
    </div>
  );
}

function AttributeBar({ label, value }: { label: string; value: number | null }) {
  const n = value ?? 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-earth-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-earth-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all"
          style={{ width: `${(n / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium text-earth-600 w-4">{n}</span>
    </div>
  );
}

export default function RacasPage() {
  const [breeds, setBreeds] = useState<BreedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [coatFilter, setCoatFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .from("breeds")
      .select("*")
      .order("name_pt")
      .then(({ data }) => {
        setBreeds((data as BreedRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  const groups = ["all", ...Array.from(new Set(breeds.map((b) => b.breed_group).filter(Boolean))).sort()] as string[];

  const filtered = breeds.filter((b) => {
    if (search && !b.name_pt.toLowerCase().includes(search.toLowerCase()) && !b.name_en.toLowerCase().includes(search.toLowerCase())) return false;
    if (sizeFilter !== "all" && b.size !== sizeFilter) return false;
    if (coatFilter !== "all" && b.coat !== coatFilter) return false;
    if (groupFilter !== "all" && b.breed_group !== groupFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-brand-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>
        <h1 className="font-display text-3xl font-semibold text-brand-900 mb-2">
          Guia de Raças
        </h1>
        <p className="text-earth-500">
          {loading ? "Carregando..." : `${breeds.length} raças com características detalhadas.`}{" "}
          <Link href="/encontrar-raca" className="text-brand-600 hover:underline font-medium">
            Fazer o quiz →
          </Link>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="text"
            placeholder="Buscar raça..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
          />
        </div>

        {/* Size */}
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 text-earth-700"
        >
          {sizeFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Coat */}
        <select
          value={coatFilter}
          onChange={(e) => setCoatFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 text-earth-700"
        >
          {coatFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Group */}
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 text-earth-700"
        >
          <option value="all">Todos os grupos</option>
          {groups.filter((g) => g !== "all").map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-xs text-earth-400 mb-5">
          {filtered.length === breeds.length
            ? `${breeds.length} raças`
            : `${filtered.length} de ${breeds.length} raças`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-earth-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Carregando raças...
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((breed, i) => {
            const expanded = expandedId === breed.id;
            return (
              <div
                key={breed.id}
                className="rounded-2xl border border-earth-200 bg-white overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 w-full shrink-0">
                  <BreedImage
                    nameEn={breed.name_en}
                    alt={breed.name_pt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    fallbackSeed={i + 20}
                  />
                  {breed.breed_group && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-earth-700">
                        {breed.breed_group}
                      </span>
                    </div>
                  )}
                </div>

                {/* Base info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="font-display text-base font-semibold text-brand-900 leading-tight">
                      {breed.name_pt}
                    </h3>
                    <p className="text-xs text-earth-400">{breed.name_en}</p>
                  </div>

                  {/* Quick badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {breed.size && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-earth-100 text-earth-600">
                        {sizeLabels[breed.size]}
                      </span>
                    )}
                    {breed.coat && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                        {coatLabels[breed.coat]}
                      </span>
                    )}
                    {breed.good_with_kids && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-forest-50 text-forest-600">
                        Bom com crianças
                      </span>
                    )}
                  </div>

                  {/* Energy */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-earth-400">Energia</span>
                    <EnergyDots level={breed.energy_level} />
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : breed.id)}
                    className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-earth-500 hover:text-brand-600 border-t border-earth-100 transition-colors"
                  >
                    {expanded ? (
                      <>Menos detalhes <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Ver detalhes <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>

                  {/* Expanded content */}
                  {expanded && (
                    <div className="pt-4 border-t border-earth-100 mt-2 space-y-4">
                      {/* Description */}
                      {breed.description_pt && (
                        <p className="text-sm text-earth-600 leading-relaxed">
                          {breed.description_pt}
                        </p>
                      )}

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {(breed.weight_min_kg || breed.weight_max_kg) && (
                          <div className="p-2 rounded-lg bg-earth-50">
                            <Weight className="w-3.5 h-3.5 text-earth-400 mx-auto mb-0.5" />
                            <div className="text-xs font-semibold text-earth-700">
                              {breed.weight_min_kg}–{breed.weight_max_kg} kg
                            </div>
                            <div className="text-[10px] text-earth-400">Peso</div>
                          </div>
                        )}
                        {(breed.height_min_cm || breed.height_max_cm) && (
                          <div className="p-2 rounded-lg bg-earth-50">
                            <Ruler className="w-3.5 h-3.5 text-earth-400 mx-auto mb-0.5" />
                            <div className="text-xs font-semibold text-earth-700">
                              {breed.height_min_cm}–{breed.height_max_cm} cm
                            </div>
                            <div className="text-[10px] text-earth-400">Altura</div>
                          </div>
                        )}
                        {(breed.life_span_min || breed.life_span_max) && (
                          <div className="p-2 rounded-lg bg-earth-50">
                            <Clock className="w-3.5 h-3.5 text-earth-400 mx-auto mb-0.5" />
                            <div className="text-xs font-semibold text-earth-700">
                              {breed.life_span_min}–{breed.life_span_max} anos
                            </div>
                            <div className="text-[10px] text-earth-400">Vida</div>
                          </div>
                        )}
                      </div>

                      {/* Attribute bars */}
                      <div className="space-y-2">
                        <AttributeBar label="Energia" value={breed.energy_level} />
                        <AttributeBar label="Adestramento" value={breed.trainability} />
                        <AttributeBar label="Sociabilidade" value={breed.friendliness} />
                        <AttributeBar label="Exercício" value={breed.exercise_needs} />
                        <AttributeBar label="Cuidados pelo" value={breed.grooming_needs} />
                        <AttributeBar label="Solta pelo" value={breed.shedding_level} />
                      </div>

                      {/* Temperament */}
                      {breed.temperament_pt && (
                        <div>
                          <p className="text-xs font-semibold text-earth-400 uppercase mb-2">Temperamento</p>
                          <div className="flex flex-wrap gap-1.5">
                            {breed.temperament_pt.split(",").map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-100 text-brand-700">
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        href={`/buscar?breed=${encodeURIComponent(breed.name_pt)}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                      >
                        <PawPrint className="w-3.5 h-3.5" />
                        Ver canis com {breed.name_pt}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-earth-400">
          <p className="text-sm">Nenhuma raça encontrada para os filtros selecionados.</p>
          <button
            onClick={() => { setSearch(""); setSizeFilter("all"); setCoatFilter("all"); setGroupFilter("all"); }}
            className="mt-3 text-sm text-brand-600 hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
