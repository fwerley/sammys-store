/*
  Warnings:

  - You are about to drop the column `user_id` on the `federated_credentials` table. All the data in the column will be lost.
  - Added the required column `userId` to the `federated_credentials` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "federated_credentials_user_id_key";

-- AlterTable
ALTER TABLE "federated_credentials" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "federated_credentials" ADD CONSTRAINT "federated_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
