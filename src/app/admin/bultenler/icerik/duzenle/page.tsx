"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { IcerikForm } from "../../IcerikForm";
import { getIcerik } from "../../data";

function EditIcerik() {
  const params = useSearchParams();
  const base = getIcerik(params.get("id") ?? "") ?? null;
  return <IcerikForm mode="duzenle" base={base} />;
}

export default function IcerikDuzenlePage() {
  return <AdminShell><Suspense fallback={null}><EditIcerik /></Suspense></AdminShell>;
}
