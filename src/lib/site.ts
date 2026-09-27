// Central place for links and copy that staff will want to change without touching components.

export const site = {
  name: "UK Canary Wharf Roleplay",
  shortName: "UKCW",
  description:
    "A UK-based Emergency Response: Liberty County community. Structured sessions, 15+ departments, and a staff team that takes roleplay seriously.",
  // Total departments on the server; only the most popular are featured on the site.
  departmentCount: "15+",
  discordInvite: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.gg/ukcw",
  // Roblox link to ER:LC. Private-server code is shown in the status panel when a session is live.
  gameUrl: "https://www.roblox.com/games/2534724415/Emergency-Response-Liberty-County",
  // Used if the Discord invite lookup fails or the invite has expired.
  fallbackMemberCount: 4300,
  maxPlayers: 49,
  // ER:LC private server code. A code sent by the bot or the ER:LC API takes precedence.
  serverCode: "UKCW",
} as const;

export const nav = [
  { href: "/departments", label: "Departments" },
  { href: "/sessions", label: "Sessions" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/info", label: "Info" },
] as const;
