"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ImagePlus, X } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { ImageCropper } from "@/components/feed/ImageCropper";
import { compressImageForFeed } from "@/lib/image/compress-client";

export default function NovoPostPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [content, setContent] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ url: string; key: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    e.target.value = "";
  }

  async function handleCropComplete(croppedFile: File) {
    setPendingFile(null);
    setUploading(true);
    setError(null);
    try {
      const compressed = await compressImageForFeed(croppedFile);
      const fd = new FormData();
      fd.append("file", compressed);
      const res = await fetch("/api/posts/preview-upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro no upload.");
      } else {
        setPreview({ url: data.url, key: data.key });
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  async function handleCancelPreview() {
    if (!preview) return;
    const { key } = preview;
    setPreview(null);
    try {
      await fetch("/api/posts/preview-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
    } catch {}
  }

  async function submit() {
    if (!content.trim() && !preview) {
      setError("Adicione texto ou uma imagem.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        image_url: preview?.url ?? null,
        image_key: preview?.key ?? null,
      }),
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
      {pendingFile && (
        <ImageCropper
          file={pendingFile}
          onCropComplete={handleCropComplete}
          onCancel={() => setPendingFile(null)}
        />
      )}

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

        {uploading && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm text-earth-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Otimizando e enviando…
          </div>
        )}

        {!uploading && preview && (
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-earth-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleCancelPreview}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!uploading && !preview && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-earth-600 border border-earth-200 rounded-xl hover:bg-earth-50 transition-colors"
            >
              <ImagePlus className="w-4 h-4" />
              Adicionar foto
            </button>
          </>
        )}

        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={submitting || uploading}
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
