"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Bulten, readBultenler, readIcerikler } from "../bultenler/data";

function Caret() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

const MONTHS = ["", "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

export default function BultenOnizlemePage() {
  const [rows, setRows] = useState<Bulten[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const published = readBultenler().filter((item) => item.yayinda);
      const next: Record<string, number> = {};
      readIcerikler().forEach((item) => { next[item.bultenId] = (next[item.bultenId] ?? 0) + 1; });
      setRows(published);
      setCounts(next);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return rows;
    return rows.filter((item) => `${item.baslik} ${item.aciklama}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [rows, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Bülten önizleme <span>{rows.length}</span></h1>
            <p>Yalnızca yayındaki bültenler. Satıra girince abonenin göreceği sayfa açılır.</p>
          </div>
        </header>

        <section className="fav-card" aria-label="Yayınlanan bültenler">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık veya açıklamada ara" aria-label="Bülten önizlemede ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{rows.length === 0 ? "Yayınlanan bülten yok" : "Eşleşen bülten yok"}</strong>
              <p>{rows.length === 0 ? "Bir bülteni yayına aldığınızda burada önizlenir." : "Aramayı değiştirin."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((item) => {
                const [day, month] = item.yayinTarihi.split(".");
                return (
                  <li key={item.id}>
                    <Link href={`/admin/bulten-onizleme/${item.id}`}>
                      <span className="appt-day"><strong>{day}</strong><small>{MONTHS[Number(month)] ?? month}</small></span>
                      <span className="fav-copy">
                        <strong>{item.baslik}</strong>
                        <small className="mtpl-snippet">{item.yayinTarihi.split(" ")[0]} · {counts[item.id] ?? 0} içerik</small>
                      </span>
                      <span className="stype-status aktif">Yayında</span>
                      <Caret />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
