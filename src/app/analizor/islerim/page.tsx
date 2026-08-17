"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { NotificationMenu } from "../../components/NotificationMenu";
import { ProfileMenu } from "../../components/ProfileMenu";
import { CustomerEducationMenu } from "../../components/CustomerEducationMenu";
import { SystemDropdown } from "../../components/SystemDropdown";

type WorkStatus = "new" | "active" | "waiting" | "delivery" | "completed";
type WorkFilter = "all" | WorkStatus;
type IconName = "arrow" | "calendar" | "clock" | "file" | "home" | "search" | "tasks" | "video";

type Work = {
  code: string;
  title: string;
  customer: string;
  status: WorkStatus;
  statusLabel: string;
  detail: string;
  due: string;
  remaining: string;
  progress: number;
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    tasks: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const works: Work[] = [
  { code: "SA260803014", title: "Yüksek lisans tezi veri analizi", customer: "Kerem Murat", status: "delivery", statusLabel: "Teslime hazırlanıyor", detail: "Rapor son kontrolde", due: "Bugün · 17:00", remaining: "4 saat", progress: 82 },
  { code: "SA260801009", title: "Regresyon analizi ve yorumlama", customer: "Derya Aydın", status: "active", statusLabel: "Analiz devam ediyor", detail: "Çalışma dosyaları incelendi", due: "5 Ağustos", remaining: "2 gün", progress: 58 },
  { code: "EA260729004", title: "Ek analiz değerlendirmesi", customer: "Mehmet Kaya", status: "waiting", statusLabel: "Müşteri yanıtı bekleniyor", detail: "Eksik değişken açıklaması istendi", due: "7 Ağustos", remaining: "4 gün", progress: 34 },
  { code: "PA260802006", title: "Power ve örneklem analizi", customer: "Selin Demir", status: "new", statusLabel: "Yeni atandı", detail: "Dosyalar henüz incelenmedi", due: "4 Ağustos", remaining: "1 gün", progress: 8 },
  { code: "SA260728002", title: "Ölçek geçerlilik ve güvenilirlik analizi", customer: "Onur Şen", status: "completed", statusLabel: "Teslim edildi", detail: "Müşteriye iletildi", due: "31 Temmuz", remaining: "Tamamlandı", progress: 100 },
];

const filters: { key: WorkFilter; label: string }[] = [
  { key: "all", label: "Tüm işler" }, { key: "new", label: "Yeni atanan" }, { key: "active", label: "Devam eden" },
  { key: "waiting", label: "Yanıt bekleyen" }, { key: "delivery", label: "Teslime yakın" }, { key: "completed", label: "Tamamlanan" },
];

export default function AnalystWorksPage() {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("urgent");

  const counts = useMemo(() => Object.fromEntries(filters.map(item => [item.key, item.key === "all" ? works.length : works.filter(work => work.status === item.key).length])) as Record<WorkFilter, number>, []);
  const visibleWorks = useMemo(() => {
    const normalized = query.toLocaleLowerCase("tr");
    const result = works.filter(work => (filter === "all" || work.status === filter) && `${work.code} ${work.title} ${work.customer}`.toLocaleLowerCase("tr").includes(normalized));
    return sort === "progress" ? [...result].sort((a, b) => b.progress - a.progress) : result;
  }, [filter, query, sort]);

  return <div className="app-shell">
    <a className="skip-link" href="#analyst-works">İçeriğe geç</a>
    <header className="topbar">
      <Link className="brand" href="/analizor"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority /></Link>
      <nav className="main-nav" aria-label="Analizör navigasyonu">
        <Link href="/analizor"><Icon name="home" />Genel bakış</Link>
        <Link className="active" href="/analizor/islerim"><Icon name="tasks" />İşlerim</Link>
        <CustomerEducationMenu />
        <Link href="/analizor/gorusmeler"><Icon name="video" />Görüşmeler</Link>
        <Link href="/analizor/takvim"><Icon name="calendar" />Takvim</Link>
      </nav>
      <div className="top-actions">
        <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
        <NotificationMenu role="analizor" />
        <ProfileMenu roleLabel="Analizör hesabı" ordersHref="/analizor/islerim" ordersLabel="İşlerim" name="Naci Yılmaz" email="analizor@eistatistik.com" initials="NY" />
      </div>
    </header>

    <main id="analyst-works" className="orders-page analyst-works-page">
      <header className="orders-hero analyst-works-hero">
        <div><p className="eyebrow">ANALİZÖR ÇALIŞMA ALANI</p><h1>İşlerim</h1><p>Size atanan analizleri, müşteri yanıtlarını ve yaklaşan teslimleri tek yerden yönetin.</p></div>
        <div className="analyst-work-summary"><span><strong>4</strong><small>aktif iş</small></span><span><strong>2</strong><small>yaklaşan teslim</small></span><span><strong>1</strong><small>yanıt bekliyor</small></span></div>
      </header>

      <nav className="order-tabs" aria-label="İş durumları">
        {filters.map(item => <button key={item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}<span>{counts[item.key]}</span></button>)}
      </nav>

      <section className="orders-toolbar" aria-label="İş arama ve sıralama">
        <label className="orders-search"><Icon name="search" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="İş, sipariş kodu veya müşteri ara…" /></label>
        <label className="sort-control"><span>Sırala</span><SystemDropdown ariaLabel="İşleri sırala" value={sort} onChange={setSort} options={[{ value: "urgent", label: "En yakın teslim" }, { value: "progress", label: "İlerleme durumu" }]} /></label>
        <span className="result-count">{visibleWorks.length} iş gösteriliyor</span>
      </section>

      <section className="analyst-work-list">
        <header><div><p className="eyebrow">ATANAN ÇALIŞMALAR</p><h2>İş listeniz</h2></div><span>{visibleWorks.length} kayıt</span></header>
        <div className="analyst-work-head"><span>Çalışma</span><span>Müşteri</span><span>Durum</span><span>Teslim</span><span>İlerleme</span><span>İşlem</span></div>
        {visibleWorks.map(work => <article className="analyst-work-row" key={work.code}>
          <Link className="order-row-link" href={`/analizor/islerim/${work.code}`} aria-label={`${work.title} iş detayını görüntüle`} />
          <div className="order-identity"><span className="order-file"><Icon name="file" /></span><span><strong>{work.title}</strong><small>{work.code}</small></span></div>
          <div className="analyst-work-customer"><strong>{work.customer}</strong><small>Müşteri</small></div>
          <div className="order-state"><span className={`state-dot analyst-${work.status}`} /><span><strong>{work.statusLabel}</strong><small>{work.detail}</small></span></div>
          <div className="delivery-cell"><Icon name="clock" size={16} /><span><strong>{work.due}</strong><small>{work.remaining}</small></span></div>
          <div className="progress-cell"><div><span style={{ width: `${work.progress}%` }} /></div><small>{work.progress}%</small></div>
          <Link href={`/analizor/islerim/${work.code}`} className={work.status === "delivery" || work.status === "new" ? "context-action primary" : "context-action"}>{work.status === "new" ? "İşi incele" : work.status === "delivery" ? "Teslimi tamamla" : "Çalışmayı aç"}<Icon name="arrow" size={15} /></Link>
        </article>)}
        {visibleWorks.length === 0 && <div className="orders-empty"><span><Icon name="search" size={24} /></span><h2>İş bulunamadı</h2><p>Arama kelimenizi veya seçtiğiniz durum filtresini değiştirin.</p><button onClick={() => { setFilter("all"); setQuery(""); }}>Filtreleri temizle</button></div>}
      </section>
    </main>
  </div>;
}
