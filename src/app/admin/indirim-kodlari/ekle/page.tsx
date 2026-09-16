"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminShell } from "../../AdminShell";
import { DatePicker } from "../../../components/DatePicker";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { useToast } from "../../../components/ToastProvider";

type IconName = "back" | "check" | "info";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:  <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    info:  <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const TIPLER = [
  { value: "percentage", label: "Yüzde" },
  { value: "amount",     label: "Tutar" },
];

export default function IndirimKoduEklePage() {
  const [kod,      setKod]      = useState("");
  const [aciklama, setAciklama] = useState("");
  const [tip,      setTip]      = useState("");
  const [tutar,    setTutar]    = useState("");
  const [limit,    setLimit]    = useState("");
  const [baslama,  setBaslama]  = useState("");
  const [bitis,    setBitis]    = useState("");
  const toast = useToast();

  const canSave = !!(aciklama && tip && tutar && limit && baslama && bitis);

  function handleSave() {
    if (!canSave) return;
    toast.success("İndirim kodu kaydedildi.");
  }

  const tipLabel   = TIPLER.find((t) => t.value === tip)?.label ?? "";
  const tutarText  = tutar ? (tip === "amount" ? `${Number(tutar).toLocaleString("tr-TR")} ₺` : `%${Number(tutar).toLocaleString("tr-TR")}`) : "—";
  const gecerlilik = baslama || bitis ? `${baslama || "—"} → ${bitis || "—"}` : "—";

  return (
    <AdminShell>
      <div className="st-page">
        <header className="favorite-category-create-header">
          <Link className="back-link" href="/admin/indirim-kodlari">
            <Icon name="back" size={16} />Listeye dön
          </Link>
          <h1>İndirim Kodu Ekle</h1>
        </header>

        <div className="edu-edit-wrap">
          {/* ── Sol: form ── */}
          <div className="edu-edit-col">
            <section className="detail-panel">
              <div className="detail-panel-heading">
                <p className="eyebrow">KUPON BİLGİLERİ</p>
                <h2>Temel Bilgiler</h2>
              </div>
              <div className="settings-panel-body">

                <div className="edu-row-2" style={{ alignItems: "start" }}>
                  <div className="form-field">
                    <label htmlFor="ik-kod">Kupon Kodu</label>
                    <input id="ik-kod" value={kod} onChange={(e) => setKod(e.target.value)}
                      placeholder="Boş bırakılırsa otomatik oluşturulur" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="ik-aciklama"><span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Kupon Açıklaması</label>
                    <textarea id="ik-aciklama" value={aciklama} rows={4}
                      onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} />
                  </div>
                </div>

                <div className="edu-row-3">
                  <div className="form-field">
                    <label htmlFor="ik-tip"><span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Tipi</label>
                    <SystemDropdown ariaLabel="İndirim tipi" placeholder="Tip Seçin" value={tip} onChange={setTip} options={TIPLER} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="ik-tutar"><span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Tutar</label>
                    <input id="ik-tutar" type="number" min="0" value={tutar} onChange={(e) => setTutar(e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="ik-limit"><span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Kullanım Limiti</label>
                    <input id="ik-limit" type="number" min="1" value={limit} onChange={(e) => setLimit(e.target.value)} />
                  </div>
                </div>

                <div className="edu-row-2">
                  <div className="form-field">
                    <label htmlFor="ik-baslama"><span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Başlama Tarihi</label>
                    <DatePicker id="ik-baslama" value={baslama} onChange={setBaslama} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="ik-bitis"><span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Bitiş Tarihi</label>
                    <DatePicker id="ik-bitis" value={bitis} onChange={setBitis} required />
                  </div>
                </div>

              </div>
            </section>
          </div>

          {/* ── Sağ: önizleme ── */}
          <aside className="edu-preview-card ik-preview">
            <div className="ik-preview-head">
              <p className="eyebrow">ÖNİZLEME</p>
              <strong>Kupon Önizleme</strong>
            </div>
            <div className="edu-preview-info">
              <div className="edu-preview-row">
                <span className="edu-preview-key">Kupon Kodu</span>
                <span className="edu-preview-val">{kod || "Otomatik"}</span>
              </div>
              <div className="edu-preview-row">
                <span className="edu-preview-key">Tipi</span>
                <span className="edu-preview-val">{tipLabel || "—"}</span>
              </div>
              <div className="edu-preview-row">
                <span className="edu-preview-key">Tutar</span>
                <span className="edu-preview-val">{tutarText}</span>
              </div>
              <div className="edu-preview-row">
                <span className="edu-preview-key">Limit</span>
                <span className="edu-preview-val">{limit || "—"}</span>
              </div>
              <div className="edu-preview-row">
                <span className="edu-preview-key">Geçerlilik</span>
                <span className="edu-preview-val">{gecerlilik}</span>
              </div>
            </div>
            <div className="ik-preview-note">
              <Icon name="info" size={14} />
              <span>Kod boş bırakılırsa sistem otomatik olarak benzersiz bir kod oluşturur.</span>
            </div>
            <button className="edu-preview-save" onClick={handleSave} disabled={!canSave}>Kaydet</button>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
