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
    remotePatterns,
  },
};

export default nextConfig;
