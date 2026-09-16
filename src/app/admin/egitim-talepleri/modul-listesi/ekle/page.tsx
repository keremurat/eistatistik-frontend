"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { AdminShell } from "../../../AdminShell";
import { lessons } from "../../ders-listesi/data";
import { useToast } from "../../../../components/ToastProvider";

type IconName = "back" | "check";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:  <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function AddForm() {
  const [adi,      setAdi]      = useState("");
  const [url,      setUrl]      = useState("");
  const [aciklama, setAciklama] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [dersler,  setDersler]  = useState<string[]>([]);
  const [dersInput, setDersInput] = useState("");
  const toast = useToast();

  const dersInputRef = useRef<HTMLInputElement>(null);

  const allLessonNames = lessons.map((l) => l.adi);
  const suggested = dersInput
    ? allLessonNames.filter((n) => !dersler.includes(n) && n.toLowerCase().includes(dersInput.toLowerCase()))
    : [];

  function removeDers(d: string) { setDersler((prev) => prev.filter((x) => x !== d)); }
  function addDers(d: string) {
    if (!dersler.includes(d)) setDersler((prev) => [...prev, d]);
    setDersInput("");
    dersInputRef.current?.focus();
  }
  function onDersKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = dersInput.trim();
    if (val && !dersler.includes(val)) setDersler((prev) => [...prev, val]);
    setDersInput("");
  }

  function handleSave() {
    toast.success("Modül kaydedildi.");
  }

  return (
    <div className="st-page create-onepage-page">
      <header className="favorite-category-create-header">
        <Link className="back-link" href="/admin/egitim-talepleri/modul-listesi">
          <Icon name="back" size={16} />Listeye dön
        </Link>
        <h1>Modül Ekle</h1>
      </header>

      <section className="detail-panel create-onepage-form">
        <div className="detail-panel-heading">
          <p className="eyebrow">MODÜL BİLGİLERİ</p>
          <h2>Yeni Modül</h2>
        </div>
        <div className="settings-panel-body">

          <div className="edu-row-2">
            <div className="form-field">
              <label htmlFor="mf-adi">Kurs Başlığı</label>
              <input id="mf-adi" value={adi} onChange={(e) => setAdi(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="mf-url">eistatistik URL</label>
              <input id="mf-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://eistatistik.com/…" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="mf-aciklama">Kurs Açıklaması</label>
            <textarea id="mf-aciklama" value={aciklama} rows={4} onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} />
          </div>

          <div className="form-field">
            <label htmlFor="mf-drive">Modül Dökümanları (Drive)</label>
            <input id="mf-drive" value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} placeholder="https://drive.google.com/drive/folders/…" />
          </div>

          <div className="form-field">
            <label>Dersler <span style={{ fontWeight: 600, color: "#9baab6", fontSize: ".82em" }}>(Enter ile ekle, × ile kaldır)</span></label>
            <div className="edu-modules-wrap" onClick={() => dersInputRef.current?.focus()}>
              {dersler.map((d) => (
                <span key={d} className="edu-module-chip">
                  {d}
                  <button type="button" aria-label={`${d} kaldır`}
                    onClick={(e) => { e.stopPropagation(); removeDers(d); }}>×</button>
                </span>
              ))}
              <input ref={dersInputRef} className="edu-modules-input"
                value={dersInput}
                onChange={(e) => setDersInput(e.target.value)}
                onKeyDown={onDersKey}
                placeholder={dersler.length === 0 ? "Ders adı veya kodu girin…" : ""}
              />
            </div>
            {suggested.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginTop: ".4rem", maxHeight: 120, overflowY: "auto" }}>
                {suggested.slice(0, 12).map((d) => (
                  <button key={d} type="button"
                    style={{ padding: ".15rem .5rem", border: "1px solid var(--line)", borderRadius: 5, background: "#f5f8f9", color: "#3f556a", font: "inherit", fontSize: ".6rem", fontWeight: 800, cursor: "pointer" }}
                    onClick={() => addDers(d)}>
                    + {d}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="create-onepage-actions">
          <button className="edu-form-save" onClick={handleSave}>Kaydet</button>
        </div>
      </section>
    </div>
  );
}

export default function ModulEklePage() {
  return (
    <AdminShell>
      <AddForm />
    </AdminShell>
  );
}
