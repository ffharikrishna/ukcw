"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@/lib/session";

const POLL_MS = 30_000;

type Ctx = { session: Session; now: number | null };
const SessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ initial, children }: { initial: Session; children: React.ReactNode }) {
  const [session, setSession] = useState(initial);
  // Null until mounted so relative times don't cause a hydration mismatch.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        if (res.ok && !cancelled) setSession(await res.json());
      } catch {
        // Keep showing the last known state.
      }
      if (!cancelled) setNow(Date.now());
    }

    setNow(Date.now());
    const poll = setInterval(refresh, POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 15_000);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return <SessionContext.Provider value={{ session, now }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

export const stateLabel: Record<Session["state"], string> = {
  offline: "No session running",
  vote: "Startup vote open",
  active: "In session",
  full: "Session full",
};

export function since(iso: string | null, now: number | null) {
  if (!iso || now === null) return null;
  const mins = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return m ? `${h}h ${m}m ago` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
