"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { DatePicker } from "../../components/DatePicker";
import { TimePicker } from "../../components/TimePicker";
import { Bulten } from "./data";

type IconName = "back" | "calendar" | "image" | "eye";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

export function BultenForm({ mode, initial = {}, basePath = "/admin/bultenler" }: { mode: "ekle" | "duzenle"; initial?: Partial<Bulten>; basePath?: string }) {
  const router = useRouter();
  const [baslik,   setBaslik]   = useState(initial.baslik ?? "");
  const [aciklama, setAciklama] = useState(initial.aciklama ?? "");
  const [tarih,    setTarih]    = useState(initial.yayinTarihi ? initial.yayinTarihi.split(" ")[0] : todayStr());
  const [saat,     setSaat]     = useState(initial.yayinTarihi ? initial.yayinTarihi.split(" ")[1] ?? "09:00" : "09:00");
  const [yayinda,  setYayinda]  = useState(initial.yayinda ?? false);
  const [kapak,    setKapak]    = useState("");
  const [kapakUrl, setKapakUrl] = useState("");
  const [preview,  setPreview]  = useState(false);
  const [error,    setError]    = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setKapak(f.name);
    const reader = new FileReader();
    reader.onload = (ev) => setKapakUrl(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  function save() {
    if (!baslik.trim()) { setError("Başlık zorunludur."); return; }
    setError("");
    router.push(basePath);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="favorite-category-create-header">
          <Link className="back-link" href={basePath}><Icon name="back" size={16} />Bültenlere dön</Link>
          <h1>{mode === "ekle" ? "Yeni Bülten" : "Bülten Düzenle"}</h1>
        </header>

        <div className="edu-edit-wrap">
          <div className="edu-edit-col">
            <section className="detail-panel">
              <div className="detail-panel-heading"><p className="eyebrow">BÜLTEN BİLGİLERİ</p><h2>Temel Bilgiler</h2></div>
              <div className="settings-panel-body">
                <div className="form-field">
                  <label htmlFor="b-baslik">Başlık<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label>
                  <input id="b-baslik" value={baslik} onChange={(e) => { setBaslik(e.target.value); setError(""); }} placeholder="Nisan 2026 Bülteni" />
                </div>
                <div className="form-field">
                  <label htmlFor="b-aciklama">Açıklama</label>
                  <textarea id="b-aciklama" value={aciklama} rows={5} onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} />
                </div>
                <div className="form-field">
                  <label>Kapak Görseli</label>
                  <div className="bulten-upload" role="button" tabIndex={0} onClick={() => fileRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}>
                    <Icon name="image" size={17} />{kapak || "Görsel seç veya değiştir"}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
                </div>
              </div>
            </section>
          </div>

          <aside className="bulten-side">
            <section className="detail-panel">
              <div className="detail-panel-heading"><p className="eyebrow">YAYIN AYARLARI</p><h2>Yayın</h2></div>
              <div className="settings-panel-body">
                <div className="form-field">
                  <label>Yayın Tarihi<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label>
                  <div style={{ display: "flex", gap: ".4rem" }}>
                    <DatePicker id="b-tarih" value={tarih} onChange={setTarih} />
                    <div style={{ width: 80, flexShrink: 0 }}><TimePicker id="b-saat" value={saat} onChange={setSaat} placeholder="SS:DD" /></div>
                  </div>
                </div>
                <label className="guide-toggle">
                  <span><strong>Yayında</strong><small>Açıkken bülten yayınlanır</small></span>
                  <input type="checkbox" checked={yayinda} onChange={(e) => setYayinda(e.target.checked)} />
                  <i aria-hidden="true" />
                </label>
              </div>
            </section>
            <button className="bulten-preview-btn" type="button" onClick={() => setPreview(true)}>
              <Icon name="eye" size={15} />Bülteni Önizle
            </button>
            {error && <p style={{ margin: 0, fontSize: ".65rem", color: "#c85a51", fontWeight: 700 }}>{error}</p>}
            <button className="edu-form-save" onClick={save}>{mode === "ekle" ? "Oluştur" : "Güncelle"}</button>
            <Link className="bulten-cancel" href={basePath}>Vazgeç</Link>
          </aside>
        </div>
      </div>

      {preview && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setPreview(false); }}>
          <section className="bulten-preview-modal" role="dialog" aria-modal="true" aria-label="Bülten önizleme">
            <header>
              <strong>Bülten Önizleme</strong>
              <button aria-label="Kapat" onClick={() => setPreview(false)}>×</button>
            </header>
            <div className="bulten-preview-body">
              <div className="bulten-preview-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {kapakUrl ? <img src={kapakUrl} alt="Kapak görseli" /> : <span><Icon name="image" size={18} /> Kapak görseli eklenmedi</span>}
              </div>
              <div className="bulten-preview-meta">
                <span className={`bulten-badge ${yayinda ? "yayinda" : "taslak"}`}>{yayinda ? "Yayında" : "Taslak"}</span>
                <span><Icon name="calendar" size={12} /> {tarih} {saat}</span>
              </div>
              <h2>{baslik || "Başlıksız bülten"}</h2>
              {aciklama.trim()
                ? <p>{aciklama}</p>
                : <p className="muted">Açıklama eklenmedi.</p>}
            </div>
          </section>
        </div>,
        document.body
      )}
    </AdminShell>
  );
}
