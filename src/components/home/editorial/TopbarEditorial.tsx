export default function TopbarEditorial() {
  return (
    <div className="flex items-center justify-center gap-3 py-3 border-b border-[rgba(26,15,7,0.12)]">
      <span
        className="block w-5 h-px opacity-60"
        style={{ background: "var(--color-ink-muted)" }}
        aria-hidden="true"
      />
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
          fontWeight: 500,
        }}
      >
        Ed. Nº&nbsp;01 · Outono 2026 · São Paulo
      </span>
      <span
        className="block w-5 h-px opacity-60"
        style={{ background: "var(--color-ink-muted)" }}
        aria-hidden="true"
      />
    </div>
  );
}
