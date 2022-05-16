-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_paymentResultId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paymentResultId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentResultId_fkey" FOREIGN KEY ("paymentResultId") REFERENCES "payment_result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
