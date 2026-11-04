"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SablonForm } from "../SablonForm";
import { Sablon, readSablonlar } from "../data";

function EditSablon() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const [item, setItem] = useState<Sablon | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItem(readSablonlar().find((record) => record.id === id) ?? null));
    return () => cancelAnimationFrame(frame);
  }, [id]);

  if (item === undefined) return null;
  return <SablonForm key={item?.id ?? "missing"} mode="duzenle" base={item} />;
}

export default function SablonDuzenlePage() {
  return <Suspense fallback={null}><EditSablon /></Suspense>;
}
