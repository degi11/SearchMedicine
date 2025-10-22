import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const medicineData: Prisma.MedicineCreateInput[] = [
  {
    tradeName: "Полиоксидоний",
    barcode: 4607035393655,
    internationalName: "Азоксимерын бромид",
    dosage: "6 mg",
    no: 5,
    dosageForm: "тарилгын уусмал бэлтгэх лиофилизат",
    conditionsOfIssue: true,
    country: "ОХУ",
  },
];

export async function main() {
  for (const m of medicineData) {
    await prisma.medicine.create({
      data: m,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });