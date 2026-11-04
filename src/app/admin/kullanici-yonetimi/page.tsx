"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Kullanici, readUsers } from "./data";

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

export default function KullaniciListesiPage() {
  return <AdminShell><UserListContent /></AdminShell>;
}

export function UserListContent({ basePath = "/admin/kullanici-yonetimi" }: { basePath?: string }) {
  const [items, setItems] = useState<Kullanici[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItems(readUsers()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return items;
    return items.filter((user) => `${user.adSoyad} ${user.eposta} ${user.gsm} ${user.id} ${user.rol}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [items, query]);

  return (
    <div className="fav-page">
      <header className="fav-head">
        <div>
          <h1>Kullanıcılar <span>{items.length}</span></h1>
          <p>Ad, e-posta, telefon ve rol aynı satırda. Satıra girince hesap açılır.</p>
        </div>
      </header>

      <section className="fav-card" aria-label="Kullanıcı listesi">
        <label className="fav-search">
          <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ad, e-posta, GSM veya ID ara" aria-label="Kullanıcılarda ara" />
        </label>

        {visible.length === 0 ? (
          <div className="fav-empty">
            <strong>{items.length === 0 ? "Henüz kullanıcı yok" : "Eşleşen kullanıcı yok"}</strong>
            <p>{items.length === 0 ? "Liste boş." : "Aramayı değiştirin."}</p>
          </div>
        ) : (
          <ul className="fav-list elist-rows user-rows">
            {visible.map((user) => (
              <li key={user.id}>
                <Link href={`${basePath}/${user.id}`}>
                  <span className="fav-mark user-initials">{initials(user.adSoyad)}</span>
                  <span className="fav-copy">
                    <strong>{user.adSoyad}</strong>
                    <small className="mtpl-snippet">#{user.id} · {user.eposta} · {user.gsm}</small>
                  </span>
                  <span className="fav-count">{user.rol}</span>
                  <span className={`stype-status ${user.durum === "Aktif" ? "aktif" : "pasif"}`}>{user.durum}</span>
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
