import { RequestPage } from "@/features/enquiries/components/RequestPage"
import { loadRequestPage } from "@/features/enquiries/services/enquiry.query.service"
import type { RequestSearchParams } from "@/features/enquiries/types"

async function RequestFeaturePage({
  searchParams,
}: {
  searchParams: Promise<RequestSearchParams>
}) {
  return <RequestPage data={await loadRequestPage(await searchParams)} />
}

export { RequestFeaturePage }
