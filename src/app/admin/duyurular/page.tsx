"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../AdminShell";
import { DUYURULAR, Duyuru, DuyuruDurum } from "./data";

type IconName = "plus" | "dots" | "edit" | "trash" | "check";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus:  <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    dots:  <><circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" /></>,
    edit:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── 3-nokta context menüsü ────────────────────────────────────────────────────
function ContextMenu({
  duyuruId,
  basePath,
  open,
  onClose,
  onDelete,
}: {
  duyuruId: number;
  basePath: string;
  open: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div ref={ref} role="menu" style={{
      position: "absolute", top: "calc(100% + 4px)", right: 0,
      background: "#fff", borderRadius: 10, padding: ".3rem",
      boxShadow: "0 8px 24px rgba(19,43,70,.13)",
      border: "1px solid var(--line)",
      minWidth: 140, zIndex: 50,
      animation: "profile-menu-in .15s ease-out",
    }}>
      <Link
        href={`${basePath}/duzenle?id=${duyuruId}`}
        role="menuitem"
        onClick={onClose}
        style={{
          display: "flex", alignItems: "center", gap: ".5rem",
          padding: ".45rem .65rem", borderRadius: 7,
          fontSize: ".7rem", fontWeight: 700, color: "var(--ink)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f4f7f9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        <Icon name="edit" size={14} />Düzenle
      </Link>
      <button
        role="menuitem"
        type="button"
        onClick={() => { onDelete(duyuruId); onClose(); }}
        style={{
          display: "flex", alignItems: "center", gap: ".5rem",
          width: "100%", padding: ".45rem .65rem", borderRadius: 7,
          border: 0, background: "transparent", cursor: "pointer",
          fontSize: ".7rem", fontWeight: 700, color: "#c85a51",
          marginTop: ".15rem",
          borderTop: "1px solid #f0f3f5",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fff3f2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        <Icon name="trash" size={14} />Sil
      </button>
    </div>
  );
}

// ── Sayfa ─────────────────────────────────────────────────────────────────────
export default function DuyurularPage() {
  return <AdminShell><AnnouncementsContent /></AdminShell>;
}

export function AnnouncementsContent({ basePath = "/admin/duyurular" }: { basePath?: string }) {
  const [rows,        setRows]        = useState<Duyuru[]>(DUYURULAR);
  const [openMenu,    setOpenMenu]    = useState<number | null>(null);
  const [deleted,     setDeleted]     = useState<number | null>(null);
  const [confirmDel,  setConfirmDel]  = useState<number | null>(null);

  function handleDelete(id: number) {
    setConfirmDel(id);
  }
  function confirmDelete() {
    if (confirmDel === null) return;
    setDeleted(confirmDel);
    setRows((prev) => prev.filter((d) => d.id !== confirmDel));
    setConfirmDel(null);
    setTimeout(() => setDeleted(null), 2000);
  }

  const durumStyle: Record<DuyuruDurum, { bg: string; color: string; dot: string }> = {
    Aktif: { bg: "#edf7f1", color: "#287a55", dot: "#3c8a6b" },
    Pasif: { bg: "#f5f7f8", color: "#8493a0", dot: "#b0bfc9" },
  };

  return (
    <>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Duyuru Listesi</h1>
          </div>
          <Link
            href={`${basePath}/ekle`}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              minHeight: 38, padding: "0 1.1rem", border: 0, borderRadius: 8,
              background: "var(--navy)", color: "#fff",
              fontSize: ".7rem", fontWeight: 800, textDecoration: "none",
            }}>
            <Icon name="plus" size={14} />Duyuru Ekle
          </Link>
        </header>

        {/* Silme onay dialog */}
        {confirmDel !== null && (
          <div style={{
            padding: ".85rem 1.2rem", borderRadius: 10, marginBottom: "1rem",
            background: "#fff3f2", border: "1px solid #f5ccc9",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
          }}>
            <span style={{ fontSize: ".73rem", fontWeight: 700, color: "#ad4f4f" }}>
              Bu duyuru silinecek. Emin misiniz?
            </span>
            <div style={{ display: "flex", gap: ".4rem" }}>
              <button type="button" onClick={() => setConfirmDel(null)}
                style={{
                  padding: ".35rem .85rem", border: "1px solid var(--line)", borderRadius: 7,
                  background: "#fff", color: "#526a7d",
                  fontSize: ".67rem", fontWeight: 800, cursor: "pointer",
                }}>
                İptal
              </button>
              <button type="button" onClick={confirmDelete}
                style={{
                  padding: ".35rem .85rem", border: 0, borderRadius: 7,
                  background: "#ad4f4f", color: "#fff",
                  fontSize: ".67rem", fontWeight: 800, cursor: "pointer",
                }}>
                Evet, sil
              </button>
            </div>
          </div>
        )}

        {deleted !== null && (
          <div style={{
            display: "flex", alignItems: "center", gap: ".5rem",
            padding: ".65rem 1rem", borderRadius: 9,
            background: "#edf7f1", color: "#287a55",
            fontSize: ".72rem", fontWeight: 800, marginBottom: "1rem",
          }}>
            <Icon name="check" size={14} />Duyuru silindi.
          </div>
        )}

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="ur-table-wrap">
            <table className="ur-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>ID</th>
                  <th style={{ width: 120 }}>Eklenme Tarihi</th>
                  <th style={{ width: 200 }}>Başlık</th>
                  <th>Açıklama</th>
                  <th style={{ textAlign: "center", width: 80 }}>Durum</th>
                  <th style={{ width: 110 }}>Yayın Tarihi</th>
                  <th style={{ width: 56, textAlign: "center" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "#8493a0", fontSize: ".75rem" }}>
                      Henüz duyuru eklenmedi
                    </td>
                  </tr>
                ) : rows.map((d) => {
                  const ds = durumStyle[d.durum];
                  const preview = d.icerik
                    .replace(/\*\*(.+?)\*\*/g, "$1")
                    .replace(/\*(.+?)\*/g, "$1")
                    .replace(/\n+/g, " ")
                    .trim()
                    .slice(0, 120);
                  return (
                    <tr key={d.id}>
                      <td style={{ color: "#8493a0", fontSize: ".68rem" }}>{d.id}</td>
                      <td style={{ fontSize: ".68rem", color: "#54687a", whiteSpace: "pre-line" }}>
                        {d.eklemeTarihi.replace(" ", "\n")}
                      </td>
                      <td style={{ fontSize: ".72rem", fontWeight: 800, color: "var(--blue)" }}>
                        {d.baslik}
                      </td>
                      <td style={{ fontSize: ".68rem", color: "#526a7d", maxWidth: "40ch" }}>
                        {preview}{preview.length < d.icerik.replace(/\n+/g, " ").trim().length ? "…" : ""}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: ".28rem",
                          padding: ".22rem .55rem", borderRadius: 99,
                          background: ds.bg, color: ds.color,
                          fontSize: ".62rem", fontWeight: 800,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: ds.dot, flexShrink: 0 }} />
                          {d.durum}
                        </span>
                      </td>
                      <td style={{ fontSize: ".68rem", color: "#54687a", whiteSpace: "pre-line" }}>
                        {d.yayinTarihi.replace(" ", "\n")}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <button
                            type="button"
                            onClick={() => setOpenMenu((prev) => (prev === d.id ? null : d.id))}
                            aria-haspopup="menu"
                            aria-expanded={openMenu === d.id}
                            aria-label="İşlemler"
                            style={{
                              display: "grid", placeItems: "center",
                              width: 32, height: 32, border: "1px solid var(--line)",
                              borderRadius: 7, background: openMenu === d.id ? "#f0f4f7" : "#fff",
                              cursor: "pointer", color: "#526a7d",
                            }}>
                            <Icon name="dots" size={16} />
                          </button>
                          <ContextMenu
                            duyuruId={d.id}
                            basePath={basePath}
                            open={openMenu === d.id}
                            onClose={() => setOpenMenu(null)}
                            onDelete={handleDelete}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
