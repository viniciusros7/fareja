"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, PawPrint } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";
import { createClient } from "@/lib/supabase/client";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/canis", label: "Canis verificados" },
  { href: "/comunidade/feed", label: "Feed" },
  { href: "/comunidade/forum", label: "Fórum" },
  { href: "/encontrar-raca", label: "Qual raça é para mim?" },
];

const aboutLinks = [
  { href: "/canil-fundador", label: "Conhecer o canil fundador" },
  { href: "/para-criadores", label: "Programa Canis Fundadores" },
  { href: "/#manifesto", label: "Como funciona a verificação" },
];

const footerLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/termos", label: "Termos" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/privacidade", label: "LGPD" },
];

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { isKennel, isAdmin, isApprover } = useRole();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const el = drawerRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onClose();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(26,15,7,0.65);
          opacity: 0;
          transition: opacity 240ms cubic-bezier(0.2, 0.7, 0.2, 1);
          pointer-events: none;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 61;
          width: min(85vw, 360px);
          background: var(--color-cream-light, #FAF3E2);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1);
          overflow-y: auto;
        }
        .drawer-panel.open {
          transform: translateX(0);
        }
        @media (min-width: 768px) {
          .drawer-panel { width: 420px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .drawer-overlay, .drawer-panel {
            transition-duration: 0.01ms;
          }
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem 1.25rem;
          border-bottom: 0.5px solid rgba(26,15,7,0.12);
          flex-shrink: 0;
        }
        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .drawer-brand-word {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--color-terracotta-deep);
          letter-spacing: -0.02em;
        }
        .drawer-close {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--color-ink-muted);
          transition: background 0.15s, color 0.15s;
        }
        .drawer-close:hover {
          background: rgba(26,15,7,0.08);
          color: var(--color-ink);
        }
        .drawer-nav {
          flex: 1;
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          overflow-y: auto;
        }
        .drawer-section-head {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-ink-muted);
          font-weight: 500;
          padding-bottom: 0.5rem;
          border-bottom: 0.5px solid rgba(26,15,7,0.12);
          margin-bottom: 1rem;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.125rem;
          font-variation-settings: 'opsz' 40, 'wght' 420;
          color: var(--color-ink);
          text-decoration: none;
          padding: 0.3rem 0;
          transition: color 0.15s, transform 0.15s;
        }
        .drawer-link:hover {
          color: var(--color-terracotta-deep);
          transform: translateX(2px);
        }
        .drawer-link.active {
          color: var(--color-terracotta-deep);
          font-weight: 500;
        }
        .drawer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .drawer-auth-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.125rem;
          font-variation-settings: 'opsz' 40, 'wght' 420;
          color: var(--color-ink-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem 0;
          transition: color 0.15s;
          text-align: left;
        }
        .drawer-auth-btn:hover { color: var(--color-terracotta-deep); }
        .drawer-footer {
          padding: 1.25rem 2rem calc(1.5rem + env(safe-area-inset-bottom));
          border-top: 0.5px solid rgba(26,15,7,0.12);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          flex-shrink: 0;
        }
        .drawer-footer a {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-ink-muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .drawer-footer a:hover { color: var(--color-ink); }
        .drawer-footer-sep {
          color: rgba(26,15,7,0.25);
          font-size: 11px;
        }
      `}</style>

      {/* Overlay */}
      <div
        className={`drawer-overlay${isOpen ? " open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        className={`drawer-panel${isOpen ? " open" : ""}`}
      >
        {/* Header */}
        <div className="drawer-header">
          <Link href="/" className="drawer-brand" onClick={onClose}>
            <div
              style={{
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "50%",
                background: "var(--color-brand-100, #F5ECD7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PawPrint style={{ width: "1rem", height: "1rem", color: "var(--color-terracotta-deep)" }} />
            </div>
            <span className="drawer-brand-word">Fareja</span>
          </Link>
          <button
            ref={closeRef}
            onClick={onClose}
            className="drawer-close"
            aria-label="Fechar menu"
          >
            <X style={{ width: "1.125rem", height: "1.125rem" }} />
          </button>
        </div>

        {/* Nav */}
        <nav aria-label="Menu principal" className="drawer-nav">
          {/* Navegação */}
          <section>
            <h2 className="drawer-section-head">Navegação</h2>
            <ul className="drawer-link-list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`drawer-link${isActive(link.href) ? " active" : ""}`}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Sobre */}
          <section>
            <h2 className="drawer-section-head">Sobre o Fareja</h2>
            <ul className="drawer-link-list">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`drawer-link${isActive(link.href) ? " active" : ""}`}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Conta */}
          {user ? (
            <section>
              <h2 className="drawer-section-head">Conta</h2>
              <ul className="drawer-link-list">
                <li>
                  <Link
                    href="/painel/perfil"
                    className={`drawer-link${isActive("/painel/perfil") ? " active" : ""}`}
                    onClick={onClose}
                  >
                    Meu perfil
                  </Link>
                </li>
                {isKennel && (
                  <li>
                    <Link
                      href="/painel"
                      className={`drawer-link${isActive("/painel") ? " active" : ""}`}
                      onClick={onClose}
                    >
                      Meu canil
                    </Link>
                  </li>
                )}
                {(isAdmin || isApprover) && (
                  <li>
                    <Link
                      href="/admin"
                      className={`drawer-link${isActive("/admin") ? " active" : ""}`}
                      onClick={onClose}
                    >
                      Painel admin
                    </Link>
                  </li>
                )}
                <li>
                  <button className="drawer-auth-btn" onClick={handleSignOut}>
                    Sair
                  </button>
                </li>
              </ul>
            </section>
          ) : (
            <section>
              <ul className="drawer-link-list">
                <li>
                  <Link href="/login" className="drawer-link" onClick={onClose}>
                    Entrar
                  </Link>
                </li>
              </ul>
            </section>
          )}
        </nav>

        {/* Footer */}
        <footer className="drawer-footer">
          {footerLinks.map((link, i) => (
            <span key={link.label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {i > 0 && <span className="drawer-footer-sep" aria-hidden="true">·</span>}
              <Link href={link.href} onClick={onClose}>{link.label}</Link>
            </span>
          ))}
        </footer>
      </div>
    </>
  );
}
