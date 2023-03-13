/*
  Warnings:

  - A unique constraint covering the columns `[sellerId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_sellerId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "products_sellerId_key" ON "products"("sellerId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
