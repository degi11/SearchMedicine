import { MedicineCardProrps } from "@/types";
import Image from "next/image";
import Link from "next/link";


export default function MedicineCard({
  medicineName,
  dosage,
  no,
  dosageForm,
  registered,
  country,
  image,
}: MedicineCardProrps) {

  const truncate = (text: string, length: number) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  return (
    <div className="flex flex-col bg-white border border-black p-3 lg:p-5 rounded-2xl w-full h-auto ">
      <div className="relative h-48 overflow-hidden rounded-md flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={medicineName || "Medicine image"}
            width={250}
            height={250}
            className="object-cover w-full h-full rounded-xl"
          />
        ) : (
          <span className="text-gray-400 text-sm">Зураг байхгүй</span>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <h1 className="font-bold text-base sm:text-lg">{medicineName ? truncate(medicineName, 12) : "N/A"}</h1>
        <p className="font-bold text-sm sm:text-base">№{no}</p>
      </div>
      <p className="font-medium text-sm sm:text-base">{dosage ? truncate(dosage, 12) : "N/A"}</p>
      <p className="font-medium text-sm sm:text-base">{dosageForm ? truncate(dosageForm, 12) : "N/A"}</p>
      <Link
        href={`category/country/${country}`}
        className=" hover:text-blue-700 text-sm sm:text-base"
      >
        {country ? truncate(country, 12) : "N/A"}
      </Link>
      <Link
        href={`category/registered/${registered}`}
        className="hover:text-blue-700 text-sm sm:text-base"
      >
        {registered ? truncate(registered, 10) : "N/A"}
      </Link>
    </div>
  );
}
