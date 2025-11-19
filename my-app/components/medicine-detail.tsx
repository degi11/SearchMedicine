"use client";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  Globe,
  PillIcon,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { Spinner } from "./ui/spinner";
import { useEffect, useState } from "react";
import { AdultDose, ChildDose, IODrugs, PPprops } from "@/types";
import DeleteButton from "./medicine-delete";
import EditButton from "./medicine-edit";
import { useCart } from "./cart-context";

export default function MedicineDetail({ id }: { id: string }) {
  const [medicine, setMedicine] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Тайлбар");

  const { addToCart, isInCart } = useCart();

  const alreadyInCart = isInCart(id ?? "");

  useEffect(() => {
    const fetchMedicine = async () => {
      const res = await fetch(`/api/medicine/${id}`);
      const data = await res.json();
      setMedicine(data);
    };
    fetchMedicine();
  }, [id]);

  if (!medicine) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <Button disabled size="sm">
          <Spinner />
          Loading...
        </Button>
      </div>
    );
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alreadyInCart) return;

    addToCart({
      id: medicine.id ?? "",
      name: medicine.tradeNameMN ?? "",
      quantity: 1,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Хэрэглэх заалт":
        return (
          <div className="flex flex-col bg-green-50 rounded-xl p-5 border border-green-100">
            <p>{medicine.indicationsForUse}</p>
          </div>
        );
      case "Хориглох, Анхаарах зүйлс":
        return (
          <div className="gap-5">
            {medicine.prohibitionsPrecautions.map((el: PPprops, id: number) => (
              <div
                key={id}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 "
              >
                <div className="flex flex-col bg-red-50 rounded-xl p-5 border border-red-100">
                  <div className="flex gap-2 items-center">
                    <ShieldAlert className="text-red-600" />
                    <p className="font-semibold">Хориглох</p>
                  </div>
                  <p>{el.prohibitions}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-orange-600" />
                    <p className="font-semibold">Анхаарах</p>
                  </div>
                  <p>{el.precautions}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex gap-2 items-center">
                    <AlertCircle className="text-blue-600" />
                    <p className="font-semibold">Жирэмсэн болон хөхүүл үед</p>
                  </div>
                  {medicine.useDuringPregnancyAndLactation?.length ? (
                    <p>{medicine.useDuringPregnancyAndLactation}</p>
                  ) : (
                    <p>Жирэмсэн болон хөхүүл үед хийсэн судалгаа байхгүй.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case "Гаж нөлөө":
        return (
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
            <AlertTriangle className="text-orange-600" />
            <p>{medicine.sideEffects}</p>
          </div>
        );
      case "Бусад эмтэй харилцан үйлчлэл":
        return (
          <div>
            {medicine.interactionWithOtherDrugs.map(
              (el: IODrugs, id: number) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6 lg:gap-8"
                  key={id}
                >
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <div className="flex gap-2 items-center">
                      <ThumbsUp className="text-green-600" />
                      <p className="font-semibold">
                        Бусад эмтэй эерэг харилцан үйлчлэл
                      </p>
                    </div>

                    {el.positive?.length ? (
                      <p>{el.positive}</p>
                    ) : (
                      <p>Эерэг харилцан үйлчлэх эм байхгүй</p>
                    )}
                  </div>
                  <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                    <div className="flex gap-2 items-center">
                      <ThumbsDown className="text-red-600" />
                      <p className="font-semibold">
                        Бусад эмтэй сөрөг харилцан үйлчлэл
                      </p>
                    </div>
                    {el.negative?.length ? (
                      <p>{el.negative}</p>
                    ) : (
                      <p>Сөрөг харилцан үйлчлэх эм байхгүй</p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        );
      case "Хэрэглэх тун, Хугацаа":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 justify-center">
            <div className="flex justify-center">
              <div className="w-fit h-fit bg-blue-50 rounded-xl p-2 px-4 border border-blue-100 justify-center">
                <p className="text-xl">Насанд хүрсэн хүний тун</p>
                <span className="w-99/100 h-px bg-gray-400 block justify-self-center mt-3" />
                {medicine.adult.map((el: AdultDose, id: number) => (
                  <div key={id} className="flex gap-4 mt-2 ">
                    <p className="pl-2">{el.dose}</p>
                    <span className="w-px h-7 bg-gray-400 block justify-self-center" />
                    <p>Өдөрт {el.time} удаа</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-1 border border-green-100 rounded-xl">
              <div className="w-full flex items-center justify-center mb-4">
                <p className="text-xl">Хүүхдийн уух тун</p>
              </div>

              <span className="w-99/100 h-px bg-gray-400 block justify-self-center" />

              {medicine.child[0].dose?.length ? (
                medicine.child.map((el: ChildDose, id: number) => (
                  <div key={id} className=" ">
                    <div className="grid grid-cols-3 mb-2 mt-2">
                      <div className="border-r border-gray-400 p-1 pl-4">
                        <p>{el.age}</p>
                      </div>
                      <div className="border-r border-gray-400 p-1 pl-4">
                        <p>{el.dose}</p>
                      </div>
                      <div className="p-1 pl-4">
                        <p>Өдөрт {el.time} удаа</p>
                      </div>
                    </div>
                    {id < medicine.child.length - 1 && (
                      <span className="w-99/100 h-px bg-gray-400 block justify-self-center" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 p-3">
                  Хүүхдийн тунгийн мэдээлэл байхгүй.
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabClasses = (tab: string) =>
    `cursor-pointer pb-2 border-b-2 ${
      activeTab === tab
        ? "border-[#00AC94] text-[#00AC94] font-semibold"
        : "border-transparent text-gray-600 hover:text-[#00AC94]"
    }`;

  return (
    <div className="max-w-7xl mx-auto mt-10 mb-40 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-80 md:h-[400px]">
          <Image
            src={`${medicine.image.replace(
              "/upload/",
              "/upload/q_100,f_auto/"
            )}`}
            alt={medicine.tradeNameEN}
            fill
            className="object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <h1 className="text-2xl md:text-3xl lg:text-3xl font-semibold">
              {medicine.tradeNameMN}
            </h1>
            <div>
              <p className="text-xl font-semibold">No{medicine.no}</p>
              {medicine.conditionsOfIssue ? (
                <p className="text-xl">Жортой</p>
              ) : (
                <p className="text-xl">Жоргүй</p>
              )}
            </div>
          </div>

          <div className="w-full border-gray-400 border rounded-2xl">
            <div className="w-full flex items-center gap-3 lg:pl-5 p-3 rounded-md">
              <PillIcon className="text-[#00AC94]" />
              <div>
                <p className="text-xl">{medicine.dosage}</p>
                <p className="text-xl text-gray-700">{medicine.dosageForm}</p>
              </div>
            </div>
            <span className="w-9/10 h-px bg-gray-400 block justify-self-center" />
            <div className="w-full flex items-center gap-3 lg:pl-5 p-3 rounded-md">
              <Globe className="text-blue-500" />
              <div>
                <p className="text-xl">{medicine.country}</p>
                <p className="text-xl text-gray-700">{medicine.registered}</p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-3">
            <Button
              onClick={handleAdd}
              disabled={alreadyInCart}
              className="bg-[#00AC94] hover:bg-[#00AC94] hover:text-black transition-all duration-200"
            >
              {alreadyInCart ? <div>Checked...</div> : <div>Check</div>}
            </Button>
            <EditButton medicine={medicine} />
            <DeleteButton medicineId={medicine.id} />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4 mt-8">
        <h1 className="text-xl lg:text-3xl">Бүтээгдэхүүний дэлгэрэнгүй</h1>
        <span className="w-1/3 h-px bg-gray-200" />
      </div>

      <div className="w-full mt-6">
        <div className="overflow-x-auto">
          <div className="flex gap-4 whitespace-nowrap border-b border-gray-200 mb-4">
            {[
              "Хэрэглэх заалт",
              "Хориглох, Анхаарах зүйлс",
              "Гаж нөлөө",
              "Бусад эмтэй харилцан үйлчлэл",
              "Хэрэглэх тун, Хугацаа",
            ].map((tab) => (
              <div
                key={tab}
                className={`${tabClasses(tab)} inline-block px-3 py-2`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        <div className="text-gray-800 leading-relaxed">{renderContent()}</div>
      </div>
    </div>
  );
}
