import { site } from "./site";

export type SessionState = "offline" | "vote" | "active" | "full";

export type Session = {
  state: SessionState;
  players: number | null;
  maxPlayers: number;
  host: string | null;
  joinCode: string | null;
  startedAt: string | null;
  updatedAt: string | null;
  source: "bot" | "erlc" | "none";
};

type StoredSession = Pick<Session, "state" | "players" | "host" | "joinCode" | "startedAt" | "updatedAt">;

const KEY = "ukcw:session";
const STALE_HOURS = Number(process.env.SESSION_STALE_HOURS ?? 6);
const ERLC_ACTIVE_THRESHOLD = Number(process.env.ERLC_ACTIVE_THRESHOLD ?? 5);

/* ------------------------------------------------------------------ */
/* Storage: Upstash / Vercel KV over REST when configured, memory otherwise. */
/* ------------------------------------------------------------------ */

const kvUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const memory = globalThis as unknown as { __ukcwSession?: StoredSession };

async function readStored(): Promise<StoredSession | null> {
  if (!kvUrl || !kvToken) return memory.__ukcwSession ?? null;
  const res = await fetch(`${kvUrl}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${kvToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const { result } = (await res.json()) as { result: string | null };
  return result ? (JSON.parse(result) as StoredSession) : null;
}

async function writeStored(value: StoredSession): Promise<void> {
  if (!kvUrl || !kvToken) {
    memory.__ukcwSession = value;
    return;
  }
  const res = await fetch(kvUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(["SET", KEY, JSON.stringify(value)]),
  });
  if (!res.ok) throw new Error(`KV write failed: ${res.status}`);
}

/* ------------------------------------------------------------------ */
/* ER:LC private server API (optional, gives real player counts).      */
/* ------------------------------------------------------------------ */

type ErlcServer = { CurrentPlayers: number; MaxPlayers: number; JoinKey: string };

async function readErlc(): Promise<ErlcServer | null> {
  const key = process.env.ERLC_SERVER_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.erlc.gg/v2/server", {
      headers: { "server-key": key },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ErlcServer;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */

function isStale(s: StoredSession) {
  if (s.state === "offline" || !s.updatedAt) return false;
  return Date.now() - Date.parse(s.updatedAt) > STALE_HOURS * 3_600_000;
}

export async function getSession(): Promise<Session> {
  const [stored, erlc] = await Promise.all([readStored().catch(() => null), readErlc()]);
  const maxPlayers = erlc?.MaxPlayers ?? site.maxPlayers;

  if (stored && !isStale(stored)) {
    const players = erlc?.CurrentPlayers ?? stored.players;
    let state = stored.state;
    // The bot may say "startup" while the server has since filled up.
    if (state === "active" && players !== null && players >= maxPlayers) state = "full";
    return {
      ...stored,
      state,
      players,
      maxPlayers,
      joinCode: erlc?.JoinKey ?? stored.joinCode ?? site.serverCode,
      source: "bot",
    };
  }

  // No announcement from Discord: fall back to what the game server reports.
  if (erlc && erlc.CurrentPlayers >= ERLC_ACTIVE_THRESHOLD) {
    return {
      state: erlc.CurrentPlayers >= maxPlayers ? "full" : "active",
      players: erlc.CurrentPlayers,
      maxPlayers,
      host: null,
      joinCode: erlc.JoinKey || site.serverCode,
      startedAt: null,
      updatedAt: new Date().toISOString(),
      source: "erlc",
    };
  }

  return {
    state: "offline",
    players: erlc?.CurrentPlayers ?? null,
    maxPlayers,
    host: null,
    joinCode: site.serverCode,
    startedAt: null,
    updatedAt: stored?.updatedAt ?? null,
    source: erlc ? "erlc" : "none",
  };
}

/* ------------------------------------------------------------------ */
/* Incoming updates                                                    */
/* ------------------------------------------------------------------ */

export type SessionUpdate = {
  state: SessionState;
  players?: number | null;
  host?: string | null;
  joinCode?: string | null;
};

const STATES: SessionState[] = ["offline", "vote", "active", "full"];

// Matches the wording ER:LC communities use in announcement embeds.
// Order matters: "Session Shutdown" must win over "Session".
const PATTERNS: [RegExp, SessionState][] = [
  [/\b(shut\s?down|ssd|session (has )?(ended|concluded)|server closed)\b/i, "offline"],
  [/\bsession full\b|\bserver (is )?full\b/i, "full"],
  [/\b(vote|ssu vote|poll)\b/i, "vote"],
  [/\b(start\s?up|ssu|boost|session (is )?(live|active|open))\b/i, "active"],
];

type DiscordPayload = {
  content?: string;
  embeds?: { title?: string; description?: string; fields?: { name?: string; value?: string }[] }[];
};

/**
 * Accepts either our own JSON shape ({ state, players, host, joinCode })
 * or a Discord webhook-style message ({ content, embeds }) so an existing
 * announcement bot can be pointed at this endpoint unchanged.
 */
export function parseUpdate(body: unknown): SessionUpdate | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  if (typeof b.state === "string") {
    const state = b.state.toLowerCase() as SessionState;
    if (!STATES.includes(state)) return null;
    return {
      state,
      players: typeof b.players === "number" ? b.players : undefined,
      host: typeof b.host === "string" ? b.host.slice(0, 64) : undefined,
      joinCode: typeof b.joinCode === "string" ? b.joinCode.slice(0, 16) : undefined,
    };
  }

  const msg = b as DiscordPayload;
  const text = [
    msg.content,
    ...(msg.embeds ?? []).flatMap((e) => [
      e.title,
      e.description,
      ...(e.fields ?? []).flatMap((f) => [f.name, f.value]),
    ]),
  ]
    .filter(Boolean)
    .join("\n");
  if (!text) return null;

  const match = PATTERNS.find(([re]) => re.test(text));
  if (!match) return null;

  const count = text.match(/\b(\d{1,2})\s*\/\s*(\d{2})\b/);
  const code = text.match(/\b(?:code|join ?key)\W+([A-Za-z0-9]{3,12})\b/i);
  const host = text.match(/\bhost(?:ed by)?\W+@?([^\n,]{2,32})/i);

  return {
    state: match[1],
    players: count ? Number(count[1]) : undefined,
    joinCode: code?.[1],
    host: host?.[1].trim(),
  };
}

export async function applyUpdate(update: SessionUpdate): Promise<StoredSession> {
  const prev = await readStored().catch(() => null);
  const now = new Date().toISOString();
  const wasLive = prev && !isStale(prev) && (prev.state === "active" || prev.state === "full");
  const isLive = update.state === "active" || update.state === "full";
  // Only carry details over when moving between live states (startup -> full, etc).
  const carry = wasLive && isLive ? prev : null;

  const next: StoredSession =
    update.state === "offline"
      ? { state: "offline", players: null, host: null, joinCode: null, startedAt: null, updatedAt: now }
      : {
          state: update.state,
          players: update.players ?? carry?.players ?? null,
          host: update.host ?? carry?.host ?? null,
          joinCode: update.joinCode ?? carry?.joinCode ?? null,
          startedAt: isLive ? (carry?.startedAt ?? now) : null,
          updatedAt: now,
        };

  await writeStored(next);
  return next;
}
