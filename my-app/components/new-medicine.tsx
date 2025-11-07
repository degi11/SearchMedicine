"use client";

import {
  NewMedicineCreateInputTextArrey,
  NewMedicineCreateTextareaArrey,
} from "@/ascents/constans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleMinus, PlusCircle, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewMedicine() {
  const [form, setForm] = useState({
    tradeNameMN: "",
    tradeNameEN: "",
    barcode: "",
    internationalName: "",
    dosage: "",
    no: "",
    dosageForm: "",
    conditionsOfIssue: "false",
    country: "",
    registered: "",
    indicationsForUse: "",
    prohibitions: "",
    precautions: "",
    sideEffects: "",
    positive: "",
    negative: "",
    useDuringPregnancyAndLactation: "",
    adultDose: "",
    adultTime: "",
  });

  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [children, setChildren] = useState([{ age: "", dose: "", time: "" }]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChildChange = (index: number, field: string, value: string) => {
    const updated = [...children];
    updated[index][field as keyof (typeof updated)[number]] = value;
    setChildren(updated);
  };

  const addChild = () => {
    setChildren([...children, { age: "", dose: "", time: "" }]);
  };

  const removeChildDose = (index: number) => {
    const updated = [...children];
    updated.splice(index, 1);
    setChildren(updated.length ? updated : [{ age: "", dose: "", time: "" }]);
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
    } catch (err) {
      console.error("Upload error:", err);
      alert("Зураг илгээхэд алдаа гарлаа.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      Object.values(form).some((v) => v === "") ||
      children.some((c) => Object.values(c).some((v) => v === "")) ||
      !url
    ) {
      alert("Бүх талбарыг бөглөж, зураг оруулна уу!");
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
          image: url,
          no: parseInt(form.no),
          barcode: form.barcode ? BigInt(form.barcode).toString() : null,
          conditionsOfIssue: form.conditionsOfIssue === "true",
          prohibitionsPrecautions: [
            { prohibitions: form.prohibitions, precautions: form.precautions },
          ],
          interactionWithOtherDrugs: [
            { positive: form.positive, negative: form.negative },
          ],
          adult: [{ dose: form.adultDose, time: form.adultTime }],
          child: children.map((c) => ({
            age: c.age,
            dose: c.dose,
            time: c.time,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Алдаа гарлаа: " + err.error);
      } else {
        alert("Эм амжилттай нэмэгдлээ!");
        setForm({
          tradeNameMN: "",
          tradeNameEN: "",
          barcode: "",
          internationalName: "",
          dosage: "",
          no: "",
          dosageForm: "",
          conditionsOfIssue: "false",
          country: "",
          registered: "",
          indicationsForUse: "",
          prohibitions: "",
          precautions: "",
          sideEffects: "",
          positive: "",
          negative: "",
          useDuringPregnancyAndLactation: "",
          adultDose: "",
          adultTime: "",
        });
        setChildren([{ age: "", dose: "", time: "" }]);
        setUrl(null);
      }
    } catch (err) {
      console.error("Error creating medicine:", err);
      alert("Серверийн алдаа гарлаа.");
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
        Шалгаж байна...
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

        {NewMedicineCreateInputTextArrey.map((el, index) => (
          <Input
            key={index}
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
          name="conditionsOfIssue"
          value={form.conditionsOfIssue}
          onChange={handleChange}
          required
          className=" border border-black rounded-sm p-2"
        >
          <option value="false">Жоргүй</option>
          <option value="true">Жортой</option>
        </select>

        {NewMedicineCreateTextareaArrey.map((el, index) => (
          <Textarea
            key={index}
            name={el.name}
            placeholder={el.placeholder}
            value={form[el.name as keyof typeof form]}
            onChange={handleChange}
            required
            className="border-black p-2 col-span-2"
          />
        ))}

        <div className="col-span-2 grid grid-cols-2 gap-2">
          <Input
            name="adultDose"
            placeholder="Насанд хүрэгчдийн тун"
            value={form.adultDose}
            onChange={handleChange}
            required
            className="border-black h-[41px]"
          />
          <Input
            name="adultTime"
            placeholder="Насанд хүрэгчдийн хэрэглэх хугацаа"
            value={form.adultTime}
            onChange={handleChange}
            required
            className="border-black p-2 h-[41px]"
          />
        </div>

        <div className="col-span-2 border p-3 rounded-sm border-black">
          <h2 className="font-semibold mb-2">Хүүхдийн тунгийн мэдээлэл</h2>
          {children.map((child, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2 ">
              <Input
                placeholder="Нас"
                value={child.age}
                onChange={(e) =>
                  handleChildChange(index, "age", e.target.value)
                }
                required
                className="border-black"
              />
              <Input
                placeholder="Тун"
                value={child.dose}
                onChange={(e) =>
                  handleChildChange(index, "dose", e.target.value)
                }
                className="border-black p-2"
                required
              />
              <Input
                placeholder="Хугацаа"
                value={child.time}
                onChange={(e) =>
                  handleChildChange(index, "time", e.target.value)
                }
                className="border-black p-2"
                required
              />
              <div>
                <Button
                  type="button"
                  onClick={() => removeChildDose(index)}
                  className="px-2 py-1 rounded col-span-3"
                >
                  <CircleMinus />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={addChild}
            className="px-3 py-1 rounded"
          >
            <PlusCircle />
          </Button>
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
