import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  // Stop `next dev` writing AGENTS.md / CLAUDE.md into the repo.
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Roblox avatar headshots on the Info page.
    remotePatterns: [{ protocol: "https", hostname: "tr.rbxcdn.com" }],
  },
  async redirects() {
    // "How to join" was renamed to "Info".
    return [{ source: "/join", destination: "/info", permanent: true }];
  },
};

export default config;
