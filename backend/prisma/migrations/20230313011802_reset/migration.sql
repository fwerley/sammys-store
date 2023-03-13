/*
  Warnings:

  - A unique constraint covering the columns `[sellerId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_sellerId_key" ON "orders"("sellerId");
