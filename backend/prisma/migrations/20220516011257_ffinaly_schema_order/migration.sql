/*
  Warnings:

  - You are about to drop the `payment_method` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shippingAddressId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentResultId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[priceOrderId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentResultId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceOrderId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentResultId" TEXT NOT NULL,
ADD COLUMN     "priceOrderId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "payment_method";

-- CreateIndex
CREATE UNIQUE INDEX "orders_shippingAddressId_key" ON "orders"("shippingAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_paymentResultId_key" ON "orders"("paymentResultId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_priceOrderId_key" ON "orders"("priceOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_userId_key" ON "orders"("userId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentResultId_fkey" FOREIGN KEY ("paymentResultId") REFERENCES "payment_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_priceOrderId_fkey" FOREIGN KEY ("priceOrderId") REFERENCES "price_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
