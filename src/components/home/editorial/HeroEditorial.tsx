"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroEditorial() {
  return (
    <section
      className="relative max-w-[1240px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] pt-10 pb-0 md:pt-16"
      aria-labelledby="hero-title"
    >
      {/* Edition tag */}
      <div className="text-center md:text-left mb-8 reveal-step-1">
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color: "var(--color-ink-muted)",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <span className="block w-5 h-px bg-current opacity-60" aria-hidden="true" />
          Canis verificados · Brasil
          <span className="block w-5 h-px bg-current opacity-60" aria-hidden="true" />
        </span>
      </div>

      {/* Headline */}
      <h1
        id="hero-title"
        className="reveal-step-2"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 380,
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
          fontSize: "clamp(3rem, 13.5vw, 7rem)",
          lineHeight: 0.92,
          letterSpacing: "-0.035em",
          color: "var(--color-ink)",
          marginBottom: "1.5rem",
          textWrap: "balance" as never,
        }}
      >
        Seu filhote merece{" "}
        <span
          style={{
            fontStyle: "italic",
            color: "var(--color-terracotta-deep)",
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
            position: "relative",
            whiteSpace: "nowrap",
          }}
        >
          procedência
          {/* Animated underline SVG */}
          <svg
            viewBox="0 0 400 16"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="underline-draw"
            style={{
              position: "absolute",
              left: "-1%",
              bottom: "-0.12em",
              width: "102%",
              height: "0.28em",
              pointerEvents: "none",
              strokeDasharray: 600,
              strokeDashoffset: 600,
              animation: "draw 1.6s 0.9s cubic-bezier(0.4, 0, 0.3, 1) forwards",
              stroke: "currentColor",
            }}
          >
            <path
              d="M4,11 Q60,4 130,8 T260,7 T396,10"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        .
      </h1>

      {/* Kicker */}
      <p
        className="reveal-step-3"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(1.125rem, 3.2vw, 1.5rem)",
          color: "var(--color-terracotta-deep)",
          fontWeight: 400,
          marginBottom: "2rem",
          maxWidth: "36rem",
        }}
      >
        Chega de surpresas ao escolher o seu filhote.
      </p>

      {/* Hero photo — full bleed on mobile */}
      <figure
        className="reveal-step-4"
        style={{
          position: "relative",
          margin: "2rem calc(clamp(1.25rem,4vw,2.5rem) * -1) 1.75rem",
        }}
      >
        <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
          <Image
            src="/canil-good-leisure/good-leisure-01-puppy-close.jpeg"
            alt="Filhote de Golden Retriever olhando diretamente para a câmera, Canil Good Leisure, São Lourenço da Serra"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 30%", filter: "saturate(1.05) contrast(1.02)" }}
          />
        </div>
        <figcaption
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingTop: "0.75rem",
            paddingLeft: "clamp(1.25rem,4vw,2.5rem)",
            paddingRight: "clamp(1.25rem,4vw,2.5rem)",
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
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
              textTransform: "none" as const,
              color: "var(--color-ink-soft)",
            }}
          >
            Canil Good Leisure, SLS
          </span>
        </figcaption>
      </figure>

      {/* Lede */}
      <p
        className="reveal-step-5"
        style={{
          fontSize: "1.05rem",
          lineHeight: 1.65,
          color: "var(--color-ink-soft)",
          maxWidth: "34rem",
          marginBottom: "2rem",
          fontWeight: 400,
        }}
      >
        Encontre canis verificados com{" "}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "var(--color-terracotta-deep)",
            fontWeight: 500,
          }}
        >
          registro oficial
        </span>
        , testes de saúde e instalações aprovadas. Documentado. Aferido. Rastreável.
      </p>

      {/* CTAs */}
      <div
        className="reveal-step-6 flex flex-col sm:flex-row gap-3 mb-12"
      >
        <Link
          href="/buscar"
          className="flex items-center justify-between gap-3 px-6 py-4 text-[0.95rem] font-medium no-underline transition-transform active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-sans)",
            background: "var(--color-ink)",
            color: "var(--color-cream-light)",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-terracotta-deep)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-ink)")}
        >
          <span>Buscar canis verificados</span>
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
        <Link
          href="/encontrar-raca"
          className="flex items-center justify-between gap-3 px-6 py-4 text-[0.95rem] font-medium no-underline transition-all active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-sans)",
            background: "transparent",
            color: "var(--color-ink)",
            border: "1px solid var(--color-ink)",
            letterSpacing: "0.01em",
          }}
        >
          <span>Qual raça é para mim?</span>
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
  );
}
