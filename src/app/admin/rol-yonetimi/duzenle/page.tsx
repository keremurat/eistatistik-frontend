"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { RoleDetail } from "../[key]/page";

function EditFromQuery() {
  const params = useSearchParams();
  return <RoleDetail roleKey={params.get("rol") ?? ""} />;
}

export default function RolDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditFromQuery />
      </Suspense>
    </AdminShell>
  );
}
