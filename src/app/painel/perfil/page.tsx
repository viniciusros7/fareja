"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User, Edit2, Check, X, Bell, BellOff, ExternalLink,
  MessageCircle, Heart, FileText, Award, ShieldCheck,
  Loader2, ChevronRight, Store,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";

interface ProfileStats {
  forum_topics: number;
  forum_replies: number;
  liked_posts: number;
  member_rank: number;
}

interface KennelData {
  id: string;
  name: string;
  slug: string;
  plan: string;
  cover_url: string | null;
  logo_url: string | null;
  city: string;
  state: string;
}

interface KennelPost {
  id: string;
  thumbnail_url: string | null;
}

interface Notification {
  id: string;
  type: string;
  content: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  created_at: string;
}

type Tab = "atividade" | "canil" | "admin";

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return `${Math.floor(d / 30)}m`;
}

export default function PerfilPage() {
  const { user, loading: userLoading } = useUser();
  const { isAdmin, isApprover, isKennel } = useRole();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [kennel, setKennel] = useState<KennelData | null>(null);
  const [kennelPosts, setKennelPosts] = useState<KennelPost[]>([]);
  const [favoritesReceived, setFavoritesReceived] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("atividade");

  // Edit form state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userLoading || !user) return;
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/notifications").then((r) => r.json()),
    ]).then(([profileRes, notifRes]) => {
      if (profileRes.profile) setProfileData(profileRes.profile);
      if (profileRes.stats) setStats(profileRes.stats);
      if (profileRes.kennel) setKennel(profileRes.kennel);
      if (profileRes.kennel_posts) setKennelPosts(profileRes.kennel_posts);
      if (typeof profileRes.favorites_received === "number") setFavoritesReceived(profileRes.favorites_received);
      if (notifRes.data) setNotifications(notifRes.data);
      setLoadingData(false);
    });
  }, [user, userLoading]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function startEdit() {
    setEditName(profileData?.full_name ?? "");
    setEditBio(profileData?.bio ?? "");
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: editName, bio: editBio }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setProfileData((prev) => prev ? { ...prev, full_name: data.full_name, bio: data.bio } : prev);
      setEditing(false);
    }
    setSaving(false);
  }

  async function markNotifRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
  }

  if (userLoading || loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profileData?.full_name ?? user.user_metadata?.full_name ?? user.email ?? "Usuário";
  const avatarUrl = profileData?.avatar_url ?? user.user_metadata?.avatar_url ?? null;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const memberRank = stats?.member_rank ?? 0;
  const isFounder = isKennel && memberRank <= 10;
  const isTop100 = memberRank > 0 && memberRank <= 100;

  const tabs: { id: Tab; label: string }[] = [
    { id: "atividade", label: "Atividade" },
    ...(isKennel || isAdmin ? [{ id: "canil" as Tab, label: "Meu Canil" }] : []),
    ...(isAdmin || isApprover ? [{ id: "admin" as Tab, label: "Administração" }] : []),
  ];

  const planLabel: Record<string, string> = {
    basic: "Basic",
    premium: "Premium",
    super_premium: "Super Premium",
  };

  return (
    <div className="space-y-6">
      {/* ── Profile Header ── */}
      <div className="p-5 rounded-2xl border border-earth-200 bg-white">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
            )}
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-1.5 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30"
                />
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Bio (opcional)"
                  rows={2}
                  maxLength={160}
                  className="w-full px-3 py-1.5 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30 resize-none"
                />
                <p className="text-[10px] text-earth-400">{editBio.length}/160</p>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-earth-100 text-earth-600 text-xs font-semibold rounded-lg hover:bg-earth-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-lg font-semibold text-earth-900">{displayName}</h2>
                  {isFounder && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                      <Award className="w-3 h-3" />
                      Canil Fundador
                    </span>
                  )}
                  {!isFounder && isTop100 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-earth-100 text-earth-600">
                      Membro #{memberRank}
                    </span>
                  )}
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                  {isApprover && !isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-600">
                      <ShieldCheck className="w-3 h-3" />
                      Aprovador
                    </span>
                  )}
                </div>
                <p className="text-xs text-earth-500 mt-0.5">{user.email}</p>
                {profileData?.bio && (
                  <p className="text-sm text-earth-700 mt-1 leading-relaxed">{profileData.bio}</p>
                )}
                <button
                  onClick={startEdit}
                  className="mt-2 flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar perfil
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="mt-5 pt-5 border-t border-earth-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-earth-900">{stats.forum_topics}</p>
              <p className="text-[11px] text-earth-500">Tópicos</p>
            </div>
            <div>
              <p className="text-lg font-bold text-earth-900">{stats.forum_replies}</p>
              <p className="text-[11px] text-earth-500">Respostas</p>
            </div>
            <div>
              <p className="text-lg font-bold text-earth-900">{stats.liked_posts}</p>
              <p className="text-[11px] text-earth-500">Curtidas</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-earth-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-earth-900 shadow-sm"
                : "text-earth-500 hover:text-earth-700"
            }`}
          >
            {tab.label}
            {tab.id === "atividade" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Atividade Tab ── */}
      {activeTab === "atividade" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-earth-700">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                <BellOff className="w-3.5 h-3.5" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-8 h-8 text-earth-300 mx-auto mb-2" />
              <p className="text-sm text-earth-400">Nenhuma notificação ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    notif.read
                      ? "border-earth-100 bg-white"
                      : "border-brand-200 bg-brand-50/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.read ? "bg-earth-100 text-earth-400" : "bg-brand-100 text-brand-600"
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-earth-800 leading-snug">{notif.content}</p>
                      <p className="text-xs text-earth-400 mt-1">{timeAgo(notif.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="text-brand-600 hover:text-brand-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                      {!notif.read && (
                        <button
                          onClick={() => markNotifRead(notif.id)}
                          className="text-earth-400 hover:text-earth-600"
                          title="Marcar como lida"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Forum quick links */}
          <div className="pt-2 border-t border-earth-100 space-y-2">
            <h3 className="text-sm font-semibold text-earth-700">Fórum</h3>
            <Link
              href="/comunidade/forum"
              className="flex items-center justify-between p-3 rounded-xl border border-earth-200 bg-white hover:bg-earth-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-earth-700">
                <MessageCircle className="w-4 h-4 text-earth-400" />
                Explorar categorias
              </div>
              <ChevronRight className="w-4 h-4 text-earth-400" />
            </Link>
            <Link
              href="/comunidade/forum/novo"
              className="flex items-center justify-between p-3 rounded-xl border border-earth-200 bg-white hover:bg-earth-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-earth-700">
                <FileText className="w-4 h-4 text-earth-400" />
                Criar novo tópico
              </div>
              <ChevronRight className="w-4 h-4 text-earth-400" />
            </Link>
            <Link
              href="/painel/favoritos"
              className="flex items-center justify-between p-3 rounded-xl border border-earth-200 bg-white hover:bg-earth-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-earth-700">
                <Heart className="w-4 h-4 text-earth-400" />
                Canis favoritos
              </div>
              <ChevronRight className="w-4 h-4 text-earth-400" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Meu Canil Tab ── */}
      {activeTab === "canil" && (
        <div className="space-y-4">
          {kennel ? (
            <>
              {/* Kennel card */}
              <div className="p-4 rounded-xl border border-earth-200 bg-white space-y-3">
                <div className="flex items-center gap-3">
                  {kennel.logo_url ? (
                    <img src={kennel.logo_url} alt={kennel.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                      <Store className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-earth-900 truncate">{kennel.name}</p>
                    <p className="text-xs text-earth-500">{kennel.city}, {kennel.state}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                    {planLabel[kennel.plan] ?? kennel.plan}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-sm">
                  <span className="text-earth-600">
                    <span className="font-bold text-earth-900">{favoritesReceived}</span> favoritos recebidos
                  </span>
                  <Link
                    href={`/canis/${kennel.id}`}
                    className="text-brand-600 hover:text-brand-700 font-medium text-xs flex items-center gap-1"
                  >
                    Ver página pública <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Post grid */}
              {kennelPosts.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-earth-700 mb-2">Últimas publicações</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {kennelPosts.map((post) => (
                      <Link key={post.id} href={`/comunidade`}>
                        <div className="aspect-square rounded-lg bg-earth-100 overflow-hidden">
                          {post.thumbnail_url ? (
                            <img src={post.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-earth-300" />
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <Store className="w-8 h-8 text-earth-300 mx-auto mb-2" />
              <p className="text-sm text-earth-400">Nenhum canil vinculado à sua conta</p>
            </div>
          )}
        </div>
      )}

      {/* ── Admin Tab ── */}
      {activeTab === "admin" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-earth-700">Área administrativa</h3>
          <Link
            href="/admin/aprovar"
            className="flex items-center justify-between p-4 rounded-xl border border-earth-200 bg-white hover:bg-earth-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-earth-800">Aprovar Canis</p>
                <p className="text-xs text-earth-500">Revisar canis pendentes</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-earth-400" />
          </Link>

          {isAdmin && (
            <Link
              href="/admin/financeiro"
              className="flex items-center justify-between p-4 rounded-xl border border-earth-200 bg-white hover:bg-earth-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-forest-100 text-forest-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-earth-800">Financeiro</p>
                  <p className="text-xs text-earth-500">Assinaturas e receita</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-earth-400" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
