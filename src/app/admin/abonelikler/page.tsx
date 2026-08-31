"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../AdminShell";

type AbonelikDurum = "Aktif" | "Pasif" | "İptal";
type OdemeDurum = "Ödendi" | "Bekliyor" | "Başarısız";
type Abonelik = {
  id: number;
  musteri: string;
  durum: AbonelikDurum;
  baslangic: string;
  bitis: string;
  ucret: number;
  odeme: OdemeDurum;
};

const ABONELIKLER: Abonelik[] = [
  { id: 1,  musteri: "Kerem Murat",        durum: "Aktif", baslangic: "12.01.2026", bitis: "12.01.2027", ucret: 2400, odeme: "Ödendi"    },
  { id: 2,  musteri: "Yeşim Yaptırmış",    durum: "Aktif", baslangic: "03.02.2026", bitis: "03.02.2027", ucret: 2400, odeme: "Ödendi"    },
  { id: 3,  musteri: "Ayşe Kaya",          durum: "Pasif", baslangic: "20.11.2025", bitis: "20.11.2026", ucret: 1800, odeme: "Bekliyor"  },
  { id: 4,  musteri: "Mehmet Arslan",      durum: "Aktif", baslangic: "08.03.2026", bitis: "08.03.2027", ucret: 3600, odeme: "Ödendi"    },
  { id: 5,  musteri: "Ebru Buket Erken",   durum: "İptal", baslangic: "14.09.2025", bitis: "14.09.2026", ucret: 1800, odeme: "Başarısız" },
  { id: 6,  musteri: "Naci Murat",         durum: "Aktif", baslangic: "01.02.2026", bitis: "01.02.2027", ucret: 2400, odeme: "Ödendi"    },
  { id: 7,  musteri: "Rabia Aktaş",        durum: "Pasif", baslangic: "17.12.2025", bitis: "17.12.2026", ucret: 1800, odeme: "Bekliyor"  },
  { id: 8,  musteri: "Fatih Akar",         durum: "Aktif", baslangic: "25.01.2026", bitis: "25.01.2027", ucret: 3600, odeme: "Ödendi"    },
  { id: 9,  musteri: "Başak Sözüdoğru",    durum: "Aktif", baslangic: "09.02.2026", bitis: "09.02.2027", ucret: 2400, odeme: "Ödendi"    },
  { id: 10, musteri: "Emine Dilara Çolpak", durum: "İptal", baslangic: "28.06.2025", bitis: "28.06.2026", ucret: 1800, odeme: "Başarısız" },
  { id: 11, musteri: "Tuğçe Koç",          durum: "Aktif", baslangic: "22.04.2026", bitis: "22.04.2027", ucret: 2400, odeme: "Ödendi"    },
  { id: 12, musteri: "Aliihsan Şükür",     durum: "Pasif", baslangic: "05.12.2025", bitis: "05.12.2026", ucret: 1800, odeme: "Bekliyor"  },
  { id: 13, musteri: "Hale Sarı",          durum: "Aktif", baslangic: "18.03.2026", bitis: "18.03.2027", ucret: 3600, odeme: "Ödendi"    },
  { id: 14, musteri: "E Yönetim",          durum: "Aktif", baslangic: "30.01.2026", bitis: "30.01.2027", ucret: 2400, odeme: "Ödendi"    },
];

const durumStyle: Record<AbonelikDurum, { bg: string; color: string; dot: string }> = {
  Aktif: { bg: "#edf7f1", color: "#287a55", dot: "#3c8a6b" },
  Pasif: { bg: "#f5f7f8", color: "#8493a0", dot: "#b0bfc9" },
  İptal: { bg: "#fff3f2", color: "#ad4f4f", dot: "#c85a51" },
};

const odemeStyle: Record<OdemeDurum, { bg: string; color: string }> = {
  Ödendi:    { bg: "#edf7f1", color: "#287a55" },
  Bekliyor:  { bg: "#fdf6ec", color: "#b66d2e" },
  Başarısız: { bg: "#fff3f2", color: "#ad4f4f" },
};

type IconName = "arrow";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
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

export default function AboneliklerPage() {
  const [query, setQuery] = useState("");
  const [page,  setPage]  = useState(1);

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

  const filtered = ABONELIKLER.filter((a) => {
    if (!query) return true;
    return `${a.musteri} ${a.durum} ${a.odeme}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"));
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
            <p className="eyebrow">YÖNETİM</p>
            <h1>Abonelikler</h1>
          </div>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="edu-list-toolbar" aria-label="Abonelikleri filtrele">
            <label className="orders-search edu-list-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Müşteri, durum veya ödemede ara…" />
            </label>
            <span className="result-count">{filtered.length} kayıt</span>
          </div>

          <div className="ur-table-wrap" ref={wrapRef}>
            <table className="ur-table edu-table">
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "92px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Müşteri</th>
                  <th style={{ textAlign: "center" }}>Durum</th>
                  <th className="nowrap">Başlangıç</th>
                  <th className="nowrap">Bitiş</th>
                  <th>Ücret</th>
                  <th style={{ textAlign: "center" }}>Ödeme</th>
                  <th style={{ textAlign: "right" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((a) => {
                  const ds = durumStyle[a.durum];
                  const os = odemeStyle[a.odeme];
                  return (
                    <tr key={a.id}>
                      <td><span className="edu-name-link" title={a.musteri} style={{ color: "var(--navy)" }}>{a.musteri}</span></td>
                      <td className="nowrap" style={{ textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: ".28rem", padding: ".22rem .55rem", borderRadius: 99, background: ds.bg, color: ds.color, fontSize: ".62rem", fontWeight: 800 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: ds.dot, flexShrink: 0 }} />
                          {a.durum}
                        </span>
                      </td>
                      <td className="nowrap" style={{ color: "#54687a", fontSize: ".68rem", fontVariantNumeric: "tabular-nums" }}>{a.baslangic}</td>
                      <td className="nowrap" style={{ color: "#54687a", fontSize: ".68rem", fontVariantNumeric: "tabular-nums" }}>{a.bitis}</td>
                      <td className="nowrap" style={{ color: "var(--navy)", fontSize: ".7rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{a.ucret.toLocaleString("tr-TR")} ₺</td>
                      <td className="nowrap" style={{ textAlign: "center" }}>
                        <span style={{ display: "inline-block", padding: ".22rem .6rem", borderRadius: 99, background: os.bg, color: os.color, fontSize: ".62rem", fontWeight: 800 }}>
                          {a.odeme}
                        </span>
                      </td>
                      <td className="nowrap" style={{ textAlign: "right" }}>
                        <Link href="/admin/kullanici" style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", padding: ".3rem .7rem", border: 0, borderRadius: 7, background: "var(--navy)", color: "#fff", fontSize: ".67rem", fontWeight: 800, textDecoration: "none" }}>
                          Detay <Icon name="arrow" size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>
                      Abonelik bulunamadı.
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
    </AdminShell>
  );
}
