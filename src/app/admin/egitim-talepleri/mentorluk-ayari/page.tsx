"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";

const STORAGE_KEY = "eistatistik.mentorship.v1";

const DEFAULT = {
  url: "https://meet.google.com/rne-huav-tcx",
  aralik: "6",
  baslama: "2026-08-12 12:00:00 +0300",
};

const ICONS = {
  users: "M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.37a8,8,0,0,1-11.07-2.53A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.37Z",
  clock: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
} as const;

type Settings = typeof DEFAULT;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function readSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      url: parsed.url?.trim() ? parsed.url : DEFAULT.url,
      aralik: parsed.aralik?.trim() ? parsed.aralik : DEFAULT.aralik,
      baslama: parsed.baslama?.trim() ? parsed.baslama : DEFAULT.baslama,
    };
  } catch {
    return DEFAULT;
  }
}

export default function MentorlukAyariPage() {
  const toast = useToast();
  const [values, setValues] = useState<Settings>(DEFAULT);
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setValues(readSettings()));
    return () => cancelAnimationFrame(frame);
  }, []);

  function set(key: keyof Settings, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = { url: values.url.trim(), aralik: values.aralik.trim(), baslama: values.baslama.trim() };
    if (!next.url || !next.aralik || !next.baslama) {
      setError("Adres, zaman aralığı ve başlama zamanı zorunludur.");
      return;
    }
    setValues(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    toast.success("Mentörlük ayarları kaydedildi.");
  }

  const link = /^https?:\/\//i.test(values.url.trim());
  const interval = values.aralik.trim() ? `${values.aralik.trim()} dk` : "—";

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Mentörlük Ayarı</h1>
            <p>Görüşme adresi, aralık ve başlama zamanı buradan durur.</p>
          </div>
        </header>

        <form className="stype-layout" onSubmit={save}>
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="users" size={18} /></span><h2>Görüşme</h2></header>
            <label className="stype-field">
              <span>Mentörlük URL</span>
              <input value={values.url} onChange={(event) => set("url", event.target.value)} placeholder="https://meet.google.com/..." autoFocus />
            </label>
            <label className="stype-field">
              <span>Mentörlük zaman aralığı</span>
              <input value={values.aralik} onChange={(event) => set("aralik", event.target.value)} type="number" min="1" placeholder="6" />
              <small>Dakika.</small>
            </label>
            <label className="stype-field">
              <span>Mentörlük başlama zamanı</span>
              <input value={values.baslama} onChange={(event) => set("baslama", event.target.value)} placeholder="2026-08-12 12:00:00 +0300" />
            </label>
          </section>

          <aside className="fav-card acct-summary" aria-label="Mentörlük özeti">
            <header><span className="fav-mark"><Icon name="clock" size={18} /></span><h2>Özet</h2></header>
            <p className="acct-figure">{interval}</p>
            <dl className="acct-rows">
              <div><dt>Adres</dt><dd className="wrap">{link ? <a href={values.url.trim()} target="_blank" rel="noopener noreferrer">{values.url.trim()}</a> : values.url.trim() || "—"}</dd></div>
              <div><dt>Başlama</dt><dd className="wrap">{values.baslama.trim() || "—"}</dd></div>
            </dl>
            {error && <p className="acct-error" role="alert">{error}</p>}
            <button className="fav-save" type="submit">Kaydet</button>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
