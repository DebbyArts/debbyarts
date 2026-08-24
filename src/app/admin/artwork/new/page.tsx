import Link from "next/link"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin-page"
import { AdminShell } from "@/components/shared/admin-shell"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { ArtworkEditor } from "@/features/artwork/components/admin/artwork-editor"
import { requireAdmin } from "@/server/auth/authorize"

async function NewArtworkPage() {
  await requireAdmin()
  return (
    <AdminShell activeSection="artwork" accountAction={<SignOutButton />}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Artwork"
          title="ADD ARTWORK"
          description="Create one confirmed artwork or portrait record."
          action={
            <Button variant="link" asChild>
              <Link href="/admin/artwork">← Back to Artwork</Link>
            </Button>
          }
        />
        <ArtworkEditor artwork={null} />
      </AdminPage>
    </AdminShell>
  )
}

export default NewArtworkPage
