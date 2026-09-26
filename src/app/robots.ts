import type { MetadataRoute } from "next"

import { absoluteUrl, SITE_URL } from "./site-metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL.origin,
  }
}
