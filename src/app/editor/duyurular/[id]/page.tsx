"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "../../../admin/AdminShell";
import { AnnouncementDetail } from "../../../admin/duyurular/[id]/page";

export default function EditorAnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <AnnouncementDetail id={params.id} basePath="/editor/duyurular" />
    </AdminShell>
  );
}
