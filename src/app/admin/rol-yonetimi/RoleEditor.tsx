"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { PermissionRecord, RoleInput, RoleRecord } from "@/lib/api/roles";
import { CATEGORIES } from "./data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  shield: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.38,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.3-13.66,67.32-40.34,89.06A128.4,128.4,0,0,1,128,223.62a128.27,128.27,0,0,1-39.67-22.56C61.65,179.32,48,149.3,48,112V56H208Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Switch({ checked, disabled, label, onChange }: { checked: boolean; disabled?: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} className={`role-switch${checked ? " on" : ""}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

export function RoleEditor({
  initial,
  catalog,
  basePath,
  submitLabel,
  saving,
  error,
  onSubmit,
}: {
  initial?: RoleRecord;
  catalog: PermissionRecord[];
  basePath: string;
  submitLabel: string;
  saving: boolean;
  error: string;
  onSubmit: (value: RoleInput) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [assignable, setAssignable] = useState(initial?.assignable ?? false);
  const [perms, setPerms] = useState<Set<string>>(() => new Set(initial?.permissions ?? []));
  const [active, setActive] = useState("menu");
  const [search, setSearch] = useState("");
  const [localError, setLocalError] = useState("");
  const adminLocked = initial?.key === "admin";

  function locked(key: string) {
    return adminLocked && key === "diger.rol";
  }

  function toggle(key: string, on?: boolean) {
    if (locked(key)) return;
    setPerms((current) => {
      const next = new Set(current);
      const enabled = on ?? !next.has(key);
      if (enabled) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  function toggleGroup(keys: string[]) {
    const editable = keys.filter((key) => !locked(key));
    const allOn = editable.every((key) => perms.has(key));
    setPerms((current) => {
      const next = new Set(current);
      editable.forEach((key) => allOn ? next.delete(key) : next.add(key));
      return next;
    });
  }

  const groups = useMemo(() => {
    const known = new Set(CATEGORIES.map((item) => item.key));
    const extra = [...new Set(catalog.map((item) => item.category))]
      .filter((key) => !known.has(key as (typeof CATEGORIES)[number]["key"]))
      .map((key) => ({ key, label: key }));
    return [...CATEGORIES, ...extra].map((category) => ({
      ...category,
      items: catalog.filter((item) => item.category === category.key),
    })).filter((group) => group.items.length > 0);
  }, [catalog]);
  const current = groups.find((group) => group.key === active) ?? groups[0];
  const needle = search.trim().toLocaleLowerCase("tr-TR");
  const visibleItems = current?.items.filter((item) => !needle || `${item.label} ${item.key}`.toLocaleLowerCase("tr-TR").includes(needle)) ?? [];

  const menuItems = catalog.filter((item) => item.category === "menu" && perms.has(item.key));
  const enabledTotal = catalog.filter((item) => perms.has(item.key)).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setLocalError("Rol adı zorunludur.");
      return;
    }
    const permissions = catalog.map((item) => item.key).filter((key) => perms.has(key) || locked(key));
    onSubmit({ name: name.trim(), description: description.trim(), assignable, permissions });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Rol listesine dön</Link>
      <form className="stype-layout" onSubmit={handleSubmit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="shield" size={18} /></span><h2>Rol</h2></header>
            <label className="stype-field">
              <span>Rol adı</span>
              <input value={name} onChange={(event) => { setName(event.target.value); setLocalError(""); }} placeholder="Rol adı" autoFocus />
            </label>
            <label className="stype-field">
              <span>Açıklama</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Bu rolün görev tanımı" />
            </label>
            <div className="role-option">
              <span><strong>Görev ataması</strong><small>{assignable ? "Bu role görev atanabilir." : "Bu role görev atanmaz."}</small></span>
              <Switch checked={assignable} onChange={setAssignable} label="Görev ataması" />
            </div>
          </section>

          <section className="fav-card stype-section">
            <header>
              <span className="fav-mark"><Icon name="shield" size={18} /></span>
              <h2>Yetkiler</h2>
              <div className="role-group-tools"><span className="fav-count">{enabledTotal}/{catalog.length}</span></div>
            </header>
            <div className="role-heads" role="tablist" aria-label="Yetki başlıkları">
              {groups.map((group) => {
                const enabled = group.items.filter((item) => perms.has(item.key)).length;
                return (
                  <button key={group.key} type="button" role="tab" aria-selected={current?.key === group.key} className={current?.key === group.key ? "on" : ""} onClick={() => setActive(group.key)}>
                    {group.label}
                    <span>{enabled}/{group.items.length}</span>
                  </button>
                );
              })}
            </div>
            {current && (
              <div className="role-toolbar">
                <label className="role-find">
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`${current.label} içinde ara`} aria-label="Yetki ara" />
                </label>
                <button type="button" onClick={() => toggleGroup(current.items.map((item) => item.key))}>
                  {current.items.every((item) => perms.has(item.key) || locked(item.key)) ? "Tümünü kapat" : "Tümünü aç"}
                </button>
              </div>
            )}
            {current?.key === "menu" && <p className="llist-empty">Açık menüler bu rolde görünür. Kapalı menü sayfada da açılmaz.</p>}
            {visibleItems.length === 0 ? <p className="llist-empty">Bu başlıkta eşleşen yetki yok.</p> : visibleItems.map((item) => {
              const on = perms.has(item.key) || locked(item.key);
              return (
                <div className="role-option" key={item.key}>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{locked(item.key) ? "Admin rolünden alınamaz." : item.key}</small>
                  </span>
                  <Switch checked={on} disabled={locked(item.key)} onChange={(value) => toggle(item.key, value)} label={`${item.label} ${on ? "kapat" : "aç"}`} />
                </div>
              );
            })}
          </section>

          <div className="fav-actions">
            {(localError || error) && <p role="alert">{localError || error}</p>}
            <button className="fav-save" type="submit" disabled={saving}>{saving ? "Kaydediliyor…" : submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card acct-summary" aria-label="Rol önizlemesi">
          <header><span className="fav-mark"><Icon name="shield" size={18} /></span><h2>Açık menüler</h2></header>
          <p className="acct-figure">{menuItems.length}</p>
          <span className={`acct-badge${assignable ? " gelen" : ""}`}>{assignable ? "Görev atanabilir" : "Görev atanamaz"}</span>
          {menuItems.length === 0 ? <p className="llist-empty">Bu rolde açık menü yok.</p> : (
            <div className="role-pills">
              {menuItems.map((item) => <span key={item.key}>{item.label.replace(/ Menüsü$/, "")}</span>)}
            </div>
          )}
          <dl className="acct-rows">
            <div><dt>Yetki</dt><dd>{enabledTotal} / {catalog.length}</dd></div>
            {initial && <div><dt>Anahtar</dt><dd>{initial.key}</dd></div>}
          </dl>
        </aside>
      </form>
    </div>
  );
}
