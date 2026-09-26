import type { Metadata } from "next"

const SITE_NAME = "Debby Art & Prints"
const SITE_TITLE = "Debby Art & Prints — Art, Print & Personalisation"
const SITE_DESCRIPTION =
  "Original artwork, printing, branding and personalised creative work for individuals, businesses and events across Lagos and nationwide."
const SITE_URL = new URL("https://debbyarts.vercel.app")

type PageImage = {
  alt: string
  url: string
}

type PageMetadataOptions = {
  description: string
  image?: PageImage | null
  path: string
  title: string
}

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

function createPageMetadata({
  description,
  image,
  path,
  title,
}: PageMetadataOptions): Metadata {
  const pageUrl = absoluteUrl(path)
  const socialTitle = `${title} | ${SITE_NAME}`
  const openGraphImage = image ?? {
    alt: `${SITE_NAME} — make it personal`,
    url: absoluteUrl("/opengraph-image"),
  }
  const twitterImage = image ?? {
    alt: `${SITE_NAME} — make it personal`,
    url: absoluteUrl("/twitter-image"),
  }

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      locale: "en_NG",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: pageUrl,
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [twitterImage],
    },
  }
}

export {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
  createPageMetadata,
}
