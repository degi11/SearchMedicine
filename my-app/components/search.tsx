"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import MedicineCard from "./medicine-card";
import { Spinner } from "./ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const bc = searchParams.get("barcode") || "";

    setName(q);
    setBarcode(bc);
  }, []);

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const triggerSearch = (q: string, bc: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!q && !bc) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (bc) params.set("barcode", bc);

        const query = params.toString();

        router.replace(`?${query}`);

        const res = await fetch(`/api/search-medicine?${query}`);
        if (!res.ok) throw new Error("failed");

        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  useEffect(() => {
    triggerSearch(name, barcode);
  }, [name, barcode]);

  return (
    <div className="  w-7xl mt-8 p-4">
      <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
        <Input
          placeholder="Эмийн нэр"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 border-black shadow-md"
        />
        <Input
          ref={barcodeRef}
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="h-12 border-black shadow-md"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 mt-4">
          <Spinner />
          <p className="text-gray-500">Хайж байна...</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((el) => (
          <MedicineCard
            key={el.id}
            id={el.id}
            medicineName={el.tradeNameMN || el.tradeNameEN}
            dosage={el.dosage || ""}
            no={el.no || ""}
            dosageForm={el.dosageForm || ""}
            registered={el.registered || ""}
            conditionsOfIssue={el.conditionsOfIssue || ""}
            country={el.country || ""}
            storageConditions={el.storageConditions || ""}
            imageUrl={el.imageUrl || null}
          />
        ))}
      </div>

      {!loading && results.length === 0 && (name || barcode) && (
        <p className="text-center text-gray-500 mt-6">
          Үр дүн олдсонгүй
        </p>
      )}
    </div>
  );
}