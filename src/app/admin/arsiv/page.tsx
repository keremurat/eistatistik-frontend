"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "../AdminShell";

// ── Tipler ────────────────────────────────────────────────────────
type IconName    = "arrow" | "archive" | "file" | "search" | "user";
type CtxIconName = "activity" | "eye" | "folder" | "restore" | "trash" | "user";
type TabKey      = "all" | "completed" | "cancelled";

type ArchivedOrder = {
  code: string; archivedAt: string; closedAt: string; statusKey: "teslim" | "iptal";
  customer: string; analyst: string; service: string; fee: string;
};
type ActivityRow = {
  v: number; time: string; actor: string; code: string; title: string; status: string;
  ilkUcret: string; sonUcret: string; odemeDurumu: string; odemeZamani: string;
  teslimatZamani: string; teslimatTipi: string; musteriId: string; analizorId: string;
  parentId: string; kuponId: string; kuponZamani: string;
};

// ── İkon bileşenleri ──────────────────────────────────────────────
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    archive: <><rect x="2" y="3" width="20" height="4" rx="1" /><path d="M4 7v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7" /><path d="M10 12h4" /></>,
    arrow:   <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    file:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    search:  <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function CtxIcon({ name }: { name: CtxIconName }) {
  const paths: Record<CtxIconName, React.ReactNode> = {
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    eye:      <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    folder:   <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    restore:  <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>,
    trash:    <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>,
    user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  };
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function DotsIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

// ── Mock veriler ──────────────────────────────────────────────────
const PREFIX_LABELS: Record<string, string> = {
  SA: "Standart Analiz", PA: "Power Analizi", DS: "Danışmanlık", PR: "Proforma Teklif",
};

const customers = ["ECE GÜNER", "BÜŞRA NUR GÖR", "AYTEN YILMAZ YAVUZ", "ELİF ARYA BULUT", "MELİS OYA ATEŞ", "ESRA İNCESU ÇİNKA", "MUSTAFA TETİK", "SİNA SAYGILI", "ENİS ULUSOY", "HATİCE SEVMEZ", "ZEYNEP KAYA", "MEHMET DEMİR"];
const analysts  = ["Yasin Yılmaz", "Esra Öztürk", "Rabia Aksoy", "Kaan Kara", "Ali İhsan D.", "Fatih Akar"];
const fees      = ["1.200 ₺", "850 ₺", "2.400 ₺", "650 ₺", "3.100 ₺", "1.750 ₺", "500 ₺", "4.200 ₺"];
const prefixes  = ["SA", "PA", "DS", "PR"];

const months = [
  { m: "01", y: "2026" }, { m: "02", y: "2026" }, { m: "03", y: "2026" },
  { m: "04", y: "2026" }, { m: "05", y: "2026" }, { m: "06", y: "2026" },
  { m: "07", y: "2025" }, { m: "08", y: "2025" }, { m: "09", y: "2025" },
  { m: "10", y: "2025" }, { m: "11", y: "2025" }, { m: "12", y: "2025" },
];

const allArchived: ArchivedOrder[] = Array.from({ length: 38 }, (_, i) => {
  const mo      = months[i % months.length];
  const day     = String(1 + (i % 27)).padStart(2, "0");
  const seq     = String((i * 11 + 5) % 99).padStart(3, "0");
  const prefix  = prefixes[i % prefixes.length];
  const code    = `${prefix}${mo.y.slice(2)}${mo.m}${day}${seq}`;
  const arDay   = String(Math.min(Number(day) + 3 + (i % 7), 28)).padStart(2, "0");
  const closed  = `${arDay}.${mo.m}.${mo.y}`;
  const archived = `${String(Number(arDay) + 1 > 28 ? 28 : Number(arDay) + 1).padStart(2, "0")}.${mo.m}.${mo.y}`;
  const statusKey: "teslim" | "iptal" = i % 7 === 3 ? "iptal" : "teslim";
  return {
    code, archivedAt: archived, closedAt: closed, statusKey,
    customer: customers[i % customers.length],
    analyst:  statusKey === "teslim" ? analysts[i % analysts.length] : "—",
    service:  PREFIX_LABELS[prefix],
    fee:      statusKey === "iptal" ? "—" : fees[i % fees.length],
  };
});

const tabs: { key: TabKey; label: string }[] = [
  { key: "all",       label: "Tümü" },
  { key: "completed", label: "Teslim edilenler" },
  { key: "cancelled", label: "İptal edilenler" },
];

const ACTIVITY_ROWS: ActivityRow[] = [
  { v: 1, time: "15/01/2026 09:12", actor: "BÜŞRA NUR GÖR(customer)", code: "—",          title: "Hemşirelik tez analizi", status: "{}",          ilkUcret: "0", sonUcret: "0", odemeDurumu: "false", odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "2", musteriId: "8",  analizorId: "6050", parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 2, time: "15/01/2026 09:12", actor: "BÜŞRA NUR GÖR(customer)", code: "SA260115005", title: "—",                     status: "—",           ilkUcret: "—", sonUcret: "—", odemeDurumu: "—",     odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "—", musteriId: "—",  analizorId: "—",    parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 3, time: "15/01/2026 10:44", actor: "Yasin Yılmaz(analyst)",   code: "—",          title: "—",                     status: "{working}",   ilkUcret: "—", sonUcret: "1200", odemeDurumu: "—",  odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "—", musteriId: "—",  analizorId: "—",    parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 4, time: "17/01/2026 14:20", actor: "BÜŞRA NUR GÖR(customer)", code: "—",          title: "—",                     status: "—",           ilkUcret: "—", sonUcret: "—",   odemeDurumu: "true", odemeZamani: "17.01.2026 14:20", teslimatZamani: "—", teslimatTipi: "—", musteriId: "—",  analizorId: "—", parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 5, time: "19/01/2026 11:00", actor: "Yasin Yılmaz(analyst)",   code: "—",          title: "—",                     status: "{delivered}", ilkUcret: "—", sonUcret: "—",   odemeDurumu: "—",   odemeZamani: "—", teslimatZamani: "19.01.2026 11:00", teslimatTipi: "2", musteriId: "—", analizorId: "—", parentId: "—", kuponId: "—", kuponZamani: "—" },
];

// ── Modal: Aktivite Günlüğü ───────────────────────────────────────
function ActivityModal({ orderCode, onClose }: { orderCode: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="dm-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="dm-modal dm-wide" role="dialog" aria-modal="true" aria-labelledby="dm-act-title">
        <header className="dm-header">
          <div>
            <p className="eyebrow" style={{ marginBottom: ".1rem", color: "#8a99a6" }}>SİPARİŞ AKTİVİTESİ</p>
            <h2 id="dm-act-title">Sipariş Aktivite Günlüğü — {orderCode}</h2>
          </div>
          <button className="dm-close" onClick={onClose} aria-label="Kapat">✕</button>
        </header>
        <div className="dm-body">
          <div className="dm-table-wrap">
            <table className="dm-table">
              <thead>
                <tr>
                  <th>Versiyon</th><th>İşlem Zamanı</th><th>İşlemi Yapan Kullanıcı</th>
                  <th>Kod</th><th>Başlık</th><th>Durum</th><th>İlk Ücret</th><th>Son Ücret</th>
                  <th>Ödeme Durumu</th><th>Ödeme Zamanı</th><th>Teslimat Zamanı</th>
                  <th>Teslimat Tipi</th><th>Müşteri ID</th><th>Analizör ID</th>
                  <th>Parent ID</th><th>Kupon ID</th><th>Kupon Zamanı</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITY_ROWS.map((row) => (
                  <tr key={row.v}>
                    <td style={{ textAlign: "center" }}>{row.v}</td>
                    <td>{row.time}</td>
                    <td>{row.actor}</td>
                    <td style={{ color: row.code !== "—" ? "var(--blue)" : undefined }}>{row.code}</td>
                    <td>{row.title}</td>
                    <td><code style={{ fontSize: ".55rem", color: "#54687a", fontFamily: "monospace" }}>{row.status}</code></td>
                    <td style={{ textAlign: "center" }}>{row.ilkUcret}</td>
                    <td style={{ textAlign: "center" }}>{row.sonUcret}</td>
                    <td>{row.odemeDurumu}</td>
                    <td>{row.odemeZamani}</td>
                    <td>{row.teslimatZamani}</td>
                    <td style={{ textAlign: "center" }}>{row.teslimatTipi}</td>
                    <td style={{ textAlign: "center" }}>{row.musteriId}</td>
                    <td style={{ textAlign: "center" }}>{row.analizorId}</td>
                    <td>{row.parentId}</td>
                    <td>{row.kuponId}</td>
                    <td>{row.kuponZamani}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <footer className="dm-footer">
          <button className="dm-close-btn" onClick={onClose}>Kapat</button>
        </footer>
      </section>
    </div>,
    document.body
  );
}

// ── Modal: İlişkili Siparişler ────────────────────────────────────
function RelatedOrdersModal({ orderCode, relatedOrders, onClose }: { orderCode: string; relatedOrders: ArchivedOrder[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="dm-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="dm-modal dm-medium" role="dialog" aria-modal="true" aria-labelledby="dm-rel-title">
        <header className="dm-header">
          <div>
            <p className="eyebrow" style={{ marginBottom: ".1rem", color: "#8a99a6" }}>SİPARİŞ</p>
            <h2 id="dm-rel-title">İlişkili Siparişler — {orderCode}</h2>
          </div>
          <button className="dm-close" onClick={onClose} aria-label="Kapat">✕</button>
        </header>
        <div className="dm-body">
          {relatedOrders.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: ".67rem", padding: "1.5rem 0", textAlign: "center" }}>
              Bu siparişle ilişkili başka sipariş bulunamadı.
            </p>
          ) : (
            <div className="dm-table-wrap">
              <table className="dm-table">
                <thead>
                  <tr><th>Kod</th><th>Hizmet</th><th>Durum</th><th>Kapanış</th><th>Ücret</th><th>Analizör</th></tr>
                </thead>
                <tbody>
                  {relatedOrders.map((o) => (
                    <tr key={o.code}>
                      <td>
                        <Link href="/admin/siparisler/DS260723008" style={{ color: "var(--blue)", fontWeight: 800 }} onClick={onClose}>
                          {o.code}
                        </Link>
                      </td>
                      <td>{o.service}</td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                          <span className={o.statusKey === "teslim" ? "state-dot completed" : "state-dot cancelled"} style={{ width: 7, height: 7, flexShrink: 0 }} />
                          {o.statusKey === "teslim" ? "Teslim edildi" : "İptal edildi"}
                        </span>
                      </td>
                      <td>{o.closedAt}</td>
                      <td>{o.fee}</td>
                      <td>{o.analyst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <footer className="dm-footer">
          <button className="dm-close-btn" onClick={onClose}>Kapat</button>
        </footer>
      </section>
    </div>,
    document.body
  );
}

// ── Onay modalı (silme) ───────────────────────────────────────────
function ConfirmDeleteModal({ code, onConfirm, onClose }: { code: string; onConfirm: () => void; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="dm-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dm-confirm" role="dialog" aria-modal="true">
        <h3>Arşivden Sil</h3>
        <p><strong>{code}</strong> kodlu sipariş arşivden kalıcı olarak silinecektir. Bu işlemi onaylıyor musunuz?</p>
        <div className="dm-confirm-actions">
          <button className="dm-confirm-cancel" onClick={onClose}>Vazgeç</button>
          <button className="dm-confirm-danger" onClick={() => { onConfirm(); onClose(); }}>Evet, Sil</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── 3-nokta bağlam menüsü ─────────────────────────────────────────
function ArchiveContextMenu({
  order, onDelete, onRestore, onShowActivity, onShowRelated,
}: {
  order: ArchivedOrder;
  onDelete: () => void;
  onRestore: () => void;
  onShowActivity: () => void;
  onShowRelated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, right: 0 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function update() {
      const btn = btnRef.current;
      if (!btn) return;
      const r     = btn.getBoundingClientRect();
      const menuH = menuRef.current?.offsetHeight ?? 220;
      const top   = window.innerHeight - r.bottom - 8 < menuH ? r.top - menuH - 4 : r.bottom + 4;
      setPos({ top, right: window.innerWidth - r.right });
    }
    function onDown(e: MouseEvent) {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    update();
    window.addEventListener("scroll", update, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!btnRef.current) return;
    const r      = btnRef.current.getBoundingClientRect();
    const MENU_H = 270;
    const top    = window.innerHeight - r.bottom - 8 < MENU_H ? r.top - MENU_H - 4 : r.bottom + 4;
    setPos({ top, right: window.innerWidth - r.right });
    setOpen((o) => !o);
  }

  const close = () => setOpen(false);
  function act(fn: () => void) { fn(); setOpen(false); }

  return (
    <>
      <button ref={btnRef} className={`dots-btn${open ? " open" : ""}`} onClick={toggle}
        aria-label="İşlemler menüsü" aria-expanded={open} aria-haspopup="menu">
        <DotsIcon />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div ref={menuRef} className="order-ctx-menu" role="menu"
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}>
          <Link className="ctx-item" role="menuitem" href="/admin/kullanici" onClick={close}>
            <CtxIcon name="user" />Müşteri Görüntüle
          </Link>
          <Link className="ctx-item" role="menuitem" href="/admin/siparisler/DS260723008" onClick={close}>
            <CtxIcon name="eye" />Siparişi Görüntüle
          </Link>
          <div className="ctx-separator" role="separator" />
          <button className="ctx-item" role="menuitem" onClick={() => act(onShowActivity)}>
            <CtxIcon name="activity" />Aktivite
          </button>
          <button className="ctx-item" role="menuitem" onClick={() => act(onShowRelated)}>
            <CtxIcon name="folder" />İlişkili Siparişler
          </button>
          <div className="ctx-separator" role="separator" />
          <button className="ctx-item" role="menuitem" onClick={() => act(onRestore)}>
            <CtxIcon name="restore" />Arşivden Çıkar
          </button>
          <button className="ctx-item ctx-danger" role="menuitem" onClick={() => act(onDelete)}>
            <CtxIcon name="trash" />Arşivden Sil
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

// ── Ana sayfa ─────────────────────────────────────────────────────
export default function AdminArsivPage() {
  const [activeTab,    setActiveTab]    = useState<TabKey>("all");
  const [query,        setQuery]        = useState("");
  const [deletedSet,   setDeletedSet]   = useState<Set<string>>(new Set());
  const [restoredSet,  setRestoredSet]  = useState<Set<string>>(new Set());
  const [activityFor,  setActivityFor]  = useState<string | null>(null);
  const [relatedFor,   setRelatedFor]   = useState<string | null>(null);
  const [deleteFor,    setDeleteFor]    = useState<string | null>(null);

  const displayOrders = useMemo(
    () => allArchived.filter((o) => !deletedSet.has(o.code) && !restoredSet.has(o.code)),
    [deletedSet, restoredSet],
  );

  const counts = useMemo(() => ({
    all:       displayOrders.length,
    completed: displayOrders.filter((o) => o.statusKey === "teslim").length,
    cancelled: displayOrders.filter((o) => o.statusKey === "iptal").length,
  }), [displayOrders]);

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase("tr").trim();
    return displayOrders.filter((o) => {
      if (activeTab === "completed" && o.statusKey !== "teslim") return false;
      if (activeTab === "cancelled" && o.statusKey !== "iptal")  return false;
      if (q && !`${o.code} ${o.customer} ${o.analyst}`.toLocaleLowerCase("tr").includes(q)) return false;
      return true;
    });
  }, [activeTab, query, displayOrders]);

  const relatedOrders = useMemo(() => {
    if (!relatedFor) return [];
    const target = allArchived.find((o) => o.code === relatedFor);
    if (!target) return [];
    return allArchived.filter((o) => o.customer === target.customer && o.code !== relatedFor).slice(0, 8);
  }, [relatedFor]);

  // Teslim edilenler ve iptal edilenleri ayrı gruplar halinde listele
  const completedOrders = filtered.filter((o) => o.statusKey === "teslim");
  const cancelledOrders = filtered.filter((o) => o.statusKey === "iptal");

  return (
    <AdminShell>
      <div className="orders-page admin-orders-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">SİPARİŞ YÖNETİMİ</p>
            <h1>Arşiv</h1>
            <p>Teslim edilen ve iptal edilen siparişlerin kayıtlarını görüntüleyin.</p>
          </div>
          <span className="arsiv-hero-icon" aria-hidden="true">
            <Icon name="archive" size={32} />
          </span>
        </header>

        <nav className="order-tabs" aria-label="Arşiv filtreleri">
          {tabs.map((tab) => (
            <button key={tab.key} className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}<span>{counts[tab.key]}</span>
            </button>
          ))}
        </nav>

        <section className="orders-toolbar" aria-label="Arşiv arama">
          <label className="orders-search">
            <Icon name="search" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Sipariş kodu, müşteri veya analizör ara…" aria-label="Arşivde ara" />
          </label>
          <span className="result-count">{filtered.length} kayıt gösteriliyor</span>
        </section>

        {filtered.length === 0 ? (
          <section className="orders-empty">
            <span><Icon name="search" size={25} /></span>
            <h2>Kayıt bulunamadı</h2>
            <p>Arama kelimenizi veya seçtiğiniz filtreyi değiştirin.</p>
            <button onClick={() => { setQuery(""); setActiveTab("all"); }}>Filtreleri temizle</button>
          </section>
        ) : (
          <div className="order-groups admin-orders">
            {/* Teslim edilenler */}
            {(activeTab === "all" || activeTab === "completed") && completedOrders.length > 0 && (
              <section className="order-group">
                <header>
                  <div><p className="eyebrow">TESLİM EDİLENLER</p><h2>Teslim edilen siparişler</h2></div>
                  <span>{completedOrders.length} sipariş</span>
                </header>
                <ArchiveTable
                  orders={completedOrders}
                  onDelete={(code) => setDeleteFor(code)}
                  onRestore={(code) => setRestoredSet((prev) => new Set(prev).add(code))}
                  onActivity={(code) => setActivityFor(code)}
                  onRelated={(code) => setRelatedFor(code)}
                />
              </section>
            )}

            {/* İptal edilenler */}
            {(activeTab === "all" || activeTab === "cancelled") && cancelledOrders.length > 0 && (
              <section className="order-group subdued">
                <header>
                  <div><p className="eyebrow">İPTAL EDİLENLER</p><h2>İptal edilen siparişler</h2></div>
                  <span>{cancelledOrders.length} sipariş</span>
                </header>
                <ArchiveTable
                  orders={cancelledOrders}
                  onDelete={(code) => setDeleteFor(code)}
                  onRestore={(code) => setRestoredSet((prev) => new Set(prev).add(code))}
                  onActivity={(code) => setActivityFor(code)}
                  onRelated={(code) => setRelatedFor(code)}
                />
              </section>
            )}
          </div>
        )}
      </div>

      {activityFor && (
        <ActivityModal orderCode={activityFor} onClose={() => setActivityFor(null)} />
      )}
      {relatedFor && (
        <RelatedOrdersModal
          orderCode={relatedFor}
          relatedOrders={relatedOrders}
          onClose={() => setRelatedFor(null)}
        />
      )}
      {deleteFor && (
        <ConfirmDeleteModal
          code={deleteFor}
          onConfirm={() => setDeletedSet((prev) => new Set(prev).add(deleteFor!))}
          onClose={() => setDeleteFor(null)}
        />
      )}
    </AdminShell>
  );
}

// ── Tablo bileşeni ────────────────────────────────────────────────
function ArchiveTable({
  orders, onDelete, onRestore, onActivity, onRelated,
}: {
  orders: ArchivedOrder[];
  onDelete: (code: string) => void;
  onRestore: (code: string) => void;
  onActivity: (code: string) => void;
  onRelated: (code: string) => void;
}) {
  return (
    <div className="orders-table admin-orders-table">
      <div className="orders-table-head arsiv-head">
        <span>Sipariş</span>
        <span>Hizmet</span>
        <span>Durum</span>
        <span>Kapanış Tarihi</span>
        <span>Müşteri</span>
        <span>Analizör</span>
        <span>Ücret</span>
        <span>İşlem</span>
      </div>
      {orders.map((order) => {
        const isTeslim = order.statusKey === "teslim";
        return (
          <article className="orders-row" key={order.code}>
            <Link className="order-row-link" href="/admin/siparisler/DS260723008"
              aria-label={`${order.service} — ${order.code} detayını görüntüle`} />

            <div className="order-identity">
              <span className="order-file">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" />
                </svg>
              </span>
              <span>
                <strong>{PREFIX_LABELS[order.code.slice(0, 2)] ?? "Analiz Talebi"}</strong>
                <small>{order.code}</small>
              </span>
            </div>

            <div className="ao-cell"><strong>{order.service}</strong></div>

            <div className="order-state">
              <span className={isTeslim ? "state-dot completed" : "state-dot cancelled"} />
              <span><strong>{isTeslim ? "Teslim edildi" : "İptal edildi"}</strong></span>
            </div>

            <div className="ao-cell"><strong>{order.closedAt}</strong></div>

            <div className="order-identity">
              <span className="order-file">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span><strong>{order.customer}</strong></span>
            </div>

            <div className="ao-cell"><strong>{order.analyst}</strong></div>
            <div className="ao-cell"><strong>{order.fee}</strong></div>

            <div className="order-actions">
              <Link href="/admin/siparisler/DS260723008" className="context-action">
                Detay
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
              <ArchiveContextMenu
                order={order}
                onDelete={() => onDelete(order.code)}
                onRestore={() => onRestore(order.code)}
                onShowActivity={() => onActivity(order.code)}
                onShowRelated={() => onRelated(order.code)}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
