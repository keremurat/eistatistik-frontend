"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AdminShell } from "../AdminShell";
import { KULLANICILAR, KullaniciDurum, KullaniciRol } from "./data";

type IconName = "user" | "arrow";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    user:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    arrow:  <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
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

const ROL_RENK: Record<KullaniciRol, { bg: string; color: string }> = {
  Admin:   { bg: "#ede9fb", color: "#5b3fcc" },
  Analist: { bg: "#e9f4fb", color: "#1775a9" },
  Editör:  { bg: "#edf7f1", color: "#287a55" },
  Asistan: { bg: "#fdf3e7", color: "#b66d2e" },
  Müşteri: { bg: "#f0f4f7", color: "#526a7d" },
};

const DURUM_RENK: Record<KullaniciDurum, { bg: string; color: string; dot: string }> = {
  Aktif: { bg: "#edf7f1", color: "#287a55", dot: "#3c8a6b" },
  Pasif: { bg: "#f5f7f8", color: "#8493a0", dot: "#b0bfc9" },
};

export default function KullaniciListesiPage() {
  return <AdminShell><UserListContent /></AdminShell>;
}

export function UserListContent({ basePath = "/admin/kullanici-yonetimi" }: { basePath?: string }) {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

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

  const filtered = KULLANICILAR.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      u.adSoyad.toLowerCase().includes(q) ||
      u.eposta.toLowerCase().includes(q) ||
      u.gsm.includes(q) ||
      String(u.id).includes(q) ||
      u.rol.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const emptyRows  = pageItems.length > 0 ? Math.max(0, perPage - pageItems.length) : 0;

  return (
    <div className="st-page education-list-page">
      <header className="orders-hero">
        <div>
          <p className="eyebrow">KULLANICI YÖNETİMİ</p>
          <h1>Kullanıcı Listesi</h1>
        </div>
      </header>

      <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
        <div className="edu-list-toolbar" aria-label="Kullanıcı listesini filtrele">
          <label className="orders-search edu-list-search">
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Ad, e-posta, GSM veya ID ara…" />
          </label>
          <span className="result-count">{filtered.length} kullanıcı</span>
        </div>

        <div className="ur-table-wrap" ref={wrapRef}>
          <table className="ur-table edu-table">
            <colgroup>
              <col style={{ width: "56px" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "92px" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="nowrap">ID</th>
                <th>Adı Soyadı</th>
                <th>E-posta</th>
                <th>GSM</th>
                <th style={{ textAlign: "center" }}>Tür</th>
                <th style={{ textAlign: "center" }}>Durum</th>
                <th style={{ textAlign: "center" }}>Rol</th>
                <th style={{ textAlign: "right" }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((u) => {
                const rol    = ROL_RENK[u.rol];
                const durum  = DURUM_RENK[u.durum];
                return (
                  <tr key={u.id}>
                    <td className="nowrap" style={{ color: "#8493a0", fontSize: ".68rem", fontVariantNumeric: "tabular-nums" }}>
                      {u.id}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", minWidth: 0 }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: "#edf1f5", color: "#54687a",
                          display: "grid", placeItems: "center", flexShrink: 0,
                        }}>
                          <Icon name="user" size={13} />
                        </span>
                        <span style={{ fontSize: ".72rem", fontWeight: 800, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={u.adSoyad}>
                          {u.adSoyad}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: "#54687a", fontSize: ".7rem" }} title={u.eposta}>{u.eposta}</td>
                    <td className="nowrap" style={{ color: "#54687a", fontSize: ".7rem", fontVariantNumeric: "tabular-nums" }}>
                      {u.gsm}
                    </td>
                    <td className="nowrap" style={{ textAlign: "center" }}>
                      <span style={{ fontSize: ".62rem", fontWeight: 800, color: "#617689" }}>
                        {u.tur}
                      </span>
                    </td>
                    <td className="nowrap" style={{ textAlign: "center" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: ".3rem",
                        padding: ".22rem .6rem", borderRadius: 99,
                        background: durum.bg, color: durum.color,
                        fontSize: ".62rem", fontWeight: 800,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: durum.dot, flexShrink: 0 }} />
                        {u.durum}
                      </span>
                    </td>
                    <td className="nowrap" style={{ textAlign: "center" }}>
                      <span style={{
                        display: "inline-block", padding: ".22rem .6rem", borderRadius: 99,
                        background: rol.bg, color: rol.color,
                        fontSize: ".62rem", fontWeight: 800,
                      }}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="nowrap" style={{ textAlign: "right" }}>
                      <Link
                        href={`${basePath}/${u.id}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: ".3rem",
                          padding: ".3rem .75rem", border: 0, borderRadius: 7,
                          background: "var(--navy)", color: "#fff",
                          fontSize: ".67rem", fontWeight: 800, textDecoration: "none",
                        }}>
                        Detay <Icon name="arrow" size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>
                    Kullanıcı bulunamadı
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
  );
}
