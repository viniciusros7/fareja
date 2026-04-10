"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, PawPrint, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useFavorites } from "@/lib/hooks/useFavorites";
import BreedImage from "@/components/BreedImage";
import type { BreedRow } from "@/lib/queries/breeds";

type KennelSnippet = {
  id: string;
  name: string;
  city: string;
  state: string;
  cover_url: string | null;
  breeds: string[];
};

function uuidSeed(id: string): number {
  return (parseInt(id.replace(/-/g, "").slice(0, 8), 16) % 90) + 10;
}

export default function FavoritosPage() {
  const { favorites, loading: favLoading } = useFavorites();
  const [breeds, setBreeds] = useState<BreedRow[]>([]);
  const [kennels, setKennels] = useState<KennelSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favLoading) return;

    const breedIds = favorites.filter((f) => f.breed_id).map((f) => f.breed_id as string);
    const kennelIds = favorites.filter((f) => f.kennel_id).map((f) => f.kennel_id as string);

    if (breedIds.length === 0 && kennelIds.length === 0) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const tasks: Promise<void>[] = [];

    if (breedIds.length > 0) {
      tasks.push(
        supabase
          .from("breeds")
          .select("*")
          .in("id", breedIds)
          .then(({ data }) => {
            setBreeds((data as BreedRow[]) ?? []);
          }) as Promise<void>
      );
    }

    if (kennelIds.length > 0) {
      tasks.push(
        supabase
          .from("kennels")
          .select("id, name, city, state, cover_url, breeds")
          .in("id", kennelIds)
          .then(({ data }) => {
            setKennels((data as KennelSnippet[]) ?? []);
          }) as Promise<void>
      );
    }

    Promise.all(tasks).then(() => setLoading(false));
  }, [favorites, favLoading]);

  const isEmpty = breeds.length === 0 && kennels.length === 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-earth-900 mb-1">Meus favoritos</h2>
        <p className="text-sm text-earth-500">Raças e canis que você salvou para consultar depois.</p>
      </div>

      {(favLoading || loading) && (
        <div className="flex items-center justify-center py-16 gap-3 text-earth-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando...
        </div>
      )}

      {!favLoading && !loading && isEmpty && (
        <div className="text-center py-16">
          <Heart className="w-10 h-10 text-earth-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-earth-500 mb-1">Nenhum favorito ainda</p>
          <p className="text-xs text-earth-400 mb-6">
            Clique no coração em raças e canis para salvá-los aqui.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/racas"
              className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
            >
              Explorar raças
            </Link>
            <Link
              href="/canis"
              className="px-4 py-2 border border-earth-200 text-earth-700 text-sm font-semibold rounded-xl hover:bg-earth-50 transition-colors"
            >
              Ver canis
            </Link>
          </div>
        </div>
      )}

      {!favLoading && !loading && breeds.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-earth-700 mb-3 flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-brand-400" />
            Raças ({breeds.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {breeds.map((breed, i) => (
              <Link
                key={breed.id}
                href="/racas"
                className="rounded-xl border border-earth-200 bg-white overflow-hidden hover:border-brand-300 hover:shadow-sm transition-all group"
              >
                <div className="relative h-32 w-full">
                  <BreedImage
                    nameEn={breed.name_en}
                    alt={breed.name_pt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    fallbackSeed={i + 10}
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-earth-900">{breed.name_pt}</div>
                  <div className="text-xs text-earth-400">{breed.name_en}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!favLoading && !loading && kennels.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-earth-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-forest-500" />
            Canis ({kennels.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kennels.map((kennel) => {
              const seed = uuidSeed(kennel.id);
              return (
                <Link
                  key={kennel.id}
                  href={`/canis/${kennel.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-earth-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all group"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={kennel.cover_url ?? `https://placedog.net/80/80?id=${seed}`}
                      alt={kennel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-earth-900 truncate group-hover:text-brand-600 transition-colors">
                      {kennel.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-earth-400 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {kennel.city}, {kennel.state}
                    </div>
                    {kennel.breeds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {kennel.breeds.slice(0, 2).map((b) => (
                          <span key={b} className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
