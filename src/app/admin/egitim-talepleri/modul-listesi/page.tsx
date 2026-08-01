"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { modules } from "./data";

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
            onClick={() => { setOpen(false); router.push(`/admin/egitim-talepleri/modul-listesi/duzenle?id=${id}`); }}>
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

const PER_PAGE = 10;

export default function ModulListesiPage() {
  const [page,       setPage]       = useState(1);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const visible    = modules.filter((m) => !deletedIds.has(m.id));
  const totalPages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = visible.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM · EĞİTİM TALEPLERİ</p>
            <h1>Modül Listesi</h1>
          </div>
          <Link className="orders-create" href="/admin/egitim-talepleri/modul-listesi/ekle">
            <Icon name="plus" size={16} />Ekle
          </Link>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="ur-table-wrap">
            <table className="ur-table edu-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>ID</th>
                  <th>Adı</th>
                  <th>URL</th>
                  <th>Açıklama</th>
                  <th style={{ width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((m) => (
                  <tr key={m.id}>
                    <td className="ms-id-cell">{m.id}</td>
                    <td><span className="edu-name-link">{m.adi}</span></td>
                    <td>
                      {m.url
                        ? <a className="edu-url-cell" href={m.url} target="_blank" rel="noopener noreferrer" title={m.url}>{m.url}</a>
                        : <span style={{ color: "var(--muted)", fontSize: ".64rem" }}>—</span>}
                    </td>
                    <td style={{ maxWidth: 260 }}>{m.aciklama || <span style={{ color: "var(--muted)" }}>—</span>}</td>
                    <td style={{ textAlign: "center", padding: "0 .5rem" }}>
                      <RowMenu id={m.id} onDelete={() => setDeleteConfirm(m.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="ms-pagination" role="navigation" aria-label="Sayfalama">
              <button disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹ Önceki</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === safePage ? "active" : ""}
                  aria-current={p === safePage ? "page" : undefined}
                  onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Sonraki ›</button>
            </div>
          )}
        </section>
      </div>

      {deleteConfirm !== null && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }}
            role="dialog" aria-modal="true" aria-labelledby="del-m-title">
            <header>
              <div>
                <p className="eyebrow">DİKKAT</p>
                <h2 id="del-m-title" style={{ fontSize: ".9rem" }}>Modülü sil</h2>
              </div>
              <button aria-label="Kapat" onClick={() => setDeleteConfirm(null)}>×</button>
            </header>
            <div className="ms-edit-body">
              <p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>
                Bu modülü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
