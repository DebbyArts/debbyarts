import type { Prisma } from "@/db/generated/prisma/client"

async function findServiceById(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.service.findUnique({ where: { id } })
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
    where: { id }, select: { primaryImagePath: true },
  })
}

async function deleteService(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.service.delete({ where: { id } })
}

export { createService, deleteService, findServiceById, findServiceImagePath, updateService }
