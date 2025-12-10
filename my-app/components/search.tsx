"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import MedicineCard from "./medicine-card";
import { Spinner } from "./ui/spinner";

export default function Search() {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const triggerSearch = (q: string, bc: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (bc) params.set("barcode", bc);

        const res = await fetch(`/api/search-medicine?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to search");

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  useEffect(() => {
    if (!name && !barcode) {
      setResults([]);
      return;
    }
    triggerSearch(name, barcode);
  }, [name, barcode]);

  return (
    <div className="w-7xl mx-auto mt-8 p-4">
      <form className="grid grid-rows-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Эмийн нэр (MN/EN)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 border-black shadow-md"
          />
        </div>

        <div className="flex">
          <Input
            ref={barcodeRef}
            placeholder="Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="h-12 border-black shadow-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                triggerSearch(name, barcode);
              }
            }}
          />
        </div>
      </form>

      {loading && (
        <div className="flex items-center gap-1">
          <Spinner />
          <p className="text-gray-500">Хайж байна...</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((el) => (
          <MedicineCard
            key={el.id}
            id={el.id}
            conditionsOfIssue={el.conditionsOfIssue}
            medicineName={el.tradeNameMN || el.tradeNameEN || "Нэргүй"}
            dosage={el.dosage || ""}
            no={el.no || ""}
            dosageForm={el.dosageForm || ""}
            registered={el.registered || ""}
            country={el.country || ""}
            storageConditions={el.storageConditions || ""}
            image={el.image || null}
          />
        ))}
      </div>

      {!loading && results.length === 0 && (name || barcode) && (
        <p className="text-center text-gray-500 mt-6">
          Үр дүн олдсонгүй.
        </p>
      )}
    </div>
  );
}
