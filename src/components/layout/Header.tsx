"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, User, PawPrint } from "lucide-react";

const navLinks = [
  { href: "/buscar", label: "Buscar canis" },
  { href: "/encontrar-raca", label: "Encontrar raça" },
  { href: "/doacoes", label: "Doações" },
  { href: "/comunidade", label: "Comunidade" },
  { href: "/para-criadores", label: "Para criadores" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
              className="px-4 py-2 text-sm font-medium text-earth-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            >
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
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 bg-brand-100 hover:bg-brand-200 rounded-full transition-colors"
          >
            <User className="w-4 h-4" />
            Entrar
          </Link>
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
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Entrar ou cadastrar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
