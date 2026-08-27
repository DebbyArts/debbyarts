import { ArtworkEditPage } from "@/features/artwork"

export default function ArtworkEditRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <ArtworkEditPage params={params} />
}
