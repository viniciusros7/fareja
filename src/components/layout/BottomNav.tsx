"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Users, User } from "lucide-react";

const items = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/buscar", icon: Search, label: "Buscar" },
  { href: "/doacoes", icon: Heart, label: "Doações" },
  { href: "/comunidade", icon: Users, label: "Comunidade" },
  { href: "/login", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFBF5]/95 backdrop-blur-md border-t border-earth-200">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                active ? "text-brand-600" : "text-earth-400 hover:text-earth-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
