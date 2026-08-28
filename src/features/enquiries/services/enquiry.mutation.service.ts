import "server-only"

import type { EnquiryStatus } from "@/db/generated/prisma/enums"
import { EnquiryFieldError } from "@/features/enquiries/errors/enquiry-field.error"
import { RequestContextUnavailableError } from "@/features/enquiries/errors/request-context-unavailable.error"
import {
  mapToRequestArtworkOption,
  mapToRequestServiceOption,
} from "@/features/enquiries/mappers/request-catalogue.mapper"
import {
  createEnquiryRecord,
  updateEnquiryStatus as updateEnquiryStatusRecord,
} from "@/features/enquiries/repositories/enquiry.mutation.repository"
import {
  findRecentDuplicate,
  findPublishedRequestArtwork,
  findPublishedRequestService,
} from "@/features/enquiries/repositories/enquiry.query.repository"
import type {
  EnquiryPersistenceInput,
  NormalizedEnquiryInput,
  ParsedEnquiryInput,
  RequestArtworkOption,
  RequestAuthority,
  RequestServiceOption,
} from "@/features/enquiries/types"
import { generateEnquiryReference } from "@/features/enquiries/utils/enquiry-reference.utils"
import { broadSnapshot } from "@/features/enquiries/utils/request-context.utils"
import {
  buildWhatsAppSummary,
  buildWhatsAppUrl,
} from "@/features/enquiries/utils/whatsapp.utils"
import { validateRequestAuthority } from "@/features/enquiries/validators/request-authority.validator"

type EnquiryWriteRecord = EnquiryPersistenceInput

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

async function resolveAuthority(
  enquiry: ParsedEnquiryInput,
  dependencies: CreateEnquiryDependencies
): Promise<RequestAuthority> {
  if (enquiry.broadRequest) {
    if (enquiry.itemSlug) {
      throw new EnquiryFieldError({
        itemSlug: "Choose either a specific item or a broad request.",
      })
    }

    const snapshot = broadSnapshot(
      enquiry.requestKind,
      enquiry.contextMode === "art-commission"
    )

    return {
      kind: enquiry.requestKind,
      id: null,
      name: snapshot.name,
      slug: snapshot.slug,
      record: null,
    }
  }

  if (!enquiry.itemSlug) {
    throw new EnquiryFieldError({
      itemSlug: "Choose a specific item or a broad request.",
    })
  }

  if (enquiry.requestKind === "ARTWORK") {
    const artwork = await dependencies.findArtwork(enquiry.itemSlug)
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

  const service = await dependencies.findService(enquiry.itemSlug)
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
  input: ParsedEnquiryInput,
  websiteOrigin: string | null,
  dependencies: CreateEnquiryDependencies
): Promise<CreateEnquiryResult> {
  const authority = await resolveAuthority(input, dependencies)
  const now = dependencies.now?.() ?? new Date()
  const enquiry = validateRequestAuthority(input, authority)
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

async function submitEnquiry(
  input: ParsedEnquiryInput,
  websiteOrigin: string | null
) {
  return createEnquiry(input, websiteOrigin, {
    findArtwork: async (slug) => {
      const artwork = await findPublishedRequestArtwork(slug)
      return artwork ? mapToRequestArtworkOption(artwork) : null
    },
    findService: async (slug) => {
      const service = await findPublishedRequestService(slug)
      return service ? mapToRequestServiceOption(service) : null
    },
    findDuplicate: findRecentDuplicate,
    create: createEnquiryRecord,
  })
}

async function updateEnquiryStatus(enquiryId: string, status: EnquiryStatus) {
  return updateEnquiryStatusRecord(enquiryId, status)
}

export {
  createEnquiry,
  submitEnquiry,
  updateEnquiryStatus,
  type CreateEnquiryDependencies,
  type CreateEnquiryResult,
  type EnquiryWriteRecord,
}
