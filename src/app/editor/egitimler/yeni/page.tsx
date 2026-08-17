import { AdminShell } from "../../../admin/AdminShell";
import { NewEducationContent } from "../../../admin/egitimler/yeni/page";

export default function EditorNewEducationPage() {
  return <AdminShell><NewEducationContent basePath="/editor/egitimler" /></AdminShell>;
}
