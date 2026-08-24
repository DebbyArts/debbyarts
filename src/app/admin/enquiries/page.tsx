import Link from "next/link"

import {
  AdminPage,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/shared/admin-page"
import { AdminShell } from "@/components/shared/admin-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnquiryStatus, RequestKind } from "@/db/generated/prisma/enums"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { requireAdmin } from "@/server/auth/authorize"

type EnquiryListPageProps = {
  searchParams: Promise<{
    kind?: string
    page?: string
    q?: string
    status?: string
  }>
}

const PAGE_SIZE = 20

function statusTone(status: EnquiryStatus) {
  return status === EnquiryStatus.NEW
    ? "new"
    : status === EnquiryStatus.CONTACTED
      ? "contacted"
      : "resolved"
}

function formatReceived(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

async function EnquiryListPage({ searchParams }: EnquiryListPageProps) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
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
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const where = {
    requestKind: kind,
    status,
    OR: search
      ? [
          { reference: { contains: search, mode: "insensitive" as const } },
          { customerName: { contains: search, mode: "insensitive" as const } },
          { phoneWhatsApp: { contains: search } },
        ]
      : undefined,
  }
  const [enquiries, total, newToday] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.count({
      where: { status: EnquiryStatus.NEW, createdAt: { gte: startOfToday } },
    }),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageHref = (target: number) => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (status) params.set("status", status)
    if (kind) params.set("kind", kind)
    params.set("page", String(target))
    return `/admin/enquiries?${params.toString()}`
  }

  return (
    <AdminShell activeSection="enquiries" accountAction={<SignOutButton />}>
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
            <div className="hidden min-w-[58rem] grid-cols-[7rem_13rem_8rem_1fr_10rem_8rem_3rem] items-center bg-muted px-4 py-3 lg:grid">
              {[
                "Reference",
                "Customer",
                "Request",
                "Linked to",
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
                <li key={enquiry.id} className="border-t border-border-subtle first:border-t-0 lg:min-w-[58rem]">
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="grid gap-3 p-4 hover:bg-surface-subtle lg:grid-cols-[7rem_13rem_8rem_1fr_10rem_8rem_3rem] lg:items-center"
                  >
                    <strong className="type-label">{enquiry.reference}</strong>
                    <span className="flex min-w-0 flex-col gap-1">
                      <strong className="truncate text-sm">{enquiry.customerName}</strong>
                      <span className="truncate text-xs text-muted-foreground">
                        {enquiry.phoneWhatsApp}
                      </span>
                    </span>
                    <span className="type-label">{enquiry.requestKind}</span>
                    <span className="min-w-0">
                      <strong className="block truncate text-sm">{enquiry.itemNameSnapshot}</strong>
                      <span className="text-xs text-muted-foreground">
                        {enquiry.requestKind === "ARTWORK" ? "Artwork" : "Service"} request
                      </span>
                    </span>
                    <span className="text-xs">{formatReceived(enquiry.createdAt)}</span>
                    <AdminStatusBadge tone={statusTone(enquiry.status)}>
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

export default EnquiryListPage
