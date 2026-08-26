"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
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
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const canSave = baslik.trim() && icerik.trim();

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function insertVariable(variable: string) {
    const editor = editorRef.current;
    const start = editor?.selectionStart ?? icerik.length;
    const end = editor?.selectionEnd ?? start;
    setIcerik(`${icerik.slice(0, start)}${variable}${icerik.slice(end)}`);
    requestAnimationFrame(() => {
      editor?.focus();
      editor?.setSelectionRange(start + variable.length, start + variable.length);
    });
  }

  return (
    <AdminShell>
      <div className="st-page message-template-create-page">
        <header className="favorite-category-create-header">
          <Link className="back-link" href="/admin/mesaj-sablonlari">
            <Icon name="back" size={16} />Mesaj Şablonlarına dön
          </Link>
          <h1>Yeni Mesaj Şablonu</h1>
        </header>

        <form className="detail-panel message-template-create-form" onSubmit={handleSave}>
          <div className="detail-panel-heading">
            <div>
              <p className="eyebrow">ŞABLON BİLGİLERİ</p>
              <h2>Mesaj içeriğini oluşturun</h2>
            </div>
          </div>

          <div className="settings-panel-body">
            <div className="form-field">
              <label htmlFor="ms-baslik">Başlık <em>*</em></label>
              <input
                id="ms-baslik"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                placeholder="Mesaj şablonu başlığını girin"
                autoFocus
              />
            </div>

            <div className="form-field">
              <label htmlFor="ms-icerik">Mesaj şablonu <em>*</em></label>
              <div className="guide-editor message-template-editor">
                <div className="guide-editor-toolbar" aria-label="Mesaj değişkenleri">
                  <span>Değişken ekle</span>
                  <button type="button" onClick={() => insertVariable("{musteri_adi}")}>Müşteri adı</button>
                  <button type="button" onClick={() => insertVariable("{siparis_kodu}")}>Sipariş kodu</button>
                  <button type="button" onClick={() => insertVariable("{tarih}")}>Tarih</button>
                </div>
                <textarea
                  ref={editorRef}
                  id="ms-icerik"
                  value={icerik}
                  onChange={(e) => setIcerik(e.target.value)}
                  placeholder={"Sayın {musteri_adi},\n\nMesajınızı buraya yazın.\n\nSaygılarımızla,\neistatistik Ekibi"}
                  aria-describedby="message-template-help"
                />
              </div>
              <small id="message-template-help" className="message-template-help">
                Değişkenler, mesaj gönderilirken ilgili müşteri ve sipariş bilgileriyle otomatik olarak doldurulur.
              </small>
            </div>
          </div>

          <div className="settings-actions">
            <p className={`settings-note${saved ? " success" : ""}`} aria-live="polite">
              {saved ? "Mesaj şablonu kaydedildi." : "Başlık ve mesaj şablonu alanları zorunludur."}
            </p>
            <Link className="favorite-category-cancel" href="/admin/mesaj-sablonlari">
              <Icon name="back" size={15} />İptal
            </Link>
            <button className="settings-save" type="submit" disabled={!canSave}>
              {saved ? <><Icon name="check" size={16} />Kaydedildi</> : <><Icon name="save" size={16} />Kaydet</>}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
