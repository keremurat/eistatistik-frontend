import { AssistantHeader } from "../AssistantHeader";
import { CalendarContent } from "../../admin/takvim/page";

export default function AssistantCalendarPage() {
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash assistant-calendar-main">
      <CalendarContent basePath="/asistan/siparisler" showOwner onePage />
    </main>
  </div>;
}
