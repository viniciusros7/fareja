"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author: { id: string; full_name: string; avatar_url: string | null; role: string } | null;
};

interface PostCommentsProps {
  postId: string;
  initialCount: number;
}

function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function PostComments({ postId, initialCount }: PostCommentsProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(initialCount);

  async function load() {
    if (loaded) { setOpen(true); return; }
    setLoading(true);
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments(data.comments ?? []);
    setLoaded(true);
    setLoading(false);
    setOpen(true);
  }

  function toggle() {
    if (!open) { load(); } else { setOpen(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setCount((n) => n + 1);
      setText("");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-sm text-earth-500 hover:text-brand-600 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-medium">{count}</span>
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-earth-100 space-y-3">
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-earth-400" />
            </div>
          )}

          {comments.map((c) => {
            const name = c.author?.full_name ?? "Usuário";
            const initials = name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={c.id} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center text-[10px] font-semibold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-earth-800">{name} </span>
                  <span className="text-xs text-earth-700">{c.content}</span>
                  <div className="text-[10px] text-earth-400 mt-0.5">{timeAgo(c.created_at)}</div>
                </div>
              </div>
            );
          })}

          {comments.length === 0 && !loading && (
            <p className="text-xs text-earth-400 text-center py-2">Nenhum comentário ainda.</p>
          )}

          {user ? (
            <form onSubmit={submit} className="flex gap-2 pt-1">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Adicionar comentário..."
                className="flex-1 text-xs px-3 py-2 border border-earth-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300"
              />
              <button
                type="submit"
                disabled={!text.trim() || submitting}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shrink-0"
              >
                {submitting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Send className="w-3.5 h-3.5" />
                }
              </button>
            </form>
          ) : (
            <p className="text-xs text-earth-400 text-center">
              <a href="/login" className="text-brand-600 hover:underline">Entre</a> para comentar
            </p>
          )}
        </div>
      )}
    </div>
  );
}
