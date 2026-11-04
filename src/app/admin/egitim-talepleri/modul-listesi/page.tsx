"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { Modul, readModules } from "./data";

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

function Stack() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64ZM32,192V104H224v88Z" />
    </svg>
  );
}

export default function ModulListesiPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/modul-listesi" : "/admin/egitim-talepleri/modul-listesi";
  const [items, setItems] = useState<Modul[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItems(readModules()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return items;
    return items.filter((item) => `${item.adi} ${item.url} ${item.aciklama}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [items, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Modül Listesi <span>{items.length}</span></h1>
            <p>Modüller başlık, adres ve açıklamayla durur. Bir satıra girince ayrıntısı açılır.</p>
          </div>
          <Link className="orders-create" href={`${basePath}/ekle`}><PlusIcon />Yeni modül</Link>
        </header>

        <section className="fav-card" aria-label="Modül listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Modül adı, adres veya açıklama ara" aria-label="Modüllerde ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{items.length === 0 ? "Henüz modül yok" : "Eşleşen modül yok"}</strong>
              <p>{items.length === 0 ? "İlk modülü oluşturun." : "Aramayı değiştirin ya da yeni bir modül ekleyin."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((item) => (
                <li key={item.id}>
                  <Link href={`${basePath}/${item.id}`}>
                    <span className="fav-mark"><Stack /></span>
                    <span className="fav-copy">
                      <strong>{item.adi}</strong>
                      <small className="mtpl-snippet">{item.aciklama || item.url || "Açıklama yok"}</small>
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
