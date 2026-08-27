type AssetClassification = {
  source: string
  curatedAs?: string
  role?: "cover" | "additional" | "brand"
  archiveReason?: string
}

// This intentionally records only filenames and curation decisions, never intake answers.
const seedAssetProvenance: AssetClassification[] = [
  { source: "18a22a96-e3af-4305-a0c7-bbaae071a444.jpeg", curatedAs: "images/brand/debby-art-prints-logo.webp", role: "brand" },
  { source: "296f86e0-f3c0-11ef-928e-cfd771b99f01.jpeg", curatedAs: "images/seed/artwork/leopard-painting/cover.webp", role: "cover" },
  { source: "2f35606c-3eeb-4b65-a971-05b333559625.jpeg", archiveReason: "customer handoff photograph; not a clear portfolio image" },
  { source: "42f8ac84-97ab-4772-b6b2-04cce2e3f9aa.jpeg", curatedAs: "images/seed/services/photo-gifts-and-pillows/cover.webp", role: "cover" },
  { source: "43339af9-4d07-402b-b018-bceb55ed2965.jpeg", curatedAs: "images/seed/services/award-plaques/cover.webp", role: "cover" },
  { source: "4d4767de-19dc-4e34-9f2b-d8242f27a293.jpeg", curatedAs: "images/seed/artwork/pencil-portrait-in-black-frame/cover.webp", role: "cover" },
  { source: "6134871e-ec1c-42ac-ba02-da4cd865b16b.jpeg", archiveReason: "promotional banner; not a portfolio or service-cover image" },
  { source: "6a7405df-2bbe-446f-b4ae-6b16267f8ceb.jpeg", archiveReason: "low-resolution portrait image" },
  { source: "7f57b7e1-2ba1-42c6-ac78-1a5d71efd461.jpeg", archiveReason: "customer handoff photograph; not a clear portfolio image" },
  { source: "8053554d-8d1f-4fc5-ad1c-cc617b6a475e.jpeg", archiveReason: "low-resolution portrait image" },
  { source: "9cb5dc93-bb05-4a07-a349-02313bf58bb5.jpeg", archiveReason: "low-resolution framed portrait image" },
  { source: "9e232c04-6672-4d34-8db4-fbc7a75544ec.jpeg", archiveReason: "low-resolution product image" },
  { source: "IMG_0216.jpeg", archiveReason: "single branded mug with third-party mark" },
  { source: "IMG_0242.jpeg", archiveReason: "recipient-specific award image" },
  { source: "IMG_0545.jpeg", archiveReason: "process photograph with customer present" },
  { source: "IMG_0671.png", archiveReason: "mobile screenshot rather than a portfolio image" },
  { source: "IMG_0912.jpeg", archiveReason: "recipient-specific award image" },
  { source: "IMG_1073.jpeg", curatedAs: "images/seed/artwork/family-portrait-painting/cover.webp", role: "cover" },
  { source: "IMG_1150.jpeg", archiveReason: "process photograph" },
  { source: "IMG_3546.jpeg", curatedAs: "images/seed/artwork/leopard-painting/additional-02.webp", role: "additional" },
  { source: "IMG_3631.jpeg", curatedAs: "images/seed/artwork/leopard-painting/additional-01.webp", role: "additional" },
  { source: "IMG_3655.jpeg", curatedAs: "images/seed/artwork/framed-red-umbrella-art-print/cover.webp", role: "cover" },
  { source: "IMG_3661 (1).jpeg", archiveReason: "framed quotation image; not selected for portfolio curation" },
  { source: "IMG_3661.jpeg", curatedAs: "images/seed/artwork/eagle-painting/cover.webp", role: "cover" },
  { source: "IMG_3941.jpeg", curatedAs: "images/seed/artwork/framed-guitarist-art-print/cover.webp", role: "cover" },
  { source: "IMG_3992.jpeg", curatedAs: "images/seed/artwork/framed-flute-art-print/cover.webp", role: "cover" },
  { source: "IMG_3994.jpeg", curatedAs: "images/seed/artwork/framed-figure-at-sunset/cover.webp", role: "cover" },
  { source: "IMG_3997.jpeg", curatedAs: "images/seed/artwork/framed-woman-and-bird-art-print/cover.webp", role: "cover" },
  { source: "IMG_4416.jpeg", archiveReason: "in-progress portrait" },
  { source: "IMG_5055.jpeg", curatedAs: "images/seed/services/screen-printing/cover.webp", role: "cover" },
  { source: "IMG_5100.jpeg", curatedAs: "images/seed/services/branded-products/cover.webp", role: "cover" },
  { source: "IMG_5219.jpeg", archiveReason: "duplicate branded-product view" },
  { source: "IMG_5394.jpeg", archiveReason: "process photograph" },
  { source: "IMG_5598.jpeg", archiveReason: "studio/process photograph" },
  { source: "IMG_5735.jpeg", curatedAs: "images/seed/services/customised-t-shirts/cover.webp", role: "cover" },
  { source: "IMG_5773.jpeg", archiveReason: "studio/process photograph" },
  { source: "IMG_5788.jpeg", archiveReason: "ambiguous figure painting; not selected for public seed" },
  { source: "IMG_6645.jpeg", archiveReason: "branded-product image without a clear service placement" },
  { source: "IMG_7037.jpeg", curatedAs: "images/seed/artwork/running-horses-painting/cover.webp", role: "cover" },
  { source: "IMG_7831.jpeg", archiveReason: "single branded cleaning-product image" },
  { source: "IMG_9246.jpeg", curatedAs: "images/seed/artwork/portrait-in-yellow-headwrap/cover.webp", role: "cover" },
  { source: "IMG_9269.jpeg", archiveReason: "single trophy image" },
  { source: "IMG_9712.jpeg", archiveReason: "duplicate award-plaque view" },
  { source: "c4c44d2c-f5a7-4228-b722-323b80018548.jpeg", archiveReason: "low-resolution product-label image" },
  { source: "e715039f-8719-4c43-a04e-41383cfbd2cc.jpeg", archiveReason: "promotional flyer" },
]

export { seedAssetProvenance }
