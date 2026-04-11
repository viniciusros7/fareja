"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import CategoryCard from "@/components/forum/CategoryCard";
import type { ForumCategory } from "@/lib/types/forum";

interface ForumSearchClientProps {
  categories: ForumCategory[];
}

export default function ForumSearchClient({ categories }: ForumSearchClientProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          (c.description ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : categories;

  return (
    <div>
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-300 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar categoria…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-earth-200 bg-white text-sm text-earth-800 placeholder-earth-300 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-earth-400">
          Nenhuma categoria encontrada.
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
