"use client"

import Link from "next/link"
import { useActionState } from "react"

import { AdminSectionCard } from "@/components/shared/admin/admin-page"
import { FeedbackBanner } from "@/components/ui/feedback-banner"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  saveArtworkOptionsAction,
} from "@/features/artwork/admin/actions"
import { INITIAL_ARTWORK_ACTION_STATE } from "@/features/artwork/admin/state"

type ArtworkOptionsValue = {
  askQuantity: boolean
  availableSizes: string[]
  framingEnabled: boolean
  framingOptions: string[]
  id: string
}

function ArtworkOptionsForm({ artwork }: { artwork: ArtworkOptionsValue }) {
  const [state, action, pending] = useActionState(
    saveArtworkOptionsAction.bind(null, artwork.id),
    INITIAL_ARTWORK_ACTION_STATE
  )

  return (
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
        title="Available Sizes"
        description="Customers only see the values listed here. Leave empty when size is fixed or discussed later."
      >
        <Field>
          <FieldLabel htmlFor="availableSizes">Size values</FieldLabel>
          <Textarea
            id="availableSizes"
            name="availableSizes"
            defaultValue={artwork.availableSizes.join("\n")}
            placeholder={"A3\n60 × 90 cm\nExtra Large"}
          />
          <FieldDescription>One value per line.</FieldDescription>
        </Field>
      </AdminSectionCard>
      <div className="grid gap-5 md:grid-cols-2">
        <AdminSectionCard title="Framing" description="Offer framing choices?">
          <label className="flex min-h-11 items-center gap-3 text-sm font-extrabold">
            <input
              type="checkbox"
              name="framingEnabled"
              defaultChecked={artwork.framingEnabled}
              className="size-6 accent-primary"
            />
            Framing enabled
          </label>
          <Field>
            <FieldLabel htmlFor="framingOptions">Framing options</FieldLabel>
            <Textarea
              id="framingOptions"
              name="framingOptions"
              defaultValue={artwork.framingOptions.join("\n")}
              placeholder={"Black frame\nNatural wood frame\nUnframed"}
            />
            <FieldDescription>One value per line.</FieldDescription>
          </Field>
        </AdminSectionCard>
        <AdminSectionCard title="Quantity">
          <label className="flex min-h-11 items-start gap-3 text-sm font-extrabold">
            <input
              type="checkbox"
              name="askQuantity"
              defaultChecked={artwork.askQuantity}
              className="mt-1 size-6 accent-primary"
            />
            <span>
              Ask for quantity?
              <span className="mt-1 block text-xs leading-5 font-normal text-muted-foreground">
                The public request form asks for one positive number. There are
                no preset quantity choices.
              </span>
            </span>
          </label>
        </AdminSectionCard>
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href={`/admin/artwork/${artwork.id}`}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Saving…" : "Save Options"}
        </Button>
      </div>
    </form>
  )
}

export { ArtworkOptionsForm }
