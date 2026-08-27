import {
  EnquiryAdminListPage,
  type EnquiryListSearchParams,
} from "@/features/enquiries"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

type EnquiryRouteProps = {
  searchParams: Promise<EnquiryListSearchParams>
}

export default function EnquiryRoute({ searchParams }: EnquiryRouteProps) {
  return (
    <EnquiryAdminListPage
      accountAction={<SignOutButton />}
      searchParams={searchParams}
    />
  )
}
