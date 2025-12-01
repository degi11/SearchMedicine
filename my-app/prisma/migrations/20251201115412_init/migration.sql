-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "tradeNameMN" TEXT,
    "tradeNameEN" TEXT,
    "barcode" TEXT,
    "internationalName" TEXT,
    "dosage" TEXT,
    "no" INTEGER,
    "dosageForm" TEXT,
    "conditionsOfIssue" BOOLEAN,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registered" TEXT,
    "indicationsForUse" TEXT,
    "prohibitionsPrecautions" JSONB,
    "sideEffects" TEXT,
    "interactionWithOtherDrugs" JSONB,
    "useDuringPregnancyAndLactation" TEXT,
    "doseUsage" JSONB,
    "image" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_barcode_key" ON "Medicine"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
