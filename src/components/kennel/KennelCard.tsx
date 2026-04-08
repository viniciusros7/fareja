"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, CheckCircle2, Clock, PawPrint, Gem, Sparkles } from "lucide-react";
import type { Kennel } from "@/types";

interface KennelCardProps {
  kennel: Kennel & { puppies?: { status: string }[] };
}

export default function KennelCard({ kennel }: KennelCardProps) {
  const availableCount = kennel.puppies?.filter((p) => p.status === "available").length ?? 0;
  const imgId = parseInt(kennel.id) + 30;

  return (
    <Link
      href={`/canil/${kennel.slug}`}
      className="block rounded-xl border border-earth-200 bg-white card-hover group overflow-hidden"
    >
      {/* Cover image */}
      <div className="relative h-32 w-full">
        <Image
          src={`https://placedog.net/400/150?id=${imgId}`}
          alt={kennel.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm -mt-8">
            <Image
              src={`https://placedog.net/48/48?id=${parseInt(kennel.id)}`}
              alt={kennel.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-semibold text-earth-900 group-hover:text-brand-600 transition-colors truncate">
                {kennel.name}
              </h3>
              <span className="badge-verified">
                <CheckCircle2 className="w-3 h-3" />
                Verificado
              </span>
              {kennel.plan === "premium" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-600 text-white">
                  <Sparkles className="w-2.5 h-2.5" />
                  Premium
                </span>
              )}
              {kennel.plan === "super_premium" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white">
                  <Gem className="w-2.5 h-2.5" />
                  Elite
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-earth-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {kennel.city}, {kennel.state}
              </span>
              <span>{kennel.years_active} anos</span>
              <span>{kennel.kc_registry}</span>
            </div>
          </div>
        </div>

        {/* Breeds */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {kennel.breeds.map((breed) => (
            <span
              key={breed}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700"
            >
              {breed}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-earth-100">
          <div className="flex items-center gap-4 text-xs">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
              <span className="font-semibold text-earth-800">
                {kennel.fareja_rating ?? kennel.google_rating ?? "–"}
              </span>
              <span className="text-earth-400">
                ({kennel.fareja_reviews_count + (kennel.google_reviews_count ?? 0)})
              </span>
            </div>

            {/* Availability */}
            {availableCount > 0 ? (
              <span className="flex items-center gap-1 text-forest-500 font-medium">
                <PawPrint className="w-3 h-3" />
                {availableCount} disponíve{availableCount === 1 ? "l" : "is"}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-earth-400">
                <Clock className="w-3 h-3" />
                Em breve
              </span>
            )}
          </div>

          {/* Verification badges */}
          <div className="flex items-center gap-1.5">
            {kennel.microchip && (
              <span className="w-6 h-6 rounded-full bg-forest-50 text-forest-500 flex items-center justify-center text-[10px]" title="Microchip">
                μ
              </span>
            )}
            {kennel.vaccines && (
              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px]" title="Vacinado">
                V
              </span>
            )}
            {kennel.dna_tests && (
              <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-[10px]" title="DNA">
                D
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
