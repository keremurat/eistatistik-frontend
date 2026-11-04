"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SablonForm } from "../SablonForm";
import { Sablon, readSablonlar } from "../data";

export default function SablonDetayPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Sablon | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItem(readSablonlar().find((record) => record.id === params.id) ?? null));
    return () => cancelAnimationFrame(frame);
  }, [params.id]);

  if (item === undefined) return null;
  return <SablonForm key={item?.id ?? "missing"} mode="duzenle" base={item} />;
}
