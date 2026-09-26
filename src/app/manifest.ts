import type { MetadataRoute } from "next"

import { SITE_DESCRIPTION, SITE_NAME } from "./site-metadata"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Debby Art",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0e6",
    theme_color: "#f5f0e6",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
