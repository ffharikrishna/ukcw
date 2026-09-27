export type Punishment = "Warning" | "Kick" | "Ban";

export type GuidelineGroup = {
  slug: string;
  title: string;
  description: string;
  punishments: Punishment[];
  rules: string[];
};

// Rules are grouped by the punishments they can carry, lightest first.
export const guidelineGroups: GuidelineGroup[] = [
  {
    slug: "warning-kick-ban",
    title: "Warning, kick or ban",
    description: "Can result in a warning, a kick or a ban.",
    punishments: ["Warning", "Kick", "Ban"],
    rules: [
      "Random Death Match (RDM)",
      "Vehicle Death Match (VDM)",
      "Fail Role Play",
      "Disrespect",
      "Using WL items",
      "Unrealistic Avatar",
      "Tool Abuse",
      "New Life Rule",
      "Cuff Rush",
      "GTA Driving",
      "Bugging Vehicles",
      "Auto Jail",
    ],
  },
  {
    slug: "kick-ban",
    title: "Kick or ban",
    description: "Can result in a kick or a ban. No warnings.",
    punishments: ["Kick", "Ban"],
    rules: [
      "Mass RDM",
      "Mass VDM",
      "NITRP (No Intent to Role Play)",
      "Mass Tool Abuse",
      "Mass Cuff Rush",
      "Mass Disrespect",
      "Lying to Staff",
      "Staff VDM",
      "Staff RDM",
      "Staff Evasion",
      "Trolling",
    ],
  },
  {
    slug: "ban",
    title: "Ban",
    description: "Results in a ban.",
    punishments: ["Ban"],
    rules: [
      "Roblox TOS",
      "PRC TOS",
      "Any form of Racism",
      "Hacking or Exploiting",
      "Mass Trolling",
      "Raiding",
      "In-game Advertisement",
      "Creating Fake Evidence",
      "Glitching game using avatar",
    ],
  },
];
