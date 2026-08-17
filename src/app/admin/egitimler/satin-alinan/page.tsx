"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../../AdminShell";
import { SystemDropdown } from "../../../components/SystemDropdown";

type EducationStatus = "pending" | "active" | "cancelled";
type StatusFilter = "all" | EducationStatus;

type PurchasedEducation = {
  code: string;
  student: string;
  email: string;
  education: string;
  registeredAt: string;
  status: EducationStatus;
  price: number;
  access: string;
};

const records: PurchasedEducation[] = [
  { code: "TR260731004", student: "Beyza Nur Can", email: "beyza.can@example.com", education: "Modül 6. Meta Analizi Eğitimi", registeredAt: "31 Tem 2026 · 12:36", status: "pending", price: 4000, access: "12 ay" },
  { code: "TR260730009", student: "Ahmet Yalnız", email: "ahmet.yalniz@example.com", education: "İstatistiğin Her Şeyi", registeredAt: "30 Tem 2026 · 23:18", status: "active", price: 15000, access: "36 ay" },
  { code: "TR260730002", student: "Ezgi Sonkaya", email: "ezgi.sonkaya@example.com", education: "Makale Destek", registeredAt: "30 Tem 2026 · 11:25", status: "pending", price: 10000, access: "36 ay" },
  { code: "TR260723004", student: "Mustafa Çobaner", email: "mustafa.cobaner@example.com", education: "İstatistiğin Her Şeyi", registeredAt: "23 Tem 2026 · 10:09", status: "pending", price: 15000, access: "36 ay" },
  { code: "TR260716007", student: "Gizem Zevde Aydın", email: "gizem.aydin@example.com", education: "Bibliyometrik Veri Analizi", registeredAt: "16 Tem 2026 · 12:26", status: "cancelled", price: 4000, access: "12 ay" },
  { code: "TR260712003", student: "Şüheda Çifci", email: "suheda.cifci@example.com", education: "İstatistiğin Her Şeyi", registeredAt: "12 Tem 2026 · 09:52", status: "cancelled", price: 15000, access: "36 ay" },
  { code: "TR260706003", student: "Nilüfer Tok Yanık", email: "nilufer.yanik@example.com", education: "Bibliyometrik Veri Analizi", registeredAt: "06 Tem 2026 · 01:00", status: "cancelled", price: 4000, access: "12 ay" },
  { code: "TR260703006", student: "Yasin Yıldırım", email: "yasin.yildirim@example.com", education: "Oryantasyon Eğitimi 2026", registeredAt: "03 Tem 2026 · 13:13", status: "active", price: 0, access: "Süresiz" },
  { code: "TR260702013", student: "Büşra Zeybek", email: "busra.zeybek@example.com", education: "İstatistiğin Her Şeyi", registeredAt: "02 Tem 2026 · 16:50", status: "cancelled", price: 15000, access: "36 ay" },
  { code: "TR260702003", student: "Betül Uzun Özer", email: "betul.ozer@example.com", education: "5’i Bir Arada", registeredAt: "02 Tem 2026 · 09:21", status: "active", price: 9000, access: "12 ay" },
];

const statuses: Record<EducationStatus, { label: string; detail: string }> = {
  pending: { label: "Ödeme bekliyor", detail: "Ücret belirlendi" },
  active: { label: "Aktif", detail: "Erişim açık" },
  cancelled: { label: "İptal edildi", detail: "Erişim kapalı" },
};

const tabs: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "pending", label: "Ödeme bekleyen" },
  { key: "active", label: "Aktif eğitimler" },
  { key: "cancelled", label: "İptal edilen" },
];

const money = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

function MenuIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    user: <><circle cx="12" cy="8" r="3"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></>,
    eye: <><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.2"/></>,
    x: <path d="m7 7 10 10M17 7 7 17"/>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>,
    archive: <><path d="M4 8h16v12H4zM3 4h18v4H3zM9 12h6"/></>,
    activity: <path d="M3 12h4l2-5 4 10 2-5h6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    flag: <><path d="M6 21V4M6 5h10l-2 4 2 4H6"/></>,
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function EducationMenu({ code, student, basePath, onAction }: { code: string; student: string; basePath: string; onAction: (action: string) => void }) {
  const [open, setOpen] = useState(false);
  const [marked, setMarked] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const detailHref = `${basePath}/satin-alinan/${code}`;

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuHeight = menuRef.current?.offsetHeight ?? 340;
      const top = window.innerHeight - rect.bottom < menuHeight ? Math.max(8, rect.top - menuHeight - 5) : rect.bottom + 5;
      setPos({ top, right: window.innerWidth - rect.right });
    };
    const close = (event: MouseEvent) => {
      const node = event.target as Node;
      if (!buttonRef.current?.contains(node) && !menuRef.current?.contains(node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    update();
    window.addEventListener("scroll", update, true);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { window.removeEventListener("scroll", update, true); document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [open]);

  const act = (action: string) => { setOpen(false); onAction(action); };
  return <>
    <button ref={buttonRef} className={`dots-btn${open ? " open" : ""}`} onClick={() => setOpen(value => !value)} aria-label={`${student} için işlemler`} aria-expanded={open} aria-haspopup="menu"><span aria-hidden="true">•••</span></button>
    {open && typeof document !== "undefined" && createPortal(
      <div ref={menuRef} className="order-ctx-menu education-ctx-menu" role="menu" style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}>
        <Link className="ctx-item" role="menuitem" href={`/admin/kullanici?arama=${encodeURIComponent(student)}`} onClick={() => setOpen(false)}><MenuIcon name="user"/>Müşteri Görüntüle</Link>
        <Link className="ctx-item" role="menuitem" href={detailHref} onClick={() => setOpen(false)}><MenuIcon name="eye"/>Görüntüle</Link>
        <div className="ctx-separator" role="separator"/>
        <button className="ctx-item" role="menuitem" onClick={() => act("İptal Et")}><MenuIcon name="x"/>İptal Et</button>
        <button className="ctx-item ctx-danger" role="menuitem" onClick={() => act("Sil")}><MenuIcon name="trash"/>Sil</button>
        <div className="ctx-separator" role="separator"/>
        <button className="ctx-item" role="menuitem" onClick={() => act("Arşivle")}><MenuIcon name="archive"/>Arşivle</button>
        <Link className="ctx-item" role="menuitem" href={`${detailHref}?section=activity`} onClick={() => setOpen(false)}><MenuIcon name="activity"/>Aktivite</Link>
        <Link className="ctx-item" role="menuitem" href={`${detailHref}?section=products`} onClick={() => setOpen(false)}><MenuIcon name="plus"/>Ürün Ata</Link>
        <button className="ctx-item" role="menuitem" onClick={() => { setMarked(value => !value); setOpen(false); }}><MenuIcon name="flag"/>{marked ? "İşareti Kaldır" : "İşaretle"}</button>
      </div>, document.body)}
  </>;
}

export default function PurchasedEducationsPage() {
  return <AdminShell><PurchasedEducationsContent /></AdminShell>;
}

export function PurchasedEducationsContent({ basePath = "/admin/egitimler" }: { basePath?: string }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [education, setEducation] = useState("all");
  const [dialog, setDialog] = useState<{ action: string; record: PurchasedEducation } | null>(null);

  const educationOptions = useMemo(() => Array.from(new Set(records.map(record => record.education))), []);
  const counts = useMemo(() => ({
    all: records.length,
    pending: records.filter(record => record.status === "pending").length,
    active: records.filter(record => record.status === "active").length,
    cancelled: records.filter(record => record.status === "cancelled").length,
  }), []);

  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr");
    return records.filter(record => {
      const matchesStatus = status === "all" || record.status === status;
      const matchesEducation = education === "all" || record.education === education;
      const matchesQuery = !normalized || [record.code, record.student, record.email, record.education].some(value => value.toLocaleLowerCase("tr").includes(normalized));
      return matchesStatus && matchesEducation && matchesQuery;
    });
  }, [education, query, status]);

  return <>
    <div className="admin-education-page">
      <header className="orders-hero admin-education-hero">
        <div><p className="eyebrow">EĞİTİM YÖNETİMİ</p><h1>Satın Alınan Eğitimler</h1><p>Kayıtları, ödeme durumlarını ve kursiyer erişimlerini tek yerden yönetin.</p></div>
        <div className="admin-education-summary" aria-label="Eğitim kayıt özeti">
          <span><strong>{counts.all}</strong><small>toplam kayıt</small></span>
          <span><strong>{counts.pending}</strong><small>ödeme bekliyor</small></span>
          <span><strong>{counts.active}</strong><small>aktif erişim</small></span>
        </div>
      </header>

      <nav className="order-tabs admin-education-tabs" aria-label="Eğitim kayıt durumları">
        {tabs.map(tab => <button key={tab.key} className={status === tab.key ? "active" : ""} onClick={() => setStatus(tab.key)}>{tab.label}<span>{counts[tab.key]}</span></button>)}
      </nav>

      <section className="orders-toolbar admin-education-toolbar" aria-label="Eğitim kayıtlarını filtrele">
        <label className="orders-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Sipariş kodu, kursiyer veya eğitim ara…" /></label>
        <label className="admin-education-select"><span>Eğitim</span><SystemDropdown ariaLabel="Eğitim filtresi" value={education} onChange={setEducation} options={[{ value: "all", label: "Tüm eğitimler" }, ...educationOptions.map(option => ({ value: option, label: option }))]} /></label>
        <span className="result-count">{visibleRecords.length} kayıt gösteriliyor</span>
      </section>

      <section className="admin-education-list">
        <header><div><p className="eyebrow">KAYITLAR</p><h2>Kursiyer ve eğitim listesi</h2></div><button>Yeni eğitim kaydı</button></header>
        <div className="admin-education-scroll">
          <div className="admin-education-head"><span>Kayıt</span><span>Kursiyer</span><span>Eğitim</span><span>Kayıt tarihi</span><span>Durum</span><span>Ücret</span><span>İşlem</span></div>
          {visibleRecords.length ? visibleRecords.map(record => <article className="admin-education-row" key={record.code}>
            <div className="education-registration"><span>EDU</span><div><strong>{record.code}</strong><small>{record.access} erişim</small></div></div>
            <div className="education-student"><strong>{record.student}</strong><small>{record.email}</small></div>
            <div className="education-name"><strong>{record.education}</strong><small>Kendi hızında eğitim</small></div>
            <time>{record.registeredAt}</time>
            <div className={`education-admin-status ${record.status}`}><span /><div><strong>{statuses[record.status].label}</strong><small>{statuses[record.status].detail}</small></div></div>
            <strong className="education-price">{record.price ? money.format(record.price) : "Ücretsiz"}</strong>
            <div className="education-row-actions">
              <Link className="education-row-action" href={`${basePath}/satin-alinan/${record.code}`}>Görüntüle <span aria-hidden="true">→</span></Link>
              <EducationMenu code={record.code} student={record.student} basePath={basePath} onAction={action => setDialog({ action, record })}/>
            </div>
          </article>) : <div className="orders-empty">Filtrelerle eşleşen eğitim kaydı bulunamadı.</div>}
        </div>
      </section>
      {dialog && <div className="dm-backdrop" role="presentation" onMouseDown={() => setDialog(null)}><div className="dm-modal education-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="education-action-title" onMouseDown={event => event.stopPropagation()}>
        <div className="dm-header"><div><p className="eyebrow">KAYIT İŞLEMİ</p><h2 id="education-action-title">{dialog.action}</h2></div><button className="dm-close-btn" onClick={() => setDialog(null)} aria-label="Kapat">×</button></div>
        <div className="dm-body"><p><strong>{dialog.record.code}</strong> numaralı {dialog.record.education} kaydı için <strong>{dialog.action.toLocaleLowerCase("tr")}</strong> işlemini uygulamak üzeresiniz.</p><p>Bu prototipte işlem yalnızca arayüz davranışını gösterir; kayıt kalıcı olarak değiştirilmez.</p></div>
        <div className="dm-footer"><button className="dm-btn secondary" onClick={() => setDialog(null)}>Vazgeç</button><button className={`dm-btn${dialog.action === "Sil" ? " danger" : " primary"}`} onClick={() => setDialog(null)}>İşlemi onayla</button></div>
      </div></div>}
    </div>
  </>;
}
