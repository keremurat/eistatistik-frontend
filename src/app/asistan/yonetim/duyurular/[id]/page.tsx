"use client";

import { useParams } from "next/navigation";
import { AnnouncementDetail } from "../../../../admin/duyurular/[id]/page";
import { AssistantHeader } from "../../../AssistantHeader";

export default function AssistantAnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <div className="app-shell customer-shell">
      <AssistantHeader />
      <main className="admin-dash">
        <AnnouncementDetail id={params.id} basePath="/asistan/yonetim/duyurular" />
      </main>
    </div>
  );
}
