"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { GuideDirection, GuideStepType, readGuideSteps, writeGuideSteps } from "../guideData";

type Tool = { label: string; before: string; after: string; title: string };
const tools: Tool[] = [
  { label: "B", before: "**", after: "**", title: "Kalın" },
  { label: "I", before: "*", after: "*", title: "İtalik" },
  { label: "U", before: "<u>", after: "</u>", title: "Altı çizili" },
  { label: "≡", before: "\n- ", after: "", title: "Madde listesi" },
  { label: "1.", before: "\n1. ", after: "", title: "Numaralı liste" },
  { label: "❝", before: "\n> ", after: "", title: "Alıntı" },
  { label: "</>", before: "`", after: "`", title: "Kod" },
  { label: "↗", before: "[", after: "](https://)", title: "Bağlantı" },
];

function Icon({ name, size = 18 }: { name: "back" | "upload" | "x" | "save"; size?: number }) {
  const paths = {
    back: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
    upload: <><path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></>,
    x: <path d="m6 6 12 12M18 6 6 18"/>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AddGuideStepPage() {
  const router = useRouter();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [active, setActive] = useState(true);
  const [position, setPosition] = useState("1");
  const [serviceCodes, setServiceCodes] = useState("");
  const [type, setType] = useState<GuideStepType>("tour");
  const [target, setTarget] = useState("");
  const [direction, setDirection] = useState<GuideDirection>("bottom");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  function wrap(tool: Tool) {
    const field = editorRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = content.slice(start, end);
    setContent(content.slice(0, start) + tool.before + selected + tool.after + content.slice(end));
    requestAnimationFrame(() => { field.focus(); field.setSelectionRange(start + tool.before.length, end + tool.before.length); });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted = Array.from(list).filter(file => ["image/png", "image/jpeg", "image/webp"].includes(file.type));
    setFiles(current => [...current, ...accepted].slice(0, 8));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const cleanPosition = Number.parseInt(position, 10);
    if (!title.trim()) { setError("Adım başlığı zorunludur."); return; }
    if (!content.trim()) { setError("Rehber içeriğini yazın."); return; }
    if (!Number.isFinite(cleanPosition) || cleanPosition < 1) { setError("Sıra değeri 1 veya daha büyük olmalıdır."); return; }
    const current = readGuideSteps();
    writeGuideSteps([...current, { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), serviceCodes: serviceCodes.trim().toUpperCase(), target: target.trim(), type, direction, position: cleanPosition, active, imageNames: files.map(file => file.name) }]);
    router.push("/admin/rehber-adimlari");
  }

  return <AdminShell><div className="st-page guide-create-page">
    <header className="guide-create-header"><Link className="back-link" href="/admin/rehber-adimlari"><Icon name="back" size={16}/>Rehber adımlarına dön</Link><h1>Yeni Rehber Adımı</h1></header>
    <form className="guide-form-layout" onSubmit={submit}>
      <main className="guide-form-main">
        <section className="detail-panel guide-form-section"><div className="settings-panel-body"><div className="form-field"><label htmlFor="guide-title">Adım başlığı <em>*</em></label><input id="guide-title" value={title} onChange={event => { setTitle(event.target.value); setError(""); }} placeholder="Adım başlığını girin" autoFocus/></div></div></section>
        <section className="detail-panel guide-form-section"><div className="settings-panel-body"><div className="form-field"><label htmlFor="guide-content">İçerik <em>*</em></label><div className="guide-editor"><div className="guide-editor-toolbar" role="toolbar" aria-label="Metin biçimlendirme"><span>Metin</span>{tools.map(tool => <button key={tool.title} type="button" title={tool.title} aria-label={tool.title} onClick={() => wrap(tool)}>{tool.label}</button>)}</div><textarea ref={editorRef} id="guide-content" value={content} onChange={event => { setContent(event.target.value); setError(""); }} placeholder="Kullanıcıya bu adımda gösterilecek açıklamayı yazın…"/></div></div></div></section>
        <section className="detail-panel guide-form-section"><div className="settings-panel-body"><div className="form-field"><label>Görseller</label><input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={event => addFiles(event.target.files)}/><div className="guide-upload-zone" role="button" tabIndex={0} onClick={() => fileRef.current?.click()} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") fileRef.current?.click(); }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); addFiles(event.dataTransfer.files); }}><Icon name="upload" size={23}/><strong>Görsel seçin veya buraya sürükleyin</strong><span>PNG, JPG veya WEBP · En fazla 8 görsel</span></div>{files.length > 0 && <ul className="guide-file-list">{files.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name}</span><small>{Math.ceil(file.size / 1024)} KB</small><button type="button" aria-label={`${file.name} görselini kaldır`} onClick={() => setFiles(current => current.filter((_, itemIndex) => itemIndex !== index))}><Icon name="x" size={14}/></button></li>)}</ul>}</div></div></section>
      </main>
      <aside className="guide-form-aside">
        <section className="detail-panel guide-actions"><button className="settings-save" type="submit"><Icon name="save" size={16}/>Kaydet</button><Link href="/admin/rehber-adimlari">İptal</Link>{error && <p className="settings-note error" role="alert">{error}</p>}</section>
        <section className="detail-panel guide-side-section"><div className="detail-panel-heading"><div><p className="eyebrow">DURUM VE SIRA</p><h2>Yayın ayarları</h2></div></div><div className="settings-panel-body"><label className="guide-toggle"><span><strong>Aktif</strong><small>Adım kullanıcıya gösterilir</small></span><input type="checkbox" checked={active} onChange={event => setActive(event.target.checked)}/><i aria-hidden="true"/></label><div className="form-field"><label htmlFor="guide-position">Sıra</label><input id="guide-position" type="number" min="1" value={position} onChange={event => setPosition(event.target.value)}/></div></div></section>
        <section className="detail-panel guide-side-section"><div className="detail-panel-heading"><div><p className="eyebrow">HEDEFLEME</p><h2>Gösterim koşulları</h2></div></div><div className="settings-panel-body guide-target-fields"><div className="form-field"><label htmlFor="guide-codes">İş türü kodu</label><input id="guide-codes" value={serviceCodes} onChange={event => setServiceCodes(event.target.value)} placeholder="SA, PR, DS"/><small>Boş bırakılırsa tüm iş türlerinde gösterilir.</small></div><div className="form-field"><label>Tür</label><SystemDropdown value={type} onChange={value => setType(value as GuideStepType)} ariaLabel="Rehber adımı türü" options={[{value:"tour",label:"Tur adımı"},{value:"modal",label:"Modal"}]}/></div><div className="form-field"><label htmlFor="guide-target">Hedef element</label><input id="guide-target" value={target} onChange={event => setTarget(event.target.value)} placeholder="#first, .form-field"/><small>Boşsa ekranın merkezinde gösterilir.</small></div><div className="form-field"><label>Yön</label><SystemDropdown value={direction} onChange={value => setDirection(value as GuideDirection)} ariaLabel="Rehber adımı yönü" options={[{value:"bottom",label:"Alt"},{value:"top",label:"Üst"},{value:"left",label:"Sol"},{value:"right",label:"Sağ"}]}/></div></div></section>
      </aside>
    </form>
  </div></AdminShell>;
}
