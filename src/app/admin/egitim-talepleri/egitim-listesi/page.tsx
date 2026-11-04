"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { Egitim, readEducations } from "./data";

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

function Book() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-8,160H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40H200Z" />
    </svg>
  );
}

export default function EgitimListesiPage() {
  return <AdminShell><EducationListContent /></AdminShell>;
}

export function EducationListContent({ basePath = "/admin/egitim-talepleri/egitim-listesi" }: { basePath?: string }) {
  const [items, setItems] = useState<Egitim[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [flexible, setFlexible] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItems(readEducations()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    const quotaNeedle = capacity.replace(/\s/g, "");
    return items.filter((item) => {
      if (needle && !`${item.adi} ${item.aciklama}`.toLocaleLowerCase("tr-TR").includes(needle)) return false;
      if (type && item.tur !== type) return false;
      if (quotaNeedle && !`${item.kota}/${item.katilan}`.includes(quotaNeedle)) return false;
      if (flexible && item.esnekKota !== flexible) return false;
      if (status && item.durum !== status) return false;
      return true;
    });
  }, [capacity, flexible, items, query, status, type]);

  return (
    <div className="fav-page">
      <header className="fav-head">
        <div>
          <h1>Eğitim Listesi <span>{items.length}</span></h1>
          <p>Eğitimler tür, kota ve durumla durur. Bir satıra girince ayrıntısı açılır.</p>
        </div>
        <Link className="orders-create" href={`${basePath}/ekle`}><PlusIcon />Yeni eğitim</Link>
      </header>

      <section className="fav-card" aria-label="Eğitim listesi">
        <label className="fav-search">
          <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Eğitim adı veya açıklama ara" aria-label="Eğitimlerde ara" />
        </label>
        <div className="elist-filters">
          <SystemDropdown ariaLabel="Eğitim türü filtresi" placeholder="Tüm türler" value={type} onChange={setType} options={[{ value: "", label: "Tüm türler" }, { value: "Online", label: "Online" }, { value: "Offline", label: "Offline" }]} />
          <label>
            <span>Kota / katılan</span>
            <input value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="30/2" aria-label="Kota ve katılan filtresi" />
          </label>
          <SystemDropdown ariaLabel="Esnek kota filtresi" placeholder="Tüm kota tipleri" value={flexible} onChange={setFlexible} options={[{ value: "", label: "Tüm kota tipleri" }, { value: "Esnek", label: "Esnek" }, { value: "Esnek Değil", label: "Esnek değil" }]} />
          <SystemDropdown ariaLabel="Durum filtresi" placeholder="Tüm durumlar" value={status} onChange={setStatus} options={[{ value: "", label: "Tüm durumlar" }, { value: "Aktif", label: "Aktif" }, { value: "Pasif", label: "Pasif" }]} />
        </div>

        {visible.length === 0 ? (
          <div className="fav-empty">
            <strong>{items.length === 0 ? "Henüz eğitim yok" : "Eşleşen eğitim yok"}</strong>
            <p>{items.length === 0 ? "İlk eğitimi oluşturun." : "Aramayı ya da filtreyi değiştirin."}</p>
          </div>
        ) : (
          <ul className="fav-list elist-rows">
            {visible.map((item) => (
              <li key={item.id}>
                <Link href={`${basePath}/${item.id}`}>
                  <span className="fav-mark"><Book /></span>
                  <span className="fav-copy">
                    <strong>{item.adi}</strong>
                    <small className="mtpl-snippet">{item.aciklama} · {item.tur} · {item.katilan}/{item.kota} · {item.baslama}</small>
                  </span>
                  <span className="fav-count">{item.ucret.toLocaleString("tr-TR")} TL</span>
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
