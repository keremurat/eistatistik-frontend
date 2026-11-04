"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { LessonDetail } from "../[id]/page";

function EditFromQuery() {
  const params = useSearchParams();
  return <LessonDetail id={params.get("id") ?? ""} />;
}

export default function DersDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditFromQuery />
      </Suspense>
    </AdminShell>
  );
}
