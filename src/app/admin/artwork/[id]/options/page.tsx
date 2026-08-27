import { ArtworkOptionsPage } from "@/features/artwork"

export default function ArtworkOptionsRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <ArtworkOptionsPage params={params} />
}
