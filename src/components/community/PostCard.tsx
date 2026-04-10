"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MoreHorizontal, Trash2, CheckCircle2, Gem, Star } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import PostComments from "./PostComments";
import ShareButton from "./ShareButton";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";

export type FeedPost = {
  id: string;
  author_id: string;
  content: string;
  images: string[];
  thumbnails: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: { id: string; full_name: string; avatar_url: string | null; role: string } | null;
  kennel: { id: string; name: string; plan: string; slug: string } | null;
};

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
  super_premium: { label: "Elite",     cls: "bg-gradient-to-r from-brand-600 to-brand-500 text-white", Icon: Gem },
  premium:       { label: "Premium",   cls: "bg-brand-600 text-white",                                 Icon: Star },
  basic:         { label: "Verificado",cls: "bg-forest-50 text-forest-700",                            Icon: CheckCircle2 },
};

interface PostCardProps {
  post: FeedPost;
  liked: boolean;
  onLikeToggle: (postId: string, newLiked: boolean, newCount: number) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, liked, onLikeToggle, onDelete }: PostCardProps) {
  const { user } = useUser();
  const { isApprover, isAdmin } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const name = post.author?.full_name ?? "Usuário";
  const displayName = post.kennel?.name ?? name;
  const initials = displayName.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const isKennelPost = post.author?.role === "kennel" && post.kennel;
  const badge = isKennelPost && post.kennel ? planBadge[post.kennel.plan] : null;

  const isLong = post.content.length > 200;
  const displayContent = isLong && !expanded ? post.content.slice(0, 200) + "…" : post.content;

  const canDelete = user?.id === post.author_id || isApprover || isAdmin;

  async function handleLike() {
    if (!user) return;
    const newLiked = !liked;
    const newCount = post.likes_count + (newLiked ? 1 : -1);
    onLikeToggle(post.id, newLiked, newCount);
    await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
  }

  async function handleDelete() {
    setMenuOpen(false);
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    onDelete?.(post.id);
  }

  return (
    <article className="rounded-xl border border-earth-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isKennelPost && post.kennel ? (
              <Link
                href={`/canis/${post.kennel.id}`}
                className="text-sm font-semibold text-earth-900 hover:text-brand-600 transition-colors truncate"
              >
                {post.kennel.name}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-earth-900 truncate">{name}</span>
            )}
            {badge && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${badge.cls}`}>
                <badge.Icon className="w-2.5 h-2.5" />
                {badge.label}
              </span>
            )}
          </div>
          <span className="text-[11px] text-earth-400">{timeAgo(post.created_at)}</span>
        </div>

        {canDelete && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-400 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 w-40 bg-white rounded-xl border border-earth-200 shadow-lg z-20 py-1 overflow-hidden">
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <ImageCarousel images={post.images} alt={displayName} />
      )}

      {/* Content + actions */}
      <div className="px-4 py-3">
        {/* Like / comment / share */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked ? "text-red-500" : "text-earth-500 hover:text-red-400"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
            <span className="text-xs font-medium">{post.likes_count}</span>
          </button>

          <PostComments postId={post.id} initialCount={post.comments_count} />

          <div className="ml-auto">
            <ShareButton postId={post.id} text={post.content.slice(0, 100)} />
          </div>
        </div>

        {/* Text */}
        <p className="text-sm text-earth-700 leading-relaxed">
          <span className="font-semibold">{displayName} </span>
          {displayContent}
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-earth-400 hover:text-earth-600 ml-1 text-xs"
            >
              {expanded ? "ver menos" : "ver mais"}
            </button>
          )}
        </p>
      </div>
    </article>
  );
}
