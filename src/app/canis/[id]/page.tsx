"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, MapPin, CheckCircle2, Star, Phone,
  AtSign, Globe, ShieldCheck, PawPrint, Dna, Syringe,
  Home, Heart, Building2, Truck, Lock, Loader2, Gem, Sparkles,
  MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import BreedImage from "@/components/BreedImage";

type KennelRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  address: string | null;
  phone: string;
  email: string;
  instagram: string | null;
  website: string | null;
  whatsapp: string | null;
  logo_url: string | null;
  cover_url: string | null;
  years_active: number;
  kc_registry: string;
  kc_entity: string;
  plan: "basic" | "premium" | "super_premium";
  status: string;
  verified_at: string | null;
  breeds: string[];
  breeds_offered: string[] | null;
  offers_hotel: boolean;
  offers_transport: boolean;
  fareja_rating: number | null;
  fareja_reviews_count: number;
  google_rating: number | null;
  google_reviews_count: number | null;
  microchip: boolean;
  vaccines: boolean;
  dna_tests: boolean;
  facilities_approved: boolean;
  birth_control: boolean;
};

type BreedRow = {
  id: string;
  name_pt: string;
  name_en: string;
  breed_group: string | null;
  size: string | null;
};

function uuidSeed(id: string): number {
  return (parseInt(id.replace(/-/g, "").slice(0, 8), 16) % 90) + 10;
}

export default function CanilDetalhePage() {
  const params = useParams();
  const { user } = useUser();
  const [kennel, setKennel] = useState<KennelRow | null>(null);
  const [breedDetails, setBreedDetails] = useState<BreedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const supabase = createClient();

    supabase
      .from("kennels")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const k = data as KennelRow;
        setKennel(k);

        const offered = k.breeds_offered ?? [];
        if (offered.length > 0) {
          supabase
            .from("breeds")
            .select("id, name_pt, name_en, breed_group, size")
            .in("id", offered)
            .then(({ data: bData }) => {
              setBreedDetails((bData as BreedRow[]) ?? []);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !kennel) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-3">🐾</div>
        <h2 className="font-display text-xl font-semibold text-earth-800 mb-2">
          Canil não encontrado
        </h2>
        <Link href="/canis" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          ← Voltar à busca
        </Link>
      </div>
    );
  }

  const seed = uuidSeed(kennel.id);

  const verifications = [
    { icon: ShieldCheck, label: `Registro ${kennel.kc_registry} (${kennel.kc_entity})`, ok: true },
    { icon: PawPrint, label: "Microchipagem obrigatória", ok: kennel.microchip },
    { icon: Syringe, label: "Vacinação completa (V8/V10 + Raiva)", ok: kennel.vaccines },
    { icon: Dna, label: "Testes genéticos (DNA)", ok: kennel.dna_tests },
    { icon: Home, label: "Instalações aprovadas CRMV", ok: kennel.facilities_approved },
    { icon: Heart, label: "Controle de natalidade documentado", ok: kennel.birth_control },
  ];

  const whatsappNumber = kennel.whatsapp?.replace(/\D/g, "") ?? "";
  const whatsappUrl = whatsappNumber ? `https://wa.me/55${whatsappNumber}` : null;
  const instagramUrl = kennel.instagram
    ? `https://instagram.com/${kennel.instagram.replace("@", "")}`
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28">
      {/* Voltar */}
      <Link
        href="/canis"
        className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos resultados
      </Link>

      {/* Capa */}
      <div className="relative h-52 w-full rounded-2xl overflow-hidden mb-6">
        <Image
          src={kennel.cover_url ?? `https://placedog.net/800/300?id=${seed}`}
          alt={`${kennel.name} – capa`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md -mt-12 bg-earth-100">
          <Image
            src={kennel.logo_url ?? `https://placedog.net/80/80?id=${seed + 1}`}
            alt={kennel.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="font-display text-2xl font-semibold text-brand-900">
              {kennel.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-forest-50 text-forest-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verificado Fareja
            </span>
            {kennel.plan === "super_premium" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm">
                <Gem className="w-2.5 h-2.5" />
                Elite
              </span>
            )}
            {kennel.plan === "premium" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-600 text-white">
                <Sparkles className="w-2.5 h-2.5" />
                Premium
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-earth-500 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {kennel.city}, {kennel.state}
            </span>
            {kennel.years_active > 0 && (
              <span>{kennel.years_active} anos de atividade</span>
            )}
            <span>{kennel.kc_registry}</span>
          </div>
        </div>
      </div>

      {/* Avaliações */}
      {(kennel.fareja_rating || kennel.google_rating) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {kennel.fareja_rating ? (
            <div className="p-3.5 rounded-xl bg-earth-50 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-semibold text-earth-800">
                <Star className="w-4 h-4 text-brand-400 fill-brand-400" />
                {kennel.fareja_rating}
              </div>
              <div className="text-[11px] text-earth-400 mt-0.5">
                {kennel.fareja_reviews_count} avaliações Fareja
              </div>
            </div>
          ) : null}
          {kennel.google_rating ? (
            <div className="p-3.5 rounded-xl bg-earth-50 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-semibold text-earth-800">
                <Star className="w-4 h-4 text-brand-400 fill-brand-400" />
                {kennel.google_rating}
              </div>
              <div className="text-[11px] text-earth-400 mt-0.5">
                {kennel.google_reviews_count} avaliações Google
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Sobre */}
      {kennel.description && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
            Sobre o canil
          </h2>
          <p className="text-sm text-earth-600 leading-relaxed whitespace-pre-line">
            {kennel.description}
          </p>
        </div>
      )}

      {/* Raças */}
      {(breedDetails.length > 0 || kennel.breeds.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
            Raças criadas
          </h2>
          {breedDetails.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {breedDetails.map((breed, idx) => (
                <div
                  key={breed.id}
                  className="rounded-xl border border-earth-200 overflow-hidden bg-white"
                >
                  <div className="relative h-28">
                    <BreedImage
                      nameEn={breed.name_en}
                      alt={breed.name_pt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                      fallbackSeed={idx + 10}
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs font-semibold text-earth-800">{breed.name_pt}</div>
                    {breed.breed_group && (
                      <div className="text-[10px] text-earth-400">{breed.breed_group}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {kennel.breeds.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Serviços */}
      {(kennel.offers_hotel || kennel.offers_transport) && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
            Serviços adicionais
          </h2>
          <div className="flex flex-wrap gap-3">
            {kennel.offers_hotel && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-earth-200 bg-white flex-1 min-w-[180px]">
                <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-earth-800">Hotel pós-venda</div>
                  <div className="text-xs text-earth-500 mt-0.5 leading-relaxed">
                    O canil oferece hospedagem para o seu cão após a compra.
                  </div>
                </div>
              </div>
            )}
            {kennel.offers_transport && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-earth-200 bg-white flex-1 min-w-[180px]">
                <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-earth-800">Transporte de filhote</div>
                  <div className="text-xs text-earth-500 mt-0.5 leading-relaxed">
                    O canil realiza entrega do filhote com segurança.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verificações */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
          Verificações
        </h2>
        <div className="space-y-2">
          {verifications.map((v) => (
            <div key={v.label} className="flex items-center gap-3 py-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  v.ok ? "bg-forest-50 text-forest-500" : "bg-earth-100 text-earth-400"
                }`}
              >
                <v.icon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-sm flex-1 ${v.ok ? "text-earth-700" : "text-earth-400"}`}>
                {v.label}
              </span>
              {v.ok && (
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Barra de contato fixa */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white/90 backdrop-blur-md border-t border-earth-200 shadow-lg">
        <div className="max-w-3xl mx-auto">
          {user ? (
            <div className="flex flex-wrap gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              <a
                href={`tel:${kennel.phone}`}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-colors ${
                  whatsappUrl
                    ? "bg-white border border-earth-200 text-earth-700 hover:bg-earth-50"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                <Phone className="w-4 h-4" />
                {kennel.phone}
              </a>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-earth-200 text-earth-700 text-sm font-semibold rounded-xl hover:bg-earth-50 transition-colors"
                >
                  <AtSign className="w-4 h-4" />
                  <span className="hidden sm:inline">{kennel.instagram}</span>
                </a>
              )}
              {kennel.website && (
                <a
                  href={kennel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-earth-200 text-earth-700 text-sm font-semibold rounded-xl hover:bg-earth-50 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Site</span>
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-earth-400" />
                <span className="text-sm text-earth-600">
                  Faça login para ver os dados de contato
                </span>
              </div>
              <Link
                href="/login"
                className="shrink-0 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
