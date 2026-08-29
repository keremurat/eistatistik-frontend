"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AdminShell } from "../AdminShell";
import { DUYURULAR, Duyuru, DuyuruDurum } from "./data";

type IconName = "plus" | "dots" | "edit" | "trash";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus:  <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    dots:  <><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" /></>,
    edit:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── Portal tabanlı 3-nokta menüsü ─────────────────────────────────────────────
function RowMenu({ id, basePath, onDelete }: { id: number; basePath: string; onDelete: () => void }) {
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
      const MENU_H = 90;
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
    const MENU_H = 90;
    const top    = window.innerHeight - r.bottom - 8 < MENU_H ? r.top - MENU_H - 4 : r.bottom + 4;
    setPos({ top, right: window.innerWidth - r.right });
    setOpen((o) => !o);
  }

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
          <button className="ctx-item ctx-danger" role="menuitem" onClick={() => { setOpen(false); onDelete(); }}>
            <Icon name="trash" size={14} />Sil
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

const FALLBACK_PER_PAGE = 10;   // masaüstü ölçümü hazır olana / mobilde kullanılır
const ROW_HEIGHT = 64;          // .edu-table sabit satır yüksekliği (globals.css)

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)         return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

function plainPreview(icerik: string) {
  return icerik.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/\s+/g, " ").trim();
}

export default function DuyurularPage() {
  return <AdminShell><AnnouncementsContent /></AdminShell>;
}

export function AnnouncementsContent({ basePath = "/admin/duyurular" }: { basePath?: string }) {
  const [rows,       setRows]       = useState<Duyuru[]>(DUYURULAR);
  const [query,      setQuery]      = useState("");
  const [page,       setPage]       = useState(1);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [perPage, setPerPage] = useState(FALLBACK_PER_PAGE);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const desktop = window.matchMedia("(min-width:761px)");
    function recompute() {
      if (!wrap || !desktop.matches) { setPerPage(FALLBACK_PER_PAGE); return; }
      const thead = wrap.querySelector("thead");
      const headH = thead ? thead.getBoundingClientRect().height : 34;
      setPerPage(Math.max(3, Math.floor((wrap.clientHeight - headH) / ROW_HEIGHT)));
    }
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(wrap);
    desktop.addEventListener("change", recompute);
    return () => { ro.disconnect(); desktop.removeEventListener("change", recompute); };
  }, []);

  function confirmDelete() {
    if (confirmDel === null) return;
    setRows((prev) => prev.filter((d) => d.id !== confirmDel));
    setConfirmDel(null);
  }

  const durumStyle: Record<DuyuruDurum, { bg: string; color: string; dot: string }> = {
    Aktif: { bg: "#edf7f1", color: "#287a55", dot: "#3c8a6b" },
    Pasif: { bg: "#f5f7f8", color: "#8493a0", dot: "#b0bfc9" },
  };

  const filtered = rows.filter((d) => {
    if (!query) return true;
    return `${d.baslik} ${plainPreview(d.icerik)}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const emptyRows  = pageItems.length > 0 ? Math.max(0, perPage - pageItems.length) : 0;

  return (
    <>
      <div className="st-page education-list-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Duyuru Listesi</h1>
          </div>
          <Link className="orders-create" href={`${basePath}/ekle`}>
            <Icon name="plus" size={16} />Duyuru Ekle
          </Link>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="edu-list-toolbar" aria-label="Duyuru listesini filtrele">
            <label className="orders-search edu-list-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Başlık veya açıklamada ara…" />
            </label>
            <span className="result-count">{filtered.length} duyuru</span>
          </div>

          <div className="ur-table-wrap" ref={wrapRef}>
            <table className="ur-table edu-table">
              <colgroup>
                <col style={{ width: "52px" }} />
                <col style={{ width: "104px" }} />
                <col style={{ width: "22%" }} />
                <col />
                <col style={{ width: "96px" }} />
                <col style={{ width: "104px" }} />
                <col style={{ width: "52px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="nowrap">ID</th>
                  <th className="nowrap">Eklenme Tarihi</th>
                  <th>Başlık</th>
                  <th>Açıklama</th>
                  <th style={{ textAlign: "center" }}>Durum</th>
                  <th className="nowrap">Yayın Tarihi</th>
                  <th aria-label="İşlem"></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((d) => {
                  const ds = durumStyle[d.durum];
                  const [ekD, ekT] = d.eklemeTarihi.split(" ");
                  const [yaD, yaT] = d.yayinTarihi.split(" ");
                  const preview = plainPreview(d.icerik);
                  return (
                    <tr key={d.id}>
                      <td className="nowrap" style={{ color: "#8493a0", fontSize: ".68rem", fontVariantNumeric: "tabular-nums" }}>{d.id}</td>
                      <td className="nowrap edu-date-cell"><span>{ekD}</span>{ekT && <small>{ekT}</small>}</td>
                      <td><span className="edu-name-link" title={d.baslik} style={{ color: "var(--blue)" }}>{d.baslik}</span></td>
                      <td title={preview} style={{ color: "#526a7d", fontSize: ".68rem", fontWeight: 600 }}>{preview}</td>
                      <td className="nowrap" style={{ textAlign: "center" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: ".28rem",
                          padding: ".22rem .55rem", borderRadius: 99,
                          background: ds.bg, color: ds.color, fontSize: ".62rem", fontWeight: 800,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: ds.dot, flexShrink: 0 }} />
                          {d.durum}
                        </span>
                      </td>
                      <td className="nowrap edu-date-cell"><span>{yaD}</span>{yaT && <small>{yaT}</small>}</td>
                      <td className="edu-actions-cell">
                        <RowMenu id={d.id} basePath={basePath} onDelete={() => setConfirmDel(d.id)} />
                      </td>
                    </tr>
                  );
                })}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>
                      Duyuru bulunamadı.
                    </td>
                  </tr>
                )}
                {Array.from({ length: emptyRows }, (_, index) => (
                  <tr className="edu-placeholder-row" aria-hidden="true" key={`empty-${index}`}>
                    <td colSpan={7}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="ms-pagination" role="navigation" aria-label="Sayfalama">
              <button disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹ Önceki</button>
              {getPageNumbers(safePage, totalPages).map((p, i) =>
                p === "…"
                  ? <button key={`ell-${i}`} disabled style={{ cursor: "default" }}>…</button>
                  : <button key={p} className={p === safePage ? "active" : ""}
                      aria-current={p === safePage ? "page" : undefined}
                      onClick={() => setPage(p as number)}>{p}</button>
              )}
              <button disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Sonraki ›</button>
            </div>
          )}
        </section>
      </div>

      {confirmDel !== null && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDel(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }}
            role="dialog" aria-modal="true" aria-labelledby="del-duyuru-title">
            <header>
              <div>
                <p className="eyebrow">DİKKAT</p>
                <h2 id="del-duyuru-title" style={{ fontSize: ".9rem" }}>Duyuruyu sil</h2>
              </div>
              <button aria-label="Kapat" onClick={() => setConfirmDel(null)}>×</button>
            </header>
            <div className="ms-edit-body">
              <p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>
                Bu duyuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <footer>
              <div />
              <div>
                <button className="legal-cancel" onClick={() => setConfirmDel(null)}>Vazgeç</button>
                <button className="legal-accept" style={{ background: "#c85a51" }} onClick={confirmDelete}>Evet, Sil</button>
              </div>
            </footer>
          </section>
        </div>,
        document.body
      )}
    </>
  );
}
