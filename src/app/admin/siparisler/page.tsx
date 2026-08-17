"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "../AdminShell";
import { useFavorites } from "../FavoritesContext";

// ── Tipler ────────────────────────────────────────────────────────
type IconName    = "arrow" | "file" | "plus" | "search" | "user";
type CtxIconName = "activity" | "archive" | "star" | "starFill" | "eye" | "folder" | "messageOff" | "plus" | "trash" | "truck" | "user" | "userPlus" | "x";
type StatusGroup = "action" | "active" | "completed" | "cancelled";
type TabKey      = "all" | StatusGroup;
type StatusKey   = "siparis-verildi" | "yapiliyor" | "yapildi" | "ek-ucret" | "ek-yapiliyor" | "teslim" | "iptal";

type Order = {
  code: string; date: string; statusKey: StatusKey;
  delivery: string; remaining: string; customer: string; analyst: string;
};
type ActivityRow = {
  v: number; time: string; actor: string; code: string; title: string; status: string;
  ilkUcret: string; sonUcret: string; odemeDurumu: string; odemeZamani: string;
  teslimatZamani: string; teslimatTipi: string; musteriId: string; analizorId: string;
  parentId: string; kuponId: string; kuponZamani: string;
};
type ConfirmCfg = { type: "cancel" | "delete"; code: string };

// ── İkon bileşenleri ──────────────────────────────────────────────
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow:  <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    file:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    plus:   <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    user:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function CtxIcon({ name }: { name: CtxIconName }) {
  const paths: Record<CtxIconName, React.ReactNode> = {
    activity:     <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    archive:      <><rect x="2" y="3" width="20" height="4" rx="1" /><path d="M4 7v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7" /><path d="M10 12h4" /></>,
    star:         <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
    starFill:     <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
    eye:          <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    folder:       <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    messageOff:   <><path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" /><path d="m9 9 6 6M15 9l-6 6" /></>,
    plus:         <path d="M12 5v14M5 12h14" />,
    trash:        <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>,
    truck:        <><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11v13H5Z" /><path d="M14 8h4l3 5v2h-7V8Z" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    userPlus:     <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></>,
    x:            <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  const filled = name === "starFill";
  return <svg width={16} height={16} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function DotsIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

// ── Mock veriler ──────────────────────────────────────────────────
const statuses = [
  { key: "siparis-verildi" as StatusKey, label: "Sipariş verildi",              group: "action"    as StatusGroup },
  { key: "yapiliyor"       as StatusKey, label: "Yapılıyor",                    group: "active"    as StatusGroup },
  { key: "yapildi"         as StatusKey, label: "Yapıldı",                      group: "active"    as StatusGroup },
  { key: "ek-ucret"        as StatusKey, label: "Ek Analiz - Ücret belirlendi", group: "active"    as StatusGroup },
  { key: "ek-yapiliyor"    as StatusKey, label: "Ek Analiz - Yapılıyor",        group: "active"    as StatusGroup },
  { key: "teslim"          as StatusKey, label: "Teslim edildi",                group: "completed" as StatusGroup },
  { key: "iptal"           as StatusKey, label: "İptal edildi",                 group: "cancelled" as StatusGroup },
];

const statusMap = Object.fromEntries(statuses.map((s) => [s.key, s])) as Record<StatusKey, typeof statuses[number]>;

const DOT: Record<StatusGroup, string> = {
  action: "state-dot action", active: "state-dot", completed: "state-dot completed", cancelled: "state-dot cancelled",
};

const PREFIX_LABELS: Record<string, string> = {
  SA: "Standart Analiz", PA: "Power Analizi", DS: "Danışmanlık", PR: "Proforma Teklif",
};

const customers  = ["ECE GÜNER", "BÜŞRA NUR GÖR", "AYTEN YILMAZ YAVUZ", "ELİF ARYA BULUT", "MELİS OYA ATEŞ", "ESRA İNCESU ÇİNKA", "MUSTAFA TETİK", "SİNA SAYGILI", "ENİS ULUSOY", "HATİCE SEVMEZ", "ZEYNEP KAYA", "MEHMET DEMİR", "ALİ VURAL", "SELİN DOĞAN"];
const analysts   = ["Yasin Yılmaz", "Esra Öztürk", "Rabia Aksoy", "Kaan Kara", "Ali İhsan D.", "Fatih Akar", "—"];
const deliveries = ["2 iş günü", "4 iş günü", "7 iş günü", "14 iş günü", "30 iş günü"];
const remainings = ["6 gün", "Süre bitti.", "—", "3 gün", "12 gün", "1 gün"];
const prefixes   = ["SA", "PA", "DS", "PR"];

const allOrders: Order[] = Array.from({ length: 46 }, (_, i) => {
  const status = statuses[i % statuses.length];
  const day    = 31 - (i % 20);
  const seq    = String((i * 7 + 3) % 40).padStart(3, "0");
  const hour   = String(9 + (i % 9)).padStart(2, "0");
  const minute = String((i * 13) % 60).padStart(2, "0");
  const prefix = prefixes[i % prefixes.length];
  return {
    code:      `${prefix}2607${String(day).padStart(2, "0")}${seq}`,
    date:      `${String(day).padStart(2, "0")}.07.2026 ${hour}:${minute}`,
    statusKey: status.key,
    delivery:  deliveries[i % deliveries.length],
    remaining: remainings[i % remainings.length],
    customer:  customers[i % customers.length],
    analyst:   analysts[i % analysts.length],
  };
});

const analystOptions = Array.from(new Set(allOrders.map((order) => order.analyst)))
  .sort((a, b) => {
    if (a === "—") return 1;
    if (b === "—") return -1;
    return a.localeCompare(b, "tr");
  });

function orderTimestamp(date: string) {
  const [datePart, timePart] = date.split(" ");
  const [day, month, year] = datePart.split(".").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute).getTime();
}

function AnalystFilterDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selectedLabel = value === "all" ? "Tümü" : value === "—" ? "Atanmamış" : value;

  useEffect(() => {
    function closeOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);

  const options = ["all", ...analystOptions];

  return (
    <div className="cs-wrap orders-analyst-filter" ref={wrapRef}>
      <button
        type="button"
        className={`cs-trigger${open ? " open" : ""}`}
        aria-label={`Analizöre göre filtrele: ${selectedLabel}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="orders-analyst-filter-label"><small>Analizör</small><strong>{selectedLabel}</strong></span>
        <span className="cs-arrow" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="cs-panel" role="listbox" aria-label="Analizör seçenekleri">
          {options.map((option) => {
            const label = option === "all" ? "Tümü" : option === "—" ? "Atanmamış" : option;
            return (
              <button
                type="button"
                role="option"
                aria-selected={value === option}
                className={`cs-option${value === option ? " active" : ""}`}
                key={option}
                onClick={() => { onChange(option); setOpen(false); }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "Tümü" }, { key: "action", label: "Bekleyen" },
  { key: "active", label: "Aktif" }, { key: "completed", label: "Teslim edilen" },
  { key: "cancelled", label: "İptal edilen" },
];

const groupDefs: { key: StatusGroup; eyebrow: string; title: string; subdued?: boolean }[] = [
  { key: "action",    eyebrow: "BEKLEYEN",   title: "Bekleyen siparişler" },
  { key: "active",    eyebrow: "DEVAM EDEN", title: "Aktif analizler" },
  { key: "completed", eyebrow: "ARŞİV",      title: "Teslim edilenler / Arşiv", subdued: true },
  { key: "cancelled", eyebrow: "İPTAL",      title: "İptal edilenler",          subdued: true },
];

type VisibleOrderGroup = { key: StatusGroup | "all"; eyebrow: string; title: string; subdued?: boolean };

const ACTIVITY_ROWS: ActivityRow[] = [
  { v: 1, time: "31/07/2026 16:26", actor: "KEREM MURAT(customer)", code: "—",           title: "Kerem Murat Deneme", status: "{}",        ilkUcret: "0", sonUcret: "0", odemeDurumu: "false", odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "2", musteriId: "1",   analizorId: "6050", parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 2, time: "31/07/2026 16:26", actor: "KEREM MURAT(customer)", code: "SA260731010", title: "—",                   status: "—",         ilkUcret: "—", sonUcret: "—", odemeDurumu: "—",     odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "—", musteriId: "—",   analizorId: "—",    parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 3, time: "31/07/2026 16:26", actor: "KEREM MURAT(customer)", code: "—",           title: "—",                   status: "{ordered}", ilkUcret: "—", sonUcret: "—", odemeDurumu: "—",     odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "—", musteriId: "—",   analizorId: "—",    parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 4, time: "31/07/2026 16:26", actor: "KEREM MURAT(customer)", code: "—",           title: "—",                   status: "—",         ilkUcret: "—", sonUcret: "—", odemeDurumu: "—",     odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "—", musteriId: "—",   analizorId: "—",    parentId: "—", kuponId: "—", kuponZamani: "—" },
  { v: 5, time: "31/07/2026 16:26", actor: "Sistem",                code: "—",           title: "—",                   status: "—",         ilkUcret: "—", sonUcret: "—", odemeDurumu: "—",     odemeZamani: "—", teslimatZamani: "—", teslimatTipi: "—", musteriId: "—",   analizorId: "—",    parentId: "—", kuponId: "—", kuponZamani: "—" },
];

// ── Modal: Aktivite Günlüğü ────────────────────────────────────────
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
function RelatedOrdersModal({ orderCode, relatedOrders, detailHref, onClose }: { orderCode: string; relatedOrders: Order[]; detailHref: string; onClose: () => void }) {
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
                  <tr><th>Kod</th><th>Tür</th><th>Durum</th><th>Teslimat</th><th>Müşteri</th><th>Analizör</th></tr>
                </thead>
                <tbody>
                  {relatedOrders.map((o) => (
                    <tr key={o.code}>
                      <td>
                        <Link href={detailHref} style={{ color: "var(--blue)", fontWeight: 800 }} onClick={onClose}>
                          {o.code}
                        </Link>
                      </td>
                      <td>{PREFIX_LABELS[o.code.slice(0, 2)] ?? "Analiz Talebi"}</td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                          <span className={DOT[statusMap[o.statusKey].group]} style={{ width: 7, height: 7, flexShrink: 0 }} />
                          {statusMap[o.statusKey].label}
                        </span>
                      </td>
                      <td>{o.delivery}</td>
                      <td>{o.customer}</td>
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

// ── Modal: Onay ───────────────────────────────────────────────────
function ConfirmModal({ cfg, onConfirm, onClose }: { cfg: ConfirmCfg; onConfirm: () => void; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isDel = cfg.type === "delete";

  return createPortal(
    <div className="dm-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dm-confirm" role="dialog" aria-modal="true">
        <h3>{isDel ? "Siparişi Sil" : "Siparişi İptal Et"}</h3>
        <p>
          <strong>{cfg.code}</strong> kodlu sipariş{" "}
          {isDel
            ? "iptal edilerek sistemden kalıcı olarak silinecektir."
            : "iptal edilecek; veriler korunmaya devam edecektir."}{" "}
          Bu işlemi onaylıyor musunuz?
        </p>
        <div className="dm-confirm-actions">
          <button className="dm-confirm-cancel" onClick={onClose}>Vazgeç</button>
          <button className={isDel ? "dm-confirm-danger" : "dm-confirm-primary"} onClick={() => { onConfirm(); onClose(); }}>
            {isDel ? "Evet, Sil" : "Evet, İptal Et"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── 3-nokta bağlam menüsü ─────────────────────────────────────────
interface CtxMenuProps {
  order: Order;
  detailHref: string;
  isFavorite: boolean;
  isMessageClosed: boolean;
  onFavoriteToggle: () => void;
  onCancelRequest: () => void;
  onDeleteRequest: () => void;
  onArchive: () => void;
  onCloseMessage: () => void;
  onShowActivity: () => void;
  onShowRelated: () => void;
}

function OrderContextMenu({ order, detailHref, isFavorite, isMessageClosed, onFavoriteToggle, onCancelRequest, onDeleteRequest, onArchive, onCloseMessage, onShowActivity, onShowRelated }: CtxMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function update() {
      const btn = btnRef.current;
      if (!btn) return;
      const r     = btn.getBoundingClientRect();
      const menuH = menuRef.current?.offsetHeight ?? 460;
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
    const MENU_H = 460; // sabit tahmini yükseklik — flicker önler
    const top    = window.innerHeight - r.bottom - 8 < MENU_H ? r.top - MENU_H - 4 : r.bottom + 4;
    setPos({ top, right: window.innerWidth - r.right });
    setOpen((o) => !o);
  }

  function act(fn: () => void) { fn(); setOpen(false); }
  const close = () => setOpen(false);

  return (
    <>
      <button ref={btnRef} className={`dots-btn${open ? " open" : ""}`} onClick={toggle}
        aria-label="İşlemler menüsü" aria-expanded={open} aria-haspopup="menu">
        <DotsIcon />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div ref={menuRef} className="order-ctx-menu" role="menu"
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}>

          {/* Görüntüle grubu */}
          <Link className="ctx-item" role="menuitem" href={detailHref} onClick={close}>
            <CtxIcon name="user" />Müşteri Görüntüle
          </Link>
          <Link className="ctx-item" role="menuitem" href={detailHref} onClick={close}>
            <CtxIcon name="eye" />Görüntüle
          </Link>
          <button className="ctx-item" role="menuitem" onClick={() => act(onFavoriteToggle)}
            style={isFavorite ? { color: "#b66d2e" } : undefined}>
            <CtxIcon name={isFavorite ? "starFill" : "star"} />
            {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          </button>

          <div className="ctx-separator" role="separator" />

          {/* İşlem grubu */}
          <Link className="ctx-item" role="menuitem" href={detailHref} onClick={close}>
            <CtxIcon name="truck" />Teslim Et
          </Link>
          <button className="ctx-item" role="menuitem" onClick={() => act(onCancelRequest)}>
            <CtxIcon name="x" />İptal Et
          </button>

          <div className="ctx-separator" role="separator" />

          {/* Tehlikeli */}
          <button className="ctx-item ctx-danger" role="menuitem" onClick={() => act(onDeleteRequest)}>
            <CtxIcon name="trash" />Sil
          </button>

          <div className="ctx-separator" role="separator" />

          {/* Yönetim grubu */}
          <button className="ctx-item" role="menuitem" onClick={() => act(onArchive)}>
            <CtxIcon name="archive" />Arşivle
          </button>
          <button className="ctx-item" role="menuitem" onClick={() => act(onShowActivity)}>
            <CtxIcon name="activity" />Aktivite
          </button>
          <button className="ctx-item" role="menuitem" onClick={() => act(onShowRelated)}>
            <CtxIcon name="folder" />İlişkili Siparişler
          </button>
          <button className="ctx-item" role="menuitem"
            onClick={() => { if (!isMessageClosed) act(onCloseMessage); }}
            disabled={isMessageClosed}
            style={isMessageClosed ? { opacity: .45, cursor: "default" } : undefined}>
            <CtxIcon name="messageOff" />{isMessageClosed ? "Mesaj Kapatıldı" : "Mesajı Kapat"}
          </button>
          <button className="ctx-item" role="menuitem" onClick={close} style={{ opacity: .5, cursor: "default" }}>
            <CtxIcon name="plus" />Ürün Ata
          </button>
          <Link className="ctx-item" role="menuitem" href={`${detailHref}?section=analyst`} onClick={close}>
            <CtxIcon name="userPlus" />Analizör Ata
          </Link>
        </div>,
        document.body
      )}
    </>
  );
}

// ── Ana sayfa ─────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  return <AdminShell><SharedOrdersList /></AdminShell>;
}

export function SharedOrdersList({ basePath = "/admin/siparisler" }: { basePath?: string }) {
  const [activeTab,      setActiveTab]      = useState<TabKey>("all");
  const [query,          setQuery]          = useState("");
  const [analystFilter,  setAnalystFilter]  = useState("all");
  const { isFav, toggle: toggleFav }         = useFavorites();
  const [cancelledSet,   setCancelledSet]   = useState<Set<string>>(new Set());
  const [deletedSet,     setDeletedSet]     = useState<Set<string>>(new Set());
  const [archivedSet,    setArchivedSet]    = useState<Set<string>>(new Set());
  const [msgClosedSet,   setMsgClosedSet]   = useState<Set<string>>(new Set());
  const [activityFor,    setActivityFor]    = useState<string | null>(null);
  const [relatedFor,     setRelatedFor]     = useState<string | null>(null);
  const [confirmCfg,     setConfirmCfg]     = useState<ConfirmCfg | null>(null);
  const detailHref = `${basePath}/DS260723008`;
  const showAnalystFilter = basePath.startsWith("/admin/");

  // Siparişlere durum override'ları uygula
  const displayOrders = useMemo(() =>
    allOrders
      .filter(o => !deletedSet.has(o.code))
      .map(o => {
        if (cancelledSet.has(o.code)) return { ...o, statusKey: "iptal"  as StatusKey };
        if (archivedSet.has(o.code))  return { ...o, statusKey: "teslim" as StatusKey };
        return o;
      }),
  [cancelledSet, deletedSet, archivedSet]);

  const analystFilteredOrders = useMemo(
    () => analystFilter === "all" ? displayOrders : displayOrders.filter((order) => order.analyst === analystFilter),
    [analystFilter, displayOrders],
  );

  const counts = useMemo(() => ({
    all:       analystFilteredOrders.length,
    action:    analystFilteredOrders.filter(o => statusMap[o.statusKey].group === "action").length,
    active:    analystFilteredOrders.filter(o => statusMap[o.statusKey].group === "active").length,
    completed: analystFilteredOrders.filter(o => statusMap[o.statusKey].group === "completed").length,
    cancelled: analystFilteredOrders.filter(o => statusMap[o.statusKey].group === "cancelled").length,
  }), [analystFilteredOrders]);

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase("tr").trim();
    return analystFilteredOrders.filter(o => {
      if (activeTab !== "all" && statusMap[o.statusKey].group !== activeTab) return false;
      if (q && !`${o.code} ${o.customer} ${o.analyst}`.toLocaleLowerCase("tr").includes(q)) return false;
      return true;
    }).sort((a, b) => orderTimestamp(b.date) - orderTimestamp(a.date));
  }, [activeTab, query, analystFilteredOrders]);

  const visibleGroups: VisibleOrderGroup[] = activeTab === "all"
    ? [{ key: "all", eyebrow: "", title: "" }]
    : groupDefs;

  // İlişkili siparişler — aynı müşterinin diğer siparişleri
  const relatedOrders = useMemo(() => {
    if (!relatedFor) return [];
    const target = allOrders.find(o => o.code === relatedFor);
    if (!target) return [];
    return allOrders.filter(o => o.customer === target.customer && o.code !== relatedFor).slice(0, 8);
  }, [relatedFor]);

  function toggleFavorite(order: Order) {
    toggleFav({
      id:    order.code,
      label: `${PREFIX_LABELS[order.code.slice(0, 2)] ?? "Analiz Talebi"} — ${order.code}`,
      sub:   `${order.customer} · ${order.date.split(" ")[0]}`,
      href:  detailHref,
    });
  }
  function archive(code: string)      { setArchivedSet(prev  => new Set(prev).add(code)); }
  function closeMessage(code: string) { setMsgClosedSet(prev => new Set(prev).add(code)); }

  function executeConfirm() {
    if (!confirmCfg) return;
    setCancelledSet(prev => new Set(prev).add(confirmCfg.code));
    if (confirmCfg.type === "delete") setDeletedSet(prev => new Set(prev).add(confirmCfg.code));
  }

  return (
    <>
      <div className="orders-page admin-orders-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">SİPARİŞ YÖNETİMİ</p>
            <h1>Mevcut Siparişler</h1>
            <p>Tüm analiz taleplerini, teslimatları ve müşteri siparişlerini yönetin.</p>
          </div>
          <a className="orders-create" href="#"><Icon name="plus" size={18} />Sipariş Ver</a>
        </header>

        <nav className="order-tabs" aria-label="Sipariş durumları">
          {tabs.map((tab) => (
            <button key={tab.key} className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}<span>{counts[tab.key]}</span>
            </button>
          ))}
        </nav>

        <section className="orders-toolbar" aria-label="Sipariş arama">
          <label className="orders-search">
            <Icon name="search" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Sipariş kodu, müşteri veya analizör ara…" aria-label="Siparişlerde ara" />
          </label>
          {showAnalystFilter && <AnalystFilterDropdown value={analystFilter} onChange={setAnalystFilter} />}
          <span className="result-count">{filtered.length} sipariş gösteriliyor</span>
        </section>

        {filtered.length === 0 ? (
          <section className="orders-empty">
            <span><Icon name="search" size={25} /></span>
            <h2>Sipariş bulunamadı</h2>
            <p>Arama kelimenizi veya seçtiğiniz filtreyi değiştirin.</p>
            <button onClick={() => { setQuery(""); setActiveTab("all"); }}>Filtreleri temizle</button>
          </section>
        ) : (
          <div className="order-groups admin-orders">
            {visibleGroups.map((group) => {
              const groupOrders = group.key === "all" ? filtered : filtered.filter(o => statusMap[o.statusKey].group === group.key);
              if (groupOrders.length === 0) return null;
              return (
                <section key={group.key} className={`order-group ${group.subdued ? "subdued" : ""} ${group.key === "all" ? "ungrouped" : ""}`}>
                  {group.key !== "all" && <header>
                    <div><p className="eyebrow">{group.eyebrow}</p><h2>{group.title}</h2></div>
                    <span>{groupOrders.length} sipariş</span>
                  </header>}
                  <div className="orders-table admin-orders-table">
                    <div className="orders-table-head">
                      <span>Sipariş</span><span>Son güncelleme</span><span>Durum</span>
                      <span>Teslimat</span><span>Kalan</span><span>Müşteri</span>
                      <span>Analizör</span><span>İşlem</span>
                    </div>
                    {groupOrders.map((order) => {
                      const status = statusMap[order.statusKey];
                      const [dateDay, dateTime] = order.date.split(" ");
                      return (
                        <article className="orders-row" key={order.code}>
                          <Link className="order-row-link" href={detailHref}
                            aria-label={`${PREFIX_LABELS[order.code.slice(0, 2)] ?? "Analiz Talebi"} — ${order.code} detayını görüntüle`} />

                          <div className="order-identity">
                            <span className="order-file"><Icon name="file" size={18} /></span>
                            <span>
                              <strong>{PREFIX_LABELS[order.code.slice(0, 2)] ?? "Analiz Talebi"}</strong>
                              <small>{order.code}</small>
                            </span>
                          </div>

                          <div className="ao-cell">
                            <strong>{dateDay}</strong><small>{dateTime}</small>
                          </div>

                          <div className="order-state">
                            <span className={DOT[status.group]} />
                            <span><strong>{status.label}</strong></span>
                          </div>

                          <div className="ao-cell"><strong>{order.delivery}</strong></div>
                          <div className="ao-cell"><strong>{order.remaining}</strong></div>

                          <div className="order-identity">
                            <span className="order-file"><Icon name="user" size={18} /></span>
                            <span><strong>{order.customer}</strong></span>
                          </div>

                          <div className="ao-cell"><strong>{order.analyst}</strong></div>

                          <div className="order-actions">
                            <Link href={detailHref} className="context-action">
                              Detay<Icon name="arrow" size={15} />
                            </Link>
                            <OrderContextMenu
                              order={order}
                              detailHref={detailHref}
                              isFavorite={isFav(order.code)}
                              isMessageClosed={msgClosedSet.has(order.code)}
                              onFavoriteToggle={() => toggleFavorite(order)}
                              onCancelRequest={() => setConfirmCfg({ type: "cancel", code: order.code })}
                              onDeleteRequest={() => setConfirmCfg({ type: "delete", code: order.code })}
                              onArchive={() => archive(order.code)}
                              onCloseMessage={() => closeMessage(order.code)}
                              onShowActivity={() => setActivityFor(order.code)}
                              onShowRelated={() => setRelatedFor(order.code)}
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Modaller */}
      {activityFor && <ActivityModal orderCode={activityFor} onClose={() => setActivityFor(null)} />}
      {relatedFor  && <RelatedOrdersModal orderCode={relatedFor} relatedOrders={relatedOrders} detailHref={detailHref} onClose={() => setRelatedFor(null)} />}
      {confirmCfg  && <ConfirmModal cfg={confirmCfg} onConfirm={executeConfirm} onClose={() => setConfirmCfg(null)} />}
    </>
  );
}
