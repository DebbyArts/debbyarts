"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react"

import { AdminSectionCard } from "@/components/shared/admin/admin-page"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { FeedbackBanner } from "@/components/ui/feedback-banner"
import { MediaImage } from "@/components/ui/media-image"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ARTWORK_ADMIN_SELECT_CLASS,
  INITIAL_ARTWORK_ACTION_STATE,
} from "@/features/artwork/constants"
import { deleteArtworkAction } from "@/features/artwork/actions/delete-artwork.admin.action"
import { saveArtworkAction } from "@/features/artwork/actions/save-artwork.admin.action"
import { ArtworkImageManager } from "@/features/artwork/components/admin/ArtworkImageManager"
import { unpublishArtworkAction } from "@/features/artwork/actions/unpublish-artwork.admin.action"
import type { ArtworkEditorValue } from "@/features/artwork/types"

function CheckField({
  defaultChecked,
  description,
  label,
  name,
}: {
  defaultChecked?: boolean
  description: string
  label: string
  name: string
}) {
  return (
    <label className="flex min-h-12 items-start justify-between gap-4 border-b border-border-subtle py-3 last:border-0">
      <span className="flex flex-col gap-1">
        <span className="text-sm font-extrabold">{label}</span>
        <span className="text-xs leading-[1.125rem] text-muted-foreground">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 size-6 accent-primary"
      />
    </label>
  )
}

function ArtworkEditor({ artwork }: { artwork: ArtworkEditorValue | null }) {
  const router = useRouter()
  const saveAction = saveArtworkAction.bind(null, artwork?.id ?? null)
  const [state, action, pending] = useActionState(
    saveAction,
    INITIAL_ARTWORK_ACTION_STATE
  )
  const formRef = useRef<HTMLFormElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const handledCreatedIdRef = useRef<string | null>(null)
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<
    string | null
  >(null)
  const [createdArtworkId, setCreatedArtworkId] = useState<string | null>(null)
  const imageUrl = selectedImagePreviewUrl ?? artwork?.imageUrl ?? undefined

  useEffect(() => {
    return () => {
      if (selectedImagePreviewUrl) {
        URL.revokeObjectURL(selectedImagePreviewUrl)
      }
    }
  }, [selectedImagePreviewUrl])

  useEffect(() => {
    if (
      artwork ||
      !state.createdId ||
      handledCreatedIdRef.current === state.createdId
    ) {
      return
    }

    handledCreatedIdRef.current = state.createdId
    formRef.current?.reset()
    setSelectedImagePreviewUrl(null)
    setCreatedArtworkId(state.createdId)
  }, [artwork, state.createdId])

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setSelectedImagePreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  function clearSelectedImage() {
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
    setSelectedImagePreviewUrl(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <form ref={formRef} action={action} className="flex flex-col gap-6">
        {state.status !== "idle" ? (
          <FeedbackBanner
            tone={
              state.status === "success"
                ? "success"
                : state.status === "warning"
                  ? "warning"
                  : "error"
            }
          >
            {state.message}
          </FeedbackBanner>
        ) : null}

        <AdminSectionCard
          title="Basic Information"
          description="The core details shown publicly. The URL slug is derived from the title."
        >
          <div className="grid gap-[1.125rem] sm:grid-cols-[1.6fr_1fr]">
            <Field>
              <FieldLabel htmlFor="title" required>
                Title
              </FieldLabel>
              <Input
                id="title"
                name="title"
                required
                maxLength={120}
                defaultValue={artwork?.title ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="category" required>
                Category
              </FieldLabel>
              <select
                id="category"
                name="category"
                required
                className={ARTWORK_ADMIN_SELECT_CLASS}
                defaultValue={artwork?.category ?? "PAINTING"}
              >
                <option value="PAINTING">Painting</option>
                <option value="PENCIL_PORTRAIT">Pencil portrait</option>
                <option value="FRAMED_CUSTOM_ARTWORK">Framed artwork</option>
                <option value="DIGITAL_ARTWORK">Digital artwork</option>
              </select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="description" required>
              Description
            </FieldLabel>
            <Textarea
              id="description"
              name="description"
              required
              maxLength={3000}
              defaultValue={artwork?.description ?? ""}
            />
          </Field>
          <div className="grid gap-[1.125rem] md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="mediumFormat">Medium / format</FieldLabel>
              <Input
                id="mediumFormat"
                name="mediumFormat"
                defaultValue={artwork?.mediumFormat ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="displayedPieceDimensions">
                Displayed dimensions
              </FieldLabel>
              <Input
                id="displayedPieceDimensions"
                name="displayedPieceDimensions"
                defaultValue={artwork?.displayedPieceDimensions ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="availability">Availability</FieldLabel>
              <select
                id="availability"
                name="availability"
                className={ARTWORK_ADMIN_SELECT_CLASS}
                defaultValue={artwork?.availability ?? "AVAILABLE"}
              >
                <option value="AVAILABLE">Available</option>
                <option value="MADE_TO_ORDER">Made to order</option>
                <option value="SOLD">Sold</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </Field>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Artwork Image"
          description="Confirmed artwork and portraits only. Printed products belong under Services."
        >
          <div className="grid gap-5 md:grid-cols-[minmax(15rem,24rem)_1fr]">
            <MediaImage
              src={imageUrl}
              alt={
                selectedImagePreviewUrl
                  ? "Selected artwork image preview"
                  : artwork?.primaryImageAlt ?? ""
              }
              sizes="(min-width: 768px) 384px, 100vw"
              className="aspect-[13/6] border border-border"
              fallback="No primary image"
              unoptimized={Boolean(selectedImagePreviewUrl)}
            />
            <div className="flex flex-col gap-4 border border-border-subtle bg-background p-4">
              <Field>
                <FieldLabel htmlFor="primaryImage">
                  {artwork?.primaryImagePath ? "Replace image" : "Primary image"}
                </FieldLabel>
                <Input
                  ref={imageInputRef}
                  id="primaryImage"
                  name="primaryImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelection}
                />
                <FieldDescription>
                  JPEG, PNG or WebP; 8 MB maximum; 320–8,000px per side.
                </FieldDescription>
                {selectedImagePreviewUrl ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <p role="status" className="text-xs text-muted-foreground">
                      Selected image preview ready.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSelectedImage}
                    >
                      Clear selected image
                    </Button>
                  </div>
                ) : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="primaryImageAlt">Image alt text</FieldLabel>
                <Input
                  id="primaryImageAlt"
                  name="primaryImageAlt"
                  maxLength={180}
                  defaultValue={artwork?.primaryImageAlt ?? ""}
                />
                <FieldDescription>
                  Describe the visible work, not the filename.
                </FieldDescription>
              </Field>
              {artwork?.primaryImagePath ? (
                <label className="flex items-center gap-3 text-sm font-bold text-destructive">
                  <input
                    type="checkbox"
                    name="removeImage"
                    className="size-5 accent-destructive"
                  />
                  Remove the current image when saving
                </label>
              ) : null}
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Public Pricing"
          description="The public label is derived from this choice."
        >
          <div className="grid gap-[1.125rem] sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="pricingMode">Pricing mode</FieldLabel>
              <select
                id="pricingMode"
                name="pricingMode"
                className={ARTWORK_ADMIN_SELECT_CLASS}
                defaultValue={artwork?.pricingMode ?? "NONE"}
              >
                <option value="NONE">No public price</option>
                <option value="EXACT">Exact price</option>
                <option value="STARTING_FROM">Starting from</option>
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="priceAmount">Amount (NGN)</FieldLabel>
              <Input
                id="priceAmount"
                name="priceAmount"
                inputMode="decimal"
                placeholder="85000"
                defaultValue={artwork?.priceAmount ?? ""}
              />
            </Field>
          </div>
        </AdminSectionCard>

        <div className="grid gap-5 md:grid-cols-2">
          <AdminSectionCard title="Public Settings">
            <CheckField
              name="published"
              label="Published"
              description="Visible publicly when required content and image are complete."
              defaultChecked={artwork?.published}
            />
            <CheckField
              name="featured"
              label="Featured"
              description="Eligible for featured public placements."
              defaultChecked={artwork?.featured}
            />
            <Field>
              <FieldLabel htmlFor="displayOrder">Display order</FieldLabel>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min={0}
                max={9999}
                required
                defaultValue={artwork?.displayOrder ?? 0}
              />
            </Field>
          </AdminSectionCard>
          <AdminSectionCard
            title="Request Options"
            description="Sizes, framing and the single quantity question are managed separately."
            className="bg-muted"
          >
            {artwork ? (
              <Button variant="outline" asChild>
                <Link href={`/admin/artwork/${artwork.id}/options`}>
                  Edit Request Options
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Save the artwork first, then configure request options.
              </p>
            )}
          </AdminSectionCard>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button variant="outline" asChild>
            <Link href="/admin/artwork">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? "Saving…" : artwork ? "Save Changes" : "Create Artwork"}
          </Button>
        </div>
      </form>

      {artwork ? <ArtworkImageManager artwork={artwork} /> : null}

      {!artwork ? (
        <AlertDialog
          open={Boolean(createdArtworkId)}
          onOpenChange={(open) => {
            if (!open) setCreatedArtworkId(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Artwork created</AlertDialogTitle>
              <AlertDialogDescription>
                Would you like to configure the request options for this item?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (createdArtworkId) {
                    router.push(`/admin/artwork/${createdArtworkId}/options`)
                  }
                }}
              >
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}

      {artwork ? (
        <section className="flex flex-col gap-4 border border-warning-border bg-warning-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold">Record actions</h2>
            <p className="text-xs text-muted-foreground">
              Unpublish keeps the record. Delete is permanent.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {artwork.published ? (
              <form action={unpublishArtworkAction.bind(null, artwork.id)}>
                <Button type="submit" variant="outline" size="sm">
                  Unpublish
                </Button>
              </form>
            ) : null}
            <ConfirmationDialog
              destructive
              title="Delete this artwork?"
              description="The database record is deleted permanently. Existing enquiries keep their saved snapshot."
              confirmLabel="Delete Artwork"
              action={deleteArtworkAction.bind(null, artwork.id)}
              trigger={
                <Button type="button" variant="destructive-outline" size="sm">
                  Delete Artwork
                </Button>
              }
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export { ArtworkEditor }
