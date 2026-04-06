"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import KennelCard from "@/components/kennel/KennelCard";
import { mockKennels, allBreeds, allStates } from "@/lib/mock-data";

export default function BuscarPage() {
  const [query, setQuery] = useState("");
  const [breed, setBreed] = useState("");
  const [state, setState] = useState("");
  const [availability, setAvailability] = useState<"all" | "now">("all");
  const [sortBy, setSortBy] = useState<"rating" | "years" | "reviews">("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let results = [...mockKennels];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k.city.toLowerCase().includes(q) ||
          k.breeds.some((b) => b.toLowerCase().includes(q))
      );
    }

    if (breed) {
      results = results.filter((k) => k.breeds.includes(breed));
    }

    if (state) {
      results = results.filter((k) => k.state === state);
    }

    if (availability === "now") {
      results = results.filter((k) =>
        k.puppies.some((p) => p.status === "available")
      );
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.fareja_rating ?? 0) - (a.fareja_rating ?? 0);
        case "years":
          return b.years_active - a.years_active;
        case "reviews":
          return b.fareja_reviews_count - a.fareja_reviews_count;
        default:
          return 0;
      }
    });

    // Premium first
    results.sort((a, b) => (a.plan === "premium" ? -1 : 1) - (b.plan === "premium" ? -1 : 1));

    return results;
  }, [query, breed, state, availability, sortBy]);

  const hasActiveFilters = breed || state || availability !== "all";

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
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-semibold">
              {[breed, state, availability !== "all"].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="p-4 mb-4 rounded-xl border border-earth-200 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">
                Raça
              </label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              >
                <option value="">Todas as raças</option>
                {allBreeds.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">
                Estado
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              >
                <option value="">Todos os estados</option>
                {allStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">
                Ordenar por
              </label>
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

          {/* Quick filters */}
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
                setBreed("");
                setState("");
                setAvailability("all");
              }}
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
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
