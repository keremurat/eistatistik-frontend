"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AssistantHeader } from "../../../AssistantHeader";

function RedirectToAnnouncement() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    router.replace(id ? `/asistan/yonetim/duyurular/${encodeURIComponent(id)}` : "/asistan/yonetim/duyurular");
  }, [id, router]);

  return null;
}

export default function AssistantAnnouncementEditPage() {
  return (
    <div className="app-shell customer-shell">
      <AssistantHeader />
      <main className="admin-dash">
        <Suspense fallback={null}>
          <RedirectToAnnouncement />
        </Suspense>
      </main>
    </div>
  );
}
