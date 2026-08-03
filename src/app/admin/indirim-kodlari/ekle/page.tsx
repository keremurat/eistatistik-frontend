"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../../AdminShell";
import { DatePicker } from "../../../components/DatePicker";

// ── İkon ─────────────────────────────────────────────────────────────
type IconName = "back" | "check";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back:  <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── Aranabilir Seçim ──────────────────────────────────────────────────
type SelectOption = { value: string; label: string };
type SearchableSelectProps = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  required?: boolean;
};

function SearchableSelect({ id, value, onChange, options, required }: SearchableSelectProps) {
  const [open,   setOpen]   = useState(false);
  const [pos,    setPos]    = useState({ top: 0, left: 0, width: 0 });
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onDown(e: MouseEvent) {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false); setSearch("");
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") { setOpen(false); setSearch(""); } }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown",   onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function openPanel() {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    setOpen((o) => !o);
  }

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const selected = options.find((o) => o.value === value);

  const panel = (
    <div ref={panelRef} className="cs-panel"
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      role="listbox">
      <input ref={inputRef} className="cs-search-input" value={search}
        onChange={(e) => setSearch(e.target.value)} placeholder="Ara…" />
      {filtered.map((o) => (
        <button key={o.value} className={`cs-option${value === o.value ? " active" : ""}`}
          role="option" aria-selected={value === o.value}
          onClick={() => { onChange(o.value); setOpen(false); setSearch(""); }}>
          {o.label}
        </button>
      ))}
      {filtered.length === 0 && (
        <p style={{ padding: ".4rem .6rem", color: "var(--muted)", fontSize: ".66rem" }}>Sonuç bulunamadı.</p>
      )}
    </div>
  );

  return (
    <>
      <button ref={triggerRef} id={id} className={`cs-trigger${open ? " open" : ""}`} type="button"
        onClick={openPanel} aria-haspopup="listbox" aria-expanded={open} aria-required={required}>
        {selected ? <span>{selected.label}</span> : <span className="cs-placeholder" />}
        <span className="cs-arrow">▼</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </>
  );
}

// ── Form ──────────────────────────────────────────────────────────────
const TIPLER: SelectOption[] = [
  { value: "percentage", label: "Yüzdesel" },
  { value: "amount",     label: "Net"       },
];

export default function IndirimKoduEklePage() {
  const [kod,      setKod]      = useState("");
  const [aciklama, setAciklama] = useState("");
  const [tip,      setTip]      = useState("");
  const [tutar,    setTutar]    = useState("");
  const [limit,    setLimit]    = useState("");
  const [baslama,  setBaslama]  = useState("");
  const [bitis,    setBitis]    = useState("");
  const [saved,    setSaved]    = useState(false);

  const canSave = tip && tutar && limit && baslama && bitis;

  function handleSave() {
    if (!canSave) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero" style={{ marginBottom: "1rem" }}>
          <div>
            <p className="eyebrow">YÖNETİM · İNDİRİM KODLARI</p>
            <h1 style={{ fontSize: "1.2rem" }}>İndirim Kodu Ekle</h1>
          </div>
          <Link className="back-link" href="/admin/indirim-kodlari">
            <Icon name="back" size={15} />Listeye dön
          </Link>
        </header>

        <section className="detail-panel">
          <div className="settings-panel-body">

            {/* Satır 1: Kupon Kodu | Kupon Açıklaması */}
            <div className="edu-row-2" style={{ alignItems: "start" }}>
              <div className="form-field">
                <label htmlFor="ik-kod">Kupon Kodu</label>
                <input id="ik-kod" value={kod} onChange={(e) => setKod(e.target.value)}
                  placeholder="Girilmediği takdirde otomatik oluşturulacaktır!" />
              </div>
              <div className="form-field">
                <label htmlFor="ik-aciklama">
                  <span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Kupon Açıklaması
                </label>
                <textarea id="ik-aciklama" value={aciklama} rows={4}
                  onChange={(e) => setAciklama(e.target.value)} style={{ resize: "vertical" }} />
              </div>
            </div>

            {/* Satır 2: Tipi | Tutar | Kullanım Limiti */}
            <div className="edu-row-3">
              <div className="form-field">
                <label htmlFor="ik-tip">
                  <span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Tipi
                </label>
                <SearchableSelect id="ik-tip" value={tip} onChange={setTip} options={TIPLER} required />
              </div>
              <div className="form-field">
                <label htmlFor="ik-tutar">
                  <span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Tutar
                </label>
                <input id="ik-tutar" type="number" min="0" value={tutar}
                  onChange={(e) => setTutar(e.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="ik-limit">
                  <span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Kullanım Limiti
                </label>
                <input id="ik-limit" type="number" min="1" value={limit}
                  onChange={(e) => setLimit(e.target.value)} />
              </div>
            </div>

            {/* Satır 3: Başlama | Bitiş */}
            <div className="edu-row-2">
              <div className="form-field">
                <label htmlFor="ik-baslama">
                  <span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Başlama Tarihi
                </label>
                <DatePicker id="ik-baslama" value={baslama} onChange={setBaslama} required />
              </div>
              <div className="form-field">
                <label htmlFor="ik-bitis">
                  <span style={{ color: "#c85a51", marginRight: 2 }}>*</span>Bitiş Tarihi
                </label>
                <DatePicker id="ik-bitis" value={bitis} onChange={setBitis} required />
              </div>
            </div>

            {/* Kaydet */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: ".5rem" }}>
              <button onClick={handleSave} disabled={!canSave}
                style={{
                  minHeight: 42, padding: "0 2.5rem", border: 0, borderRadius: 8,
                  background: saved ? "#287a55" : canSave ? "var(--blue)" : "#b0c8d4",
                  color: "#fff", font: "inherit", fontSize: ".72rem", fontWeight: 800,
                  cursor: canSave ? "pointer" : "default", transition: ".15s",
                  display: "flex", alignItems: "center", gap: ".4rem",
                }}>
                {saved ? <><Icon name="check" size={15} />Kaydedildi</> : "Kaydet"}
              </button>
            </div>

          </div>
        </section>
      </div>
    </AdminShell>
  );
}
