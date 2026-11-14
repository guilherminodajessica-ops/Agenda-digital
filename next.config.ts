import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O projeto não instala ESLint para manter as dependências mínimas.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
