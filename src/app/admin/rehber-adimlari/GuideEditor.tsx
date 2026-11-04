"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { SystemDropdown } from "../../components/SystemDropdown";
import { GuideDirection, GuideStep, GuideStepType } from "./guideData";

const TOOLS = [
  { label: "B", before: "**", after: "**", title: "Kalın" },
  { label: "I", before: "*", after: "*", title: "İtalik" },
  { label: "U", before: "<u>", after: "</u>", title: "Altı çizili" },
  { label: "≡", before: "\n- ", after: "", title: "Madde listesi" },
  { label: "1.", before: "\n1. ", after: "", title: "Numaralı liste" },
  { label: "❝", before: "\n> ", after: "", title: "Alıntı" },
  { label: "</>", before: "`", after: "`", title: "Kod" },
  { label: "↗", before: "[", after: "](https://)", title: "Bağlantı" },
];

const TYPES = [
  { value: "tour", label: "Tur adımı" },
  { value: "modal", label: "Modal" },
];

const DIRECTIONS = [
  { value: "bottom", label: "Alt" },
  { value: "top", label: "Üst" },
  { value: "left", label: "Sol" },
  { value: "right", label: "Sağ" },
];

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  map: "M228.92,49.69a8,8,0,0,0-6.86-1.45L160.93,63.18,99.58,32.25a8,8,0,0,0-5.16,0L28.92,54.25A8,8,0,0,0,24,62V200a8,8,0,0,0,11.06,7.37l61.13-22.36,61.35,30.93a8.06,8.06,0,0,0,5.16,0l65.5-22a8,8,0,0,0,5.8-7.69V56A8,8,0,0,0,228.92,49.69ZM96,48.81l48,24.2V207.19l-48-24.2ZM40,66.25l40-13.48V178.64L40,192.12Zm176,123.5-40,13.48V78.36l40-13.48Z",
  image: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z",
} as const;

export type GuideDraft = {
  title: string;
  content: string;
  serviceCodes: string;
  target: string;
  type: GuideStepType;
  direction: GuideDirection;
  position: number;
  active: boolean;
  imageNames: string[];
};

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`role-switch${checked ? " on" : ""}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

export function GuideEditor({
  initial,
  basePath,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: GuideStep;
  basePath: string;
  submitLabel: string;
  onSubmit: (value: GuideDraft) => void;
  onDelete?: () => void;
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [position, setPosition] = useState(String(initial?.position ?? 1));
  const [serviceCodes, setServiceCodes] = useState(initial?.serviceCodes ?? "");
  const [type, setType] = useState<GuideStepType>(initial?.type ?? "tour");
  const [target, setTarget] = useState(initial?.target ?? "");
  const [direction, setDirection] = useState<GuideDirection>(initial?.direction ?? "bottom");
  const [imageNames, setImageNames] = useState<string[]>(initial?.imageNames ?? []);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const typeLabel = TYPES.find((item) => item.value === type)?.label ?? "Tur adımı";
  const directionLabel = DIRECTIONS.find((item) => item.value === direction)?.label ?? "Alt";

  function wrap(tool: (typeof TOOLS)[number]) {
    const field = editorRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = content.slice(start, end);
    setContent(content.slice(0, start) + tool.before + selected + tool.after + content.slice(end));
    setError("");
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start + tool.before.length, end + tool.before.length);
    });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted = Array.from(list).filter((file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type)).map((file) => file.name);
    setImageNames((current) => [...current, ...accepted].slice(0, 8));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanPosition = Number.parseInt(position, 10);
    if (!title.trim()) {
      setError("Adım başlığı zorunludur.");
      return;
    }
    if (!content.trim()) {
      setError("Rehber içeriğini yazın.");
      return;
    }
    if (!Number.isFinite(cleanPosition) || cleanPosition < 1) {
      setError("Sıra değeri 1 veya daha büyük olmalıdır.");
      return;
    }
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      serviceCodes: serviceCodes.trim().toUpperCase(),
      target: target.trim(),
      type,
      direction,
      position: cleanPosition,
      active,
      imageNames,
    });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Rehber adımlarına dön</Link>
      <form className="stype-layout" onSubmit={submit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="map" /></span><h2>Adım</h2></header>
            <label className="stype-field">
              <span>Adım başlığı</span>
              <input value={title} onChange={(event) => { setTitle(event.target.value); setError(""); }} placeholder="Adım başlığını girin" autoFocus />
            </label>
            <label className="stype-field">
              <span>İçerik</span>
              <div className="guide-tools" role="toolbar" aria-label="Metin biçimlendirme">
                {TOOLS.map((tool) => <button key={tool.title} type="button" title={tool.title} aria-label={tool.title} onClick={() => wrap(tool)}>{tool.label}</button>)}
              </div>
              <textarea ref={editorRef} className="guide-body" value={content} onChange={(event) => { setContent(event.target.value); setError(""); }} placeholder="Kullanıcıya bu adımda gösterilecek açıklamayı yazın…" />
            </label>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="image" /></span><h2>Görseller</h2></header>
            <input ref={fileRef} className="lesson-file-input" hidden type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} />
            <button className="llist-upload" type="button" onClick={() => fileRef.current?.click()}>
              Görsel seçin
              <small>PNG, JPG veya WEBP · En fazla 8 görsel</small>
            </button>
            {imageNames.length > 0 && (
              <ul className="llist-files">
                {imageNames.map((name, index) => (
                  <li key={`${name}-${index}`}>
                    <Icon name="image" size={18} />
                    <span><strong>{name}</strong></span>
                    <button type="button" aria-label={`${name} görselini kaldır`} onClick={() => setImageNames((current) => current.filter((_, itemIndex) => itemIndex !== index))}>×</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="fav-card stype-section">
            <header><h2>Yayın ve hedef</h2></header>
            <div className="role-option">
              <span><strong>Aktif</strong><small>Adım kullanıcıya gösterilir.</small></span>
              <Switch checked={active} label="Adım durumu" onChange={setActive} />
            </div>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Sıra</span>
                <input value={position} onChange={(event) => { setPosition(event.target.value); setError(""); }} type="number" min="1" />
              </label>
              <label className="stype-field">
                <span>İş türü kodu</span>
                <input value={serviceCodes} onChange={(event) => setServiceCodes(event.target.value)} placeholder="Örn: SA, PR, DS — boş = tümü" />
                <small>Boş bırakılırsa tüm iş türleri için gösterilir.</small>
              </label>
            </div>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Tür</span>
                <SystemDropdown value={type} onChange={(value) => setType(value as GuideStepType)} ariaLabel="Rehber adımı türü" options={TYPES} />
              </label>
              <label className="stype-field">
                <span>Yön</span>
                <SystemDropdown value={direction} onChange={(value) => setDirection(value as GuideDirection)} ariaLabel="Rehber adımı yönü" options={DIRECTIONS} />
              </label>
            </div>
            <label className="stype-field">
              <span>Hedef element</span>
              <input value={target} onChange={(event) => setTarget(event.target.value)} placeholder="Örn: #first, .jn-field" />
              <small>Boş bırakılırsa ekrana bağlı bir karşılama adımı olur.</small>
            </label>
          </section>

          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onDelete && (confirming ? (
              <>
                <p>Bu işlem geri alınamaz.</p>
                <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
                <button className="fav-delete" type="button" onClick={onDelete}>Evet, sil</button>
              </>
            ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>Adımı sil</button>)}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card acct-summary" aria-label="Rehber adımı özeti">
          <header><span className="fav-mark"><Icon name="map" /></span><h2>Özet</h2></header>
          <span className={`stype-status ${active ? "aktif" : "pasif"}`}>{active ? "Aktif" : "Pasif"}</span>
          <p className="acct-figure">{position.trim() || "—"}</p>
          <dl className="acct-rows">
            <div><dt>Başlık</dt><dd className="wrap">{title.trim() || "Adım başlığı"}</dd></div>
            <div><dt>Tür</dt><dd>{typeLabel}</dd></div>
            <div><dt>Yön</dt><dd>{directionLabel}</dd></div>
            <div><dt>Hedef</dt><dd className="wrap">{target.trim() || "Ekrana bağlı"}</dd></div>
            <div><dt>İş türü</dt><dd>{serviceCodes.trim().toUpperCase() || "Tüm hizmetler"}</dd></div>
            <div><dt>Görsel</dt><dd>{imageNames.length}</dd></div>
          </dl>
          <p className="tm-bubble">{content.trim() || "İçerik burada görünecek."}</p>
        </aside>
      </form>
    </div>
  );
}
