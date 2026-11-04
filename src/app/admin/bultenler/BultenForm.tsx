"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../AdminShell";
import { DatePicker } from "../../components/DatePicker";
import { TimePicker } from "../../components/TimePicker";
import { useToast } from "../../components/ToastProvider";
import { Bulten, readBultenler, writeBultenler } from "./data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  news: "M216,40H40A16,16,0,0,0,24,56V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V80H40ZM216,192H40V96H216Zm-16-24a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,168Z",
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
    <button type="button" role="switch" aria-checked={checked} aria-label="Yayında" className={`role-switch${checked ? " on" : ""}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

function todayStamp() {
  const date = new Date();
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

export function BultenForm({ mode, initial = {}, basePath = "/admin/bultenler" }: { mode: "ekle" | "duzenle"; initial?: Partial<Bulten>; basePath?: string }) {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [baslik, setBaslik] = useState(initial.baslik ?? "");
  const [aciklama, setAciklama] = useState(initial.aciklama ?? "");
  const [tarih, setTarih] = useState(initial.yayinTarihi?.split(" ")[0] || todayStamp());
  const [saat, setSaat] = useState(initial.yayinTarihi?.split(" ")[1] || "09:00");
  const [yayinda, setYayinda] = useState(initial.yayinda ?? false);
  const [kapak, setKapak] = useState<string | null>(initial.kapak ?? null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!baslik.trim()) {
      setError("Başlık zorunludur.");
      return;
    }
    const current = readBultenler();
    const record: Bulten = {
      id: initial.id ?? `b${Date.now()}`,
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      yayinTarihi: `${tarih} ${saat}`.trim(),
      yayinda,
      kapak: kapak || undefined,
    };
    writeBultenler(initial.id ? current.map((item) => item.id === initial.id ? record : item) : [record, ...current]);
    toast.success(mode === "duzenle" ? "Bülten güncellendi." : "Bülten oluşturuldu.");
    router.push(basePath);
  }

  function remove() {
    if (!initial.id) return;
    writeBultenler(readBultenler().filter((item) => item.id !== initial.id));
    toast.success("Bülten silindi.");
    router.push(basePath);
  }

  return (
    <AdminShell>
      <div className="fav-page stype-page">
        <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Bültenlere dön</Link>
        <form className="stype-layout" onSubmit={save}>
          <div className="stype-stack">
            <section className="fav-card stype-section">
              <header><span className="fav-mark"><Icon name="news" /></span><h2>Temel bilgiler</h2></header>
              <label className="stype-field">
                <span>Başlık</span>
                <input value={baslik} onChange={(event) => { setBaslik(event.target.value); setError(""); }} placeholder="Nisan 2026 Bülteni" autoFocus />
              </label>
              <label className="stype-field">
                <span>Açıklama</span>
                <textarea value={aciklama} onChange={(event) => setAciklama(event.target.value)} rows={5} />
              </label>
              <div className="stype-field">
                <span>Kapak görseli</span>
                <input ref={fileRef} hidden type="file" accept="image/*" onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setKapak(String(reader.result || ""));
                  reader.readAsDataURL(file);
                }} />
                {kapak ? (
                  <div className="ann-upload">
                    <img src={kapak} alt="Kapak görseli" />
                    <button type="button" onClick={() => setKapak(null)}>Kaldır</button>
                  </div>
                ) : (
                  <button className="llist-upload" type="button" onClick={() => fileRef.current?.click()}>
                    Görsel seç veya değiştir
                    <small>Bülten kapağı.</small>
                  </button>
                )}
              </div>
            </section>

            <section className="fav-card stype-section">
              <header><h2>Yayın</h2></header>
              <label className="stype-field">
                <span>Yayın tarihi</span>
                <div className="appt-when">
                  <DatePicker id="b-tarih" value={tarih} onChange={setTarih} />
                  <TimePicker id="b-saat" value={saat} onChange={setSaat} />
                </div>
              </label>
              <div className="role-option">
                <span><strong>Yayında</strong><small>Açıkken bülten yayınlanır.</small></span>
                <Switch checked={yayinda} onChange={setYayinda} />
              </div>
            </section>

            <div className="fav-actions">
              {error && <p role="alert">{error}</p>}
              {mode === "duzenle" && initial.id && (confirming ? (
                <>
                  <p>Bu işlem geri alınamaz.</p>
                  <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
                  <button className="fav-delete" type="button" onClick={remove}>Evet, sil</button>
                </>
              ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>Bülteni sil</button>)}
              <button className="fav-save" type="submit">{mode === "ekle" ? "Oluştur" : "Güncelle"}</button>
            </div>
          </div>

          <aside className="fav-card acct-summary" aria-label="Bülten önizleme">
            <header><span className="fav-mark"><Icon name="news" /></span><h2>Önizleme</h2></header>
            {kapak && <img className="ann-preview" src={kapak} alt="" />}
            <span className={`stype-status ${yayinda ? "aktif" : "pasif"}`}>{yayinda ? "Yayında" : "Taslak"}</span>
            <p className="acct-figure">{saat || "—"}</p>
            <dl className="acct-rows">
              <div><dt>Başlık</dt><dd className="wrap">{baslik.trim() || "Başlıksız bülten"}</dd></div>
              <div><dt>Tarih</dt><dd>{tarih || "—"}</dd></div>
            </dl>
            <p className="tm-bubble">{aciklama.trim() || "Açıklama eklenmedi."}</p>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
