"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, MessageSquare, Eye, Pin, CheckCircle2, Trash2,
  MoreHorizontal, Gem, Star, CheckCircle, Send,
} from "lucide-react";
import Link from "next/link";
import ReplyCard from "./ReplyCard";
import ImageUpload from "@/components/ImageUpload";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";
import type { ForumTopic, ForumReply } from "@/lib/types/forum";

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

interface UploadResult {
  url: string;
  key: string;
}

interface TopicDetailClientProps {
  initialTopic: ForumTopic;
  initialReplies: ForumReply[];
  initialLiked: boolean;
  initialReplyLikes: Record<string, boolean>;
}

export default function TopicDetailClient({
  initialTopic,
  initialReplies,
  initialLiked,
  initialReplyLikes,
}: TopicDetailClientProps) {
  const router = useRouter();
  const { user } = useUser();
  const { isApprover, isAdmin } = useRole();

  const [topic, setTopic] = useState(initialTopic);
  const [replies, setReplies] = useState<ForumReply[]>(initialReplies);
  const [liked, setLiked] = useState(initialLiked);
  const [replyLikes, setReplyLikes] = useState(initialReplyLikes);

  const [replyContent, setReplyContent] = useState("");
  const [replyImages, setReplyImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const isKennelPost = topic.author?.role === "kennel" && topic.kennel;
  const displayName = topic.kennel?.name ?? topic.author?.full_name ?? "Usuário";
  const badge = isKennelPost && topic.kennel ? planBadge[topic.kennel.plan] : null;

  const canDelete = user?.id === topic.author_id || isApprover || isAdmin;
  const canMod = isApprover || isAdmin;
  const isTopicAuthor = user?.id === topic.author_id;

  async function handleTopicLike() {
    if (!user) return;
    const newLiked = !liked;
    const newCount = topic.likes_count + (newLiked ? 1 : -1);
    setLiked(newLiked);
    setTopic((t) => ({ ...t, likes_count: newCount }));
    await fetch(`/api/forum/topics/${topic.id}/like`, { method: "POST" });
  }

  async function handleDeleteTopic() {
    setMenuOpen(false);
    await fetch(`/api/forum/topics/${topic.id}`, { method: "DELETE" });
    router.push(`/comunidade/forum/${topic.category?.slug ?? ""}`);
  }

  async function handleTogglePin() {
    setMenuOpen(false);
    const res = await fetch(`/api/forum/topics/${topic.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_pinned: !topic.is_pinned }),
    });
    const data = await res.json();
    if (data.topic) setTopic(normalizeJoins(data.topic));
  }

  async function handleToggleSolved() {
    const res = await fetch(`/api/forum/topics/${topic.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_solved: !topic.is_solved }),
    });
    const data = await res.json();
    if (data.topic) setTopic(normalizeJoins(data.topic));
  }

  function handleReplyLikeToggle(replyId: string, newLiked: boolean, newCount: number) {
    if (!user) return;
    setReplyLikes((prev) => ({ ...prev, [replyId]: newLiked }));
    setReplies((prev) =>
      prev.map((r) => (r.id === replyId ? { ...r, likes_count: newCount } : r))
    );
  }

  function handleDeleteReply(replyId: string) {
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
    setTopic((t) => ({ ...t, replies_count: Math.max(0, t.replies_count - 1) }));
  }

  async function handleMarkBestAnswer(replyId: string) {
    const reply = replies.find((r) => r.id === replyId);
    const newBest = !reply?.is_best_answer;
    setReplies((prev) =>
      prev.map((r) => ({
        ...r,
        is_best_answer: r.id === replyId ? newBest : newBest ? false : r.is_best_answer,
      }))
    );
    if (newBest) setTopic((t) => ({ ...t, is_solved: true }));
  }

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    setReplyError("");
    if (!replyContent.trim()) { setReplyError("Escreva sua resposta"); return; }
    if (topic.status === "closed") { setReplyError("Tópico fechado"); return; }

    setSubmitting(true);
    const res = await fetch(`/api/forum/topics/${topic.id}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent.trim(), images: replyImages }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setReplyError(data.error ?? "Erro ao publicar resposta");
      return;
    }

    const newReply = normalizeReplyJoins(data.reply);
    setReplies((prev) => [...prev, newReply]);
    setTopic((t) => ({ ...t, replies_count: t.replies_count + 1 }));
    setReplyContent("");
    setReplyImages([]);
  }

  return (
    <div className="space-y-4">
      {/* Topic */}
      <article className="rounded-xl border border-earth-200 bg-white overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3 border-b border-earth-100">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isKennelPost && topic.kennel ? (
                <Link
                  href={`/canis/${topic.kennel.id}`}
                  className="text-sm font-semibold text-earth-900 hover:text-brand-600 transition-colors"
                >
                  {topic.kennel.name}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-earth-900">{displayName}</span>
              )}
              {badge && (
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold ${badge.cls}`}>
                  <badge.Icon className="w-2.5 h-2.5" />
                  {badge.label}
                </span>
              )}
            </div>
            <span className="text-[11px] text-earth-400">{timeAgo(topic.created_at)}</span>
          </div>

          {(canDelete || canMod) && (
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-400 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-9 w-48 bg-white rounded-xl border border-earth-200 shadow-lg z-20 py-1 overflow-hidden">
                    {canMod && (
                      <button
                        onClick={handleTogglePin}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Pin className="w-4 h-4" />
                        {topic.is_pinned ? "Desafixar" : "Fixar tópico"}
                      </button>
                    )}
                    {(isTopicAuthor || canMod) && (
                      <button
                        onClick={() => { setMenuOpen(false); handleToggleSolved(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {topic.is_solved ? "Marcar aberto" : "Marcar resolvido"}
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDeleteTopic}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover tópico
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-4">
          {/* Badges */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {topic.is_pinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">
                <Pin className="w-2.5 h-2.5" />
                Fixado
              </span>
            )}
            {topic.is_solved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 text-[10px] font-semibold">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Resolvido
              </span>
            )}
            {topic.status === "closed" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-earth-100 text-earth-500 text-[10px] font-semibold">
                Fechado
              </span>
            )}
          </div>

          <p className="text-sm text-earth-700 leading-relaxed whitespace-pre-line mb-4">
            {topic.content}
          </p>

          {topic.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {topic.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-full rounded-lg object-cover aspect-square"
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-earth-100">
            <button
              onClick={handleTopicLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? "text-red-500" : "text-earth-400 hover:text-red-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
              <span className="text-xs font-medium">{topic.likes_count}</span>
            </button>
            <span className="flex items-center gap-1.5 text-sm text-earth-400">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-medium">{topic.replies_count} respostas</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-earth-400">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">{topic.views_count} views</span>
            </span>
          </div>
        </div>
      </article>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-earth-700">
            {replies.length} {replies.length === 1 ? "Resposta" : "Respostas"}
          </h2>
          {replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              liked={replyLikes[reply.id] ?? false}
              onLikeToggle={handleReplyLikeToggle}
              onDelete={handleDeleteReply}
              onMarkBestAnswer={handleMarkBestAnswer}
              isTopicAuthor={isTopicAuthor}
              canDelete={user?.id === reply.author_id || isApprover || isAdmin}
            />
          ))}
        </div>
      )}

      {/* Reply form */}
      {user ? (
        topic.status !== "closed" ? (
          <form onSubmit={handleSubmitReply} className="rounded-xl border border-earth-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-semibold text-earth-800">Sua resposta</h3>
            {replyError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {replyError}
              </div>
            )}
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Compartilhe sua experiência ou conhecimento…"
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border border-earth-200 bg-white text-sm text-earth-800 placeholder-earth-300 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
            />
            <ImageUpload
              onUpload={(results) => setReplyImages((prev) => [...prev, ...results.map((r) => r.url)])}
              maxFiles={2}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Publicando…" : "Responder"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-earth-200 bg-earth-50 p-4 text-center">
            <p className="text-sm text-earth-500">Este tópico está fechado para novas respostas.</p>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-earth-200 bg-white p-4 text-center">
          <p className="text-sm text-earth-500 mb-3">Faça login para responder</p>
          <Link
            href="/login"
            className="inline-block px-5 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Entrar
          </Link>
        </div>
      )}
    </div>
  );
}

function normalizeJoins(topic: ForumTopic): ForumTopic {
  return {
    ...topic,
    author: Array.isArray(topic.author) ? (topic.author[0] ?? null) : topic.author,
    kennel: Array.isArray(topic.kennel) ? (topic.kennel[0] ?? null) : topic.kennel,
    category: Array.isArray(topic.category) ? (topic.category[0] ?? null) : topic.category,
  };
}

function normalizeReplyJoins(reply: ForumReply): ForumReply {
  return {
    ...reply,
    author: Array.isArray(reply.author) ? (reply.author[0] ?? null) : reply.author,
    kennel: Array.isArray(reply.kennel) ? (reply.kennel[0] ?? null) : reply.kennel,
  };
}
