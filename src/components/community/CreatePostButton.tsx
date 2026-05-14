"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";

export default function CreatePostButton() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <Link
      href="/comunidade/feed/novo"
      className="fixed bottom-20 md:bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center"
      aria-label="Criar post"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
}
