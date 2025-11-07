/*
  Warnings:

  - You are about to alter the column `barcode` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "barcode" SET DATA TYPE INTEGER;
