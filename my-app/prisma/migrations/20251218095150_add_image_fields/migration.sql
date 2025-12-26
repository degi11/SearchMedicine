/*
  Warnings:

  - You are about to drop the column `image` on the `Medicine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "image",
ADD COLUMN     "ImagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;
