import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { ServiceOptionsForm } from "@/features/services/components/admin/ServiceOptionsForm"
import { getServiceOptions } from "@/features/services/services/service.query.service"
import { requireAdmin } from "@/shared/auth/authorize"

async function ServiceOptionsPage({
  accountAction,
  params,
}: {
  accountAction?: ReactNode
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const service = await getServiceOptions(id)
  if (!service) notFound()

  return (
    <AdminShell activeSection="services" accountAction={accountAction}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Services"
          title="REQUEST OPTIONS"
          description={`${service.name} · six fixed V1 questions`}
          action={
            <Button variant="link" asChild>
              <Link href={`/admin/services/${service.id}`}>← Back to Services</Link>
            </Button>
          }
        />
        <ServiceOptionsForm service={service} />
      </AdminPage>
    </AdminShell>
  )
}

export { ServiceOptionsPage }
