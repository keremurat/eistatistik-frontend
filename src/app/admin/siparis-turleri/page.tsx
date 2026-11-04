"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { readServiceTypes, ServiceType } from "./serviceTypeData";

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

export default function SiparisTurleriPage() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setServiceTypes(readServiceTypes()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return serviceTypes;
    return serviceTypes.filter((type) => `${type.code} ${type.title} ${type.description}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [query, serviceTypes]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Sipariş Türleri <span>{serviceTypes.length}</span></h1>
            <p>Hizmet kodu, açıklama ve durumu bu listede. Bir satıra girince türün ayrıntısı açılır.</p>
          </div>
          <Link className="orders-create" href="/admin/siparis-turleri/ekle"><PlusIcon />Yeni sipariş türü</Link>
        </header>

        <section className="fav-card" aria-label="Sipariş türleri listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kod, başlık veya açıklama ara" aria-label="Sipariş türlerinde ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{serviceTypes.length === 0 ? "Henüz sipariş türü yok" : "Eşleşen tür yok"}</strong>
              <p>{serviceTypes.length === 0 ? "İlk sipariş türünü oluşturun." : "Aramayı değiştirin ya da yeni bir tür ekleyin."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((type) => (
                <li key={type.id}>
                  <Link href={`/admin/siparis-turleri/${type.id}`}>
                    <span className={`stype-code${type.status === "pasif" ? " quiet" : ""}`}>{type.code}</span>
                    <span className="fav-copy">
                      <strong>{type.title}</strong>
                      <small>{type.description || `Sıra ${type.order}`}</small>
                    </span>
                    <span className={`stype-status ${type.status}`}>{type.status === "aktif" ? "Aktif" : "Pasif"}</span>
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
