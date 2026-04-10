"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";

interface FavoriteButtonProps {
  favorited: boolean;
  onToggle: () => void;
  className?: string;
}

export default function FavoriteButton({ favorited, onToggle, className = "" }: FavoriteButtonProps) {
  const { user } = useUser();

  if (!user) {
    return (
      <Link
        href="/login"
        onClick={(e) => e.stopPropagation()}
        title="Entre para favoritar"
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors ${className}`}
      >
        <Heart className="w-4 h-4 text-earth-400" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          favorited ? "fill-red-500 text-red-500" : "text-earth-400"
        }`}
      />
    </button>
  );
}
