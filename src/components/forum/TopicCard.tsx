import Link from "next/link";
import { Pin, CheckCircle2, MessageSquare, Heart, Eye, Gem, Star, CheckCircle } from "lucide-react";
import type { ForumTopic } from "@/lib/types/forum";

function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d}d`;
  return new Date(date).toLocaleDateString("pt-BR");
}

const planBadge: Record<string, { label: string; cls: string; Icon: typeof Gem }> = {
  super_premium: { label: "Elite",      cls: "bg-gradient-to-r from-brand-600 to-brand-500 text-white", Icon: Gem },
  premium:       { label: "Premium",    cls: "bg-brand-600 text-white",                                  Icon: Star },
  basic:         { label: "Verificado", cls: "bg-forest-50 text-forest-700",                             Icon: CheckCircle },
};

interface TopicCardProps {
  topic: ForumTopic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const isKennelPost = topic.author?.role === "kennel" && topic.kennel;
  const displayName = topic.kennel?.name ?? topic.author?.full_name ?? "Usuário";
  const badge = isKennelPost && topic.kennel ? planBadge[topic.kennel.plan] : null;
  const slug = topic.category?.slug ?? "";

  return (
    <Link
      href={`/comunidade/forum/${slug}/${topic.id}`}
      className="block p-4 rounded-xl border border-earth-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all group"
    >
      {/* Badges row */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {topic.is_pinned && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">
            <Pin className="w-2.5 h-2.5" />
            Fixado
          </span>
        )}
        {topic.is_solved && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 text-[10px] font-semibold">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Resolvido
          </span>
        )}
        {topic.status === "closed" && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-earth-100 text-earth-500 text-[10px] font-semibold">
            Fechado
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-earth-900 group-hover:text-brand-600 transition-colors leading-snug mb-2 line-clamp-2">
        {topic.title}
      </h3>

      {/* Preview */}
      <p className="text-xs text-earth-500 leading-relaxed line-clamp-2 mb-3">
        {topic.content}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[9px] font-semibold shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[11px] text-earth-500 truncate">{displayName}</span>
          {badge && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${badge.cls} shrink-0`}>
              <badge.Icon className="w-2 h-2" />
              {badge.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-earth-400">
            <MessageSquare className="w-3.5 h-3.5" />
            {topic.replies_count}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-earth-400">
            <Heart className="w-3.5 h-3.5" />
            {topic.likes_count}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-earth-400">
            <Eye className="w-3.5 h-3.5" />
            {topic.views_count}
          </span>
          <span className="text-[11px] text-earth-400">{timeAgo(topic.updated_at)}</span>
        </div>
      </div>
    </Link>
  );
}
