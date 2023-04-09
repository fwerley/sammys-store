-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'PIX';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "sizes" TEXT[],
ADD COLUMN     "variants" TEXT[];
