"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useUser } from "@/lib/hooks/useUser";

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  key: string;
}

export default function NovoPostPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-sm text-earth-500 mb-4">Entre para criar um post.</p>
        <Link href="/login" className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors">
          Entrar
        </Link>
      </div>
    );
  }

  function handleUpload(results: UploadResult[]) {
    setImages((prev) => [...prev, ...results.map((r) => r.url)]);
    setThumbnails((prev) => [...prev, ...results.map((r) => r.thumbnailUrl ?? r.url)]);
  }

  async function submit() {
    if (!content.trim() && images.length === 0) {
      setError("Adicione texto ou pelo menos uma imagem.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, images, thumbnails }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erro ao publicar.");
      setSubmitting(false);
      return;
    }

    router.push("/comunidade/feed");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/comunidade/feed"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display text-xl font-semibold text-brand-900">Novo post</h1>
      </div>

      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compartilhe algo com a comunidade…"
          rows={5}
          maxLength={2000}
          className="w-full px-4 py-3 text-sm border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300 resize-none"
        />

        <div className="text-right text-[11px] text-earth-400 -mt-2">
          {content.length}/2000
        </div>

        <ImageUpload onUpload={handleUpload} maxFiles={5} />

        {images.length > 0 && (
          <p className="text-xs text-forest-600 font-medium">
            {images.length} imagem{images.length !== 1 ? "ns" : ""} prontas para publicar.
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Publicando…</>
          ) : (
            "Publicar"
          )}
        </button>
      </div>
    </div>
  );
}
