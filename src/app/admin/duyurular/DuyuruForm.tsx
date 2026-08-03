"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { DatePicker } from "../../components/DatePicker";
import { TimePicker } from "../../components/TimePicker";
import { Duyuru } from "./data";

// ── Özel dropdown (native select'in yerini alır) ──────────────────────────────
type SelectOpt = { value: string; label: string };

function SimpleSelect({
  id, value, onChange, options,
}: {
  id?: string; value: string; onChange: (v: string) => void; options: SelectOpt[];
}) {
  const [open,   setOpen]   = useState(false);
  const [pos,    setPos]    = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown",   onKey);
    };
  }, [open]);

  function openPanel() {
    if (!triggerRef.current) return;
    const r       = triggerRef.current.getBoundingClientRect();
    const panelH  = options.length * 42 + 10;
    const top     = window.innerHeight - r.bottom - 8 < panelH
      ? r.top - panelH - 4
      : r.bottom + 4;
    setPos({ top, left: r.left, width: r.width });
    setOpen((o) => !o);
  }

  const selected = options.find((o) => o.value === value);

  const panel = (
    <div ref={panelRef} className="cs-panel"
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999, padding: ".3rem" }}
      role="listbox">
      {options.map((o) => (
        <button key={o.value} className={`cs-option${value === o.value ? " active" : ""}`}
          role="option" aria-selected={value === o.value} type="button"
          onClick={() => { onChange(o.value); setOpen(false); }}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <button ref={triggerRef} id={id} className={`cs-trigger${open ? " open" : ""}`}
        type="button" onClick={openPanel} aria-haspopup="listbox" aria-expanded={open}>
        <span>{selected?.label ?? ""}</span>
        <span className="cs-arrow">▼</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
type IconName = "back" | "bold" | "italic" | "heading" | "quote" | "ul" | "ol" | "task" |
  "link" | "image" | "preview" | "table" | "fullscreen" | "help" | "upload" | "check" | "x";

function Icon({ name, size = 15 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:       <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    bold:       <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />,
    italic:     <><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></>,
    heading:    <><path d="M4 12h16M4 6h16M4 18h16" /></>,
    quote:      <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></>,
    ul:         <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
    ol:         <><path d="M10 6h11M10 12h11M10 18h11" /><path d="M4 6h1v4M4 10h2M3 18h2a1 1 0 1 0 0-2H3v-1h2" /></>,
    task:       <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
    link:       <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
    image:      <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
    preview:    <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    table:      <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></>,
    fullscreen: <><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></>,
    help:       <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></>,
    upload:     <><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9M8 16l4-4 4 4" /></>,
    check:      <path d="m5 12 4 4L19 6" />,
    x:          <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── Markdown editor toolbar ───────────────────────────────────────────────────
const TOOLBAR: { icon: IconName; title: string; wrap?: [string, string] }[] = [
  { icon: "bold",       title: "Kalın",       wrap: ["**", "**"] },
  { icon: "italic",     title: "İtalik",      wrap: ["*", "*"]   },
  { icon: "heading",    title: "Başlık",      wrap: ["## ", ""]  },
  { icon: "quote",      title: "Alıntı",      wrap: ["> ", ""]   },
  { icon: "ul",         title: "Liste",       wrap: ["- ", ""]   },
  { icon: "ol",         title: "Numaralı",    wrap: ["1. ", ""]  },
  { icon: "task",       title: "Görev",       wrap: ["- [ ] ", ""] },
  { icon: "link",       title: "Bağlantı",    wrap: ["[", "](url)"] },
  { icon: "image",      title: "Resim",       wrap: ["![alt](", ")"] },
  { icon: "preview",    title: "Önizle",      },
  { icon: "table",      title: "Tablo",       },
  { icon: "fullscreen", title: "Tam ekran",   },
  { icon: "help",       title: "Yardım",      },
];

type Props = {
  mode: "ekle" | "duzenle";
  initial?: Partial<Duyuru>;
};

export function DuyuruForm({ mode, initial = {} }: Props) {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  const [baslik,      setBaslik]      = useState(initial.baslik      ?? "");
  const [yayinTarih,  setYayinTarih]  = useState(
    initial.yayinTarihi ? initial.yayinTarihi.split(" ")[0] : todayStr
  );
  const [yayinSaat,   setYayinSaat]   = useState(
    initial.yayinTarihi ? initial.yayinTarihi.split(" ")[1] ?? "09:00" : "09:00"
  );
  const [durum,       setDurum]       = useState(initial.durum       ?? "Pasif");
  const [modal,       setModal]       = useState(initial.modalGoster ?? false);
  const [icerik,      setIcerik]      = useState(initial.icerik      ?? "");
  const [bgImage,     setBgImage]     = useState<string | null>(null);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);

  const wordCount = icerik.trim() ? icerik.trim().split(/\s+/).length : 0;
  const lineCount = icerik ? icerik.split("\n").length : 1;

  function insertWrap(before: string, after: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel   = icerik.slice(start, end);
    const next  = icerik.slice(0, start) + before + sel + after + icerik.slice(end);
    setIcerik(next);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd   = start + before.length + sel.length;
    }, 0);
  }

  function handleSave() {
    if (!baslik.trim()) { setError("Duyuru başlığı boş bırakılamaz."); return; }
    if (!icerik.trim()) { setError("Duyuru içeriği boş bırakılamaz."); return; }
    setError("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero" style={{ marginBottom: "1rem" }}>
          <div>
            <p className="eyebrow">YÖNETİM · DUYURULAR</p>
            <h1 style={{ fontSize: "1.2rem" }}>{mode === "ekle" ? "Duyuru Ekle" : "Duyuru Düzenle"}</h1>
          </div>
          <Link className="back-link" href="/admin/duyurular">
            <Icon name="back" size={15} />Duyuru Listesine dön
          </Link>
        </header>

        <section className="detail-panel">
          <div className="settings-panel-body">

            {/* Üst bilgi satırı */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
              <div className="form-field" style={{ gridColumn: "1" }}>
                <label htmlFor="d-baslik">
                  Duyuru Başlığı
                  <span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span>
                </label>
                <input
                  id="d-baslik"
                  value={baslik}
                  onChange={(e) => { setBaslik(e.target.value); setError(""); }}
                  placeholder="Duyuru başlığını girin"
                  style={error && !baslik.trim() ? { borderColor: "#c85a51" } : undefined}
                />
              </div>

              <div className="form-field">
                <label htmlFor="d-tarih">Yayın Tarihi</label>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <DatePicker id="d-tarih" value={yayinTarih} onChange={setYayinTarih} />
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <TimePicker id="d-saat" value={yayinSaat} onChange={setYayinSaat} placeholder="SS:DD" />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="d-durum">Durumu</label>
                <SimpleSelect
                  id="d-durum"
                  value={durum}
                  onChange={(v) => setDurum(v as "Aktif" | "Pasif")}
                  options={[
                    { value: "Pasif", label: "Pasif" },
                    { value: "Aktif", label: "Aktif" },
                  ]}
                />
              </div>

              <div className="form-field">
                <label htmlFor="d-modal">Ekranda Gösterilsin mi? (Modal)</label>
                <SimpleSelect
                  id="d-modal"
                  value={modal ? "evet" : "hayir"}
                  onChange={(v) => setModal(v === "evet")}
                  options={[
                    { value: "hayir", label: "Hayır" },
                    { value: "evet",  label: "Evet"  },
                  ]}
                />
              </div>
            </div>

            {/* Markdown editör */}
            <div className="form-field">
              <label>
                Duyuru İçeriği
                <span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span>
              </label>
              <div style={{
                border: `1px solid ${error && !icerik.trim() ? "#c85a51" : "var(--line)"}`,
                borderRadius: 9, overflow: "hidden",
                background: "#fff",
              }}>
                {/* Toolbar */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: "2px",
                  padding: ".4rem .5rem",
                  borderBottom: "1px solid var(--line)",
                  background: "#f8fafb",
                }}>
                  {TOOLBAR.map((btn, i) => (
                    <button
                      key={i}
                      type="button"
                      title={btn.title}
                      onClick={() => btn.wrap && insertWrap(btn.wrap[0], btn.wrap[1])}
                      style={{
                        display: "grid", placeItems: "center",
                        width: 28, height: 28, border: "1px solid transparent",
                        borderRadius: 5, background: "transparent",
                        cursor: "pointer", color: "#54687a",
                        transition: ".1s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#edf1f4";
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                      }}>
                      <Icon name={btn.icon} size={14} />
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={icerik}
                  onChange={(e) => { setIcerik(e.target.value); setError(""); }}
                  placeholder="Duyuru içeriğini buraya yazın… (Markdown desteklenir)"
                  rows={14}
                  style={{
                    display: "block", width: "100%", border: 0, outline: "none",
                    padding: "1rem 1.1rem", resize: "vertical",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: ".72rem", lineHeight: 1.7, color: "var(--ink)",
                    background: "#fff",
                  }}
                />

                {/* Alt bar */}
                <div style={{
                  padding: ".3rem .8rem",
                  borderTop: "1px solid var(--line)",
                  background: "#f8fafb",
                  textAlign: "right",
                  fontSize: ".62rem", color: "#94aab7",
                }}>
                  lines: {lineCount} · words: {wordCount}
                </div>
              </div>
            </div>

            {/* Arka plan resmi */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
              <div className="form-field">
                <label>Duyuru Arka Plan Resmi</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: ".6rem",
                    minHeight: 140, borderRadius: 10, cursor: "pointer",
                    border: "2px dashed var(--line)",
                    background: bgImage ? "transparent" : "#f8fafb",
                    overflow: "hidden", position: "relative",
                    transition: "border-color .15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
                  {bgImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={bgImage} alt="Arka plan" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setBgImage(null); }}
                        style={{
                          position: "absolute", top: 6, right: 6,
                          width: 24, height: 24, borderRadius: "50%",
                          border: 0, background: "rgba(0,0,0,.5)", color: "#fff",
                          cursor: "pointer", display: "grid", placeItems: "center",
                        }}>
                        <Icon name="x" size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: "#94aab7" }}><Icon name="upload" size={32} /></span>
                      <span style={{ fontSize: ".7rem", color: "var(--blue)", fontWeight: 700 }}>
                        Resim seçmek için tıklayınız
                      </span>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={handleFileChange} />
              </div>

              <div className="form-field">
                <label>Duyuru Arka Plan Resmi</label>
                <div style={{
                  padding: ".75rem 1rem", borderRadius: 10,
                  background: "#f8fafb", border: "1px solid var(--line)",
                  fontSize: ".7rem", color: "#8493a0", minHeight: 60,
                }}>
                  {bgImage ? (
                    <span style={{ color: "#287a55", fontWeight: 700 }}>Resim seçildi</span>
                  ) : (
                    "Resim ekli değil"
                  )}
                </div>
              </div>
            </div>

            {/* Hata + Kaydet */}
            {error && (
              <p style={{ margin: 0, fontSize: ".65rem", color: "#c85a51", fontWeight: 700 }}>{error}</p>
            )}
            <div>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  display: "inline-flex", alignItems: "center", gap: ".4rem",
                  minHeight: 42, padding: "0 2rem", border: 0, borderRadius: 8,
                  background: saved ? "#287a55" : "var(--navy)",
                  color: "#fff", font: "inherit", fontSize: ".75rem", fontWeight: 800,
                  cursor: "pointer", transition: "background .18s",
                }}>
                <Icon name={saved ? "check" : "upload"} size={15} />
                {saved ? "Kaydedildi" : "Kaydet"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
