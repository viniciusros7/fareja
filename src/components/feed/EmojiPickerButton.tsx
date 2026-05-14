"use client";

import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";
import dynamic from "next/dynamic";
import type { EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  onSelect: (emoji: string) => void;
}

export function EmojiPickerButton({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleEmojiClick(data: EmojiClickData) {
    onSelect(data.emoji);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Adicionar emoji"
        className="w-6 h-6 flex items-center justify-center text-earth-400 hover:text-earth-600 transition-colors"
      >
        <Smile className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute bottom-8 left-0 z-50 shadow-lg rounded-xl overflow-hidden">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            searchPlaceholder="Buscar emoji..."
            skinTonesDisabled={false}
            height={350}
            width={320}
          />
        </div>
      )}
    </div>
  );
}
