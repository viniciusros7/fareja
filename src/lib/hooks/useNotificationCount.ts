"use client";

import { useEffect, useState } from "react";
import { useUser } from "./useUser";

// Module-level shared state — one fetch serves all consumers
let _count = 0;
let _initialized = false;
const _subscribers = new Set<(c: number) => void>();

function broadcast(c: number) {
  _count = c;
  _subscribers.forEach((fn) => fn(c));
}

async function initCount() {
  if (_initialized) return;
  _initialized = true;
  try {
    const r = await fetch("/api/notifications");
    if (!r.ok) return;
    const { data } = await r.json();
    broadcast((data ?? []).filter((n: { read: boolean }) => !n.read).length);
  } catch {
    _initialized = false;
  }
}

export function decrementNotificationCount() {
  broadcast(Math.max(0, _count - 1));
}

export function clearNotificationCount() {
  broadcast(0);
  _initialized = false;
}

export function useNotificationCount(): number {
  const { user, loading } = useUser();
  const [count, setCount] = useState(_count);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      _count = 0;
      _initialized = false;
      setCount(0);
      return;
    }

    const fn = (c: number) => setCount(c);
    _subscribers.add(fn);
    setCount(_count);
    initCount();

    return () => { _subscribers.delete(fn); };
  }, [user?.id, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return count;
}
