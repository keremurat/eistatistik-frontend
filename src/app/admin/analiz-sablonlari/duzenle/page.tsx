"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SablonForm } from "../SablonForm";
import { getSablon } from "../data";

function EditSablon() {
  const params = useSearchParams();
  const base = getSablon(params.get("id") ?? "") ?? null;
  return <SablonForm mode="duzenle" base={base} />;
}

export default function SablonDuzenlePage() {
  return <Suspense fallback={null}><EditSablon /></Suspense>;
}
