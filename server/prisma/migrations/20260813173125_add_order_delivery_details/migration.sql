-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryCity" TEXT,
ADD COLUMN     "deliveryPincode" TEXT,
ADD COLUMN     "deliveryState" TEXT;
