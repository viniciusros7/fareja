"use client";

import Link from "next/link";
import {
  Dog, Star, Eye, MessageCircle, TrendingUp, PawPrint,
  Plus, ArrowRight, Users, Camera,
} from "lucide-react";

const stats = [
  { label: "Filhotes disponíveis", value: "3", icon: Dog, change: "+1 esta semana", cls: "bg-forest-50 text-forest-600" },
  { label: "Avaliação Fareja", value: "★ 5.0", icon: Star, change: "47 avaliações", cls: "bg-brand-50 text-brand-600" },
  { label: "Visitas ao perfil", value: "1.284", icon: Eye, change: "+18% vs mês anterior", cls: "bg-blue-50 text-blue-700" },
  { label: "Mensagens", value: "12", icon: MessageCircle, change: "3 não lidas", cls: "bg-purple-50 text-purple-700" },
];

const recentActivity = [
  { text: "Novo filhote Golden cadastrado", time: "Há 2 horas", type: "puppy" },
  { text: "Avaliação 5★ de Camila S.", time: "Há 1 dia", type: "review" },
  { text: "Post no feed recebeu 89 curtidas", time: "Há 2 dias", type: "post" },
  { text: "Fernanda L. entrou em contato", time: "Há 3 dias", type: "message" },
  { text: "Perfil visitado 47 vezes hoje", time: "Hoje", type: "view" },
];

export default function PainelPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-brand-100 to-brand-50 border border-brand-200">
        <h2 className="text-base font-semibold text-earth-900 mb-1">Bem-vindo, Fábio!</h2>
        <p className="text-sm text-earth-500">
          Seu canil teve 1.284 visitas este mês. Continue postando no feed para aumentar o engajamento.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`p-4 rounded-xl ${s.cls} border border-transparent`}>
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-4 h-4 opacity-60" />
            </div>
            <div className="text-xl font-semibold">{s.value}</div>
            <div className="text-[11px] opacity-70 mt-0.5">{s.label}</div>
            <div className="text-[10px] opacity-50 mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-earth-700 mb-3">Ações rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/painel/filhotes"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center group-hover:bg-forest-100">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Adicionar filhote</div>
              <div className="text-xs text-earth-400">Cadastrar nova ninhada</div>
            </div>
          </Link>

          <Link
            href="/painel/comunidade"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-200">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Postar no feed</div>
              <div className="text-xs text-earth-400">Foto, vídeo ou artigo</div>
            </div>
          </Link>

          <Link
            href="/painel/perfil"
            className="flex items-center gap-3 p-4 rounded-xl border border-earth-200 bg-white hover:bg-brand-50 hover:border-brand-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-earth-800">Editar perfil</div>
              <div className="text-xs text-earth-400">Atualizar informações</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-sm font-semibold text-earth-700 mb-3">Atividade recente</h3>
        <div className="rounded-xl border border-earth-200 bg-white divide-y divide-earth-100">
          {recentActivity.map((a, i) => (
            <div key={i} className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-earth-700">{a.text}</span>
              <span className="text-xs text-earth-400 shrink-0 ml-3">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
