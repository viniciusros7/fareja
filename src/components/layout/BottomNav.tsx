"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PawPrint, Layers, MessageCircle, User } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useNotificationCount } from "@/lib/hooks/useNotificationCount";

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(item.href, pathname);
  return (
    <Link
      href={item.href}
      className={`flex flex-col items-center gap-1 px-3 py-2 min-w-0 transition-colors ${
        active ? "text-brand-600" : "text-earth-400"
      }`}
    >
      <div className="relative">
        <item.icon
          className="w-[22px] h-[22px]"
          strokeWidth={active ? 2.5 : 1.75}
        />
        {item.badge != null && item.badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {item.badge > 9 ? "9+" : item.badge}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] font-medium leading-none ${
          active ? "text-brand-600" : "text-earth-400"
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

  const isFeedActive = isActive("/comunidade/feed", pathname);

  const leftItems: NavItem[] = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/canis", icon: PawPrint, label: "Canis" },
  ];

  const rightItems: NavItem[] = [
    { href: "/comunidade/forum", icon: MessageCircle, label: "Fórum" },
    {
      href: user ? "/painel/perfil" : "/login",
      icon: User,
      label: "Perfil",
      badge: unread,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFBF5]/96 backdrop-blur-md border-t border-earth-100 shadow-[0_-1px_0_0_rgba(0,0,0,0.04)]">
      {/* Safe area support */}
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {/* Left items */}
        {leftItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* Central Feed button */}
        <Link
          href="/comunidade/feed"
          className="flex flex-col items-center gap-1 px-2 py-1"
          aria-label="Feed"
        >
          <div
            className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isFeedActive
                ? "bg-brand-700 shadow-lg shadow-brand-700/30"
                : "bg-brand-600 shadow-lg shadow-brand-600/30"
            }`}
            style={{ marginTop: "-18px" }}
          >
            <Layers
              className="w-6 h-6 text-white"
              strokeWidth={isFeedActive ? 2.5 : 2}
            />
          </div>
          <span
            className={`text-[10px] font-semibold leading-none -mt-0.5 ${
              isFeedActive ? "text-brand-700" : "text-brand-600"
            }`}
          >
            Feed
          </span>
        </Link>

        {/* Right items */}
        {rightItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
