export default function VerificationSeal() {
  return (
    <>
      <style>{`
        .seal-section {
          padding: 4rem clamp(1.25rem, 4vw, 2.5rem);
          max-width: 1240px;
          margin: 0 auto;
          text-align: center;
        }
        .seal-ring {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 1.5px solid var(--color-terracotta-deep);
          color: var(--color-terracotta-deep);
          margin-bottom: 1.25rem;
          animation: sealRotate 22s linear infinite;
        }
        .seal-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.05rem;
          color: var(--color-ink-soft);
          max-width: 28rem;
          margin: 0 auto;
          line-height: 1.5;
        }
        .seal-text strong {
          color: var(--color-ink);
          font-weight: 400;
          font-style: normal;
          font-family: var(--font-display);
          font-variation-settings: 'opsz' 40;
        }
      `}</style>

      <section className="seal-section" aria-label="Selo de verificação">
        <div className="seal-ring" aria-hidden="true">
          <svg
            viewBox="0 0 32 32"
            width="30"
            height="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 3L20 7H26V13L30 17L26 21V27H20L16 31L12 27H6V21L2 17L6 13V7H12L16 3Z" />
            <path d="M11 17L15 21L22 13" />
          </svg>
        </div>
        <p className="seal-text">
          Canis verificados com registro oficial da{" "}
          <strong>Confederação Brasileira de Cinofilia</strong>.
        </p>
      </section>
    </>
  );
}
