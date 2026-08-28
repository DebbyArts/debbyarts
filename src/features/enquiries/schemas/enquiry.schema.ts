import { z } from "zod"

import {
  EnquiryStatus,
  FulfilmentMethod,
  RequestKind,
} from "@/db/generated/prisma/enums"
import type { ParsedEnquiryInput } from "@/features/enquiries/types"

function compactText(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

const normalizedTextSchema = z.string().transform(compactText)

const customerNameSchema = normalizedTextSchema.pipe(
  z
    .string()
    .min(1, { error: "Enter your name." })
    .max(120, { error: "Enter your name." })
)

const enquiryPhoneSchema = z.string().transform((value, context) => {
  const trimmed = value.trim()

  if (!trimmed || /[A-Za-z]/.test(trimmed)) {
    context.addIssue({
      code: "custom",
      message: "Enter a valid phone or WhatsApp number.",
    })
    return z.NEVER
  }

  let digits = trimmed.replace(/\D/g, "")

  if (digits.startsWith("00")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `234${digits.slice(1)}`
  }

  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0")) {
    context.addIssue({
      code: "custom",
      message: "Enter a valid phone or WhatsApp number.",
    })
    return z.NEVER
  }

  return `+${digits}`
})

const enquiryEmailSchema = z.string().transform((value, context) => {
  const email = value.trim().toLowerCase()
  if (!email) return null

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    context.addIssue({
      code: "custom",
      message: "Enter a valid email address.",
    })
    return z.NEVER
  }

  return email
})

function createEnquiryPreferredDateSchema(now: Date) {
  return z.string().transform((value, context) => {
    const preferredDate = value.trim()
    if (!preferredDate) return null

    const date = new Date(`${preferredDate}T00:00:00.000Z`)
    const today = now.toISOString().slice(0, 10)
    const valid =
      /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) &&
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === preferredDate &&
      preferredDate >= today

    if (!valid) {
      context.addIssue({
        code: "custom",
        message: "Choose today or a future date.",
      })
      return z.NEVER
    }

    return date
  })
}

const enquiryQuantitySchema = z.string().transform((value, context) => {
  const quantityValue = value.trim()
  if (!quantityValue) return null

  const quantity = Number(quantityValue)
  if (
    !/^\d+$/.test(quantityValue) ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0 ||
    quantity > 1_000_000
  ) {
    context.addIssue({
      code: "custom",
      message: "Enter a positive whole-number quantity.",
    })
    return z.NEVER
  }

  return quantity
})

function createEnquirySubmissionSchema(now = new Date()) {
  return z
    .object({
      broadRequest: z.boolean(),
      colour: normalizedTextSchema,
      contextMode: z.enum([
        "default",
        "art-commission",
        "artwork",
        "service",
      ]),
      customerName: customerNameSchema,
      customerNote: normalizedTextSchema,
      designReadiness: normalizedTextSchema,
      email: enquiryEmailSchema,
      finish: normalizedTextSchema,
      framing: normalizedTextSchema,
      fulfilmentMethod: z.enum(FulfilmentMethod, {
        error: "Choose delivery or pickup.",
      }),
      itemSlug: normalizedTextSchema,
      location: normalizedTextSchema,
      material: normalizedTextSchema,
      phoneWhatsApp: enquiryPhoneSchema,
      preferredDate: createEnquiryPreferredDateSchema(now),
      quantity: enquiryQuantitySchema,
      requestKind: z.enum(RequestKind, {
        error: "Choose Art & Gallery or Services.",
      }),
      sizeFormat: normalizedTextSchema,
    })
    .superRefine((enquiry, context) => {
      if (enquiry.customerNote.length > 2_000) {
        context.addIssue({
          code: "custom",
          message: "Keep the note under 2,000 characters.",
          path: ["customerNote"],
        })
      }

      if (
        enquiry.fulfilmentMethod === FulfilmentMethod.DELIVERY &&
        (!enquiry.location || enquiry.location.length > 250)
      ) {
        context.addIssue({
          code: "custom",
          message: "Enter the delivery area, city, or state.",
          path: ["location"],
        })
      } else if (enquiry.location.length > 250) {
        context.addIssue({
          code: "custom",
          message: "Keep the location under 250 characters.",
          path: ["location"],
        })
      }
    })
    .transform(
      (enquiry): ParsedEnquiryInput => ({
        ...enquiry,
        customerNote: enquiry.customerNote || null,
        location: enquiry.location || null,
      })
    )
}

const enquiryStatusSchema = z.enum(EnquiryStatus, {
  error: "Invalid enquiry status.",
})

export {
  createEnquiryPreferredDateSchema,
  createEnquirySubmissionSchema,
  enquiryEmailSchema,
  enquiryPhoneSchema,
  enquiryStatusSchema,
}
