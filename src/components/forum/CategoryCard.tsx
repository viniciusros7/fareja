import Link from "next/link";
import {
  Heart, Brain, Search, Scissors, Star, Home, MessageCircle,
  LayoutGrid,
} from "lucide-react";
import type { ForumCategory } from "@/lib/types/forum";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Brain,
  Search,
  Scissors,
  Star,
  Home,
  MessageCircle,
};

interface CategoryCardProps {
  category: ForumCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = (category.icon && iconMap[category.icon]) ? iconMap[category.icon] : LayoutGrid;

  return (
    <Link
      href={`/comunidade/forum/${category.slug}`}
      className="flex items-start gap-4 p-4 rounded-xl border border-earth-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all group"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-200 transition-colors shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-earth-900 group-hover:text-brand-600 transition-colors">
          {category.name}
        </div>
        {category.description && (
          <div className="text-xs text-earth-400 mt-0.5 leading-relaxed line-clamp-2">
            {category.description}
          </div>
        )}
        <div className="text-[11px] text-earth-400 mt-1.5">
          {category.topics_count} {category.topics_count === 1 ? "tópico" : "tópicos"}
        </div>
      </div>
    </Link>
  );
}
