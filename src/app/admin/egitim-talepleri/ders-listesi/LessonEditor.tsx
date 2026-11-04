"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { Ders, LessonFile, MODULE_OPTIONS } from "./data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  play: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm36.44-94.66-48-32A8,8,0,0,0,104,88v80a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32Z",
  file: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z",
} as const;

export type LessonDraft = Omit<Ders, "id">;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function thumbnail(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : "";
}

function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;
}

export function LessonEditor({
  initial,
  basePath,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: Ders;
  basePath: string;
  submitLabel: string;
  onSubmit: (value: LessonDraft) => void;
  onDelete?: () => void;
}) {
  const startingVideos = initial?.videolar?.length ? initial.videolar : initial?.youtubeUrl ? [initial.youtubeUrl] : [];
  const [adi, setAdi] = useState(initial?.adi ?? "");
  const [aciklama, setAciklama] = useState(initial?.aciklama ?? "");
  const [modul, setModul] = useState(initial?.modul ?? "");
  const [videos, setVideos] = useState<string[]>(startingVideos);
  const [ytInput, setYtInput] = useState("");
  const [files, setFiles] = useState<LessonFile[]>(initial?.dosyalar ?? []);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const moduleOptions = modul && !MODULE_OPTIONS.includes(modul) ? [modul, ...MODULE_OPTIONS] : MODULE_OPTIONS;
  const previewThumb = thumbnail(videos[0] ?? "");

  function addVideo() {
    const value = ytInput.trim();
    if (!value || videos.includes(value)) return;
    setVideos((current) => [...current, value]);
    setYtInput("");
  }

  function addFiles(list: FileList | null) {
    const picked = Array.from(list ?? []);
    const oversized = picked.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setError("Dosya boyutu 10 MB sınırını aşmamalıdır.");
      return;
    }
    setError("");
    setFiles((current) => [...current, ...picked.map((file) => ({ name: file.name, size: file.size }))]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adi.trim()) {
      setError("Ders başlığı zorunludur.");
      return;
    }
    onSubmit({
      adi: adi.trim(),
      aciklama: aciklama.trim(),
      modul,
      youtubeUrl: videos[0] ?? "",
      videolar: videos,
      dosyalar: files,
    });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Ders listesine dön</Link>
      <form className="stype-layout" onSubmit={handleSubmit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="play" size={18} /></span><h2>Ders</h2></header>
            <label className="stype-field"><span>Ders başlığı</span><input value={adi} onChange={(event) => { setAdi(event.target.value); setError(""); }} placeholder="Ders adı" autoFocus /></label>
            <label className="stype-field"><span>Açıklama</span><textarea value={aciklama} onChange={(event) => setAciklama(event.target.value)} placeholder="Dersi kısa ve net biçimde anlatın" /></label>
            <label className="stype-field">
              <span>Modül</span>
              <SystemDropdown value={modul} onChange={setModul} placeholder="Modül seçin" ariaLabel="Dersin modülü" searchable searchPlaceholder="Modül ara…" options={moduleOptions.map((item) => ({ value: item, label: item }))} />
            </label>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="play" size={18} /></span><h2>YouTube videoları</h2></header>
            <div className="stype-field">
              <span>Video adresi</span>
              <div className="llist-add">
                <input value={ytInput} onChange={(event) => setYtInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addVideo(); } }} placeholder="https://www.youtube.com/watch?v=…" aria-label="YouTube adresi" />
                <button className="stype-add" type="button" onClick={addVideo} disabled={!ytInput.trim()}>Ekle</button>
              </div>
            </div>
            {videos.length === 0 ? <p className="llist-empty">Henüz video eklenmedi.</p> : (
              <ul className="llist-videos">
                {videos.map((url) => {
                  const thumb = thumbnail(url);
                  return (
                    <li key={url}>
                      {thumb ? <Image src={thumb} alt="" width={128} height={72} unoptimized /> : <span><Icon name="play" size={18} /></span>}
                      <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                      <button type="button" aria-label="Videoyu kaldır" onClick={() => setVideos((current) => current.filter((item) => item !== url))}>×</button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="file" size={18} /></span><h2>Ders dökümanları</h2></header>
            <button className="llist-upload" type="button" onClick={() => fileRef.current?.click()}>
              Dosya seç
              <small>Birden fazla dosya seçebilirsiniz. Dosya 10 MB’ı geçmemeli.</small>
            </button>
            <input ref={fileRef} className="lesson-file-input" type="file" multiple onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} />
            {files.length === 0 ? <p className="llist-empty">Henüz dosya eklenmedi.</p> : (
              <ul className="llist-files">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`}>
                    <Icon name="file" size={16} />
                    <span><strong>{file.name}</strong><small>{fileSize(file.size)}</small></span>
                    <button type="button" aria-label={`${file.name} kaldır`} onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}>×</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onDelete && <button className="fav-delete" type="button" onClick={onDelete}>Dersi sil</button>}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card elist-preview" aria-label="Ders önizlemesi">
          <div className="elist-preview-media">
            {previewThumb ? <Image src={previewThumb} alt="" width={480} height={270} unoptimized /> : <Icon name="play" size={28} />}
          </div>
          <div className="elist-preview-copy">
            <h2>{adi.trim() || "Ders adı"}</h2>
            <p>{aciklama.trim() || "Açıklama burada görünecek."}</p>
            <dl>
              <div><dt>Modül</dt><dd>{modul || "—"}</dd></div>
              <div><dt>Video</dt><dd>{videos.length}</dd></div>
              <div><dt>Dosya</dt><dd>{files.length}</dd></div>
            </dl>
          </div>
        </aside>
      </form>
    </div>
  );
}
