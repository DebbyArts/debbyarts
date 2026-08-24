import { broadSnapshot } from "@/features/enquiries/request-context"
import { generateEnquiryReference } from "@/features/enquiries/enquiry-reference"
import type {
  RequestArtworkOption,
  RequestDraft,
  RequestFieldErrors,
  RequestServiceOption,
} from "@/features/enquiries/request-types"
import {
  RequestValidationError,
  validateEnquiryInput,
  type NormalizedEnquiryInput,
  type RequestAuthority,
} from "@/features/enquiries/request-validation"
import {
  buildWhatsAppSummary,
  buildWhatsAppUrl,
} from "@/features/enquiries/whatsapp"

type EnquiryWriteRecord = NormalizedEnquiryInput & {
  reference: string
  whatsappSummary: string
}

type CreateEnquiryDependencies = {
  create: (record: EnquiryWriteRecord) => Promise<void>
  findArtwork: (slug: string) => Promise<RequestArtworkOption | null>
  findDuplicate: (
    enquiry: NormalizedEnquiryInput,
    createdAfter: Date
  ) => Promise<{ reference: string } | null>
  findService: (slug: string) => Promise<RequestServiceOption | null>
  generateReference?: (now: Date) => string
  now?: () => Date
}

type CreateEnquiryResult = {
  duplicate: boolean
  reference: string
  whatsappSummary: string
  whatsappUrl: string
}

class RequestContextUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RequestContextUnavailableError"
  }
}

function identityValidationError(message: string) {
  return new RequestValidationError({ itemSlug: message } as RequestFieldErrors)
}

async function resolveAuthority(
  draft: RequestDraft,
  dependencies: CreateEnquiryDependencies
): Promise<RequestAuthority> {
  if (draft.requestKind !== "ARTWORK" && draft.requestKind !== "SERVICE") {
    throw new RequestValidationError({
      requestKind: "Choose Art & Gallery or Services.",
    })
  }

  const itemSlug = draft.itemSlug.trim()

  if (draft.broadRequest) {
    if (itemSlug) {
      throw identityValidationError("Choose either a specific item or a broad request.")
    }

    const snapshot = broadSnapshot(
      draft.requestKind,
      draft.contextMode === "art-commission"
    )

    return {
      kind: draft.requestKind,
      id: null,
      name: snapshot.name,
      slug: snapshot.slug,
      record: null,
    }
  }

  if (!itemSlug) {
    throw identityValidationError("Choose a specific item or a broad request.")
  }

  if (draft.requestKind === "ARTWORK") {
    const artwork = await dependencies.findArtwork(itemSlug)
    if (!artwork) {
      throw new RequestContextUnavailableError(
        "That artwork is no longer published. Your answers are still here; choose another artwork to continue."
      )
    }

    return {
      kind: "ARTWORK",
      id: artwork.id,
      name: artwork.title,
      slug: artwork.slug,
      record: artwork,
    }
  }

  const service = await dependencies.findService(itemSlug)
  if (!service) {
    throw new RequestContextUnavailableError(
      "That service is no longer published. Your answers are still here; choose another service to continue."
    )
  }

  return {
    kind: "SERVICE",
    id: service.id,
    name: service.name,
    slug: service.slug,
    record: service,
  }
}

function isReferenceConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  )
}

async function createEnquiry(
  draft: RequestDraft,
  websiteOrigin: string | null,
  dependencies: CreateEnquiryDependencies
): Promise<CreateEnquiryResult> {
  const authority = await resolveAuthority(draft, dependencies)
  const now = dependencies.now?.() ?? new Date()
  const enquiry = validateEnquiryInput(draft, authority, now)
  const duplicate = await dependencies.findDuplicate(
    enquiry,
    new Date(now.getTime() - 10 * 60 * 1_000)
  )

  if (duplicate) {
    const whatsappSummary = buildWhatsAppSummary(
      enquiry,
      duplicate.reference,
      websiteOrigin
    )

    return {
      duplicate: true,
      reference: duplicate.reference,
      whatsappSummary,
      whatsappUrl: buildWhatsAppUrl(whatsappSummary),
    }
  }

  const makeReference =
    dependencies.generateReference ?? (() => generateEnquiryReference())

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = makeReference(now)
    const whatsappSummary = buildWhatsAppSummary(
      enquiry,
      reference,
      websiteOrigin
    )

    try {
      await dependencies.create({ ...enquiry, reference, whatsappSummary })
      return {
        duplicate: false,
        reference,
        whatsappSummary,
        whatsappUrl: buildWhatsAppUrl(whatsappSummary),
      }
    } catch (error) {
      if (!isReferenceConflict(error) || attempt === 2) throw error
    }
  }

  throw new Error("Unable to allocate an enquiry reference.")
}

export {
  RequestContextUnavailableError,
  createEnquiry,
  resolveAuthority,
  type CreateEnquiryDependencies,
  type CreateEnquiryResult,
  type EnquiryWriteRecord,
}
