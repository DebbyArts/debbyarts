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

const REQUEST_SERVICE_SELECT = {
  id: true,
  slug: true,
  name: true,
  group: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: true,
  askDesignReadiness: true,
  askColour: true,
  askMaterial: true,
  askFinish: true,
} satisfies Prisma.ServiceSelect

async function findPublishedServices() {
  const { prisma } = await import("@/db/client")

  return prisma.service.findMany(PUBLISHED_SERVICES_QUERY)
}

async function findPublishedRequestServices() {
  const { prisma } = await import("@/db/client")

  return prisma.service.findMany({
    where: { published: true },
    select: REQUEST_SERVICE_SELECT,
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }, { slug: "asc" }],
  })
}

async function findPublishedRequestService(slug: string) {
  const { prisma } = await import("@/db/client")

  return prisma.service.findFirst({
    where: { slug, published: true },
    select: REQUEST_SERVICE_SELECT,
  })
}

export {
  PUBLISHED_SERVICES_QUERY,
  REQUEST_SERVICE_SELECT,
  findPublishedRequestService,
  findPublishedRequestServices,
  findPublishedServices,
  type PublishedServiceRecord,
}
