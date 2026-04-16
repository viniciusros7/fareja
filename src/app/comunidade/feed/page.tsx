"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Loader2, PawPrint, ArrowRight, Star, MapPin } from "lucide-react";
import PostCard, { type FeedPost } from "@/components/community/PostCard";
import CreatePostButton from "@/components/community/CreatePostButton";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import AuthGate from "@/components/AuthGate";

function PostSkeleton() {
  return (
    <div className="bg-white border-b border-earth-100 md:rounded-2xl md:border md:border-earth-100">
      {/* Header skeleton */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full skeleton-shimmer shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-28 rounded skeleton-shimmer" />
          <div className="h-2.5 w-16 rounded skeleton-shimmer" />
        </div>
      </div>
      {/* Image skeleton */}
      <div className="w-full aspect-[4/3] skeleton-shimmer" />
      {/* Actions skeleton */}
      <div className="px-4 pt-3 pb-4 space-y-2">
        <div className="flex gap-4">
          <div className="h-5 w-12 rounded skeleton-shimmer" />
          <div className="h-5 w-12 rounded skeleton-shimmer" />
        </div>
        <div className="h-3 w-24 rounded skeleton-shimmer" />
        <div className="h-3 w-48 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

function DesktopSidebar() {
  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-4">
      {/* CTA Card */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5 shadow-[0_1px_8px_rgba(61,27,15,0.06)]">
        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
          <PawPrint className="w-5 h-5 text-brand-600" />
        </div>
        <h3 className="font-display text-base font-semibold text-earth-900 mb-1">
          É criador de cães?
        </h3>
        <p className="text-xs text-earth-500 leading-relaxed mb-4">
          Cadastre seu canil e conecte-se com compradores qualificados em todo o Brasil.
        </p>
        <Link
          href="/criadores/candidatar"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-xs font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          Candidatar meu canil
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Discover */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5 shadow-[0_1px_8px_rgba(61,27,15,0.06)]">
        <h3 className="text-sm font-semibold text-earth-700 mb-3">Explorar</h3>
        <div className="space-y-2">
          {[
            { href: "/buscar", label: "Buscar canis", icon: Star },
            { href: "/comunidade/forum", label: "Fórum da comunidade", icon: MapPin },
            { href: "/racas", label: "Guia de raças", icon: PawPrint },
            { href: "/encontrar-raca", label: "Qual raça combina?", icon: PawPrint },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-earth-600 hover:bg-earth-50 hover:text-brand-600 transition-colors"
            >
              <item.icon className="w-4 h-4 text-earth-400 shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-earth-300 text-center">
        © {new Date().getFullYear()} Fareja
      </p>
    </aside>
  );
}

function FeedContent() {
  const { user, loading: authLoading } = useUser();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (cur: string | null) => {
    if (loading) return;
    setLoading(true);
    const url = cur ? `/api/posts?cursor=${encodeURIComponent(cur)}` : "/api/posts";
    const res = await fetch(url);
    const data = await res.json();
    const newPosts: FeedPost[] = data.posts ?? [];
    setPosts((prev) => (cur ? [...prev, ...newPosts] : newPosts));
    setCursor(data.nextCursor ?? null);
    setHasMore(!!data.nextCursor);
    setLoading(false);
    setInitial(false);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchPosts(null); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setLikedIds(new Set(data.map((r) => r.post_id)));
      });
  }, [user]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) fetchPosts(cursor);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cursor, hasMore, loading, fetchPosts]);

  function handleLikeToggle(postId: string, newLiked: boolean, newCount: number) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      newLiked ? next.add(postId) : next.delete(postId);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes_count: newCount } : p))
    );
  }

  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    /* Full-bleed on mobile, centered on desktop */
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Desktop layout: feed + sidebar */}
      <div className="max-w-[960px] mx-auto md:px-4 py-0 md:py-6 flex gap-6 items-start">
        {/* Feed column */}
        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="px-4 py-4 md:px-0 md:mb-4 flex items-center justify-between">
            <h1 className="font-display text-xl font-semibold text-brand-900">Feed</h1>
            {user && (
              <Link
                href="/comunidade/feed/novo"
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-full hover:bg-brand-700 transition-colors"
              >
                + Novo post
              </Link>
            )}
          </div>

          {/* Skeletons */}
          {initial && loading && (
            <div className="space-y-0 md:space-y-4">
              {[0, 1, 2].map((i) => <PostSkeleton key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!initial && posts.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <PawPrint className="w-8 h-8 text-brand-300" />
              </div>
              <p className="font-display text-lg font-semibold text-earth-700 mb-2">
                Nenhum post ainda
              </p>
              <p className="text-sm text-earth-400 mb-5">
                Que tal ser o primeiro a compartilhar algo?
              </p>
              {user && (
                <Link
                  href="/comunidade/feed/novo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
                >
                  Criar primeiro post
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

          {/* Posts */}
          <div className="space-y-0 md:space-y-4">
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                liked={likedIds.has(post.id)}
                onLikeToggle={handleLikeToggle}
                onDelete={handleDelete}
                index={i}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="h-8" />

          {!initial && loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-earth-300" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-xs text-earth-300 py-8">
              — você chegou ao fim do feed —
            </p>
          )}
        </div>

        {/* Desktop sidebar */}
        <DesktopSidebar />
      </div>

      {!authLoading && <CreatePostButton />}
    </div>
  );
}

export default function FeedPage() {
  return (
    <AuthGate loginMessage="Veja o que os melhores criadores do Brasil estão compartilhando">
      <FeedContent />
    </AuthGate>
  );
}
