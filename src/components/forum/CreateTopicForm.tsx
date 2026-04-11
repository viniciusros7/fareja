"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import type { ForumCategory } from "@/lib/types/forum";

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  key: string;
}

interface CreateTopicFormProps {
  categories: ForumCategory[];
  defaultCategoryId?: string;
}

export default function CreateTopicForm({ categories, defaultCategoryId }: CreateTopicFormProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleUpload(results: UploadResult[]) {
    setImages((prev) => [...prev, ...results.map((r) => r.url)]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!categoryId) { setError("Selecione uma categoria"); return; }
    if (!title.trim()) { setError("Título obrigatório"); return; }
    if (!content.trim()) { setError("Conteúdo obrigatório"); return; }

    setSubmitting(true);
    const res = await fetch("/api/forum/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_id: categoryId, title: title.trim(), content: content.trim(), images }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erro ao criar tópico");
      setSubmitting(false);
      return;
    }

    const category = categories.find((c) => c.id === categoryId);
    if (category && data.topic?.id) {
      router.push(`/comunidade/forum/${category.slug}/${data.topic.id}`);
    } else {
      router.push("/comunidade/forum");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-earth-800 mb-1.5">
          Categoria
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-earth-200 bg-white text-sm text-earth-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-800 mb-1.5">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Descreva sua dúvida ou assunto em uma frase"
          maxLength={200}
          className="w-full px-3 py-2.5 rounded-xl border border-earth-200 bg-white text-sm text-earth-800 placeholder-earth-300 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-800 mb-1.5">
          Conteúdo
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Explique sua dúvida, experiência ou tema com detalhes..."
          rows={6}
          className="w-full px-3 py-2.5 rounded-xl border border-earth-200 bg-white text-sm text-earth-800 placeholder-earth-300 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-800 mb-1.5">
          Imagens (opcional)
        </label>
        <ImageUpload onUpload={handleUpload} maxFiles={4} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-60"
      >
        {submitting ? "Publicando…" : "Publicar tópico"}
      </button>
    </form>
  );
}
