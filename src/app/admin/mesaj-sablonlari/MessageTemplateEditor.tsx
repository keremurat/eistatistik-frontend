"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { MESSAGE_VARIABLES, MessageTemplate, previewMessage } from "./messageTemplateData";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  envelope: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function MessageTemplateEditor({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: MessageTemplate;
  submitLabel: string;
  onSubmit: (value: Omit<MessageTemplate, "id">) => void;
  onDelete?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [error, setError] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewTitle = title.trim() || "Mesaj başlığı";
  const preview = body.trim() ? previewMessage(body) : "Mesaj metni burada, örnek değerlerle görünecek.";

  function insertVariable(token: string) {
    const editor = editorRef.current;
    const start = editor?.selectionStart ?? body.length;
    const end = editor?.selectionEnd ?? start;
    setBody(`${body.slice(0, start)}${token}${body.slice(end)}`);
    setError("");
    requestAnimationFrame(() => {
      editor?.focus();
      editor?.setSelectionRange(start + token.length, start + token.length);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (!cleanTitle || !cleanBody) {
      setError("Başlık ve mesaj zorunludur.");
      return;
    }
    onSubmit({ title: cleanTitle, body });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href="/admin/mesaj-sablonlari"><Icon name="back" size={16} />Mesaj şablonlarına dön</Link>
      <form className="stype-layout" onSubmit={handleSubmit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="envelope" size={18} /></span><h2>Şablon</h2></header>
            <label className="stype-field">
              <span>Başlık</span>
              <input value={title} onChange={(event) => { setTitle(event.target.value); setError(""); }} placeholder="Mesaj şablonu başlığı" autoFocus />
            </label>
            <div className="stype-field">
              <span>Mesaj</span>
              <div className="mtpl-vars" aria-label="Mesaj değişkenleri">
                {MESSAGE_VARIABLES.map((variable) => (
                  <button key={variable.token} type="button" onClick={() => insertVariable(variable.token)}>{variable.label}</button>
                ))}
              </div>
              <textarea
                ref={editorRef}
                className="mtpl-body"
                value={body}
                onChange={(event) => { setBody(event.target.value); setError(""); }}
                placeholder={"Sayın {musteri_adi},\n\nMesajınızı buraya yazın.\n\nSaygılarımızla,\neistatistik Ekibi"}
              />
              <small>Değişkenler, mesaj gönderilirken müşteri ve sipariş bilgileriyle doldurulur.</small>
            </div>
          </section>

          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onDelete && <button className="fav-delete" type="button" onClick={onDelete}>Şablonu sil</button>}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card mtpl-preview" aria-label="Mesaj önizlemesi">
          <header><span className="fav-mark"><Icon name="envelope" size={18} /></span><h2>Önizleme</h2></header>
          <strong>{previewTitle}</strong>
          <p>{preview}</p>
          <small>Örnek değerlerle doldurulmuş hali. Gönderimde gerçek bilgiler yazılır.</small>
        </aside>
      </form>
    </div>
  );
}
