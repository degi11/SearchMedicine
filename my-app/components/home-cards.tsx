import prisma from "@/lib/prisma";
import MedicineCard from "./medicine-card";

export default async function HomeCards() {
  const Medicine = await prisma.medicine.findMany();
  return (
    <div className="w-7xl h-screen mt-25">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8">
        {Medicine.map((el) => (
          <MedicineCard
            key={el.id}
            medicineName={el.tradeNameMN}
            dosage={el.dosage}
            no={el.no}
            dosageForm={el.dosageForm}
            registered={el.registered}
            country={el.country}
          />
        ))}
      </div>
    </div>
  );
}
