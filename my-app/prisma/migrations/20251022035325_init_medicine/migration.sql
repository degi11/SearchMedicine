/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "barcode" BIGINT,
    "internationalName" TEXT,
    "dosage" TEXT,
    "no" INTEGER,
    "dosageForm" TEXT,
    "conditionsOfIssue" BOOLEAN,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);
