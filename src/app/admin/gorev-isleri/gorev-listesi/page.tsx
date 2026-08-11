"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../../AdminShell";
import { DatePicker } from "../../../components/DatePicker";
import { TimePicker } from "../../../components/TimePicker";

// ── Tipler ────────────────────────────────────────────────────────────────────
type EtiketKey = "Acil" | "Arama Talebi" | "Önemli" | "Düşük Öncelikli" | "Hatırlatma";

interface YapilanItem { id: number; metin: string; tamamlandi: boolean; }
interface Gorev {
  id: number; baslik: string; pano: string; etiket: EtiketKey;
  tarih: string; siparisKodu?: string; musteriAdi?: string; musteriTel?: string;
  aciklama: string; atanan: string; yapilanlar: YapilanItem[];
}
interface Pano { key: string; baslik: string; sira: number; }

// ── Atanabilir kullanıcılar ───────────────────────────────────────────────────
interface AtanabilirKullanici { value: string; label: string; rol: "Admin" | "Analist" | "Asistan"; }
const ATANABILIR: AtanabilirKullanici[] = [
  { value: "KEREM MURAT",          label: "Kerem Murat",          rol: "Admin"   },
  { value: "NACİ MURAT",           label: "Naci Murat",           rol: "Analist" },
  { value: "SÜMEYYE İNAN",         label: "Sümeyye İnan",         rol: "Analist" },
  { value: "MEHMET MEŞE",          label: "Mehmet Meşe",          rol: "Analist" },
  { value: "ALİHSAN ŞÜKÜR",        label: "Alihsan Şükür",        rol: "Analist" },
  { value: "eistatistik ANALİZÖR", label: "eistatistik Analizör", rol: "Analist" },
  { value: "EMRE KAYA",            label: "Emre Kaya",            rol: "Asistan" },
  { value: "DİLARA YILMAZ",        label: "Dilara Yılmaz",        rol: "Asistan" },
];
const ROL_RENK: Record<AtanabilirKullanici["rol"], { bg: string; color: string }> = {
  Admin:   { bg: "#fff3f2", color: "#c85a51" },
  Analist: { bg: "var(--blue-soft)", color: "var(--blue)" },
  Asistan: { bg: "#f0faf6", color: "#287a55" },
};

// ── Etiket ────────────────────────────────────────────────────────────────────
const ETIKET_CLS: Record<EtiketKey, string> = {
  "Acil":            "gorev-etiket gorev-etiket-acil",
  "Arama Talebi":    "gorev-etiket gorev-etiket-aramatalebi",
  "Önemli":          "gorev-etiket gorev-etiket-onemli",
  "Düşük Öncelikli": "gorev-etiket gorev-etiket-dusuk",
  "Hatırlatma":      "gorev-etiket gorev-etiket-hatirlatma",
};
const ETIKET_LIST: EtiketKey[] = ["Acil", "Arama Talebi", "Önemli", "Düşük Öncelikli", "Hatırlatma"];

// ── Mock veri ─────────────────────────────────────────────────────────────────
const INIT_PANOLAR: Pano[] = [
  { key: "yapilacaklar", baslik: "YAPILACAKLAR", sira: 1 },
  { key: "yapiliyor",    baslik: "YAPILIYOR",    sira: 2 },
  { key: "yapildi",      baslik: "YAPILDI",      sira: 3 },
];

let _nextId = 200;
const INIT_GOREVLER: Gorev[] = [
  { id: 1,  baslik: "EĞİTİM",                    pano: "yapilacaklar", etiket: "Hatırlatma",    tarih: "03.07.2026 15:26", aciklama: "Hocam müsait olduğunuzda MODÜL 17 ve 18 eğitimleri offline olarak sisteme yükleyebilir misiniz?", atanan: "NACİ MURAT", yapilanlar: [] },
  { id: 2,  baslik: "BİLGİLENDİRME",             pano: "yapilacaklar", etiket: "Acil",          tarih: "13.07.2026 16:30", siparisKodu: "SA251007010", musteriAdi: "FEYZA MOLLAİBRAHİMOĞLU", musteriTel: "553 576 54 70", aciklama: "Ek analiz ödemeyini yapınca yazışması kapandı, geldiğinde bakabilir misiniz? ***TESLİMAT TARİHİ 4 AĞUSTOS SALI", atanan: "MEHMET MEŞE", yapilanlar: [] },
  { id: 3,  baslik: "Teslimat",                   pano: "yapilacaklar", etiket: "Acil",          tarih: "21.07.2026 16:57", siparisKodu: "SA260708001", musteriAdi: "AHMET TAHA KAYAOĞLU",   musteriTel: "539 929 17 38", aciklama: "Teslimat tarihi 31 Temmuz cuma, pazartesi online görüşme ile birlikte teslim edilecek.", atanan: "ALİHSAN ŞÜKÜR", yapilanlar: [] },
  { id: 4,  baslik: "Ek analiz teslim",           pano: "yapilacaklar", etiket: "Acil",          tarih: "30.07.2026 10:28", siparisKodu: "SA260715003", musteriAdi: "GİZEM KILIÇ",           musteriTel: "507 634 96 01", aciklama: "İlave istatistik raporu hazırlanacak.", atanan: "ALİHSAN ŞÜKÜR", yapilanlar: [] },
  { id: 5,  baslik: "Ek analiz teslim",           pano: "yapilacaklar", etiket: "Acil",          tarih: "30.07.2026 11:48", siparisKodu: "SA260718002", musteriAdi: "NURCAN AKSAKA",         musteriTel: "532 670 52 82", aciklama: "Teslim zamanı yaklaşıyor, kontrol edilecek.", atanan: "RABİA AKTAŞ", yapilanlar: [] },
  { id: 6,  baslik: "Teslimat",                   pano: "yapilacaklar", etiket: "Acil",          tarih: "30.07.2026 17:40", siparisKodu: "SA260720001", musteriAdi: "AHMET FARUK PEKŞEN",    musteriTel: "537 350 69 73", aciklama: "", atanan: "ESRA ÖZTÜRK", yapilanlar: [] },
  { id: 7,  baslik: "ANALİZ TESLİMİ",            pano: "yapilacaklar", etiket: "Acil",          tarih: "31.07.2026 09:56", siparisKodu: "SA260722003", musteriAdi: "MERİÇ ÖZTÜRK YAŞAR",   musteriTel: "533 499 40 89", aciklama: "", atanan: "NACİ MURAT", yapilanlar: [] },
  { id: 8,  baslik: "İNCELEME",                  pano: "yapilacaklar", etiket: "Acil",          tarih: "31.07.2026 10:04", siparisKodu: "SA260723001", musteriAdi: "DAMLA AMASYA",          musteriTel: "507 943 70 27", aciklama: "Rapor verisi kontrol edilecek.", atanan: "NACİ MURAT", yapilanlar: [] },
  { id: 9,  baslik: "HATIRLATMA",                 pano: "yapiliyor",    etiket: "Arama Talebi",  tarih: "08.06.2026 16:45", musteriAdi: "MERVE ALPAY",             musteriTel: "505 787 87 99", aciklama: "DÜZCE ÜNİ. Tıbbi Biyokimya Eylül başında webinar için aranacak.", atanan: "SÜMEYYE İNAN", yapilanlar: [] },
  { id: 10, baslik: "Ek Analiz Ücreti Verilecek", pano: "yapiliyor",    etiket: "Önemli",        tarih: "31.07.2026 09:28", siparisKodu: "SA260301001", musteriAdi: "ENİS ULUSOY",            musteriTel: "531 308 61 21", aciklama: "Ek analiz ücret bilgisi verildi 9600 TL.", atanan: "NACİ MURAT", yapilanlar: [] },
  { id: 11, baslik: "Rapor teslim",               pano: "yapildi",      etiket: "Acil",          tarih: "27.07.2026 14:27", siparisKodu: "SA260720005", musteriAdi: "NESLİHAN ÜNAL AKDEMİR", musteriTel: "532 562 01 73", aciklama: "", atanan: "KAAN KARAKAYA", yapilanlar: [] },
  { id: 12, baslik: "Hatırlatma",                 pano: "yapildi",      etiket: "Hatırlatma",    tarih: "28.07.2026 11:10", musteriAdi: "TUĞÇE ŞAHİN",              musteriTel: "505 464 34 19", aciklama: "Cumartesi görüşme yapıldı.", atanan: "FATİH AKAR", yapilanlar: [] },
  { id: 13, baslik: "IDP ek analiz teslim",       pano: "yapildi",      etiket: "Acil",          tarih: "30.07.2026 14:11", siparisKodu: "SA260728001", musteriAdi: "LEYLA YAMAN ÜZÜMCÜ",    musteriTel: "507 606 86 85", aciklama: "", atanan: "RABİA AKTAŞ", yapilanlar: [] },
  { id: 14, baslik: "Sipariş Teslimi",            pano: "yapildi",      etiket: "Acil",          tarih: "31.07.2026 18:13", siparisKodu: "SA260730002", musteriAdi: "FATMA NUR KAYA",         musteriTel: "530 426 46 20", aciklama: "Hocam ödeme gelince teslim yapılacak.", atanan: "NACİ MURAT", yapilanlar: [] },
  { id: 15, baslik: "EK ANALİZ YAPILACAK",       pano: "yapildi",      etiket: "Düşük Öncelikli", tarih: "01.08.2026 09:28", siparisKodu: "SA260801001", musteriAdi: "ESMA DİNGER",         musteriTel: "505 671 96 70", aciklama: "", atanan: "NACİ MURAT", yapilanlar: [] },
];

// ── İkon ─────────────────────────────────────────────────────────────────────
type IName = "folder" | "plus" | "x" | "dots" | "trash" | "edit" | "archive" | "check" | "chevron" | "move";
function Icon({ name, size = 16 }: { name: IName; size?: number }) {
  const p: Record<IName, React.ReactNode> = {
    folder:  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    plus:    <><path d="M12 5v14M5 12h14" /></>,
    x:       <><path d="m18 6-12 12M6 6l12 12" /></>,
    dots:    <><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
    trash:   <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></>,
    edit:    <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    archive: <><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></>,
    check:   <path d="M20 6 9 17l-5-5" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    move:    <><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>;
}

// ── SimpleSelect ──────────────────────────────────────────────────────────────
interface SSOption { value: string; label: string; meta?: string; metaBg?: string; metaColor?: string; }
function SimpleSelect({ id, value, onChange, options, placeholder = "Seçin" }: {
  id?: string; value: string; onChange: (v: string) => void; options: SSOption[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const trigRef = useRef<HTMLButtonElement>(null);
  const panRef  = useRef<HTMLDivElement>(null);
  const panH    = options.length * 44 + 10;

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (trigRef.current?.contains(e.target as Node)) return;
      if (panRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function toggle() {
    if (!trigRef.current) return;
    const r = trigRef.current.getBoundingClientRect();
    const top = window.innerHeight - r.bottom - 8 < panH ? r.top - panH - 4 : r.bottom + 4;
    setPos({ top, left: r.left, width: r.width });
    setOpen(o => !o);
  }

  const selected = options.find(o => o.value === value);

  const panel = (
    <div ref={panRef} className="cs-panel" role="listbox"
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
      {options.map(o => (
        <button key={o.value} role="option" aria-selected={o.value === value}
          className={`cs-option${o.value === value ? " active" : ""}`}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          onClick={() => { onChange(o.value); setOpen(false); }}>
          <span>{o.label}</span>
          {o.meta && <span style={{ fontSize: ".54rem", fontWeight: 800, padding: ".15rem .45rem", borderRadius: 99, background: o.metaBg ?? "var(--canvas)", color: o.metaColor ?? "var(--muted)" }}>{o.meta}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <button id={id} ref={trigRef} type="button" aria-haspopup="listbox" aria-expanded={open}
        className={`cs-trigger${open ? " open" : ""}`} onClick={toggle}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          {selected
            ? <><span>{selected.label}</span>{selected.meta && <span style={{ fontSize: ".52rem", fontWeight: 800, padding: ".12rem .4rem", borderRadius: 99, background: selected.metaBg ?? "var(--canvas)", color: selected.metaColor ?? "var(--muted)" }}>{selected.meta}</span>}</>
            : <span className="cs-placeholder">{placeholder}</span>}
        </span>
        <span className="cs-arrow">▾</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </>
  );
}

// ── Görev modalı (ekle + düzenle) ────────────────────────────────────────────
function GorevModal({ panolar, initial, onClose, onSave }: {
  panolar: Pano[]; initial?: Gorev; onClose: () => void;
  onSave: (g: Omit<Gorev, "id"> & { id?: number }) => void;
}) {
  const isEdit = !!initial;
  const parseDT = (s: string) => { const p = s.split(" "); return { t: p[0] ?? "", s: p[1] ?? "" }; };
  const init = initial ? parseDT(initial.tarih) : { t: "", s: "" };

  const [baslik,     setBaslik]     = useState(initial?.baslik ?? "");
  const [pano,       setPano]       = useState(initial?.pano ?? panolar[0]?.key ?? "");
  const [atanan,     setAtanan]     = useState(initial?.atanan ?? ATANABILIR[0].value);
  const [tarih,      setTarih]      = useState(init.t);
  const [saat,       setSaat]       = useState(init.s);
  const [etiket,     setEtiket]     = useState<EtiketKey>((initial?.etiket as EtiketKey) ?? ETIKET_LIST[0]);
  const [aciklama,   setAciklama]   = useState(initial?.aciklama ?? "");
  const [yapilanlar, setYapilanlar] = useState<YapilanItem[]>(initial?.yapilanlar ?? []);
  const [saved,      setSaved]      = useState(false);

  function handleSave() {
    if (!baslik.trim()) return;
    const tarihStr = [tarih, saat].filter(Boolean).join(" ");
    onSave({
      ...(isEdit ? { id: initial!.id, siparisKodu: initial!.siparisKodu, musteriAdi: initial!.musteriAdi, musteriTel: initial!.musteriTel } : {}),
      baslik: baslik.trim(), pano, etiket, atanan,
      tarih: tarihStr || new Date().toLocaleDateString("tr-TR"),
      aciklama: aciklama.trim(),
      yapilanlar: yapilanlar.filter(y => y.metin.trim()),
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 700);
  }

  const panoOptions   = panolar.map(p => ({ value: p.key, label: p.baslik }));
  const etiketOptions = ETIKET_LIST.map(e => ({ value: e, label: e }));
  const atananOptions = ATANABILIR.map(k => ({ value: k.value, label: k.label, meta: k.rol, metaBg: ROL_RENK[k.rol].bg, metaColor: ROL_RENK[k.rol].color }));

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="gm-title">
        <header className="admin-modal-head">
          <h2 id="gm-title">{isEdit ? "Kartı Düzenle" : "Kart Bilgileri"}</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Kapat">×</button>
        </header>
        <div className="admin-modal-body">
          <div className="admin-modal-grid-2">
            <div className="form-field"><label htmlFor="gm-b">İş Başlığı</label><input id="gm-b" type="text" placeholder="Görev başlığı" value={baslik} onChange={e => setBaslik(e.target.value)} /></div>
            <div className="form-field"><label htmlFor="gm-p">Pano Adı</label><SimpleSelect id="gm-p" value={pano} onChange={setPano} options={panoOptions} placeholder="Pano seçin" /></div>
          </div>
          <div className="admin-modal-grid-3">
            <div className="form-field"><label htmlFor="gm-a">Atananlar</label><SimpleSelect id="gm-a" value={atanan} onChange={setAtanan} options={atananOptions} placeholder="Kişi seçin" /></div>
            <div className="form-field">
              <label>Bitirme Zamanı</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".4rem" }}>
                <DatePicker value={tarih} onChange={setTarih} placeholder="GG.AA.YYYY" />
                <TimePicker value={saat}  onChange={setSaat} />
              </div>
            </div>
            <div className="form-field"><label htmlFor="gm-e">Etiket</label><SimpleSelect id="gm-e" value={etiket} onChange={v => setEtiket(v as EtiketKey)} options={etiketOptions} /></div>
          </div>
          <div className="form-field"><label htmlFor="gm-ac">Açıklama</label><textarea id="gm-ac" rows={4} placeholder="Görev açıklaması…" value={aciklama} onChange={e => setAciklama(e.target.value)} style={{ resize: "vertical" }} /></div>
          <div className="form-field">
            <label>Yapılacaklar Listesi</label>
            <div className="yapilanlar-list">
              {yapilanlar.map(y => (
                <div key={y.id} className="yapilanlar-item">
                  <input className="yapilanlar-input" type="text" placeholder="Yapılacak madde…" value={y.metin} onChange={e => setYapilanlar(prev => prev.map(p => p.id === y.id ? { ...p, metin: e.target.value } : p))} />
                  <button type="button" className="yapilanlar-remove" onClick={() => setYapilanlar(prev => prev.filter(p => p.id !== y.id))} aria-label="Kaldır"><Icon name="x" size={13} /></button>
                </div>
              ))}
              <button type="button" className="yapilanlar-add" onClick={() => setYapilanlar(prev => [...prev, { id: Date.now(), metin: "", tamamlandi: false }])}><Icon name="plus" size={13} /> Ekle</button>
            </div>
          </div>
        </div>
        <footer className="admin-modal-foot">
          <button className="btn-cancel" onClick={onClose}>Kapat</button>
          <button className="btn-save" onClick={handleSave} disabled={!baslik.trim()} style={saved ? { background: "#287a55" } : {}}>
            {saved ? <><Icon name="check" size={14} />{isEdit ? " Güncellendi" : " Kaydedildi"}</> : isEdit ? "Güncelle" : "Kaydet"}
          </button>
        </footer>
      </section>
    </div>
  );
}

// ── Pano ekle modalı ──────────────────────────────────────────────────────────
function PanoEkleModal({ onClose, onSave, mevcutSira }: {
  onClose: () => void; onSave: (p: Omit<Pano, "key">) => void; mevcutSira: number;
}) {
  const [baslik, setBaslik]   = useState("");
  const [sira,   setSira]     = useState(String(mevcutSira + 1));
  const [aciklama, setAciklama] = useState("");
  const [saved,  setSaved]    = useState(false);

  function handleSave() {
    if (!baslik.trim()) return;
    onSave({ baslik: baslik.trim().toUpperCase(), sira: parseInt(sira) || mevcutSira + 1 });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 700);
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="admin-modal" style={{ maxWidth: 500 }} role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <header className="admin-modal-head">
          <h2 id="pm-title">Pano Bilgileri</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Kapat">×</button>
        </header>
        <div className="admin-modal-body">
          <div style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "1rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
              <div className="form-field"><label htmlFor="pm-b">Pano Başlığı</label><input id="pm-b" type="text" placeholder="Pano başlığı" value={baslik} onChange={e => setBaslik(e.target.value)} /></div>
              <div className="form-field"><label htmlFor="pm-s">Pano Sırası</label><input id="pm-s" type="number" min={1} value={sira} onChange={e => setSira(e.target.value)} /></div>
            </div>
            <div className="form-field"><label htmlFor="pm-a">Açıklama</label><textarea id="pm-a" rows={3} placeholder="Açıklama" value={aciklama} onChange={e => setAciklama(e.target.value)} style={{ resize: "vertical" }} /></div>
          </div>
        </div>
        <footer className="admin-modal-foot">
          <button className="btn-cancel" onClick={onClose}>Kapat</button>
          <button className="btn-save" onClick={handleSave} disabled={!baslik.trim()} style={saved ? { background: "#287a55" } : {}}>
            {saved ? <><Icon name="check" size={14} /> Kaydedildi</> : "Kaydet"}
          </button>
        </footer>
      </section>
    </div>
  );
}

// ── Satır 3-nokta menüsü ──────────────────────────────────────────────────────
function RowMenu({ onEdit, onArchive, onDelete }: { onEdit: () => void; onArchive: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (panRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function toggle() {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.right - 156 });
    setOpen(o => !o);
  }

  const base: React.CSSProperties = {
    width: "100%", padding: ".42rem .65rem", border: 0, borderRadius: 6,
    background: "transparent", font: "inherit", fontSize: ".7rem", fontWeight: 700,
    textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: ".45rem",
  };

  const menu = (
    <div ref={panRef} role="menu" style={{ position: "fixed", top: pos.top, left: pos.left, width: 156, zIndex: 9999, background: "#fff", border: "1px solid var(--line)", borderRadius: 9, boxShadow: "0 12px 30px rgba(19,43,70,.13)", padding: ".3rem", animation: "profile-menu-in .12s ease-out" }}>
      <button role="menuitem" style={{ ...base, color: "#3f556a" }} onMouseEnter={e => (e.currentTarget.style.background = "var(--canvas)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => { setOpen(false); onEdit(); }}><Icon name="edit" size={14} />Düzenle</button>
      <button role="menuitem" style={{ ...base, color: "#3f556a" }} onMouseEnter={e => (e.currentTarget.style.background = "var(--canvas)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => { setOpen(false); onArchive(); }}><Icon name="archive" size={14} />Arşivle</button>
      <div style={{ height: 1, background: "var(--line)", margin: ".25rem 0" }} />
      <button role="menuitem" style={{ ...base, color: "#c85a51" }} onMouseEnter={e => (e.currentTarget.style.background = "#fff3f2")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => { setOpen(false); onDelete(); }}><Icon name="trash" size={14} />Sil</button>
    </div>
  );

  return (
    <>
      <button ref={btnRef} type="button" className="gl-dots-btn" aria-haspopup="menu" aria-expanded={open} aria-label="Seçenekler" onClick={toggle}>
        <Icon name="dots" size={15} />
      </button>
      {open && typeof document !== "undefined" && createPortal(menu, document.body)}
    </>
  );
}

// ── Görev satırı ─────────────────────────────────────────────────────────────
function GorevRow({ gorev, checked, onCheck, onEdit, onArchive, onDelete }: {
  gorev: Gorev; checked: boolean;
  onCheck: (v: boolean) => void; onEdit: () => void; onArchive: () => void; onDelete: () => void;
}) {
  const parts: string[] = [];
  if (gorev.musteriAdi) parts.push(gorev.musteriAdi + (gorev.musteriTel ? ` — ${gorev.musteriTel}` : ""));
  if (gorev.siparisKodu && !gorev.musteriAdi) parts.push(gorev.siparisKodu);
  if (gorev.aciklama) parts.push(gorev.aciklama);
  const subText = parts.join(" · ");

  return (
    <div className={`gorev-liste-row${checked ? " selected" : ""}`} role="row">
      <input type="checkbox" className="gorev-liste-cb" checked={checked}
        onChange={e => onCheck(e.target.checked)} aria-label={`${gorev.baslik} seç`} />
      <span className="gorev-liste-text" title={gorev.baslik + (subText ? ": " + subText : "")}>
        <b>{gorev.baslik}</b>{subText ? <span style={{ color: "#8493a0", fontWeight: 700 }}>{" · "}{subText}</span> : null}
      </span>
      <span className="gorev-liste-atanan">{gorev.atanan}</span>
      <span className="gorev-liste-tarih">{gorev.tarih}</span>
      <div className="gorev-liste-etiket"><span className={ETIKET_CLS[gorev.etiket]}>{gorev.etiket}</span></div>
      <div className="gl-dots"><RowMenu onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} /></div>
    </div>
  );
}

// ── Pano bölümü (katlanabilir) ────────────────────────────────────────────────
function SectionGroup({ pano, gorevler, selected, onToggleAll, onToggleOne, onEdit, onArchive, onDelete }: {
  pano: Pano; gorevler: Gorev[]; selected: Set<number>;
  onToggleAll: (ids: number[], check: boolean) => void;
  onToggleOne: (id: number, check: boolean) => void;
  onEdit: (g: Gorev) => void; onArchive: (id: number) => void; onDelete: (id: number) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const ids        = gorevler.map(g => g.id);
  const checkedAll = ids.length > 0 && ids.every(id => selected.has(id));
  const indeterminate = !checkedAll && ids.some(id => selected.has(id));

  const cbRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (cbRef.current) cbRef.current.indeterminate = indeterminate; }, [indeterminate]);

  return (
    <div className="gorev-liste-section">
      <div className="gorev-liste-sec-head" onClick={() => setCollapsed(c => !c)} role="button" aria-expanded={!collapsed}>
        <input ref={cbRef} type="checkbox" className="gorev-liste-cb"
          checked={checkedAll} onChange={e => { e.stopPropagation(); onToggleAll(ids, e.target.checked); }}
          onClick={e => e.stopPropagation()} aria-label={`${pano.baslik} tümünü seç`} />
        <span className={`gorev-liste-sec-chevron${collapsed ? " collapsed" : ""}`}><Icon name="chevron" size={14} /></span>
        <span className="gorev-liste-sec-title">{pano.baslik}</span>
        <span className="gorev-liste-sec-count">{gorevler.length}</span>
      </div>
      {!collapsed && gorevler.map(g => (
        <GorevRow key={g.id} gorev={g} checked={selected.has(g.id)}
          onCheck={v => onToggleOne(g.id, v)}
          onEdit={() => onEdit(g)}
          onArchive={() => onArchive(g.id)}
          onDelete={() => onDelete(g.id)} />
      ))}
    </div>
  );
}

// ── Taşı dropdown ─────────────────────────────────────────────────────────────
function TasiDropdown({ panolar, onPick, onClose, anchorRef }: {
  panolar: Pano[]; onPick: (key: string) => void; onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const panRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left });
    }
    function onDown(e: MouseEvent) {
      if (panRef.current?.contains(e.target as Node)) return;
      if (anchorRef.current?.contains(e.target as Node)) return;
      onClose();
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [anchorRef, onClose]);

  const dropdown = (
    <div ref={panRef} role="menu" style={{ position: "fixed", top: pos.top, left: pos.left, minWidth: 180, zIndex: 9999, background: "#fff", border: "1px solid var(--line)", borderRadius: 9, boxShadow: "0 12px 30px rgba(19,43,70,.13)", padding: ".3rem", animation: "profile-menu-in .12s ease-out" }}>
      <p style={{ fontSize: ".58rem", fontWeight: 850, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase", padding: ".35rem .65rem .2rem", margin: 0 }}>Pano seçin</p>
      {panolar.map(p => (
        <button key={p.key} role="menuitem" onClick={() => { onPick(p.key); onClose(); }}
          style={{ width: "100%", padding: ".44rem .65rem", border: 0, borderRadius: 6, background: "transparent", color: "#3f556a", font: "inherit", fontSize: ".7rem", fontWeight: 700, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: ".4rem" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--canvas)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          {p.baslik}
        </button>
      ))}
    </div>
  );

  return typeof document !== "undefined" ? createPortal(dropdown, document.body) : null;
}

// ── Ana sayfa ─────────────────────────────────────────────────────────────────
export function TaskBoardContent() {
  const [panolar,      setPanolar]      = useState<Pano[]>(INIT_PANOLAR);
  const [gorevler,     setGorevler]     = useState<Gorev[]>(INIT_GOREVLER);
  const [selected,     setSelected]     = useState<Set<number>>(new Set());
  const [gorevModal,   setGorevModal]   = useState(false);
  const [editingGorev, setEditingGorev] = useState<Gorev | null>(null);
  const [panoModal,    setPanoModal]    = useState(false);
  const [tasiOpen,     setTasiOpen]     = useState(false);
  const tasiRef = useRef<HTMLButtonElement>(null);

  const maxSira    = panolar.reduce((m, p) => Math.max(m, p.sira), 0);
  const selCount   = selected.size;
  const hasSelected = selCount > 0;

  function toggleAll(ids: number[], check: boolean) {
    setSelected(prev => {
      const next = new Set(prev);
      ids.forEach(id => check ? next.add(id) : next.delete(id));
      return next;
    });
  }

  function toggleOne(id: number, check: boolean) {
    setSelected(prev => { const n = new Set(prev); check ? n.add(id) : n.delete(id); return n; });
  }

  function addGorev(g: Omit<Gorev, "id"> & { id?: number }) {
    setGorevler(prev => [{ id: ++_nextId, ...g } as Gorev, ...prev]);
  }

  function updateGorev(g: Omit<Gorev, "id"> & { id?: number }) {
    setGorevler(prev => prev.map(e => e.id === g.id ? { ...e, ...g } as Gorev : e));
  }

  function archiveOne(id: number) {
    setGorevler(prev => prev.filter(g => g.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  function archiveSelected() {
    setGorevler(prev => prev.filter(g => !selected.has(g.id)));
    setSelected(new Set());
  }

  function deleteOne(id: number) {
    setGorevler(prev => prev.filter(g => g.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  function moveSelected(panoKey: string) {
    setGorevler(prev => prev.map(g => selected.has(g.id) ? { ...g, pano: panoKey } : g));
    setSelected(new Set());
  }

  function addPano(p: Omit<Pano, "key">) {
    setPanolar(prev => [...prev, { key: `pano-${Date.now()}`, ...p }]);
  }

  const sorted = [...panolar].sort((a, b) => a.sira - b.sira);

  return (
    <>
      <div className="gorev-liste-page">
        {/* Başlık / aksiyonlar */}
        <header className="orders-hero" style={{ alignItems: "flex-end" }}>
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Görev Listesi</h1>
          </div>
          <div style={{ display: "flex", gap: ".55rem", alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" className="orders-create" onClick={() => setGorevModal(true)}>
              <Icon name="plus" size={15} /> Yeni Görev Ekle
            </button>
            <button type="button" className="orders-create" style={{ background: "var(--blue)", boxShadow: "0 8px 18px rgba(23,117,169,.2)" }} onClick={() => setPanoModal(true)}>
              <Icon name="plus" size={15} /> Yeni Pano Ekle
            </button>

            {/* Taşı */}
            <button ref={tasiRef} type="button" disabled={!hasSelected}
              className={`gl-bulk-btn${hasSelected ? " active" : ""}`}
              onClick={() => hasSelected && setTasiOpen(o => !o)}>
              <Icon name="move" size={15} /> Taşı
            </button>
            {tasiOpen && (
              <TasiDropdown panolar={sorted} onPick={moveSelected} onClose={() => setTasiOpen(false)} anchorRef={tasiRef} />
            )}

            {/* Arşivle */}
            <button type="button" disabled={!hasSelected}
              className={`gl-bulk-btn${hasSelected ? " active" : ""}`}
              onClick={() => { if (hasSelected) archiveSelected(); }}>
              <Icon name="archive" size={15} /> Arşivle
            </button>

            {hasSelected && (
              <span className="gl-sel-hint">{selCount} görev seçildi</span>
            )}
          </div>
        </header>

        {/* Bölümler */}
        {sorted.map(pano => {
          const cards = gorevler.filter(g => g.pano === pano.key);
          return (
            <SectionGroup
              key={pano.key}
              pano={pano}
              gorevler={cards}
              selected={selected}
              onToggleAll={toggleAll}
              onToggleOne={toggleOne}
              onEdit={setEditingGorev}
              onArchive={archiveOne}
              onDelete={deleteOne}
            />
          );
        })}
      </div>

      {gorevModal && (
        <GorevModal panolar={panolar} onClose={() => setGorevModal(false)}
          onSave={g => { addGorev(g); setGorevModal(false); }} />
      )}
      {editingGorev && (
        <GorevModal panolar={panolar} initial={editingGorev} onClose={() => setEditingGorev(null)}
          onSave={g => { updateGorev(g); setEditingGorev(null); }} />
      )}
      {panoModal && (
        <PanoEkleModal mevcutSira={maxSira} onClose={() => setPanoModal(false)}
          onSave={p => { addPano(p); setPanoModal(false); }} />
      )}
    </>
  );
}

export default function GorevListesiPage() {
  return <AdminShell><TaskBoardContent /></AdminShell>;
}
