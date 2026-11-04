"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Icerik, readBultenler, readIcerikler } from "../bultenler/data";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

function Caret() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

const MONTHS = ["", "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const KIND: Record<Icerik["tur"], string> = { video: "Video", dosya: "Dosya", metin: "Metin" };

export default function OzelIceriklerPage() {
  const [rows, setRows] = useState<Icerik[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setRows(readIcerikler());
      setNames(Object.fromEntries(readBultenler().map((item) => [item.id, item.baslik])));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return rows;
    return rows.filter((item) => `${item.baslik} ${item.aciklama} ${KIND[item.tur]} ${names[item.bultenId] ?? ""}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [rows, names, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>İçerikler <span>{rows.length}</span></h1>
            <p>Tür, bülten ve yayın tarihi aynı satırda. Satıra girince içerik açılır.</p>
          </div>
          <Link className="orders-create" href="/admin/icerikler/ekle"><PlusIcon />Yeni içerik</Link>
        </header>

        <section className="fav-card" aria-label="İçerik listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık, tür veya bültende ara" aria-label="İçeriklerde ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{rows.length === 0 ? "Henüz içerik yok" : "Eşleşen içerik yok"}</strong>
              <p>{rows.length === 0 ? "Yeni bir içerik oluşturarak başlayın." : "Aramayı değiştirin."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((item) => {
                const [day, month] = item.yayinTarihi.split(".");
                return (
                  <li key={item.id}>
                    <Link href={`/admin/icerikler/${item.id}`}>
                      <span className="appt-day"><strong>{day}</strong><small>{MONTHS[Number(month)] ?? month}</small></span>
                      <span className="fav-copy">
                        <strong>{item.baslik}</strong>
                        <small className="mtpl-snippet">{KIND[item.tur]} · {names[item.bultenId] || "Bülten seçilmedi"}</small>
                      </span>
                      <span className={`stype-status ${item.yayinda ? "aktif" : "pasif"}`}>{item.yayinda ? "Yayında" : "Taslak"}</span>
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
