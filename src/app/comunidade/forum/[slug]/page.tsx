import { notFound } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ForumCategory } from "@/lib/types/forum";
import type { Metadata } from "next";
import TopicsListClient from "./TopicsListClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Fórum | Fareja" };

  return {
    title: `${data.name} | Fórum Fareja`,
    description: data.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/comunidade/forum"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-400 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl font-semibold text-brand-900 leading-tight">
            {(category as ForumCategory).name}
          </h1>
          {(category as ForumCategory).description && (
            <p className="text-xs text-earth-500 mt-0.5 truncate">
              {(category as ForumCategory).description}
            </p>
          )}
        </div>
        <Link
          href={`/comunidade/forum/novo?categoria=${(category as ForumCategory).id}`}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Novo tópico</span>
        </Link>
      </div>

      <TopicsListClient category={category as ForumCategory} />
    </div>
  );
}
