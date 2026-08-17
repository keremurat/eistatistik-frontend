import { AdminShell } from "../../admin/AdminShell";
import { CalendarContent } from "../../admin/takvim/page";

export default function EditorCalendarPage() {
  return <AdminShell><CalendarContent basePath="/editor/siparisler" showOwner /></AdminShell>;
}
