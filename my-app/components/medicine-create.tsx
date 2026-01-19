"use client";

import {
  NewMedicineCreateInputTextArrey,
  NewMedicineCreateTextareaArrey,
  StorageConditionSelections,
} from "@/ascents/constans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleMinus, PlusCircle, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { DoseUsageInputs } from "./dose-usage-inputs";
import { DiseaseInvoice } from "@/types";

export default function NewMedicine() {
  const [form, setForm] = useState({
    tradeNameMN: "",
    tradeNameEN: "",
    barcode: "",
    internationalName: "",
    dosage: "",
    no: "",
    dosageForm: "",
    conditionsOfIssue: "",
    country: "",
    registered: "",
    storageConditions: "",
    indicationsForUse: "",
    prohibitions: "",
    precautions: "",
    sideEffects: "",
    positive: "",
    negative: "",
    useDuringPregnancyAndLactation: "",
  });

  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [doseUsage, setDoseUsage] = useState<DiseaseInvoice[]>([
    {
      diseaseName: "",
      stages: [
        {
          name: "",
          rows: [{ age: "", dose: "", useTime: "" }],
        },
      ],
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      setUrl(data.secure_url);
      setPublicId(data.public_id);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Зураг илгээхэд алдаа гарлаа.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "tradeNameMN",
      "tradeNameEN",
      "internationalName",
      "dosage",
      "dosageForm",
      "country",
    ];

    const hasEmptyRequired = requiredFields.some(
      (field) => !form[field as keyof typeof form]
    );

    if (hasEmptyRequired || !url) {
      toast.warning("Заавал бөглөх талбаруудыг бөглөж, зураг оруулна уу!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          imageUrl: url,
          imagePublicId: publicId,
          no: parseInt(form.no),
          barcode: form.barcode ? BigInt(form.barcode).toString() : null,
          prohibitionsPrecautions: [
            { prohibitions: form.prohibitions, precautions: form.precautions },
          ],
          interactionWithOtherDrugs: [
            { positive: form.positive, negative: form.negative },
          ],
          doseUsage,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error("Алдаа гарлаа: " + err.error);
      } else {
        toast.success("Эм амжилттай нэмэгдлээ!");
        setForm({
          tradeNameMN: "",
          tradeNameEN: "",
          barcode: "",
          internationalName: "",
          dosage: "",
          no: "",
          dosageForm: "",
          conditionsOfIssue: "",
          country: "",
          registered: "",
          storageConditions: "",
          indicationsForUse: "",
          prohibitions: "",
          precautions: "",
          sideEffects: "",
          positive: "",
          negative: "",
          useDuringPregnancyAndLactation: "",
        });
        setDoseUsage([
          {
            diseaseName: "",
            stages: [
              {
                name: "",
                rows: [{ age: "", dose: "", useTime: "" }],
              },
            ],
          },
        ]);
        setUrl(null);
      }
    } catch (err) {
      console.error("Error creating medicine:", err);
      toast.error("Серверийн алдаа гарлаа.");
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/check-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!data.loggedIn || data.role !== "ADMIN") {
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <Button disabled size="sm">
          <Spinner />
          Checking...
        </Button>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Шинэ эм бүртгэх</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2 border p-3 rounded-md border-black">
          <label className="font-semibold mb-2 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Эмийн зураг:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2"
          />
          {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
          {url && (
            <img
              src={url}
              alt="Medicine"
              className="mt-3 w-40 h-40 object-cover rounded-md border"
            />
          )}
        </div>

        {NewMedicineCreateInputTextArrey.map((el, id) => (
          <Input
            key={id}
            name={el.name}
            type={el.type || "text"}
            placeholder={el.placeholder}
            value={form[el.name as keyof typeof form]}
            onChange={handleChange}
            required
            className="border-black p-2 h-[41px]"
          />
        ))}

        <select
          name="storageConditions"
          value={form.storageConditions}
          onChange={handleChange}
          className="border p-2 rounded-sm border-black"
        >
          <option value="">-- Хадгалах нөхцөл сонгох --</option>
          {StorageConditionSelections.map((el, i) => (
            <option key={i} value={el}>
              {el}
            </option>
          ))}
        </select>

        {NewMedicineCreateTextareaArrey.map((el, id) => (
          <Textarea
            key={id}
            name={el.name}
            placeholder={el.placeholder}
            value={form[el.name as keyof typeof form]}
            onChange={handleChange}
            className="border-black p-2 col-span-2"
          />
        ))}

        <div className="col-span-2 border p-3 rounded-sm border-black">
          <h2 className="font-semibold mb-2">Хэрэглэх тунгийн мэдээлэл</h2>
          <DoseUsageInputs value={doseUsage} onChange={setDoseUsage} />
        </div>

        <Button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded h-12"
        >
          Эм нэмэх
        </Button>
      </form>
    </div>
  );
}
