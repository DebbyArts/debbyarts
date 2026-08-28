import Link from "next/link"
import type { ReactNode } from "react"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { ServiceEditor } from "@/features/services"
import { requireAdmin } from "@/shared/auth/authorize"

async function ServiceNewPage({ accountAction }: { accountAction?: ReactNode }) {
  await requireAdmin()
  return (
    <AdminShell activeSection="services" accountAction={accountAction}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Services"
          title="ADD SERVICE"
          description="Create one approved production service record."
          action={
            <Button variant="link" asChild>
              <Link href="/admin/services">← Back to Services</Link>
            </Button>
          }
        />
        <ServiceEditor service={null} />
      </AdminPage>
    </AdminShell>
  )
}

export { ServiceNewPage }
