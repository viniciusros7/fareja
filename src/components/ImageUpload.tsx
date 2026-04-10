"use client";

import { useRef, useState, useCallback } from "react";
import { ImagePlus, X, Upload, AlertCircle, Camera } from "lucide-react";

interface PreviewFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  key: string;
}

interface ImageUploadProps {
  onUpload: (results: UploadResult[]) => void;
  maxFiles?: number;
  className?: string;
}

const ACCEPTED_IMAGES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_VIDEOS = ["video/mp4"];
const ALL_ACCEPTED = [...ACCEPTED_IMAGES, ...ACCEPTED_VIDEOS];

export default function ImageUpload({
  onUpload,
  maxFiles = 5,
  className = "",
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);

      const invalid = arr.find((f) => !ALL_ACCEPTED.includes(f.type));
      if (invalid) {
        setError(`Tipo não suportado: ${invalid.name}. Use JPEG, PNG, WebP ou MP4.`);
        return;
      }

      const combined = [...previews, ...arr];
      if (combined.length > maxFiles) {
        setError(`Máximo ${maxFiles} arquivo${maxFiles !== 1 ? "s" : ""}.`);
        return;
      }

      const newPreviews: PreviewFile[] = arr.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        type: ACCEPTED_IMAGES.includes(file.type) ? "image" : "video",
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [previews, maxFiles]
  );

  const remove = (id: string) => {
    setPreviews((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const upload = () => {
    if (previews.length === 0 || uploading) return;
    setError(null);
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    previews.forEach((p) => formData.append("files", p.file));

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          previews.forEach((p) => URL.revokeObjectURL(p.preview));
          setPreviews([]);
          setProgress(0);
          onUpload(data.files as UploadResult[]);
        } catch {
          setError("Resposta inválida do servidor.");
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          setError(data.error ?? "Erro no upload.");
        } catch {
          setError("Erro no upload.");
        }
      }
    });

    xhr.addEventListener("error", () => {
      setUploading(false);
      setError("Falha na conexão. Tente novamente.");
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const remaining = maxFiles - previews.length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Drop zone — only show if slots remain */}
      {remaining > 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging
              ? "border-brand-400 bg-brand-50"
              : "border-earth-200 bg-earth-50 hover:border-brand-300 hover:bg-brand-50/50"
          }`}
        >
          <ImagePlus className="w-7 h-7 text-earth-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-earth-700">
              Arraste fotos ou vídeos aqui
            </p>
            <p className="text-xs text-earth-400 mt-0.5">
              ou clique para selecionar
            </p>
          </div>
          <p className="text-[11px] text-earth-400">
            JPEG, PNG, WebP, MP4 · fotos até 5MB · vídeos até 30MB ·{" "}
            {remaining} vaga{remaining !== 1 ? "s" : ""}
          </p>

          {/* Hidden file input — accepts camera on mobile */}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ALL_ACCEPTED.join(",")}
            capture={undefined}
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />

          {/* Mobile camera shortcut */}
          <div className="absolute top-3 right-3 sm:hidden">
            <Camera className="w-5 h-5 text-earth-400" />
          </div>
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {previews.map((p) => (
            <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden bg-earth-100 group">
              {p.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={p.preview}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
              {!uploading && (
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-earth-500">
            <span>Enviando...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-earth-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Upload button */}
      {previews.length > 0 && !uploading && (
        <button
          type="button"
          onClick={upload}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Enviar {previews.length} arquivo{previews.length !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
