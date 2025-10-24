"use client";

import {
  NewMedicineCreateInputTextArrey,
  NewMedicineCreateTextareaArrey,
} from "@/ascents/constans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleMinus, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function NewMedicinePage() {
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
        setChildren(
          updated.length ? updated : [{ age: "", dose: "", time: "" }]
        );
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      Object.values(form).some((v) => v === "") ||
      children.some((c) => Object.values(c).some((v) => v === ""))
    ) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    try {
      const res = await fetch("/api/medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          no: parseInt(form.no),
          barcode: form.barcode ? BigInt(form.barcode).toString() : null,
          conditionsOfIssue: form.conditionsOfIssue === "true",
          prohibitionsPrecautions: [
            {
              prohibitions: form.prohibitions,
              precautions: form.precautions,
            },
          ],
          interactionWithOtherDrugs: [
            {
              positive: form.positive,
              negative: form.negative,
            },
          ],
          adult: [
            {
              dose: form.adultDose,
              time: form.adultTime,
            },
          ],
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
      }
    } catch (err) {
      console.error("Error creating medicine:", err);
      alert("Серверийн алдаа гарлаа.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Шинэ эм бүртгэх</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {NewMedicineCreateInputTextArrey.map((el, index) => (
          <Input
            key={index}
            name={el.name}
            type={el.type || "text"}
            placeholder={el.placeholder}
            value={form[el.name as keyof typeof form]}
            onChange={handleChange}
            required
            className="border p-2"
          />
        ))}

        <select
          name="conditionsOfIssue"
          value={form.conditionsOfIssue}
          onChange={handleChange}
          required
          className="border p-2"
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
            className="border p-2 col-span-2"
          />
        ))}

        <div className="col-span-2 grid grid-cols-2 gap-2">
          <Input
            name="adultDose"
            placeholder="Насанд хүрэгчдийн тун"
            value={form.adultDose}
            onChange={handleChange}
            required
          
          />
          <Input
            name="adultTime"
            placeholder="Насанд хүрэгчдийн хэрэглэх хугацаа"
            value={form.adultTime}
            onChange={handleChange}
            required
            className="border p-2"
          />
        </div>

        <div className="col-span-2 border p-3 rounded">
          <h2 className="font-semibold mb-2">Хүүхдийн тунгийн мэдээлэл</h2>
          {children.map((child, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
              <Input
                placeholder="Нас"
                value={child.age}
                onChange={(e) =>
                  handleChildChange(index, "age", e.target.value)
                }
                required
              />
              <Input
                placeholder="Тун"
                value={child.dose}
                onChange={(e) =>
                  handleChildChange(index, "dose", e.target.value)
                }
                className="border p-2"
                required
              />
              <Input
                placeholder="Хугацаа"
                value={child.time}
                onChange={(e) =>
                  handleChildChange(index, "time", e.target.value)
                }
                className="border p-2"
                required
              />
              <div>
                <Button
                type="button"
                onClick={() => removeChildDose(index)}
                className="px-2 py-1 rounded col-span-3"
              >
              <CircleMinus/>
              </Button>
              </div>

              
            </div>
          ))}
          <Button
            type="button"
            onClick={addChild}
            className="px-3 py-1 rounded"
          >
            <PlusCircle/>
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
