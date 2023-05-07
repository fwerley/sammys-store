/*
  Warnings:

  - You are about to drop the column `installments` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "installments";

-- AlterTable
ALTER TABLE "price_order" ADD COLUMN     "installments" INTEGER NOT NULL DEFAULT 1;
