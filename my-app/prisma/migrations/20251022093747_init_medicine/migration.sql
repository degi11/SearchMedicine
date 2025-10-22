-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "tradeNameMN" TEXT,
    "tradeNameEN" TEXT,
    "barcode" BIGINT,
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
    "adult" JSONB,
    "child" JSONB,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_barcode_key" ON "Medicine"("barcode");
