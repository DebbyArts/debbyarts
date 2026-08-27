import { ArtworkEditPage } from "@/features/artwork"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

export default function ArtworkEditRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <ArtworkEditPage
      accountAction={<SignOutButton />}
      params={params}
    />
  )
}
