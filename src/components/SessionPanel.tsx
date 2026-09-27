"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { since, stateLabel, useSession } from "./SessionProvider";
import { StatusDot } from "./StatusDot";
import s from "./SessionPanel.module.css";

const blurb = {
  offline: "Startups are announced in the Discord. Turn on notifications for the sessions channel so you don't miss the next one.",
  vote: "Staff are gauging interest. Vote in the Discord and the server opens once enough people are in.",
  active: "The private server is open. Grab the code below, load into ER:LC and pick your department in the team menu.",
  full: "Every slot is taken right now. Keep an eye on the Discord, spaces open up as people leave.",
} as const;

export function SessionPanel() {
  const { session, now } = useSession();
  const [copied, setCopied] = useState(false);
  const live = session.state === "active" || session.state === "full";
  const pct = session.players !== null ? Math.min(100, (session.players / session.maxPlayers) * 100) : 0;
  const joinCode = session.joinCode ?? site.serverCode;

  async function copy() {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the code is still visible to copy by hand.
    }
  }

  return (
    <section id="status" className={s.panel} data-state={session.state} aria-live="polite" aria-label="Server status">
      <div className={s.top}>
        <span className={s.label}>Server status</span>
        <span className={s.updated}>
          {session.updatedAt && now ? `Updated ${since(session.updatedAt, now)}` : " "}
        </span>
      </div>

      <div className={s.state}>
        <StatusDot state={session.state} size={10} />
        <h2>{stateLabel[session.state]}</h2>
      </div>

      <p className={s.blurb}>{blurb[session.state]}</p>

      {live && (
        <div className={s.capacity}>
          <div className={s.count}>
            <span className={s.num}>{session.players ?? "—"}</span>
            <span className={s.of}>/ {session.maxPlayers} players</span>
          </div>
          <div className={s.bar} role="presentation">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <dl className={s.meta}>
        {live && session.host && (
          <div>
            <dt>Host</dt>
            <dd>{session.host}</dd>
          </div>
        )}
        {live && session.startedAt && (
          <div>
            <dt>Started</dt>
            <dd>{since(session.startedAt, now) ?? "—"}</dd>
          </div>
        )}
        <div>
          <dt>Server code</dt>
          <dd>
            <button type="button" className={s.code} onClick={copy}>
              {joinCode}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </dd>
        </div>
      </dl>

      <div className={s.footer}>
        {live ? (
          <a href={site.gameUrl} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">
            Open ER:LC <span className="arrow">→</span>
          </a>
        ) : (
          <a href={site.discordInvite} className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">
            Session announcements <span className="arrow">→</span>
          </a>
        )}
      </div>
    </section>
  );
}
