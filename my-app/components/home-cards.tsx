import prisma from "@/lib/prisma";
import MedicineCard from "./medicine-card";

export default async function HomeCards() {
  const Medicine = await prisma.medicine.findMany();
  return (
    <div className="max-w-7xl h-screen mt-10">
      <div className="px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[320px] lg:auto-rows-[380px]">
        {Medicine.map((el) => (
          <MedicineCard
            key={el.id}
            medicineName={el.tradeNameMN}
            dosage={el.dosage}
            no={el.no}
            dosageForm={el.dosageForm}
            registered={el.registered}
            country={el.country}
            image={el.image}
          />
        ))}
      </div>
    </div>
  );
}
