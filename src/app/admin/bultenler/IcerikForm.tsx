"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DatePicker } from "../../components/DatePicker";
import { TimePicker } from "../../components/TimePicker";
import { SystemDropdown } from "../../components/SystemDropdown";
import { Icerik, IcerikTuru, bultenOptions } from "./data";

type IconName = "back" | "file" | "settings" | "grid" | "eye" | "calendar";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.5-1H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 3.6 8.5 1.65 1.65 0 0 0 3.27 6.7l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.61.76 1 1.4 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const turOptions = [
  { value: "video", label: "Video" },
  { value: "dosya", label: "Dosya" },
  { value: "metin", label: "Metin" },
];

function youtubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : "";
}

export function IcerikForm({ mode, base = null }: { mode: "ekle" | "duzenle"; base?: Icerik | null }) {
  const router = useRouter();
  const backHref = mode === "ekle" ? "/admin/icerikler" : base ? `/admin/bultenler/${base.bultenId}` : "/admin/icerikler";

  const [bultenId,  setBultenId]  = useState(base?.bultenId ?? "");
  const [baslik,    setBaslik]    = useState(base?.baslik ?? "");
  const [aciklama,  setAciklama]  = useState(base?.aciklama ?? "");
  const [tur,       setTur]       = useState<IcerikTuru>(base?.tur ?? "video");
  const [tarih,     setTarih]     = useState(base ? base.yayinTarihi.split(" ")[0] : "");
  const [saat,      setSaat]      = useState(base ? base.yayinTarihi.split(" ")[1] ?? "09:00" : "09:00");
  const [youtube,   setYoutube]   = useState(base?.youtubeUrl ?? "");
  const [dosya,     setDosya]     = useState(base?.dosya ?? "");
  const [genislik,  setGenislik]  = useState<"normal" | "tam">(base?.genislik ?? "normal");
  const [yayinda,   setYayinda]   = useState(base?.yayinda ?? false);
  const [preview,   setPreview]   = useState(false);
  const [error,     setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const ytId = youtubeId(youtube);

  function save() {
    if (!baslik.trim()) { setError("Başlık zorunludur."); return; }
    setError("");
    router.push(backHref);
  }

  if (mode === "duzenle" && !base) return (
    <div className="st-page">
      <header className="favorite-category-create-header"><Link className="back-link" href="/admin/icerikler"><Icon name="back" size={16} />İçeriklere dön</Link><h1>İçerik Düzenle</h1></header>
      <section className="detail-panel"><div className="settings-panel-body"><p style={{ color: "var(--muted)", fontSize: ".72rem" }}>İçerik bulunamadı.</p></div></section>
    </div>
  );

  return (
    <div className="st-page">
      <header className="favorite-category-create-header">
        <Link className="back-link" href={backHref}><Icon name="back" size={16} />İçeriklere dön</Link>
        <h1>{mode === "ekle" ? "Yeni İçerik" : "İçerik Düzenle"}</h1>
      </header>

      <div className="edu-edit-wrap">
        <div className="edu-edit-col">
          <section className="detail-panel">
            <div className="detail-panel-heading"><p className="eyebrow">İÇERİK BİLGİLERİ</p><h2>Temel Bilgiler</h2></div>
            <div className="settings-panel-body">
              <div className="form-field"><label>Bülten<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label><SystemDropdown value={bultenId} onChange={setBultenId} placeholder="Bülten seç" ariaLabel="Bülten" options={bultenOptions()} /></div>
              <div className="form-field"><label htmlFor="ic-baslik">Başlık<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label><input id="ic-baslik" value={baslik} onChange={(e) => { setBaslik(e.target.value); setError(""); }} placeholder="İçerik başlığı" /></div>
              <div className="form-field"><label htmlFor="ic-aciklama">Açıklama</label><textarea id="ic-aciklama" value={aciklama} rows={4} onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} /></div>
              <div className="edu-row-2">
                <div className="form-field"><label>İçerik Türü<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label><SystemDropdown value={tur} onChange={(v) => setTur(v as IcerikTuru)} ariaLabel="İçerik türü" options={turOptions} /></div>
                <div className="form-field"><label>Yayın Tarihi<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label><div style={{ display: "flex", gap: ".4rem" }}><DatePicker id="ic-tarih" value={tarih} onChange={setTarih} /><div style={{ width: 80, flexShrink: 0 }}><TimePicker id="ic-saat" value={saat} onChange={setSaat} placeholder="SS:DD" /></div></div></div>
              </div>
              <div className="form-field">
                <label htmlFor="ic-yt">YouTube URL <span style={{ fontWeight: 600, color: "#9baab6", fontSize: ".82em" }}>(video türü için)</span></label>
                <input id="ic-yt" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
                <small>YouTube linki girilirse dosya yerine embed gösterilir.</small>
              </div>
              <div className="form-field">
                <label>Dosya <span style={{ fontWeight: 600, color: "#9baab6", fontSize: ".82em" }}>(YouTube yoksa)</span></label>
                <div className="bulten-upload" role="button" tabIndex={0} onClick={() => fileRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}>
                  <Icon name="file" size={16} />{dosya || "Dosya seç veya sürükle bırak"}
                </div>
                <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => setDosya(e.target.files?.[0]?.name ?? "")} />
              </div>
            </div>
          </section>
        </div>

        <aside className="bulten-side">
          <section className="detail-panel">
            <div className="detail-panel-heading"><p className="eyebrow">BÜLTEN GENİŞLİĞİ</p><h2>Sayfada kaç kolon?</h2></div>
            <div className="settings-panel-body">
              <div className="icerik-genislik">
                <button type="button" className={genislik === "normal" ? "active" : ""} onClick={() => setGenislik("normal")}>
                  <span className="bars"><i style={{ width: 20 }} /><i style={{ opacity: .3 }} /><i style={{ opacity: .3 }} /></span>Normal
                </button>
                <button type="button" className={genislik === "tam" ? "active" : ""} onClick={() => setGenislik("tam")}>
                  <span className="bars"><i /><i /><i /></span>Tam Genişlik
                </button>
              </div>
            </div>
          </section>
          <section className="detail-panel">
            <div className="detail-panel-heading"><p className="eyebrow">YAYIN AYARLARI</p><h2>Yayın</h2></div>
            <div className="settings-panel-body">
              <label className="guide-toggle">
                <span><strong>Yayında</strong><small>Açıkken içerik yayınlanır</small></span>
                <input type="checkbox" checked={yayinda} onChange={(e) => setYayinda(e.target.checked)} />
                <i aria-hidden="true" />
              </label>
            </div>
          </section>
          <button className="bulten-preview-btn" type="button" onClick={() => setPreview(true)}><Icon name="eye" size={15} />İçeriği Önizle</button>
          {error && <p style={{ margin: 0, fontSize: ".65rem", color: "#c85a51", fontWeight: 700 }}>{error}</p>}
          <button className="edu-form-save" onClick={save}>{mode === "ekle" ? "Oluştur" : "Güncelle"}</button>
          <Link className="bulten-cancel" href={backHref}>Vazgeç</Link>
        </aside>
      </div>

      {preview && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setPreview(false); }}>
          <section className="bulten-preview-modal" role="dialog" aria-modal="true" aria-label="İçerik önizleme">
            <header><strong>İçerik Önizleme</strong><button aria-label="Kapat" onClick={() => setPreview(false)}>×</button></header>
            <div className="bulten-preview-body">
              <div className="bulten-preview-meta">
                <span className={`bulten-badge ${yayinda ? "yayinda" : "taslak"}`}>{yayinda ? "Yayında" : "Taslak"}</span>
                <span><Icon name="calendar" size={12} /> {tarih} {saat}</span>
              </div>
              <h2>{baslik || "Başlıksız içerik"}</h2>
              {aciklama.trim() ? <p>{aciklama}</p> : <p className="muted">Açıklama eklenmedi.</p>}
              {ytId ? (
                <div style={{ marginTop: "1.1rem", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden", background: "#000" }}>
                  <iframe src={`https://www.youtube.com/embed/${ytId}`} title="Video önizleme" style={{ width: "100%", height: "100%", border: 0 }} allowFullScreen />
                </div>
              ) : dosya ? (
                <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: ".6rem", padding: ".7rem .8rem", border: "1px solid var(--line)", borderRadius: 9, background: "#f8fafb", color: "#3f556a", fontSize: ".7rem", fontWeight: 700 }}>
                  <span style={{ color: "var(--blue)" }}><Icon name="file" size={18} /></span>{dosya}
                </div>
              ) : null}
            </div>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
}
