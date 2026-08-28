import Link from "next/link"
import type { ReactNode } from "react"

import {
  AdminPage,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/shared/admin/admin-page"
import { AdminShell } from "@/components/shared/admin/admin-shell"
import { EmptyState } from "@/components/ui/states/empty"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnquiryStatus, RequestKind } from "@/db/generated/prisma/enums"
import { getEnquiryList } from "@/features/enquiries/services/enquiry.query.service"
import type { EnquiryListSearchParams } from "@/features/enquiries/types"
import { requireAdmin } from "@/shared/auth/authorize"

type EnquiryListPageProps = {
  accountAction?: ReactNode
  searchParams: Promise<EnquiryListSearchParams>
}

async function EnquiryAdminListPage({
  accountAction,
  searchParams,
}: EnquiryListPageProps) {
  await requireAdmin()
  const query = await searchParams
  const status = Object.values(EnquiryStatus).includes(
    query.status as EnquiryStatus
  )
    ? (query.status as EnquiryStatus)
    : undefined
  const kind = Object.values(RequestKind).includes(query.kind as RequestKind)
    ? (query.kind as RequestKind)
    : undefined
  const search = query.q?.trim().slice(0, 120) || undefined
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1)
  const { items: enquiries, total, newToday, totalPages } =
    await getEnquiryList({ kind, status, search, page })
  const pageHref = (target: number) => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (status) params.set("status", status)
    if (kind) params.set("kind", kind)
    params.set("page", String(target))
    return `/admin/enquiries?${params.toString()}`
  }

  return (
    <AdminShell activeSection="enquiries" accountAction={accountAction}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Admin / Enquiries"
          title="ENQUIRIES"
          description="Review the saved request before contacting the customer."
          action={
            <div className="border border-warning-border bg-warning-surface px-4 py-3">
              <p className="type-label">New today</p>
              <p className="font-display text-2xl">{newToday}</p>
            </div>
          }
        />
        <form
          action="/admin/enquiries"
          className="grid gap-3 border border-border-subtle bg-card p-3 md:grid-cols-[1fr_10rem_12rem_auto]"
        >
          <Input
            name="q"
            defaultValue={search}
            placeholder="Search name, phone or reference"
          />
          <select
            name="status"
            aria-label="Filter by enquiry status"
            defaultValue={status ?? ""}
            className="h-12 border border-input bg-card px-3 text-sm font-bold"
          >
            <option value="">All status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select
            name="kind"
            aria-label="Filter by request type"
            defaultValue={kind ?? ""}
            className="h-12 border border-input bg-card px-3 text-sm font-bold"
          >
            <option value="">All request types</option>
            <option value="ARTWORK">Artwork</option>
            <option value="SERVICE">Service</option>
          </select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
        {enquiries.length ? (
          <div className="overflow-hidden border border-border-subtle bg-card">
            <div className="hidden grid-cols-[6.5rem_minmax(10rem,0.9fr)_minmax(13rem,1.45fr)_6rem_7.5rem_6rem_2rem] items-center bg-muted px-4 py-3 xl:grid">
              {[
                "Reference",
                "Customer",
                "Linked to",
                "Request",
                "Received",
                "Status",
                "",
              ].map((label, index) => (
                <span key={`${label}-${index}`} className="type-label text-muted-foreground">
                  {label}
                </span>
              ))}
            </div>
            <ul>
              {enquiries.map((enquiry) => (
                <li key={enquiry.id} className="border-t border-border-subtle first:border-t-0">
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="grid gap-3 p-4 hover:bg-surface-subtle xl:grid-cols-[6.5rem_minmax(10rem,0.9fr)_minmax(13rem,1.45fr)_6rem_7.5rem_6rem_2rem] xl:items-center"
                  >
                    <strong className="type-label">{enquiry.reference}</strong>
                    <span className="flex min-w-0 flex-col gap-1">
                      <strong className="truncate text-sm">{enquiry.customerName}</strong>
                      <span className="truncate text-xs text-muted-foreground">
                        {enquiry.phoneWhatsApp}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <strong className="block text-sm xl:line-clamp-2">{enquiry.itemName}</strong>
                      <span className="text-xs text-muted-foreground">
                        {enquiry.requestKind === "ARTWORK" ? "Artwork" : "Service"} request
                      </span>
                    </span>
                    <span className="type-label">{enquiry.requestKind}</span>
                    <span className="text-xs">{enquiry.receivedLabel}</span>
                    <AdminStatusBadge tone={enquiry.statusTone}>
                      {enquiry.status}
                    </AdminStatusBadge>
                    <span aria-hidden="true" className="text-right text-xl text-primary">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState
            title="No enquiries found"
            description="There are no saved enquiries matching the current filters."
          />
        )}
        <nav aria-label="Enquiry pages" className="flex items-center justify-between gap-4">
          <span className="type-label text-muted-foreground">
            {enquiries.length} of {total} enquiries
          </span>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="icon-sm" aria-disabled={page <= 1}>
              <Link href={pageHref(Math.max(1, page - 1))} aria-label="Previous page">←</Link>
            </Button>
            <span className="flex size-11 items-center justify-center bg-foreground text-sm font-bold text-white">
              {page} / {totalPages}
            </span>
            <Button asChild variant="outline" size="icon-sm" aria-disabled={page >= totalPages}>
              <Link href={pageHref(Math.min(totalPages, page + 1))} aria-label="Next page">→</Link>
            </Button>
          </div>
        </nav>
      </AdminPage>
    </AdminShell>
  )
}

export { EnquiryAdminListPage }
