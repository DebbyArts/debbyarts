import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { ServiceEditor } from "@/features/services"
import { requireAdmin } from "@/server/auth/authorize"
import { getPublicMediaUrl } from "@/server/storage/public-url"

async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  const { id } = await params
  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) notFound()

  return (
    <AdminShell activeSection="services" accountAction={<SignOutButton />}>
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
        <ServiceEditor
          service={{
            description: service.description,
            displayOrder: service.displayOrder,
            group: service.group,
            id: service.id,
            imageUrl: getPublicMediaUrl(service.primaryImagePath),
            name: service.name,
            priceAmount: service.priceAmount?.toString() ?? null,
            pricingMode: service.pricingMode,
            primaryImageAlt: service.primaryImageAlt,
            primaryImagePath: service.primaryImagePath,
            published: service.published,
          }}
        />
      </AdminPage>
    </AdminShell>
  )
}

export default EditServicePage
