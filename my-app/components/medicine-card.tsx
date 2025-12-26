"use client";
import { MedicineCardProrps } from "@/types";
import { BookmarkCheck, BookmarkPlus, ImageOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";

export default function MedicineCard({
  medicineName,
  dosage,
  no,
  conditionsOfIssue,
  dosageForm,
  registered,
  country,
  storageConditions,
  id,
  imageUrl,
}: MedicineCardProrps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();

  const alreadyInCart = isInCart(id ?? "");

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alreadyInCart) return;

    addToCart({
      id: id ?? "",
      name: medicineName ?? "",
      storageCo: storageConditions ?? "",
      quantity: 1,
    });
  };

  return (
    <div
      onClick={() => router.push(`/medicine/${id}`)}
      className="flex flex-col rounded-2xl w-full h-auto bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-green-200 group"
    >
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-green-50 to-blue-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={medicineName || "Medicine image"}
            width={250}
            height={250}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="text-green-200" size={60} />
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white rounded-lg px-2 shadow-md">
          <span className="text-sm font-semibold text-green-600">
            {conditionsOfIssue}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={alreadyInCart}
          className="absolute top-3 left-3 bg-[#00AC94] text-white w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200"
        >
          {alreadyInCart ? (
            <BookmarkCheck className="w-6 h-6 text-white" />
          ) : (
            <BookmarkPlus className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <div className="p-3">
        <div className="flex flex-col md:flex-row md:justify-between ">
          <h1 className="font-bold text-base sm:text-lg line-clamp-1 sm:line-clamp-2 transition-all duration-200 group-hover:text-[#00AC94]">
            {medicineName}
          </h1>
          <p className="font-bold text-sm sm:text-base">№{no}</p>
        </div>
        <p className="font-medium text-sm sm:text-base line-clamp-1">
          {dosage}
        </p>
        <p className="font-medium text-sm sm:text-base line-clamp-1">
          {dosageForm}
        </p>
        <p className="text-sm sm:text-base line-clamp-1">{country}</p>
        <p className="text-sm sm:text-base line-clamp-1">{registered}</p>
      </div>
    </div>
  );
}
