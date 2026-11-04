"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { GuideStep, readGuideSteps } from "./guideData";

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

export default function GuideStepsPage() {
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSteps(readGuideSteps().sort((a, b) => a.position - b.position)));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return steps;
    return steps.filter((step) => `${step.title} ${step.serviceCodes} ${step.target} ${step.type === "tour" ? "tur adımı" : "modal"}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [steps, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Rehber Adımları <span>{steps.length}</span></h1>
            <p>Sipariş formundaki yönlendirme adımları. Satıra girince adım açılır.</p>
          </div>
          <Link className="orders-create" href="/admin/rehber-adimlari/ekle"><PlusIcon />Yeni adım</Link>
        </header>

        <section className="fav-card" aria-label="Rehber adımları listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık, iş türü veya hedef ara" aria-label="Rehber adımlarında ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{steps.length === 0 ? "Henüz rehber adımı eklenmedi" : "Eşleşen adım yok"}</strong>
              <p>{steps.length === 0 ? "Sipariş formundaki ilk yönlendirme adımını oluşturun." : "Aramayı değiştirin."}</p>
              {steps.length === 0 && <Link className="orders-create" href="/admin/rehber-adimlari/ekle">Yeni adım ekle</Link>}
            </div>
          ) : (
            <ul className="fav-list elist-rows">
              {visible.map((step) => (
                <li key={step.id}>
                  <Link href={`/admin/rehber-adimlari/${step.id}`}>
                    <span className="appt-day"><strong>{step.position}</strong></span>
                    <span className="fav-copy">
                      <strong>{step.title}</strong>
                      <small className="mtpl-snippet">{step.target || "Ekrana bağlı"} · {step.serviceCodes || "Tüm hizmetler"} · {step.imageNames.length} görsel</small>
                    </span>
                    <span className="fav-count">{step.type === "tour" ? "Tur adımı" : "Modal"}</span>
                    <span className={`stype-status ${step.active ? "aktif" : "pasif"}`}>{step.active ? "Aktif" : "Pasif"}</span>
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
