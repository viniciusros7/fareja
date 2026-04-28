"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, User, PawPrint, LogOut, ChevronDown, Layers, ShieldCheck } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";
import { useNotificationCount } from "@/lib/hooks/useNotificationCount";

const allNavLinks = [
  { href: "/canis", label: "Canis" },
  { href: "/comunidade/feed", label: "Feed", highlight: true },
  { href: "/racas", label: "Raças" },
  { href: "/encontrar-raca", label: "Qual raça?" },
  { href: "/comunidade/forum", label: "Fórum" },
  { href: "/para-criadores", label: "Para criadores" },
];

function UserMenu() {
  const { user, signOut, loading } = useUser();
  const { isApprover } = useRole();
  const [open, setOpen] = useState(false);
  const unread = useNotificationCount();

  if (loading) {
    return <div className="w-20 h-8 rounded-full bg-earth-100 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 bg-brand-100 hover:bg-brand-200 rounded-full transition-colors"
      >
        <User className="w-4 h-4" />
        Entrar
      </Link>
    );
  }

  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase() || "U";
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;
  const displayName = name.split(" ")[0] || "Usuário";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-earth-200 hover:bg-earth-50 transition-colors"
      >
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center z-10">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={displayName} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-semibold">
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-earth-700 max-w-[80px] truncate">{displayName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-earth-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-earth-200 shadow-lg z-50 py-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-earth-100">
              <p className="text-xs font-semibold text-earth-800 truncate">{name}</p>
              <p className="text-[11px] text-earth-400 truncate">{user.email}</p>
            </div>
            <Link
              href="/painel"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
            >
              <PawPrint className="w-4 h-4 text-earth-400" />
              Meu painel
            </Link>
            {isApprover && (
              <Link
                href="/admin/candidaturas"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-earth-400" />
                Painel admin
              </Link>
            )}
            <button
              onClick={() => { setOpen(false); signOut(); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, loading } = useUser();
  const { role, loading: roleLoading } = useRole();

  // Apenas kennel/approver/super_admin veem "Para criadores"
  // Esconder enquanto role ainda carrega para evitar flash para role=client
  const navLinks = allNavLinks.filter((link) => {
    if (link.href === "/para-criadores") {
      return !!user && !roleLoading && role !== null && role !== "client";
    }
    return true;
  });

  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? "";
  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF5]/90 backdrop-blur-md border-b border-earth-200">
      <div className="max-w-6xl mx-auto px-4 h-12 md:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
            <PawPrint className="w-5 h-5 text-brand-600" />
          </div>
          <span className="font-display text-xl font-semibold text-brand-600 tracking-tight">
            Fareja
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                (link as { highlight?: boolean }).highlight
                  ? "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-full transition-colors"
                  : "px-4 py-2 text-sm font-medium text-earth-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              }
            >
              {(link as { highlight?: boolean }).highlight && (
                <Layers className="w-3.5 h-3.5" strokeWidth={2} />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/buscar"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-earth-100 transition-colors text-earth-500"
          >
            <Search className="w-4 h-4" />
          </Link>
          <UserMenu />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-earth-100 transition-colors text-earth-600"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-earth-200 bg-[#FFFBF5] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-earth-700 hover:bg-brand-50 rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-earth-200 mt-3">
            {loading ? (
              <div className="h-12 rounded-lg bg-earth-100 animate-pulse mx-2" />
            ) : user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-4 py-2">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-earth-800 truncate">{name.split(" ")[0]}</p>
                    <p className="text-[11px] text-earth-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); signOut(); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Entrar ou cadastrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
