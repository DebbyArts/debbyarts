"use client"

import Link from "next/link"
import { useActionState, useState } from "react"

import { AdminSectionCard } from "@/components/shared/admin/admin-page"
import { FeedbackBanner } from "@/components/ui/feedback-banner"
import { Button } from "@/components/ui/button"
import { OptionListInput } from "@/components/ui/OptionListInput"
import { saveServiceOptionsAction } from "@/features/services/actions/save-service-options.admin.action"
import {
  INITIAL_SERVICE_ACTION_STATE,
  SERVICE_REQUEST_OPTION_QUESTIONS,
} from "@/features/services/constants"
import type { ServiceOptionsValue } from "@/features/services/types"

function ServiceOptionsForm({ service }: { service: ServiceOptionsValue }) {
  const [state, action, pending] = useActionState(
    saveServiceOptionsAction.bind(null, service.id),
    INITIAL_SERVICE_ACTION_STATE
  )
  const [askSizeFormat, setAskSizeFormat] = useState(service.askSizeFormat)

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
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-[1.125rem]">
          {SERVICE_REQUEST_OPTION_QUESTIONS.slice(0, 3).map(([name, label, description]) => (
            <AdminSectionCard key={name} title={label} description={description}>
              <input
                aria-label={label}
                type="checkbox"
                name={name}
                defaultChecked={service[name]}
                className="size-6 accent-primary"
              />
            </AdminSectionCard>
          ))}
        </div>
        <div className="flex flex-col gap-[1.125rem]">
          <AdminSectionCard
            title="Ask for Size / Format?"
            description="Customers choose from the enabled text values."
          >
            <input
              aria-label="Ask for Size / Format?"
              type="checkbox"
              name="askSizeFormat"
              checked={askSizeFormat}
              onChange={(event) => setAskSizeFormat(event.target.checked)}
              className="size-6 accent-primary"
            />
            <OptionListInput
              id="sizeFormatOptions"
              name="sizeFormatOptions"
              label="Size / format options"
              defaultValue={service.sizeFormatOptions}
              placeholder="e.g. A4"
              disabled={!askSizeFormat}
              description="Add each choice in the order customers should see it."
            />
          </AdminSectionCard>
          {SERVICE_REQUEST_OPTION_QUESTIONS.slice(3).map(([name, label, description]) => (
            <AdminSectionCard key={name} title={label} description={description}>
              <input
                aria-label={label}
                type="checkbox"
                name={name}
                defaultChecked={service[name]}
                className="size-6 accent-primary"
              />
            </AdminSectionCard>
          ))}
        </div>
      </div>
      <p className="border-l-4 border-info bg-muted p-4 text-sm leading-6">
        These are the six fixed V1 questions. The owner chooses which apply;
        this screen does not build arbitrary forms.
      </p>
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href={`/admin/services/${service.id}`}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Saving…" : "Save Options"}
        </Button>
      </div>
    </form>
  )
}

export { ServiceOptionsForm }
