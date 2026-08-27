"use client"

import Link from "next/link"
import { useActionState } from "react"

import { AdminSectionCard } from "@/components/shared/admin/admin-page"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { FeedbackBanner } from "@/components/ui/feedback-banner"
import { MediaImage } from "@/components/ui/media-image"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { deleteServiceAction } from "@/features/services/actions/delete-service.admin.action"
import { saveServiceAction } from "@/features/services/actions/save-service.admin.action"
import { unpublishServiceAction } from "@/features/services/actions/unpublish-service.admin.action"
import {
  INITIAL_SERVICE_ACTION_STATE,
  SERVICE_ADMIN_SELECT_CLASS,
} from "@/features/services/constants"
import type { ServiceEditorValue } from "@/features/services/types"

function ServiceEditor({ service }: { service: ServiceEditorValue | null }) {
  const [state, action, pending] = useActionState(
    saveServiceAction.bind(null, service?.id ?? null),
    INITIAL_SERVICE_ACTION_STATE
  )
  const completedCreate = !service && state.status === "success"

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-6">
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
          description="The core service details shown publicly. The URL slug is derived from the name."
        >
          <div className="grid gap-[1.125rem] sm:grid-cols-[1.6fr_1fr]">
            <Field>
              <FieldLabel htmlFor="name" required>
                Name
              </FieldLabel>
              <Input
                id="name"
                name="name"
                required
                maxLength={120}
                defaultValue={service?.name ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="group" required>
                Service group
              </FieldLabel>
              <select
                id="group"
                name="group"
                required
                className={SERVICE_ADMIN_SELECT_CLASS}
                defaultValue={service?.group ?? "PERSONALISED_PRODUCTS"}
              >
                <option value="PERSONALISED_PRODUCTS">
                  Personalised products
                </option>
                <option value="PRINT_EVENT_MATERIALS">
                  Print &amp; event materials
                </option>
                <option value="BRANDING_SIGNAGE">Branding &amp; signage</option>
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
              defaultValue={service?.description ?? ""}
            />
          </Field>
        </AdminSectionCard>

        <AdminSectionCard
          title="Service Image"
          description="Printed products, clothing, plaques, branding and production imagery belong here."
        >
          <div className="grid gap-5 md:grid-cols-[minmax(15rem,24rem)_1fr]">
            <MediaImage
              src={service?.imageUrl ?? undefined}
              alt={service?.primaryImageAlt ?? ""}
              sizes="(min-width: 768px) 384px, 100vw"
              className="aspect-[13/6] border border-border"
              fallback="No primary image"
            />
            <div className="flex flex-col gap-4 border border-border-subtle bg-background p-4">
              <Field>
                <FieldLabel htmlFor="primaryImage">
                  {service?.primaryImagePath ? "Replace image" : "Primary image"}
                </FieldLabel>
                <Input
                  id="primaryImage"
                  name="primaryImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                />
                <FieldDescription>
                  JPEG, PNG or WebP; 8 MB maximum; 320–8,000px per side.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="primaryImageAlt">Image alt text</FieldLabel>
                <Input
                  id="primaryImageAlt"
                  name="primaryImageAlt"
                  maxLength={180}
                  defaultValue={service?.primaryImageAlt ?? ""}
                />
              </Field>
              {service?.primaryImagePath ? (
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

        <AdminSectionCard title="Public Pricing">
          <div className="grid gap-[1.125rem] sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="pricingMode">Pricing mode</FieldLabel>
              <select
                id="pricingMode"
                name="pricingMode"
                className={SERVICE_ADMIN_SELECT_CLASS}
                defaultValue={service?.pricingMode ?? "NONE"}
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
                defaultValue={service?.priceAmount ?? ""}
              />
            </Field>
          </div>
        </AdminSectionCard>

        <div className="grid gap-5 md:grid-cols-2">
          <AdminSectionCard title="Public Settings">
            <label className="flex min-h-12 items-start justify-between gap-4 border-b border-border-subtle py-3">
              <span className="flex flex-col gap-1">
                <span className="text-sm font-extrabold">Published</span>
                <span className="text-xs text-muted-foreground">
                  Visible publicly when required content and image are complete.
                </span>
              </span>
              <input
                type="checkbox"
                name="published"
                defaultChecked={service?.published}
                className="mt-1 size-6 accent-primary"
              />
            </label>
            <Field>
              <FieldLabel htmlFor="displayOrder">Display order</FieldLabel>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min={0}
                max={9999}
                required
                defaultValue={service?.displayOrder ?? 0}
              />
            </Field>
          </AdminSectionCard>
          <AdminSectionCard
            title="Request Options"
            description="Choose from the six fixed V1 questions. This is not a form builder."
            className="bg-muted"
          >
            {service ? (
              <Button variant="outline" asChild>
                <Link href={`/admin/services/${service.id}/options`}>
                  Edit Request Options
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Save the service first, then configure request options.
              </p>
            )}
          </AdminSectionCard>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button variant="outline" asChild>
            <Link href="/admin/services">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={pending || completedCreate}
            aria-busy={pending}
          >
            {pending
              ? "Saving…"
              : service
                ? "Save Changes"
                : completedCreate
                  ? "Service Created"
                  : "Create Service"}
          </Button>
        </div>
      </form>

      {service ? (
        <section className="flex flex-col gap-4 border border-warning-border bg-warning-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold">Record actions</h2>
            <p className="text-xs text-muted-foreground">
              Unpublish keeps the record. Delete is permanent.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {service.published ? (
              <form action={unpublishServiceAction.bind(null, service.id)}>
                <Button type="submit" variant="outline" size="sm">
                  Unpublish
                </Button>
              </form>
            ) : null}
            <ConfirmationDialog
              destructive
              title="Delete this service?"
              description="The database record is deleted permanently. Existing enquiries keep their saved snapshot."
              confirmLabel="Delete Service"
              action={deleteServiceAction.bind(null, service.id)}
              trigger={
                <Button type="button" variant="destructive-outline" size="sm">
                  Delete Service
                </Button>
              }
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export { ServiceEditor }
