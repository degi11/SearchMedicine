"use client";

import { useEffect, useState } from "react";
import Search from "@/components/search";
import HomeSkeleton from "./homeSkeleton";

export default function HomeClient() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("visited");
    }
    return true;
  });

  useEffect(() => {
    if (!loading) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem("visited", "true");
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      {loading && <HomeSkeleton />}
      {!loading && <Search />}
    </>
  );
}
