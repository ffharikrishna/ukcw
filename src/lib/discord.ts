import { site } from "./site";

export type Community = { members: number; online: number | null };

// Public invite endpoint, no bot token needed. Cached for ten minutes.
export async function getCommunity(): Promise<Community> {
  const code = site.discordInvite.split("/").filter(Boolean).pop();
  try {
    const res = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      approximate_member_count?: number;
      approximate_presence_count?: number;
    };
    return {
      members: data.approximate_member_count ?? site.fallbackMemberCount,
      online: data.approximate_presence_count ?? null,
    };
  } catch {
    return { members: site.fallbackMemberCount, online: null };
  }
}
