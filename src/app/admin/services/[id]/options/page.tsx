import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminPage, AdminPageHeader } from "@/components/shared/admin-page"
import { AdminShell } from "@/components/shared/admin-shell"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { ServiceOptionsForm } from "@/features/services/components/admin/service-options-form"
import { requireAdmin } from "@/server/auth/authorize"

async function ServiceOptionsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  const { id } = await params
  const service = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      askQuantity: true,
      askSizeFormat: true,
      sizeFormatOptions: true,
      askDesignReadiness: true,
      askColour: true,
      askMaterial: true,
      askFinish: true,
    },
  })
  if (!service) notFound()

  return (
    <AdminShell activeSection="services" accountAction={<SignOutButton />}>
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

export default ServiceOptionsPage
