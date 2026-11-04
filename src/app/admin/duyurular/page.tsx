"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Duyuru, readAnnouncements } from "./data";

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

function plainPreview(icerik: string) {
  return icerik.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/\s+/g, " ").trim();
}

export default function DuyurularPage() {
  return <AdminShell><AnnouncementsContent /></AdminShell>;
}

export function AnnouncementsContent({ basePath = "/admin/duyurular" }: { basePath?: string }) {
  const [rows, setRows] = useState<Duyuru[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRows(readAnnouncements().sort((a, b) => b.id - a.id)));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return rows;
    return rows.filter((item) => `${item.baslik} ${plainPreview(item.icerik)}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [rows, query]);

  return (
    <div className="fav-page">
      <header className="fav-head">
        <div>
          <h1>Duyurular <span>{rows.length}</span></h1>
          <p>Başlık, yayın tarihi ve durum aynı satırda. Satıra girince duyuru açılır.</p>
        </div>
        <Link className="orders-create" href={`${basePath}/ekle`}><PlusIcon />Duyuru ekle</Link>
      </header>

      <section className="fav-card" aria-label="Duyuru listesi">
        <label className="fav-search">
          <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık veya açıklamada ara" aria-label="Duyurularda ara" />
        </label>

        {visible.length === 0 ? (
          <div className="fav-empty">
            <strong>{rows.length === 0 ? "Henüz duyuru yok" : "Duyuru bulunamadı."}</strong>
            <p>{rows.length === 0 ? "İlk duyuruyu oluşturun." : "Aramayı değiştirin."}</p>
          </div>
        ) : (
          <ul className="fav-list elist-rows">
            {visible.map((item) => (
              <li key={item.id}>
                <Link href={`${basePath}/${item.id}`}>
                  <span className="appt-day"><strong>{item.id}</strong></span>
                  <span className="fav-copy">
                    <strong>{item.baslik}</strong>
                    <small className="mtpl-snippet">{plainPreview(item.icerik)}</small>
                  </span>
                  <span className="fav-count">{item.yayinTarihi}</span>
                  <span className={`stype-status ${item.durum === "Aktif" ? "aktif" : "pasif"}`}>{item.durum}</span>
                  <Caret />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
