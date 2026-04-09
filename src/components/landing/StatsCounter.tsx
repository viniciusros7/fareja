"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  end: number;
  prefix?: string;
  suffix: string;
  label: string;
  formatThousands?: boolean;
}

const stats: StatItem[] = [
  { end: 6032, suffix: "+", label: "entusiastas de pet na comunidade", formatThousands: true },
  { end: 4, suffix: "", label: "canis verificados" },
  { end: 35, suffix: "+", label: "anos de experiência no ramo" },
];

function useCountUp(end: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, started]);

  return count;
}

function StatBlock({ stat, started }: { stat: StatItem; started: boolean }) {
  const count = useCountUp(stat.end, 1400, started);
  const formatted = stat.formatThousands
    ? count.toLocaleString("pt-BR")
    : String(count);

  return (
    <div className="text-center">
      <div className="font-display text-2xl font-semibold text-brand-600">
        {formatted}{stat.suffix}
      </div>
      <div className="text-xs text-earth-400 mt-1 leading-snug">{stat.label}</div>
    </div>
  );
}

export default function StatsCounter() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-14 animate-fade-in-up animate-delay-4">
      {stats.map((s) => (
        <StatBlock key={s.label} stat={s} started={started} />
      ))}
    </div>
  );
}
