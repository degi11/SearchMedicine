"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { DeleteButtonProps } from "@/types";



export default function DeleteButton({ medicineId }: DeleteButtonProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      try {
        const decoded: any = jwtDecode(savedToken);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Token decode алдаа:", err);
      }
    }
  }, []);

  if (userRole !== "ADMIN") return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/medicine?id=${medicineId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Устгах явцад алдаа гарлаа");
      }

       toast.success("Эм амжилттай устгагдлаа")
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger
          asChild
          className={`bg-red-500 hover:bg-red-600 text-white ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <Button variant="outline">Устгах</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Та устгахдаа итгэлтэй байна уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Буцааж болохгүй бүр мөсөн устана. Та энэ эмийн мэдээлэлийг
              устгахдаа итгэлтэй байна уу?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Устгах</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
