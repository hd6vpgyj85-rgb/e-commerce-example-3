import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The Storage emulator serves over plain http from a private IP, which
    // Next's image optimizer always refuses to proxy — skip optimization
    // only in that local dev scenario.
    unoptimized: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      ...(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"
        ? [
            {
              protocol: "http" as const,
              hostname: "127.0.0.1",
              port: "9199",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
