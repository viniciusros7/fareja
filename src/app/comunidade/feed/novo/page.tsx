"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Area, Point } from "react-easy-crop";
import {
  X, ImagePlus, Smile, Search, Check, Loader2, MapPin, Tag, Store,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

type CropperProps = {
  image: string;
  crop: Point;
  zoom?: number;
  aspect?: number;
  onCropChange: (crop: Point) => void;
  onZoomChange?: (zoom: number) => void;
  onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Cropper: React.ComponentType<CropperProps> = dynamic(
  () => import("react-easy-crop"),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-earth-200 animate-pulse" /> }
) as any;

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <div className="h-[360px] bg-earth-50 flex items-center justify-center text-sm text-earth-400">Carregando…</div>,
});

// ── Types ─────────────────────────────────────────────────────────────────────

type CropMode = "1:1" | "4:5" | "livre";

interface PhotoItem {
  id: string;
  localUrl: string;
  cropPos: Point;
  zoom: number;
  mode: CropMode;
  cropPixels: Area | null;
}

interface Kennel { id: string; name: string; owner_id: string }
interface Breed  { id: string; name_pt: string; image_url: string | null }

// ── Constants ─────────────────────────────────────────────────────────────────

const TITLES = [
  { kicker: "Ed. nº 01 — Diário do Canil", main: "Conte uma",        em: "história"  },
  { kicker: "Ed. nº 02 — Galeria",         main: "Mostre seu",       em: "canil"     },
  { kicker: "Ed. nº 03 — Momento",         main: "Compartilhe um",   em: "momento"   },
];

const MODES: { mode: CropMode; label: string }[] = [
  { mode: "1:1",   label: "1:1"   },
  { mode: "4:5",   label: "4:5"   },
  { mode: "livre", label: "Livre" },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

function createImg(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload  = () => res(img);
    img.onerror = rej;
    img.src     = url;
  });
}

async function getCroppedFile(src: string, pixels: Area): Promise<File> {
  const img    = await createImg(src);
  const canvas = document.createElement("canvas");
  canvas.width  = pixels.width;
  canvas.height = pixels.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, pixels.x, pixels.y, pixels.width, pixels.height, 0, 0, pixels.width, pixels.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => blob ? resolve(new File([blob], "photo.jpg", { type: "image/jpeg" })) : reject(new Error("empty canvas")),
      "image/jpeg", 0.92
    )
  );
}

// ── Sheet ─────────────────────────────────────────────────────────────────────

function Sheet({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#FFFBF5] rounded-t-2xl max-h-[90dvh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-earth-100 shrink-0">
          <h3 className="font-display text-lg font-medium text-earth-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 transition-colors">
            <X className="w-4 h-4 text-earth-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 pb-8">{children}</div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function NovoPostPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const textareaRef    = useRef<HTMLTextAreaElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  const [titleIdx]                  = useState(() => Math.floor(Math.random() * TITLES.length));
  const [photos, setPhotos]         = useState<PhotoItem[]>([]);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [caption, setCaption]       = useState("");
  const [kennelId, setKennelId]     = useState<string | null>(null);
  const [kennelName, setKennelName] = useState<string | null>(null);
  const [breedId, setBreedId]       = useState<string | null>(null);
  const [breedName, setBreedName]   = useState<string | null>(null);
  const [location, setLocation]     = useState("");
  const [sheet, setSheet]           = useState<"kennel" | "breed" | "location" | null>(null);
  const [showEmoji, setShowEmoji]   = useState(false);
  const [kennels, setKennels]       = useState<Kennel[]>([]);
  const [breeds, setBreeds]         = useState<Breed[]>([]);
  const [kennelSearch, setKennelSearch] = useState("");
  const [breedSearch, setBreedSearch]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ownKennels, setOwnKennels] = useState<Kennel[]>([]);

  const supabase = createClient();
  const title    = TITLES[titleIdx];

  // Pre-fetch user's own kennels and auto-select if exactly one
  useEffect(() => {
    if (!user) return;
    supabase
      .from("kennels")
      .select("id, name, owner_id")
      .eq("owner_id", user.id)
      .eq("status", "approved")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setOwnKennels(data as Kennel[]);
        if (data.length === 1 && !kennelId) {
          setKennelId(data[0].id);
          setKennelName(data[0].name);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (sheet !== "kennel" || kennels.length > 0) return;
    supabase
      .from("kennels")
      .select("id, name, owner_id")
      .eq("status", "approved")
      .order("name")
      .then(({ data }) => { if (data) setKennels(data as Kennel[]); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  useEffect(() => {
    if (sheet !== "breed" || breeds.length > 0) return;
    supabase
      .from("breeds")
      .select("id, name_pt, image_url")
      .order("name_pt")
      .then(({ data }) => { if (data) setBreeds(data as Breed[]); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  function addFiles(files: FileList | File[]) {
    const imgs = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    const slots = 5 - photos.length;
    if (slots <= 0) return;
    const added: PhotoItem[] = imgs.slice(0, slots).map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      localUrl: URL.createObjectURL(f),
      cropPos: { x: 0, y: 0 },
      zoom: 1,
      mode: "1:1",
      cropPixels: null,
    }));
    setPhotos((prev) => {
      const next = [...prev, ...added];
      setActiveIdx(prev.length); // jump to first new photo
      return next;
    });
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.localUrl);
      const next = prev.filter((p) => p.id !== id);
      setActiveIdx((i) => Math.min(i, Math.max(0, next.length - 1)));
      return next;
    });
  }

  function patchActive(patch: Partial<PhotoItem>) {
    setPhotos((prev) => prev.map((p, i) => i === activeIdx ? { ...p, ...patch } : p));
  }

  function insertEmoji(emoji: string) {
    const ta = textareaRef.current;
    if (!ta) { setCaption((c) => c + emoji); setShowEmoji(false); return; }
    const start = ta.selectionStart ?? caption.length;
    const end   = ta.selectionEnd   ?? caption.length;
    const next  = caption.slice(0, start) + emoji + caption.slice(end);
    setCaption(next);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + [...emoji].length;
      ta.focus();
    });
    setShowEmoji(false);
  }

  async function publish() {
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const urls: string[]  = [];
      const thumbs: string[] = [];

      for (const photo of photos) {
        let file: File;
        if (photo.cropPixels) {
          file = await getCroppedFile(photo.localUrl, photo.cropPixels);
        } else {
          const blob = await fetch(photo.localUrl).then((r) => r.blob());
          file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        }

        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/posts/preview-upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Falha ao enviar foto. Tente novamente.");
        const uploadData = await res.json().catch(() => null);
        if (!uploadData?.url) throw new Error("Falha ao enviar foto. Tente novamente.");
        const { url, thumbnailUrl } = uploadData;
        urls.push(url);
        thumbs.push(thumbnailUrl ?? url);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: caption.trim() || null,
          images:  urls,
          thumbnails: thumbs,
          kennel_id: kennelId,
          breed_id:  breedId,
          location:  location || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Erro ao publicar.");
      photos.forEach((p) => URL.revokeObjectURL(p.localUrl));
      router.push("/comunidade/feed");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao publicar. Tenta de novo.");
      setSubmitting(false);
    }
  }

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

  const name      = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "";
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;
  const initials  = name.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "U";
  const activePhoto = photos[activeIdx];
  const cropAspect  = !activePhoto || activePhoto.mode === "livre" ? undefined
    : activePhoto.mode === "4:5" ? 4/5 : 1;
  const canPublish  = (photos.length > 0 || caption.trim().length > 0) && !submitting;

  const filteredKennels = kennels.filter((k) => k.name.toLowerCase().includes(kennelSearch.toLowerCase()));
  const filteredBreeds  = breeds.filter((b)  => b.name_pt.toLowerCase().includes(breedSearch.toLowerCase()));

  return (
    <div className="min-h-dvh bg-[#FFFBF5]">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
      />

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-[#FFFBF5]/95 backdrop-blur-sm flex items-center justify-between px-5 py-3 border-b border-earth-100">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <button
          onClick={publish}
          disabled={!canPublish}
          className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 active:scale-95 transition-all"
        >
          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Publicar
        </button>
      </div>

      {/* ── Editorial title ── */}
      <div className="px-6 pt-5 pb-4">
        <p className="font-display italic text-[13px] tracking-wide text-brand-600 mb-1.5">
          {title.kicker}
        </p>
        <h1 className="font-display text-3xl font-medium leading-none text-earth-900 tracking-tight">
          {title.main} <em className="italic font-normal text-brand-600">{title.em}</em>
        </h1>
      </div>

      {/* ── Photo section ── */}
      {photos.length === 0 ? (
        <div className="px-5 pb-2 space-y-2.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 py-5 bg-brand-600 text-white font-semibold rounded-2xl hover:bg-brand-700 active:scale-[0.99] transition-all"
          >
            <ImagePlus className="w-5 h-5" />
            Adicionar foto
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-3.5 border border-earth-200 text-earth-700 text-sm font-medium rounded-xl hover:bg-earth-50 transition-colors"
            >
              <ImagePlus className="w-4 h-4 text-earth-400" />
              Da galeria
            </button>
            <button
              disabled
              title="Em breve"
              className="flex items-center justify-center gap-2 py-3.5 border border-earth-100 text-earth-300 text-sm rounded-xl cursor-not-allowed"
            >
              Vídeo (em breve)
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Crop container */}
          <div
            className="relative w-full overflow-hidden bg-earth-900"
            style={{ paddingBottom: activePhoto?.mode === "4:5" ? "125%" : "100%" }}
          >
            {activePhoto && (
              <Cropper
                image={activePhoto.localUrl}
                crop={activePhoto.cropPos}
                zoom={activePhoto.zoom}
                aspect={cropAspect}
                onCropChange={(pos) => patchActive({ cropPos: pos })}
                onZoomChange={(z) => patchActive({ zoom: z })}
                onCropComplete={(_, pixels) => patchActive({ cropPixels: pixels })}
              />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />

            {/* Counter pill */}
            {photos.length > 1 && (
              <div className="absolute top-3.5 right-3.5 z-20 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-full pointer-events-none">
                <span className="font-display italic text-[13px] text-white tracking-wide">
                  {activeIdx + 1} / {photos.length}
                </span>
              </div>
            )}

            {/* Inline toolbar */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2">
              <div className="flex bg-black/50 backdrop-blur-md rounded-full p-1 gap-0.5">
                {MODES.map(({ mode, label }) => (
                  <button
                    key={mode}
                    onClick={() => patchActive({ mode, cropPos: { x: 0, y: 0 }, zoom: 1, cropPixels: null })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      activePhoto?.mode === mode
                        ? "bg-white text-earth-900"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmoji((v) => !v)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                >
                  <Smile className="w-[18px] h-[18px]" />
                </button>
                <button
                  onClick={() => activePhoto && removePhoto(activePhoto.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          {photos.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-2.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIdx ? "bg-brand-600 w-4" : "bg-earth-300 w-1.5"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Caption area ── */}
      <div className="px-5 pt-5 pb-32 space-y-4">
        {/* User row */}
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-display font-medium text-[15px] text-earth-900 leading-none truncate">
              {name.split(" ")[0]}
            </p>
            {kennelName && (
              <p className="text-[11px] text-earth-400 mt-0.5 leading-none truncate">{kennelName}</p>
            )}
          </div>
        </div>

        {/* Caption */}
        <textarea
          ref={textareaRef}
          value={caption}
          onChange={(e) => setCaption(e.target.value.slice(0, 2000))}
          placeholder="Conte sobre esse momento..."
          rows={3}
          className="w-full text-[15px] leading-relaxed text-earth-900 border-none outline-none resize-none bg-transparent placeholder:italic placeholder:font-display placeholder:text-earth-400 placeholder:text-[15px]"
          style={{ fontFamily: '"DM Sans", system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}
        />

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSheet("kennel"); setKennelSearch(""); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors ${
              kennelId ? "bg-brand-50 border-brand-300 text-brand-700 font-medium" : "bg-earth-50 border-earth-200 text-earth-600 hover:bg-brand-50 hover:border-brand-200"
            }`}
          >
            <Store className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[160px]">{kennelName ?? "+ Marcar canil"}</span>
            {kennelId && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); setKennelId(null); setKennelName(null); }}
                className="ml-0.5"
              >
                <X className="w-3 h-3" />
              </span>
            )}
          </button>

          <button
            onClick={() => { setSheet("breed"); setBreedSearch(""); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors ${
              breedId ? "bg-brand-50 border-brand-300 text-brand-700 font-medium" : "bg-earth-50 border-earth-200 text-earth-600 hover:bg-brand-50 hover:border-brand-200"
            }`}
          >
            <Tag className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[160px]">{breedName ?? "+ Raça"}</span>
            {breedId && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); setBreedId(null); setBreedName(null); }}
                className="ml-0.5"
              >
                <X className="w-3 h-3" />
              </span>
            )}
          </button>

          <button
            onClick={() => setSheet("location")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors ${
              location ? "bg-brand-50 border-brand-300 text-brand-700 font-medium" : "bg-earth-50 border-earth-200 text-earth-600 hover:bg-brand-50 hover:border-brand-200"
            }`}
          >
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[160px]">{location || "+ Localização"}</span>
            {location && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); setLocation(""); }}
                className="ml-0.5"
              >
                <X className="w-3 h-3" />
              </span>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-earth-100">
          <div className="flex gap-2">
            {photos.length > 0 && photos.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-earth-100 text-earth-600 hover:bg-earth-200 transition-colors"
              >
                <ImagePlus className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>
          <span className="font-display italic text-[12px] text-earth-400">{caption.length} / 2000</span>
        </div>

        {submitError && (
          <p className="text-xs text-red-600 font-medium">{submitError}</p>
        )}
      </div>

      {/* ── Emoji picker ── */}
      {showEmoji && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowEmoji(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <EmojiPicker
              onEmojiClick={(d) => insertEmoji(d.emoji)}
              width="100%"
              height={360}
            />
          </div>
        </>
      )}

      {/* ── Kennel sheet ── */}
      <Sheet open={sheet === "kennel"} onClose={() => setSheet(null)} title="Marcar canil">
        <div className="px-4 pt-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              value={kennelSearch}
              onChange={(e) => setKennelSearch(e.target.value)}
              placeholder="Buscar canil..."
              className="w-full pl-9 pr-4 py-2.5 bg-earth-50 border border-earth-200 rounded-xl text-sm outline-none focus:border-brand-400"
            />
          </div>
        </div>
        {ownKennels.length > 0 && !kennelSearch && (
          <>
            <p className="px-5 pt-3 pb-1 text-[11px] font-semibold text-earth-400 uppercase tracking-wider">Seus canis</p>
            {ownKennels.map((k) => (
              <button
                key={k.id}
                onClick={() => { setKennelId(k.id); setKennelName(k.name); setSheet(null); }}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-earth-800 hover:bg-brand-50 transition-colors"
              >
                <span className="font-medium">{k.name}</span>
                {kennelId === k.id && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
              </button>
            ))}
            <div className="mx-5 border-t border-earth-100 my-1" />
            <p className="px-5 pt-2 pb-1 text-[11px] font-semibold text-earth-400 uppercase tracking-wider">Todos os canis</p>
          </>
        )}
        {filteredKennels.length === 0 ? (
          <p className="text-sm text-earth-400 text-center py-8">Nenhum canil encontrado</p>
        ) : (
          filteredKennels
            .filter((k) => ownKennels.every((ok) => ok.id !== k.id) || !!kennelSearch)
            .map((k) => (
              <button
                key={k.id}
                onClick={() => { setKennelId(k.id); setKennelName(k.name); setSheet(null); }}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-earth-800 hover:bg-brand-50 transition-colors"
              >
                <span>{k.name}</span>
                {kennelId === k.id && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
              </button>
            ))
        )}
      </Sheet>

      {/* ── Breed sheet ── */}
      <Sheet open={sheet === "breed"} onClose={() => setSheet(null)} title="Raça">
        <div className="px-4 pt-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              value={breedSearch}
              onChange={(e) => setBreedSearch(e.target.value)}
              placeholder="Buscar raça..."
              className="w-full pl-9 pr-4 py-2.5 bg-earth-50 border border-earth-200 rounded-xl text-sm outline-none focus:border-brand-400"
            />
          </div>
        </div>
        {filteredBreeds.length === 0 ? (
          <p className="text-sm text-earth-400 text-center py-8">Nenhuma raça encontrada</p>
        ) : (
          filteredBreeds.map((b) => (
            <button
              key={b.id}
              onClick={() => { setBreedId(b.id); setBreedName(b.name_pt); setSheet(null); }}
              className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-earth-800 hover:bg-brand-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {b.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.image_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                )}
                {b.name_pt}
              </div>
              {breedId === b.id && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
            </button>
          ))
        )}
      </Sheet>

      {/* ── Location sheet ── */}
      <Sheet open={sheet === "location"} onClose={() => setSheet(null)} title="Localização">
        <div className="px-5 pt-4 space-y-3">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex.: São Paulo, SP"
            className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-xl text-sm outline-none focus:border-brand-400"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") setSheet(null); }}
          />
          <button
            onClick={() => setSheet(null)}
            className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </Sheet>
    </div>
  );
}
