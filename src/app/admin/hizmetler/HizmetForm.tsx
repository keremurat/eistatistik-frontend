"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "../AdminShell";
import { Hizmet, slugify } from "./data";

function Icon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg>;
}

export function HizmetForm({ mode, base = null }: { mode: "ekle" | "duzenle"; base?: Hizmet | null }) {
  const router = useRouter();
  const [baslik,    setBaslik]    = useState(base?.baslik ?? "");
  const [kartOzeti, setKartOzeti] = useState(base?.kartOzeti ?? "");
  const [icerik,    setIcerik]    = useState(base?.icerik ?? "");
  const [ikon,      setIkon]      = useState(base?.ikon ?? "");
  const [videoUrl,  setVideoUrl]  = useState(base?.videoUrl ?? "");
  const [seoMeta,   setSeoMeta]   = useState(base?.seoMeta ?? "");
  const [sira,      setSira]      = useState(String(base?.sira ?? 0));
  const [aktif,     setAktif]     = useState(base?.aktif ?? true);
  const [error,     setError]     = useState("");

  const slug = mode === "duzenle" && base ? base.slug : (baslik.trim() ? slugify(baslik) : "");

  function save() {
    if (!baslik.trim()) { setError("Başlık zorunludur."); return; }
    setError("");
    router.push("/admin/hizmetler");
  }

  if (mode === "duzenle" && !base) return (
    <AdminShell><div className="st-page">
      <header className="favorite-category-create-header"><Link className="back-link" href="/admin/hizmetler"><Icon size={16} />Hizmetlere dön</Link><h1>Hizmeti Düzenle</h1></header>
      <section className="detail-panel"><div className="settings-panel-body"><p style={{ color: "var(--muted)", fontSize: ".72rem" }}>Hizmet bulunamadı.</p></div></section>
    </div></AdminShell>
  );

  return (
    <AdminShell>
      <div className="st-page">
        <header className="favorite-category-create-header">
          <Link className="back-link" href="/admin/hizmetler"><Icon size={16} />Hizmetlere dön</Link>
          <h1>{mode === "ekle" ? "Yeni Hizmet" : baslik || "Hizmeti Düzenle"}</h1>
        </header>

        <div className="edu-edit-wrap">
          <div className="edu-edit-col">
            <section className="detail-panel">
              <div className="detail-panel-heading"><p className="eyebrow">HİZMET İÇERİĞİ</p><h2>Sayfa Bilgileri</h2></div>
              <div className="settings-panel-body">
                <div className="form-field">
                  <label htmlFor="hz-baslik">Başlık<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label>
                  <input id="hz-baslik" value={baslik} onChange={(e) => { setBaslik(e.target.value); setError(""); }} placeholder="Hizmet başlığı" />
                  <p className="hz-url-note">URL: /hizmetler/{slug || "…"}{mode === "duzenle" ? " (değiştirilemez)" : ""}</p>
                </div>
                <div className="form-field">
                  <label htmlFor="hz-ozet">Kart Özeti (ana sayfa)</label>
                  <textarea id="hz-ozet" value={kartOzeti} rows={3} onChange={(e) => setKartOzeti(e.target.value)} style={{ resize: "vertical" }} placeholder="Ana sayfadaki hizmet kartında görünecek kısa özet" />
                </div>
                <div className="form-field">
                  <label htmlFor="hz-icerik">İçerik</label>
                  <textarea id="hz-icerik" value={icerik} rows={12} onChange={(e) => setIcerik(e.target.value)} style={{ resize: "vertical" }} placeholder="Hizmet detay sayfasının içeriği" />
                </div>
              </div>
            </section>
          </div>

          <aside className="bulten-side">
            <section className="detail-panel">
              <div className="detail-panel-heading"><p className="eyebrow">AYARLAR</p><h2>Görünüm ve SEO</h2></div>
              <div className="settings-panel-body">
                <div className="form-field">
                  <label htmlFor="hz-ikon">İkon (lucide adı)</label>
                  <input id="hz-ikon" value={ikon} onChange={(e) => setIkon(e.target.value)} placeholder="bar-chart-2" />
                  <small>ör. bar-chart-2, activity, file-text</small>
                </div>
                <div className="form-field">
                  <label htmlFor="hz-video">Video URL</label>
                  <input id="hz-video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/…" />
                  <small>YouTube linki — watch/shorts/embed hepsi olur</small>
                </div>
                <div className="form-field">
                  <label htmlFor="hz-seo">SEO Meta Açıklama</label>
                  <textarea id="hz-seo" value={seoMeta} rows={4} onChange={(e) => setSeoMeta(e.target.value)} style={{ resize: "vertical" }} />
                </div>
                <div className="form-field">
                  <label htmlFor="hz-sira">Sıra</label>
                  <input id="hz-sira" type="number" min="0" value={sira} onChange={(e) => setSira(e.target.value)} />
                </div>
                <label className="guide-toggle">
                  <span><strong>Aktif</strong><small>Ana sayfada gösterilir</small></span>
                  <input type="checkbox" checked={aktif} onChange={(e) => setAktif(e.target.checked)} />
                  <i aria-hidden="true" />
                </label>
                {error && <p style={{ margin: 0, fontSize: ".65rem", color: "#c85a51", fontWeight: 700 }}>{error}</p>}
                <button className="edu-form-save" onClick={save} style={{ marginTop: ".2rem" }}>{mode === "ekle" ? "Oluştur" : "Kaydet"}</button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
