"use client";

import { useState } from "react";
import {
  Heart, MessageCircle, Share2, Plus, HelpCircle,
  Lightbulb, BookOpen, Sparkles, CheckCircle2, AtSign,
  PawPrint, Filter,
} from "lucide-react";
import { mockPosts } from "@/lib/mock-data";
import type { PostType } from "@/types";

const typeConfig: Record<PostType, { label: string; icon: typeof HelpCircle; cls: string }> = {
  question: { label: "Pergunta", icon: HelpCircle, cls: "bg-blue-50 text-blue-700" },
  experience: { label: "Experiência", icon: BookOpen, cls: "bg-forest-50 text-forest-600" },
  article: { label: "Artigo", icon: Sparkles, cls: "bg-brand-100 text-brand-600" },
  tip: { label: "Dica", icon: Lightbulb, cls: "bg-yellow-50 text-yellow-700" },
};

export default function ComunidadePage() {
  const [activeFilter, setActiveFilter] = useState<PostType | "all">("all");

  const filtered = activeFilter === "all"
    ? mockPosts
    : mockPosts.filter((p) => p.type === activeFilter);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-earth-900 mb-1">
            Comunidade
          </h1>
          <p className="text-sm text-earth-500">
            Compartilhe experiências, tire dúvidas e conecte-se.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors">
          <Plus className="w-4 h-4" />
          Publicar
        </button>
      </div>

      {/* AtSign banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
          <AtSign className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-earth-800">
            Siga a Fareja no Instagram
          </p>
          <p className="text-xs text-earth-500">
            Conteúdo exclusivo, bastidores e os filhotes mais fofos.
          </p>
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

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {(["all", "question", "experience", "tip", "article"] as const).map((t) => {
          const isAll = t === "all";
          const active = activeFilter === t;
          return (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
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

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map((post) => {
          const tc = typeConfig[post.type];
          return (
            <article
              key={post.id}
              className="p-5 rounded-xl border border-earth-200 bg-white card-hover"
            >
              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center text-xs font-semibold">
                  {post.author_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-earth-800">
                      {post.author_name}
                    </span>
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

              {/* Content */}
              <h3 className="text-[15px] font-semibold text-earth-900 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-earth-600 leading-relaxed whitespace-pre-line line-clamp-4">
                {post.content}
              </p>

              {/* Actions */}
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
                  Compartilhar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <PawPrint className="w-8 h-8 text-earth-300 mx-auto mb-3" />
          <p className="text-sm text-earth-400">Nenhuma publicação encontrada.</p>
        </div>
      )}
    </div>
  );
}
