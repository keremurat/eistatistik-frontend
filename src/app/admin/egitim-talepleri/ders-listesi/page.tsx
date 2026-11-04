"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { Ders, readLessons } from "./data";

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

function Play() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm36.44-94.66-48-32A8,8,0,0,0,104,88v80a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32Z" />
    </svg>
  );
}

export default function DersListesiPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/ders-listesi" : "/admin/egitim-talepleri/ders-listesi";
  const [items, setItems] = useState<Ders[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItems(readLessons()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return items;
    return items.filter((item) => `${item.adi} ${item.aciklama} ${item.modul}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [items, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Ders Listesi <span>{items.length}</span></h1>
            <p>Dersler başlık, açıklama ve modülle durur. Bir satıra girince ayrıntısı açılır.</p>
          </div>
          <Link className="orders-create" href={`${basePath}/ekle`}><PlusIcon />Yeni ders</Link>
        </header>

        <section className="fav-card" aria-label="Ders listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ders adı, açıklama veya modül ara" aria-label="Derslerde ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{items.length === 0 ? "Henüz ders yok" : "Eşleşen ders yok"}</strong>
              <p>{items.length === 0 ? "İlk dersi oluşturun." : "Aramayı değiştirin ya da yeni bir ders ekleyin."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((item) => (
                <li key={item.id}>
                  <Link href={`${basePath}/${item.id}`}>
                    <span className="fav-mark"><Play /></span>
                    <span className="fav-copy">
                      <strong>{item.adi}</strong>
                      <small className="mtpl-snippet">{item.aciklama || item.modul || "Modül seçilmedi"}</small>
                    </span>
                    <span className="fav-count">#{item.id}</span>
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
