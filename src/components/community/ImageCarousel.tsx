"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = "" }: ImageCarouselProps) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-square bg-earth-100">
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 672px) 100vw, 672px"
        />
      </div>
    );
  }

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full aspect-square bg-earth-100 overflow-hidden">
      {/* Scroll container — CSS snap for mobile swipe */}
      <div
        className="flex h-full"
        style={{ transform: `translateX(-${idx * 100}%)`, transition: "transform 0.3s ease" }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>
        ))}
      </div>

      {/* Desktop arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors hidden sm:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors hidden sm:flex"
        aria-label="Próxima"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === idx ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Imagem ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter badge */}
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-medium">
        {idx + 1}/{images.length}
      </div>
    </div>
  );
}
