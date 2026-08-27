import { ArtworkNewPage } from "@/features/artwork"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

export default function ArtworkNewRoute() {
  return <ArtworkNewPage accountAction={<SignOutButton />} />
}
