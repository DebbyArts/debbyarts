import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { ArtworkOptionsForm } from "@/features/artwork/components/admin/ArtworkOptionsForm"
import { getArtworkOptions } from "@/features/artwork/services/artwork.service"
import { requireAdmin } from "@/server/auth/authorize"

async function ArtworkOptionsPage({
  accountAction,
  params,
}: {
  accountAction?: ReactNode
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const artwork = await getArtworkOptions(id)
  if (!artwork) notFound()

  return (
    <AdminShell activeSection="artwork" accountAction={accountAction}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Artwork"
          title="REQUEST OPTIONS"
          description={`${artwork.title} · fixed V1 request fields`}
          action={
            <Button variant="link" asChild>
              <Link href={`/admin/artwork/${artwork.id}`}>← Back to Artwork</Link>
            </Button>
          }
        />
        <ArtworkOptionsForm artwork={artwork} />
      </AdminPage>
    </AdminShell>
  )
}

export { ArtworkOptionsPage }
