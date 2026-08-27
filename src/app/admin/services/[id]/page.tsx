import { ServiceEditPage } from "@/features/services"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

export default function ServiceEditRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <ServiceEditPage
      accountAction={<SignOutButton />}
      params={params}
    />
  )
}
