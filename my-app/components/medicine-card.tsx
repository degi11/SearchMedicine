import { MedicineCardProrps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Paracetamol from "@/ascents/paracetamol.jpg"

export default function MedicineCard({
  medicineName,
  dosage,
  no,
  dosageForm,
  registered,
  country,
}: MedicineCardProrps) {

  const truncate = (text: string, length: number) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  return (
    <div className="flex flex-col bg-white border border-black p-3 lg:p-5 rounded-2xl w-full h-auto">
      <div className="h-2/3 rounded-md flex items-center justify-center">
        <Image
      src={Paracetamol}
      width={500}
      height={500}
      alt="Paracetamol"
    />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <h1 className="font-bold text-base sm:text-lg">{medicineName ? truncate(medicineName, 10) : "N/A"}</h1>
        <p className="font-bold text-sm sm:text-base">№{no}</p>
      </div>
      <p className="font-medium text-sm sm:text-base">{dosage ? truncate(dosage, 10) : "N/A"}</p>
      <p className="font-medium text-sm sm:text-base">{dosageForm ? truncate(dosageForm, 10) : "N/A"}</p>
      <Link
        href={`category/country/${country}`}
        className="text-blue-700 hover:text-red-600 text-sm sm:text-base"
      >
        {country ? truncate(country, 10) : "N/A"}
      </Link>
      <Link
        href={`category/registered/${registered}`}
        className="text-blue-700 hover:text-red-600 text-sm sm:text-base"
      >
        {registered ? truncate(registered, 10) : "N/A"}
      </Link>
    </div>
  );
}
