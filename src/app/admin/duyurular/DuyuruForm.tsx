"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../AdminShell";
import { DatePicker } from "../../components/DatePicker";
import { SystemDropdown } from "../../components/SystemDropdown";
import { TimePicker } from "../../components/TimePicker";
import { useToast } from "../../components/ToastProvider";
import { Duyuru, DuyuruDurum, readAnnouncements, writeAnnouncements } from "./data";

const TOOLS: { label: string; title: string; wrap: [string, string] }[] = [
  { label: "B", title: "Kalın", wrap: ["**", "**"] },
  { label: "I", title: "İtalik", wrap: ["*", "*"] },
  { label: "H", title: "Başlık", wrap: ["## ", ""] },
  { label: "❝", title: "Alıntı", wrap: ["> ", ""] },
  { label: "≡", title: "Liste", wrap: ["- ", ""] },
  { label: "1.", title: "Numaralı", wrap: ["1. ", ""] },
  { label: "☐", title: "Görev", wrap: ["- [ ] ", ""] },
  { label: "↗", title: "Bağlantı", wrap: ["[", "](url)"] },
  { label: "▣", title: "Resim", wrap: ["![alt](", ")"] },
];

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  megaphone: "M248,120a48.05,48.05,0,0,0-40-47.32V72a8,8,0,0,0-8-8H160.2a4,4,0,0,1-3.2-1.6l-23.48-31.3A16,16,0,0,0,120.45,24H72A16,16,0,0,0,56,40V80H32a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16H56v8a32,32,0,0,0,32,32h8a8,8,0,0,0,8-8V176h16.45a16,16,0,0,0,13.07-6.79l23.48-31.3a4,4,0,0,1,3.2-1.6H200a8,8,0,0,0,8-8v-.68A48.05,48.05,0,0,0,248,120ZM72,40h48.45l16.8,22.4A8,8,0,0,0,143.73,66H72ZM88,192H88a16,16,0,0,1-16-16v-8h16Zm120-72H143.73a8,8,0,0,0-6.48,3.31L113.45,160H32V96H200Zm32-8a32,32,0,0,1-16,27.71V92.29A32,32,0,0,1,240,112Z",
} as const;

type Props = {
  mode: "ekle" | "duzenle";
  initial?: Partial<Duyuru>;
  basePath?: string;
  embedded?: boolean;
};

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function todayStamp() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
}

function nowStamp() {
  const now = new Date();
  return `${todayStamp()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function DuyuruForm({ mode, initial = {}, basePath = "/admin/duyurular", embedded = false }: Props) {
  const router = useRouter();
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [baslik, setBaslik] = useState(initial.baslik ?? "");
  const [yayinTarih, setYayinTarih] = useState(initial.yayinTarihi?.split(" ")[0] || todayStamp());
  const [yayinSaat, setYayinSaat] = useState(initial.yayinTarihi?.split(" ")[1] || "09:00");
  const [durum, setDurum] = useState<DuyuruDurum>(initial.durum ?? "Pasif");
  const [modal, setModal] = useState(initial.modalGoster ?? false);
  const [icerik, setIcerik] = useState(initial.icerik ?? "");
  const [gorsel, setGorsel] = useState<string | null>(initial.gorsel ?? null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const wordCount = icerik.trim() ? icerik.trim().split(/\s+/).length : 0;
  const lineCount = icerik ? icerik.split("\n").length : 1;

  function insertWrap(before: string, after: string) {
    const field = textareaRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = icerik.slice(start, end);
    setIcerik(icerik.slice(0, start) + before + selected + after + icerik.slice(end));
    setError("");
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start + before.length, end + before.length);
    });
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!baslik.trim()) {
      setError("Duyuru başlığı boş bırakılamaz.");
      return;
    }
    if (!icerik.trim()) {
      setError("Duyuru içeriği boş bırakılamaz.");
      return;
    }
    const current = readAnnouncements();
    const record: Duyuru = {
      id: initial.id ?? Math.max(0, ...current.map((item) => item.id)) + 1,
      baslik: baslik.trim(),
      icerik: icerik.trim(),
      eklemeTarihi: initial.eklemeTarihi ?? nowStamp(),
      yayinTarihi: `${yayinTarih} ${yayinSaat}`.trim(),
      durum,
      modalGoster: modal,
      gorsel: gorsel || undefined,
    };
    const next = initial.id
      ? current.map((item) => item.id === initial.id ? record : item)
      : [record, ...current];
    writeAnnouncements(next);
    toast.success(mode === "duzenle" ? "Duyuru güncellendi." : "Duyuru oluşturuldu.");
    router.push(basePath);
  }

  function remove() {
    if (!initial.id) return;
    writeAnnouncements(readAnnouncements().filter((item) => item.id !== initial.id));
    toast.success("Duyuru silindi.");
    router.push(basePath);
  }

  const content = (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Duyuru listesine dön</Link>
      <form className="stype-layout" onSubmit={save}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="megaphone" /></span><h2>Temel bilgiler</h2></header>
            <label className="stype-field">
              <span>Duyuru başlığı</span>
              <input value={baslik} onChange={(event) => { setBaslik(event.target.value); setError(""); }} placeholder="Duyuru başlığını girin" autoFocus />
            </label>
            <label className="stype-field">
              <span>Yayın tarihi</span>
              <div className="appt-when">
                <DatePicker id="d-tarih" value={yayinTarih} onChange={setYayinTarih} />
                <TimePicker id="d-saat" value={yayinSaat} onChange={setYayinSaat} />
              </div>
            </label>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Durumu</span>
                <SystemDropdown value={durum} onChange={(value) => setDurum(value as DuyuruDurum)} ariaLabel="Duyuru durumu" options={[{ value: "Pasif", label: "Pasif" }, { value: "Aktif", label: "Aktif" }]} />
              </label>
              <label className="stype-field">
                <span>Ekranda gösterilsin mi?</span>
                <SystemDropdown value={modal ? "evet" : "hayir"} onChange={(value) => setModal(value === "evet")} ariaLabel="Modal gösterimi" options={[{ value: "hayir", label: "Hayır" }, { value: "evet", label: "Evet" }]} />
              </label>
            </div>
          </section>

          <section className="fav-card stype-section">
            <header><h2>İçerik</h2></header>
            <label className="stype-field">
              <span>Duyuru içeriği</span>
              <div className="guide-tools" role="toolbar" aria-label="Metin biçimlendirme">
                {TOOLS.map((tool) => (
                  <button key={tool.title} type="button" title={tool.title} aria-label={tool.title} onClick={() => insertWrap(tool.wrap[0], tool.wrap[1])}>{tool.label}</button>
                ))}
              </div>
              <textarea ref={textareaRef} className="guide-body ann-body" value={icerik} onChange={(event) => { setIcerik(event.target.value); setError(""); }} placeholder="Duyuru içeriğini buraya yazın… (Markdown desteklenir)" />
              <small>{lineCount} satır · {wordCount} kelime</small>
            </label>
          </section>

          <section className="fav-card stype-section">
            <header><h2>Arka plan resmi</h2></header>
            <input ref={fileRef} hidden type="file" accept="image/*" onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setGorsel(String(reader.result || ""));
              reader.readAsDataURL(file);
            }} />
            {gorsel ? (
              <div className="ann-upload">
                <img src={gorsel} alt="Arka plan" />
                <button type="button" onClick={() => setGorsel(null)}>Kaldır</button>
              </div>
            ) : (
              <button className="llist-upload" type="button" onClick={() => fileRef.current?.click()}>
                Resim seçmek için tıklayınız
                <small>Duyuru kartının arka planı.</small>
              </button>
            )}
          </section>

          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {mode === "duzenle" && initial.id && (confirming ? (
              <>
                <p>Bu işlem geri alınamaz.</p>
                <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
                <button className="fav-delete" type="button" onClick={remove}>Evet, sil</button>
              </>
            ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>Duyuruyu sil</button>)}
            <button className="fav-save" type="submit">Kaydet</button>
          </div>
        </div>

        <aside className="fav-card acct-summary" aria-label="Duyuru özeti">
          <header><span className="fav-mark"><Icon name="megaphone" /></span><h2>Duyuru özeti</h2></header>
          <span className={`stype-status ${durum === "Aktif" ? "aktif" : "pasif"}`}>{durum}</span>
          <p className="acct-figure">{yayinSaat || "—"}</p>
          <dl className="acct-rows">
            <div><dt>Başlık</dt><dd className="wrap">{baslik.trim() || "Duyuru başlığı"}</dd></div>
            <div><dt>Yayın</dt><dd>{yayinTarih || "—"}</dd></div>
            <div><dt>Modal</dt><dd>{modal ? "Evet" : "Hayır"}</dd></div>
            <div><dt>Görsel</dt><dd>{gorsel ? "Seçildi" : "Yok"}</dd></div>
          </dl>
          <p className="tm-bubble">{icerik.trim() || "Duyuru içeriği Markdown formatında yazılabilir."}</p>
          {gorsel && <img className="ann-preview" src={gorsel} alt="" />}
        </aside>
      </form>
    </div>
  );

  return embedded ? content : <AdminShell>{content}</AdminShell>;
}
