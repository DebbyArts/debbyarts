import Link from "next/link"

import {
  AdminPage,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/shared/admin-page"
import { AdminShell } from "@/components/shared/admin-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { FeedbackBanner } from "@/components/shared/feedback-banner"
import { MediaImage } from "@/components/shared/media-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"
import { requireAdmin } from "@/server/auth/authorize"
import { getPublicMediaUrl } from "@/server/storage/public-url"

type ServiceListPageProps = {
  searchParams: Promise<{
    cleanup?: string
    deleted?: string
    group?: string
    q?: string
    status?: string
  }>
}

const GROUP_LABELS: Record<string, string> = {
  PERSONALISED_PRODUCTS: "Personalised products",
  PRINT_EVENT_MATERIALS: "Print & event materials",
  BRANDING_SIGNAGE: "Branding & signage",
}

async function ServiceListPage({ searchParams }: ServiceListPageProps) {
  const admin = await requireAdmin()
  const { prisma } = await import("@/db/client")
  const query = await searchParams
  const cleanupPath =
    query.cleanup &&
    query.cleanup.length <= 250 &&
    query.cleanup.startsWith(`${admin.id}/service/`) &&
    /^[0-9a-f-]+\/service\/[0-9a-f-]+\.(jpg|png|webp)$/.test(query.cleanup)
      ? query.cleanup
      : null
  const group = Object.hasOwn(GROUP_LABELS, query.group ?? "")
    ? query.group
    : undefined
  const published =
    query.status === "published"
      ? true
      : query.status === "draft"
        ? false
        : undefined
  const search = query.q?.trim().slice(0, 120) || undefined
  const services = await prisma.service.findMany({
    where: {
      group: group as never,
      published,
      name: search ? { contains: search, mode: "insensitive" } : undefined,
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  })

  return (
    <AdminShell activeSection="services" accountAction={<SignOutButton />}>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Services"
          title="SERVICES"
          description="Manage printed products and production services shown publicly."
          action={
            <Button asChild>
              <Link href="/admin/services/new">+ Add Service</Link>
            </Button>
          }
        />
        {query.deleted ? (
          <FeedbackBanner tone={cleanupPath ? "warning" : "success"}>
            {cleanupPath ? (
              <span>
                Service deleted. Remove the orphaned Storage object at{" "}
                <code className="break-all font-mono">{cleanupPath}</code>.
              </span>
            ) : (
              "Service deleted."
            )}
          </FeedbackBanner>
        ) : null}
        <form
          action="/admin/services"
          className="grid gap-3 border border-border-subtle bg-card p-3 md:grid-cols-[1fr_13rem_13rem_auto]"
        >
          <Input name="q" placeholder="Search by name…" defaultValue={search} />
          <select
            name="group"
            aria-label="Filter by service group"
            defaultValue={group ?? ""}
            className="h-12 border border-input bg-card px-3 text-sm font-bold"
          >
            <option value="">All groups</option>
            {Object.entries(GROUP_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            name="status"
            aria-label="Filter by publication status"
            defaultValue={query.status ?? ""}
            className="h-12 border border-input bg-card px-3 text-sm font-bold"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
        {services.length ? (
          <ul className="grid gap-[1.125rem] sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <li
                key={service.id}
                className="overflow-hidden rounded-sm border border-border-subtle bg-card"
              >
                <MediaImage
                  src={getPublicMediaUrl(service.primaryImagePath) ?? undefined}
                  alt={service.primaryImageAlt ?? ""}
                  sizes="(min-width: 1280px) 346px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[346/240] border-b border-border-subtle"
                  fallback="No primary image"
                />
                <div className="flex flex-col gap-3 p-[1.125rem]">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-2xl leading-7">
                      {service.name.toUpperCase()}
                    </h2>
                    <AdminStatusBadge tone={service.published ? "published" : "draft"}>
                      {service.published ? "Published" : "Draft"}
                    </AdminStatusBadge>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {GROUP_LABELS[service.group]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="type-label">Order {service.displayOrder}</span>
                    <Button asChild variant="link" size="sm">
                      <Link href={`/admin/services/${service.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No services found"
            description={
              search || group || published !== undefined
                ? "Try changing the current search or filters."
                : "Add the first service or printed product."
            }
            action={
              <Button asChild>
                <Link href="/admin/services/new">Add Service</Link>
              </Button>
            }
          />
        )}
      </AdminPage>
    </AdminShell>
  )
}

export default ServiceListPage
