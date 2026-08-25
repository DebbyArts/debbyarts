import type { NextConfig } from "next";

const localSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const allowLocalSupabaseImages =
  localSupabaseUrl === "http://127.0.0.1:54321" ||
  localSupabaseUrl === "http://localhost:54321";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    dangerouslyAllowLocalIP: allowLocalSupabaseImages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
