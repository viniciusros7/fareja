import Link from "next/link";

export default function FootEditorial() {
  return (
    <footer
      style={{
        borderTop: "0.5px solid rgba(26,15,7,0.15)",
        padding: "2.5rem clamp(1.25rem,4vw,2.5rem) calc(2.5rem + env(safe-area-inset-bottom))",
        maxWidth: "1240px",
        margin: "0 auto",
        fontFamily: "var(--font-sans)",
        fontSize: "12px",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "var(--color-ink-muted)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        flexWrap: "wrap" as const,
        gap: "1rem",
      }}
    >
      <span>© 2026 Fareja · Ed.&nbsp;Nº&nbsp;01</span>
      <span>
        <Link
          href="/termos"
          style={{ color: "var(--color-ink-soft)", textDecoration: "none", borderBottom: "0.5px dotted currentColor" }}
        >
          Termos
        </Link>
        {" · "}
        <Link
          href="/privacidade"
          style={{ color: "var(--color-ink-soft)", textDecoration: "none", borderBottom: "0.5px dotted currentColor" }}
        >
          Privacidade
        </Link>
        {" · "}
        <Link
          href="/privacidade"
          style={{ color: "var(--color-ink-soft)", textDecoration: "none", borderBottom: "0.5px dotted currentColor" }}
        >
          LGPD
        </Link>
      </span>
    </footer>
  );
}
