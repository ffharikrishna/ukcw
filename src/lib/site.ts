// Central place for links and copy that staff will want to change without touching components.

export const site = {
  name: "UK Canary Wharf Roleplay",
  shortName: "UKCW",
  // Home page intro. Also used for search results and link embeds (Discord, etc).
  description:
    "UKCW is one of ER:LC’s best UK roleplay servers. With a wide range of businesses and departments, a team led by some of the most competent names in ER:LC, and professionally designed liveries, our server gives you the best British roleplay experience.",
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
