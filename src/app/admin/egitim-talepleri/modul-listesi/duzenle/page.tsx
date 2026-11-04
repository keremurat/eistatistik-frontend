"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { ModuleDetail } from "../[id]/page";

function EditFromQuery() {
  const params = useSearchParams();
  return <ModuleDetail id={params.get("id") ?? ""} />;
}

export default function ModulDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditFromQuery />
      </Suspense>
    </AdminShell>
  );
}
