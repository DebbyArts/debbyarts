import Link from "next/link"
import type { ReactNode } from "react"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { ArtworkEditor } from "@/features/artwork/components/admin/ArtworkEditor"
import { requireAdmin } from "@/server/auth/authorize"

async function ArtworkNewPage({ accountAction }: { accountAction?: ReactNode }) {
  await requireAdmin()
  return (
    <AdminShell activeSection="artwork" accountAction={accountAction}>
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

export { ArtworkNewPage }
