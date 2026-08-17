import { AdminShell } from "../../admin/AdminShell";
import { AnnouncementsContent } from "../../admin/duyurular/page";

export default function EditorAnnouncementsPage() {
  return <AdminShell><AnnouncementsContent basePath="/editor/duyurular" /></AdminShell>;
}
