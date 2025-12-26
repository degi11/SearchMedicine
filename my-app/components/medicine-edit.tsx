"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { EditButtonProps } from "@/types";
import { CircleMinus, ImageIcon, PlusCircle } from "lucide-react";
import {
  EditMedicineInputTextArrey,
  EditMedicineTextareaArrey,
} from "@/ascents/constans";
import { Textarea } from "./ui/textarea";

export default function EditButton({ medicine }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(medicine);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [newPublicId, setNewPublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      try {
        const decoded: any = jwtDecode(savedToken);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);

  if (userRole !== "ADMIN") return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let uploadedImage = {
        imageUrl: form.imageUrl,
        imagePublicId: form.imagePublicId,
      };

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        uploadedImage = {
          imageUrl: data.secure_url,
          imagePublicId: data.public_id,
        };
      }

      const res = await fetch(`/api/medicine`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          ...uploadedImage,
        }),
      });

      if (!res.ok) throw new Error("Алдаа гарлаа");

      toast.success("Эмийн мэдээлэл шинэчлэгдлээ");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addDoseUsage = () => {
    setForm((prev: any) => ({
      ...prev,
      doseUsage: [...(prev.doseUsage || []), { age: "", dose: "", time: "" }],
    }));
  };

  const removeDoseUsage = (index: number) => {
    setForm((prev: any) => {
      const updated = [...prev.doseUsage];
      updated.splice(index, 1);
      return {
        ...prev,
        doseUsage: updated.length ? updated : [{ age: "", dose: "", time: "" }],
      };
    });
  };

  return (
    <>
      {userRole === "ADMIN" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Засах
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Эмийн мэдээлэл засах</DialogTitle>
              <DialogDescription>
                Та дараах талбаруудыг засварлаад хадгална уу.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {EditMedicineInputTextArrey.map((el, id) => (
                <div key={id}>
                  <Label htmlFor={el.name} className="mb-2">
                    {el.label}
                  </Label>
                  <Input
                    id={el.name}
                    name={el.name}
                    value={form[el.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}

              {EditMedicineTextareaArrey.map((el, i) => (
                <div key={i}>
                  <Label htmlFor={el.name} className="mb-2">
                    {el.label}
                  </Label>
                  <Textarea
                    name={el.name}
                    value={form[el.name] || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              {form.prohibitionsPrecautions.map((el: any, i: number) => (
                <div key={i} className="space-y-2">
                  <label>Хориглох заалт</label>
                  <Textarea
                    value={el.prohibitions}
                    onChange={(e) => {
                      const updated = [...form.prohibitionsPrecautions];
                      updated[i].prohibitions = e.target.value;
                      setForm((prev: any) => ({
                        ...prev,
                        prohibitionsPrecautions: updated,
                      }));
                    }}
                    className="border p-2 w-full"
                  />

                  <label>Анхаарах зүйлс</label>
                  <Textarea
                    value={el.precautions}
                    onChange={(e) => {
                      const updated = [...form.prohibitionsPrecautions];
                      updated[i].precautions = e.target.value;
                      setForm((prev: any) => ({
                        ...prev,
                        prohibitionsPrecautions: updated,
                      }));
                    }}
                    className="border p-2 w-full"
                  />
                </div>
              ))}

              {form.interactionWithOtherDrugs.map((el: any, i: number) => (
                <div key={i} className="space-y-2">
                  <label>Бусад эмтэй эерэг харилцан үйлчлэл</label>
                  <Textarea
                    value={el.positive}
                    onChange={(e) => {
                      const updated = [...form.interactionWithOtherDrugs];
                      updated[i].positive = e.target.value;
                      setForm((prev: any) => ({
                        ...prev,
                        interactionWithOtherDrugs: updated,
                      }));
                    }}
                    className="border p-2 w-full"
                  />

                  <label>Бусад эмтэй сөрөг харилцан үйлчлэл</label>
                  <Textarea
                    value={el.negative}
                    onChange={(e) => {
                      const updated = [...form.interactionWithOtherDrugs];
                      updated[i].negative = e.target.value;
                      setForm((prev: any) => ({
                        ...prev,
                        interactionWithOtherDrugs: updated,
                      }));
                    }}
                    className="border p-2 w-full"
                  />
                </div>
              ))}

              <div>
                <div className="col-span-2 border p-3 rounded-md border-black mb-3">
                  <label className="font-semibold mb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Эмийн зураг
                  </label>
                  <div className="flex gap-2">
                    {(previewUrl || form.imageUrl) && (
                    <img
                      src={previewUrl ?? form.imageUrl}
                      alt="Medicine"
                      className="max-h-24 object-cover rounded-md border"
                    />
                  )}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("imageInput")?.click()
                      }
                      className="items-end-safe"
                    >
                      Зураг солих
                    </Button>

                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  
                </div>

                <Label className="font-semibold mb-2">Уух тун</Label>
                {form.doseUsage?.map((el: any, i: number) => (
                  <div key={i} className="grid grid-cols-4 gap-1 mb-2">
                    <Input
                      placeholder="Нас"
                      value={el.age}
                      onChange={(e) => {
                        const updated = [...form.doseUsage];
                        updated[i].age = e.target.value;
                        setForm((prev: any) => ({
                          ...prev,
                          doseUsage: updated,
                        }));
                      }}
                    />

                    <Input
                      placeholder="Тун"
                      value={el.dose}
                      onChange={(e) => {
                        const updated = [...form.doseUsage];
                        updated[i].dose = e.target.value;
                        setForm((prev: any) => ({
                          ...prev,
                          doseUsage: updated,
                        }));
                      }}
                    />

                    <Input
                      placeholder="Хугацаа"
                      value={el.time}
                      onChange={(e) => {
                        const updated = [...form.doseUsage];
                        updated[i].time = e.target.value;
                        setForm((prev: any) => ({
                          ...prev,
                          doseUsage: updated,
                        }));
                      }}
                    />

                    <Button
                      type="button"
                      onClick={() => removeDoseUsage(i)}
                      className="w-10 rounded bg-red-500"
                    >
                      <CircleMinus />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addDoseUsage}
                  className="px-3 py-1 rounded bg-green-500"
                >
                  <PlusCircle />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Болих
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
