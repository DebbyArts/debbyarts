import type { NextConfig } from "next";

const storageProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns: URL[] = [];

if (storageProjectUrl) {
  try {
    remotePatterns.push(
      new URL("/storage/v1/object/public/**", storageProjectUrl),
    );
  } catch {
    // The feature renders its intentional no-image fallback for invalid config.
  }
}

const nextConfig: NextConfig = {
  images: {
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
