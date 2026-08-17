"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminShell } from "../../AdminShell";
import { SystemDropdown } from "../../../components/SystemDropdown";

type IconName = "back" | "check" | "save";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:  <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    save:  <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function SiparisTuruEklePage() {
  const [kod,            setKod]            = useState("");
  const [baslik,         setBaslik]         = useState("");
  const [ilkUcret,       setIlkUcret]       = useState("");
  const [siralama,       setSiralama]       = useState("");
  const [aciklama,       setAciklama]       = useState("");
  const [durum,          setDurum]          = useState("aktif");
  const [yardimVideo,    setYardimVideo]    = useState("");
  const [teslimatZaman,  setTeslimatZaman]  = useState("");
  const [teslimatTur,    setTeslimatTur]    = useState("");
  const [logoUrl,        setLogoUrl]        = useState("");
  const [otomatikUcret,  setOtomatikUcret]  = useState(false);
  const [saved,          setSaved]          = useState(false);

  const canSave = kod.trim() && baslik.trim() && ilkUcret.trim() && teslimatZaman.trim() && teslimatTur.trim();

  function handleSave() {
    if (!canSave) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="st-ekle-header">
          <Link className="back-link" href="/admin/siparis-turleri">
            <Icon name="back" size={16} />Sipariş Türlerine dön
          </Link>
          <div>
            <p className="eyebrow">YÖNETİM · SİPARİŞ TÜRLERİ</p>
            <h1>Yeni Sipariş Türü Ekle</h1>
          </div>
        </header>

        <div className="st-form-layout">
          {/* ── Sol: form ── */}
          <section className="detail-panel">
            <div className="settings-panel-body">

              {/* Satır 1: Kod · Başlık · İlk Ücret */}
              <div className="st-form-row3">
                <div className="form-field">
                  <label>Kod <em>*</em></label>
                  <input value={kod} onChange={(e) => setKod(e.target.value.toUpperCase())} placeholder="SA" maxLength={6} />
                </div>
                <div className="form-field">
                  <label>Başlık <em>*</em></label>
                  <input value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="İstatistiksel Veri Analizi" />
                </div>
                <div className="form-field">
                  <label>İlk Ücret <em>*</em></label>
                  <input value={ilkUcret} onChange={(e) => setIlkUcret(e.target.value)} placeholder="0.0" type="number" min="0" step="0.01" />
                </div>
              </div>

              {/* Satır 2: Sıralama · Açıklama */}
              <div className="form-grid">
                <div className="form-field">
                  <label>Sıralama</label>
                  <input value={siralama} onChange={(e) => setSiralama(e.target.value)} placeholder="1" type="number" min="1" />
                </div>
                <div className="form-field">
                  <label>Açıklama</label>
                  <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} className="small" placeholder="İsteğe bağlı açıklama" />
                </div>
              </div>

              {/* Satır 3: Durum · Yardım Videosu */}
              <div className="form-grid">
                <div className="form-field">
                  <label>Durum</label>
                  <SystemDropdown value={durum} onChange={setDurum} ariaLabel="Durum" options={[{ value: "aktif", label: "Aktif" }, { value: "pasif", label: "Pasif" }]} />
                </div>
                <div className="form-field">
                  <label>Yardım Videosu</label>
                  <input value={yardimVideo} onChange={(e) => setYardimVideo(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                </div>
              </div>

              {/* Satır 4: Teslimat Zamanları */}
              <div className="form-field">
                <label>Teslimat Zamanları <em>*</em></label>
                <input
                  value={teslimatZaman}
                  onChange={(e) => setTeslimatZaman(e.target.value)}
                  placeholder="12 saat:1.0,24 saat:2.0,2gün:3.0,4 gün:4.0,7 gün:5.0,14 gün:6.0,30 gün:7.0"
                />
              </div>

              {/* Satır 5: Teslimat Türleri */}
              <div className="form-field">
                <label>Teslimat Türleri <em>*</em></label>
                <input
                  value={teslimatTur}
                  onChange={(e) => setTeslimatTur(e.target.value)}
                  placeholder="SPSS:1.0,Tablo:2.0,Tablo ve yorum:3.0"
                />
              </div>

              {/* Satır 6: Logo URL · Otomatik Ücret */}
              <div className="form-grid">
                <div className="form-field">
                  <label>Logo URL <em style={{ fontStyle: "normal", fontSize: ".85em", color: "#9baab6" }}>(900×500)</em></label>
                  <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="st-checkbox-field">
                  <label className="st-checkbox-label">
                    <input type="checkbox" checked={otomatikUcret} onChange={(e) => setOtomatikUcret(e.target.checked)} />
                    <span>Otomatik Ücret Belirlensin mi?</span>
                  </label>
                </div>
              </div>

              {/* Kaydet */}
              <div className="st-save-row">
                <button className={`st-save-btn${saved ? " saved" : ""}`} onClick={handleSave} disabled={!canSave}>
                  {saved
                    ? <><Icon name="check" size={16} />Kaydedildi</>
                    : <><Icon name="save" size={16} />Kaydet</>}
                </button>
              </div>

            </div>
          </section>

          {/* ── Sağ: önizleme ── */}
          <aside className="detail-panel st-preview-panel">
            <div className="st-preview-head">
              <p className="eyebrow" style={{ marginBottom: ".25rem" }}>ÖNİZLEME</p>
              <strong style={{ color: "var(--navy)", fontSize: ".75rem" }}>
                {baslik || "Başlık"}
              </strong>
            </div>
            <div className="st-preview-body">
              {yardimVideo ? (
                <a href={yardimVideo} target="_blank" rel="noopener noreferrer" className="st-preview-video-link">
                  Yardım videosu
                </a>
              ) : (
                <span className="st-preview-video-link muted">Yardım videosu</span>
              )}

              <div className="st-preview-image">
                {logoUrl
                  ? <img src={logoUrl} alt="Logo önizleme" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  : <span>900 × 500 görsel</span>}
              </div>

              <p className="st-preview-desc">
                {aciklama || <span style={{ color: "#b0bcc7" }}>Açıklama</span>}
              </p>

              <button className="st-preview-btn" tabIndex={-1}>Talep Et</button>
            </div>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
