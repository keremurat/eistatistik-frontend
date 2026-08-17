"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { readServiceTypes, ServiceType } from "./serviceTypeData";

type IconName = "plus" | "search" | "edit";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function SiparisTurleriPage() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => setServiceTypes(readServiceTypes()), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return serviceTypes;
    return serviceTypes.filter((type) => `${type.code} ${type.title} ${type.description}`.toLocaleLowerCase("tr-TR").includes(normalized));
  }, [query, serviceTypes]);

  return (
    <AdminShell>
      <div className="st-page service-types-page">
        <header className="orders-hero">
          <div><h1>Sipariş Türleri</h1></div>
          <Link className="orders-create" href="/admin/siparis-turleri/ekle"><Icon name="plus" size={17} />Yeni sipariş türü</Link>
        </header>

        <section className="detail-panel st-list-panel">
          <div className="service-types-toolbar">
            <span>{serviceTypes.length} hizmet türü</span>
            <label className="service-types-search">
              <Icon name="search" size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kod, başlık veya açıklama ara" aria-label="Sipariş türlerinde ara" />
            </label>
          </div>
          <div className="ur-table-wrap">
            <table className="ur-table st-table service-types-table">
              <thead><tr><th>Sıra</th><th>Kod</th><th>Sipariş türü</th><th>Açıklama</th><th>Durum</th><th><span className="sr-only">İşlemler</span></th></tr></thead>
              <tbody>
                {filtered.map((type) => (
                  <tr key={type.id}>
                    <td><span className="service-type-order">{type.order}</span></td>
                    <td><span className="st-code service-type-code">{type.code}</span></td>
                    <td className="st-title-cell">{type.title}</td>
                    <td className="st-desc-cell">{type.description || "—"}</td>
                    <td><span className={`st-badge ${type.status}`}><i />{type.status === "aktif" ? "Aktif" : "Pasif"}</span></td>
                    <td><button className="service-type-edit" type="button" aria-label={`${type.title} hizmetini düzenle`}><Icon name="edit" size={15} /></button></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td className="ur-empty" colSpan={6}>Aramanızla eşleşen hizmet türü bulunamadı.</td></tr>}
              </tbody>
            </table>
          </div>
          <footer className="service-types-count">{filtered.length} kayıt gösteriliyor</footer>
        </section>
      </div>
    </AdminShell>
  );
}
