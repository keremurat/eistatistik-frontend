import { AssistantHeader } from "../AssistantHeader";
import { CalendarContent } from "../../admin/takvim/page";

export default function AssistantCalendarPage() {
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash assistant-calendar-main">
      <div className="st-page">
        <header className="orders-hero"><h1>Takvim</h1></header>
        <CalendarContent basePath="/asistan/siparisler" showOwner onePage />
      </div>
    </main>
  </div>;
}
