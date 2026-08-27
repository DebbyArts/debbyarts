import type {
  ArtworkActionState,
  ArtworkAvailability,
  ArtworkCategory,
} from "@/features/artwork/types"

const ARTWORK_CATEGORY_LABELS = {
  PAINTING: "Paintings",
  PENCIL_PORTRAIT: "Pencil Portraits",
  FRAMED_CUSTOM_ARTWORK: "Framed Artwork",
  DIGITAL_ARTWORK: "Digital Artwork",
} as const satisfies Record<ArtworkCategory, string>

const ARTWORK_CATEGORY_ITEM_LABELS = {
  PAINTING: "Painting",
  PENCIL_PORTRAIT: "Pencil Portrait",
  FRAMED_CUSTOM_ARTWORK: "Framed Artwork",
  DIGITAL_ARTWORK: "Digital Artwork",
} as const satisfies Record<ArtworkCategory, string>

const ARTWORK_CATEGORY_ORDER = Object.keys(
  ARTWORK_CATEGORY_LABELS
) as ArtworkCategory[]

const AVAILABILITY_LABELS = {
  AVAILABLE: "Available",
  MADE_TO_ORDER: "Made to order",
  SOLD: "Sold",
  UNAVAILABLE: "Unavailable",
} as const satisfies Record<ArtworkAvailability, string>

const ALL_ARTWORK = "ALL" as const
const COMMISSION_REQUEST_HREF = "/request?type=art-commission"
const MINIMUM_FILTERABLE_ARTWORK_COUNT = 4
const ARTWORK_REVALIDATION_PATHS = [
  "/admin/artwork",
  "/art",
  "/",
  "/request",
] as const
const INITIAL_ARTWORK_ACTION_STATE: ArtworkActionState = {
  message: "",
  status: "idle",
}
const ARTWORK_ADMIN_SELECT_CLASS =
  "h-12 w-full rounded-sm border border-input bg-card px-4 text-base focus-visible:border-info focus-visible:ring-[3px] focus-visible:ring-ring/70"

export {
  ALL_ARTWORK,
  ARTWORK_CATEGORY_ITEM_LABELS,
  ARTWORK_CATEGORY_LABELS,
  ARTWORK_CATEGORY_ORDER,
  ARTWORK_ADMIN_SELECT_CLASS,
  ARTWORK_REVALIDATION_PATHS,
  AVAILABILITY_LABELS,
  COMMISSION_REQUEST_HREF,
  INITIAL_ARTWORK_ACTION_STATE,
  MINIMUM_FILTERABLE_ARTWORK_COUNT,
}
