"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { lessons } from "../ders-listesi/data";
import { Modul } from "./data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  stack: "M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64ZM32,192V104H224v88Z",
} as const;

export type ModuleDraft = Omit<Modul, "id">;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function lessonNames(moduleName: string) {
  return lessons.filter((lesson) => lesson.modul === moduleName).map((lesson) => lesson.adi);
}

export function ModuleEditor({
  initial,
  basePath,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: Modul;
  basePath: string;
  submitLabel: string;
  onSubmit: (value: ModuleDraft) => void;
  onDelete?: () => void;
}) {
  const [adi, setAdi] = useState(initial?.adi ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [aciklama, setAciklama] = useState(initial?.aciklama ?? "");
  const [driveUrl, setDriveUrl] = useState(initial?.driveUrl ?? "");
  const [dersler, setDersler] = useState<string[]>(initial?.dersler ?? (initial ? lessonNames(initial.adi) : []));
  const [dersInput, setDersInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const catalog = lessons.map((lesson) => lesson.adi);
  const suggestions = dersInput.trim()
    ? catalog.filter((name) => !dersler.includes(name) && name.toLocaleLowerCase("tr-TR").includes(dersInput.trim().toLocaleLowerCase("tr-TR"))).slice(0, 12)
    : [];

  function addLesson(value: string) {
    const next = value.trim();
    if (next && !dersler.includes(next)) setDersler((current) => [...current, next]);
    setDersInput("");
    inputRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adi.trim()) {
      setError("Kurs başlığı zorunludur.");
      return;
    }
    onSubmit({ adi: adi.trim(), url: url.trim(), aciklama: aciklama.trim(), driveUrl: driveUrl.trim(), dersler });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Modül listesine dön</Link>
      <form className="stype-layout" onSubmit={handleSubmit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="stack" size={18} /></span><h2>Modül</h2></header>
            <label className="stype-field"><span>Kurs başlığı</span><input value={adi} onChange={(event) => { setAdi(event.target.value); setError(""); }} placeholder="Modül adı" autoFocus /></label>
            <label className="stype-field"><span>eistatistik adresi</span><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://eistatistik.com/…" /></label>
            <label className="stype-field"><span>Kurs açıklaması</span><textarea value={aciklama} onChange={(event) => setAciklama(event.target.value)} placeholder="Modülü kısa ve net biçimde anlatın" /></label>
            <label className="stype-field"><span>Modül dökümanları</span><input value={driveUrl} onChange={(event) => setDriveUrl(event.target.value)} placeholder="https://drive.google.com/drive/folders/…" /><small>Drive klasör bağlantısı. Zorunlu değil.</small></label>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="stack" size={18} /></span><h2>Dersler</h2></header>
            <div className="stype-field">
              <span>Ders ekle</span>
              <div className="elist-modules" onClick={() => inputRef.current?.focus()}>
                {dersler.map((lesson) => (
                  <span key={lesson}>{lesson}<button type="button" aria-label={`${lesson} kaldır`} onClick={(event) => { event.stopPropagation(); setDersler((current) => current.filter((item) => item !== lesson)); }}>×</button></span>
                ))}
                <input ref={inputRef} value={dersInput} onChange={(event) => setDersInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addLesson(dersInput); } }} placeholder={dersler.length === 0 ? "Ders adı veya kodu" : ""} aria-label="Ders adı" />
              </div>
              <small>Enter ile eklenir. Listeden de seçebilirsiniz.</small>
              {suggestions.length > 0 && (
                <div className="elist-suggest">
                  {suggestions.map((lesson) => <button key={lesson} type="button" onClick={() => addLesson(lesson)}>+ {lesson}</button>)}
                </div>
              )}
            </div>
          </section>

          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onDelete && <button className="fav-delete" type="button" onClick={onDelete}>Modülü sil</button>}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card elist-preview" aria-label="Modül önizlemesi">
          <div className="elist-preview-media"><Icon name="stack" size={28} /><span>{url.trim() || "Modül"}</span></div>
          <div className="elist-preview-copy">
            <h2>{adi.trim() || "Modül adı"}</h2>
            <p>{aciklama.trim() || "Açıklama burada görünecek."}</p>
            <dl>
              <div><dt>Adres</dt><dd>{url.trim() || "—"}</dd></div>
              <div><dt>Döküman</dt><dd>{driveUrl.trim() ? "Drive bağlı" : "—"}</dd></div>
              <div><dt>Ders</dt><dd>{dersler.length}</dd></div>
            </dl>
            {url.trim() && <a href={url.trim()} target="_blank" rel="noopener noreferrer">Sayfayı aç</a>}
          </div>
        </aside>
      </form>
    </div>
  );
}
