"use client";

import { useState } from "react";
import { AdminShell } from "../AdminShell";
import { useToast } from "../../components/ToastProvider";

type IconName = "info" | "check";
function Icon({ name, size = 15 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    info:  <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const AKTIF_ABONE = 42; // demo metrik

export default function PlanAyarlariPage() {
  const [planAdi,   setPlanAdi]   = useState("Abonelik Planı");
  const [aciklama,  setAciklama]  = useState("");
  const [aylikUcret, setAylikUcret] = useState("2400");
  const [satisAcik, setSatisAcik] = useState(false);
  const toast = useToast();
  const [error,     setError]     = useState("");

  const ucretNum   = Number(aylikUcret) || 0;
  const aylikGelir = (satisAcik ? AKTIF_ABONE * ucretNum : 0).toLocaleString("tr-TR");
  const aktifAbone = satisAcik ? AKTIF_ABONE : 0;
  const planDurumu = satisAcik ? "Aktif" : "Pasif";

  function handleSave() {
    if (!planAdi.trim()) { setError("Plan adı boş bırakılamaz."); return; }
    setError("");
    toast.success("Plan ayarları kaydedildi.");
  }

  return (
    <AdminShell>
      <div className="st-page plan-onepage">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM · ABONELİK</p>
            <h1>Abonelik Planı</h1>
          </div>
        </header>

        {/* ── Özet metrikler ── */}
        <div className="plan-stats">
          <div className="detail-panel plan-stat">
            <small>Aktif Abone</small>
            <strong>{aktifAbone}</strong>
          </div>
          <div className="detail-panel plan-stat">
            <small>Aylık Gelir</small>
            <strong className="blue">{aylikGelir} ₺</strong>
          </div>
          <div className="detail-panel plan-stat">
            <small>Plan Durumu</small>
            <strong style={{ color: satisAcik ? "#287a55" : "#8493a0" }}>{planDurumu}</strong>
          </div>
        </div>

        {/* ── Form + özet ── */}
        <div className="edu-edit-wrap">
          <div className="edu-edit-col">
            <section className="detail-panel">
              <div className="detail-panel-heading">
                <p className="eyebrow">PLAN AYARLARI</p>
                <h2>Plan Bilgileri</h2>
              </div>
              <div className="settings-panel-body">
                <div className="form-field">
                  <label htmlFor="pa-adi">Plan Adı<span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span></label>
                  <input id="pa-adi" value={planAdi} onChange={(e) => { setPlanAdi(e.target.value); setError(""); }} />
                </div>
                <div className="form-field">
                  <label htmlFor="pa-aciklama">Açıklama</label>
                  <textarea id="pa-aciklama" value={aciklama} rows={4} onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} />
                </div>
                <div className="form-field">
                  <label htmlFor="pa-ucret">Aylık Ücret (₺)</label>
                  <input id="pa-ucret" type="number" min="0" value={aylikUcret} onChange={(e) => setAylikUcret(e.target.value)} />
                </div>
                <label className="guide-toggle">
                  <span><strong>Aboneliği Satışa Aç</strong><small>Açıkken plan müşterilere satın alınabilir olur</small></span>
                  <input type="checkbox" checked={satisAcik} onChange={(e) => setSatisAcik(e.target.checked)} />
                  <i aria-hidden="true" />
                </label>
              </div>
            </section>
          </div>

          {/* ── Sağ: plan özeti ── */}
          <aside className="edu-preview-card">
            <div className="ik-preview-head">
              <p className="eyebrow">ÖZET</p>
              <strong>Plan Özeti</strong>
            </div>
            <div className="edu-preview-info">
              <div className="edu-preview-row"><span className="edu-preview-key">Plan Adı</span><span className="edu-preview-val">{planAdi || "—"}</span></div>
              <div className="edu-preview-row"><span className="edu-preview-key">Aylık Ücret</span><span className="edu-preview-val">{ucretNum.toLocaleString("tr-TR")} ₺</span></div>
              <div className="edu-preview-row"><span className="edu-preview-key">Satış</span><span className="edu-preview-val">{satisAcik ? "Açık" : "Kapalı"}</span></div>
              <div className="edu-preview-row"><span className="edu-preview-key">Durum</span><span className="edu-preview-val">{planDurumu}</span></div>
            </div>
            <div className="ik-preview-note">
              <Icon name="info" size={14} />
              <span>Aylık gelir, aktif abone sayısı ile aylık ücretin çarpımıdır.</span>
            </div>
            {error && <p style={{ margin: "0 1rem .7rem", fontSize: ".64rem", color: "#c85a51", fontWeight: 700, lineHeight: 1.45 }}>{error}</p>}
            <button className="edu-preview-save" onClick={handleSave}>Kaydet</button>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
