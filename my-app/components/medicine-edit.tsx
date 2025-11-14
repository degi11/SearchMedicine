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

interface EditButtonProps {
  medicine: any;
}

export default function EditButton({ medicine }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(medicine);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
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

      toast.success("Эмийн мэдээлэл амжилттай шинэчлэгдлээ ✅");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Серверийн алдаа гарлаа ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
          Засах
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Эмийн мэдээлэл засах</DialogTitle>
          <DialogDescription>
            Та дараах талбаруудыг засварлаад хадгална уу.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="tradeNameMN">Монгол нэр</Label>
            <Input
              id="tradeNameMN"
              name="tradeNameMN"
              value={form.tradeNameMN || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="tradeNameEN">Англи нэр</Label>
            <Input
              id="tradeNameEN"
              name="tradeNameEN"
              value={form.tradeNameEN || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="country">Үйлдвэрлэсэн улс</Label>
            <Input
              id="country"
              name="country"
              value={form.country || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="dosage">Тун</Label>
            <Input
              id="dosage"
              name="dosage"
              value={form.dosage || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="dosageForm">Хэлбэр</Label>
            <Input
              id="dosageForm"
              name="dosageForm"
              value={form.dosageForm || ""}
              onChange={handleChange}
            />
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
  );
}
