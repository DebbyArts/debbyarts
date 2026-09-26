import type { Metadata } from "next"

import {
  getPublishedServiceGroups,
  ServicesPage,
} from "@/features/services"
import { createPageMetadata } from "../site-metadata"

const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore personalised products, print and event materials, branding, and signage from Debby Art & Prints.",
  path: "/services",
})

async function Page() {
  const groups = await getPublishedServiceGroups()

  return <ServicesPage groups={groups} />
}

export { metadata }
export default Page
