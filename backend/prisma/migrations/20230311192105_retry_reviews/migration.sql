/*
  Warnings:

  - You are about to drop the `review_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "review_product" DROP CONSTRAINT "review_product_productId_fkey";

-- DropForeignKey
ALTER TABLE "review_product" DROP CONSTRAINT "review_product_userId_fkey";

-- DropTable
DROP TABLE "review_product";
