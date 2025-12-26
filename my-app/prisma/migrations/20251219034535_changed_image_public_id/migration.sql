/*
  Warnings:

  - You are about to drop the column `ImagePublicId` on the `Medicine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "ImagePublicId",
ADD COLUMN     "imagePublicId" TEXT;
