"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@/lib/hooks/useUser";
import Link from "next/link";
import {
  Heart, MessageCircle, Share2, Plus, HelpCircle,
  Lightbulb, BookOpen, Sparkles, CheckCircle2,
  PawPrint, Filter, Camera, Image as ImageIcon,
  Gem, Star, AtSign, Lock,
} from "lucide-react";
import { mockPosts, mockFeedPosts, allBreeds } from "@/lib/mock-data";
import type { PostType, KennelPlan } from "@/types";

const typeConfig: Record<PostType, { label: string; icon: typeof HelpCircle; cls: string }> = {
  question: { label: "Pergunta", icon: HelpCircle, cls: "bg-blue-50 text-blue-700" },
  experience: { label: "Experiência", icon: BookOpen, cls: "bg-forest-50 text-forest-600" },
  article: { label: "Artigo", icon: Sparkles, cls: "bg-brand-100 text-brand-600" },
  tip: { label: "Dica", icon: Lightbulb, cls: "bg-yellow-50 text-yellow-700" },
  photo: { label: "Foto", icon: Camera, cls: "bg-pink-50 text-pink-600" },
  video: { label: "Vídeo", icon: Camera, cls: "bg-purple-50 text-purple-600" },
};

const planBadge: Record<KennelPlan, { label: string; cls: string; icon: typeof Star }> = {
  basic: { label: "Verificado", cls: "bg-brand-100 text-brand-600", icon: CheckCircle2 },
  premium: { label: "Premium", cls: "bg-brand-600 text-white", icon: Star },
  super_premium: { label: "Elite", cls: "bg-gradient-to-r from-brand-600 to-brand-500 text-white", icon: Gem },
};

export default function ComunidadePage() {
  const { user, loading: authLoading } = useUser();
  const [tab, setTab] = useState<"feed" | "discussao">("feed");
  const [feedBreedFilter, setFeedBreedFilter] = useState("");
  const [discussionFilter, setDiscussionFilter] = useState<PostType | "all">("all");

  const filteredFeed = feedBreedFilter
    ? mockFeedPosts.filter((p) => p.breed_tag === feedBreedFilter)
    : mockFeedPosts;

  const filteredDiscussion = discussionFilter === "all"
    ? mockPosts
    : mockPosts.filter((p) => p.type === discussionFilter);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900 mb-1">
            Comunidade
          </h1>
          <p className="text-sm text-earth-500">
            Fotos, experiências e dúvidas sobre o mundo pet.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors">
          <Plus className="w-4 h-4" />
          Publicar
        </button>
      </div>

      {/* Instagram banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 flex items-center gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
          <AtSign className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-earth-800">Siga a Fareja no Instagram</p>
          <p className="text-xs text-earth-500 truncate">Bastidores, filhotes e conteúdo exclusivo.</p>
        </div>
        <a
          href="https://instagram.com/fareja"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white border border-pink-200 text-pink-600 text-xs font-semibold rounded-full hover:bg-pink-50 transition-colors shrink-0"
        >
          Seguir
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-earth-100 rounded-lg mb-5">
        <button
          onClick={() => setTab("feed")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
            tab === "feed" ? "bg-white text-earth-900 shadow-sm" : "text-earth-500 hover:text-earth-700"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Feed
        </button>
        <button
          onClick={() => setTab("discussao")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
            tab === "discussao" ? "bg-white text-earth-900 shadow-sm" : "text-earth-500 hover:text-earth-700"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Discussões
        </button>
      </div>

      {/* ── FEED TAB ── */}
      {tab === "feed" && (
        <>
          {/* Breed filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            <button
              onClick={() => setFeedBreedFilter("")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
                !feedBreedFilter
                  ? "bg-brand-100 text-brand-600 border-brand-300"
                  : "bg-white text-earth-500 border-earth-200 hover:bg-earth-50"
              }`}
            >
              Todas as raças
            </button>
            {allBreeds.map((b) => (
              <button
                key={b}
                onClick={() => setFeedBreedFilter(feedBreedFilter === b ? "" : b)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
                  feedBreedFilter === b
                    ? "bg-brand-100 text-brand-600 border-brand-300"
                    : "bg-white text-earth-500 border-earth-200 hover:bg-earth-50"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Feed posts */}
          <div className="space-y-5">
            {filteredFeed.map((post, idx) => {
              const badge = post.kennel_plan ? planBadge[post.kennel_plan] : null;
              const BadgeIcon = badge?.icon;
              const isBlurred = !authLoading && !user && idx >= 2;

              const articleEl = (
                <article key={post.id} className="rounded-xl border border-earth-200 bg-white overflow-hidden card-hover">
                  {/* Author header */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center text-xs font-semibold">
                      {post.author_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-earth-800 truncate">
                          {post.author_name}
                        </span>
                        {badge && BadgeIcon && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${badge.cls}`}>
                            <BadgeIcon className="w-2.5 h-2.5" />
                            {badge.label}
                          </span>
                        )}
                        {post.is_sponsored && (
                          <span className="text-[9px] font-medium text-earth-400">Patrocinado</span>
                        )}
                      </div>
                      <span className="text-[11px] text-earth-400">
                        {new Date(post.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {/* Feed image */}
                  <div className="relative w-full aspect-square">
                    <Image
                      src={`https://placedog.net/600/600?id=${post.id.replace("f", "")}`}
                      alt={post.breed_tag}
                      fill
                      className="object-cover"
                      sizes="(max-width: 672px) 100vw, 672px"
                    />
                    {/* Breed tag overlay */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm">
                        🐕 {post.breed_tag}
                      </span>
                    </div>
                  </div>

                  {/* Actions & caption */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-4 mb-2">
                      <button className="flex items-center gap-1.5 text-sm text-earth-600 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-xs font-medium">{post.likes_count}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-earth-600 hover:text-brand-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-medium">{post.comments_count}</span>
                      </button>
                      <button className="ml-auto text-earth-400 hover:text-brand-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-earth-700 leading-relaxed">
                      <span className="font-semibold">{post.author_name}</span>{" "}
                      {post.caption}
                    </p>
                  </div>
                </article>
              );

              if (!isBlurred) return articleEl;

              if (!authLoading && !user && idx === 2) {
                return (
                  <div key={post.id} className="relative">
                    <div className="blur-sm opacity-60 pointer-events-none select-none">
                      {articleEl}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur-sm border border-earth-200 rounded-2xl p-6 text-center shadow-lg mx-4 max-w-xs w-full">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3">
                          <Lock className="w-4 h-4 text-brand-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-earth-900 mb-1">
                          Ver mais no feed
                        </h3>
                        <p className="text-xs text-earth-500 mb-4 leading-relaxed">
                          Crie sua conta gratuita para ver todos os posts da comunidade.
                        </p>
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-full hover:bg-brand-700 transition-colors"
                        >
                          <PawPrint className="w-3 h-3" />
                          Criar conta grátis
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {filteredFeed.length === 0 && (
              <div className="text-center py-16">
                <PawPrint className="w-8 h-8 text-earth-300 mx-auto mb-3" />
                <p className="text-sm text-earth-400">Nenhum post com essa raça ainda.</p>
              </div>
            )}
          </div>

          {/* Posting limits info */}
          <div className="mt-8 p-4 rounded-xl bg-earth-50 border border-earth-200">
            <h4 className="text-xs font-semibold text-earth-600 mb-2">Limites de publicação para canis</h4>
            <div className="space-y-1.5 text-xs text-earth-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-earth-200 text-earth-600">Verificado</span>
                1 foto ou vídeo por dia
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-600 text-white">Premium</span>
                5 fotos ou vídeos por dia
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white">Elite</span>
                Fotos e vídeos ilimitados + posts patrocinados
              </div>
              <div className="mt-2 text-earth-400">Clientes podem publicar sem limite.</div>
            </div>
          </div>
        </>
      )}

      {/* ── DISCUSSIONS TAB ── */}
      {tab === "discussao" && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {(["all", "question", "experience", "tip", "article"] as const).map((t) => {
              const isAll = t === "all";
              const active = discussionFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setDiscussionFilter(t)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
                    active
                      ? "bg-brand-100 text-brand-600 border-brand-300"
                      : "bg-white text-earth-500 border-earth-200 hover:bg-earth-50"
                  }`}
                >
                  {isAll ? (
                    <>
                      <Filter className="w-3 h-3" />
                      Todos
                    </>
                  ) : (
                    <>
                      {(() => { const C = typeConfig[t].icon; return <C className="w-3 h-3" />; })()}
                      {typeConfig[t].label}s
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {filteredDiscussion.map((post) => {
              const tc = typeConfig[post.type];
              return (
                <article key={post.id} className="p-5 rounded-xl border border-earth-200 bg-white card-hover">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center text-xs font-semibold">
                      {post.author_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-earth-800">{post.author_name}</span>
                        {post.author_role === "kennel" && (
                          <span className="badge-verified" style={{ fontSize: "9px", padding: "1px 6px" }}>
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Canil verificado
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-earth-400">
                        {new Date(post.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${tc.cls}`}>
                      {tc.label}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-semibold text-earth-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-earth-600 leading-relaxed whitespace-pre-line line-clamp-4">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-5 mt-4 pt-3 border-t border-earth-100">
                    <button className="flex items-center gap-1.5 text-xs text-earth-500 hover:text-red-500 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      {post.likes_count}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-earth-500 hover:text-brand-600 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments_count}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-earth-500 hover:text-brand-600 transition-colors ml-auto">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
