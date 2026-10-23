import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lich-core xuất thẳng file .ts (không build trước) nên Next.js cần tự biên dịch nó
  transpilePackages: ["lich-core"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
