"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { EducationDetail } from "../[id]/page";

function EditFromQuery() {
  const params = useSearchParams();
  return <EducationDetail id={params.get("id") ?? ""} />;
}

export default function EgitimDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditFromQuery />
      </Suspense>
    </AdminShell>
  );
}
