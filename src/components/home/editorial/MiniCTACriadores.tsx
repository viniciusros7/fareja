import Link from "next/link";

export default function MiniCTACriadores() {
  return (
    <>
      <style>{`
        .mini-cta {
          max-width: 1240px;
          margin: 0 auto;
          padding: 2rem clamp(1.25rem, 4vw, 2.5rem);
          border-top: 0.5px solid rgba(26,15,7,0.15);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .mini-cta-eyebrow {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--color-terracotta-deep);
          font-weight: 600;
        }
        .mini-cta-heading {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 350;
          font-variation-settings: 'opsz' 60, 'SOFT' 60;
          font-size: clamp(1.125rem, 3.5vw, 1.75rem);
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: var(--color-ink);
          text-wrap: balance;
          margin-top: 0.35rem;
        }
        .mini-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.05rem;
          color: var(--color-terracotta-deep);
          text-decoration: none;
          border-bottom: 1px solid currentColor;
          padding-bottom: 0.2rem;
          transition: gap 0.25s, color 0.25s;
          align-self: flex-start;
        }
        .mini-cta-link:hover { gap: 1.25rem; color: var(--color-ink); }
        @media (min-width: 768px) {
          .mini-cta {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          .mini-cta-text { max-width: 34ch; }
          .mini-cta-link { align-self: center; white-space: nowrap; }
        }
      `}</style>

      <section className="mini-cta">
        <div className="mini-cta-text">
          <span className="mini-cta-eyebrow">Canis Fundadores</span>
          <h3 className="mini-cta-heading">
            Você cria cães? Programa com isenção até 2026.
          </h3>
        </div>
        <Link href="/para-criadores" className="mini-cta-link">
          Conhecer programa{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
