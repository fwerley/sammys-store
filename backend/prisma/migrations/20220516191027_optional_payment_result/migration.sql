/*
  Warnings:

  - Made the column `paymentResultId` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_paymentResultId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paymentResultId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentResultId_fkey" FOREIGN KEY ("paymentResultId") REFERENCES "payment_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
