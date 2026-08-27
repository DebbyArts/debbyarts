import {
  ArtworkAdminListPage,
  type ArtworkListSearchParams,
} from "@/features/artwork"

type ArtworkRouteProps = {
  searchParams: Promise<ArtworkListSearchParams>
}

export default function ArtworkRoute({ searchParams }: ArtworkRouteProps) {
  return <ArtworkAdminListPage searchParams={searchParams} />
}
