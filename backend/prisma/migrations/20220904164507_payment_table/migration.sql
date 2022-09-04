/*
  Warnings:

  - The `paymentMethod` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `country` on the `shipping_address` table. All the data in the column will be lost.
  - Added the required column `federativeUnity` to the `shipping_address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `shipping_address` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('STARTED', 'PROCESSING', 'PENDING', 'APPROVED', 'REFUSED', 'REFUNDED', 'CHARGBACK', 'ERROR');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BILLET', 'CREDIT_CARD');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentType" NOT NULL DEFAULT E'BILLET';

-- AlterTable
ALTER TABLE "shipping_address" DROP COLUMN "country",
ADD COLUMN     "federativeUnity" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "document" TEXT,
ADD COLUMN     "mobile" TEXT;

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'STARTED',
    "installments" INTEGER NOT NULL,
    "processorResponse" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_code_key" ON "transaction"("code");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_orderId_key" ON "transaction"("orderId");

-- AddForeignKey
ALTER TABLE "shipping_address" ADD CONSTRAINT "shipping_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
