import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { ArtworkEditor } from "@/features/artwork"
import { requireAdmin } from "@/server/auth/authorize"
import { getPublicMediaUrl } from "@/server/storage/public-url"

async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  const { id } = await params
  const artwork = await prisma.artwork.findUnique({ where: { id } })
  if (!artwork) notFound()

  return (
    <AdminShell activeSection="artwork" accountAction={<SignOutButton />}>
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
        <ArtworkEditor
          artwork={{
            availability: artwork.availability,
            category: artwork.category,
            description: artwork.description,
            displayedPieceDimensions: artwork.displayedPieceDimensions,
            displayOrder: artwork.displayOrder,
            featured: artwork.featured,
            id: artwork.id,
            imageUrl: getPublicMediaUrl(artwork.primaryImagePath),
            mediumFormat: artwork.mediumFormat,
            priceAmount: artwork.priceAmount?.toString() ?? null,
            pricingMode: artwork.pricingMode,
            primaryImageAlt: artwork.primaryImageAlt,
            primaryImagePath: artwork.primaryImagePath,
            published: artwork.published,
            title: artwork.title,
          }}
        />
      </AdminPage>
    </AdminShell>
  )
}

export default EditArtworkPage
