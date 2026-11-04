"use client";

import { FormEvent, useState } from "react";
import { AdminShell } from "../AdminShell";
import { SystemDropdown } from "../../components/SystemDropdown";
import { useToast } from "../../components/ToastProvider";

const DIRECTIONS = ["Gelen", "Giden"];

const USERS = [
  "KEREM MURAT",
  "NACİ MURAT",
  "SÜMEYYE İNAN",
  "MEHMET MEŞE",
  "ALİHSAN ŞÜKÜR",
  "eistatistik ANALİZÖR",
  "EMRE KAYA",
  "DİLARA YILMAZ",
  "ESRA ÖZTÜRK",
  "BURCU AKSOY",
];

const ICONS = {
  currency: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z",
  clipboard: "M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM128,32a32,32,0,0,0-32,32,8,8,0,0,0,8,8h48a8,8,0,0,0,8-8A32,32,0,0,0,128,32Zm72,184V48H176v8a24,24,0,0,1-24,24H104A24,24,0,0,1,80,56V48H56V216Z",
} as const;

type FormState = {
  projeAdi: string;
  islemTipi: string;
  birim: string;
  tutar: string;
  kullaniciAdi: string;
  siparis: string;
};

const EMPTY: FormState = { projeAdi: "", islemTipi: "", birim: "", tutar: "", kullaniciAdi: "", siparis: "" };

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function money(value: string) {
  const amount = Number(value);
  if (!value.trim() || !Number.isFinite(amount)) return "0,00 TL";
  return `${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} TL`;
}

export default function ProjeMuhasebesiPage() {
  const toast = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState("");

  function set(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(form.tutar);
    if (!form.projeAdi.trim() || !form.islemTipi || !form.tutar.trim() || !Number.isFinite(amount) || amount < 0 || !form.kullaniciAdi) {
      setError("Proje adı, işlem tipi, tutar ve kullanıcı zorunludur.");
      return;
    }
    toast.success("Muhasebe kaydı oluşturuldu.");
    setForm(EMPTY);
  }

  const directionClass = form.islemTipi === "Gelen" || form.islemTipi === "Giden" ? form.islemTipi.toLowerCase() : "quiet";

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Proje Muhasebesi</h1>
            <p>Cari hesap kaydı oluşturun. Proje, tutar ve kullanıcı bu formda.</p>
          </div>
        </header>

        <form className="stype-layout" onSubmit={handleSave}>
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="currency" size={18} /></span><h2>Cari kayıt</h2></header>
            <label className="stype-field">
              <span>Proje adı</span>
              <input value={form.projeAdi} onChange={(event) => set("projeAdi", event.target.value)} placeholder="Proje adı girin" autoFocus />
            </label>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>İşlem tipi</span>
                <SystemDropdown value={form.islemTipi} onChange={(value) => set("islemTipi", value)} placeholder="Seçiniz" ariaLabel="İşlem tipi" options={DIRECTIONS.map((item) => ({ value: item, label: item }))} />
              </label>
              <label className="stype-field">
                <span>Birim</span>
                <input value={form.birim} onChange={(event) => set("birim", event.target.value)} placeholder="Birim girin" />
              </label>
            </div>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Tutar</span>
                <input value={form.tutar} onChange={(event) => set("tutar", event.target.value)} type="number" min="0" step="0.01" placeholder="0,00" />
              </label>
              <label className="stype-field">
                <span>Kullanıcı adı</span>
                <SystemDropdown value={form.kullaniciAdi} onChange={(value) => set("kullaniciAdi", value)} placeholder="Kullanıcı seçin" ariaLabel="Kullanıcı adı" searchable searchPlaceholder="Kullanıcı ara…" options={USERS.map((item) => ({ value: item, label: item }))} />
              </label>
            </div>
            <label className="stype-field">
              <span>Sipariş</span>
              <input value={form.siparis} onChange={(event) => set("siparis", event.target.value)} placeholder="Sipariş kodu (opsiyonel)" />
              <small>Sipariş kodu zorunlu değil.</small>
            </label>
          </section>

          <aside className="fav-card acct-summary" aria-label="Cari kayıt özeti">
            <header><span className="fav-mark"><Icon name="clipboard" size={18} /></span><h2>Kayıt özeti</h2></header>
            <span className={`acct-badge ${directionClass}`}>{form.islemTipi || "İşlem tipi"}</span>
            <p className={`acct-figure ${directionClass}`}>{money(form.tutar)}</p>
            <dl className="acct-rows">
              <div><dt>Proje</dt><dd>{form.projeAdi.trim() || "Proje adı"}</dd></div>
              <div><dt>Birim</dt><dd>{form.birim.trim() || "—"}</dd></div>
              <div><dt>Kullanıcı</dt><dd>{form.kullaniciAdi || "Seçilmedi"}</dd></div>
              <div><dt>Sipariş</dt><dd>{form.siparis.trim() || "—"}</dd></div>
            </dl>
            {error && <p className="acct-error" role="alert">{error}</p>}
            <button className="fav-save" type="submit">Kaydı oluştur</button>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
