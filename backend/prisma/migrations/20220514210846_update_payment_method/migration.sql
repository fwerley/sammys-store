/*
  Warnings:

  - Added the required column `method` to the `payment_method` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_method" ADD COLUMN     "method" TEXT NOT NULL;
