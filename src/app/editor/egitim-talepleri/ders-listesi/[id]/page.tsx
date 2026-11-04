"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "../../../../admin/AdminShell";
import { LessonDetail } from "../../../../admin/egitim-talepleri/ders-listesi/[id]/page";

export default function EditorLessonDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <LessonDetail id={params.id} />
    </AdminShell>
  );
}
