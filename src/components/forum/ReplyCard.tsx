"use client";

import { useState } from "react";
import { Heart, CheckCircle2, Trash2, MoreHorizontal, Award, Gem, Star, CheckCircle } from "lucide-react";
import type { ForumReply } from "@/lib/types/forum";

function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d}d`;
  return new Date(date).toLocaleDateString("pt-BR");
}

const planBadge: Record<string, { label: string; cls: string; Icon: typeof Gem }> = {
  super_premium: { label: "Elite",      cls: "bg-gradient-to-r from-brand-600 to-brand-500 text-white", Icon: Gem },
  premium:       { label: "Premium",    cls: "bg-brand-600 text-white",                                  Icon: Star },
  basic:         { label: "Verificado", cls: "bg-forest-50 text-forest-700",                             Icon: CheckCircle },
};

interface ReplyCardProps {
  reply: ForumReply;
  liked: boolean;
  onLikeToggle: (replyId: string, newLiked: boolean, newCount: number) => void;
  onDelete?: (replyId: string) => void;
  onMarkBestAnswer?: (replyId: string) => void;
  isTopicAuthor: boolean;
  canDelete: boolean;
}

export default function ReplyCard({
  reply,
  liked,
  onLikeToggle,
  onDelete,
  onMarkBestAnswer,
  isTopicAuthor,
  canDelete,
}: ReplyCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isKennelPost = reply.author?.role === "kennel" && reply.kennel;
  const displayName = reply.kennel?.name ?? reply.author?.full_name ?? "Usuário";
  const badge = isKennelPost && reply.kennel ? planBadge[reply.kennel.plan] : null;

  async function handleLike() {
    const newLiked = !liked;
    const newCount = reply.likes_count + (newLiked ? 1 : -1);
    onLikeToggle(reply.id, newLiked, newCount);
    await fetch(`/api/forum/replies/${reply.id}/like`, { method: "POST" });
  }

  async function handleDelete() {
    setMenuOpen(false);
    await fetch(`/api/forum/replies/${reply.id}`, { method: "DELETE" });
    onDelete?.(reply.id);
  }

  async function handleMarkBestAnswer() {
    await fetch(`/api/forum/replies/${reply.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_best_answer: !reply.is_best_answer }),
    });
    onMarkBestAnswer?.(reply.id);
  }

  return (
    <div className={`rounded-xl border bg-white overflow-hidden ${
      reply.is_best_answer ? "border-forest-400" : "border-earth-200"
    }`}>
      {reply.is_best_answer && (
        <div className="flex items-center gap-2 px-4 py-2 bg-forest-50 border-b border-forest-200">
          <Award className="w-4 h-4 text-forest-600" />
          <span className="text-xs font-semibold text-forest-700">Melhor resposta</span>
        </div>
      )}

      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-earth-900 truncate">{displayName}</span>
              {badge && (
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${badge.cls} shrink-0`}>
                  <badge.Icon className="w-2 h-2" />
                  {badge.label}
                </span>
              )}
            </div>
            <span className="text-[11px] text-earth-400">{timeAgo(reply.created_at)}</span>
          </div>

          {(canDelete || isTopicAuthor) && (
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-400 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-earth-200 shadow-lg z-20 py-1 overflow-hidden">
                    {isTopicAuthor && (
                      <button
                        onClick={() => { setMenuOpen(false); handleMarkBestAnswer(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {reply.is_best_answer ? "Desmarcar" : "Melhor resposta"}
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-earth-700 leading-relaxed whitespace-pre-line mb-3">
          {reply.content}
        </p>

        {/* Images */}
        {reply.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {reply.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-full rounded-lg object-cover aspect-square"
              />
            ))}
          </div>
        )}

        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-red-500" : "text-earth-400 hover:text-red-400"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
          <span className="text-xs font-medium">{reply.likes_count}</span>
        </button>
      </div>
    </div>
  );
}
