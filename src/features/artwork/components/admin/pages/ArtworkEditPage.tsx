import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { ArtworkEditor } from "@/features/artwork/components/admin/ArtworkEditor"
import { getArtworkEditor } from "@/features/artwork/services/artwork.query.service"
import { requireAdmin } from "@/shared/auth/authorize"

async function ArtworkEditPage({
  accountAction,
  params,
}: {
  accountAction?: ReactNode
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const artwork = await getArtworkEditor(id)
  if (!artwork) notFound()

  return (
    <AdminShell activeSection="artwork" accountAction={accountAction}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Artwork"
          title="EDIT ARTWORK"
          description={`Update ${artwork.title} using the approved V1 structure.`}
          action={
            <Button variant="link" asChild>
              <Link href="/admin/artwork">← Back to Artwork</Link>
            </Button>
          }
        />
        <ArtworkEditor artwork={artwork} />
      </AdminPage>
    </AdminShell>
  )
}

export { ArtworkEditPage }
