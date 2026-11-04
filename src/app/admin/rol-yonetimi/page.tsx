"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { listRoles, type RoleRecord } from "@/lib/api/roles";

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

function Shield() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.38,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.3-13.66,67.32-40.34,89.06A128.4,128.4,0,0,1,128,223.62a128.27,128.27,0,0,1-39.67-22.56C61.65,179.32,48,149.3,48,112V56H208Z" />
    </svg>
  );
}

export default function RolYonetimiPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/editor") ? "/editor/rol-yonetimi" : "/admin/rol-yonetimi";
  const [roles, setRoles] = useState<RoleRecord[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    listRoles().then(setRoles).catch(() => setError("Roller yüklenemedi."));
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!roles || !needle) return roles ?? [];
    return roles.filter((role) => `${role.name} ${role.description} ${role.key}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [roles, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Rol Yönetimi <span>{roles?.length ?? 0}</span></h1>
            <p>Her rolün menüsü ve yetkisi ayrı açılır. Satıra girince anahtarlar görünür.</p>
          </div>
          <Link className="orders-create" href={`${basePath}/ekle`}><PlusIcon />Yeni rol</Link>
        </header>

        <section className="fav-card" aria-label="Rol listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rol adı veya açıklama ara" aria-label="Rollerde ara" />
          </label>

          {error ? (
            <div className="fav-empty"><strong>Roller yüklenemedi</strong><p>{error}</p></div>
          ) : roles === null ? (
            <div className="fav-empty"><strong>Roller yükleniyor</strong><p>Liste hazırlanıyor.</p></div>
          ) : visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{roles.length === 0 ? "Henüz rol yok" : "Eşleşen rol yok"}</strong>
              <p>{roles.length === 0 ? "İlk rolü oluşturun." : "Aramayı değiştirin ya da yeni bir rol ekleyin."}</p>
            </div>
          ) : (
            <ul className="fav-list elist-rows">
              {visible.map((role) => (
                <li key={role.key}>
                  <Link href={`${basePath}/${role.key}`}>
                    <span className="fav-mark"><Shield /></span>
                    <span className="fav-copy">
                      <strong>{role.name}</strong>
                      <small className="mtpl-snippet">{role.description || "Açıklama yok"}</small>
                    </span>
                    <span className="fav-count">{role.permissions.length} yetki</span>
                    <span className={`stype-status ${role.assignable ? "aktif" : "pasif"}`}>{role.assignable ? "Atanır" : "Atanmaz"}</span>
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
