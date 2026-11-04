"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IcerikForm } from "../../bultenler/IcerikForm";
import { Icerik, readIcerikler } from "../../bultenler/data";

export default function IcerikDetayPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Icerik | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItem(readIcerikler().find((record) => record.id === params.id) ?? null));
    return () => cancelAnimationFrame(frame);
  }, [params.id]);

  if (item === undefined) return null;
  return <IcerikForm key={item?.id ?? "missing"} mode="duzenle" base={item} />;
}
