/*
  Warnings:

  - You are about to drop the `DeliveryOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeliveryOrder" DROP CONSTRAINT "DeliveryOrder_orderId_fkey";

-- DropTable
DROP TABLE "DeliveryOrder";

-- CreateTable
CREATE TABLE "delivery_order" (
    "id" TEXT NOT NULL,
    "shippingCompany" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "link" TEXT,
    "orderId" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_order_orderId_key" ON "delivery_order"("orderId");

-- AddForeignKey
ALTER TABLE "delivery_order" ADD CONSTRAINT "delivery_order_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
