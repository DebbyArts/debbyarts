import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { ServiceEditor } from "@/features/services/components/admin/ServiceEditor"
import { getServiceEditor } from "@/features/services/services/service.service"
import { requireAdmin } from "@/shared/auth/authorize"

async function ServiceEditPage({
  accountAction,
  params,
}: {
  accountAction?: ReactNode
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const service = await getServiceEditor(id)
  if (!service) notFound()

  return (
    <AdminShell activeSection="services" accountAction={accountAction}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Services"
          title="EDIT SERVICE"
          description={`Update ${service.name} using the approved V1 structure.`}
          action={
            <Button variant="link" asChild>
              <Link href="/admin/services">← Back to Services</Link>
            </Button>
          }
        />
        <ServiceEditor service={service} />
      </AdminPage>
    </AdminShell>
  )
}

export { ServiceEditPage }
