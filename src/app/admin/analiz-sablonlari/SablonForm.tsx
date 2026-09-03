"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Sablon } from "./data";

type IconName = "back" | "file";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function SablonForm({ mode, base = null }: { mode: "ekle" | "duzenle"; base?: Sablon | null }) {
  const router = useRouter();
  const [baslik,   setBaslik]   = useState(base?.baslik ?? "");
  const [aciklama, setAciklama] = useState(base?.aciklama ?? "");
  const [videoUrl, setVideoUrl] = useState(base?.videoUrl ?? "");
  const [dosya,    setDosya]    = useState(base?.dosya ?? "");
  const [sira,     setSira]     = useState(String(base?.sira ?? 1));
  const [yayinda,  setYayinda]  = useState(base?.yayinda ?? true);
  const [error,    setError]    = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function save() {
    if (!baslik.trim()) { setError("Başlık zorunludur."); return; }
    setError("");
    router.push("/admin/analiz-sablonlari");
  }

  if (mode === "duzenle" && !base) return (
    <AdminShell><div className="st-page">
      <header className="favorite-category-create-header"><Link className="back-link" href="/admin/analiz-sablonlari"><Icon name="back" size={16} />Şablonlara dön</Link><h1>Şablon Düzenle</h1></header>
      <section className="detail-panel"><div className="settings-panel-body"><p style={{ color: "var(--muted)", fontSize: ".72rem" }}>Şablon bulunamadı.</p></div></section>
    </div></AdminShell>
  );

  return (
    <AdminShell>
      <div className="st-page sablon-onepage">
        <header className="favorite-category-create-header">
          <Link className="back-link" href="/admin/analiz-sablonlari"><Icon name="back" size={16} />Şablonlara dön</Link>
          <h1>{mode === "ekle" ? "Yeni Şablon" : "Şablon Düzenle"}</h1>
        </header>

        <div className="edu-edit-wrap">
          {/* ── Sol: başlık + açıklama ── */}
          <div className="edu-edit-col">
            <section className="detail-panel sablon-main-panel">
              <div className="detail-panel-heading"><p className="eyebrow">ŞABLON BİLGİLERİ</p><h2>Analizörlerin erişeceği şablon</h2></div>
              <div className="settings-panel-body">
                <div className="form-field">
                  <label htmlFor="sb-baslik">Başlık<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label>
                  <input id="sb-baslik" value={baslik} onChange={(e) => { setBaslik(e.target.value); setError(""); }} placeholder="Şablon başlığı" />
                </div>
                <div className="form-field sablon-desc-field">
                  <label htmlFor="sb-aciklama">Açıklama</label>
                  <textarea id="sb-aciklama" value={aciklama} rows={5} onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} placeholder="Şablonun kısa açıklaması" />
                </div>
              </div>
            </section>
          </div>

          {/* ── Sağ: medya + ayarlar + aksiyon ── */}
          <aside className="bulten-side">
            <section className="detail-panel">
              <div className="detail-panel-heading"><p className="eyebrow">MEDYA VE AYARLAR</p><h2>Kaynak ve yayın</h2></div>
              <div className="settings-panel-body">
                <div className="form-field">
                  <label htmlFor="sb-video">Video URL</label>
                  <input id="sb-video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/…" />
                  <small>YouTube veya Vimeo linki (opsiyonel)</small>
                </div>
                <div className="form-field">
                  <label>Dosya</label>
                  <div className="bulten-upload" role="button" tabIndex={0} onClick={() => fileRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}>
                    <Icon name="file" size={16} />{dosya || "Dosya seç"}
                  </div>
                  <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => setDosya(e.target.files?.[0]?.name ?? "")} />
                  <small>PDF, Word veya diğer belgeler (opsiyonel)</small>
                </div>
                <div className="form-field">
                  <label htmlFor="sb-sira">Sıra</label>
                  <input id="sb-sira" type="number" min="1" value={sira} onChange={(e) => setSira(e.target.value)} />
                </div>
                <label className="guide-toggle">
                  <span><strong>Yayında</strong><small>Analizörlere gösterilir</small></span>
                  <input type="checkbox" checked={yayinda} onChange={(e) => setYayinda(e.target.checked)} />
                  <i aria-hidden="true" />
                </label>
              </div>
            </section>
            {error && <p style={{ margin: 0, fontSize: ".65rem", color: "#c85a51", fontWeight: 700 }}>{error}</p>}
            <button className="edu-form-save" onClick={save}>{mode === "ekle" ? "Kaydet" : "Güncelle"}</button>
            <Link className="bulten-cancel" href="/admin/analiz-sablonlari">İptal</Link>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
