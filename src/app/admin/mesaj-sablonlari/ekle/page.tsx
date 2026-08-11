"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminShell } from "../../AdminShell";

type IconName = "back" | "check" | "save";
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:  <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    save:  <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function MesajSablonuEklePage() {
  const [baslik, setBaslik] = useState("");
  const [icerik, setIcerik] = useState("");
  const [saved,  setSaved]  = useState(false);

  const canSave = baslik.trim() && icerik.trim();

  function handleSave() {
    if (!canSave) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="st-ekle-header">
          <Link className="back-link" href="/admin/mesaj-sablonlari">
            <Icon name="back" size={16} />Mesaj Şablonlarına dön
          </Link>
          <div>
            <p className="eyebrow">YÖNETİM · MESAJ ŞABLONLARI</p>
            <h1>Yeni Mesaj Şablonu Ekle</h1>
          </div>
        </header>

        <section className="detail-panel" style={{ maxWidth: 720 }}>
          <div className="settings-panel-body">
            <div className="form-field">
              <label htmlFor="ms-baslik">Mesaj Başlığı <em>*</em></label>
              <input
                id="ms-baslik"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                placeholder="Şablon adını girin"
                autoFocus
              />
            </div>

            <div className="form-field">
              <label htmlFor="ms-icerik">
                Mesaj İçeriği <em>*</em>
                <span style={{ marginLeft: ".5rem", fontWeight: 600, color: "#9baab6", fontSize: ".8em" }}>
                  Değişkenler: {"{musteri_adi}"} {"{siparis_kodu}"} {"{tarih}"} vb.
                </span>
              </label>
              <textarea
                id="ms-icerik"
                value={icerik}
                onChange={(e) => setIcerik(e.target.value)}
                placeholder={"Sayın {musteri_adi},\n\nMesaj içeriği buraya yazılır...\n\nSaygılarımızla,\neistatistik Ekibi"}
                rows={12}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <div className="st-save-row">
              <button
                className={`st-save-btn${saved ? " saved" : ""}`}
                onClick={handleSave}
                disabled={!canSave}
              >
                {saved
                  ? <><Icon name="check" size={16} />Kaydedildi</>
                  : <><Icon name="save"  size={16} />Kaydet</>}
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
