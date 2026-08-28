import type { Prisma } from "@/db/generated/prisma/client"

const ADMIN_ARTWORK_LIST_SELECT = {
  id: true,
  title: true,
  category: true,
  availability: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  published: true,
  featured: true,
  displayOrder: true,
} satisfies Prisma.ArtworkSelect

const ARTWORK_EDITOR_SELECT = {
  id: true,
  title: true,
  description: true,
  category: true,
  mediumFormat: true,
  displayedPieceDimensions: true,
  availability: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  pricingMode: true,
  priceAmount: true,
  published: true,
  featured: true,
  displayOrder: true,
  additionalImages: {
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      storagePath: true,
      altText: true,
      width: true,
      height: true,
    },
  },
} satisfies Prisma.ArtworkSelect

const ARTWORK_OPTIONS_SELECT = {
  id: true,
  title: true,
  availableSizes: true,
  framingEnabled: true,
  framingOptions: true,
  askQuantity: true,
} satisfies Prisma.ArtworkSelect

const PUBLISHED_ARTWORK_QUERY = {
  where: { published: true },
  orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
  select: {
    slug: true,
    title: true,
    description: true,
    category: true,
    mediumFormat: true,
    displayedPieceDimensions: true,
    availability: true,
    primaryImagePath: true,
    primaryImageAlt: true,
    primaryImageWidth: true,
    primaryImageHeight: true,
    pricingMode: true,
    priceAmount: true,
    additionalImages: {
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        storagePath: true,
        altText: true,
        width: true,
        height: true,
      },
    },
  },
} satisfies Prisma.ArtworkFindManyArgs

const FEATURED_ARTWORK_QUERY = {
  where: {
    featured: true,
    published: true,
  },
  orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  take: 3,
  select: {
    id: true,
    slug: true,
    title: true,
    category: true,
    mediumFormat: true,
    primaryImagePath: true,
    primaryImageAlt: true,
    primaryImageWidth: true,
    primaryImageHeight: true,
  },
} satisfies Prisma.ArtworkFindManyArgs

export {
  ADMIN_ARTWORK_LIST_SELECT,
  ARTWORK_EDITOR_SELECT,
  ARTWORK_OPTIONS_SELECT,
  FEATURED_ARTWORK_QUERY,
  PUBLISHED_ARTWORK_QUERY,
}
