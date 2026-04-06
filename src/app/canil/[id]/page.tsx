"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Star, MapPin, CheckCircle2, Phone, Mail,
  AtSign, Globe, PawPrint, Dna, Syringe, ShieldCheck,
  Home, Heart, Clock, ExternalLink, Sparkles,
} from "lucide-react";
import { mockKennels, mockReviews } from "@/lib/mock-data";

export default function KennelDetailPage() {
  const params = useParams();
  const kennel = mockKennels.find((k) => k.slug === params.id);

  if (!kennel) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-3">🐾</div>
        <h2 className="font-display text-xl font-semibold text-earth-800 mb-2">
          Canil não encontrado
        </h2>
        <Link href="/buscar" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          ← Voltar à busca
        </Link>
      </div>
    );
  }

  const reviews = mockReviews.filter((r) => r.kennel_id === kennel.id);
  const availablePuppies = kennel.puppies.filter((p) => p.status === "available");
  const upcomingPuppies = kennel.puppies.filter((p) => p.status === "upcoming");

  const verifications = [
    { icon: ShieldCheck, label: `Registro ${kennel.kc_registry}`, ok: true },
    { icon: PawPrint, label: "Microchipagem obrigatória", ok: kennel.microchip },
    { icon: Syringe, label: "Vacinação completa (V8/V10 + Raiva)", ok: kennel.vaccines },
    { icon: Dna, label: "Testes genéticos (DNA)", ok: kennel.dna_tests },
    { icon: Home, label: "Instalações aprovadas CRMV", ok: kennel.facilities_approved },
    { icon: Heart, label: "Controle de natalidade documentado", ok: kennel.birth_control },
  ];

  const initials = kennel.name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back */}
      <Link
        href="/buscar"
        className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos resultados
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xl shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="font-display text-2xl font-semibold text-earth-900">
              {kennel.name}
            </h1>
            <span className="badge-verified">
              <CheckCircle2 className="w-3 h-3" />
              Verificado Fareja
            </span>
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
            <span>{kennel.years_active} anos de atividade</span>
            <span>{kennel.kc_registry}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {kennel.breeds.map((b) => (
              <span key={b} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Avaliação Fareja", value: `★ ${kennel.fareja_rating ?? "–"}`, sub: `${kennel.fareja_reviews_count} avaliações` },
          { label: "Avaliação Google", value: `★ ${kennel.google_rating ?? "–"}`, sub: `${kennel.google_reviews_count} avaliações` },
          { label: "Disponíveis agora", value: String(availablePuppies.length), sub: "filhotes" },
          { label: "Em breve", value: String(upcomingPuppies.length), sub: "previstos" },
        ].map((s) => (
          <div key={s.label} className="p-3.5 rounded-xl bg-earth-50 text-center">
            <div className="text-lg font-semibold text-earth-800">{s.value}</div>
            <div className="text-[11px] text-earth-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
          Sobre o canil
        </h2>
        <p className="text-sm text-earth-600 leading-relaxed whitespace-pre-line">
          {kennel.description}
        </p>
      </div>

      {/* Verifications */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
          Verificações
        </h2>
        <div className="space-y-2">
          {verifications.map((v) => (
            <div key={v.label} className="flex items-center gap-3 py-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${v.ok ? "bg-forest-50 text-forest-500" : "bg-earth-100 text-earth-400"}`}>
                <v.icon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-sm ${v.ok ? "text-earth-700" : "text-earth-400"}`}>
                {v.label}
              </span>
              {v.ok && <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 ml-auto" />}
            </div>
          ))}
        </div>
      </div>

      {/* Breeders */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
          Reprodutores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {kennel.breeders.map((b) => (
            <div key={b.id} className="p-4 rounded-xl border border-earth-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-semibold">
                  {b.sex === "male" ? "♂" : "♀"}
                </span>
                <div>
                  <div className="text-sm font-semibold text-earth-800">{b.name}</div>
                  <div className="text-[11px] text-earth-400">{b.breed}</div>
                </div>
              </div>
              <div className="text-xs text-earth-500 space-y-1">
                <div>Registro: {b.registry}</div>
                {b.titles && <div>Títulos: {b.titles}</div>}
                {b.health_tests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {b.health_tests.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-forest-50 text-forest-500">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Puppies */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
          Filhotes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {kennel.puppies.map((p) => {
            const statusMap: Record<string, { label: string; cls: string }> = {
              available: { label: "Disponível", cls: "bg-forest-50 text-forest-600" },
              reserved: { label: "Reservado", cls: "bg-brand-100 text-brand-600" },
              sold: { label: "Vendido", cls: "bg-earth-100 text-earth-500" },
              upcoming: { label: "Em breve", cls: "bg-blue-50 text-blue-700" },
            };
            const st = statusMap[p.status] ?? statusMap.upcoming;

            return (
              <div key={p.id} className="p-4 rounded-xl border border-earth-200 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-earth-800">{p.name}</div>
                    <div className="text-[11px] text-earth-400">{p.breed} · {p.sex === "male" ? "Macho" : "Fêmea"}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.cls}`}>
                    {st.label}
                  </span>
                </div>
                <div className="text-xs text-earth-500 space-y-0.5">
                  {p.born_at && <div>Nascimento: {new Date(p.born_at).toLocaleDateString("pt-BR")}</div>}
                  {p.expected_at && <div>Previsão: {new Date(p.expected_at).toLocaleDateString("pt-BR")}</div>}
                  {p.description && <div className="text-earth-400 mt-1">{p.description}</div>}
                </div>
                <div className="mt-3 pt-2 border-t border-earth-100 flex items-center justify-between">
                  <span className="text-base font-semibold text-brand-600">{formatPrice(p.price)}</span>
                  <div className="flex gap-1">
                    {p.microchipped && <span className="w-5 h-5 rounded-full bg-forest-50 text-forest-500 flex items-center justify-center text-[9px]">μ</span>}
                    {p.vaccinated && <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[9px]">V</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-3">
            Avaliações na Fareja
          </h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-earth-200 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center text-xs font-semibold">
                    {r.user_name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-earth-800">{r.user_name}</div>
                    <div className="text-[11px] text-earth-400">
                      {new Date(r.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-brand-400 fill-brand-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-earth-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className="sticky bottom-4 bg-white/90 backdrop-blur-md border border-earth-200 rounded-2xl p-4 shadow-lg shadow-earth-900/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${kennel.phone}`}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Entrar em contato
          </a>
          {kennel.instagram && (
            <a
              href={`https://instagram.com/${kennel.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-earth-200 text-earth-700 text-sm font-semibold rounded-xl hover:bg-earth-50 transition-colors"
            >
              <AtSign className="w-4 h-4" />
              {kennel.instagram}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
