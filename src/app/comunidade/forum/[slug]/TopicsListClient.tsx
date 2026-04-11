"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import TopicCard from "@/components/forum/TopicCard";
import type { ForumCategory, ForumTopic } from "@/lib/types/forum";

interface TopicsListClientProps {
  category: ForumCategory;
}

type SortOption = "recent" | "popular" | "unanswered";

const sortLabels: Record<SortOption, string> = {
  recent: "Recentes",
  popular: "Populares",
  unanswered: "Sem resposta",
};

function normalizeJoins(topic: ForumTopic): ForumTopic {
  return {
    ...topic,
    author: Array.isArray(topic.author) ? (topic.author[0] ?? null) : topic.author,
    kennel: Array.isArray(topic.kennel) ? (topic.kennel[0] ?? null) : topic.kennel,
    category: Array.isArray(topic.category) ? (topic.category[0] ?? null) : topic.category,
  };
}

export default function TopicsListClient({ category }: TopicsListClientProps) {
  const [sort, setSort] = useState<SortOption>("recent");
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchTopics = useCallback(async (cursor?: string) => {
    const params = new URLSearchParams({ category_id: category.id, sort });
    if (cursor) params.set("cursor", cursor);
    const res = await fetch(`/api/forum/topics?${params}`);
    const data = await res.json();
    return data;
  }, [category.id, sort]);

  useEffect(() => {
    setTopics([]);
    setNextCursor(null);
    setLoading(true);
    fetchTopics().then((data) => {
      setTopics((data.topics ?? []).map(normalizeJoins));
      setNextCursor(data.nextCursor ?? null);
      setLoading(false);
    });
  }, [fetchTopics]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          setLoadingMore(true);
          fetchTopics(nextCursor).then((data) => {
            setTopics((prev) => [...prev, ...(data.topics ?? []).map(normalizeJoins)]);
            setNextCursor(data.nextCursor ?? null);
            setLoadingMore(false);
          });
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, fetchTopics]);

  return (
    <div>
      {/* Sort tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-earth-100 rounded-xl w-fit">
        {(Object.keys(sortLabels) as SortOption[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              sort === s
                ? "bg-white text-earth-900 shadow-sm"
                : "text-earth-500 hover:text-earth-700"
            }`}
          >
            {sortLabels[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-earth-100 animate-pulse" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-14 text-sm text-earth-400">
          Nenhum tópico nesta categoria ainda. Seja o primeiro!
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
          <div ref={sentinelRef} />
          {loadingMore && (
            <div className="h-14 rounded-xl bg-earth-100 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
