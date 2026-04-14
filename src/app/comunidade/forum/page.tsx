import { createClient } from "@/lib/supabase/server";
import CategoryCard from "@/components/forum/CategoryCard";
import Link from "next/link";
import { PlusCircle, MessageCircle } from "lucide-react";
import type { ForumCategory } from "@/lib/types/forum";
import ForumSearchClient from "./ForumSearchClient";

export const metadata = {
  title: "Fórum | Fareja",
  description: "Perguntas, dicas e discussões sobre cães.",
};

export default async function ForumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-7 h-7 text-brand-600" />
        </div>
        <h2 className="font-display text-xl font-semibold text-earth-900 mb-2 max-w-xs mx-auto">
          Tire dúvidas com criadores experientes e entusiastas de pet
        </h2>
        <p className="text-sm text-earth-500 max-w-sm mx-auto mb-5 leading-relaxed">
          Faça login para acessar o fórum e participar das discussões.
        </p>
        <Link
          href="/login"
          className="inline-flex px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          Entrar
        </Link>
        <p className="mt-3 text-xs text-earth-400">
          Não tem conta?{" "}
          <Link href="/login" className="text-brand-600 hover:underline font-medium">
            Criar conta grátis
          </Link>
        </p>
      </div>
    );
  }

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
