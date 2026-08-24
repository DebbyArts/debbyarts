import type { Prisma } from "@/db/generated/prisma/client"

const PUBLISHED_SERVICES_QUERY = {
  where: { published: true },
  select: {
    id: true,
    slug: true,
    name: true,
    description: true,
    group: true,
    primaryImagePath: true,
    primaryImageAlt: true,
    pricingMode: true,
    priceAmount: true,
    published: true,
    displayOrder: true,
    askQuantity: true,
    askSizeFormat: true,
    sizeFormatOptions: true,
    askDesignReadiness: true,
    askColour: true,
    askMaterial: true,
    askFinish: true,
  },
  orderBy: [
    { displayOrder: "asc" },
    { name: "asc" },
    { slug: "asc" },
  ],
} satisfies Prisma.ServiceFindManyArgs

type PublishedServiceRecord = Prisma.ServiceGetPayload<
  typeof PUBLISHED_SERVICES_QUERY
>

export { PUBLISHED_SERVICES_QUERY, type PublishedServiceRecord }
