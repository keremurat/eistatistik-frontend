"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IcerikForm } from "../../IcerikForm";
import { Icerik, readIcerikler } from "../../data";

function EditIcerik() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const [item, setItem] = useState<Icerik | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItem(readIcerikler().find((record) => record.id === id) ?? null));
    return () => cancelAnimationFrame(frame);
  }, [id]);

  if (item === undefined) return null;
  return <IcerikForm key={item?.id ?? "missing"} mode="duzenle" base={item} />;
}

export default function IcerikDuzenlePage() {
  return <Suspense fallback={null}><EditIcerik /></Suspense>;
}
