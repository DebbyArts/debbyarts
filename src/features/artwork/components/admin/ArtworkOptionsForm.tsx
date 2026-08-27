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
  const [availableSizesEnabled, setAvailableSizesEnabled] = useState(
    artwork.availableSizes.length > 0
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
      <AdminSectionCard title="Available Sizes" description="Offer size choices?">
        <input
          aria-label="Offer size choices?"
          type="checkbox"
          name="availableSizesEnabled"
          checked={availableSizesEnabled}
          onChange={(event) => setAvailableSizesEnabled(event.target.checked)}
          className="size-6 accent-primary"
        />
        <OptionListInput
          id="availableSizes"
          name="availableSizes"
          label="Size values"
          defaultValue={artwork.availableSizes}
          placeholder="e.g. A3"
          disabled={!availableSizesEnabled}
          description="Add each size in the order customers should see it."
        />
      </AdminSectionCard>
      <div className="grid gap-5 md:grid-cols-2">
        <AdminSectionCard title="Framing" description="Offer framing choices?">
          <input
            aria-label="Offer framing choices?"
            type="checkbox"
            name="framingEnabled"
            checked={framingEnabled}
            onChange={(event) => setFramingEnabled(event.target.checked)}
            className="size-6 accent-primary"
          />
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
        <AdminSectionCard
          title="Ask for Quantity?"
          description="Customers enter one positive number; there are no preset quantity choices."
        >
          <input
            aria-label="Ask for Quantity?"
            type="checkbox"
            name="askQuantity"
            defaultChecked={artwork.askQuantity}
            className="size-6 accent-primary"
          />
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
