-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PricingMode" AS ENUM ('NONE', 'EXACT', 'STARTING_FROM');

-- CreateEnum
CREATE TYPE "ArtworkCategory" AS ENUM ('PAINTING', 'PENCIL_PORTRAIT', 'FRAMED_CUSTOM_ARTWORK', 'DIGITAL_ARTWORK');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'MADE_TO_ORDER', 'SOLD', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "ServiceGroup" AS ENUM ('PERSONALISED_PRODUCTS', 'PRINT_EVENT_MATERIALS', 'BRANDING_SIGNAGE');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "RequestKind" AS ENUM ('ARTWORK', 'SERVICE');

-- CreateEnum
CREATE TYPE "DesignReadiness" AS ENUM ('FINISHED_DESIGN', 'NEEDS_DESIGN_HELP', 'NOT_SURE');

-- CreateEnum
CREATE TYPE "FulfilmentMethod" AS ENUM ('DELIVERY', 'PICKUP');

-- CreateTable
CREATE TABLE "Artwork" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ArtworkCategory" NOT NULL,
    "mediumFormat" TEXT,
    "displayedPieceDimensions" TEXT,
    "availability" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "primaryImagePath" TEXT,
    "primaryImageAlt" TEXT,
    "primaryImageWidth" INTEGER,
    "primaryImageHeight" INTEGER,
    "pricingMode" "PricingMode" NOT NULL DEFAULT 'NONE',
    "priceAmount" DECIMAL(12,2),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "availableSizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "framingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "framingOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "askQuantity" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Artwork_price_mode_amount_check" CHECK (
        ("pricingMode" = 'NONE' AND "priceAmount" IS NULL)
        OR ("pricingMode" IN ('EXACT', 'STARTING_FROM') AND "priceAmount" > 0)
    )
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "group" "ServiceGroup" NOT NULL,
    "primaryImagePath" TEXT,
    "primaryImageAlt" TEXT,
    "primaryImageWidth" INTEGER,
    "primaryImageHeight" INTEGER,
    "pricingMode" "PricingMode" NOT NULL DEFAULT 'NONE',
    "priceAmount" DECIMAL(12,2),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "askQuantity" BOOLEAN NOT NULL DEFAULT false,
    "askSizeFormat" BOOLEAN NOT NULL DEFAULT false,
    "sizeFormatOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "askDesignReadiness" BOOLEAN NOT NULL DEFAULT false,
    "askColour" BOOLEAN NOT NULL DEFAULT false,
    "askMaterial" BOOLEAN NOT NULL DEFAULT false,
    "askFinish" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Service_price_mode_amount_check" CHECK (
        ("pricingMode" = 'NONE' AND "priceAmount" IS NULL)
        OR ("pricingMode" IN ('EXACT', 'STARTING_FROM') AND "priceAmount" > 0)
    )
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "requestKind" "RequestKind" NOT NULL,
    "artworkId" TEXT,
    "serviceId" TEXT,
    "itemNameSnapshot" TEXT NOT NULL,
    "itemSlugSnapshot" TEXT NOT NULL,
    "quantity" INTEGER,
    "sizeFormat" TEXT,
    "framing" TEXT,
    "designReadiness" "DesignReadiness",
    "colour" TEXT,
    "material" TEXT,
    "finish" TEXT,
    "fulfilmentMethod" "FulfilmentMethod",
    "location" TEXT,
    "preferredDate" DATE,
    "customerName" TEXT NOT NULL,
    "phoneWhatsApp" TEXT NOT NULL,
    "email" TEXT,
    "customerNote" TEXT,
    "whatsappSummary" TEXT,
    "handoffInitiatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Enquiry_positive_quantity_check" CHECK ("quantity" IS NULL OR "quantity" > 0),
    CONSTRAINT "Enquiry_request_relation_check" CHECK (
        ("requestKind" = 'ARTWORK' AND "serviceId" IS NULL)
        OR ("requestKind" = 'SERVICE' AND "artworkId" IS NULL)
    ),
    CONSTRAINT "Enquiry_answer_scope_check" CHECK (
        ("requestKind" = 'ARTWORK' AND "designReadiness" IS NULL AND "colour" IS NULL AND "material" IS NULL AND "finish" IS NULL)
        OR ("requestKind" = 'SERVICE' AND "framing" IS NULL)
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_slug_key" ON "Artwork"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_primaryImagePath_key" ON "Artwork"("primaryImagePath");

-- CreateIndex
CREATE INDEX "Artwork_published_featured_displayOrder_idx" ON "Artwork"("published", "featured", "displayOrder");

-- CreateIndex
CREATE INDEX "Artwork_category_published_displayOrder_idx" ON "Artwork"("category", "published", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_primaryImagePath_key" ON "Service"("primaryImagePath");

-- CreateIndex
CREATE INDEX "Service_published_displayOrder_idx" ON "Service"("published", "displayOrder");

-- CreateIndex
CREATE INDEX "Service_group_published_displayOrder_idx" ON "Service"("group", "published", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_reference_key" ON "Enquiry"("reference");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_requestKind_createdAt_idx" ON "Enquiry"("requestKind", "createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_artworkId_idx" ON "Enquiry"("artworkId");

-- CreateIndex
CREATE INDEX "Enquiry_serviceId_idx" ON "Enquiry"("serviceId");

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Prisma is the only application data-access path. RLS with no Data API policies
-- keeps these public-schema tables inaccessible to Supabase anon/authenticated roles.
ALTER TABLE "Artwork" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enquiry" ENABLE ROW LEVEL SECURITY;
