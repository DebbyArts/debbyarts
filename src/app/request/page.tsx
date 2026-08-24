import type { Metadata } from "next"

import { RequestPage } from "@/features/enquiries/components/request-page"
import { loadRequestPage } from "@/features/enquiries/server/load-request-page"
import { PublicShell } from "@/features/site/components/public-shell"

export const metadata: Metadata = {
  title: "Make a Request | Debby Art & Prints",
  description:
    "Submit a structured artwork or service request, then continue the saved enquiry on WhatsApp.",
}

type RequestRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function RequestRoute({ searchParams }: RequestRouteProps) {
  const data = await loadRequestPage(await searchParams)

  return (
    <PublicShell activePath="/request">
      <RequestPage data={data} />
    </PublicShell>
  )
}
