import type { IsoDateTime } from "@/types/content";
import type {
  ContactInformation,
  DeliveryTimingAnswers,
  EnquiryStatus,
  RequestMode,
  RequestSourceContext,
  RequestType,
  StructuredAnswer,
} from "@/types/request";

export interface LinkedArtworkSnapshot {
  id: string;
  slug: string;
  title: string;
}

export interface LinkedServiceSnapshot {
  id: string;
  slug: string;
  name: string;
}

export interface Enquiry {
  id: string;
  reference: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  requestType: RequestType;
  requestMode?: RequestMode;
  artwork?: LinkedArtworkSnapshot;
  service?: LinkedServiceSnapshot;
  structuredAnswers: readonly StructuredAnswer[];
  deliveryTiming: DeliveryTimingAnswers;
  contact: ContactInformation;
  customerNote?: string;
  source: RequestSourceContext;
  status: EnquiryStatus;
  whatsappSummary?: string;
  handoffInitiatedAt?: IsoDateTime;
}
