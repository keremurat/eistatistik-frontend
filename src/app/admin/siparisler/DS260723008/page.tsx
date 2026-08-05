import { Suspense } from "react";
import { AdminShell } from "../../AdminShell";
import { SharedOrderDetail } from "./OrderDetailContent";

export default function AdminOrderDetailPage() {
  return <AdminShell><Suspense><SharedOrderDetail /></Suspense></AdminShell>;
}
