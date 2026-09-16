"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { AdminShell } from "../../../AdminShell";
import { useToast } from "../../../../components/ToastProvider";

type IconName = "back" | "check" | "cloud" | "unlink" | "plus" | "video" | "file" | "info";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:   <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check:  <path d="m5 12 4 4L19 6" />,
    cloud:  <><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></>,
    unlink: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /><line x1="2" y1="2" x2="22" y2="22" /></>,
    plus:   <path d="M12 5v14M5 12h14" />,
    video:  <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>,
    file:   <path d="M21.44 11.05 12 20.49a5 5 0 0 1-7.07-7.07l9.19-9.19a3.33 3.33 0 0 1 4.71 4.71l-9.2 9.19a1.67 1.67 0 0 1-2.36-2.36l8.49-8.48" />,
    info:   <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

type FileKind = "excel" | "word" | "powerpoint" | "spss" | "pdf" | "image" | "video" | "archive" | "generic";

// Dosya-tipi ikonu — sistem genelindeki FileTypeIcon/RequestFileIcon davranışı (/icons/*.png).
function FileTypeIcon({ filename }: { filename: string }) {
  const extension = filename.split(".").pop()?.toLocaleLowerCase("tr") ?? "";
  const kind: FileKind =
    ["xls", "xlsx", "csv"].includes(extension) ? "excel" :
    ["doc", "docx", "rtf"].includes(extension) ? "word" :
    ["ppt", "pptx", "pps", "ppsx"].includes(extension) ? "powerpoint" :
    ["sav", "zsav", "sps", "spv", "spo"].includes(extension) ? "spss" :
    extension === "pdf" ? "pdf" :
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension) ? "image" :
    ["mp4", "mov", "avi", "webm"].includes(extension) ? "video" :
    ["zip", "rar", "7z", "tar", "gz"].includes(extension) ? "archive" : "generic";
  const paths: Partial<Record<FileKind, string>> = {
    excel: "/icons/icons8-microsoft-excel-2019-48.png",
    word: "/icons/icons8-microsoft-word-2025-48.png",
    powerpoint: "/icons/icons8-microsoft-powerpoint-2025-48.png",
    spss: "/icons/icons8-spss-50.png",
    pdf: "/icons/icons8-pdf-48.png",
    image: "/icons/icons8-image-file-50.png",
    video: "/icons/icons8-video-48.png",
    archive: "/icons/icons8-winrar-48.png",
  };
  const path = paths[kind];
  if (path) return <span className="request-file-icon"><Image src={path} alt="" width={48} height={48} /></span>;
  return <span className="request-file-icon generic"><Icon name="file" size={23} /></span>;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;
}

function getYoutubeThumbnail(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : "";
}

type UploadedFile = { name: string; size: number };

function AddForm() {
  const [adi,       setAdi]       = useState("");
  const [aciklama,  setAciklama]  = useState("");
  const [ytInput,   setYtInput]   = useState("");
  const [videos,    setVideos]    = useState<string[]>([]);
  const [files,     setFiles]     = useState<UploadedFile[]>([]);
  const toast = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function addVideo() {
    const val = ytInput.trim();
    if (val && !videos.includes(val)) setVideos((prev) => [...prev, val]);
    setYtInput("");
  }

  function onYtKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addVideo(); }
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).map((f) => ({ name: f.name, size: f.size }));
    setFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
  }

  function handleSave() {
    toast.success("Ders kaydedildi.");
  }

  return (
    <div className="st-page">
      <header className="favorite-category-create-header">
        <Link className="back-link" href="/admin/egitim-talepleri/ders-listesi">
          <Icon name="back" size={16} />Listeye dön
        </Link>
        <h1>Ders Ekle</h1>
      </header>

      <div className="ders-form-wrap">
        {/* ── Sol: bölümler ── */}
        <div className="ders-form-col">

          <section className="detail-panel">
            <div className="detail-panel-heading">
              <p className="eyebrow">DERS BİLGİLERİ</p>
              <h2>Temel Bilgiler</h2>
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
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-panel-heading">
              <p className="eyebrow">VIDEO BAĞLANTILARI</p>
              <h2>YouTube Videoları</h2>
            </div>
            <div className="settings-panel-body">
              <div className="form-field">
                <label htmlFor="df-yt">YouTube URL Ekle</label>
                <div className="ders-yt-input-row">
                  <input id="df-yt" value={ytInput}
                    onChange={(e) => setYtInput(e.target.value)}
                    onKeyDown={onYtKey}
                    placeholder="https://www.youtube.com/watch?v=…"
                    style={{ flex: 1 }}
                  />
                  <button className="ders-yt-add" type="button" onClick={addVideo}
                    disabled={!ytInput.trim()} aria-label="Video ekle">
                    <Icon name="plus" size={16} />Ekle
                  </button>
                </div>
                {videos.length > 0 ? (
                  <div className="ders-yt-list">
                    {videos.map((url, i) => {
                      const thumb = getYoutubeThumbnail(url);
                      return (
                        <div className="ders-yt-preview-row" key={i}>
                          {thumb
                            ? <img className="ders-yt-thumb" src={thumb} alt="Video önizlemesi" />
                            : <div className="ders-yt-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon name="video" size={20} />
                              </div>}
                          <a className="ders-yt-link" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                          <button className="ders-yt-unlink" type="button" aria-label="Videoyu kaldır"
                            onClick={() => setVideos((prev) => prev.filter((_, j) => j !== i))}>
                            <Icon name="unlink" size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ders-files-empty" style={{ marginTop: ".5rem" }}>Henüz video bağlantısı eklenmedi.</div>
                )}
              </div>
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-panel-heading">
              <p className="eyebrow">DOSYALAR</p>
              <h2>Ders Dökümanları</h2>
            </div>
            <div className="settings-panel-body">
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
            </div>
          </section>

        </div>

        {/* ── Sağ: özet + yüklenen dosyalar ── */}
        <aside className="ders-summary">
          <section className="detail-panel">
            <div className="detail-panel-heading">
              <p className="eyebrow">ÖZET</p>
              <h2>Ders Özeti</h2>
            </div>
            <div className="settings-panel-body">
              <div className="ders-summary-stats">
                <div className="ders-summary-stat">
                  <span className="ders-summary-ic video"><Icon name="video" size={15} /></span>
                  <small>VIDEO</small>
                  <strong>{videos.length}</strong>
                </div>
                <div className="ders-summary-stat">
                  <span className="ders-summary-ic file"><Icon name="file" size={15} /></span>
                  <small>DOSYA</small>
                  <strong>{files.length}</strong>
                </div>
              </div>
              <div className="ders-summary-note">
                <Icon name="info" size={14} />
                <span>Dosya boyutu 10 MB sınırını aşmamalıdır.</span>
              </div>
              <button className="edu-form-save" onClick={handleSave}>Kaydet</button>
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-panel-heading">
              <p className="eyebrow">YÜKLENEN</p>
              <h2>Yüklenen Dosyalar{files.length > 0 ? ` (${files.length})` : ""}</h2>
            </div>
            <div className="settings-panel-body ders-uploaded-body">
              {files.length > 0 ? (
                <div className="request-file-list">
                  {files.map((f, i) => (
                    <div key={i}>
                      <FileTypeIcon filename={f.name} />
                      <span><strong>{f.name}</strong><small>{formatFileSize(f.size)}</small></span>
                      <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>Kaldır</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ders-files-empty">Henüz dosya eklenmedi.</div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function DersEklePage() {
  return (
    <AdminShell>
      <AddForm />
    </AdminShell>
  );
}
