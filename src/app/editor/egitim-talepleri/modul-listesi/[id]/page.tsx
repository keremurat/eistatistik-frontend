"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "../../../../admin/AdminShell";
import { ModuleDetail } from "../../../../admin/egitim-talepleri/modul-listesi/[id]/page";

export default function EditorModuleDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <ModuleDetail id={params.id} />
    </AdminShell>
  );
}
