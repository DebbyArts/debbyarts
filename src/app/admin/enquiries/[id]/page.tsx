import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import {
  AdminPage,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatusBadge,
} from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { MediaImage } from "@/components/ui/media-image"
import { Button } from "@/components/ui/button"
import { EnquiryStatus } from "@/db/generated/prisma/enums"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { updateEnquiryStatusAction } from "@/features/enquiries/admin/actions"
import { WhatsAppContinuation } from "@/features/enquiries/components/admin/whatsapp-continuation"
import { requireAdmin } from "@/server/auth/authorize"
import { getPublicMediaUrl } from "@/server/storage/public-url"

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className="grid min-h-10 gap-1 border-b border-border-subtle py-2 last:border-0 sm:grid-cols-[11.25rem_1fr]">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-bold break-words">{value}</dd>
    </div>
  )
}

const LABELS: Record<string, string> = {
  DELIVERY: "Delivery",
  PICKUP: "Pickup",
  FINISHED_DESIGN: "Finished design ready",
  NEEDS_DESIGN_HELP: "Needs design help",
  NOT_SURE: "Not sure",
}

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date)
    : null
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function statusTone(status: EnquiryStatus) {
  return status === EnquiryStatus.NEW
    ? "new"
    : status === EnquiryStatus.CONTACTED
      ? "contacted"
      : "resolved"
}

async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  const { id } = await params
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: { artwork: true, service: true },
  })
  if (!enquiry) notFound()

  const linked = enquiry.artwork ?? enquiry.service
  const linkedName = linked
    ? "title" in linked
      ? linked.title
      : linked.name
    : enquiry.itemNameSnapshot
  const linkedHref = enquiry.artwork
    ? `/admin/artwork/${enquiry.artwork.id}`
    : enquiry.service
      ? `/admin/services/${enquiry.service.id}`
      : null

  return (
    <AdminShell activeSection="enquiries" accountAction={<SignOutButton />}>
      <AdminPage>
        <AdminPageHeader
          eyebrow={`${enquiry.requestKind === "ARTWORK" ? "Artwork" : "Service"} enquiry`}
          title={enquiry.reference}
          description={`Received ${formatDateTime(enquiry.createdAt)}`}
          action={
            <div className="flex flex-wrap items-center gap-3">
              <AdminStatusBadge tone={statusTone(enquiry.status)}>
                {enquiry.status}
              </AdminStatusBadge>
              <Button variant="link" asChild>
                <Link href="/admin/enquiries">← Back to Enquiries</Link>
              </Button>
            </div>
          }
        />
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <div className="flex min-w-0 flex-col gap-[1.125rem]">
            <AdminSectionCard title={`Linked ${enquiry.requestKind === "ARTWORK" ? "Artwork" : "Service"}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <MediaImage
                  src={getPublicMediaUrl(linked?.primaryImagePath) ?? undefined}
                  alt={linked?.primaryImageAlt ?? ""}
                  sizes="160px"
                  className="h-[7.5rem] w-full shrink-0 border border-border sm:w-[10rem]"
                  fallback="Linked record image unavailable"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="type-label text-primary">
                    {linked ? "Linked record" : "Saved snapshot"}
                  </p>
                  <h2 className="text-[1.375rem] leading-7 font-extrabold">
                    {linkedName}
                  </h2>
                  {!linked ? (
                    <p className="text-xs text-muted-foreground">
                      The catalogue record was deleted; the submitted snapshot
                      remains available here.
                    </p>
                  ) : null}
                  {linkedHref ? (
                    <Button variant="link" size="sm" asChild className="w-fit">
                      <Link href={linkedHref}>Open record</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Request Details">
              <dl>
                <DetailRow label="Size / format" value={enquiry.sizeFormat} />
                <DetailRow label="Framing" value={enquiry.framing} />
                <DetailRow label="Quantity" value={enquiry.quantity} />
                <DetailRow
                  label="Design readiness"
                  value={
                    enquiry.designReadiness
                      ? LABELS[enquiry.designReadiness]
                      : null
                  }
                />
                <DetailRow label="Colour" value={enquiry.colour} />
                <DetailRow label="Material" value={enquiry.material} />
                <DetailRow label="Finish" value={enquiry.finish} />
                <DetailRow label="Customer note" value={enquiry.customerNote} />
              </dl>
            </AdminSectionCard>

            <AdminSectionCard title="Delivery & Timing">
              <dl>
                <DetailRow
                  label="Delivery / pickup"
                  value={
                    enquiry.fulfilmentMethod
                      ? LABELS[enquiry.fulfilmentMethod]
                      : null
                  }
                />
                <DetailRow label="Location" value={enquiry.location} />
                <DetailRow
                  label="Preferred date"
                  value={formatDate(enquiry.preferredDate)}
                />
              </dl>
            </AdminSectionCard>

            <AdminSectionCard title="Contact Information">
              <dl>
                <DetailRow label="Customer" value={enquiry.customerName} />
                <DetailRow label="WhatsApp" value={enquiry.phoneWhatsApp} />
                <DetailRow label="Email" value={enquiry.email} />
              </dl>
            </AdminSectionCard>
          </div>

          <aside className="flex min-w-0 flex-col gap-[1.125rem] xl:sticky xl:top-5">
            <AdminSectionCard title="Status">
              <div className="grid grid-cols-3 gap-2">
                {Object.values(EnquiryStatus).map((status) => (
                  <form
                    key={status}
                    action={updateEnquiryStatusAction.bind(
                      null,
                      enquiry.id,
                      status
                    )}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      variant={enquiry.status === status ? "secondary" : "outline"}
                      disabled={enquiry.status === status}
                      className="w-full px-2"
                    >
                      {status[0] + status.slice(1).toLowerCase()}
                    </Button>
                  </form>
                ))}
              </div>
            </AdminSectionCard>

            <AdminSectionCard
              title="WhatsApp"
              description="Opening WhatsApp shares only the saved contact number. Keep the protected enquiry open for context."
              className="border-success-border bg-success-surface"
            >
              <WhatsAppContinuation phone={enquiry.phoneWhatsApp} />
            </AdminSectionCard>

            <AdminSectionCard title="Record Details">
              <dl>
                <DetailRow label="Reference" value={enquiry.reference} />
                <DetailRow label="Received" value={formatDateTime(enquiry.createdAt)} />
                <DetailRow
                  label="Status changed"
                  value={
                    enquiry.updatedAt.getTime() - enquiry.createdAt.getTime() > 1000
                      ? formatDateTime(enquiry.updatedAt)
                      : "Not yet"
                  }
                />
                <DetailRow
                  label="Source"
                  value={`${enquiry.requestKind === "ARTWORK" ? "Artwork" : "Service"} request`}
                />
              </dl>
            </AdminSectionCard>
          </aside>
        </div>
      </AdminPage>
    </AdminShell>
  )
}

export default EnquiryDetailPage
