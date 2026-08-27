import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { EnquiryAdminDetailPage } from "@/features/enquiries"

export default function EnquiryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <EnquiryAdminDetailPage
      accountAction={<SignOutButton />}
      params={params}
    />
  )
}
