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

export default function MedicineDetail({ id }: { id: string }) {
  const [medicine, setMedicine] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Тайлбар");

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
              <div key={id} className="grid grid-cols-3 gap-5">
                <div className="flex flex-col bg-red-50 rounded-xl p-5 border border-red-100">
                  <div>
                    <ShieldAlert className="text-red-600" />
                  </div>
                  <p>{el.prohibitions}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <div>
                    <AlertTriangle className="text-orange-600" />
                  </div>
                  <p>{el.precautions}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <AlertCircle className="text-blue-600" />
                  <p>{medicine.useDuringPregnancyAndLactation}</p>
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
                <div className="grid grid-cols-2 gap-8" key={id}>
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <ThumbsUp className="text-green-600" />
                    <p>{el.positive}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                    <ThumbsDown className="text-red-600" />
                    <p>{el.negative}</p>
                  </div>
                </div>
              )
            )}
          </div>
        );
      case "Хэрэглэх тун, Хугацаа":
        return (
          <div className="grid grid-cols-2">
            <div className="w-fit h-fit bg-blue-50 rounded-xl p-2 px-4 border border-blue-100">
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

            <div className="bg-green-50 p-1 border border-green-100 rounded-xl">
              <div className="w-full flex items-center justify-center mb-4">
                <p className="text-xl">Хүүхдийн уух тун</p>
              </div>

              <span className="w-99/100 h-px bg-gray-400 block justify-self-center" />

              {medicine.child.map((el: ChildDose, id: number) => (
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
              ))}
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
    <div className="max-w-7xl h-screen mt-10 mx-auto mb-40">
      <div className="grid grid-cols-2 gap-8">
        <div className="h-auto">
          <Image
            src={medicine.image}
            alt={medicine.tradeNameEN}
            width={50}
            height={50}
            className="object-cover w-full rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-8 justify-between">
            <h1 className="text-2xl font-semibold">{medicine.tradeNameMN}</h1>
            <div className="">
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

          <div>categories</div>
          <div className="w-full flex gap-3">
            <Button className="bg-[#00AC94] hover:bg-[#00AC94] hover:text-black">
              Print
            </Button>
            <EditButton medicine={medicine} />
            <DeleteButton medicineId={medicine.id} />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4 mt-15">
        <h1 className="text-xl lg:text-3xl">Бүтээгдэхүүний дэлгэрэнгүй</h1>
        <span className="w-1/3 h-px bg-gray-200" />
      </div>

      <div className="w-full mt-10">
        <div className="flex gap-10 border-b border-gray-200 mb-4">
          {[
            "Хэрэглэх заалт",
            "Хориглох, Анхаарах зүйлс",
            "Гаж нөлөө",
            "Бусад эмтэй харилцан үйлчлэл",
            "Хэрэглэх тун, Хугацаа",
          ].map((tab) => (
            <div
              key={tab}
              className={tabClasses(tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="text-gray-800 leading-relaxed">{renderContent()}</div>
      </div>
    </div>
  );
}
