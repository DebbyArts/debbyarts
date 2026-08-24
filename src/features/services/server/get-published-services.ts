import "server-only"

import { connection } from "next/server"

import { projectServiceGroups } from "@/features/services/service-catalogue"
import { PUBLISHED_SERVICES_QUERY } from "@/features/services/service-query"

async function getPublishedServiceGroups() {
  await connection()

  const { prisma } = await import("@/db/client")
  const services = await prisma.service.findMany(PUBLISHED_SERVICES_QUERY)

  return projectServiceGroups(services, {
    publicMediaBaseUrl: process.env.PUBLIC_MEDIA_BASE_URL,
  })
}

export { getPublishedServiceGroups }
