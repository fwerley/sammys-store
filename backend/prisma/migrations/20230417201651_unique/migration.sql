/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `federated_credentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subject]` on the table `federated_credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "federated_credentials_user_id_key" ON "federated_credentials"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "federated_credentials_subject_key" ON "federated_credentials"("subject");
