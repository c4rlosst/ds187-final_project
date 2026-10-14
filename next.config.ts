import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next only trusts `localhost` for dev resources by default. Without this,
  // opening the site via 127.0.0.1 blocks the dev connection and client-only
  // components (like the map) never finish loading.
  allowedDevOrigins: ["127.0.0.1"],
  // Stop `next dev` from generating AGENTS.md / CLAUDE.md in the repo.
  agentRules: false,
};

export default nextConfig;
