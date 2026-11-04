"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminShell } from "../../AdminShell";

function RedirectToAnnouncement() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    router.replace(id ? `/admin/duyurular/${encodeURIComponent(id)}` : "/admin/duyurular");
  }, [id, router]);

  return null;
}

export default function DuyuruDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <RedirectToAnnouncement />
      </Suspense>
    </AdminShell>
  );
}
