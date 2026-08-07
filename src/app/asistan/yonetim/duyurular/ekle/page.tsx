import { DuyuruForm } from "../../../../admin/duyurular/DuyuruForm";
import { AssistantHeader } from "../../../AssistantHeader";

export default function AssistantAnnouncementCreatePage() {
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><DuyuruForm mode="ekle" embedded basePath="/asistan/yonetim/duyurular" /></main>
  </div>;
}
