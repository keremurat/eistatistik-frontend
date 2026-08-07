"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DuyuruForm } from "../../../../admin/duyurular/DuyuruForm";
import { DUYURULAR } from "../../../../admin/duyurular/data";
import { AssistantHeader } from "../../../AssistantHeader";

function EditContent() {
  const params = useSearchParams();
  const announcement = DUYURULAR.find(item => item.id === Number(params.get("id") ?? 0));
  return <DuyuruForm mode="duzenle" initial={announcement} embedded basePath="/asistan/yonetim/duyurular" />;
}

export default function AssistantAnnouncementEditPage() {
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><Suspense fallback={null}><EditContent /></Suspense></main>
  </div>;
}
