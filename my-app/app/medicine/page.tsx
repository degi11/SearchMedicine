import MedicineCard from "@/components/medicine-card";
import prisma from "@/lib/prisma";

export default async function Home() {
  const Medicine = await prisma.medicine.findMany();
  return (
    <div className="max-w-7xl h-screen mt-10 mx-auto">
      <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[320px] lg:auto-rows-[380px] ">
        {Medicine.map((el) => (
          <MedicineCard
            id={el.id}
            key={el.id}
            medicineName={el.tradeNameMN}
            dosage={el.dosage}
            no={el.no}
            conditionsOfIssue={el.conditionsOfIssue}
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
