export type Leader = {
  role: "Owner" | "Vice Chairman";
  /** Name shown on the site. */
  name: string;
  /** Roblox username, shown as @handle. */
  username: string;
  robloxId: number;
};

export const leadership: Leader[] = [
  { role: "Owner", name: "Darthvader", username: "I_IDarthVader", robloxId: 264177237 },
  { role: "Vice Chairman", name: "Utahspeed", username: "Utahspeed", robloxId: 3912380420 },
  { role: "Vice Chairman", name: "Roleplay", username: "Roleplay_Aircrafts", robloxId: 1518192420 },
  { role: "Vice Chairman", name: "Chris", username: "Zarcus211", robloxId: 3820970855 },
];

export const staffTeams = [
  {
    name: "Media Team",
    description: "Runs UKCW's news and official media.",
  },
  {
    name: "Events Team",
    description: "Hosts UKCW's events.",
  },
  {
    name: "Discord Moderation",
    description: "Moderates the Discord and keeps it a good place to be.",
  },
];

export const robloxProfile = (id: number) => `https://www.roblox.com/users/${id}/profile`;
