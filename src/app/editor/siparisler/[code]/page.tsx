import { Suspense } from "react";
import { AdminShell } from "../../../admin/AdminShell";
import { SharedOrderDetail } from "../../../admin/siparisler/DS260723008/OrderDetailContent";

export default async function EditorOrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <AdminShell><Suspense><SharedOrderDetail audience="editor" orderCode={code} /></Suspense></AdminShell>;
}
