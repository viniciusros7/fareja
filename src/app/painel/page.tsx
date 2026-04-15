"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dog, Star, Camera, Clock,
  Plus, Users, Heart, PawPrint, Search, ArrowRight,
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";
import { useUser } from "@/lib/hooks/useUser";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { createClient } from "@/lib/supabase/client";

interface KennelStats {
  puppiesAvailable: number;
  rating: number | null;
  ratingCount: number;
  postsCount: number;
}

function KennelDashboard({ name, userId }: { name: string; userId: string }) {
  const [stats, setStats] = useState<KennelStats | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const [kennelRes, puppiesRes, postsRes] = await Promise.all([
        supabase
          .from("kennels")
          .select("id, rating, rating_count")
          .eq("owner_id", userId)
          .single(),
        supabase
          .from("puppies")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", userId)
          .eq("status", "available"),
        supabase
          .from("posts")
          .select("id", { count: "exact", head: true })
          .eq("author_id", userId)
          .eq("status", "published"),
      ]);

      setStats({
        puppiesAvailable: puppiesRes.count ?? 0,
        rating: kennelRes.data?.rating ?? null,
        ratingCount: kennelRes.data?.rating_count ?? 0,
        postsCount: postsRes.count ?? 0,
      });
    }

    load();
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-gradient-to-r from-brand-100 to-brand-50 border border-brand-200">
        <h2 className="text-base font-semibold text-earth-900 mb-1">Bem-vindo, {name}!</h2>
        <p className="text-sm text-earth-500">
          Gerencie filhotes, atualize seu perfil e publique no feed da comunidade.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-forest-50 border border-forest-100">
          <Dog className="w-4 h-4 text-forest-600 mb-2 opacity-70" />
          <div className="text-xl font-semibold text-forest-700">
            {stats === null ? "—" : stats.puppiesAvailable}
          </div>
          <div className="text-[11px] text-forest-600 mt-0.5">Filhotes disponíveis</div>
        </div>

        <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
          <Star className="w-4 h-4 text-brand-600 mb-2 opacity-70" />
          <div className="text-xl font-semibold text-brand-700">
            {stats === null
              ? "—"
              : stats.rating !== null
              ? `★ ${stats.rating.toFixed(1)}`
              : "Sem avaliações"}
          </div>
          <div className="text-[11px] text-brand-600 mt-0.5">
            {stats !== null && stats.ratingCount > 0
              ? `${stats.ratingCount} avaliações`
              : "Avaliação Fareja"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <Camera className="w-4 h-4 text-blue-600 mb-2 opacity-70" />
          <div className="text-xl font-semibold text-blue-700">
            {stats === null ? "—" : stats.postsCount}
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5">Posts publicados</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-earth-700 mb-3">Ações rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/painel/filhotes"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center group-hover:bg-forest-100">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Adicionar filhote</div>
              <div className="text-xs text-earth-400">Cadastrar nova ninhada</div>
            </div>
          </Link>

          <Link
            href="/comunidade/feed/novo"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-200">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Postar no feed</div>
              <div className="text-xs text-earth-400">Foto, vídeo ou artigo</div>
            </div>
          </Link>

          <Link
            href="/painel/perfil"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Editar perfil</div>
              <div className="text-xs text-earth-400">Atualizar informações</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-earth-200 bg-white flex items-start gap-3">
        <Clock className="w-4 h-4 text-earth-300 mt-0.5 shrink-0" />
        <p className="text-xs text-earth-400 leading-relaxed">
          Histórico de atividades e métricas de visitas estarão disponíveis em breve.
        </p>
      </div>
    </div>
  );
}

function ClientDashboard({ name }: { name: string }) {
  const { favorites } = useFavorites();
  const breedCount = favorites.filter((f) => f.breed_id).length;
  const kennelCount = favorites.filter((f) => f.kennel_id).length;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-gradient-to-r from-brand-100 to-brand-50 border border-brand-200">
        <h2 className="text-base font-semibold text-earth-900 mb-1">Olá, {name}!</h2>
        <p className="text-sm text-earth-500">
          Explore raças, encontre criadores verificados e salve seus favoritos.
        </p>
      </div>

      {/* Favorites summary */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/painel/favoritos"
          className="p-4 rounded-xl bg-red-50 border border-red-100 hover:border-red-200 transition-colors group"
        >
          <Heart className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl font-semibold text-earth-900">{breedCount}</div>
          <div className="text-xs text-earth-500 mt-0.5">Raças favoritas</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-brand-600 font-medium group-hover:gap-2 transition-all">
            Ver favoritos <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          href="/painel/favoritos"
          className="p-4 rounded-xl bg-brand-50 border border-brand-100 hover:border-brand-200 transition-colors group"
        >
          <PawPrint className="w-5 h-5 text-brand-400 mb-2" />
          <div className="text-2xl font-semibold text-earth-900">{kennelCount}</div>
          <div className="text-xs text-earth-500 mt-0.5">Canis favoritos</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-brand-600 font-medium group-hover:gap-2 transition-all">
            Ver favoritos <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold text-earth-700 mb-3">Explorar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/encontrar-raca"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center group-hover:bg-forest-100">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Quiz de raça</div>
              <div className="text-xs text-earth-400">Descubra a raça ideal</div>
            </div>
          </Link>

          <Link
            href="/racas"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-200">
              <Dog className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Guia de raças</div>
              <div className="text-xs text-earth-400">Catálogo completo</div>
            </div>
          </Link>

          <Link
            href="/canis"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100">
              <PawPrint className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Canis verificados</div>
              <div className="text-xs text-earth-400">Encontrar criadores</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PainelPage() {
  const { user } = useUser();
  const { isKennel } = useRole();

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "Usuário";
  const firstName = displayName.split(" ")[0];

  if (isKennel && user) return <KennelDashboard name={firstName} userId={user.id} />;
  return <ClientDashboard name={firstName} />;
}
