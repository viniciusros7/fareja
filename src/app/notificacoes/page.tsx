"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell, BellOff, Heart, MessageCircle, ChevronDown, ChevronUp, ArrowLeft,
} from "lucide-react";
import { useNotifications, type NotificationGroup, type NotifActor } from "@/lib/hooks/useNotifications";
import { timeAgo } from "@/lib/utils/time-ago";

// ─── Actor avatar ─────────────────────────────────────────────────────────────

function ActorAvatar({ actor, size = 36 }: { actor: NotifActor; size?: number }) {
  const initials = (actor.name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return actor.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={actor.avatar}
      alt={actor.name ?? ""}
      style={{ width: size, height: size }}
      className="rounded-full object-cover ring-2 ring-[#FFFBF5] shrink-0"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-semibold ring-2 ring-[#FFFBF5] shrink-0"
    >
      {initials}
    </div>
  );
}

// ─── Avatar stack (up to 3) ───────────────────────────────────────────────────

function AvatarStack({ actors }: { actors: NotifActor[] }) {
  const visible = actors.slice(0, 3);
  return (
    <div className="flex shrink-0" style={{ marginRight: 4 }}>
      {visible.map((a, i) => (
        <div key={a.id} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }}>
          <ActorAvatar actor={a} size={36} />
        </div>
      ))}
    </div>
  );
}

// ─── Action text ──────────────────────────────────────────────────────────────

function actionLabel(type: NotificationGroup["type"]): string {
  switch (type) {
    case "post_like":        return "curtiu seu post";
    case "post_comment":     return "comentou no seu post";
    case "forum_reply":      return "respondeu seu tópico";
    case "forum_topic_like": return "curtiu seu tópico";
    case "forum_reply_like": return "curtiu sua resposta";
  }
}

function actionIcon(type: NotificationGroup["type"]) {
  if (type === "post_like" || type === "forum_topic_like" || type === "forum_reply_like") {
    return <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" />;
  }
  return <MessageCircle className="w-3.5 h-3.5 text-brand-400 shrink-0" />;
}

function groupText(group: NotificationGroup): string {
  const actors = group.recentActors;
  const first = actors[0]?.name ?? "Alguém";
  const extra = group.totalCount - 1;
  const action = actionLabel(group.type);
  if (group.totalCount === 1) return `${first} ${action}`;
  if (group.totalCount === 2) return `${first} e ${actors[1]?.name ?? "outra pessoa"} ${action.replace("seu", "seu")}`;
  return `${first} e mais ${extra} pessoa${extra !== 1 ? "s" : ""} ${action}`;
}

function targetHref(group: NotificationGroup): string {
  if (group.targetType === "post") return "/comunidade/feed";
  if (group.targetType === "forum_topic") return `/comunidade/forum/topico/${group.targetId}`;
  return "/comunidade/forum";
}

// ─── Single group card ────────────────────────────────────────────────────────

function NotificationGroupCard({
  group,
  onRead,
}: {
  group: NotificationGroup;
  onRead: (g: NotificationGroup) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const isUnread = group.unreadCount > 0;

  function handleCardClick() {
    onRead(group);
    router.push(targetHref(group));
  }

  return (
    <div
      className={`border-b border-earth-100 last:border-0 transition-colors ${
        isUnread ? "bg-brand-50/40" : "bg-white"
      }`}
    >
      <div
        className="flex items-start gap-3 px-4 py-4 cursor-pointer hover:bg-earth-50 transition-colors"
        onClick={handleCardClick}
      >
        {/* Unread dot */}
        <div className="shrink-0 mt-[18px]">
          {isUnread ? (
            <span className="block w-2 h-2 rounded-full bg-brand-600" />
          ) : (
            <span className="block w-2 h-2" />
          )}
        </div>

        {/* Avatar stack */}
        <AvatarStack actors={group.recentActors} />

        {/* Text */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {actionIcon(group.type)}
            <p className="text-sm text-earth-800 leading-snug">
              {groupText(group)}
            </p>
          </div>
          {group.preview && (
            <p className="text-xs text-earth-400 mt-0.5 truncate max-w-[260px]">
              "{group.preview}"
            </p>
          )}
          <p className="text-[11px] text-earth-400 mt-1">{timeAgo(group.latestAt)}</p>
        </div>

        {/* Expand chevron */}
        {group.totalCount > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-400 transition-colors mt-1"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expanded: individual actors */}
      {expanded && (
        <div className="px-4 pb-3 pl-[52px] space-y-2">
          {group.recentActors.map((actor) => (
            <div key={actor.id} className="flex items-center gap-2.5">
              <ActorAvatar actor={actor} size={28} />
              <span className="text-sm text-earth-700">{actor.name ?? "Usuário"}</span>
              <span className="text-[11px] text-earth-400 ml-auto">{timeAgo(actor.created_at)}</span>
            </div>
          ))}
          {group.totalCount > 3 && (
            <p className="text-xs text-earth-400 pl-9">
              +{group.totalCount - 3} outra{group.totalCount - 3 !== 1 ? "s" : ""} pessoa{group.totalCount - 3 !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificacoesPage() {
  const { groups, unreadTotal, loading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/painel/perfil"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-earth-400">
              Atividades
            </p>
            <h1 className="font-display text-xl font-semibold text-brand-900 leading-tight">
              Notificações
            </h1>
          </div>
        </div>
        {unreadTotal > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            <BellOff className="w-3.5 h-3.5" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-earth-200 divide-y divide-earth-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-4">
              <div className="w-2 h-2 mt-4 rounded-full bg-earth-100" />
              <div className="w-9 h-9 rounded-full bg-earth-100 shrink-0 animate-pulse" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-earth-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-2.5 bg-earth-100 rounded-full w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell className="w-16 h-16 text-earth-200 mb-4" />
          <h2 className="font-display text-lg font-semibold text-earth-500 italic mb-1">
            Nenhuma atividade ainda
          </h2>
          <p className="text-sm text-earth-400 max-w-xs leading-relaxed">
            Quando alguém interagir com seus posts ou tópicos, você verá aqui.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-earth-200 overflow-hidden">
          {groups.map((group) => (
            <NotificationGroupCard
              key={group.groupKey}
              group={group}
              onRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
