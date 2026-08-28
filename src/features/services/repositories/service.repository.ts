import type { Prisma } from "@/db/generated/prisma/client"
import type { ServiceAdminListFilters } from "@/features/services/types"

const ADMIN_SERVICE_LIST_SELECT = {
  id: true,
  name: true,
  group: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  published: true,
  displayOrder: true,
} satisfies Prisma.ServiceSelect

const SERVICE_EDITOR_SELECT = {
  id: true,
  name: true,
  description: true,
  group: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  pricingMode: true,
  priceAmount: true,
  published: true,
  displayOrder: true,
} satisfies Prisma.ServiceSelect

const SERVICE_OPTIONS_SELECT = {
  id: true,
  name: true,
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: true,
  askDesignReadiness: true,
  askColour: true,
  askMaterial: true,
  materialOptions: true,
  askFinish: true,
} satisfies Prisma.ServiceSelect

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
    materialOptions: true,
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

async function findPublishedServices() {
  const { prisma } = await import("@/db/client")

  return prisma.service.findMany(PUBLISHED_SERVICES_QUERY)
}

async function findServiceById(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.service.findUnique({ where: { id } })
}

async function findAdminServices(filters: ServiceAdminListFilters) {
  const { prisma } = await import("@/db/client")

  return prisma.service.findMany({
    where: {
      group: filters.group,
      published: filters.published,
      name: filters.search
        ? { contains: filters.search, mode: "insensitive" }
        : undefined,
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: ADMIN_SERVICE_LIST_SELECT,
  })
}

async function findServiceForEditor(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.service.findUnique({
    where: { id },
    select: SERVICE_EDITOR_SELECT,
  })
}

async function findServiceForOptions(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.service.findUnique({
    where: { id },
    select: SERVICE_OPTIONS_SELECT,
  })
}

async function createService(data: Prisma.ServiceCreateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.service.create({ data })
}

async function updateService(id: string, data: Prisma.ServiceUpdateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.service.update({ where: { id }, data })
}

async function findServiceImagePath(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.service.findUnique({
    where: { id },
    select: { primaryImagePath: true },
  })
}

async function deleteService(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.service.delete({ where: { id } })
}

export {
  ADMIN_SERVICE_LIST_SELECT,
  PUBLISHED_SERVICES_QUERY,
  SERVICE_EDITOR_SELECT,
  SERVICE_OPTIONS_SELECT,
  createService,
  deleteService,
  findAdminServices,
  findPublishedServices,
  findServiceById,
  findServiceForEditor,
  findServiceForOptions,
  findServiceImagePath,
  updateService,
  type PublishedServiceRecord,
}
