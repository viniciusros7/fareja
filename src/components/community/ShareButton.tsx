"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, MessageCircle, Check } from "lucide-react";

interface ShareButtonProps {
  postId: string;
  title?: string;
  text?: string;
}

export default function ShareButton({ postId, title = "Fareja", text = "" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/comunidade/feed/${postId}`;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled
      }
      return;
    }
    setOpen((v) => !v);
  }

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
    });
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-sm text-earth-500 hover:text-brand-600 transition-colors"
        aria-label="Compartilhar"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute bottom-8 right-0 w-48 bg-white rounded-xl border border-earth-200 shadow-lg z-20 py-1 overflow-hidden">
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-forest-500" /> : <Link2 className="w-4 h-4 text-earth-400" />}
            {copied ? "Copiado!" : "Copiar link"}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            WhatsApp
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
          >
            <span className="w-4 h-4 flex items-center justify-center text-sky-500 font-bold text-xs shrink-0">X</span>
            Twitter / X
          </a>
        </div>
      )}
    </div>
  );
}
