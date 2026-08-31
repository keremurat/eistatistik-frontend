"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BultenForm } from "../BultenForm";
import { getBulten } from "../data";

function EditBulten() {
  const params = useSearchParams();
  const bulten = getBulten(params.get("id") ?? "");
  return <BultenForm mode="duzenle" initial={bulten ?? {}} />;
}

export default function BultenDuzenlePage() {
  return <Suspense fallback={null}><EditBulten /></Suspense>;
}
