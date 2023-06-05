/*
  Warnings:

  - Added the required column `fullDescription` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "fullDescription" TEXT NOT NULL;
