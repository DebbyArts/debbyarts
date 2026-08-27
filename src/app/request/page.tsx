import type { Metadata } from "next"

import { PublicShell } from "@/components/shared/public/public-shell"
import {
  RequestFeaturePage,
  type RequestSearchParams,
} from "@/features/enquiries"

export const metadata: Metadata = {
  title: "Make a Request | Debby Art & Prints",
  description:
    "Submit a structured artwork or service request, then continue the saved enquiry on WhatsApp.",
}

type RequestRouteProps = {
  searchParams: Promise<RequestSearchParams>
}

export default function RequestRoute({ searchParams }: RequestRouteProps) {
  return (
    <PublicShell activePath="/request">
      <RequestFeaturePage searchParams={searchParams} />
    </PublicShell>
  )
}
