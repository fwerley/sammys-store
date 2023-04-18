-- CreateTable
CREATE TABLE "federated_credentials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "federated_credentials_pkey" PRIMARY KEY ("id")
);
