import { ArtworkOptionsPage } from "@/features/artwork"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

export default function ArtworkOptionsRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <ArtworkOptionsPage
      accountAction={<SignOutButton />}
      params={params}
    />
  )
}
