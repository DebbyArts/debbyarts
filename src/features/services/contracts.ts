import type {
  ImageAsset,
  IsoDateTime,
  PriceDisplay,
  PublicationStatus,
} from "@/types/content";
import type {
  AdditionalStructuredQuestions,
  ChoiceQuestionConfiguration,
  DateQuestionConfiguration,
  DeliveryPickupConfiguration,
} from "@/types/request";

export const SERVICE_GROUP_SLUGS = [
  "personalised-products",
  "print-event-materials",
  "branding-signage",
] as const;

export type ServiceGroupSlug = (typeof SERVICE_GROUP_SLUGS)[number];

export type DesignReadiness =
  | "have-design"
  | "need-design-help"
  | "not-sure";

export interface ServiceRequestConfiguration {
  acceptsRequests: boolean;
  quantity: ChoiceQuestionConfiguration;
  sizeOrFormat: ChoiceQuestionConfiguration;
  designReadiness: ChoiceQuestionConfiguration<DesignReadiness>;
  colours: ChoiceQuestionConfiguration;
  finishes: ChoiceQuestionConfiguration;
  materials: ChoiceQuestionConfiguration;
  deadline: DateQuestionConfiguration;
  eventDate: DateQuestionConfiguration;
  deliveryPickupOverride?: DeliveryPickupConfiguration;
  additionalQuestions: AdditionalStructuredQuestions;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  groupSlug: ServiceGroupSlug;
  description: string;
  primaryImage: ImageAsset;
  additionalImages: readonly ImageAsset[];
  supportingInformation?: string;
  price?: PriceDisplay;
  featured: boolean;
  displayOrder: number;
  publicationStatus: PublicationStatus;
  requestConfiguration: ServiceRequestConfiguration;
  publishedAt?: IsoDateTime;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}
