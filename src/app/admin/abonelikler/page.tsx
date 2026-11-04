"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { ABONELIKLER, Abonelik, formatUcret } from "./data";

function Caret() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
}

function statusClass(status: Abonelik["durum"]) {
  if (status === "İptal") return "user-chip iptal";
  return `stype-status ${status === "Aktif" ? "aktif" : "pasif"}`;
}

export default function AboneliklerPage() {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return ABONELIKLER;
    return ABONELIKLER.filter((item) => `${item.musteri} ${item.durum} ${item.odeme}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Abonelikler <span>{ABONELIKLER.length}</span></h1>
            <p>Müşteri, süre, ücret ve ödeme aynı satırda. Satıra girince abonelik açılır.</p>
          </div>
        </header>

        <section className="fav-card" aria-label="Abonelik listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Müşteri, durum veya ödemede ara" aria-label="Aboneliklerde ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>Abonelik bulunamadı.</strong>
              <p>Aramayı değiştirin.</p>
            </div>
          ) : (
            <ul className="fav-list elist-rows user-rows">
              {visible.map((item) => (
                <li key={item.id}>
                  <Link href={`/admin/abonelikler/${item.id}`}>
                    <span className="fav-mark user-initials">{initials(item.musteri)}</span>
                    <span className="fav-copy">
                      <strong>{item.musteri}</strong>
                      <small className="mtpl-snippet">{item.baslangic} – {item.bitis} · {item.odeme}</small>
                    </span>
                    <span className="fav-count">{formatUcret(item.ucret)}</span>
                    <span className={statusClass(item.durum)}>{item.durum}</span>
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
