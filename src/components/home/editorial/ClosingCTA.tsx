import Image from "next/image";
import Link from "next/link";

export default function ClosingCTA() {
  return (
    <>
      <style>{`
        .closing-section {
          position: relative;
          padding: 0 0 6rem;
          max-width: 1240px;
          margin: 0 auto;
        }
        .closing-photo-wrap {
          position: relative;
          margin: 0 0 2.5rem;
        }
        .closing-photo-img {
          width: 100%;
          aspect-ratio: 5/4;
          object-fit: cover;
          display: block;
          filter: saturate(1.05);
        }
        .closing-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(26,15,7,0.55) 0%, transparent 40%);
          pointer-events: none;
        }
        .closing-title {
          position: absolute;
          bottom: 1.5rem;
          left: clamp(1.25rem, 4vw, 2.5rem);
          right: clamp(1.25rem, 4vw, 2.5rem);
          font-family: var(--font-display);
          font-weight: 380;
          font-variation-settings: 'opsz' 144, 'SOFT' 40;
          font-size: clamp(1.75rem, 6vw, 2.75rem);
          line-height: 1.02;
          letter-spacing: -0.025em;
          color: var(--color-cream-light);
          text-wrap: balance;
          max-width: 18ch;
          z-index: 2;
        }
        .closing-title em {
          font-style: italic;
          color: var(--color-cream-bg);
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
        .closing-ctas {
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .closing-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 1.1rem 1.5rem;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .closing-btn:active { transform: scale(0.98); }
        .closing-btn-primary {
          background: var(--color-ink);
          color: var(--color-cream-light);
        }
        .closing-btn-primary:hover { background: var(--color-terracotta-deep); }
        .closing-btn-ghost {
          background: transparent;
          color: var(--color-ink);
          border: 1px solid var(--color-ink);
        }
        .closing-btn-ghost:hover {
          background: var(--color-ink);
          color: var(--color-cream-light);
        }
        @media (min-width: 768px) {
          .closing-photo-img { aspect-ratio: 21/9; }
          .closing-title {
            max-width: 24ch;
            font-size: clamp(2.5rem, 5vw, 4rem);
          }
          .closing-ctas { flex-direction: row; }
          .closing-btn { flex: 1; }
        }
      `}</style>

      <section className="closing-section" aria-labelledby="closing-title">
        <figure className="closing-photo-wrap">
          <div className="relative w-full" style={{ aspectRatio: "5/4" }}>
            <Image
              src="/canil-good-leisure/good-leisure-03-running.jpeg"
              alt="Golden Retriever correndo em direção à câmera no gramado do canil"
              fill
              quality={85}
              sizes="100vw"
              className="object-cover"
              style={{ filter: "saturate(1.05)" }}
            />
          </div>
          <div className="closing-overlay" aria-hidden="true" />
          <h2 id="closing-title" className="closing-title">
            Pronto pra conhecer um canil <em>de verdade</em>?
          </h2>
        </figure>

        <div className="closing-ctas">
          <Link href="/buscar" className="closing-btn closing-btn-primary">
            <span>Buscar canis verificados</span>
            <span
              style={{ fontFamily: "var(--font-display)", fontSize: "1.3em", lineHeight: 0.8 }}
              aria-hidden="true"
            >
              →
            </span>
          </Link>
          <Link href="/para-criadores" className="closing-btn closing-btn-ghost">
            <span>Sou criador, quero me candidatar</span>
            <span
              style={{ fontFamily: "var(--font-display)", fontSize: "1.3em", lineHeight: 0.8 }}
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
