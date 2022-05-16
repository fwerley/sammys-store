/*
  Warnings:

  - You are about to drop the column `order_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentResultId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `priceOrderId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_paymentResultId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_priceOrderId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shippingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "order_id";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "paymentMethodId",
DROP COLUMN "paymentResultId",
DROP COLUMN "priceOrderId",
DROP COLUMN "shippingAddressId",
DROP COLUMN "userId",
ALTER COLUMN "delivered_at" DROP NOT NULL;
