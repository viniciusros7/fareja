import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import TopbarEditorial from "@/components/home/editorial/TopbarEditorial";
import FootEditorial from "@/components/home/editorial/FootEditorial";

export const metadata: Metadata = {
  title: "Canil Good Leisure — Canil Fundador | Fareja",
  description:
    "37 anos criando Golden Retrievers em São Lourenço da Serra. A história do canil que deu origem ao Fareja.",
};

const timeline = [
  {
    year: "1988",
    title: "Primeiro plantel",
    desc: "Fundação do canil com os primeiros Beagles. [AJUSTE COM VINICIUS]",
  },
  {
    year: "1995",
    title: "Introdução dos Goldens",
    desc: "Chegada dos primeiros Golden Retrievers ao canil. [AJUSTE COM VINICIUS]",
  },
  {
    year: "2010",
    title: "Certificação CBKC",
    desc: "Obtenção da certificação pelo Kennel Club Brasileiro. [AJUSTE COM VINICIUS]",
  },
  {
    year: "2025",
    title: "Canil Fundador Fareja",
    desc: "Primeiro canil verificado a integrar a plataforma Fareja como parceiro fundador.",
  },
];

export default function CanilFundadorPage() {
  return (
    <div style={{ background: "var(--color-cream-bg)", overflow: "hidden" }}>
      <TopbarEditorial />

      <style>{`
        .cf-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
        }
        /* Hero */
        .cf-hero {
          padding: 4rem 0 3rem;
        }
        .cf-edition-tag {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-ink-muted);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }
        .cf-h1 {
          font-family: var(--font-display);
          font-weight: 350;
          font-variation-settings: 'opsz' 144, 'SOFT' 40;
          font-size: clamp(2.25rem, 7vw, 4rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
          color: var(--color-ink);
          text-wrap: balance;
          max-width: 22ch;
          margin-bottom: 1rem;
        }
        .cf-kicker {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          color: var(--color-terracotta-deep);
          font-weight: 400;
          margin-bottom: 0;
        }
        /* Spread grid */
        .cf-spread {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          padding: 3rem 0;
          border-top: 0.5px solid rgba(26,15,7,0.15);
        }
        .cf-spread-caption {
          margin-top: 0.5rem;
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-muted);
          display: flex;
          justify-content: space-between;
        }
        .cf-spread-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        /* Pull quote */
        .cf-pull-quote {
          padding: 2.5rem 0 2rem;
          border-top: 0.5px solid rgba(26,15,7,0.15);
          border-bottom: 0.5px solid rgba(26,15,7,0.15);
          margin: 0 0 3rem;
          position: relative;
        }
        .cf-pull-quote::before {
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
        .cf-pull-quote blockquote {
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
        .cf-pull-quote cite {
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
        .cf-pull-quote cite span {
          color: var(--color-ink-muted);
          font-weight: 400;
          margin-left: 0.75rem;
          letter-spacing: 0.14em;
        }
        /* Timeline */
        .cf-timeline {
          padding: 3rem 0 4rem;
          border-top: 0.5px solid rgba(26,15,7,0.15);
        }
        .cf-timeline-label {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--color-terracotta-deep);
          font-weight: 600;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid currentColor;
          display: inline-block;
          margin-bottom: 2rem;
        }
        .cf-timeline-items {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        .cf-timeline-item {
          display: grid;
          grid-template-columns: 72px 1fr;
          gap: 1.5rem;
          padding: 1.5rem 0;
          border-bottom: 0.5px dashed rgba(26,15,7,0.2);
        }
        .cf-timeline-item:last-child { border-bottom: none; }
        .cf-year {
          font-family: var(--font-display);
          font-weight: 300;
          font-variation-settings: 'opsz' 60;
          font-size: 1.5rem;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--color-ink-muted);
          padding-top: 0.1em;
        }
        .cf-event-title {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--color-ink);
          margin-bottom: 0.35rem;
        }
        .cf-event-desc {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.95rem;
          color: var(--color-ink-soft);
          line-height: 1.5;
        }
        /* CTA */
        .cf-cta {
          padding: 3rem 0 5rem;
        }
        .cf-back-link {
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
        .cf-back-link:hover { gap: 1.25rem; color: var(--color-ink); }
        @media (min-width: 768px) {
          .cf-spread {
            grid-template-columns: 1.4fr 1fr;
            gap: 2rem;
          }
          .cf-spread-row {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .cf-timeline-items {
            grid-template-columns: repeat(2, 1fr);
            gap: 0 3rem;
          }
          .cf-timeline-item {
            border-bottom: 0.5px dashed rgba(26,15,7,0.2);
          }
          .cf-timeline-items .cf-timeline-item:nth-child(n+3) {
            border-bottom: none;
          }
        }
      `}</style>

      {/* Hero */}
      <div className="cf-section">
        <div className="cf-hero">
          <span className="cf-edition-tag">
            <span className="block w-5 h-px bg-current opacity-60" aria-hidden="true" />
            Ed. Nº 01 · Canil Fundador
            <span className="block w-5 h-px bg-current opacity-60" aria-hidden="true" />
          </span>
          <h1 className="cf-h1">
            37 anos criando Goldens em São Lourenço da Serra
          </h1>
          <p className="cf-kicker">A história que deu origem ao Fareja.</p>
        </div>
      </div>

      {/* Hero photo — full bleed */}
      <div style={{ margin: "0 clamp(1.25rem,4vw,2.5rem)", maxWidth: "calc(1240px - clamp(2.5rem,8vw,5rem))", marginLeft: "auto", marginRight: "auto" }}>
        <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
          <Image
            src="/canil-good-leisure/good-leisure-01-puppy-close.webp"
            alt="Filhote de Golden Retriever olhando diretamente para a câmera, Canil Good Leisure"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 30%", filter: "saturate(1.05) contrast(1.02)" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "0.6rem",
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-ink-muted)",
          }}
        >
          <span>Campo 01 — Filhote, 4 meses</span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "13px",
              letterSpacing: 0,
              textTransform: "none",
              color: "var(--color-ink-soft)",
            }}
          >
            Canil Good Leisure, SLS
          </span>
        </div>
      </div>

      {/* Spread — 3 remaining photos */}
      <div className="cf-section">
        <div className="cf-spread">
          <figure>
            <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
              <Image
                src="/canil-good-leisure/good-leisure-02-two-adults.webp"
                alt="Dois Golden Retrievers adultos no Canil Good Leisure"
                fill
                quality={85}
                sizes="(min-width: 768px) 56vw, 100vw"
                className="object-cover"
                style={{ filter: "saturate(1.05)" }}
              />
            </div>
            <figcaption className="cf-spread-caption">
              <span>Matriz e Padreador</span>
              <span>Plantel 2025</span>
            </figcaption>
          </figure>

          <div className="cf-spread-row">
            <figure>
              <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                <Image
                  src="/canil-good-leisure/good-leisure-03-running.webp"
                  alt="Golden Retriever correndo no gramado"
                  fill
                  quality={85}
                  sizes="(min-width: 768px) 22vw, 48vw"
                  className="object-cover"
                  style={{ filter: "saturate(1.05)" }}
                />
              </div>
              <figcaption className="cf-spread-caption">
                <span>Área de recreação</span>
                <span>1.200m²</span>
              </figcaption>
            </figure>
            <figure>
              <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                <Image
                  src="/canil-good-leisure/good-leisure-04-ball.webp"
                  alt="Golden Retriever brincando com bola"
                  fill
                  quality={85}
                  sizes="(min-width: 768px) 22vw, 48vw"
                  className="object-cover"
                  style={{ filter: "saturate(1.05)" }}
                />
              </div>
              <figcaption className="cf-spread-caption">
                <span>Socialização</span>
                <span>Diária</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Pull quote */}
        <div className="cf-pull-quote">
          <blockquote>
            Na criação de procedência, cada filhote carrega a responsabilidade de trinta e sete anos.
          </blockquote>
          <cite>
            Fábio &amp; Marli Rosa{" "}
            <span>— Canil Good Leisure</span>
          </cite>
        </div>

        {/* Timeline */}
        <section className="cf-timeline" aria-labelledby="cf-timeline-title">
          <span id="cf-timeline-title" className="cf-timeline-label">Linha do tempo</span>
          <div className="cf-timeline-items">
            {timeline.map((item) => (
              <div key={item.year} className="cf-timeline-item">
                <span className="cf-year">{item.year}</span>
                <div>
                  <p className="cf-event-title">{item.title}</p>
                  <p className="cf-event-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back CTA */}
        <div className="cf-cta">
          <Link href="/" className="cf-back-link">
            Voltar para o Fareja{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <FootEditorial />
    </div>
  );
}
