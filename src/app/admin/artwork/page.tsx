import {
  ArtworkAdminListPage,
  type ArtworkListSearchParams,
} from "@/features/artwork"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

type ArtworkRouteProps = {
  searchParams: Promise<ArtworkListSearchParams>
}

export default function ArtworkRoute({ searchParams }: ArtworkRouteProps) {
  return (
    <ArtworkAdminListPage
      accountAction={<SignOutButton />}
      searchParams={searchParams}
    />
  )
}
