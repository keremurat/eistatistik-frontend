"use client";

import Link from "next/link";
import { useState } from "react";
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

const PER_PAGE = 10;

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1, 2, 3, 4, 5];
  pages.push("…");
  pages.push(total);
  return pages;
}

export default function IndirimKoduListesiPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(DATA.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = DATA.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>İndirim Kodu Listesi</h1>
          </div>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div style={{ padding: ".85rem 1.1rem .65rem", borderBottom: "1px solid var(--line)" }}>
            <Link className="orders-create" href="/admin/indirim-kodlari/ekle">
              <Icon name="plus" size={15} />Ekle
            </Link>
          </div>

          <div className="ur-table-wrap">
            <table className="ur-table">
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
                    <td><span className="ic-code">{k.kod}</span></td>
                    <td>
                      {k.aciklama
                        ? k.aciklamaLink
                          ? <a className="ic-desc-link" href="/admin/siparisler">{k.aciklama}</a>
                          : <span style={{ color: "#3f556a", fontWeight: 700 }}>{k.aciklama}</span>
                        : <span style={{ color: "var(--muted)" }}>—</span>
                      }
                    </td>
                    <td style={{ color: "#54687a", fontWeight: 600, fontSize: ".7rem" }}>{k.tip}</td>
                    <td style={{ color: "var(--navy)", fontWeight: 700, fontSize: ".7rem" }}>{k.tutar}.0</td>
                    <td style={{ color: "#54687a", fontWeight: 700, fontSize: ".7rem" }}>{k.limit} / {k.kullanilan}</td>
                    <td className="ic-date-cell">{k.baslama} - {k.bitis}</td>
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
