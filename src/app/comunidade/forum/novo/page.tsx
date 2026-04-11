"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import CreateTopicForm from "@/components/forum/CreateTopicForm";
import type { ForumCategory } from "@/lib/types/forum";

function NovoTopicInner() {
  const { user, loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategoryId = searchParams.get("categoria") ?? undefined;

  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/forum/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories ?? []);
        setLoadingCats(false);
      });
  }, []);

  if (loading || (!user && !loading)) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/comunidade/forum"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display text-xl font-semibold text-brand-900">Novo tópico</h1>
      </div>

      {loadingCats ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-earth-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <CreateTopicForm categories={categories} defaultCategoryId={defaultCategoryId} />
      )}
    </div>
  );
}

export default function NovoTopicPage() {
  return (
    <Suspense>
      <NovoTopicInner />
    </Suspense>
  );
}
