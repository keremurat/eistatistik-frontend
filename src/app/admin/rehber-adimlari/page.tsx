"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "../AdminShell";
import { GuideStep, readGuideSteps } from "./guideData";

function GuideIcon({ name, size = 18 }: { name: "plus" | "map" | "image"; size?: number }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3V6Z"/><path d="M8 3v15M16 6v15"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function GuideStepsPage() {
  const [steps, setSteps] = useState<GuideStep[]>([]);
  useEffect(() => setSteps(readGuideSteps().sort((a, b) => a.position - b.position)), []);

  return <AdminShell><div className="st-page guide-steps-page">
    <header className="orders-hero">
      <div><h1>Rehber Adımları</h1></div>
      <Link className="orders-create" href="/admin/rehber-adimlari/ekle"><GuideIcon name="plus" size={17}/>Yeni adım</Link>
    </header>

    <section className="detail-panel guide-list-panel" aria-label="Rehber adımları listesi">
      <div className="ur-table-wrap">
        <table className="ur-table guide-table">
          <thead><tr><th>Sıra</th><th>Başlık</th><th>İş türü kodu</th><th>Hedef</th><th>Tür</th><th>Görseller</th><th>Durum</th></tr></thead>
          <tbody>{steps.length === 0 ? <tr><td colSpan={7} className="guide-empty-cell"><div className="guide-empty"><span><GuideIcon name="map" size={23}/></span><strong>Henüz rehber adımı eklenmedi</strong><p>Sipariş formundaki ilk yönlendirme adımını oluşturun.</p><Link href="/admin/rehber-adimlari/ekle">Yeni adım ekle</Link></div></td></tr> : steps.map(step => <tr key={step.id}>
            <td><span className="guide-order">{step.position}</span></td>
            <td><strong>{step.title}</strong></td>
            <td>{step.serviceCodes || <span className="guide-all-services">Tüm hizmetler</span>}</td>
            <td><code>{step.target || "Ekrana bağlı"}</code></td>
            <td>{step.type === "tour" ? "Tur adımı" : "Modal"}</td>
            <td><span className="guide-image-count"><GuideIcon name="image" size={15}/>{step.imageNames.length}</span></td>
            <td><span className={`status-badge ${step.active ? "success" : "neutral"}`}>{step.active ? "Aktif" : "Pasif"}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
      <footer className="guide-list-footer">{steps.length} adım</footer>
    </section>
  </div></AdminShell>;
}
