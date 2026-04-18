"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FundadoresBanner() {
  const [members, setMembers] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats/growth")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setMembers(d.members ?? null); });
  }, []);

  const count = members ?? 5;
  const remaining = Math.max(0, 100 - count);
  const pct = Math.min(100, count);

  return (
    <>
      <style>{`
        .fundadores-section {
          background: var(--color-brand-600);
          color: var(--color-cream-light);
          padding: 4rem clamp(1.25rem, 4vw, 2.5rem);
          position: relative;
          overflow: hidden;
        }
        .fundadores-inner {
          max-width: 1240px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .fundadores-label {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(250,243,226,0.85);
          font-weight: 600;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid rgba(250,243,226,0.5);
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        .fundadores-title {
          font-family: var(--font-display);
          font-weight: 350;
          font-variation-settings: 'opsz' 144, 'SOFT' 50;
          font-size: clamp(2.25rem, 8vw, 4rem);
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
          text-wrap: balance;
        }
        .fundadores-title em {
          font-style: italic;
          color: var(--color-cream-bg);
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
        .fundadores-body {
          font-size: 1.05rem;
          line-height: 1.55;
          max-width: 30rem;
          opacity: 0.92;
          margin-bottom: 2.5rem;
        }
        .progress-typo {
          display: flex;
          align-items: baseline;
          font-family: var(--font-display);
          font-weight: 300;
          font-variation-settings: 'opsz' 144, 'SOFT' 60;
          line-height: 0.85;
          letter-spacing: -0.05em;
          margin-bottom: 0.75rem;
        }
        .progress-current {
          font-size: clamp(5rem, 22vw, 10rem);
          color: var(--color-cream-bg);
        }
        .progress-sep {
          font-size: clamp(3.5rem, 15vw, 6.5rem);
          opacity: 0.4;
          margin: 0 0.1em;
          font-style: italic;
        }
        .progress-total {
          font-size: clamp(3.5rem, 15vw, 6.5rem);
          opacity: 0.55;
        }
        .progress-rail {
          position: relative;
          height: 2px;
          background: rgba(250,243,226,0.2);
          margin: 1rem 0;
          overflow: hidden;
        }
        .progress-fill {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          background: var(--color-cream-bg);
          transform-origin: left;
          animation: progressGrow 1.8s 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .progress-meta {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-sans);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 2.5rem;
        }
        .fundadores-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          width: 100%;
          padding: 1.1rem 1.5rem;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-decoration: none;
          background: var(--color-cream-light);
          color: var(--color-terracotta-dark);
          border: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .fundadores-cta:hover {
          background: var(--color-ink);
          color: var(--color-cream-light);
        }
        .fundadores-cta:active { transform: scale(0.98); }
        .fundadores-paw {
          position: absolute;
          right: -40px;
          top: -30px;
          width: 240px;
          height: 240px;
          opacity: 0.12;
          transform: rotate(15deg);
          color: var(--color-cream-bg);
          pointer-events: none;
          fill: currentColor;
        }
      `}</style>

      <section className="fundadores-section" aria-labelledby="fundadores-title">
        {/* Decorative paw */}
        <svg className="fundadores-paw" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="30" cy="30" r="8" />
          <circle cx="70" cy="30" r="8" />
          <circle cx="18" cy="55" r="6.5" />
          <circle cx="82" cy="55" r="6.5" />
          <ellipse cx="50" cy="70" rx="16" ry="13" />
        </svg>

        <div className="fundadores-inner">
          <span className="fundadores-label">Fundadores</span>
          <h2 id="fundadores-title" className="fundadores-title">
            Procuramos nossos <em>100 primeiros</em>.
          </h2>
          <p className="fundadores-body">
            O Fareja está em formação. Os primeiros membros ajudam a definir o que ele se
            torna — e entram na capa da Edição Nº&nbsp;02.
          </p>

          <div className="progress-typo" aria-hidden="true">
            <span className="progress-current">{String(count).padStart(2, "0")}</span>
            <span className="progress-sep">/</span>
            <span className="progress-total">100</span>
          </div>

          <div
            className="progress-rail"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Vagas preenchidas"
          >
            <div
              className="progress-fill"
              style={{ "--progress-target": `${pct}%` } as React.CSSProperties}
            />
          </div>

          <div className="progress-meta">
            <span>Vagas preenchidas</span>
            <span>{remaining} restantes</span>
          </div>

          <Link href="/login" className="fundadores-cta">
            <span>Quero ser fundador</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3em",
                lineHeight: 0.8,
              }}
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
