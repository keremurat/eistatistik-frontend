"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { trainings, mockCustomers } from "./data";
import { SystemDropdown } from "../../../components/SystemDropdown";

type IconName = "plus" | "dots" | "edit" | "trash" | "users";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus:  <path d="M12 5v14M5 12h14" />,
    dots:  <><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" /></>,
    edit:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── Row context menu ───────────────────────────────────────────────
type RowMenuProps = {
  id: number;
  basePath: string;
  onDelete: () => void;
  onCustomers: () => void;
};

function RowMenu({ id, basePath, onDelete, onCustomers }: RowMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, right: 0 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router  = useRouter();

  useEffect(() => {
    if (!open) return;
    function update() {
      if (!btnRef.current) return;
      const r      = btnRef.current.getBoundingClientRect();
      const MENU_H = 130;
      const top    = window.innerHeight - r.bottom - 8 < MENU_H ? r.top - MENU_H - 4 : r.bottom + 4;
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
    document.addEventListener("keydown",   onKey);
    return () => {
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown",   onKey);
    };
  }, [open]);

  function toggle() {
    if (!btnRef.current) return;
    const r      = btnRef.current.getBoundingClientRect();
    const MENU_H = 130;
    const top    = window.innerHeight - r.bottom - 8 < MENU_H ? r.top - MENU_H - 4 : r.bottom + 4;
    setPos({ top, right: window.innerWidth - r.right });
    setOpen((o) => !o);
  }

  function act(fn: () => void) { fn(); setOpen(false); }

  return (
    <>
      <button ref={btnRef} className={`dots-btn${open ? " open" : ""}`} onClick={toggle}
        aria-label="İşlemler menüsü" aria-expanded={open} aria-haspopup="menu">
        <Icon name="dots" size={15} />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div ref={menuRef} className="order-ctx-menu" role="menu"
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}>
          <button className="ctx-item" role="menuitem"
            onClick={() => { setOpen(false); router.push(`${basePath}/duzenle?id=${id}`); }}>
            <Icon name="edit" size={14} />Düzenle
          </button>
          <div className="ctx-separator" role="separator" />
          <button className="ctx-item" role="menuitem" onClick={() => act(onCustomers)}>
            <Icon name="users" size={14} />Müşterileri - Siparişleri Görüntüle
          </button>
          <div className="ctx-separator" role="separator" />
          <button className="ctx-item ctx-danger" role="menuitem" onClick={() => act(onDelete)}>
            <Icon name="trash" size={14} />Sil
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

// ── Ana sayfa ──────────────────────────────────────────────────────
const FALLBACK_PER_PAGE = 6;          // masaüstü ölçümü hazır olana / mobilde kullanılır
const ROW_HEIGHT = 64;                // .edu-table sabit satır yüksekliği (globals.css)

export default function EgitimListesiPage() {
  return <AdminShell><EducationListContent /></AdminShell>;
}

export function EducationListContent({ basePath = "/admin/egitim-talepleri/egitim-listesi" }: { basePath?: string }) {
  const [page,      setPage]      = useState(1);
  const [query,     setQuery]     = useState("");
  const [fTur,      setFTur]      = useState("");
  const [fKota,     setFKota]     = useState("");
  const [fEsnek,    setFEsnek]    = useState("");
  const [fDurum,    setFDurum]    = useState("");

  const [deletedIds,    setDeletedIds]    = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [customersId,   setCustomersId]   = useState<number | null>(null);

  // Sayfa başına satır sayısı: masaüstünde tablo alanının boş yüksekliğine göre
  // dinamik hesaplanır; ekran büyüdükçe daha çok satır sığar. Mobilde sabit kalır.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [perPage, setPerPage] = useState(FALLBACK_PER_PAGE);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const desktop = window.matchMedia("(min-width:761px)");

    function recompute() {
      if (!wrap || !desktop.matches) { setPerPage(FALLBACK_PER_PAGE); return; }
      const thead   = wrap.querySelector("thead");
      const headH   = thead ? thead.getBoundingClientRect().height : 34;
      const avail   = wrap.clientHeight - headH;
      setPerPage(Math.max(3, Math.floor(avail / ROW_HEIGHT)));
    }

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(wrap);
    desktop.addEventListener("change", recompute);
    return () => { ro.disconnect(); desktop.removeEventListener("change", recompute); };
  }, []);

  const filtered = trainings.filter((t) => {
    if (deletedIds.has(t.id))                                                          return false;
    if (query && !`${t.adi} ${t.aciklama}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (fTur      && t.tur !== fTur)                                                   return false;
    if (fKota     && !`${t.kota}/${t.katilan}`.includes(fKota))                        return false;
    if (fEsnek    && t.esnekKota !== fEsnek)                                           return false;
    if (fDurum    && t.durum !== fDurum)                                               return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const emptyRows  = pageItems.length > 0 ? Math.max(0, perPage - pageItems.length) : 0;

  function changePage(p: number) { setPage(Math.max(1, Math.min(totalPages, p))); }

  const customersEgitim = customersId !== null
    ? trainings.find((t) => t.id === customersId)
    : null;

  return (
    <>
      <div className="st-page education-list-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM · EĞİTİM TALEPLERİ</p>
            <h1>Eğitim Listesi</h1>
          </div>
          <Link className="orders-create" href={`${basePath}/ekle`}>
            <Icon name="plus" size={16} />Ekle
          </Link>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="edu-list-toolbar" aria-label="Eğitim listesini filtrele">
            <label className="orders-search edu-list-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Eğitim adı veya açıklamada ara…" />
            </label>
            <SystemDropdown className="edu-toolbar-select" ariaLabel="Eğitim türü filtresi" placeholder="Tüm eğitim türleri" value={fTur} onChange={(value) => { setFTur(value); setPage(1); }} options={[{ value: "", label: "Tüm eğitim türleri" }, { value: "Online", label: "Online" }, { value: "Offline", label: "Offline" }]} />
            <label className="edu-capacity-filter">
              <span>Kota / katılan</span>
              <input value={fKota} onChange={(event) => { setFKota(event.target.value); setPage(1); }} placeholder="Örn. 30 / 2" />
            </label>
            <SystemDropdown className="edu-toolbar-select" ariaLabel="Esnek kota filtresi" placeholder="Tüm kota tipleri" value={fEsnek} onChange={(value) => { setFEsnek(value); setPage(1); }} options={[{ value: "", label: "Tüm kota tipleri" }, { value: "Esnek", label: "Esnek" }, { value: "Esnek Değil", label: "Esnek değil" }]} />
            <SystemDropdown className="edu-toolbar-select edu-status-filter" ariaLabel="Durum filtresi" placeholder="Tüm durumlar" value={fDurum} onChange={(value) => { setFDurum(value); setPage(1); }} options={[{ value: "", label: "Tüm durumlar" }, { value: "Aktif", label: "Aktif" }, { value: "Pasif", label: "Pasif" }]} />
            <span className="result-count">{filtered.length} eğitim</span>
          </div>
          <div className="ur-table-wrap" ref={wrapRef}>
            <table className="ur-table edu-table">
              <colgroup>
                <col className="edu-col-summary" />
                <col className="edu-col-type" />
                <col className="edu-col-capacity" />
                <col className="edu-col-quota" />
                <col className="edu-col-status" />
                <col className="edu-col-date" />
                <col className="edu-col-price" />
                <col className="edu-col-actions" />
              </colgroup>
              <thead>
                <tr>
                  <th>Eğitim</th>
                  <th>Tür</th>
                  <th className="nowrap">Katılım</th>
                  <th>Kota tipi</th>
                  <th>Durum</th>
                  <th className="nowrap">Tarih aralığı</th>
                  <th>Ücret</th>
                  <th aria-label="İşlemler"></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => (
                  <tr key={t.id}>
                    <td className="edu-summary-cell"><span className="edu-name-link" title={t.adi}>{t.adi}</span><small title={t.aciklama}>{t.aciklama}</small></td>
                    <td className="nowrap"><span className={`edu-badge ${t.tur.toLowerCase()}`}>{t.tur}</span></td>
                    <td className="nowrap"><strong className="edu-capacity-value">{t.katilan}</strong><span className="edu-capacity-total"> / {t.kota}</span></td>
                    <td className="nowrap"><span className={`edu-badge ${t.esnekKota === "Esnek" ? "esnek" : "esnek-degil"}`}>{t.esnekKota}</span></td>
                    <td className="nowrap"><span className={`edu-badge ${t.durum.toLowerCase()}`}>{t.durum}</span></td>
                    <td className="nowrap edu-date-cell"><span>{t.baslama}</span><small>{t.bitis}</small></td>
                    <td className="nowrap edu-price-cell">{t.ucret.toLocaleString("tr-TR")} TL</td>
                    <td className="edu-actions-cell">
                      <RowMenu
                        id={t.id}
                        basePath={basePath}
                        onDelete={() => setDeleteConfirm(t.id)}
                        onCustomers={() => setCustomersId(t.id)}
                      />
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                )}
                {Array.from({ length: emptyRows }, (_, index) => (
                  <tr className="edu-placeholder-row" aria-hidden="true" key={`empty-${index}`}>
                    <td colSpan={8}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="ms-pagination" role="navigation" aria-label="Sayfalama">
              <button disabled={safePage === 1} onClick={() => changePage(safePage - 1)}>‹ Önceki</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === safePage ? "active" : ""}
                  aria-current={p === safePage ? "page" : undefined}
                  onClick={() => changePage(p)}>{p}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => changePage(safePage + 1)}>Sonraki ›</button>
            </div>
          )}
        </section>
      </div>

      {/* ── Sil onay modalı ── */}
      {deleteConfirm !== null && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }}
            role="dialog" aria-modal="true" aria-labelledby="del-title">
            <header>
              <div>
                <p className="eyebrow">DİKKAT</p>
                <h2 id="del-title" style={{ fontSize: ".9rem" }}>Eğitimi sil</h2>
              </div>
              <button aria-label="Kapat" onClick={() => setDeleteConfirm(null)}>×</button>
            </header>
            <div className="ms-edit-body">
              <p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>
                Bu eğitimi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <footer>
              <div />
              <div>
                <button className="legal-cancel" onClick={() => setDeleteConfirm(null)}>Vazgeç</button>
                <button className="legal-accept" style={{ background: "#c85a51" }}
                  onClick={() => {
                    setDeletedIds((s) => new Set([...s, deleteConfirm!]));
                    setDeleteConfirm(null);
                  }}>
                  Evet, Sil
                </button>
              </div>
            </footer>
          </section>
        </div>,
        document.body
      )}

      {/* ── Müşteriler modalı ── */}
      {customersId !== null && typeof document !== "undefined" && createPortal(
        <div className="cm-backdrop" role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setCustomersId(null); }}>
          <div className="cm-dialog" role="dialog" aria-modal="true" aria-labelledby="cm-title">
            <div className="cm-head">
              <h2 id="cm-title">
                Eğitime Kayıt Olan Müşteriler
                {customersEgitim && <span style={{ fontWeight: 600, opacity: .75, marginLeft: ".5rem", fontSize: ".77rem" }}>— {customersEgitim.adi}</span>}
              </h2>
              <button className="cm-head-close" aria-label="Kapat" onClick={() => setCustomersId(null)}>×</button>
            </div>
            <div className="cm-body">
              <table className="cm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>KULLANICI</th>
                    <th>SİPARİŞ KODU</th>
                    <th>KAYIT TARİHİ</th>
                    <th>GSM</th>
                    <th>E-POSTA</th>
                    <th>DURUM</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCustomers.map((c) => (
                    <tr key={c.no}>
                      <td>{c.no}</td>
                      <td><a className="cm-user-link" href="/admin/kullanici">{c.kullanici}</a></td>
                      <td><a className="cm-order-link" href="/admin/siparisler">{c.siparisKodu}</a></td>
                      <td style={{ color: "#54687a", fontWeight: 600 }}>{c.tarih}</td>
                      <td style={{ color: "#54687a", fontWeight: 600 }}>{c.gsm}</td>
                      <td style={{ color: "#54687a", fontWeight: 600, fontSize: ".65rem" }}>{c.email}</td>
                      <td><span className="cm-status-ok">{c.durum}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cm-foot">
              <button className="cm-foot-excel">EXCEL</button>
              <button className="cm-foot-close" onClick={() => setCustomersId(null)}>Kapat</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
