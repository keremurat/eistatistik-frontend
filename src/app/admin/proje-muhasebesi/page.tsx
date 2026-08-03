"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";

// ── Sabitler ──────────────────────────────────────────────────────────────────
const ISLEM_TIPLERI = ["Gelen", "Giden"];

const KULLANICILAR = [
  "KEREM MURAT",
  "NACİ MURAT",
  "SÜMEYYE İNAN",
  "MEHMET MEŞE",
  "ALİHSAN ŞÜKÜR",
  "EİSTATİSTİK ANALİZÖR",
  "EMRE KAYA",
  "DİLARA YILMAZ",
  "ESRA ÖZTÜRK",
  "BURCU AKSOY",
];

// ── İkon ─────────────────────────────────────────────────────────────────────
type IName = "chevron" | "check" | "save";
function Icon({ name, size = 16 }: { name: IName; size?: number }) {
  const p: Record<IName, React.ReactNode> = {
    chevron: <polyline points="6 9 12 15 18 9" />,
    check:   <polyline points="20 6 9 17 4 12" />,
    save:    <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>;
}

// ── Aranabilir dropdown ───────────────────────────────────────────────────────
interface SearchSelectProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

function SearchSelect({ options, value, onChange, placeholder = "Seçiniz", searchPlaceholder = "Ara..." }: SearchSelectProps) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  function openDropdown() {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    setOpen(true);
    setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onMouseDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`pm-select-trigger${open ? " open" : ""}`}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={value ? undefined : "pm-select-placeholder"}>{value || placeholder}</span>
        <span style={{ color: "var(--muted)", display: "flex", transition: "transform .15s", transform: open ? "rotate(180deg)" : undefined }}>
          <Icon name="chevron" size={14} />
        </span>
      </button>

      {open && typeof window !== "undefined" && createPortal(
        <div className="pm-select-panel" style={{ position: "absolute", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
          <div className="pm-select-search">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>
          <ul className="pm-select-list" role="listbox">
            {filtered.length === 0
              ? <li className="pm-select-empty">Sonuç bulunamadı</li>
              : filtered.map(opt => (
                <li
                  key={opt}
                  role="option"
                  aria-selected={value === opt}
                  className={`pm-select-option${value === opt ? " selected" : ""}`}
                  onMouseDown={() => { onChange(opt); setOpen(false); }}
                >
                  {opt}
                  {value === opt && <Icon name="check" size={13} />}
                </li>
              ))
            }
          </ul>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Sayfa ─────────────────────────────────────────────────────────────────────
interface FormState {
  projeAdi: string;
  islemTipi: string;
  birim: string;
  tutar: string;
  kullaniciAdi: string;
  siparis: string;
}

const EMPTY: FormState = { projeAdi: "", islemTipi: "", birim: "", tutar: "", kullaniciAdi: "", siparis: "" };

export default function ProjeMuhasebesiPage() {
  const [form, setForm]   = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function set(key: keyof FormState, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    setStatus("idle");
  }

  function handleSave() {
    if (!form.projeAdi || !form.islemTipi || !form.tutar || !form.kullaniciAdi) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setForm(EMPTY);
  }

  return (
    <AdminShell>
      <div className="pm-page">

        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Cari Hesap Oluştur</h1>
          </div>
        </header>

        <div className="detail-panel" style={{ padding: "1.5rem" }}>
          <div className="form-grid" style={{ marginBottom: "1.25rem" }}>

            {/* Proje Adı */}
            <div className="form-field">
              <label>Proje Adı</label>
              <input
                type="text"
                value={form.projeAdi}
                onChange={e => set("projeAdi", e.target.value)}
                placeholder="Proje adı girin"
              />
            </div>

            {/* İşlem Tipi */}
            <div className="form-field">
              <label>İşlem Tipi</label>
              <SearchSelect
                options={ISLEM_TIPLERI}
                value={form.islemTipi}
                onChange={v => set("islemTipi", v)}
                placeholder="Seçiniz"
              />
            </div>

            {/* Birim */}
            <div className="form-field">
              <label>Birim</label>
              <input
                type="text"
                value={form.birim}
                onChange={e => set("birim", e.target.value)}
                placeholder="Birim girin"
              />
            </div>

            {/* Tutar */}
            <div className="form-field">
              <label>Tutar</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.tutar}
                onChange={e => set("tutar", e.target.value)}
                placeholder="0,00"
              />
            </div>

            {/* Kullanıcı Adı */}
            <div className="form-field">
              <label>Kullanıcı Adı</label>
              <SearchSelect
                options={KULLANICILAR}
                value={form.kullaniciAdi}
                onChange={v => set("kullaniciAdi", v)}
                placeholder="Kullanıcı seçin"
                searchPlaceholder="Kullanıcı ara..."
              />
            </div>

            {/* Sipariş */}
            <div className="form-field">
              <label>Sipariş</label>
              <input
                type="text"
                value={form.siparis}
                onChange={e => set("siparis", e.target.value)}
                placeholder="Sipariş kodu (opsiyonel)"
              />
            </div>

          </div>

          {/* Kaydet satırı */}
          <div className="settings-actions" style={{ borderTop: "1px solid var(--line)", paddingTop: "1.1rem" }}>
            {status === "success" && (
              <span className="settings-note success"><Icon name="check" size={13} /> Kaydedildi.</span>
            )}
            {status === "error" && (
              <span className="settings-note error">Lütfen zorunlu alanları doldurun.</span>
            )}
            <button className="pm-save-btn" onClick={handleSave}>
              <Icon name="save" size={14} /> Kaydet
            </button>
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
