"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { lessons } from "./data";

type IconName = "plus" | "dots" | "edit" | "trash";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus:  <path d="M12 5v14M5 12h14" />,
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

function RowMenu({ id, onDelete }: { id: number; onDelete: () => void }) {
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
            onClick={() => { setOpen(false); router.push(`/admin/egitim-talepleri/ders-listesi/duzenle?id=${id}`); }}>
            <Icon name="edit" size={14} />Düzenle
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

const FALLBACK_PER_PAGE = 10;   // masaüstü ölçümü hazır olana / mobilde kullanılır
const ROW_HEIGHT = 64;          // .edu-table sabit satır yüksekliği (globals.css)

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)         return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export default function DersListesiPage() {
  const [page,         setPage]         = useState(1);
  const [query,        setQuery]        = useState("");
  const [deletedIds,   setDeletedIds]   = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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

  const filtered = lessons.filter((d) => {
    if (deletedIds.has(d.id)) return false;
    if (query && !`${d.adi} ${d.aciklama} ${d.modul}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const emptyRows  = pageItems.length > 0 ? Math.max(0, perPage - pageItems.length) : 0;

  return (
    <AdminShell>
      <div className="st-page education-list-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM · EĞİTİM TALEPLERİ</p>
            <h1>Ders Listesi</h1>
          </div>
          <Link className="orders-create" href="/admin/egitim-talepleri/ders-listesi/ekle">
            <Icon name="plus" size={16} />Ekle
          </Link>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="edu-list-toolbar" aria-label="Ders listesini filtrele">
            <label className="orders-search edu-list-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Ders adı, açıklama veya modülde ara…" />
            </label>
            <span className="result-count">{filtered.length} ders</span>
          </div>

          <div className="ur-table-wrap" ref={wrapRef}>
            <table className="ur-table edu-table">
              <colgroup>
                <col style={{ width: "64px" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "26%" }} />
                <col />
                <col style={{ width: "52px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="nowrap">ID</th>
                  <th>Adı</th>
                  <th>Açıklama</th>
                  <th>Hangi Modüllerde Kullanılıyor?</th>
                  <th aria-label="İşlemler"></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((d) => (
                  <tr key={d.id}>
                    <td className="nowrap ms-id-cell">{d.id}</td>
                    <td><span className="edu-name-link" title={d.adi}>{d.adi}</span></td>
                    <td title={d.aciklama || undefined}>{d.aciklama || <span style={{ color: "var(--muted)" }}>—</span>}</td>
                    <td><span className="edu-module-cell" title={d.modul}>{d.modul}</span></td>
                    <td className="edu-actions-cell">
                      <RowMenu id={d.id} onDelete={() => setDeleteConfirm(d.id)} />
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                )}
                {Array.from({ length: emptyRows }, (_, index) => (
                  <tr className="edu-placeholder-row" aria-hidden="true" key={`empty-${index}`}>
                    <td colSpan={5}></td>
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

      {deleteConfirm !== null && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }}
            role="dialog" aria-modal="true" aria-labelledby="del-d-title">
            <header>
              <div>
                <p className="eyebrow">DİKKAT</p>
                <h2 id="del-d-title" style={{ fontSize: ".9rem" }}>Dersi sil</h2>
              </div>
              <button aria-label="Kapat" onClick={() => setDeleteConfirm(null)}>×</button>
            </header>
            <div className="ms-edit-body">
              <p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>
                Bu dersi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
    </AdminShell>
  );
}
