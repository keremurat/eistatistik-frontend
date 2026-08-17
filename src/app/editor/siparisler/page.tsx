import { AdminShell } from "../../admin/AdminShell";
import { SharedOrdersList } from "../../admin/siparisler/page";

export default function EditorOrdersPage() {
  return <AdminShell><SharedOrdersList basePath="/editor/siparisler" /></AdminShell>;
}
