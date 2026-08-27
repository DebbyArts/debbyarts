"use client"

import Link from "next/link"
import { useActionState, useState } from "react"

import { AdminSectionCard } from "@/components/shared/admin/admin-page"
import { FeedbackBanner } from "@/components/ui/feedback-banner"
import { Button } from "@/components/ui/button"
import { OptionListInput } from "@/components/ui/OptionListInput"
import { saveArtworkOptionsAction } from "@/features/artwork/actions/save-artwork-options.admin.action"
import { INITIAL_ARTWORK_ACTION_STATE } from "@/features/artwork/constants"
import type { ArtworkOptionsValue } from "@/features/artwork/types"

function ArtworkOptionsForm({ artwork }: { artwork: ArtworkOptionsValue }) {
  const [state, action, pending] = useActionState(
    saveArtworkOptionsAction.bind(null, artwork.id),
    INITIAL_ARTWORK_ACTION_STATE
  )
  const [framingEnabled, setFramingEnabled] = useState(artwork.framingEnabled)

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
        <OptionListInput
          id="availableSizes"
          name="availableSizes"
          label="Size values"
          defaultValue={artwork.availableSizes}
          placeholder="e.g. A3"
          description="Add each size in the order customers should see it."
        />
      </AdminSectionCard>
      <div className="grid gap-5 md:grid-cols-2">
        <AdminSectionCard title="Framing" description="Offer framing choices?">
          <label className="flex min-h-11 items-center gap-3 text-sm font-extrabold">
            <input
              type="checkbox"
              name="framingEnabled"
              checked={framingEnabled}
              onChange={(event) => setFramingEnabled(event.target.checked)}
              className="size-6 accent-primary"
            />
            Framing enabled
          </label>
          <OptionListInput
            id="framingOptions"
            name="framingOptions"
            label="Framing options"
            defaultValue={artwork.framingOptions}
            placeholder="e.g. Black frame"
            disabled={!framingEnabled}
            description="Add each framing choice in the order customers should see it."
          />
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
