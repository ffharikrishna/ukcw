/**
 * Roblox avatar headshots. The image URLs Roblox hands out expire after ~30 days,
 * so they're looked up at request time (cached for 6 hours) rather than saved.
 */
export async function getHeadshots(userIds: number[]): Promise<Record<number, string>> {
  const url = new URL("https://thumbnails.roblox.com/v1/users/avatar-headshot");
  url.searchParams.set("userIds", userIds.join(","));
  url.searchParams.set("size", "420x420");
  url.searchParams.set("format", "Png");
  url.searchParams.set("isCircular", "false");

  try {
    const res = await fetch(url, { next: { revalidate: 21_600 } });
    if (!res.ok) return {};
    const { data } = (await res.json()) as {
      data: { targetId: number; state: string; imageUrl: string | null }[];
    };
    return Object.fromEntries(
      data.filter((d) => d.state === "Completed" && d.imageUrl).map((d) => [d.targetId, d.imageUrl!]),
    );
  } catch {
    return {};
  }
}
