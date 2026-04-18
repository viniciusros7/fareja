export default function Manifesto() {
  return (
    <>
      <style>{`
        .manifesto-section {
          background: var(--color-cream-dark);
          padding: 5rem clamp(1.25rem, 4vw, 2.5rem);
          border-top: 0.5px solid rgba(26,15,7,0.15);
        }
        .manifesto-inner {
          max-width: 1240px;
          margin: 0 auto;
        }
        .manifesto-section-label {
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
        .manifesto-title {
          font-family: var(--font-display);
          font-weight: 350;
          font-variation-settings: 'opsz' 144, 'SOFT' 50;
          font-size: clamp(2rem, 7vw, 3.75rem);
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--color-ink);
          max-width: 18ch;
          margin: 1.25rem 0 3rem;
          text-wrap: balance;
        }
        .manifesto-title em {
          font-style: italic;
          color: var(--color-terracotta-deep);
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
        .manifesto-points {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          counter-reset: point;
        }
        .manifesto-point {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1.25rem;
          padding: 1.25rem 0;
          border-top: 0.5px solid rgba(26,15,7,0.15);
          counter-increment: point;
        }
        .manifesto-point::before {
          content: '0' counter(point);
          font-family: var(--font-display);
          font-weight: 350;
          font-variation-settings: 'opsz' 60;
          font-size: 2rem;
          line-height: 1;
          color: var(--color-brand-600);
          font-variant-numeric: lining-nums;
        }
        .manifesto-point p {
          font-size: 1.05rem;
          line-height: 1.55;
          color: var(--color-ink-soft);
          padding-top: 0.2rem;
        }
        .manifesto-point p strong {
          color: var(--color-ink);
          font-weight: 500;
        }
        @media (min-width: 768px) {
          .manifesto-points {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .manifesto-point {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .manifesto-point::before { font-size: 2.25rem; }
        }
      `}</style>

      <section className="manifesto-section" aria-labelledby="manifesto-title">
        <div className="manifesto-inner">
          <span className="manifesto-section-label">Manifesto</span>
          <h2 id="manifesto-title" className="manifesto-title">
            A procedência é <em>invisível</em>{" "}
            — mas faz toda a diferença.
          </h2>
          <div className="manifesto-points">
            <div className="manifesto-point">
              <p>
                <strong>Quem cria com responsabilidade</strong> tem registros, exames de saúde,
                pedigree aferido e histórico dos pais.
              </p>
            </div>
            <div className="manifesto-point">
              <p>
                <strong>Quem compra sem saber disso</strong> paga depois — na saúde do filhote,
                no comportamento, na conta do veterinário.
              </p>
            </div>
            <div className="manifesto-point">
              <p>
                <strong>O Fareja torna isso visível.</strong> Canis são auditados antes de entrar
                no catálogo. Simples assim.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
