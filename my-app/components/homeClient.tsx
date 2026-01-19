"use client";

import { useEffect, useState } from "react";
import Search from "@/components/search";
import HomeSkeleton from "./homeSkeleton";

export default function HomeClient() {
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const visited = sessionStorage.getItem("visited");

    if (visited) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("visited", "true");
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [hydrated]);

  if (!hydrated) {
    return <HomeSkeleton />;
  }

  return (
    <>
      {loading && <HomeSkeleton />}
      {!loading && <Search />}
    </>
  );
}
