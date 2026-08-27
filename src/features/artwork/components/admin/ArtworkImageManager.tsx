"use client"

import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useRef, useState, useTransition } from "react"

import { AdminSectionCard } from "@/components/shared/admin/admin-page"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { FeedbackBanner } from "@/components/ui/feedback-banner"
import { MediaImage } from "@/components/ui/media-image"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { addArtworkImageAction } from "@/features/artwork/actions/add-artwork-image.admin.action"
import { moveArtworkImageAction } from "@/features/artwork/actions/move-artwork-image.admin.action"
import { removeArtworkImageAction } from "@/features/artwork/actions/remove-artwork-image.admin.action"
import { updateArtworkImageAltAction } from "@/features/artwork/actions/update-artwork-image-alt.admin.action"
import {
  INITIAL_ARTWORK_ACTION_STATE,
  MAX_ARTWORK_GALLERY_IMAGE_COUNT,
} from "@/features/artwork/constants"
import type { ArtworkEditorValue, ArtworkImageActionState } from "@/features/artwork/types"

function ArtworkImageManager({ artwork }: { artwork: ArtworkEditorValue }) {
  const router = useRouter()
  const uploadFormRef = useRef<HTMLFormElement>(null)
  const uploadAction = addArtworkImageAction.bind(null, artwork.id)
  const [uploadState, formAction, uploadPending] = useActionState(
    uploadAction,
    INITIAL_ARTWORK_ACTION_STATE
  )
  const [actionState, setActionState] = useState<ArtworkImageActionState>({
    message: "",
    status: "idle",
  })
  const [isPending, startTransition] = useTransition()
  const totalImages = artwork.additionalImages.length + (artwork.primaryImagePath ? 1 : 0)
  const canAddImage = Boolean(artwork.primaryImagePath) && totalImages < MAX_ARTWORK_GALLERY_IMAGE_COUNT

  useEffect(() => {
    if (uploadState.status !== "success") {
      return
    }

    uploadFormRef.current?.reset()
    router.refresh()
  }, [router, uploadState.status])

  function runAction(action: () => Promise<ArtworkImageActionState>) {
    startTransition(async () => {
      try {
        const nextState = await action()
        setActionState(nextState)
        if (nextState.status === "success") {
          router.refresh()
        }
      } catch {
        setActionState({
          message: "The image could not be updated. Please try again.",
          status: "error",
        })
      }
    })
  }

  return (
    <AdminSectionCard
      title="Gallery Images"
      description={`The cover image remains first. Add up to ${MAX_ARTWORK_GALLERY_IMAGE_COUNT - 1} supporting images, one at a time.`}
    >
      <div className="flex flex-col gap-5">
        {uploadState.status !== "idle" ? (
          <FeedbackBanner
            tone={uploadState.status === "success" ? "success" : "error"}
          >
            {uploadState.message}
          </FeedbackBanner>
        ) : null}
        {actionState.status !== "idle" ? (
          <FeedbackBanner
            tone={
              actionState.status === "success"
                ? "success"
                : actionState.status === "warning"
                  ? "warning"
                  : "error"
            }
          >
            {actionState.message}
          </FeedbackBanner>
        ) : null}

        <div className="border border-border-subtle bg-muted/35 p-4">
          <p className="text-sm font-extrabold">
            {totalImages} of {MAX_ARTWORK_GALLERY_IMAGE_COUNT} gallery images
          </p>
          <p className="mt-1 text-xs leading-[1.125rem] text-muted-foreground">
            {artwork.primaryImagePath
              ? "The cover image is managed in the artwork image section above."
              : "Add a cover image above before publishing this artwork."}
          </p>
        </div>

        {canAddImage ? (
          <form
            ref={uploadFormRef}
            action={formAction}
            className="grid gap-4 border border-border-subtle p-4 md:grid-cols-[1fr_1fr_auto] md:items-end"
          >
            <Field>
              <FieldLabel htmlFor="galleryImage">Add image</FieldLabel>
              <Input
                id="galleryImage"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
              />
              <FieldDescription>JPEG, PNG or WebP; 8 MB maximum.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="galleryImageAlt">Image alt text</FieldLabel>
              <Input id="galleryImageAlt" name="altText" maxLength={180} />
              <FieldDescription>Describe what this view adds.</FieldDescription>
            </Field>
            <Button type="submit" disabled={uploadPending} aria-busy={uploadPending}>
              {uploadPending ? "Uploading…" : "Add Image"}
            </Button>
          </form>
        ) : (
          <p className="border border-border-subtle bg-muted/35 p-4 text-sm text-muted-foreground">
            {artwork.primaryImagePath
              ? `The gallery has reached its ${MAX_ARTWORK_GALLERY_IMAGE_COUNT}-image limit.`
              : "Add a primary cover image before adding gallery images."}
          </p>
        )}

        {artwork.additionalImages.length ? (
          <ol className="grid gap-4">
            {artwork.additionalImages.map((image, index) => (
              <li
                key={image.id}
                className="grid gap-4 border border-border-subtle p-4 sm:grid-cols-[10rem_1fr]"
              >
                <MediaImage
                  src={image.imageUrl ?? undefined}
                  alt={image.altText ?? "Artwork gallery image"}
                  sizes="160px"
                  className="aspect-square border border-border-subtle"
                  fallback="Gallery image unavailable"
                />
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold">Gallery image {index + 1}</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={index === 0 || isPending}
                        aria-label={`Move gallery image ${index + 1} earlier`}
                        onClick={() =>
                          runAction(() =>
                            moveArtworkImageAction(artwork.id, image.id, "up")
                          )
                        }
                      >
                        <ArrowUpIcon aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={index === artwork.additionalImages.length - 1 || isPending}
                        aria-label={`Move gallery image ${index + 1} later`}
                        onClick={() =>
                          runAction(() =>
                            moveArtworkImageAction(artwork.id, image.id, "down")
                          )
                        }
                      >
                        <ArrowDownIcon aria-hidden="true" />
                      </Button>
                      <ConfirmationDialog
                        destructive
                        title={`Remove gallery image ${index + 1}?`}
                        description="This removes the image from the gallery permanently."
                        confirmLabel="Remove Image"
                        disabled={isPending}
                        onConfirm={() =>
                          runAction(() => removeArtworkImageAction(artwork.id, image.id))
                        }
                        trigger={
                          <Button
                            type="button"
                            variant="destructive-outline"
                            size="icon-sm"
                            disabled={isPending}
                            aria-label={`Remove gallery image ${index + 1}`}
                          >
                            <Trash2Icon aria-hidden="true" />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                  <form
                    className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    action={(formData) =>
                      runAction(() =>
                        updateArtworkImageAltAction(artwork.id, image.id, formData)
                      )
                    }
                  >
                    <Field className="flex-1">
                      <FieldLabel htmlFor={`gallery-alt-${image.id}`}>Alt text</FieldLabel>
                      <Input
                        id={`gallery-alt-${image.id}`}
                        name="altText"
                        maxLength={180}
                        defaultValue={image.altText ?? ""}
                      />
                    </Field>
                    <Button type="submit" variant="outline" disabled={isPending}>
                      Save description
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">No additional gallery images yet.</p>
        )}
      </div>
    </AdminSectionCard>
  )
}

export { ArtworkImageManager }
