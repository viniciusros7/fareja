"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, CheckCircle2, Clock, PawPrint, Gem, Sparkles, Shield } from "lucide-react";
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
      className="block bg-white rounded-2xl border border-earth-100 overflow-hidden group transition-all duration-200 hover:shadow-[0_4px_20px_rgba(61,27,15,0.10)] hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* Hero image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={`https://placedog.net/600/220?id=${imgId}`}
          alt={kennel.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
        {/* Plan badge overlay */}
        <div className="absolute top-3 right-3">
          {kennel.plan === "super_premium" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md">
              <Gem className="w-2.5 h-2.5" />
              Elite
            </span>
          )}
          {kennel.plan === "premium" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-brand-600 text-white shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Avatar + name row */}
        <div className="flex items-start gap-3 -mt-8 mb-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-[3px] border-white shadow-sm bg-earth-100">
            <Image
              src={`https://placedog.net/56/56?id=${parseInt(kennel.id)}`}
              alt={kennel.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex-1 min-w-0 pt-8">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-[15px] font-semibold text-earth-900 group-hover:text-brand-600 transition-colors truncate leading-tight">
                {kennel.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-forest-50 text-forest-600">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Verificado
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-earth-400">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{kennel.city}, {kennel.state}</span>
              <span className="text-earth-200 mx-1">·</span>
              <span>{kennel.years_active}a</span>
            </div>
          </div>
        </div>

        {/* Breed chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {kennel.breeds.slice(0, 3).map((breed) => (
            <span
              key={breed}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-50 text-brand-700"
            >
              {breed}
            </span>
          ))}
          {kennel.breeds.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-earth-100 text-earth-500">
              +{kennel.breeds.length - 3}
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-earth-50">
          <div className="flex items-center gap-3 text-xs">
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
                <PawPrint className="w-3 h-3 fill-forest-100 stroke-forest-500" />
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
          <div className="flex items-center gap-1">
            {kennel.microchip && (
              <span
                title="Microchip"
                className="w-5 h-5 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center text-[9px] font-bold"
              >
                μ
              </span>
            )}
            {kennel.dna_tests && (
              <span
                title="Testes DNA"
                className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center"
              >
                <Shield className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
