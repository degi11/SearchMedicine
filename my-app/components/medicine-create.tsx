"use client";

import {
  NewMedicineCreateInputTextArrey,
  NewMedicineCreateTextareaArrey,
  StorageConditionSelections,
} from "@/ascents/constans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Image as ImageIcon,
  Upload,
  Pill,
  FileText,
  Thermometer,
  Stethoscope,
  AlertTriangle,
  Activity,
  Plus,
  X,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [submitting, setSubmitting] = useState(false);

  const [url, setUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Зөвхөн зургийн файл оруулна уу.");
      return;
    }

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
      toast.success("Зураг амжилттай орлоо!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Зураг илгээхэд алдаа гарлаа.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file); 
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleRemoveImage = () => {
    setUrl(null);
    setPublicId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    

    setSubmitting(true);
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
        setPublicId(null);
      }
    } catch (err) {
      console.error("Error creating medicine:", err);
      toast.error("Серверийн алдаа гарлаа.");
    } finally {
      setSubmitting(false);
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
      <div className="flex flex-col justify-center items-center h-screen gap-3 bg-linear-to-br  from-slate-50 to-blue-50">
        <Spinner />
        <p className="text-sm text-slate-500">Шалгаж байна...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/40">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Буцах
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-900 leading-tight">
                  Шинэ эм бүртгэх
                </h1>
                <p className="text-xs text-slate-500 leading-tight">
                  Эмийн дэлгэрэнгүй мэдээллийг оруулна уу
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900 text-sm">
              Эмийн зураг
            </h2>
            <span className="text-xs text-rose-500 ml-1">*</span>
          </header>

          <div className="p-6">
            {!url ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-10 text-center
                  ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                    {uploading ? (
                      <Spinner />
                    ) : (
                      <Upload className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {uploading
                        ? "Илгээж байна..."
                        : "Зургаа энд чирж оруулна уу"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      эсвэл дарж сонгох • PNG, JPG, WEBP (≤10MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="relative group">
                  <img
                    src={url}
                    alt="Medicine"
                    className="w-40 h-40 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition"
                    aria-label="Зураг устгах"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Амжилттай орлоо
                  </div>
                  <p className="text-sm text-slate-600 mt-3">
                    Зургийг сольж оруулахдаа эхлээд устгана уу.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900 text-sm">
              Үндсэн мэдээлэл
            </h2>
          </header>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {NewMedicineCreateInputTextArrey.map((el, id) => (
              <div key={id} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  {el.placeholder}
                </label>
                <Input
                  name={el.name}
                  type={el.type || "text"}
                  placeholder={el.placeholder}
                  value={form[el.name as keyof typeof form]}
                  onChange={handleChange}
                 
                  className="h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500 transition"
                />
              </div>
            ))}

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                Хадгалах нөхцөл
              </label>
              <div className="relative">
                <select
                  name="storageConditions"
                  value={form.storageConditions}
                  onChange={handleChange}
                  className="w-full appearance-none h-11 px-3 pr-10 rounded-md border border-slate-200 bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                >
                  <option value="">-- Хадгалах нөхцөл сонгох --</option>
                  {StorageConditionSelections.map((el, i) => (
                    <option key={i} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900 text-sm">
              Эмнэлгийн мэдээлэл
            </h2>
          </header>

          <div className="p-6 space-y-4">
            {NewMedicineCreateTextareaArrey.map((el, id) => (
              <div key={id} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  {el.placeholder}
                </label>
                <Textarea
                  name={el.name}
                  placeholder={el.placeholder}
                  value={form[el.name as keyof typeof form]}
                  onChange={handleChange}
                  rows={4}
                  className="border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500 resize-none transition"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900 text-sm">
                Хэрэглэх тунгийн мэдээлэл
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Өвчин болон үе шат нэмж тогтооно
            </span>
          </header>

          <div className="p-6">
            <DoseUsageInputs value={doseUsage} onChange={setDoseUsage} />
          </div>
        </section>

        <div className="sticky bottom-4 z-10">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>
                <span className="text-rose-500 font-medium">*</span> тэмдэгтэй
                талбарууд болон зураг заавал бөглөгдөнө.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="h-11 border-slate-200"
              >
                Цуцлах
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="h-11 px-6 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-500/20 gap-2 transition"
              >
                {submitting ? (
                  <>
                    <Spinner />
                    Хадгалж байна...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Эм нэмэх
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}