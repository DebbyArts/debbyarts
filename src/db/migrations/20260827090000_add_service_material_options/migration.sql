-- AlterTable
ALTER TABLE "Service" ADD COLUMN "materialOptions" TEXT[] DEFAULT ARRAY[]::TEXT[];
