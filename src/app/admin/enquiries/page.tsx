import {
  EnquiryAdminListPage,
  type EnquiryListSearchParams,
} from "@/features/enquiries"

type EnquiryRouteProps = {
  searchParams: Promise<EnquiryListSearchParams>
}

export default function EnquiryRoute({ searchParams }: EnquiryRouteProps) {
  return <EnquiryAdminListPage searchParams={searchParams} />
}
