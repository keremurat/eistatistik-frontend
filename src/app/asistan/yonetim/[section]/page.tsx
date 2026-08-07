import { AssistantHeader } from "../../AssistantHeader";
import { notFound } from "next/navigation";
import { EducationListContent } from "../../../admin/egitim-talepleri/egitim-listesi/page";
import { UserListContent } from "../../../admin/kullanici-yonetimi/page";
import { AnnouncementsContent } from "../../../admin/duyurular/page";
import { TaskKanbanContent } from "../../../admin/gorev-isleri/gorev-listesi-kart/page";

const titles: Record<string, string> = {
  "egitim-listesi": "Eğitim Listesi",
  kullanicilar: "Kullanıcılar",
  duyurular: "Duyurular",
  "gorev-listesi": "Görev Listesi",
};

export default async function AssistantManagementPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const title = titles[section];
  if (!title) notFound();
  if (section === "egitim-listesi") return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><EducationListContent basePath="/asistan/yonetim/egitim-listesi" /></main>
  </div>;
  if (section === "kullanicilar") return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><UserListContent basePath="/asistan/yonetim/kullanicilar" /></main>
  </div>;
  if (section === "duyurular") return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><AnnouncementsContent basePath="/asistan/yonetim/duyurular" /></main>
  </div>;
  if (section === "gorev-listesi") return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><TaskKanbanContent /></main>
  </div>;
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash">
      <header className="orders-hero"><div><p className="eyebrow">YÖNETİM</p><h1>{title}</h1><p>Bu yönetim alanındaki kayıtları görüntüleyin ve yönetin.</p></div></header>
    </main>
  </div>;
}
