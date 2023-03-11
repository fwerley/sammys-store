/*
  Warnings:

  - Made the column `productId` on table `review_product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "review_product" DROP CONSTRAINT "review_product_productId_fkey";

-- AlterTable
ALTER TABLE "review_product" ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "review_product" ADD CONSTRAINT "review_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
