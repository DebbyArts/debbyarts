"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Container } from "@/components/ui/container"
import { EmptyState } from "@/components/ui/states/empty"
import { MediaImage } from "@/components/ui/media-image"
import { SelectableOption } from "@/components/ui/selectable-option"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { submitEnquiryAction } from "@/features/enquiries/actions"
import {
  getEnabledDetailFields,
  getRequestSteps,
  type RequestStep,
} from "@/features/enquiries/request-context"
import type {
  EnquiryActionState,
  RequestDraft,
  RequestField,
  RequestFieldErrors,
  RequestItem,
  RequestKindValue,
  RequestPageData,
} from "@/features/enquiries/request-types"
import {
  normalizeEmail,
  normalizePhone,
  normalizePreferredDate,
} from "@/features/enquiries/request-validation"
import { DESIGN_READINESS_OPTIONS } from "@/features/services/design-readiness"
import { cn } from "@/lib/utils"

const INITIAL_ACTION_STATE: EnquiryActionState = { status: "idle" }

const STEP_LABELS: Record<RequestStep, string> = {
  interest: "Interest",
  item: "Specific item",
  details: "Request details",
  delivery: "Delivery & timing",
  contact: "Contact",
}

const STEP_TITLES: Record<RequestStep, string> = {
  interest: "WHAT ARE YOU INTERESTED IN?",
  item: "WHICH ITEM DO YOU NEED?",
  details: "TELL US THE USEFUL DETAILS",
  delivery: "WHERE AND WHEN?",
  contact: "HOW SHOULD WE REACH YOU?",
}

const EMPTY_DETAIL_DRAFT = {
  quantity: "",
  sizeFormat: "",
  framing: "",
  designReadiness: "",
  colour: "",
  material: "",
  finish: "",
} as const

const REQUEST_STAGE_VARIANTS = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 18 }),
  centre: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -14 }),
}

const COMPACT_PROGRESS_VARIANTS = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 8 }),
  centre: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -6 }),
}

function initialDraft(data: RequestPageData): RequestDraft {
  return {
    broadRequest: data.initialContext.mode === "art-commission",
    contextMode: data.initialContext.mode,
    requestKind: data.initialContext.kind ?? "",
    itemSlug: data.initialContext.itemSlug ?? "",
    ...EMPTY_DETAIL_DRAFT,
    fulfilmentMethod: "",
    location: "",
    preferredDate: "",
    customerName: "",
    phoneWhatsApp: "",
    email: "",
    customerNote: "",
  }
}

function requestItem(data: RequestPageData, draft: RequestDraft): RequestItem | null {
  if (draft.broadRequest || !draft.itemSlug) return null

  if (draft.requestKind === "ARTWORK") {
    const artwork = data.artworks.find((item) => item.slug === draft.itemSlug)
    return artwork ? { kind: "ARTWORK", record: artwork } : null
  }

  if (draft.requestKind === "SERVICE") {
    const service = data.services.find((item) => item.slug === draft.itemSlug)
    return service ? { kind: "SERVICE", record: service } : null
  }

  return null
}

function validateClientStep(
  step: RequestStep,
  draft: RequestDraft,
  item: RequestItem | null
) {
  const errors: RequestFieldErrors = {}

  if (step === "interest" && !draft.requestKind) {
    errors.requestKind = "Choose Art & Gallery or Services."
  }

  if (step === "item" && !draft.broadRequest && !draft.itemSlug) {
    errors.itemSlug = "Choose a specific item or the broad request option."
  }

  if (step === "details") {
    const fields = getEnabledDetailFields(item)

    if (fields.includes("quantity")) {
      const quantity = Number(draft.quantity)
      if (!Number.isInteger(quantity) || quantity <= 0) {
        errors.quantity = "Enter a positive whole-number quantity."
      }
    }
    if (fields.includes("sizeFormat") && !draft.sizeFormat) {
      errors.sizeFormat = "Choose a size or format."
    }
    if (fields.includes("framing") && !draft.framing) {
      errors.framing = "Choose a framing option."
    }
    if (fields.includes("designReadiness") && !draft.designReadiness) {
      errors.designReadiness = "Choose your design readiness."
    }
    if (draft.broadRequest && draft.customerNote.length > 2_000) {
      errors.customerNote = "Keep the note under 2,000 characters."
    }
  }

  if (step === "delivery") {
    if (!draft.fulfilmentMethod) {
      errors.fulfilmentMethod = "Choose delivery or pickup."
    }
    if (draft.fulfilmentMethod === "DELIVERY" && !draft.location.trim()) {
      errors.location = "Enter the delivery area, city, or state."
    }
    if (
      normalizePreferredDate(draft.preferredDate, new Date()) === undefined
    ) {
      errors.preferredDate = "Choose today or a future date."
    }
  }

  if (step === "contact") {
    if (!draft.customerName.trim()) errors.customerName = "Enter your name."
    if (!normalizePhone(draft.phoneWhatsApp)) {
      errors.phoneWhatsApp = "Enter a valid phone or WhatsApp number."
    }
    if (normalizeEmail(draft.email) === undefined) {
      errors.email = "Enter a valid email address."
    }
    if (!draft.broadRequest && draft.customerNote.length > 2_000) {
      errors.customerNote = "Keep the note under 2,000 characters."
    }
  }

  return errors
}

function stepForServerErrors(
  fieldErrors: RequestFieldErrors,
  draft: RequestDraft
): RequestStep {
  const fields = Object.keys(fieldErrors) as RequestField[]

  if (draft.broadRequest && fields.includes("customerNote")) {
    return "details"
  }

  if (
    fields.some((field) =>
      [
        "quantity",
        "sizeFormat",
        "framing",
        "designReadiness",
        "colour",
        "material",
        "finish",
      ].includes(field)
    )
  ) {
    return "details"
  }

  if (
    fields.some((field) =>
      ["fulfilmentMethod", "location", "preferredDate"].includes(field)
    )
  ) {
    return "delivery"
  }

  if (fields.includes("requestKind")) return "interest"
  if (fields.includes("itemSlug")) return "item"
  return "contact"
}

function FieldShell({
  children,
  description,
  error,
  id,
  label,
  required,
}: {
  children: React.ReactNode
  description?: string
  error?: string
  id: string
  label: string
  required?: boolean
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {children}
      {description ? (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      ) : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </Field>
  )
}

function ChoiceField({
  error,
  label,
  onChange,
  options,
  required,
  value,
}: {
  error?: string
  label: string
  onChange: (value: string) => void
  options: readonly { description?: string; label: string; value: string }[]
  required?: boolean
  value: string
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-")

  return (
    <FieldSet className="gap-3">
      <FieldLegend className="type-label">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </FieldLegend>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="sm:grid-cols-2"
      >
        {options.map((option) => (
          <SelectableOption
            key={option.value}
            value={option.value}
            title={option.label}
            description={option.description}
          />
        ))}
      </RadioGroup>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </FieldSet>
  )
}

function Progress({
  currentStep,
  contextual,
  direction,
}: {
  currentStep: RequestStep
  contextual: boolean
  direction: 1 | -1
}) {
  const reduceMotion = useReducedMotion()
  const steps = getRequestSteps(contextual)
  const currentIndex = steps.indexOf(currentStep)
  const currentLabel = STEP_LABELS[currentStep]
  const progress = (currentIndex + 1) / steps.length

  return (
    <section className="border-y-2 border-border bg-card" aria-label="Request progress">
      <Container className="flex flex-col gap-6 py-8 lg:gap-7 lg:py-12">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="type-label text-primary">Your request</p>
            <h2 className="type-h3">A FEW QUICK STEPS</h2>
          </div>
          <p className="max-w-sm text-sm leading-[1.375rem] text-muted-foreground">
            Your answers stay here as you move backward and forward.
          </p>
        </div>
        <div className="lg:hidden">
          <div className="mb-3 flex min-h-7 items-baseline justify-between gap-4">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={COMPACT_PROGRESS_VARIANTS}
                initial="enter"
                animate="centre"
                exit="exit"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                }
                className="flex min-w-0 items-baseline gap-2"
              >
                <span className="shrink-0 font-display text-lg text-primary">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-sm font-extrabold text-foreground">
                  {currentLabel}
                </span>
              </motion.div>
            </AnimatePresence>
            <span aria-hidden="true" className="shrink-0 type-label text-muted-foreground">
              {currentIndex + 1} / {steps.length}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Request progress"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={currentIndex + 1}
            aria-valuetext={`Step ${currentIndex + 1} of ${steps.length}: ${currentLabel}`}
            className="h-2 overflow-hidden bg-muted"
          >
            <motion.div
              aria-hidden="true"
              className="h-full origin-left bg-primary"
              initial={false}
              animate={{ scaleX: progress }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </div>
        </div>
        <ol
          className={cn(
            "hidden gap-2 lg:grid",
            contextual ? "lg:grid-cols-3" : "lg:grid-cols-5"
          )}
        >
          {steps.map((step, index) => {
            const active = step === currentStep
            const reached = index <= currentIndex

            return (
              <li key={step} aria-current={active ? "step" : undefined}>
                <motion.div
                  aria-hidden="true"
                  className="mb-2 h-2 origin-left bg-primary"
                  initial={false}
                  animate={{ scaleX: reached ? 1 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-display text-lg text-muted-foreground",
                      active && "text-primary"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-4 text-muted-foreground",
                      active && "font-extrabold text-foreground"
                    )}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
        <p className="sr-only" aria-live="polite">
          Current step: {currentLabel}, {currentIndex + 1} of {steps.length}.
        </p>
      </Container>
    </section>
  )
}

function ContextSummary({
  draft,
  item,
  onChange,
}: {
  draft: RequestDraft
  item: RequestItem | null
  onChange: () => void
}) {
  const title = item
    ? item.kind === "ARTWORK"
      ? item.record.title
      : item.record.name
    : draft.contextMode === "art-commission"
      ? "Custom art commission"
      : draft.requestKind === "ARTWORK"
        ? "Custom artwork request"
        : "Custom service request"
  const label = item
    ? item.kind === "ARTWORK"
      ? "Selected artwork"
      : item.record.groupLabel
    : "Broad request"
  const media = item?.record.imageSrc

  return (
    <section className="border-b-2 border-border bg-card">
      <Container className="flex items-center gap-4 py-5 lg:gap-6 lg:py-7">
        {item ? (
          <MediaImage
            alt={item.record.imageAlt}
            src={media ?? undefined}
            sizes="104px"
            unoptimized={media?.startsWith("https://")}
            className="size-24 shrink-0 border-2 border-border lg:h-28 lg:w-36"
            fallback="Selected item"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center border-2 border-border bg-warning font-display text-2xl">
            {draft.requestKind === "ARTWORK" ? "A" : "S"}
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="type-label text-primary">{label}</p>
          <h2 className="type-h3 break-words">{title.toUpperCase()}</h2>
          <Button type="button" variant="link" className="mt-2" onClick={onChange}>
            Change selection
          </Button>
        </div>
      </Container>
    </section>
  )
}

function ResultCard({
  action,
  description,
  label,
  marker,
  title,
  tone,
}: {
  action: React.ReactNode
  description: string
  label: string
  marker: React.ReactNode
  title: string
  tone: "primary" | "error" | "warning"
}) {
  return (
    <motion.div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mx-auto flex w-full max-w-[35.625rem] flex-col gap-5 border-t-8 bg-background p-5 sm:gap-6 sm:p-8",
        tone === "primary" && "border-primary",
        tone === "warning" && "border-warning",
        tone === "error" && "border-destructive bg-card"
      )}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <p
        className={cn(
          "type-label",
          tone === "primary" && "text-primary",
          tone === "warning" && "text-warning-surface-foreground",
          tone === "error" && "text-destructive"
        )}
      >
        {label}
      </p>
      {marker}
      <div className="flex flex-col gap-2">
        <h2 className="type-h3">{title}</h2>
        <p className="text-sm leading-[1.375rem] text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </motion.div>
  )
}

function SubmittingState() {
  return (
    <ResultCard
      tone="warning"
      label="Submitting · Please wait"
      title="SAVING YOUR REQUEST…"
      description="Please keep this page open while we save your request. WhatsApp will remain unavailable until the save succeeds."
      marker={
        <span
          aria-hidden="true"
          className="size-16 animate-spin rounded-full border-8 border-disabled border-t-primary motion-reduce:animate-none"
        />
      }
      action={
        <Button disabled aria-busy="true" className="w-full">
          Submitting…
        </Button>
      }
    />
  )
}

function SuccessState({ state }: { state: Extract<EnquiryActionState, { status: "success" }> }) {
  return (
    <ResultCard
      tone="primary"
      label="Thank you · Request received"
      title="REQUEST RECEIVED"
      description="Your enquiry is saved with Debby Art & Prints, even if you choose not to continue to WhatsApp."
      marker={
        <span className="flex size-16 items-center justify-center bg-primary font-display text-xl text-primary-foreground">
          OK
        </span>
      }
      action={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-label text-muted-foreground">Enquiry reference</p>
            <p className="font-display text-xl">{state.reference}</p>
            {state.duplicate ? (
              <p className="mt-1 text-xs text-muted-foreground">
                We found the request from your recent retry and reused its reference.
              </p>
            ) : null}
          </div>
          <Button asChild>
            <a href={state.whatsappUrl} target="_blank" rel="noreferrer">
              Continue on WhatsApp →
            </a>
          </Button>
        </div>
      }
    />
  )
}

function RequestStage({
  currentStep,
  data,
  draft,
  errors,
  item,
  onBack,
  onChange,
  onNext,
  pending,
  showBack,
}: {
  currentStep: RequestStep
  data: RequestPageData
  draft: RequestDraft
  errors: RequestFieldErrors
  item: RequestItem | null
  onBack: () => void
  onChange: (field: RequestField, value: string | boolean) => void
  onNext: () => void
  pending: boolean
  showBack: boolean
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = window.setTimeout(
      () => headingRef.current?.focus(),
      reduceMotion ? 0 : 230
    )
    return () => window.clearTimeout(timer)
  }, [currentStep, reduceMotion])

  const candidates =
    draft.requestKind === "ARTWORK" ? data.artworks : data.services
  const detailFields = getEnabledDetailFields(item)

  return (
    <div className="flex min-w-0 flex-col gap-7 lg:gap-8">
      <div className="flex flex-col gap-2">
        <p className="type-label text-primary">{STEP_LABELS[currentStep]}</p>
        <h2 ref={headingRef} tabIndex={-1} className="type-h2 outline-none">
          {STEP_TITLES[currentStep]}
        </h2>
      </div>

      {currentStep === "interest" ? (
        <FieldSet>
          <FieldLegend className="sr-only">Choose an area of interest</FieldLegend>
          <RadioGroup
            value={draft.requestKind}
            onValueChange={(value) => onChange("requestKind", value)}
            aria-required="true"
            aria-invalid={Boolean(errors.requestKind)}
            aria-describedby={errors.requestKind ? "request-kind-error" : undefined}
            className="lg:grid-cols-2"
          >
            <SelectableOption
              value="ARTWORK"
              title="Art & Gallery"
              description="Ask about an existing piece or commission something personal."
              className="min-h-40 p-6 lg:min-h-56"
            />
            <SelectableOption
              value="SERVICE"
              title="Services"
              description="Plan personalised products, print materials, plaques or branding work."
              className="min-h-40 p-6 lg:min-h-56"
            />
          </RadioGroup>
          {errors.requestKind ? (
            <FieldError id="request-kind-error">{errors.requestKind}</FieldError>
          ) : null}
        </FieldSet>
      ) : null}

      {currentStep === "item" ? (
        <FieldSet>
          <FieldLegend className="sr-only">Choose a specific item</FieldLegend>
          {candidates.length === 0 ? (
            <EmptyState
              visual="01"
              title={`No published ${draft.requestKind === "ARTWORK" ? "artwork" : "services"} yet`}
              description="You can still continue with a broad request and describe what you need."
            />
          ) : null}
          <RadioGroup
            value={draft.broadRequest ? "__broad__" : draft.itemSlug}
            onValueChange={(value) => {
              if (value === "__broad__") {
                onChange("broadRequest", true)
                onChange("itemSlug", "")
              } else {
                onChange("broadRequest", false)
                onChange("itemSlug", value)
              }
            }}
            aria-invalid={Boolean(errors.itemSlug)}
            aria-required="true"
            aria-describedby={errors.itemSlug ? "request-item-error" : undefined}
          >
            {candidates.map((candidate) => {
              const artwork = "title" in candidate
              const title = artwork ? candidate.title : candidate.name
              const description = artwork
                ? candidate.categoryLabel
                : candidate.groupLabel

              return (
                <SelectableOption
                  key={candidate.slug}
                  value={candidate.slug}
                  title={title}
                  description={description}
                  media={
                    <MediaImage
                      alt={candidate.imageAlt}
                      src={candidate.imageSrc ?? undefined}
                      sizes="56px"
                      unoptimized={candidate.imageSrc?.startsWith("https://")}
                      className="size-full"
                      fallback={artwork ? "Artwork" : "Service"}
                    />
                  }
                />
              )
            })}
            <SelectableOption
              value="__broad__"
              title={
                draft.requestKind === "ARTWORK"
                  ? "Something else / custom artwork"
                  : "Something else / custom service"
              }
              description="Continue without linking a catalogue item."
            />
          </RadioGroup>
          {errors.itemSlug ? (
            <FieldError id="request-item-error">{errors.itemSlug}</FieldError>
          ) : null}
        </FieldSet>
      ) : null}

      {currentStep === "details" ? (
        <FieldGroup>
          {detailFields.includes("quantity") ? (
            <FieldShell id="request-quantity" label="Quantity required" required error={errors.quantity}>
              <Input
                id="request-quantity"
                type="number"
                min={1}
                step={1}
                required
                inputMode="numeric"
                value={draft.quantity}
                onChange={(event) => onChange("quantity", event.target.value)}
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? "request-quantity-error" : undefined}
              />
            </FieldShell>
          ) : null}

          {detailFields.includes("sizeFormat") ? (
            <ChoiceField
              label={item?.kind === "ARTWORK" ? "Available size" : "Size / format"}
              required
              value={draft.sizeFormat}
              onChange={(value) => onChange("sizeFormat", value)}
              error={errors.sizeFormat}
              options={
                item?.kind === "ARTWORK"
                  ? item.record.availableSizes.map((value) => ({ value, label: value }))
                  : item?.kind === "SERVICE"
                    ? item.record.sizeFormatOptions.map((value) => ({ value, label: value }))
                    : []
              }
            />
          ) : null}

          {detailFields.includes("framing") && item?.kind === "ARTWORK" ? (
            <ChoiceField
              label="Framing"
              required
              value={draft.framing}
              onChange={(value) => onChange("framing", value)}
              error={errors.framing}
              options={item.record.framingOptions.map((value) => ({ value, label: value }))}
            />
          ) : null}

          {detailFields.includes("designReadiness") ? (
            <ChoiceField
              label="Design readiness"
              required
              value={draft.designReadiness}
              onChange={(value) => onChange("designReadiness", value)}
              error={errors.designReadiness}
              options={DESIGN_READINESS_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          ) : null}

          {(["colour", "material", "finish"] as const).map((field) =>
            detailFields.includes(field) ? (
              <FieldShell
                key={field}
                id={`request-${field}`}
                label={`${field[0].toUpperCase()}${field.slice(1)} (optional)`}
                error={errors[field]}
              >
                <Input
                  id={`request-${field}`}
                  value={draft[field]}
                  onChange={(event) => onChange(field, event.target.value)}
                  aria-invalid={Boolean(errors[field])}
                  aria-describedby={errors[field] ? `request-${field}-error` : undefined}
                />
              </FieldShell>
            ) : null
          )}

          {detailFields.length === 0 ? (
            <FieldShell
              id="request-broad-note"
              label="Tell us what you have in mind (optional)"
              description="A short note is enough. We will continue the details on WhatsApp after your enquiry is saved."
              error={errors.customerNote}
            >
              <Textarea
                id="request-broad-note"
                maxLength={2_000}
                value={draft.customerNote}
                onChange={(event) => onChange("customerNote", event.target.value)}
                aria-invalid={Boolean(errors.customerNote)}
                aria-describedby={
                  errors.customerNote
                    ? "request-broad-note-description request-broad-note-error"
                    : "request-broad-note-description"
                }
              />
            </FieldShell>
          ) : null}
        </FieldGroup>
      ) : null}

      {currentStep === "delivery" ? (
        <FieldGroup>
          <ChoiceField
            label="Delivery or pickup"
            required
            value={draft.fulfilmentMethod}
            onChange={(value) => onChange("fulfilmentMethod", value)}
            error={errors.fulfilmentMethod}
            options={[
              { value: "DELIVERY", label: "Delivery" },
              { value: "PICKUP", label: "Pickup" },
            ]}
          />
          <FieldShell
            id="request-location"
            label={draft.fulfilmentMethod === "DELIVERY" ? "Delivery location" : "Location (optional)"}
            required={draft.fulfilmentMethod === "DELIVERY"}
            description="Area, city, or state is enough."
            error={errors.location}
          >
            <Input
              id="request-location"
              value={draft.location}
              onChange={(event) => onChange("location", event.target.value)}
              required={draft.fulfilmentMethod === "DELIVERY"}
              placeholder="Area / city / state"
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "request-location-error" : "request-location-description"}
            />
          </FieldShell>
          <FieldShell
            id="request-preferred-date"
            label="Preferred date (optional)"
            description="Add a date only if timing matters."
            error={errors.preferredDate}
          >
            <Input
              id="request-preferred-date"
              type="date"
              value={draft.preferredDate}
              onChange={(event) => onChange("preferredDate", event.target.value)}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={errors.preferredDate ? "request-preferred-date-error" : "request-preferred-date-description"}
            />
          </FieldShell>
        </FieldGroup>
      ) : null}

      {currentStep === "contact" ? (
        <FieldGroup>
          <FieldShell id="request-name" label="Name" required error={errors.customerName}>
            <Input
              id="request-name"
              autoComplete="name"
              required
              value={draft.customerName}
              onChange={(event) => onChange("customerName", event.target.value)}
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={errors.customerName ? "request-name-error" : undefined}
            />
          </FieldShell>
          <FieldShell
            id="request-phone"
            label="Phone / WhatsApp"
            required
            description="Include your country code if the number is outside Nigeria."
            error={errors.phoneWhatsApp}
          >
            <Input
              id="request-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={draft.phoneWhatsApp}
              onChange={(event) => onChange("phoneWhatsApp", event.target.value)}
              aria-invalid={Boolean(errors.phoneWhatsApp)}
              aria-describedby={errors.phoneWhatsApp ? "request-phone-error" : "request-phone-description"}
            />
          </FieldShell>
          <FieldShell id="request-email" label="Email (optional)" error={errors.email}>
            <Input
              id="request-email"
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={(event) => onChange("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "request-email-error" : undefined}
            />
          </FieldShell>
          {detailFields.length > 0 ? (
            <FieldShell id="request-note" label="Anything else? (optional)" error={errors.customerNote}>
              <Textarea
                id="request-note"
                maxLength={2_000}
                value={draft.customerNote}
                onChange={(event) => onChange("customerNote", event.target.value)}
                aria-invalid={Boolean(errors.customerNote)}
                aria-describedby={errors.customerNote ? "request-note-error" : undefined}
              />
            </FieldShell>
          ) : null}
        </FieldGroup>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
        {showBack ? (
          <Button type="button" variant="link" onClick={onBack} disabled={pending}>
            ← Back
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}
        {currentStep === "contact" ? (
          <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
            Submit request
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={onNext}>
            Next →
          </Button>
        )}
      </div>
    </div>
  )
}

function RequestFlow({ data }: { data: RequestPageData }) {
  const initiallyContextual = data.initialContext.mode !== "default"
  const [draft, setDraft] = useState(() => initialDraft(data))
  const [contextual, setContextual] = useState(initiallyContextual)
  const [currentStep, setCurrentStep] = useState<RequestStep>(
    initiallyContextual ? "details" : "interest"
  )
  const [errors, setErrors] = useState<RequestFieldErrors>({})
  const [direction, setDirection] = useState<1 | -1>(1)
  const reduceMotion = useReducedMotion()
  const [reviewingAfterError, setReviewingAfterError] = useState(false)
  const item = useMemo(() => requestItem(data, draft), [data, draft])
  const steps = getRequestSteps(contextual)

  async function runSubmission(
    previousState: EnquiryActionState,
    formData: FormData
  ) {
    const nextState = await submitEnquiryAction(previousState, formData)

    if (nextState.status === "validation") {
      setErrors(nextState.fieldErrors)
      setReviewingAfterError(true)
      const step = stepForServerErrors(nextState.fieldErrors, draft)
      if (steps.includes(step)) {
        setDirection(steps.indexOf(step) < steps.indexOf(currentStep) ? -1 : 1)
        setCurrentStep(step)
      }
    } else if (
      nextState.status === "error" ||
      nextState.status === "context-error"
    ) {
      setReviewingAfterError(false)
    }

    return nextState
  }

  const [actionState, formAction, pending] = useActionState(
    runSubmission,
    INITIAL_ACTION_STATE
  )

  function updateDraft(field: RequestField, value: string | boolean) {
    setReviewingAfterError(true)
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      return next
    })

    setDraft((current) => {
      if (field === "requestKind") {
        return {
          ...current,
          ...EMPTY_DETAIL_DRAFT,
          requestKind: value as RequestKindValue,
          itemSlug: "",
          broadRequest: false,
          contextMode: "default",
        }
      }

      if (field === "itemSlug" || field === "broadRequest") {
        return { ...current, ...EMPTY_DETAIL_DRAFT, [field]: value }
      }

      return { ...current, [field]: value }
    })
  }

  function nextStep() {
    const nextErrors = validateClientStep(currentStep, draft, item)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const index = steps.indexOf(currentStep)
    const next = steps[index + 1]
    if (next) {
      setDirection(1)
      setCurrentStep(next)
    }
  }

  function previousStep() {
    const index = steps.indexOf(currentStep)
    const previous = steps[index - 1]
    if (previous) {
      setDirection(-1)
      setCurrentStep(previous)
    }
  }

  function changeSelection() {
    setContextual(false)
    setDirection(-1)
    setCurrentStep("interest")
    setErrors({})
    setReviewingAfterError(true)
    setDraft((current) => ({
      ...initialDraft({
        ...data,
        initialContext: { mode: "default", kind: null, itemSlug: null },
      }),
      fulfilmentMethod: current.fulfilmentMethod,
      location: current.location,
      preferredDate: current.preferredDate,
      customerName: current.customerName,
      phoneWhatsApp: current.phoneWhatsApp,
      email: current.email,
      customerNote: current.customerNote,
    }))
  }

  function submitClientValidation(event: React.FormEvent<HTMLFormElement>) {
    const nextErrors = validateClientStep("contact", draft, item)
    if (Object.keys(nextErrors).length === 0) return

    event.preventDefault()
    setErrors(nextErrors)
  }

  const showRetry =
    actionState.status === "error" && !reviewingAfterError && !pending
  const showContextError =
    actionState.status === "context-error" && !reviewingAfterError && !pending

  return (
    <>
      <Progress
        currentStep={currentStep}
        contextual={contextual}
        direction={direction}
      />
      {contextual ? (
        <ContextSummary draft={draft} item={item} onChange={changeSelection} />
      ) : null}
      <section className="bg-background">
        <Container className="py-12 lg:py-[4.5rem]">
          <form action={formAction} onSubmit={submitClientValidation} noValidate>
            {Object.entries(draft).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={String(value)} />
            ))}

            {pending ? <SubmittingState /> : null}
            {!pending && actionState.status === "success" ? (
              <SuccessState state={actionState} />
            ) : null}
            {showRetry ? (
              <ResultCard
                tone="error"
                label="Try again · Request not submitted"
                title="WE COULDN’T SUBMIT YOUR REQUEST"
                description={actionState.message}
                marker={
                  <span className="flex size-16 items-center justify-center border-[3px] border-destructive font-display text-2xl text-destructive">
                    !
                  </span>
                }
                action={
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="type-label text-destructive">Your answers are safe</p>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setReviewingAfterError(true)}>
                        Review answers
                      </Button>
                      <Button type="submit" variant="secondary">Try again</Button>
                    </div>
                  </div>
                }
              />
            ) : null}
            {showContextError ? (
              <ResultCard
                tone="error"
                label="Selection changed"
                title="THAT ITEM IS NO LONGER AVAILABLE"
                description={actionState.message}
                marker={
                  <span className="flex size-16 items-center justify-center border-[3px] border-destructive font-display text-2xl text-destructive">
                    !
                  </span>
                }
                action={
                  <Button type="button" variant="secondary" onClick={changeSelection}>
                    Choose another item
                  </Button>
                }
              />
            ) : null}
            {!pending &&
            actionState.status !== "success" &&
            !showRetry &&
            !showContextError ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,48.75rem)_minmax(18rem,26.25rem)] lg:gap-20">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={REQUEST_STAGE_VARIANTS}
                    initial="enter"
                    animate="centre"
                    exit="exit"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <RequestStage
                      currentStep={currentStep}
                      data={data}
                      draft={draft}
                      errors={errors}
                      item={item}
                      onBack={previousStep}
                      onChange={updateDraft}
                      onNext={nextStep}
                      pending={pending}
                      showBack={steps.indexOf(currentStep) > 0}
                    />
                  </motion.div>
                </AnimatePresence>
                <aside className="hidden h-fit border-2 border-border bg-muted p-6 lg:block lg:p-8">
                  <span aria-hidden="true" className="mb-5 block h-2 w-14 bg-info" />
                  <h3 className="type-h3 mb-4">WHAT HAPPENS NEXT?</h3>
                  <p className="text-sm leading-[1.375rem]">
                    We validate and save your enquiry first. You will then receive a stable reference and an optional WhatsApp continuation.
                  </p>
                  <p className="mt-4 text-xs leading-[1.125rem] text-muted-foreground">
                    A failed save keeps you here with every answer preserved. We never send your contact details in the URL.
                  </p>
                </aside>
              </div>
            ) : null}
          </form>
        </Container>
      </section>
    </>
  )
}

export { RequestFlow }
