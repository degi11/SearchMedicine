/*
  Warnings:

  - You are about to drop the column `adult` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `child` on the `Medicine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "adult",
DROP COLUMN "child",
ADD COLUMN     "doseUsage" JSONB;
