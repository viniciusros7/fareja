"use client";

import { useRef, useState, useEffect } from "react";
import { useCountUp } from "@/hooks/useCountUp";

interface FichaItem {
  index: string;
  label: string;
  desc: string;
  end: number;
  suffix: string;
  formatThousands?: boolean;
}

const items: FichaItem[] = [
  { index: "01", label: "Acervo", desc: "Em cinofilia responsável", end: 37, suffix: "+" },
  { index: "02", label: "Exemplares", desc: "Entusiastas de pet na comunidade", end: 6032, suffix: "+", formatThousands: true },
  { index: "03", label: "Catálogo", desc: "Canis fundadores verificados", end: 4, suffix: "" },
];

function FichaNumber({ item, started }: { item: FichaItem; started: boolean }) {
  const count = useCountUp(item.end, 1400, started);
  const raw = item.formatThousands
    ? count.toLocaleString("pt-BR")
    : String(count).padStart(2, "0");

  return (
    <span className="ficha-number">
      {raw}
      {item.suffix && <sup className="ficha-sup">{item.suffix}</sup>}
    </span>
  );
}

export default function FichaTecnica() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .ficha-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 3rem clamp(1.25rem, 4vw, 2.5rem) 4rem;
          border-top: 0.5px solid rgba(26,15,7,0.15);
          border-bottom: 0.5px solid rgba(26,15,7,0.15);
        }
        .ficha-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .ficha-section-label {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--color-terracotta-deep);
          font-weight: 600;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid currentColor;
          display: inline-block;
        }
        .ficha-head-title {
          font-family: var(--font-display);
          font-weight: 400;
          font-style: italic;
          font-variation-settings: 'opsz' 60;
          font-size: clamp(1.5rem, 4vw, 2rem);
          color: var(--color-ink);
          letter-spacing: -0.015em;
        }
        .ficha-list {
          display: grid;
          grid-template-columns: 1fr;
        }
        .ficha-item {
          padding: 1.75rem 0;
          border-bottom: 0.5px dashed rgba(26,15,7,0.35);
          display: grid;
          grid-template-columns: 48px 1fr auto;
          align-items: baseline;
          gap: 1rem;
        }
        .ficha-item:last-child { border-bottom: none; }
        .ficha-index {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--color-ink-muted);
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }
        .ficha-body {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .ficha-label {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-terracotta-deep);
          font-weight: 600;
        }
        .ficha-desc {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1rem;
          color: var(--color-ink-soft);
          line-height: 1.4;
        }
        .ficha-number {
          font-family: var(--font-display);
          font-weight: 300;
          font-variation-settings: 'opsz' 144, 'SOFT' 60;
          font-size: clamp(3.5rem, 11vw, 5.5rem);
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: var(--color-ink);
          font-variant-numeric: lining-nums;
          white-space: nowrap;
        }
        .ficha-sup {
          font-size: 0.35em;
          vertical-align: top;
          position: relative;
          top: 0.5em;
          font-weight: 400;
          color: var(--color-brand-600);
        }
        @media (min-width: 768px) {
          .ficha-list {
            grid-template-columns: repeat(3, 1fr);
          }
          .ficha-item {
            grid-template-columns: 1fr;
            padding: 2rem 2rem 2rem 0;
            border-bottom: none;
            border-right: 0.5px dashed rgba(26,15,7,0.35);
          }
          .ficha-item:last-child { border-right: none; padding-right: 0; }
          .ficha-item:first-child { padding-left: 0; }
          .ficha-item:not(:first-child) { padding-left: 2rem; }
          .ficha-number { font-size: clamp(3.5rem, 7vw, 5.5rem); }
        }
      `}</style>

      <section ref={ref} className="ficha-section" aria-labelledby="ficha-title">
        <div className="ficha-head">
          <span className="ficha-section-label">Ficha Técnica</span>
          <h2 id="ficha-title" className="ficha-head-title">Documentado em números.</h2>
        </div>
        <div className="ficha-list">
          {items.map((item) => (
            <div key={item.index} className="ficha-item">
              <span className="ficha-index">{item.index}</span>
              <div className="ficha-body">
                <span className="ficha-label">{item.label}</span>
                <span className="ficha-desc">{item.desc}</span>
              </div>
              <FichaNumber item={item} started={started} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
