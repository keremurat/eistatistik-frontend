"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AdminShell } from "../../AdminShell";

function RedirectToAppointment() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    router.replace(id ? `/admin/randevular/${encodeURIComponent(id)}` : "/admin/randevular");
  }, [id, router]);

  return null;
}

export default function EditAppointmentPage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <RedirectToAppointment />
      </Suspense>
    </AdminShell>
  );
}
