import type {
  AvailabilityStatus,
  ImageAsset,
  IsoDateTime,
  PriceDisplay,
  PublicationStatus,
} from "@/types/content";
import type {
  AdditionalStructuredQuestions,
  ChoiceQuestionConfiguration,
  DeliveryPickupConfiguration,
  RequestMode,
  SelectableOption,
  TimingConfiguration,
} from "@/types/request";

export const ARTWORK_CATEGORY_SLUGS = [
  "paintings",
  "pencil-portraits",
  "framed-custom-artwork",
  "digital-artwork",
] as const;

export type ArtworkCategorySlug = (typeof ARTWORK_CATEGORY_SLUGS)[number];

export type ArtworkRequestMode = Extract<
  RequestMode,
  "exact-piece" | "something-similar" | "custom-commission"
>;

export type UnavailableRequestBehaviour =
  | "disable-all"
  | "allow-configured-non-exact-modes";

export interface ArtworkDimensions {
  label: string;
  width?: number;
  height?: number;
  unit?: "cm" | "in";
}

export interface ArtworkRequestConfiguration {
  acceptsRequests: boolean;
  allowedModes: readonly ArtworkRequestMode[];
  availableSizes: readonly SelectableOption[];
  framing: ChoiceQuestionConfiguration;
  quantity: ChoiceQuestionConfiguration;
  unavailableBehaviour: UnavailableRequestBehaviour;
  deliveryPickupOverride?: DeliveryPickupConfiguration;
  timingOverride?: TimingConfiguration;
  additionalQuestions: AdditionalStructuredQuestions;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  description: string;
  primaryImage: ImageAsset;
  additionalImages: readonly ImageAsset[];
  categorySlug: ArtworkCategorySlug;
  dimensions?: ArtworkDimensions;
  medium?: string;
  format?: string;
  availability: AvailabilityStatus;
  price?: PriceDisplay;
  featured: boolean;
  displayOrder: number;
  publicationStatus: PublicationStatus;
  requestConfiguration: ArtworkRequestConfiguration;
  publishedAt?: IsoDateTime;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}
