"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "../../../../admin/AdminShell";
import { EducationDetail } from "../../../../admin/egitim-talepleri/egitim-listesi/[id]/page";

export default function EditorEducationDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <EducationDetail id={params.id} />
    </AdminShell>
  );
}
