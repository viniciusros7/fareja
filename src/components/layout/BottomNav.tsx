"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PawPrint, Layers, MessageCircle, User } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useNotificationCount } from "@/lib/hooks/useNotificationCount";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(item.href, pathname);
  return (
    <Link
      href={item.href}
      className="flex flex-col items-center gap-1 px-3 py-2 min-w-0 transition-colors"
    >
      <div className="relative">
        <item.icon
          className={`w-5 h-5 ${active ? "text-brand-600" : "text-earth-400"}`}
          strokeWidth={active ? 2.5 : 1.6}
        />
        {item.badge != null && item.badge > 0 && (
          <span className="badge-pulse absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {item.badge > 9 ? "9+" : item.badge}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] leading-none tracking-wider uppercase ${
          active ? "font-semibold text-brand-600" : "font-normal text-earth-400"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const unread = useNotificationCount();

  const items: NavItem[] = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/comunidade/forum", icon: MessageCircle, label: "Fórum" },
    { href: "/comunidade/feed", icon: Layers, label: "Feed" },
    { href: "/canis", icon: PawPrint, label: "Canis" },
    { href: user ? "/painel/perfil" : "/login", icon: User, label: "Perfil", badge: unread },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFBF5]/96 backdrop-blur-md border-t border-earth-100 shadow-[0_-1px_0_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {items.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
