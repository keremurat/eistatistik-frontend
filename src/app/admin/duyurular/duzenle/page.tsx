"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DuyuruForm } from "../DuyuruForm";
import { DUYURULAR } from "../data";

function EditInner() {
  const params = useSearchParams();
  const id     = Number(params.get("id") ?? 0);
  const duyuru = DUYURULAR.find((d) => d.id === id);
  return <DuyuruForm mode="duzenle" initial={duyuru} />;
}

export default function DuyuruDuzenlePage() {
  return (
    <Suspense fallback={null}>
      <EditInner />
    </Suspense>
  );
}
