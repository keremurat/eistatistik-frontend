"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { ROLLER, CATEGORIES, ALL_PERMS, RolKey, PermCategory } from "../data";

type IconName = "back" | "check" | "shield" | "search" | "x";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:   <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check:  <path d="m5 12 4 4L19 6" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>,
    x:      <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── Toggle switch ──────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        display: "inline-flex",
        width: "2.5rem",
        height: "1.4rem",
        alignItems: "center",
        background: checked ? "var(--navy)" : "#cbd5e1",
        borderRadius: 99,
        border: 0,
        cursor: "pointer",
        flexShrink: 0,
        transition: "background .18s ease",
        outline: "none",
      }}
      onFocus={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px var(--blue-soft)"; }}
      onBlur={(e) =>  { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
      <span style={{
        position: "absolute",
        left: checked ? "calc(100% - 1.1rem - .15rem)" : ".15rem",
        width: "1.1rem",
        height: "1.1rem",
        background: "#fff",
        borderRadius: "50%",
        boxShadow: "0 1px 3px rgba(0,0,0,.18)",
        transition: "left .18s cubic-bezier(.4,0,.2,1)",
      }} />
    </button>
  );
}

// ── Ana form ──────────────────────────────────────────────────────────────────
function EditForm() {
  const params  = useSearchParams();
  const rolKey  = (params.get("rol") ?? "admin") as RolKey;
  const base    = ROLLER.find((r) => r.key === rolKey) ?? ROLLER[0];

  const [adi,          setAdi]          = useState(base.adi);
  const [aciklama,     setAciklama]     = useState(base.aciklama);
  const [gorevAtamasi, setGorevAtamasi] = useState(base.gorevAtamasi);
  const [perms,        setPerms]        = useState<Set<string>>(new Set(base.perms));
  const [activeTab,    setActiveTab]    = useState<PermCategory>("menu");
  const [search,       setSearch]       = useState("");
  const [saved,        setSaved]        = useState(false);

  function togglePerm(key: string) {
    setPerms((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const tabPerms = ALL_PERMS.filter((p) => {
    const inTab = p.category === activeTab;
    const q     = search.trim().toLowerCase();
    return inTab && (!q || p.label.toLowerCase().includes(q) || p.key.includes(q));
  });

  const enabledInTab  = tabPerms.filter((p) => perms.has(p.key)).length;
  const enabledTotal  = ALL_PERMS.filter((p) => perms.has(p.key)).length;

  function toggleAll() {
    const allKeys = tabPerms.map((p) => p.key);
    const allOn   = allKeys.every((k) => perms.has(k));
    setPerms((prev) => {
      const next = new Set(prev);
      allKeys.forEach((k) => allOn ? next.delete(k) : next.add(k));
      return next;
    });
  }

  return (
    <div className="st-page">
      <header className="orders-hero" style={{ marginBottom: "1rem" }}>
        <div>
          <p className="eyebrow">YÖNETİM · ROL YÖNETİMİ</p>
          <h1 style={{ fontSize: "1.2rem" }}>Rol Düzenle</h1>
        </div>
        <Link className="back-link" href="/admin/rol-yonetimi">
          <Icon name="back" size={15} />Listeye dön
        </Link>
      </header>

      {/* ── Temel bilgiler ── */}
      <section className="detail-panel" style={{ marginBottom: "1rem" }}>
        <div className="detail-panel-heading">
          <p className="eyebrow">TEMEL BİLGİLER</p>
          <h2>Rol Bilgileri</h2>
        </div>
        <div className="settings-panel-body">
          <div className="edu-row-2">
            <div className="form-field">
              <label htmlFor="rol-adi">Rol Adı</label>
              <input id="rol-adi" value={adi} onChange={(e) => setAdi(e.target.value)} />
            </div>
            <div className="form-field" style={{ justifyContent: "flex-start" }}>
              <label>Görev Ataması</label>
              <div style={{ display: "flex", alignItems: "center", gap: ".65rem", marginTop: ".25rem" }}>
                <Toggle
                  checked={gorevAtamasi}
                  onChange={setGorevAtamasi}
                  label="Görev ataması aktif/pasif"
                />
                <span style={{ fontSize: ".72rem", fontWeight: 700, color: gorevAtamasi ? "#287a55" : "#758695" }}>
                  {gorevAtamasi ? "Aktif" : "Pasif"}
                </span>
              </div>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="rol-aciklama">Açıklama</label>
            <textarea id="rol-aciklama" value={aciklama} rows={2}
              onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} />
          </div>
        </div>
      </section>

      {/* ── Yetki matrisi ── */}
      <section className="detail-panel" style={{ flex: 1 }}>
        <div className="detail-panel-heading" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".5rem" }}>
          <div>
            <p className="eyebrow">YETKİ YÖNETİMİ</p>
            <h2 style={{ marginBottom: 0 }}>Özellik Bayrakları</h2>
          </div>
          <span style={{
            padding: ".3rem .75rem", borderRadius: 99,
            background: "#edf4f8", color: "#3f556a",
            fontSize: ".65rem", fontWeight: 800,
          }}>
            {enabledTotal} / {ALL_PERMS.length} yetki etkin
          </span>
        </div>

        {/* Kategori sekmeleri */}
        <div style={{
          display: "flex", gap: ".25rem", padding: ".75rem 1.1rem .5rem",
          borderBottom: "1px solid var(--line)", overflowX: "auto",
        }}>
          {CATEGORIES.map((cat) => {
            const catPerms   = ALL_PERMS.filter((p) => p.category === cat.key);
            const catEnabled = catPerms.filter((p) => perms.has(p.key)).length;
            const isActive   = activeTab === cat.key;
            return (
              <button key={cat.key} type="button"
                onClick={() => { setActiveTab(cat.key); setSearch(""); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: ".4rem",
                  padding: ".35rem .7rem", border: 0, borderRadius: 7, whiteSpace: "nowrap",
                  background: isActive ? "var(--navy)" : "#f0f4f7",
                  color: isActive ? "#fff" : "#526a7d",
                  fontSize: ".68rem", fontWeight: 800,
                  cursor: "pointer", transition: ".15s",
                }}>
                {cat.label}
                <span style={{
                  minWidth: "1.4rem", height: "1.4rem", padding: "0 .2rem",
                  display: "grid", placeItems: "center",
                  background: isActive ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.06)",
                  borderRadius: 5, fontSize: ".6rem", fontVariantNumeric: "tabular-nums",
                }}>
                  {catEnabled}/{catPerms.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Arama + tümünü toggle */}
        <div style={{
          display: "flex", alignItems: "center", gap: ".6rem",
          padding: ".6rem 1.1rem", borderBottom: "1px solid var(--line)",
        }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: ".5rem",
            padding: ".35rem .7rem", border: "1px solid var(--line)",
            borderRadius: 8, background: "#f8fafb",
          }}>
            <span style={{ color: "#94aab7", display: "flex" }}><Icon name="search" size={14} /></span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Yetki ara…"
              style={{
                flex: 1, border: 0, background: "transparent", outline: "none",
                fontSize: ".7rem", color: "var(--ink)", fontFamily: "inherit",
              }}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}
                style={{ border: 0, background: "transparent", color: "#94aab7", cursor: "pointer", display: "flex", padding: 0 }}>
                <Icon name="x" size={13} />
              </button>
            )}
          </div>
          <button type="button" onClick={toggleAll}
            style={{
              padding: ".35rem .75rem", border: "1px solid var(--line)", borderRadius: 8,
              background: "#fff", color: "#526a7d",
              fontSize: ".67rem", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap",
            }}>
            {enabledInTab === tabPerms.length && tabPerms.length > 0 ? "Tümünü kapat" : "Tümünü aç"}
          </button>
        </div>

        {/* Yetki satırları */}
        <div style={{ overflowY: "auto" }}>
          {tabPerms.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: "10rem", gap: ".4rem", color: "#94aab7",
            }}>
              <Icon name="search" size={28} />
              <span style={{ fontSize: ".75rem" }}>Sonuç bulunamadı</span>
            </div>
          ) : (
            tabPerms.map((perm) => {
              const on = perms.has(perm.key);
              return (
                <div key={perm.key}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr auto",
                    alignItems: "center", gap: "1rem",
                    padding: ".75rem 1.1rem",
                    borderBottom: "1px solid #f0f3f5",
                    background: on ? "transparent" : "transparent",
                    transition: "background .1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <div>
                    <p style={{ margin: 0, fontSize: ".76rem", fontWeight: 700, color: on ? "var(--ink)" : "#8493a0" }}>
                      {perm.label}
                    </p>
                    <code style={{ fontSize: ".62rem", color: "#b0bfc9", fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace" }}>
                      {perm.key}
                    </code>
                  </div>
                  <Toggle
                    checked={on}
                    onChange={() => togglePerm(perm.key)}
                    label={`${perm.label} ${on ? "kapat" : "aç"}`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Kaydet */}
        <div style={{
          padding: ".85rem 1.1rem",
          borderTop: "1px solid var(--line)",
          display: "flex", justifyContent: "flex-end",
        }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              minHeight: 40, padding: "0 1.5rem", border: 0, borderRadius: 8,
              background: saved ? "#287a55" : "var(--navy)",
              color: "#fff", font: "inherit", fontSize: ".72rem", fontWeight: 800,
              cursor: "pointer", transition: ".15s",
            }}>
            {saved ? <><Icon name="check" size={15} />Kaydedildi</> : <><Icon name="shield" size={15} />Kaydet</>}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function RolDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditForm />
      </Suspense>
    </AdminShell>
  );
}
