import type { Metadata } from "next"

import { ServicesPage } from "@/features/services/components/services-page"
import { getPublishedServiceGroups } from "@/features/services/server/get-published-services"

const metadata: Metadata = {
  title: "Services | Debby Art & Prints",
  description:
    "Explore personalised products, print and event materials, branding, and signage from Debby Art & Prints.",
}

async function Page() {
  const groups = await getPublishedServiceGroups()

  return <ServicesPage groups={groups} />
}

export { metadata }
export default Page
