import { ServiceOptionsPage } from "@/features/services"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

export default function ServiceOptionsRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <ServiceOptionsPage
      accountAction={<SignOutButton />}
      params={params}
    />
  )
}
