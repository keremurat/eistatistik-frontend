"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AdminShell } from "../AdminShell";

type KodTip = "percentage" | "amount";
type IndirimKodu = {
  id: number;
  kod: string;
  aciklama: string;
  aciklamaLink: boolean;
  tip: KodTip;
  tutar: number;
  limit: number;
  kullanilan: number;
  baslama: string;
  bitis: string;
};

const DATA: IndirimKodu[] = [
  { id: 1,  kod: "deneme61",   aciklama: "Deneme",                                     aciklamaLink: false, tip: "percentage", tutar: 100,         limit: 1,          kullanilan: 1, baslama: "07/20/2026", bitis: "07/31/2026" },
  { id: 2,  kod: "5454200764", aciklama: "PR260727007 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "7/27/2026",  bitis: "7/27/2027"  },
  { id: 3,  kod: "5073921340", aciklama: "SA260715002 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 4000,    limit: 1,          kullanilan: 1, baslama: "7/17/2026",  bitis: "7/17/2027"  },
  { id: 4,  kod: "5324015626", aciklama: "PA260709007 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "7/9/2026",   bitis: "7/9/2027"   },
  { id: 5,  kod: "5324015626", aciklama: "SA260706018 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "7/9/2026",   bitis: "7/9/2027"   },
  { id: 6,  kod: "5373506973", aciklama: "SA260707014 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 1000,    limit: 1,          kullanilan: 1, baslama: "7/8/2026",   bitis: "7/8/2027"   },
  { id: 7,  kod: "5077364511", aciklama: "TR260703006 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "7/3/2026",   bitis: "7/3/2027"   },
  { id: 8,  kod: "5428850748", aciklama: "SA260626003 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 1000,    limit: 1,          kullanilan: 1, baslama: "7/1/2026",   bitis: "7/1/2027"   },
  { id: 9,  kod: "faseka",     aciklama: "",                                            aciklamaLink: false, tip: "percentage", tutar: 100,         limit: 2,          kullanilan: 2, baslama: "06/29/2026", bitis: "07/01/2026" },
  { id: 10, kod: "5397483968", aciklama: "TR260630020 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 5397483968, limit: 1,       kullanilan: 0, baslama: "6/30/2026",  bitis: "6/30/2027"  },
  { id: 11, kod: "5419039758", aciklama: "SA260628001 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 2000,    limit: 1,          kullanilan: 1, baslama: "6/28/2026",  bitis: "6/28/2027"  },
  { id: 12, kod: "5361234567", aciklama: "PA260625004 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 50,      limit: 1,          kullanilan: 1, baslama: "6/25/2026",  bitis: "6/25/2027"  },
  { id: 13, kod: "EIST2026",   aciklama: "Kampanya kodu",                               aciklamaLink: false, tip: "percentage", tutar: 10,          limit: 100,        kullanilan: 43, baslama: "6/1/2026",  bitis: "12/31/2026" },
  { id: 14, kod: "5287364511", aciklama: "TR260620008 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "6/20/2026",  bitis: "6/20/2027"  },
  { id: 15, kod: "5098765432", aciklama: "SA260618005 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 500,     limit: 1,          kullanilan: 1, baslama: "6/18/2026",  bitis: "6/18/2027"  },
  { id: 16, kod: "5312345678", aciklama: "PA260615002 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "6/15/2026",  bitis: "6/15/2027"  },
  { id: 17, kod: "YAZ2026",    aciklama: "Yaz kampanyası",                              aciklamaLink: false, tip: "percentage", tutar: 15,          limit: 50,         kullanilan: 22, baslama: "6/1/2026",  bitis: "8/31/2026"  },
  { id: 18, kod: "5478901234", aciklama: "TR260612003 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "6/12/2026",  bitis: "6/12/2027"  },
  { id: 19, kod: "5198765432", aciklama: "SA260610007 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 750,     limit: 1,          kullanilan: 0, baslama: "6/10/2026",  bitis: "6/10/2027"  },
  { id: 20, kod: "5534567890", aciklama: "PA260608001 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,          kullanilan: 1, baslama: "6/8/2026",   bitis: "6/8/2027"   },
];

type IconName = "plus";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
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

function formatTutar(k: IndirimKodu) {
  const n = k.tutar.toLocaleString("tr-TR");
  return k.tip === "percentage" ? `%${n}` : `${n} ₺`;
}

export default function IndirimKoduListesiPage() {
  const [page,  setPage]  = useState(1);
  const [query, setQuery] = useState("");

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

  const filtered = DATA.filter((k) => {
    if (query && !`${k.kod} ${k.aciklama}`.toLowerCase().includes(query.toLowerCase())) return false;
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
            <p className="eyebrow">YÖNETİM</p>
            <h1>İndirim Kodu Listesi</h1>
          </div>
          <Link className="orders-create" href="/admin/indirim-kodlari/ekle">
            <Icon name="plus" size={16} />Ekle
          </Link>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="edu-list-toolbar" aria-label="İndirim kodlarını filtrele">
            <label className="orders-search edu-list-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Kod veya açıklamada ara…" />
            </label>
            <span className="result-count">{filtered.length} kod</span>
          </div>

          <div className="ur-table-wrap" ref={wrapRef}>
            <table className="ur-table edu-table">
              <colgroup>
                <col style={{ width: "13%" }} />
                <col style={{ width: "33%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Kod</th>
                  <th>Açıklama</th>
                  <th>Tipi</th>
                  <th>Tutar</th>
                  <th className="nowrap">Limit / Kullanılan</th>
                  <th className="nowrap">Başlama - Bitiş Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((k) => (
                  <tr key={k.id}>
                    <td><span className="ic-code" title={k.kod}>{k.kod}</span></td>
                    <td>
                      {k.aciklama
                        ? k.aciklamaLink
                          ? <a className="ic-desc-link" href="/admin/siparisler" title={k.aciklama}>{k.aciklama}</a>
                          : <span style={{ color: "#3f556a", fontWeight: 700 }} title={k.aciklama}>{k.aciklama}</span>
                        : <span style={{ color: "var(--muted)" }}>—</span>
                      }
                    </td>
                    <td style={{ color: "#54687a", fontWeight: 600, fontSize: ".7rem" }}>
                      {k.tip === "percentage" ? "Yüzde" : "Tutar"}
                    </td>
                    <td style={{ color: "var(--navy)", fontWeight: 700, fontSize: ".7rem" }}>{formatTutar(k)}</td>
                    <td style={{ color: "#54687a", fontWeight: 700, fontSize: ".7rem" }}>{k.limit} / {k.kullanilan}</td>
                    <td className="ic-date-cell">{k.baslama} - {k.bitis}</td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                )}
                {Array.from({ length: emptyRows }, (_, index) => (
                  <tr className="edu-placeholder-row" aria-hidden="true" key={`empty-${index}`}>
                    <td colSpan={6}></td>
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
    </AdminShell>
  );
}
