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
import { CircleMinus, PlusCircle } from "lucide-react";
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

  const [prohibitionsPrecautions] = useState([
    { prohibitions: "", precautions: "" },
  ]);

  const [interactionWithOtherDrugs] = useState([
    { positive: "", negative: "" },
  ]);

const [children, setChildren] = useState([{ age: "", dose: "", time: "" }]);

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

  const handleChangeSelect = (e: any) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value === "true" ? true : value === "false" ? false : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/medicine?id=${medicine.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Засварлах явцад алдаа гарлаа");
      }

      toast.success("Эмийн мэдээлэл амжилттай шинэчлэгдлээ");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

const addChild = () => {
  setForm((prev: any) => ({
    ...prev,
    child: [...(prev.child || []), { age: "", dose: "", time: "" }]
  }));
};


  const removeChildDose = (index: number) => {
  setForm((prev: any) => {
    const updated = [...prev.child];
    updated.splice(index, 1);
    return {
      ...prev,
      child: updated.length ? updated : [{ age: "", dose: "", time: "" }]
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
              <Label htmlFor="conditionsOfIssue" className="">
                Жортой, Жоргүй
              </Label>
              <select
                name="conditionsOfIssue"
                value={String(form.conditionsOfIssue)}
                onChange={handleChangeSelect}
                className="border border-gray-200 rounded-sm p-2"
              >
                <option value="false">Жоргүй</option>
                <option value="true">Жортой</option>
              </select>

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
                      const updated = [...prohibitionsPrecautions];
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
                      const updated = [...prohibitionsPrecautions];
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
                      const updated = [...interactionWithOtherDrugs];
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
                      const updated = [...interactionWithOtherDrugs];
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

              <Label className="font-semibold ">Насанд хүрэгчдийн тун</Label>
              {form.adult?.map((el: any, i: number) => (
                <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                  <Input
                    placeholder="Тун"
                    value={el.dose}
                    onChange={(e) => {
                      const updated = [...form.adult];
                      updated[i].dose = e.target.value;
                      setForm((prev: any) => ({ ...prev, adult: updated }));
                    }}
                  />
                  <Input
                    placeholder="Хугацаа"
                    value={el.time}
                    onChange={(e) => {
                      const updated = [...form.adult];
                      updated[i].time = e.target.value;
                      setForm((prev: any) => ({ ...prev, adult: updated }));
                    }}
                  />
                </div>
              ))}
              <div>
                <Label className="font-semibold mb-2">Хүүхдийн тун</Label>
                {form.child?.map((el: any, i: number) => (
                  <div key={i} className="grid grid-cols-4 gap-1 mb-2">
                    <Input
                      placeholder="Нас"
                      value={el.age}
                      onChange={(e) => {
                        const updated = [...form.child];
                        updated[i].age = e.target.value;
                        setForm((prev: any) => ({ ...prev, child: updated }));
                      }}
                    />
                    <Input
                      placeholder="Тун"
                      value={el.dose}
                      onChange={(e) => {
                        const updated = [...form.child];
                        updated[i].dose = e.target.value;
                        setForm((prev: any) => ({ ...prev, child: updated }));
                      }}
                    />
                    <Input
                      placeholder="Хугацаа"
                      value={el.time}
                      onChange={(e) => {
                        const updated = [...form.child];
                        updated[i].time = e.target.value;
                        setForm((prev: any) => ({ ...prev, child: updated }));
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => removeChildDose(i)}
                      className="w-10 rounded bg-red-500"
                    >
                      <CircleMinus />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addChild}
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
