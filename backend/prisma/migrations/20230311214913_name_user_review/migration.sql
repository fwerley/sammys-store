/*
  Warnings:

  - You are about to drop the column `userId` on the `review_product` table. All the data in the column will be lost.
  - Added the required column `name` to the `review_product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "review_product" DROP CONSTRAINT "review_product_userId_fkey";

-- AlterTable
ALTER TABLE "review_product" DROP COLUMN "userId",
ADD COLUMN     "name" TEXT NOT NULL;
