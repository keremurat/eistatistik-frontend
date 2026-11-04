"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HizmetForm } from "../HizmetForm";
import { Hizmet, readHizmetler } from "../data";

function EditHizmet() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const [item, setItem] = useState<Hizmet | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItem(readHizmetler().find((record) => record.id === id) ?? null));
    return () => cancelAnimationFrame(frame);
  }, [id]);

  if (item === undefined) return null;
  return <HizmetForm key={item?.id ?? "missing"} mode="duzenle" base={item} />;
}

export default function HizmetDuzenlePage() {
  return <Suspense fallback={null}><EditHizmet /></Suspense>;
}
