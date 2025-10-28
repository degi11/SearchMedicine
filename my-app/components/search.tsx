"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import MedicineCard from "./medicine-card";

export default function Search() {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const triggerSearch = (q: string, bc: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (bc) params.set("barcode", bc);

        const res = await fetch(`/api/medicine/search-medicine?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to search");

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce
  };

  useEffect(() => {
    if (!name && !barcode) {
      setResults([]);
      return;
    }
    triggerSearch(name, barcode);
  }, [name, barcode]);

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Эмийн нэр (MN/EN)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 border-black"
          />
        </div>
        <div>
          <Input
            placeholder="Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="h-12 border-black"
          />
        </div>
      </form>

      {loading && <p className="mt-4 text-gray-500">Хайж байна...</p>}

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((med) => (
          <MedicineCard
            key={med.id}
            medicineName={med.tradeNameMN || med.tradeNameEN || "Нэргүй"}
            dosage={med.dosage || ""}
            no={med.no || ""}
            dosageForm={med.dosageForm || ""}
            registered={med.registered || ""}
            country={med.country || ""}
            image={med.image || null}
          />
        ))}
      </div>

      {!loading && results.length === 0 && (name || barcode) && (
        <p className="text-center text-gray-500 mt-6">Үр дүн олдсонгүй.</p>
      )}
    </div>
  );
}
