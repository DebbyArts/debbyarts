import type { IsoDate } from "@/types/content";

export const MAX_ADDITIONAL_STRUCTURED_QUESTIONS = 5;

export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];

export type RequestType = "artwork" | "service" | "custom";

export type RequestMode =
  | "exact-piece"
  | "something-similar"
  | "custom-commission"
  | "service-request"
  | "general-request";

export type EnquiryStatus = "new" | "contacted" | "resolved";

export type StructuredQuestionKind =
  | "single-select"
  | "multi-select"
  | "boolean";

export type DeliveryMethod = "delivery" | "pickup";

export type RequestSourceKind =
  | "direct"
  | "navigation"
  | "home"
  | "artwork"
  | "gallery"
  | "service"
  | "services";

export interface SelectableOption<TValue extends string = string> {
  value: TValue;
  label: string;
  description?: string;
  displayOrder: number;
}

export type ChoiceQuestionConfiguration<TValue extends string = string> =
  | {
      enabled: false;
    }
  | {
      enabled: true;
      required: boolean;
      options: NonEmptyReadonlyArray<SelectableOption<TValue>>;
    };

interface StructuredQuestionBase {
  key: string;
  label: string;
  helpText?: string;
  required: boolean;
}

export type StructuredQuestion = StructuredQuestionBase &
  (
    | {
        kind: "single-select";
        options: NonEmptyReadonlyArray<SelectableOption>;
      }
    | {
        kind: "multi-select";
        options: NonEmptyReadonlyArray<SelectableOption>;
        maxSelections?: number;
      }
    | {
        kind: "boolean";
        options: readonly [
          SelectableOption<"yes">,
          SelectableOption<"no">,
        ];
      }
  );

export type AdditionalStructuredQuestions =
  | readonly []
  | readonly [StructuredQuestion]
  | readonly [StructuredQuestion, StructuredQuestion]
  | readonly [StructuredQuestion, StructuredQuestion, StructuredQuestion]
  | readonly [
      StructuredQuestion,
      StructuredQuestion,
      StructuredQuestion,
      StructuredQuestion,
    ]
  | readonly [
      StructuredQuestion,
      StructuredQuestion,
      StructuredQuestion,
      StructuredQuestion,
      StructuredQuestion,
    ];

export interface DeliveryPickupConfiguration {
  required: boolean;
  methods: NonEmptyReadonlyArray<SelectableOption<DeliveryMethod>>;
}

export interface TimingConfiguration {
  requiredByEnabled: boolean;
  eventDateEnabled: boolean;
  timingOptions: readonly SelectableOption[];
}

export type DateQuestionConfiguration =
  | {
      enabled: false;
    }
  | {
      enabled: true;
      required: boolean;
    };

export interface RequestSourceContext {
  kind: RequestSourceKind;
  originatingPath: string;
  ctaLabel?: string;
  artworkSlug?: string;
  serviceSlug?: string;
  serviceGroupSlug?: string;
}

export interface StructuredAnswer {
  questionKey: string;
  questionLabel: string;
  values: NonEmptyReadonlyArray<string>;
  selectedLabels: NonEmptyReadonlyArray<string>;
}

export interface DeliveryTimingAnswers {
  fulfilmentMethod?: DeliveryMethod;
  locationGroup?: string;
  locationDetail?: string;
  timingOption?: string;
  requiredBy?: IsoDate;
  eventDate?: IsoDate;
}

export interface ContactInformation {
  name: string;
  phoneWhatsApp: string;
  email?: string;
}
