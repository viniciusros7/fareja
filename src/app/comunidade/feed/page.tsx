"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, PawPrint } from "lucide-react";
import PostCard, { type FeedPost } from "@/components/community/PostCard";
import CreatePostButton from "@/components/community/CreatePostButton";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

export default function FeedPage() {
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
    setPosts((prev) => cur ? [...prev, ...newPosts] : newPosts);
    setCursor(data.nextCursor ?? null);
    setHasMore(!!data.nextCursor);
    setLoading(false);
    setInitial(false);
  }, [loading]);

  // Initial load
  useEffect(() => { fetchPosts(null); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user's liked post IDs
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

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts(cursor);
        }
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
      prev.map((p) => p.id === postId ? { ...p, likes_count: newCount } : p)
    );
  }

  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/comunidade"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display text-xl font-semibold text-brand-900">Feed</h1>
      </div>

      {initial && loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
        </div>
      )}

      {!initial && posts.length === 0 && (
        <div className="text-center py-20">
          <PawPrint className="w-10 h-10 text-earth-200 mx-auto mb-4" />
          <p className="text-sm text-earth-500">Nenhum post ainda.</p>
          {user && (
            <Link
              href="/comunidade/feed/novo"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
            >
              Ser o primeiro a postar
            </Link>
          )}
        </div>
      )}

      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            liked={likedIds.has(post.id)}
            onLikeToggle={handleLikeToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-8" />

      {!initial && loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-earth-400" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-xs text-earth-400 py-6">Você chegou ao fim do feed.</p>
      )}

      {!authLoading && <CreatePostButton />}
    </div>
  );
}
