"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "../AdminShell";
import { useToast } from "../../components/ToastProvider";

const STORAGE_KEY = "eistatistik.plan-settings.v1";
const ACTIVE_SUBSCRIBERS = 42;

const DEFAULT = {
  planAdi: "Abonelik Planı",
  aciklama: "",
  aylikUcret: "2400",
  satisAcik: false,
};

type Settings = typeof DEFAULT;

const ICONS = {
  card: "M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM32,64H224v32H32ZM224,192H32V112H224v80Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Z",
  chart: "M224,200H32V48a8,8,0,0,0-16,0V208a8,8,0,0,0,8,8H224a8,8,0,0,0,0-16ZM80,176V120a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm48,0V88a8,8,0,0,1,16,0v88a8,8,0,0,1-16,0Zm48,0V56a8,8,0,0,1,16,0v120a8,8,0,0,1-16,0Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label="Aboneliği satışa aç" className={`role-switch${checked ? " on" : ""}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

function readSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      planAdi: parsed.planAdi?.trim() ? parsed.planAdi : DEFAULT.planAdi,
      aciklama: parsed.aciklama ?? "",
      aylikUcret: parsed.aylikUcret?.trim() ? parsed.aylikUcret : DEFAULT.aylikUcret,
      satisAcik: Boolean(parsed.satisAcik),
    };
  } catch {
    return DEFAULT;
  }
}

function money(value: number) {
  return `${value.toLocaleString("tr-TR")} TL`;
}

export default function PlanAyarlariPage() {
  const toast = useToast();
  const [values, setValues] = useState<Settings>(DEFAULT);
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setValues(readSettings()));
    return () => cancelAnimationFrame(frame);
  }, []);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.planAdi.trim()) {
      setError("Plan adı boş bırakılamaz.");
      return;
    }
    const next = { ...values, planAdi: values.planAdi.trim(), aciklama: values.aciklama.trim() };
    setValues(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    toast.success("Plan ayarları kaydedildi.");
  }

  const fee = Number(values.aylikUcret);
  const amount = Number.isFinite(fee) && fee > 0 ? fee : 0;
  const subscribers = values.satisAcik ? ACTIVE_SUBSCRIBERS : 0;
  const income = values.satisAcik ? subscribers * amount : 0;

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Plan Ayarları</h1>
            <p>Plan adı, ücret ve satış durumu. Aylık gelir aktif abone ile ücretin çarpımıdır.</p>
          </div>
        </header>

        <form className="stype-layout" onSubmit={save}>
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="card" /></span><h2>Plan bilgileri</h2></header>
            <label className="stype-field">
              <span>Plan adı</span>
              <input value={values.planAdi} onChange={(event) => set("planAdi", event.target.value)} autoFocus />
            </label>
            <label className="stype-field">
              <span>Açıklama</span>
              <textarea value={values.aciklama} onChange={(event) => set("aciklama", event.target.value)} rows={4} />
            </label>
            <label className="stype-field">
              <span>Aylık ücret</span>
              <input value={values.aylikUcret} onChange={(event) => set("aylikUcret", event.target.value)} type="number" min="0" />
            </label>
            <div className="role-option">
              <span><strong>Aboneliği satışa aç</strong><small>Açıkken plan müşterilere satın alınabilir olur.</small></span>
              <Switch checked={values.satisAcik} onChange={(value) => set("satisAcik", value)} />
            </div>
          </section>

          <aside className="fav-card acct-summary" aria-label="Plan özeti">
            <header><span className="fav-mark"><Icon name="chart" /></span><h2>Plan özeti</h2></header>
            <span className={`stype-status ${values.satisAcik ? "aktif" : "pasif"}`}>{values.satisAcik ? "Aktif" : "Pasif"}</span>
            <p className="acct-figure">{money(income)}</p>
            <dl className="acct-rows">
              <div><dt>Plan</dt><dd className="wrap">{values.planAdi.trim() || "Plan adı"}</dd></div>
              <div><dt>Aylık ücret</dt><dd>{money(amount)}</dd></div>
              <div><dt>Satış</dt><dd>{values.satisAcik ? "Açık" : "Kapalı"}</dd></div>
              <div><dt>Aktif abone</dt><dd>{subscribers}</dd></div>
            </dl>
            <p className="llist-empty">{values.aciklama.trim() || "Aylık gelir, aktif abone sayısı ile aylık ücretin çarpımıdır."}</p>
            {error && <p className="acct-error" role="alert">{error}</p>}
            <button className="fav-save" type="submit">Kaydet</button>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
