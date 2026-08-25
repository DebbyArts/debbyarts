import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { ArtworkOptionsForm } from "@/features/artwork/components/admin/artwork-options-form"
import { requireAdmin } from "@/server/auth/authorize"

async function ArtworkOptionsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  const { id } = await params
  const artwork = await prisma.artwork.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      availableSizes: true,
      framingEnabled: true,
      framingOptions: true,
      askQuantity: true,
    },
  })
  if (!artwork) notFound()

  return (
    <AdminShell activeSection="artwork" accountAction={<SignOutButton />}>
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

export default ArtworkOptionsPage
