"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Hizmet, readHizmetler } from "./data";

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

export default function HizmetlerPage() {
  const [rows, setRows] = useState<Hizmet[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRows(readHizmetler()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return rows;
    return rows.filter((item) => `${item.baslik} ${item.slug} ${item.kartOzeti}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [rows, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Hizmetler <span>{rows.length}</span></h1>
            <p>Ana sayfada listelenen hizmetler ve SEO sayfaları. Satıra girince kayıt açılır.</p>
          </div>
          <Link className="orders-create" href="/admin/hizmetler/ekle"><PlusIcon />Yeni hizmet</Link>
        </header>

        <section className="fav-card" aria-label="Hizmet listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık, adres veya özette ara" aria-label="Hizmetlerde ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{rows.length === 0 ? "Hizmet bulunamadı." : "Eşleşen hizmet yok"}</strong>
              <p>{rows.length === 0 ? "Yeni bir hizmet oluşturarak başlayın." : "Aramayı değiştirin."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((item) => (
                <li key={item.id}>
                  <Link href={`/admin/hizmetler/${item.id}`}>
                    <span className="fav-mark">{item.sira}</span>
                    <span className="fav-copy">
                      <strong>{item.baslik}</strong>
                      <small className="mtpl-snippet">/hizmetler/{item.slug}{item.videoUrl ? " · Video" : ""}</small>
                    </span>
                    <span className={`stype-status ${item.aktif ? "aktif" : "pasif"}`}>{item.aktif ? "Aktif" : "Pasif"}</span>
                    <Caret />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
