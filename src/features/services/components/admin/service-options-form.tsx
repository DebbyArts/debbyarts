"use client"

import Link from "next/link"
import { useActionState } from "react"

import { AdminSectionCard } from "@/components/shared/admin-page"
import { FeedbackBanner } from "@/components/shared/feedback-banner"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  saveServiceOptionsAction,
} from "@/features/services/admin/actions"
import { INITIAL_SERVICE_ACTION_STATE } from "@/features/services/admin/state"

type ServiceOptionsValue = {
  askColour: boolean
  askDesignReadiness: boolean
  askFinish: boolean
  askMaterial: boolean
  askQuantity: boolean
  askSizeFormat: boolean
  id: string
  sizeFormatOptions: string[]
}

const QUESTIONS = [
  ["askQuantity", "Ask for Quantity?", "Customer enters one positive number."],
  [
    "askDesignReadiness",
    "Ask about Design Readiness?",
    "Uses the fixed public choices: finished design, needs help, or not sure.",
  ],
  ["askColour", "Ask for Colour?", "Collects the customer’s colour preference."],
  ["askMaterial", "Ask for Material?", "Collects the customer’s material preference."],
  ["askFinish", "Ask for Finish?", "Collects the customer’s finish preference."],
] as const

function ServiceOptionsForm({ service }: { service: ServiceOptionsValue }) {
  const [state, action, pending] = useActionState(
    saveServiceOptionsAction.bind(null, service.id),
    INITIAL_SERVICE_ACTION_STATE
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
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-[1.125rem]">
          {QUESTIONS.slice(0, 3).map(([name, label, description]) => (
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
              defaultChecked={service.askSizeFormat}
              className="size-6 accent-primary"
            />
            <Field>
              <FieldLabel htmlFor="sizeFormatOptions">
                Size / format options
              </FieldLabel>
              <Textarea
                id="sizeFormatOptions"
                name="sizeFormatOptions"
                defaultValue={service.sizeFormatOptions.join("\n")}
                placeholder={"A4\nBusiness Card\nLandscape"}
              />
              <FieldDescription>One value per line.</FieldDescription>
            </Field>
          </AdminSectionCard>
          {QUESTIONS.slice(3).map(([name, label, description]) => (
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
