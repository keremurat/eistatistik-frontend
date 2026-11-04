"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminShell } from "../../../admin/AdminShell";

function RedirectToAnnouncement() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    router.replace(id ? `/editor/duyurular/${encodeURIComponent(id)}` : "/editor/duyurular");
  }, [id, router]);

  return null;
}

export default function EditorAnnouncementEditPage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <RedirectToAnnouncement />
      </Suspense>
    </AdminShell>
  );
}
