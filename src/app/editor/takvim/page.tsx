import { AdminShell } from "../../admin/AdminShell";
import { CalendarContent } from "../../admin/takvim/page";

export default function EditorCalendarPage() {
  return <AdminShell>
    <div className="st-page">
      <header className="orders-hero"><h1>Takvim</h1></header>
      <CalendarContent basePath="/editor/siparisler" showOwner />
    </div>
  </AdminShell>;
}
