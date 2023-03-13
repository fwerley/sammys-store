/*
  Warnings:

  - You are about to drop the column `is_seller` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_seller",
ADD COLUMN     "isSeller" BOOLEAN NOT NULL DEFAULT false;
