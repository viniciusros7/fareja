"use client";

import { useEffect, useState } from "react";

export function useCountUp(end: number, duration: number, started: boolean): number {
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
