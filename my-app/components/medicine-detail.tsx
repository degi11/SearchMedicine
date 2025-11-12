"use client";
import { Button } from "@/components/ui/button";
import { Globe, PillIcon } from "lucide-react";
import Image from "next/image";
import { Spinner } from "./ui/spinner";
import { useEffect, useState } from "react";
import { AdultDose, ChildDose, IODrugs, PPprops } from "@/types";

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
          <div>
            <p>{medicine.indicationsForUse}</p>
          </div>
        );
      case "Хориглох, Анхаарах зүйлс":
        return (
          <div>
            {medicine.prohibitionsPrecautions.map((el: PPprops, i: number) => (
              <div key={i}>
                <p>{el.prohibitions}</p>
                <p>{el.precautions}</p>
              </div>
            ))}
            <p>{medicine.useDuringPregnancyAndLactation}</p>
          </div>
        );
      case "Гаж нөлөө":
        return <p>{medicine.sideEffects}</p>;
      case "Бусад эмтэй харилцан үйлчлэл":
        return (
          <div>
            {medicine.interactionWithOtherDrugs.map(
              (el: IODrugs, i: number) => (
                <div key={i}>
                  <p >{el.positive}</p>
                  <p>{el.negative}</p>
                </div>
              )
            )}
          </div>
        );
      case "Уух тун, Хугацаа":
        return (
          <div>
            {medicine.adult.map((el: AdultDose, i: number) => (
              <div key={i}>
                <p >{el.dose}</p>
                <p >{el.time}</p>
              </div>
            ))}

            {medicine.child.map((el: ChildDose, i: number) => (
              <div key={i}>
                <p >{el.age}</p>
                <p >{el.dose}</p>
                <p >{el.time}</p>
              </div>
            ))}
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
    <div className="max-w-7xl h-screen mt-10 mx-auto">
      <div className="grid grid-cols-2 gap-8">
        <div className="">
          <Image
            src={medicine.image}
            alt="Medicine image"
            width={100}
            height={100}
            className="object-cover w-full h-full rounded-xl"
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-8 ">
            <h1 className="text-2xl font-semibold">{medicine.tradeNameMN} </h1>
            <div className="">
              <p className="text-xl font-semibold">No{medicine.no}</p>
              {medicine.conditionOfIssue ? (
                <p className="text-xl">Жортой</p>
              ) : (
                <p className="text-xl">Жоргүй</p>
              )}
            </div>
          </div>
          <div className="w-full border-gray-400 border rounded-2xl">
            <div className="w-full flex items-center gap-3  p-3 rounded-md">
              <PillIcon className="text-[#00AC94]" />
              <div>
                <p className="text-xl">{medicine.dosage}</p>
                <p className="text-xl text-gray-700">{medicine.dosageForm}</p>
              </div>
            </div>
            <span className="w-1/2 h-2 bg-black" />
            <div className="w-full flex items-center gap-3  p-3 rounded-md">
              <Globe className="text-blue-500" />
              <div>
                <p className="text-xl">{medicine.country}</p>
                <p className="text-xl text-gray-700">{medicine.registered}</p>
              </div>
            </div>
          </div>

          <div>categories</div>
          <div className="w-full flex gap-3">
            <Button className="bg-[#00AC94]">Print</Button>
            <Button className="">Edit</Button>
            <Button className="bg-red-400">Delete</Button>
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
            "Уух тун, Хугацаа",
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
