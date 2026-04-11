import { createClient } from "@/lib/supabase/server";
import CategoryCard from "@/components/forum/CategoryCard";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type { ForumCategory } from "@/lib/types/forum";
import ForumSearchClient from "./ForumSearchClient";

export const metadata = {
  title: "Fórum | Fareja",
  description: "Perguntas, dicas e discussões sobre cães.",
};

export default async function ForumPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("*")
    .order("name");

  const categories: ForumCategory[] = data ?? [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900 mb-1">Fórum</h1>
          <p className="text-sm text-earth-500">Perguntas, dicas e discussões sobre cães.</p>
        </div>
        <Link
          href="/comunidade/forum/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Novo tópico
        </Link>
      </div>

      <ForumSearchClient categories={categories} />
    </div>
  );
}
