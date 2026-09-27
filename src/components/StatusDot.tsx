import type { SessionState } from "@/lib/session";
import s from "./StatusDot.module.css";

export function StatusDot({ state, size = 8 }: { state: SessionState; size?: number }) {
  return <span className={s.dot} data-state={state} style={{ width: size, height: size }} aria-hidden />;
}
