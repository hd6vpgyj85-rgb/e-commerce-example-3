import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/collection images are external URLs pasted by the admin (any
    // free image host), so the exact set of hosts isn't known up front —
    // skip Next's image optimization proxy instead of allowlisting hosts.
    unoptimized: true,
  },
};

export default nextConfig;
