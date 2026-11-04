"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "../../../admin/AdminShell";
import { DiscountDetail } from "../../../admin/indirim-kodlari/[id]/page";

export default function EditorDiscountDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <DiscountDetail id={params.id} />
    </AdminShell>
  );
}
