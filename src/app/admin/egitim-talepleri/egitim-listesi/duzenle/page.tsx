"use client";

import Link from "next/link";
import { Suspense, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { trainings, EgitimTur, EsnekKota, EgitimDurum, Sertifika } from "../data";
import { DatePicker } from "../../../../components/DatePicker";

type IconName = "back" | "check";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:  <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const AVAILABLE_MODULES = [
  "MODÜL 1", "MODÜL 2", "MODÜL 3", "MODÜL 4", "MODÜL 5",
  "MODÜL 6", "MODÜL 7", "MODÜL 8", "MODÜL 12", "MODÜL 14", "MODÜL 15",
  "MENTÖRLÜK", "ÖZEL",
];

function EditForm() {
  const params = useSearchParams();
  const id     = parseInt(params.get("id") ?? "0");
  const base   = trainings.find((t) => t.id === id) ?? trainings[0];

  const [adi,          setAdi]          = useState(base.adi);
  const [aciklama,     setAciklama]     = useState(base.aciklama);
  const [eiUrl,        setEiUrl]        = useState(base.eiUrl);
  const [canliUrl,     setCanliUrl]     = useState(base.canliUrl);
  const [imgFile,      setImgFile]      = useState("");
  const [ucret,        setUcret]        = useState(String(base.ucret));
  const [baslama,      setBaslama]      = useState(base.baslama);
  const [bitis,        setBitis]        = useState(base.bitis);
  const [kota,         setKota]         = useState(String(base.kota));
  const [esnekKota,    setEsnekKota]    = useState<EsnekKota>(base.esnekKota);
  const [moduller,     setModuller]     = useState<string[]>(base.moduller);
  const [modulInput,   setModulInput]   = useState("");
  const [tur,          setTur]          = useState<EgitimTur>(base.tur);
  const [erisimZamani, setErisimZamani] = useState(String(base.erisimZamani));
  const [durum,        setDurum]        = useState<EgitimDurum>(base.durum);
  const [sertifika,    setSertifika]    = useState<Sertifika>(base.sertifika);
  const [saved,        setSaved]        = useState(false);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const modulInputRef = useRef<HTMLInputElement>(null);

  function addModul(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const val = modulInput.trim().toUpperCase();
    if (val && !moduller.includes(val)) setModuller((m) => [...m, val]);
    setModulInput("");
  }

  function addModulFromList(m: string) {
    if (!moduller.includes(m)) setModuller((prev) => [...prev, m]);
  }

  function removeModul(m: string) {
    setModuller((prev) => prev.filter((x) => x !== m));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const suggestedModules = AVAILABLE_MODULES.filter(
    (m) => !moduller.includes(m) && m.toLowerCase().includes(modulInput.toLowerCase()),
  );

  return (
    <div className="st-page">
      <header className="orders-hero" style={{ marginBottom: "1rem" }}>
        <div>
          <p className="eyebrow">YÖNETİM · EĞİTİM LİSTESİ</p>
          <h1 style={{ fontSize: "1.2rem" }}>Eğitim Düzenle</h1>
        </div>
        <Link className="back-link" href="/admin/egitim-talepleri/egitim-listesi">
          <Icon name="back" size={15} />Listeye dön
        </Link>
      </header>

      <div className="edu-edit-wrap">
        {/* ── Sol: Form ── */}
        <div className="edu-edit-col">
          <section className="detail-panel">
            <div className="detail-panel-heading">
              <p className="eyebrow">EĞİTİM BİLGİLERİ</p>
              <h2>Temel Bilgiler</h2>
            </div>
            <div className="settings-panel-body">

              <div className="form-field">
                <label htmlFor="ef-adi">Eğitim Adı</label>
                <input id="ef-adi" value={adi} onChange={(e) => setAdi(e.target.value)} />
              </div>

              <div className="edu-row-3">
                <div className="form-field">
                  <label htmlFor="ef-eiurl">Eğitim eistatistik URL</label>
                  <input id="ef-eiurl" value={eiUrl} onChange={(e) => setEiUrl(e.target.value)} placeholder="https://eistatistik.com/…" />
                </div>
                <div className="form-field">
                  <label htmlFor="ef-canli">Canlı Yayın URL</label>
                  <input id="ef-canli" value={canliUrl} onChange={(e) => setCanliUrl(e.target.value)} placeholder="https://…" />
                </div>
                <div className="form-field">
                  <label>Eğitim Resmi (900x500)</label>
                  <div className="edu-file-wrap clickable-upload" role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInputRef.current?.click(); } }}>
                    <button className="edu-file-btn" type="button" tabIndex={-1}>
                      Dosya Seç
                    </button>
                    <span className="edu-file-name">{imgFile || "Dosya seçilmedi"}</span>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                      onChange={(e) => setImgFile(e.target.files?.[0]?.name ?? "")} />
                  </div>
                </div>
              </div>

              <div className="edu-row-2">
                <div className="form-field">
                  <label htmlFor="ef-aciklama">Açıklama</label>
                  <textarea id="ef-aciklama" value={aciklama} rows={4}
                    onChange={(e) => setAciklama(e.target.value)}
                    style={{ resize: "vertical" }} />
                </div>
                <div className="form-field">
                  <label htmlFor="ef-ucret">Ücret</label>
                  <input id="ef-ucret" type="number" min="0" value={ucret}
                    onChange={(e) => setUcret(e.target.value)} />
                </div>
              </div>

              <div className="edu-row-2">
                <div className="form-field">
                  <label htmlFor="ef-baslama">Başlangıç Tarihi</label>
                  <DatePicker id="ef-baslama" value={baslama} onChange={setBaslama} />
                </div>
                <div className="form-field">
                  <label htmlFor="ef-bitis">Bitiş Tarihi</label>
                  <DatePicker id="ef-bitis" value={bitis} onChange={setBitis} />
                </div>
              </div>

              <div className="edu-row-2">
                <div className="form-field">
                  <label htmlFor="ef-kota">Kota</label>
                  <input id="ef-kota" type="number" min="1" value={kota} onChange={(e) => setKota(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="ef-esnek">Kota Esnekliği</label>
                  <select id="ef-esnek" value={esnekKota} onChange={(e) => setEsnekKota(e.target.value as EsnekKota)}>
                    <option value="Esnek Değil">Esnek Değil</option>
                    <option value="Esnek">Esnek</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Modüller <span style={{ fontWeight: 600, color: "#9baab6", fontSize: ".82em" }}>(Enter ile ekle)</span></label>
                <div className="edu-modules-wrap" onClick={() => modulInputRef.current?.focus()}>
                  {moduller.map((m) => (
                    <span key={m} className="edu-module-chip">
                      {m}
                      <button type="button" aria-label={`${m} kaldır`} onClick={(e) => { e.stopPropagation(); removeModul(m); }}>
                        ×
                      </button>
                    </span>
                  ))}
                  <input ref={modulInputRef} className="edu-modules-input"
                    value={modulInput}
                    onChange={(e) => setModulInput(e.target.value.toUpperCase())}
                    onKeyDown={addModul}
                    placeholder={moduller.length === 0 ? "Modül adı girin…" : ""}
                  />
                </div>
                {modulInput && suggestedModules.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginTop: ".4rem" }}>
                    {suggestedModules.map((m) => (
                      <button key={m} type="button"
                        style={{ padding: ".15rem .5rem", border: "1px solid var(--line)", borderRadius: 5, background: "#f5f8f9", color: "#3f556a", font: "inherit", fontSize: ".6rem", fontWeight: 800, cursor: "pointer" }}
                        onClick={() => { addModulFromList(m); setModulInput(""); modulInputRef.current?.focus(); }}>
                        + {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="edu-row-4">
                <div className="form-field">
                  <label htmlFor="ef-tur">Tür</label>
                  <select id="ef-tur" value={tur} onChange={(e) => setTur(e.target.value as EgitimTur)}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="ef-erisim">Erişim Zamanı (Ay)</label>
                  <input id="ef-erisim" type="number" min="1" value={erisimZamani}
                    onChange={(e) => setErisimZamani(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="ef-durum">Yayın Durumu</label>
                  <select id="ef-durum" value={durum} onChange={(e) => setDurum(e.target.value as EgitimDurum)}>
                    <option value="Aktif">Aktif</option>
                    <option value="Pasif">Pasif</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="ef-sertifika">Sertifikalı mı?</label>
                  <select id="ef-sertifika" value={sertifika} onChange={(e) => setSertifika(e.target.value as Sertifika)}>
                    <option value="Sertifikasız">Sertifikasız</option>
                    <option value="Sertifikalı">Sertifikalı</option>
                  </select>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* ── Sağ: Önizleme + Kaydet ── */}
        <div className="edu-preview-card">
          <div className="edu-preview-img">
            <span>900 × 500</span>
          </div>
          <div className="edu-preview-info">
            <div className="edu-preview-row">
              <span className="edu-preview-key">Eğitim Adı:</span>
              <span className="edu-preview-val">{adi || "—"}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Açıklaması:</span>
              <span className="edu-preview-val">{aciklama || "—"}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Ücreti:</span>
              <span className="edu-preview-val">{ucret ? `${Number(ucret).toLocaleString("tr-TR")}.0` : "—"}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Başlangıç - Bitiş:</span>
              <span className="edu-preview-val">{baslama} / {bitis}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Kota:</span>
              <span className="edu-preview-val">{kota || "—"}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Kota Esnekliği:</span>
              <span className="edu-preview-val">{esnekKota}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Yayın Durumu:</span>
              <span className="edu-preview-val">{durum}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Modüller:</span>
              <span className="edu-preview-val">{moduller.join(" · ") || "—"}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">İçeriğe Erişim (Ay):</span>
              <span className="edu-preview-val">{erisimZamani || "—"}</span>
            </div>
            <div className="edu-preview-row">
              <span className="edu-preview-key">Sertifika:</span>
              <span className="edu-preview-val">{sertifika}</span>
            </div>
          </div>
          <button className={`edu-preview-save${saved ? " saved" : ""}`} onClick={handleSave}>
            {saved ? <><Icon name="check" size={16} /> Kaydedildi</> : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EgitimDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditForm />
      </Suspense>
    </AdminShell>
  );
}
