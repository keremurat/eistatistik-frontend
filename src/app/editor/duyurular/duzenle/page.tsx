"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DuyuruForm } from "../../../admin/duyurular/DuyuruForm";
import { DUYURULAR } from "../../../admin/duyurular/data";

function EditorAnnouncementEdit() {
  const params = useSearchParams();
  const announcement = DUYURULAR.find((item) => item.id === Number(params.get("id") ?? 0));
  return <DuyuruForm mode="duzenle" initial={announcement} basePath="/editor/duyurular" />;
}

export default function EditorAnnouncementEditPage() {
  return <Suspense fallback={null}><EditorAnnouncementEdit /></Suspense>;
}
