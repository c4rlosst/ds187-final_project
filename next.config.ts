import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next only trusts `localhost` for dev resources by default. Without this,
  // opening the site via 127.0.0.1 blocks the dev connection and client-only
  // components (like the map) never finish loading.
  allowedDevOrigins: ["127.0.0.1"],
  // Keep framework-generated instruction files out of the project.
  agentRules: false,
};

export default nextConfig;
