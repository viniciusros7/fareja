"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface GrowthStats {
  members: number;
  founders: number;
}

export default function PioneerBanner() {
  const [stats, setStats] = useState<GrowthStats | null>(null);

  useEffect(() => {
    fetch("/api/stats/growth")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setStats(d); });
  }, []);

  const count = stats?.members ?? null;
  const remaining = count !== null ? Math.max(0, 100 - count) : null;

  return (
    <div className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-2xl overflow-hidden">
      <div className="px-6 py-5">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[11px] font-semibold mb-3 tracking-wide uppercase">
          🐾 Fundadores
        </div>

        <h2 className="font-display text-lg sm:text-xl font-semibold leading-snug mb-2">
          Estamos buscando nossos 100 primeiros membros
        </h2>
        <p className="text-sm text-white/85 leading-relaxed mb-4 max-w-md">
          Você terá papel fundamental na construção dessa comunidade. Sua opinião,
          suas sugestões e sua participação vão moldar o futuro do Fareja. Seja um dos pioneiros.
        </p>

        {/* Counter */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
              <span className="text-white/80">Vagas preenchidas</span>
              {count !== null && (
                <span className="text-white font-semibold">
                  {count} / 100
                </span>
              )}
            </div>
            <div className="h-1.5 bg-white/25 rounded-full overflow-hidden">
              {count !== null && (
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, count)}%` }}
                />
              )}
            </div>
          </div>
          {remaining !== null && remaining > 0 && (
            <span className="text-xs text-white/75 shrink-0">
              {remaining} {remaining === 1 ? "vaga restante" : "vagas restantes"}
            </span>
          )}
          {remaining === 0 && (
            <span className="text-xs font-semibold text-amber-200 shrink-0">
              Esgotado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
