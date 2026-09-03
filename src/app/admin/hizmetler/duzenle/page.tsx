"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HizmetForm } from "../HizmetForm";
import { getHizmet } from "../data";

function EditHizmet() {
  const params = useSearchParams();
  const base = getHizmet(params.get("id") ?? "") ?? null;
  return <HizmetForm mode="duzenle" base={base} />;
}

export default function HizmetDuzenlePage() {
  return <Suspense fallback={null}><EditHizmet /></Suspense>;
}
