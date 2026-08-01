"use client";

import Link from "next/link";
import { Suspense, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { lessons } from "../data";

type IconName = "back" | "check" | "cloud" | "unlink";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:   <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check:  <path d="m5 12 4 4L19 6" />,
    cloud:  <><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></>,
    unlink: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /><line x1="2" y1="2" x2="22" y2="22" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function getYoutubeThumbnail(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : "";
}

function EditForm() {
  const params = useSearchParams();
  const id     = parseInt(params.get("id") ?? "0");
  const base   = lessons.find((l) => l.id === id) ?? lessons[0];

  const [adi,       setAdi]       = useState(base.adi);
  const [aciklama,  setAciklama]  = useState(base.aciklama);
  const [ytUrl,     setYtUrl]     = useState(base.youtubeUrl);
  const [ytInput,   setYtInput]   = useState("");
  const [files,     setFiles]     = useState<string[]>([]);
  const [saved,     setSaved]     = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbUrl     = ytUrl ? getYoutubeThumbnail(ytUrl) : "";

  function addYtUrl() {
    const val = ytInput.trim();
    if (val) { setYtUrl(val); setYtInput(""); }
  }

  function onYtKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addYtUrl(); }
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).map((f) => f.name);
    setFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="st-page">
      <header className="orders-hero" style={{ marginBottom: "1rem" }}>
        <div>
          <p className="eyebrow">YÖNETİM · DERS LİSTESİ</p>
          <h1 style={{ fontSize: "1.2rem" }}>Ders Düzenle</h1>
        </div>
        <Link className="back-link" href="/admin/egitim-talepleri/ders-listesi">
          <Icon name="back" size={15} />Listeye dön
        </Link>
      </header>

      <section className="detail-panel">
        <div className="detail-panel-heading">
          <p className="eyebrow">DERS BİLGİLERİ</p>
          <h2>Ders Düzenle</h2>
        </div>
        <div className="settings-panel-body">

          <div className="form-field">
            <label htmlFor="df-adi">Ders Başlığı</label>
            <input id="df-adi" value={adi} onChange={(e) => setAdi(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="df-aciklama">Ders Açıklaması</label>
            <textarea id="df-aciklama" value={aciklama} rows={4}
              onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} />
          </div>

          <div className="ders-media-row">
            {/* ── YouTube bağlantısı ── */}
            <div className="form-field">
              <label htmlFor="df-yt">Bağlantı Adresi (YouTube)</label>
              <div className="ders-yt-input-row">
                <input id="df-yt" value={ytInput}
                  onChange={(e) => setYtInput(e.target.value)}
                  onKeyDown={onYtKey}
                  placeholder="https://www.youtube.com/watch?v=…"
                  disabled={!!ytUrl}
                  style={{ flex: 1 }}
                />
                <button className="ders-yt-add" type="button" onClick={addYtUrl}
                  disabled={!!ytUrl || !ytInput.trim()} aria-label="Bağlantı ekle">
                  +
                </button>
              </div>
              {ytUrl && (
                <div className="ders-yt-preview-row">
                  {thumbUrl
                    ? <img className="ders-yt-thumb" src={thumbUrl} alt="Video önizlemesi" />
                    : <div className="ders-yt-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="cloud" size={22} />
                      </div>
                  }
                  <a className="ders-yt-link" href={ytUrl} target="_blank" rel="noopener noreferrer">{ytUrl}</a>
                  <button className="ders-yt-unlink" type="button" aria-label="Bağlantıyı kaldır"
                    onClick={() => setYtUrl("")}>
                    <Icon name="unlink" size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* ── Dosya yükleme ── */}
            <div className="form-field">
              <label>Dosya Yükleme</label>
              <div className="ders-upload-zone" role="button" tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}>
                <span className="ders-upload-cloud" style={{ color: "#94aab7" }}>
                  <Icon name="cloud" size={32} />
                </span>
                <span className="ders-upload-label">Dosyaları seçmek için tıklayınız</span>
                <span className="ders-upload-hint">(Ctrl/Cmd tuşuna basılı tutarak birden fazla dosya seçebilirsiniz)</span>
                <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={handleFiles} />
              </div>
              {files.length > 0 && (
                <ul style={{ margin: ".5rem 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: ".25rem" }}>
                  {files.map((f, i) => (
                    <li key={i} style={{ fontSize: ".65rem", color: "#3f556a", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".25rem .5rem", border: "1px solid var(--line)", borderRadius: 6, background: "#f8fafb" }}>
                      <span>{f}</span>
                      <button type="button" style={{ border: 0, background: "transparent", color: "#c85a51", cursor: "pointer", fontSize: ".8rem", lineHeight: 1 }}
                        onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>×</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button className={`edu-form-save${saved ? " saved" : ""}`} onClick={handleSave}>
            {saved ? <><Icon name="check" size={16} /> Kaydedildi</> : "Kaydet"}
          </button>

        </div>
      </section>
    </div>
  );
}

export default function DersDuzenlePage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditForm />
      </Suspense>
    </AdminShell>
  );
}
