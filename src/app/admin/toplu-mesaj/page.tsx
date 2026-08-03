"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { DatePicker } from "../../components/DatePicker";

// ── İkon ─────────────────────────────────────────────────────────────────────
type IconName = "check" | "send" | "x";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    check: <path d="m5 12 4 4L19 6" />,
    send:  <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    x:     <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── SearchableSelect ──────────────────────────────────────────────────────────
type SelectOption = { value: string; label: string };

function SearchableSelect({
  id, placeholder, value, onChange, options,
}: {
  id: string; placeholder: string; value: string;
  onChange: (v: string) => void; options: SelectOption[];
}) {
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
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown",   onKey);
    };
  }, [open]);

  function openPanel() {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const panelH = Math.min(options.length * 38 + 48, 260);
    const top = spaceBelow >= panelH ? r.bottom + 4 : r.top - panelH - 4;
    setPos({ top, left: r.left, width: r.width });
    setOpen((o) => !o);
    setSearch("");
  }

  const filtered  = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const selected  = options.find((o) => o.value === value);

  const panel = (
    <div ref={panelRef} className="cs-panel"
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      role="listbox">
      <input ref={inputRef} className="cs-search-input" value={search}
        onChange={(e) => setSearch(e.target.value)} placeholder="Ara…" />
      <div style={{ overflowY: "auto", maxHeight: 200 }}>
        {filtered.map((o) => (
          <button key={o.value} className={`cs-option${value === o.value ? " active" : ""}`}
            role="option" aria-selected={value === o.value} type="button"
            onClick={() => { onChange(o.value); setOpen(false); setSearch(""); }}>
            {o.label}
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ padding: ".5rem .75rem", color: "var(--muted)", fontSize: ".68rem", margin: 0 }}>
            Sonuç bulunamadı
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button ref={triggerRef} id={id} className={`cs-trigger${open ? " open" : ""}`} type="button"
        onClick={openPanel} aria-haspopup="listbox" aria-expanded={open}>
        {selected
          ? <span>{selected.label}</span>
          : <span style={{ color: "var(--muted)" }}>{placeholder}</span>}
        <span className="cs-arrow">▼</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </>
  );
}

// ── Mock veri ─────────────────────────────────────────────────────────────────
const SIPARIS_TURLERI: SelectOption[] = [
  { value: "graphical-abstract",      label: "Graphical Abstract" },
  { value: "kampanyali-power",        label: "Kampanyalı Power Analizi" },
  { value: "kampanya-online",         label: "Kampanya Online Danışmanlık" },
  { value: "veri-isleme",            label: "Veri İşleme" },
  { value: "raporlama",              label: "Raporlama" },
  { value: "online-mentorluk",       label: "Online Mentörlük" },
  { value: "spss",                   label: "SPSS Analizi" },
  { value: "r-analizi",              label: "R Analizi" },
  { value: "python-analizi",         label: "Python Analizi" },
  { value: "olcek-gelistirme",       label: "Ölçek Geliştirme" },
  { value: "regresyon",              label: "Regresyon Analizi" },
  { value: "anket",                  label: "Anket Değerlendirme" },
];

const SIPARIS_DURUMLARI: SelectOption[] = [
  { value: "tumu",              label: "Tümü" },
  { value: "siparis-verildi",  label: "Sipariş Verildi" },
  { value: "ucret-belirlendi", label: "Ücret Belirlendi" },
  { value: "odeme-yapildi",    label: "Ödeme Yapıldı" },
  { value: "yapiliyor",        label: "Yapılıyor" },
  { value: "yapildi",          label: "Yapıldı" },
  { value: "ek-ucret",         label: "Ek Ücret Bekleniyor" },
  { value: "teslim",           label: "Teslim Edildi" },
  { value: "iptal",            label: "İptal" },
];

const MAIL_SECENEKLERI: SelectOption[] = [
  { value: "bildirilsin",    label: "Bildirilsin" },
  { value: "bildirilmesin",  label: "Bildirilmesin" },
];

type MockSiparis = {
  kod: string; musteri: string; tur: string; durum: string;
};
const MOCK_SIPARISLER: MockSiparis[] = [
  { kod: "DS120325001", musteri: "Ebru Buket Erken",       tur: "spss",      durum: "teslim"  },
  { kod: "DS120325002", musteri: "Ebru Buket Erken",       tur: "anket",     durum: "yapiliyor" },
  { kod: "DS050225001", musteri: "Mehmet Doğrul",          tur: "r-analizi", durum: "teslim"  },
  { kod: "DS221124001", musteri: "Ayça Ünal",              tur: "python-analizi", durum: "teslim" },
  { kod: "DS221124002", musteri: "Ayça Ünal",              tur: "raporlama", durum: "iptal"   },
  { kod: "DS140924001", musteri: "Başak Sözüdoğru",        tur: "olcek-gelistirme", durum: "teslim" },
  { kod: "DS280624001", musteri: "Emine Dilara Çolpak",    tur: "regresyon", durum: "teslim"  },
  { kod: "DS220424001", musteri: "Tuğçe Koç",              tur: "spss",      durum: "teslim"  },
];

// ── Sayfa ─────────────────────────────────────────────────────────────────────
export default function TopluMesajPage() {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  const [siparisTuru,   setSiparisTuru]   = useState("");
  const [siparisDurumu, setSiparisDurumu] = useState("");
  const [tarihBaslama,  setTarihBaslama]  = useState(todayStr);
  const [tarihBitis,    setTarihBitis]    = useState(todayStr);
  const [siparis,       setSiparis]       = useState("");
  const [mailBilgi,     setMailBilgi]     = useState("bildirilsin");
  const [mesaj,         setMesaj]         = useState("");
  const [sent,          setSent]          = useState(false);
  const [error,         setError]         = useState("");

  // Siparişleri tür ve duruma göre filtrele
  const filteredSiparisler: SelectOption[] = MOCK_SIPARISLER
    .filter((s) => {
      if (siparisTuru   && s.tur   !== siparisTuru)                          return false;
      if (siparisDurumu && siparisDurumu !== "tumu" && s.durum !== siparisDurumu) return false;
      return true;
    })
    .map((s) => ({
      value: s.kod,
      label: `${s.kod} — ${s.musteri}`,
    }));

  function handleGonder() {
    if (!mesaj.trim()) { setError("Mesaj alanı boş bırakılamaz."); return; }
    setError("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero" style={{ marginBottom: "1rem" }}>
          <div>
            <p className="eyebrow">KULLANICI YÖNETİMİ</p>
            <h1>Toplu Mesaj Gönder</h1>
          </div>
        </header>

        <section className="detail-panel">
          <div className="detail-panel-heading">
            <p className="eyebrow">MESAJ FİLTRESİ</p>
            <h2>Hedef Kitleyi Belirle</h2>
          </div>
          <div className="settings-panel-body">

            {/* Sipariş Türü */}
            <div className="form-field">
              <label htmlFor="tm-tur">Sipariş Türü Seçiniz</label>
              <SearchableSelect
                id="tm-tur"
                placeholder="Sipariş Türü Seçiniz"
                value={siparisTuru}
                onChange={(v) => { setSiparisTuru(v); setSiparis(""); }}
                options={SIPARIS_TURLERI}
              />
            </div>

            {/* Sipariş Durumu */}
            <div className="form-field">
              <label htmlFor="tm-durum">Sipariş Durumu Seçiniz</label>
              <SearchableSelect
                id="tm-durum"
                placeholder="Sipariş Durumu Seçiniz"
                value={siparisDurumu}
                onChange={(v) => { setSiparisDurumu(v); setSiparis(""); }}
                options={SIPARIS_DURUMLARI}
              />
            </div>

            {/* Tarih aralığı */}
            <div className="form-field">
              <label>Sipariş Tarih Aralığı</label>
              <div className="edu-row-2" style={{ marginTop: 0 }}>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="tm-bas" style={{ fontSize: ".63rem", color: "var(--muted)" }}>Başlangıç</label>
                  <DatePicker id="tm-bas" value={tarihBaslama} onChange={setTarihBaslama} />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="tm-bit" style={{ fontSize: ".63rem", color: "var(--muted)" }}>Bitiş</label>
                  <DatePicker id="tm-bit" value={tarihBitis} onChange={setTarihBitis} />
                </div>
              </div>
            </div>

            {/* Sipariş Seçiniz */}
            <div className="form-field">
              <label htmlFor="tm-siparis">
                Sipariş Seçiniz
                <span style={{ fontSize: ".63rem", color: "var(--muted)", fontWeight: 600, marginLeft: ".4rem" }}>
                  ({filteredSiparisler.length} sipariş)
                </span>
              </label>
              <SearchableSelect
                id="tm-siparis"
                placeholder="Sipariş Seçiniz"
                value={siparis}
                onChange={setSiparis}
                options={filteredSiparisler}
              />
            </div>

            {/* Mail ile Bilgilendirme */}
            <div className="form-field">
              <label htmlFor="tm-mail">Mail ile Bilgilendirme</label>
              <SearchableSelect
                id="tm-mail"
                placeholder="Seçiniz"
                value={mailBilgi}
                onChange={setMailBilgi}
                options={MAIL_SECENEKLERI}
              />
            </div>

            {/* Mesaj */}
            <div className="form-field">
              <label htmlFor="tm-mesaj">
                Mesajınız
                <span style={{ color: "#c85a51", marginLeft: ".2rem" }}>*</span>
              </label>
              <textarea
                id="tm-mesaj"
                rows={5}
                value={mesaj}
                onChange={(e) => { setMesaj(e.target.value); setError(""); }}
                placeholder="Göndermek istediğiniz mesajı buraya yazın…"
                style={{
                  resize: "vertical",
                  borderColor: error ? "#c85a51" : undefined,
                }}
              />
              {error && (
                <span style={{ fontSize: ".65rem", color: "#c85a51", marginTop: ".15rem" }}>{error}</span>
              )}
            </div>

            {/* Gönder */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: ".25rem" }}>
              {sent && (
                <div style={{
                  display: "flex", alignItems: "center", gap: ".5rem",
                  padding: ".65rem 1rem", borderRadius: 9,
                  background: "#edf7f1", color: "#287a55",
                  fontSize: ".72rem", fontWeight: 800,
                }}>
                  <Icon name="check" size={15} />
                  Mesaj başarıyla gönderildi.
                </div>
              )}
              <button
                type="button"
                onClick={handleGonder}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: ".5rem",
                  minHeight: 44, border: 0, borderRadius: 9,
                  background: sent ? "#287a55" : "var(--navy)",
                  color: "#fff", font: "inherit",
                  fontSize: ".78rem", fontWeight: 800,
                  cursor: "pointer", transition: "background .18s",
                }}>
                <Icon name={sent ? "check" : "send"} size={15} />
                {sent ? "Gönderildi" : "Gönder"}
              </button>
            </div>

          </div>
        </section>
      </div>
    </AdminShell>
  );
}
