"use client";

import { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, X, Dog, Baby, Home as HomeIcon,
  Zap, Sparkles, ChevronDown, ChevronUp, HelpCircle, PawPrint,
} from "lucide-react";
import KennelCard from "@/components/kennel/KennelCard";
import { mockKennels, allBreeds, allStates, breedGuide } from "@/lib/mock-data";
import type { DogSize, ApartmentFit } from "@/types";

const sizeLabels: Record<DogSize, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  giant: "Gigante",
};

const aptLabels: Record<ApartmentFit, { label: string; cls: string }> = {
  yes: { label: "Sim", cls: "text-forest-600 bg-forest-50" },
  with_limitations: { label: "Com limitações", cls: "text-brand-600 bg-brand-100" },
  no: { label: "Não recomendado", cls: "text-red-600 bg-red-50" },
};

const energyLabels: Record<string, string> = { low: "Baixa", medium: "Média", high: "Alta" };
const groomingLabels: Record<string, string> = { low: "Pouca", medium: "Média", high: "Muita" };

export default function BuscarPage() {
  const [query, setQuery] = useState("");
  const [breed, setBreed] = useState("");
  const [state, setState] = useState("");
  const [availability, setAvailability] = useState<"all" | "now">("all");
  const [sortBy, setSortBy] = useState<"rating" | "years" | "reviews">("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Breed guide filters
  const [showGuide, setShowGuide] = useState(false);
  const [sizeFilter, setSizeFilter] = useState<DogSize | "">("");
  const [kidsFilter, setKidsFilter] = useState(false);
  const [aptFilter, setAptFilter] = useState<ApartmentFit | "">("");
  const [selectedGuideBreed, setSelectedGuideBreed] = useState<string | null>(null);

  // Filtered breed guide
  const filteredGuide = useMemo(() => {
    return breedGuide.filter((b) => {
      if (sizeFilter && b.size !== sizeFilter) return false;
      if (kidsFilter && !b.good_with_kids) return false;
      if (aptFilter && b.apartment_friendly !== aptFilter) return false;
      return true;
    });
  }, [sizeFilter, kidsFilter, aptFilter]);

  const selectedBreedInfo = selectedGuideBreed
    ? breedGuide.find((b) => b.name === selectedGuideBreed)
    : null;

  // Kennel search
  const filtered = useMemo(() => {
    let results = [...mockKennels];

    const searchBreed = selectedGuideBreed || breed;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k.city.toLowerCase().includes(q) ||
          k.breeds.some((b) => b.toLowerCase().includes(q))
      );
    }

    if (searchBreed) {
      results = results.filter((k) => k.breeds.includes(searchBreed));
    }

    if (state) {
      results = results.filter((k) => k.state === state);
    }

    if (availability === "now") {
      results = results.filter((k) => k.puppies.some((p) => p.status === "available"));
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "rating": return (b.fareja_rating ?? 0) - (a.fareja_rating ?? 0);
        case "years": return b.years_active - a.years_active;
        case "reviews": return b.fareja_reviews_count - a.fareja_reviews_count;
        default: return 0;
      }
    });

    // Premium/super_premium first
    const planOrder = { super_premium: 0, premium: 1, basic: 2 };
    results.sort((a, b) => (planOrder[a.plan] ?? 2) - (planOrder[b.plan] ?? 2));

    return results;
  }, [query, breed, state, availability, sortBy, selectedGuideBreed]);

  const hasActiveFilters = breed || state || availability !== "all" || sizeFilter || kidsFilter || aptFilter || selectedGuideBreed;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-earth-900 mb-1">
        Buscar canis verificados
      </h1>
      <p className="text-sm text-earth-500 mb-6">
        {filtered.length} cani{filtered.length !== 1 ? "s" : ""} encontrado
        {filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou raça..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? "border-brand-400 bg-brand-50 text-brand-600"
              : "border-earth-200 bg-white text-earth-600 hover:bg-earth-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Breed guide toggle */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className={`w-full flex items-center justify-between px-4 py-3 mb-4 rounded-xl border text-sm font-medium transition-colors ${
          showGuide
            ? "bg-brand-50 border-brand-300 text-brand-700"
            : "bg-white border-earth-200 text-earth-600 hover:bg-earth-50"
        }`}
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Não sabe qual raça escolher? Use nosso guia
        </span>
        {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* ── Breed Guide ── */}
      {showGuide && (
        <div className="mb-6 p-5 rounded-xl border border-brand-200 bg-brand-50/30 space-y-4">
          <h3 className="text-sm font-semibold text-earth-800">Encontre a raça ideal para você</h3>

          {/* Guide filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Porte</label>
              <div className="flex flex-wrap gap-1.5">
                {(["small", "medium", "large", "giant"] as DogSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSizeFilter(sizeFilter === s ? "" : s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      sizeFilter === s
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"
                    }`}
                  >
                    {sizeLabels[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Apartamento</label>
              <div className="flex flex-wrap gap-1.5">
                {(["yes", "with_limitations"] as ApartmentFit[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAptFilter(aptFilter === a ? "" : a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      aptFilter === a
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"
                    }`}
                  >
                    {a === "yes" ? "Ideal" : "Possível"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Crianças</label>
              <button
                onClick={() => setKidsFilter(!kidsFilter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  kidsFilter
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"
                }`}
              >
                <span className="flex items-center gap-1">
                  <Baby className="w-3 h-3" />
                  Bom com crianças
                </span>
              </button>
            </div>
          </div>

          {/* Breed cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredGuide.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  setSelectedGuideBreed(selectedGuideBreed === b.name ? null : b.name);
                  setBreed("");
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGuideBreed === b.name
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-300"
                    : "border-earth-200 bg-white hover:border-earth-300"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-earth-100 flex items-center justify-center mb-2 text-lg">
                  🐕
                </div>
                <div className="text-xs font-semibold text-earth-800 mb-0.5">{b.name}</div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-earth-100 text-earth-600">
                    {sizeLabels[b.size]}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${aptLabels[b.apartment_friendly].cls}`}>
                    Apto: {aptLabels[b.apartment_friendly].label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filteredGuide.length === 0 && (
            <div className="text-center py-6 text-sm text-earth-400">
              Nenhuma raça encontrada com esses filtros. Tente combinações diferentes.
            </div>
          )}

          {/* Selected breed detail */}
          {selectedBreedInfo && (
            <div className="p-4 rounded-xl bg-white border border-brand-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold text-earth-900">{selectedBreedInfo.name}</h4>
                  <p className="text-xs text-earth-500 mt-1 leading-relaxed">{selectedBreedInfo.description}</p>
                </div>
                <button
                  onClick={() => setSelectedGuideBreed(null)}
                  className="text-earth-400 hover:text-earth-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-earth-50 text-center">
                  <div className="text-xs font-semibold text-earth-700">{sizeLabels[selectedBreedInfo.size]}</div>
                  <div className="text-[10px] text-earth-400">Porte</div>
                </div>
                <div className="p-2.5 rounded-lg bg-earth-50 text-center">
                  <div className="text-xs font-semibold text-earth-700">{energyLabels[selectedBreedInfo.energy_level]}</div>
                  <div className="text-[10px] text-earth-400">Energia</div>
                </div>
                <div className="p-2.5 rounded-lg bg-earth-50 text-center">
                  <div className="text-xs font-semibold text-earth-700">{groomingLabels[selectedBreedInfo.grooming]}</div>
                  <div className="text-[10px] text-earth-400">Manutenção</div>
                </div>
                <div className={`p-2.5 rounded-lg text-center ${aptLabels[selectedBreedInfo.apartment_friendly].cls}`}>
                  <div className="text-xs font-semibold">{aptLabels[selectedBreedInfo.apartment_friendly].label}</div>
                  <div className="text-[10px] opacity-70">Apartamento</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedBreedInfo.traits.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-brand-100 text-brand-600">
                    {t}
                  </span>
                ))}
                {selectedBreedInfo.good_with_kids && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-forest-50 text-forest-600 flex items-center gap-1">
                    <Baby className="w-2.5 h-2.5" />
                    Bom com crianças
                  </span>
                )}
              </div>

              <button
                onClick={() => {/* breed already selected, scroll to results */}}
                className="w-full py-2.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors"
              >
                Ver canis com {selectedBreedInfo.name}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Standard filters */}
      {showFilters && (
        <div className="p-4 mb-4 rounded-xl border border-earth-200 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Raça</label>
              <select
                value={selectedGuideBreed || breed}
                onChange={(e) => { setBreed(e.target.value); setSelectedGuideBreed(null); }}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              >
                <option value="">Todas as raças</option>
                {allBreeds.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Estado</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              >
                <option value="">Todos os estados</option>
                {allStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              >
                <option value="rating">Melhor avaliação</option>
                <option value="years">Mais experiente</option>
                <option value="reviews">Mais avaliações</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAvailability(availability === "now" ? "all" : "now")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                availability === "now"
                  ? "bg-forest-50 text-forest-600 border-forest-200"
                  : "bg-white text-earth-500 border-earth-200 hover:bg-earth-50"
              }`}
            >
              Com filhotes agora
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setBreed(""); setState(""); setAvailability("all");
                setSizeFilter(""); setKidsFilter(false); setAptFilter("");
                setSelectedGuideBreed(null);
              }}
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              <X className="w-3 h-3" />
              Limpar todos os filtros
            </button>
          )}
        </div>
      )}

      {/* Active breed from guide */}
      {selectedGuideBreed && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-brand-50 border border-brand-200">
          <PawPrint className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-xs font-medium text-brand-700">
            Filtrando por: {selectedGuideBreed}
          </span>
          <button onClick={() => setSelectedGuideBreed(null)} className="ml-auto text-brand-500 hover:text-brand-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {filtered.map((kennel) => (
          <KennelCard key={kennel.id} kennel={kennel} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🐾</div>
            <h3 className="text-base font-semibold text-earth-700 mb-1">
              Nenhum canil encontrado
            </h3>
            <p className="text-sm text-earth-400">
              Tente alterar os filtros ou buscar por outro termo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
