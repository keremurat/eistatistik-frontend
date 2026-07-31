"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileMenu } from "../components/ProfileMenu";
import { NotificationMenu } from "../components/NotificationMenu";

type IconName = "arrow" | "bell" | "book" | "calendar" | "chevron" | "clock" | "file" | "home" | "message" | "more" | "plus" | "search" | "spark";
type OrderStatus = "action" | "active" | "completed" | "cancelled";
type Tab = "all" | OrderStatus;
type Order = {
  code: string;
  title: string;
  created: string;
  status: OrderStatus;
  statusLabel: string;
  detail: string;
  delivery: string;
  action: string;
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const orders: Order[] = [
  { code: "DS260723008", title: "Güç analizi danışmanlığı", created: "23 Temmuz 2026", status: "action" as const, statusLabel: "Onayınız bekleniyor", detail: "Ücret teklifi hazır", delivery: "12 saat", action: "Teklifi incele" },
  { code: "SA260723002", title: "Yüksek lisans tezi veri analizi", created: "23 Temmuz 2026", status: "active" as const, statusLabel: "Ek analiz görüşmesi", detail: "Bugün · 14:30", delivery: "2 iş günü", action: "Görüşmeye katıl" },
  { code: "SA260721001", title: "Regresyon analizi ve sonuç raporu", created: "21 Temmuz 2026", status: "active" as const, statusLabel: "Analiz hazırlanıyor", detail: "Son güncelleme 18 dk. önce", delivery: "3 iş günü", action: "Süreci görüntüle" },
  { code: "PA260723007", title: "Örneklem büyüklüğü ve power analizi", created: "23 Temmuz 2026", status: "completed" as const, statusLabel: "Teslim edildi", detail: "23 Temmuz · 23:04", delivery: "12 saat", action: "Dosyaları aç" },
  { code: "PR260723006", title: "Proforma fatura talebi", created: "23 Temmuz 2026", status: "completed" as const, statusLabel: "Teslim edildi", detail: "23 Temmuz · 23:01", delivery: "12 saat", action: "Belgeyi aç" },
  { code: "SA260721005", title: "Ölçek geçerlilik ve güvenilirlik analizi", created: "21 Temmuz 2026", status: "completed" as const, statusLabel: "Teslim edildi", detail: "22 Temmuz · 14:25", delivery: "24 saat", action: "Dosyaları aç" },
  { code: "SA260721003", title: "Normallik ve korelasyon analizi", created: "21 Temmuz 2026", status: "completed" as const, statusLabel: "Teslim edildi", detail: "22 Temmuz · 11:42", delivery: "2 iş günü", action: "Dosyaları aç" },
  { code: "SA260719004", title: "Akademik çalışma veri düzenleme", created: "19 Temmuz 2026", status: "completed" as const, statusLabel: "Teslim edildi", detail: "20 Temmuz · 16:10", delivery: "24 saat", action: "Dosyaları aç" },
];

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "Tümü" }, { key: "active", label: "Aktif" }, { key: "action", label: "Onay bekleyen" },
  { key: "completed", label: "Teslim edilen" }, { key: "cancelled", label: "İptal edilen" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const counts = useMemo(() => ({
    all: orders.length,
    action: orders.filter(order => order.status === "action").length,
    active: orders.filter(order => order.status === "active").length,
    completed: orders.filter(order => order.status === "completed").length,
    cancelled: orders.filter(order => order.status === "cancelled").length,
  }), []);

  const filteredOrders = useMemo(() => {
    const normalized = query.toLocaleLowerCase("tr");
    const result = orders.filter(order =>
      (activeTab === "all" || order.status === activeTab) &&
      `${order.title} ${order.code}`.toLocaleLowerCase("tr").includes(normalized)
    );
    return sort === "oldest" ? [...result].reverse() : result;
  }, [activeTab, query, sort]);

  const actionOrders = filteredOrders.filter(order => order.status === "action");
  const activeOrders = filteredOrders.filter(order => order.status === "active");
  const completedOrders = filteredOrders.filter(order => order.status === "completed");

  return (
    <div className="app-shell">
      <a className="skip-link" href="#orders-content">İçeriğe geç</a>
      <header className="topbar">
        <Link className="brand" href="/dashboard" aria-label="Eİstatistik ana sayfa"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority /></Link>
        <nav className="main-nav" aria-label="Ana navigasyon">
          <Link href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
          <Link className="active" href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <Link href="/egitimler"><Icon name="book" size={17} />Eğitimlerim</Link>
          <a href="#"><Icon name="spark" size={17} />Hizmetler</a>
        </nav>
        <div className="top-actions">
          <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç">
            <Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} />
          </a>
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </header>

      <main id="orders-content" className="orders-page">
        <header className="orders-hero">
          <div><p className="eyebrow">ÇALIŞMA ALANINIZ</p><h1>Siparişlerim</h1><p>Analiz taleplerinizi, görüşmelerinizi ve teslimlerinizi tek yerden takip edin.</p></div>
          <Link className="orders-create" href="/yeni-analiz-talebi"><Icon name="plus" size={18} />Yeni analiz talebi</Link>
        </header>

        <nav className="order-tabs" aria-label="Sipariş durumları">
          {tabs.map(tab => <button key={tab.key} className={activeTab === tab.key ? "active" : ""} onClick={() => setActiveTab(tab.key)}>{tab.label}<span>{counts[tab.key]}</span></button>)}
        </nav>

        <section className="orders-toolbar" aria-label="Sipariş arama ve sıralama">
          <label className="orders-search"><Icon name="search" size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Sipariş adı veya kodu ara…" aria-label="Siparişlerde ara" /></label>
          <label className="sort-control"><span>Sırala</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="newest">En yeni</option><option value="oldest">En eski</option></select></label>
          <span className="result-count">{filteredOrders.length} sipariş gösteriliyor</span>
        </section>

        {filteredOrders.length === 0 ? (
          <section className="orders-empty"><span><Icon name="search" size={25} /></span><h2>Sipariş bulunamadı</h2><p>Arama kelimenizi veya seçtiğiniz filtreyi değiştirin.</p><button onClick={() => { setQuery(""); setActiveTab("all"); }}>Filtreleri temizle</button></section>
        ) : (
          <div className="order-groups">
            {actionOrders.length > 0 && <OrderGroup title="Sizden işlem bekleyen" eyebrow="ÖNCELİKLİ" orders={actionOrders} />}
            {activeOrders.length > 0 && <OrderGroup title="Aktif analizler" eyebrow="DEVAM EDEN" orders={activeOrders} />}
            {completedOrders.length > 0 && <OrderGroup title="Teslim edilenler" eyebrow="ARŞİV" orders={completedOrders} subdued />}
          </div>
        )}
      </main>
      <button className="support-button" aria-label="Destek"><Icon name="message" /><span>Destek</span></button>
    </div>
  );
}

function OrderGroup({ title, eyebrow, orders: groupOrders, subdued = false }: { title: string; eyebrow: string; orders: Order[]; subdued?: boolean }) {
  return (
    <section className={`order-group ${subdued ? "subdued" : ""}`}>
      <header><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><span>{groupOrders.length} sipariş</span></header>
      <div className="orders-table">
        <div className="orders-table-head"><span>Sipariş</span><span>Durum</span><span>Seçilen teslimat</span><span>İşlem</span></div>
        {groupOrders.map(order => (
          <article className="orders-row" key={order.code}>
            <Link
              className="order-row-link"
              href="/siparislerim/DS260723008"
              aria-label={`${order.title} sipariş detayını görüntüle`}
            />
            <div className="order-identity"><span className="order-file"><Icon name="file" size={18} /></span><span><strong>{order.title}</strong><small>{order.code} · {order.created}</small></span></div>
            <div className="order-state"><span className={`state-dot ${order.status}`} /><span><strong>{order.statusLabel}</strong><small>{order.detail}</small></span></div>
            <div className="delivery-cell"><Icon name="clock" size={16} /><span><strong>{order.delivery}</strong><small>Siparişte seçilen süre</small></span></div>
            <div className="order-actions"><Link href="/siparislerim/DS260723008" className={order.status === "action" ? "context-action primary" : "context-action"}>{order.action}<Icon name="arrow" size={15} /></Link><button className="more-action" aria-label={`${order.title} diğer işlemler`}><Icon name="more" size={19} /></button></div>
          </article>
        ))}
      </div>
    </section>
  );
}
