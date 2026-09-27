import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { applyUpdate, getSession, parseUpdate } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  return NextResponse.json(session, {
    headers: { "Cache-Control": "no-store" },
  });
}

function authorised(req: NextRequest) {
  const secret = process.env.SESSION_WEBHOOK_SECRET;
  if (!secret) return false;
  // Header for bots we control; ?key= for tools that only accept a URL (like Discord webhooks do).
  const given =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    req.nextUrl.searchParams.get("key") ??
    "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const update = parseUpdate(body);
  if (!update) {
    // 202 rather than 4xx so a relay bot forwarding every message doesn't log errors
    // for announcements that aren't about sessions.
    return NextResponse.json({ ignored: true }, { status: 202 });
  }

  const stored = await applyUpdate(update);
  return NextResponse.json({ ok: true, session: stored });
}
