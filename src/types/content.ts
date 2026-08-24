export type IsoDateTime = string;
export type IsoDate = string;

export type PublicationStatus = "draft" | "published" | "archived";

export type AvailabilityStatus =
  | "available"
  | "made-to-order"
  | "sold"
  | "unavailable";

export interface ImageAsset {
  id: string;
  storageBucket: string;
  storagePath: string;
  altText: string;
  width: number;
  height: number;
  mimeType: string;
  byteSize: number;
}

export type PriceDisplay =
  | {
      kind: "fixed" | "starting-at";
      amountMinor: number;
      currency: "NGN";
      label?: string;
    }
  | {
      kind: "label";
      label: string;
    };
