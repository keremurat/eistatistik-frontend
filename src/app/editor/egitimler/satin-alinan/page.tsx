import { AdminShell } from "../../../admin/AdminShell";
import { PurchasedEducationsContent } from "../../../admin/egitimler/satin-alinan/page";

export default function EditorPurchasedEducationsPage() {
  return <AdminShell><PurchasedEducationsContent basePath="/editor/egitimler" /></AdminShell>;
}
