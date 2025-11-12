import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const medicineData: Prisma.MedicineCreateInput[] = [
  {
    tradeNameMN: "Парацетамол",
    tradeNameEN: "paracetamol",
    barcode: 8656898911205,
    internationalName: "Парацетамол",
    dosage: "500мг",
    no: 10,
    dosageForm: "шахмал",
    conditionsOfIssue: false,
    country: "Монгол",
    registered: "Ариун Монгол ХХК",
    indicationsForUse: "Шүд, толгой, мэдрэлийн судлын өвдөлт, төрөл бүрийн гаралтай халууралт.",
    prohibitionsPrecautions: [
      {
      prohibitions: "Элэг, болон бөөрний хүнд хэлбэрийн дутмагшил, глюкоз-6-фосфатдегидрогеназа ферментийн дутмагшил, цусны хүнд хэлбэрийн эмгэгтэй болон парацетамолд хэт мэдрэгшсэн өвчтөнд хэрэглэхгүй.",
      precautions: "Архаг архичин, бөөр, элэгний хүндэрсэн эмгэгтэй хүмүүс болгоомжтой хэрэглэнэ."
    }
    ],
    sideEffects: "Тун хэтэрвэл элэг хордуулж хордлогот гепатит үүсгэнэ. Шарлалт, арьсны тууралт, гипогликеми, цус задралт цус багадалт, нейтропени, лейкопени, панцитопени, тромбоцитопени зэрэг гаж нөлөө удаан хугацаагаар хэрэглэхэд хаяа үүсч болзошгүй.",
    interactionWithOtherDrugs: [
      {positive: "ВАРФАРИН: варфарины антикоагулянт нөлөө ихэснэ.", negative:"ХОЛЕСТИАМИН: парацетамолын шимэгдэлт саатна."}
    ],
    useDuringPregnancyAndLactation: "Хөхүүл ба жирэмсэн эхчүүдэд болгоомжтой хэрэглэнэ.",
    adult: [
      { dose: "500 мг", time: "4" }
    ],
    child: [
      { age: "3 сартайгаас 1 нас хүртэл", dose: "24 - 120 мг", time: "4"},
      { age: "1 - 6 настайд", dose: "120 - 240мг", time: "4"},
      { age: "6 - 12 настайд", dose: "240мг", time: "4"}      
    ],
    image: "https://res.cloudinary.com/dqrd7tpyd/image/upload/v1761550263/sjh2w1xmfdorcgw8hrxp.jpg"
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