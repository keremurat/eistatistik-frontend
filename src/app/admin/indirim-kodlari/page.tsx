"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { formatTutar, IndirimKodu, readVisibleDiscounts } from "./data";

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

function Tag() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96.62,96L48,132.69V48h84.69L240,155.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" />
    </svg>
  );
}

export default function IndirimKoduListesiPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/editor") ? "/editor/indirim-kodlari" : "/admin/indirim-kodlari";
  const [items, setItems] = useState<IndirimKodu[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItems(readVisibleDiscounts()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return items;
    return items.filter((item) => `${item.kod} ${item.aciklama}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [items, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>İndirim Kodları <span>{items.length}</span></h1>
            <p>Kod, tutar, limit ve geçerlilik aynı satırda. Satıra girince ayrıntısı açılır.</p>
          </div>
          <Link className="orders-create" href={`${basePath}/ekle`}><PlusIcon />Yeni kod</Link>
        </header>

        <section className="fav-card" aria-label="İndirim kodu listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kod veya açıklamada ara" aria-label="İndirim kodlarında ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{items.length === 0 ? "Henüz indirim kodu yok" : "Eşleşen kod yok"}</strong>
              <p>{items.length === 0 ? "İlk kodu oluşturun." : "Aramayı değiştirin ya da yeni bir kod ekleyin."}</p>
            </div>
          ) : (
            <ul className="fav-list elist-rows">
              {visible.map((item) => {
                const amount = formatTutar(item.tip, item.tutar);
                return (
                  <li key={item.id}>
                    <Link href={`${basePath}/${item.id}`}>
                      <span className="fav-mark"><Tag /></span>
                      <span className="fav-copy">
                        <strong>{item.kod}</strong>
                        <small className="mtpl-snippet">{item.aciklama || "Açıklama yok"} · {item.baslama} – {item.bitis}</small>
                      </span>
                      <span className="fav-count" title={amount}>{amount}</span>
                      <span className={`stype-status ${item.kullanilan >= item.limit ? "pasif" : "aktif"}`}>{item.limit} / {item.kullanilan}</span>
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
