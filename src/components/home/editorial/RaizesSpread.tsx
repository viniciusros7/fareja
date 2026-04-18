import Image from "next/image";
import Link from "next/link";

export default function RaizesSpread() {
  return (
    <>
      <style>{`
        .raizes-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 5rem clamp(1.25rem, 4vw, 2.5rem) 4rem;
        }
        .raizes-section-label {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--color-terracotta-deep);
          font-weight: 600;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid currentColor;
          display: inline-block;
          margin-bottom: 1.25rem;
        }
        .raizes-title {
          font-family: var(--font-display);
          font-weight: 350;
          font-variation-settings: 'opsz' 144, 'SOFT' 40;
          font-size: clamp(2rem, 6.5vw, 3.5rem);
          line-height: 1.02;
          letter-spacing: -0.025em;
          color: var(--color-ink);
          text-wrap: balance;
          max-width: 20ch;
          margin-bottom: 2.5rem;
        }
        .raizes-title em {
          font-style: italic;
          color: var(--color-terracotta-deep);
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
        .spread {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .spread-caption {
          margin-top: 0.6rem;
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-muted);
          display: flex;
          justify-content: space-between;
        }
        .spread-side {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .pull-quote {
          padding: 2.5rem 0 2rem;
          border-top: 0.5px solid rgba(26,15,7,0.15);
          border-bottom: 0.5px solid rgba(26,15,7,0.15);
          margin: 2.5rem 0 2rem;
          position: relative;
        }
        .pull-quote::before {
          content: '\\201C';
          position: absolute;
          top: -0.1em;
          left: -0.05em;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 6rem;
          line-height: 1;
          color: var(--color-brand-600);
          opacity: 0.3;
          font-weight: 300;
          pointer-events: none;
        }
        .pull-quote blockquote {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 350;
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
          font-size: clamp(1.35rem, 4.2vw, 2rem);
          line-height: 1.25;
          color: var(--color-ink);
          letter-spacing: -0.015em;
          text-wrap: balance;
          max-width: 28ch;
          position: relative;
          z-index: 1;
          padding-left: 0.5rem;
        }
        .pull-quote cite {
          display: block;
          margin-top: 1.25rem;
          font-style: normal;
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-terracotta-deep);
          font-weight: 600;
          padding-left: 0.5rem;
        }
        .pull-quote cite span {
          color: var(--color-ink-muted);
          font-weight: 400;
          margin-left: 0.75rem;
          letter-spacing: 0.14em;
        }
        .raizes-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.15rem;
          color: var(--color-terracotta-deep);
          text-decoration: none;
          border-bottom: 1px solid currentColor;
          padding-bottom: 0.2rem;
          transition: gap 0.25s, color 0.25s;
        }
        .raizes-link:hover { gap: 1.25rem; color: var(--color-ink); }
        @media (min-width: 768px) {
          .spread {
            grid-template-columns: 1.3fr 1fr;
            gap: 2rem;
          }
          .spread-side {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      <section className="raizes-section" aria-labelledby="raizes-title">
        <div>
          <span className="raizes-section-label">Raízes</span>
          <h2 id="raizes-title" className="raizes-title">
            37 anos criando Goldens em{" "}
            <em>São Lourenço da Serra</em>.
          </h2>
        </div>

        <div className="spread">
          {/* Main photo */}
          <figure>
            <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
              <Image
                src="/canil-good-leisure/good-leisure-02-two-adults.jpeg"
                alt="Dois Golden Retrievers adultos no Canil Good Leisure"
                fill
                quality={85}
                sizes="(min-width: 768px) 56vw, 100vw"
                className="object-cover"
                style={{ filter: "saturate(1.05)" }}
              />
            </div>
            <figcaption className="spread-caption">
              <span>Matriz e Padreador</span>
              <span>Plantel 2025</span>
            </figcaption>
          </figure>

          {/* Side photos */}
          <div className="spread-side">
            <figure>
              <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                <Image
                  src="/canil-good-leisure/good-leisure-03-running.jpeg"
                  alt="Golden Retriever correndo no gramado"
                  fill
                  quality={85}
                  sizes="(min-width: 768px) 22vw, 48vw"
                  className="object-cover"
                  style={{ filter: "saturate(1.05)" }}
                />
              </div>
              <figcaption className="spread-caption">
                <span>Área de recreação</span>
                <span>1.200m²</span>
              </figcaption>
            </figure>
            <figure>
              <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                <Image
                  src="/canil-good-leisure/good-leisure-04-ball.jpeg"
                  alt="Golden Retriever brincando com bola"
                  fill
                  quality={85}
                  sizes="(min-width: 768px) 22vw, 48vw"
                  className="object-cover"
                  style={{ filter: "saturate(1.05)" }}
                />
              </div>
              <figcaption className="spread-caption">
                <span>Socialização</span>
                <span>Diária</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="pull-quote">
          <blockquote>
            Na criação de procedência, cada filhote carrega a responsabilidade de trinta e sete anos.
          </blockquote>
          <cite>
            Fábio &amp; Marli Rosa{" "}
            <span>— Canil Good Leisure</span>
          </cite>
        </div>

        <Link href="/canis" className="raizes-link">
          Conhecer o canil fundador{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
