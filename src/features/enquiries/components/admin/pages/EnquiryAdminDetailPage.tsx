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
import { Button } from "@/components/ui/button"
import { MediaImage } from "@/components/ui/media-image"
import { EnquiryStatus } from "@/db/generated/prisma/enums"
import { updateEnquiryStatusAction } from "@/features/enquiries/actions/update-enquiry-status.admin.action"
import { WhatsAppContinuation } from "@/features/enquiries/components/admin/WhatsAppContinuation"
import { getEnquiryDetail } from "@/features/enquiries/services/enquiry.service"
import { requireAdmin } from "@/shared/auth/authorize"

type DetailRowProps = {
  label: string
  value: ReactNode
}

type EnquiryDetailPageProps = {
  accountAction?: ReactNode
  params: Promise<{ id: string }>
}

function DetailRow({ label, value }: DetailRowProps) {
  if (value === null || value === undefined || value === "") return null

  return (
    <div className="grid min-h-10 gap-1 border-b border-border-subtle py-2 last:border-0 sm:grid-cols-[11.25rem_1fr]">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-bold break-words">{value}</dd>
    </div>
  )
}

async function EnquiryAdminDetailPage({
  accountAction,
  params,
}: EnquiryDetailPageProps) {
  await requireAdmin()
  const { id } = await params
  const enquiry = await getEnquiryDetail(id)

  if (!enquiry) notFound()

  return (
    <AdminShell activeSection="enquiries" accountAction={accountAction}>
      <AdminPage>
        <AdminPageHeader
          eyebrow={`${enquiry.requestKindLabel} enquiry`}
          title={enquiry.reference}
          description={`Received ${enquiry.receivedLabel}`}
          action={
            <div className="flex flex-wrap items-center gap-3">
              <AdminStatusBadge tone={enquiry.statusTone}>
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
            <AdminSectionCard title={`Linked ${enquiry.requestKindLabel}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <MediaImage
                  src={enquiry.linkedRecord.imageUrl ?? undefined}
                  alt={enquiry.linkedRecord.imageAlt}
                  sizes="160px"
                  className="h-[7.5rem] w-full shrink-0 border border-border sm:w-[10rem]"
                  fallback="Linked record image unavailable"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="type-label text-primary">
                    {enquiry.linkedRecord.sourceLabel}
                  </p>
                  <h2 className="text-[1.375rem] leading-7 font-extrabold">
                    {enquiry.linkedRecord.name}
                  </h2>
                  {!enquiry.linkedRecord.hasLinkedRecord ? (
                    <p className="text-xs text-muted-foreground">
                      The catalogue record was deleted; the submitted snapshot
                      remains available here.
                    </p>
                  ) : null}
                  {enquiry.linkedRecord.href ? (
                    <Button variant="link" size="sm" asChild className="w-fit">
                      <Link href={enquiry.linkedRecord.href}>Open record</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Request Details">
              <dl>
                <DetailRow
                  label="Size / format"
                  value={enquiry.requestDetails.sizeFormat}
                />
                <DetailRow label="Framing" value={enquiry.requestDetails.framing} />
                <DetailRow label="Quantity" value={enquiry.requestDetails.quantity} />
                <DetailRow
                  label="Design readiness"
                  value={enquiry.requestDetails.designReadinessLabel}
                />
                <DetailRow label="Colour" value={enquiry.requestDetails.colour} />
                <DetailRow label="Material" value={enquiry.requestDetails.material} />
                <DetailRow label="Finish" value={enquiry.requestDetails.finish} />
                <DetailRow
                  label="Customer note"
                  value={enquiry.requestDetails.customerNote}
                />
              </dl>
            </AdminSectionCard>

            <AdminSectionCard title="Delivery & Timing">
              <dl>
                <DetailRow
                  label="Delivery / pickup"
                  value={enquiry.delivery.fulfilmentMethodLabel}
                />
                <DetailRow label="Location" value={enquiry.delivery.location} />
                <DetailRow
                  label="Preferred date"
                  value={enquiry.delivery.preferredDateLabel}
                />
              </dl>
            </AdminSectionCard>

            <AdminSectionCard title="Contact Information">
              <dl>
                <DetailRow label="Customer" value={enquiry.contact.customerName} />
                <DetailRow label="WhatsApp" value={enquiry.contact.phoneWhatsApp} />
                <DetailRow label="Email" value={enquiry.contact.email} />
              </dl>
            </AdminSectionCard>
          </div>

          <aside className="flex min-w-0 flex-col gap-[1.125rem] xl:sticky xl:top-5">
            <AdminSectionCard title="Status">
              <div className="grid grid-cols-3 gap-2">
                {Object.values(EnquiryStatus).map((status) => (
                  <form
                    key={status}
                    action={updateEnquiryStatusAction.bind(null, enquiry.id, status)}
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
              <WhatsAppContinuation phone={enquiry.contact.phoneWhatsApp} />
            </AdminSectionCard>

            <AdminSectionCard title="Record Details">
              <dl>
                <DetailRow label="Reference" value={enquiry.reference} />
                <DetailRow label="Received" value={enquiry.receivedLabel} />
                <DetailRow
                  label="Status changed"
                  value={enquiry.statusChangedLabel}
                />
                <DetailRow
                  label="Source"
                  value={`${enquiry.requestKindLabel} request`}
                />
              </dl>
            </AdminSectionCard>
          </aside>
        </div>
      </AdminPage>
    </AdminShell>
  )
}

export { EnquiryAdminDetailPage }
