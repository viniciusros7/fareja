"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, MapPin, CheckCircle2, Star, Building2, Truck,
  Loader2, X, SlidersHorizontal, Lock, Gem, Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";

type KennelRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  cover_url: string | null;
  years_active: number;
  kc_registry: string;
  plan: "basic" | "premium" | "super_premium";
  breeds: string[];
  offers_hotel: boolean;
  offers_transport: boolean;
  fareja_rating: number | null;
  fareja_reviews_count: number;
  google_rating: number | null;
  google_reviews_count: number | null;
};

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
  "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
  "RO","RR","RS","SC","SE","SP","TO",
];

function uuidSeed(id: string): number {
  return (parseInt(id.replace(/-/g, "").slice(0, 8), 16) % 90) + 10;
}

function KennelCard({ kennel }: { kennel: KennelRow }) {
  const seed = uuidSeed(kennel.id);

  return (
    <Link
      href={`/canis/${kennel.id}`}
      className="block rounded-xl border border-earth-200 bg-white hover:border-brand-300 hover:shadow-md transition-all group overflow-hidden"
    >
      <div className="relative h-36 w-full bg-earth-100">
        <Image
          src={kennel.cover_url ?? `https://placedog.net/400/150?id=${seed}`}
          alt={kennel.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {kennel.plan === "super_premium" && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm">
            <Gem className="w-2.5 h-2.5" />
            Elite
          </span>
        )}
        {kennel.plan === "premium" && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-600 text-white shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            Premium
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="flex-1 text-[15px] font-semibold text-earth-900 group-hover:text-brand-600 transition-colors leading-snug">
            {kennel.name}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-50 text-forest-700">
            <CheckCircle2 className="w-3 h-3" />
            Verificado
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-earth-500 mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          {kennel.city}, {kennel.state}
          {kennel.years_active > 0 && (
            <span className="text-earth-300 ml-1">· {kennel.years_active} anos</span>
          )}
        </div>

        {kennel.breeds.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {kennel.breeds.slice(0, 3).map((b) => (
              <span key={b} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                {b}
              </span>
            ))}
            {kennel.breeds.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-earth-100 text-earth-500">
                +{kennel.breeds.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-earth-100">
          <div className="flex gap-1.5">
            {kennel.offers_hotel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-50 text-brand-600">
                <Building2 className="w-2.5 h-2.5" />
                Hotel
              </span>
            )}
            {kennel.offers_transport && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-50 text-brand-600">
                <Truck className="w-2.5 h-2.5" />
                Entrega
              </span>
            )}
          </div>

          {(kennel.fareja_rating ?? kennel.google_rating) ? (
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 text-brand-400 fill-brand-400" />
              <span className="font-semibold text-earth-800">
                {kennel.fareja_rating ?? kennel.google_rating}
              </span>
              <span className="text-earth-400">
                ({kennel.fareja_reviews_count + (kennel.google_reviews_count ?? 0)})
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function CanisPage() {
  const { user } = useUser();
  const [kennels, setKennels] = useState<KennelRow[]>([]);
  const [breedNames, setBreedNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [offersHotel, setOffersHotel] = useState(false);
  const [offersTransport, setOffersTransport] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "name" | "state">("rating");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("kennels").select("*").eq("status", "approved"),
      supabase.from("breeds").select("name_pt").order("name_pt"),
    ]).then(([{ data: kData }, { data: bData }]) => {
      setKennels((kData as KennelRow[]) ?? []);
      setBreedNames(((bData ?? []) as { name_pt: string }[]).map((b) => b.name_pt));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let results = [...kennels];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k.city.toLowerCase().includes(q) ||
          k.breeds.some((b) => b.toLowerCase().includes(q))
      );
    }
    if (stateFilter) results = results.filter((k) => k.state === stateFilter);
    if (cityFilter)
      results = results.filter((k) =>
        k.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    if (breedFilter)
      results = results.filter((k) =>
        k.breeds.some((b) => b.toLowerCase().includes(breedFilter.toLowerCase()))
      );
    if (offersHotel) results = results.filter((k) => k.offers_hotel);
    if (offersTransport) results = results.filter((k) => k.offers_transport);

    const planOrder: Record<string, number> = { super_premium: 0, premium: 1, basic: 2 };

    if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    } else if (sortBy === "state") {
      results.sort((a, b) => a.state.localeCompare(b.state));
    } else {
      results.sort(
        (a, b) =>
          (b.fareja_rating ?? b.google_rating ?? 0) -
          (a.fareja_rating ?? a.google_rating ?? 0)
      );
    }

    results.sort((a, b) => (planOrder[a.plan] ?? 2) - (planOrder[b.plan] ?? 2));

    return results;
  }, [kennels, query, stateFilter, cityFilter, breedFilter, offersHotel, offersTransport, sortBy]);

  const activeFilterCount = [stateFilter, cityFilter, breedFilter, offersHotel, offersTransport].filter(Boolean).length;

  function clearFilters() {
    setStateFilter("");
    setCityFilter("");
    setBreedFilter("");
    setOffersHotel(false);
    setOffersTransport(false);
    setSortBy("rating");
  }

  const visibleKennels = user ? filtered : filtered.slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-brand-900 mb-1">
        Canis verificados
      </h1>
      <p className="text-sm text-earth-500 mb-6">
        {loading
          ? "Carregando..."
          : `${filtered.length} cani${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {/* Busca + toggle filtros */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou raça..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-brand-400 bg-brand-50 text-brand-600"
              : "border-earth-200 bg-white text-earth-600 hover:bg-earth-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Painel de filtros */}
      {showFilters && (
        <div className="p-4 mb-4 rounded-xl border border-earth-200 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Estado</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              >
                <option value="">Todos os estados</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Cidade</label>
              <input
                type="text"
                placeholder="Ex: São Paulo"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-500 mb-1">Raça</label>
              <select
                value={breedFilter}
                onChange={(e) => setBreedFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              >
                <option value="">Todas as raças</option>
                {breedNames.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium text-earth-500 mb-1.5">Ordenar por</p>
              <div className="flex gap-1.5">
                {(["rating", "name", "state"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      sortBy === s
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"
                    }`}
                  >
                    {s === "rating" ? "Avaliação" : s === "name" ? "Nome" : "Estado"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-earth-500 mb-1.5">Serviços</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setOffersHotel(!offersHotel)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    offersHotel
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  Hotel pós-venda
                </button>
                <button
                  onClick={() => setOffersTransport(!offersTransport)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    offersTransport
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  Transporte
                </button>
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Resultados */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleKennels.map((kennel) => (
              <KennelCard key={kennel.id} kennel={kennel} />
            ))}
          </div>

          {/* Blur gate para não-logados */}
          {!user && filtered.length > 2 && (
            <div className="relative mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-none select-none">
                {filtered.slice(2, 8).map((kennel) => (
                  <div key={kennel.id} className="blur-sm opacity-60">
                    <KennelCard kennel={kennel} />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm border border-earth-200 rounded-2xl p-6 text-center shadow-lg mx-4 max-w-sm w-full">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="text-base font-semibold text-earth-900 mb-1">
                    Veja todos os canis verificados
                  </h3>
                  <p className="text-xs text-earth-500 mb-4 leading-relaxed">
                    Você está vendo 2 de {filtered.length} canis. Crie sua conta grátis para acessar a lista completa.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
                  >
                    Criar conta grátis
                  </Link>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🐾</div>
              <h3 className="text-base font-semibold text-earth-700 mb-1">
                Nenhum canil encontrado
              </h3>
              <p className="text-sm text-earth-400 mb-4">
                Tente alterar os filtros ou buscar por outro termo.
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
