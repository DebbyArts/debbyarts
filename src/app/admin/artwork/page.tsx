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

type ArtworkListPageProps = {
  searchParams: Promise<{
    category?: string
    deleted?: string
    q?: string
    status?: string
  }>
}

const CATEGORY_LABELS: Record<string, string> = {
  PAINTING: "Painting",
  PENCIL_PORTRAIT: "Pencil portrait",
  FRAMED_CUSTOM_ARTWORK: "Framed artwork",
  DIGITAL_ARTWORK: "Digital artwork",
}

const AVAILABILITY_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  MADE_TO_ORDER: "Made to order",
  SOLD: "Sold",
  UNAVAILABLE: "Unavailable",
}

async function ArtworkListPage({ searchParams }: ArtworkListPageProps) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  const query = await searchParams
  const category = Object.hasOwn(CATEGORY_LABELS, query.category ?? "")
    ? query.category
    : undefined
  const published =
    query.status === "published"
      ? true
      : query.status === "draft"
        ? false
        : undefined
  const search = query.q?.trim().slice(0, 120) || undefined
  const artworks = await prisma.artwork.findMany({
    where: {
      category: category as never,
      published,
      title: search ? { contains: search, mode: "insensitive" } : undefined,
    },
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
  })

  return (
    <AdminShell
      activeSection="artwork"
      accountAction={<SignOutButton />}
    >
      <AdminPage>
        <AdminPageHeader
          eyebrow="Artwork"
          title="ARTWORK"
          description="Manage confirmed artwork and portrait work shown publicly."
          action={
            <Button asChild>
              <Link href="/admin/artwork/new">+ Add Artwork</Link>
            </Button>
          }
        />
        {query.deleted ? (
          <FeedbackBanner>Artwork deleted.</FeedbackBanner>
        ) : null}
        <form
          action="/admin/artwork"
          className="grid gap-3 border border-border-subtle bg-card p-3 md:grid-cols-[1fr_13rem_13rem_auto]"
        >
          <Input name="q" placeholder="Search by title…" defaultValue={search} />
          <select
            name="category"
            aria-label="Filter by category"
            defaultValue={category ?? ""}
            className="h-12 border border-input bg-card px-3 text-sm font-bold"
          >
            <option value="">All categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
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
          <Button type="submit" variant="secondary">
            Filter
          </Button>
        </form>
        {artworks.length ? (
          <ul className="grid gap-[1.125rem] sm:grid-cols-2 xl:grid-cols-3">
            {artworks.map((artwork) => (
              <li
                key={artwork.id}
                className="overflow-hidden rounded-sm border border-border-subtle bg-card"
              >
                <MediaImage
                  src={getPublicMediaUrl(artwork.primaryImagePath) ?? undefined}
                  alt={artwork.primaryImageAlt ?? ""}
                  sizes="(min-width: 1280px) 346px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[346/240] border-b border-border-subtle"
                  fallback="No primary image"
                />
                <div className="flex flex-col gap-3 p-[1.125rem]">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-2xl leading-7">
                      {artwork.title.toUpperCase()}
                    </h2>
                    <AdminStatusBadge tone={artwork.published ? "published" : "draft"}>
                      {artwork.published ? "Published" : "Draft"}
                    </AdminStatusBadge>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {CATEGORY_LABELS[artwork.category]} · {AVAILABILITY_LABELS[artwork.availability]}
                    {artwork.featured ? " · ★ Featured" : ""}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="type-label">Order {artwork.displayOrder}</span>
                    <Button asChild variant="link" size="sm">
                      <Link href={`/admin/artwork/${artwork.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No artwork found"
            description={
              search || category || published !== undefined
                ? "Try changing the current search or filters."
                : "Add the first confirmed artwork or portrait."
            }
            action={
              <Button asChild>
                <Link href="/admin/artwork/new">Add Artwork</Link>
              </Button>
            }
          />
        )}
        <aside className="border-l-[6px] border-info bg-muted p-5 text-sm leading-6">
          <strong>Keep printed products out of Artwork.</strong> Clothing,
          plaques, branding and print-production images belong in Services.
        </aside>
      </AdminPage>
    </AdminShell>
  )
}

export default ArtworkListPage
