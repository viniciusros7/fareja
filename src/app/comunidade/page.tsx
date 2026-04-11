"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon, MessageCircle, AtSign,
  PawPrint,
} from "lucide-react";

export default function ComunidadePage() {
  const [tab, setTab] = useState<"feed" | "forum">("feed");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold text-brand-900 mb-1">
          Comunidade
        </h1>
        <p className="text-sm text-earth-500">
          Fotos, experiências e dúvidas sobre o mundo pet.
        </p>
      </div>

      {/* Instagram banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 flex items-center gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
          <AtSign className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-earth-800">Siga a Fareja no Instagram</p>
          <p className="text-xs text-earth-500 truncate">Bastidores, filhotes e conteúdo exclusivo.</p>
        </div>
        <a
          href="https://instagram.com/fareja"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white border border-pink-200 text-pink-600 text-xs font-semibold rounded-full hover:bg-pink-50 transition-colors shrink-0"
        >
          Seguir
        </a>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-earth-200 mb-6">
        <button
          onClick={() => setTab("feed")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "feed"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-earth-500 hover:text-earth-700"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Feed
        </button>
        <button
          onClick={() => setTab("forum")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "forum"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-earth-500 hover:text-earth-700"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Fórum
        </button>
      </div>

      {/* Feed tab */}
      {tab === "feed" && (
        <div className="space-y-4">
          <p className="text-sm text-earth-500">
            Explore fotos e vídeos compartilhados pela comunidade Fareja.
          </p>
          <Link
            href="/comunidade/feed"
            className="flex items-center gap-4 p-5 rounded-xl border border-earth-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-200 transition-colors shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-600 transition-colors">
                Abrir feed
              </div>
              <div className="text-xs text-earth-400 mt-0.5">
                Posts, fotos e vídeos da comunidade
              </div>
            </div>
          </Link>

          <Link
            href="/comunidade/feed/novo"
            className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-brand-300 bg-brand-50 hover:bg-brand-100 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-200 text-brand-600 flex items-center justify-center shrink-0">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-700">
                Criar novo post
              </div>
              <div className="text-xs text-brand-500 mt-0.5">
                Compartilhe fotos, vídeos ou texto
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Forum tab */}
      {tab === "forum" && (
        <div className="space-y-4">
          <p className="text-sm text-earth-500">
            Perguntas, dicas e discussões sobre cães, raças e criadores.
          </p>
          <Link
            href="/comunidade/forum"
            className="flex items-center gap-4 p-5 rounded-xl border border-earth-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-200 transition-colors shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-600 transition-colors">
                Abrir fórum
              </div>
              <div className="text-xs text-earth-400 mt-0.5">
                Categorias, tópicos e respostas da comunidade
              </div>
            </div>
          </Link>

          <Link
            href="/comunidade/forum/novo"
            className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-brand-300 bg-brand-50 hover:bg-brand-100 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-200 text-brand-600 flex items-center justify-center shrink-0">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-700">
                Fazer uma pergunta
              </div>
              <div className="text-xs text-brand-500 mt-0.5">
                Compartilhe sua dúvida com a comunidade
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
