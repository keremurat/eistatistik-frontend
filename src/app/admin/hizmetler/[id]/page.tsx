"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HizmetForm } from "../HizmetForm";
import { Hizmet, readHizmetler } from "../data";

export default function HizmetDetayPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Hizmet | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItem(readHizmetler().find((record) => record.id === params.id) ?? null));
    return () => cancelAnimationFrame(frame);
  }, [params.id]);

  if (item === undefined) return null;
  return <HizmetForm key={item?.id ?? "missing"} mode="duzenle" base={item} />;
}
