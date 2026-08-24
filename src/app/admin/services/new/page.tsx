import Link from "next/link"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin-page"
import { AdminShell } from "@/components/shared/admin-shell"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { ServiceEditor } from "@/features/services/components/admin/service-editor"
import { requireAdmin } from "@/server/auth/authorize"

async function NewServicePage() {
  await requireAdmin()
  return (
    <AdminShell activeSection="services" accountAction={<SignOutButton />}>
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

export default NewServicePage
