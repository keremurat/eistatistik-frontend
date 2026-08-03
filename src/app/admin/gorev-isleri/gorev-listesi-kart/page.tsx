"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../../AdminShell";
import { DatePicker } from "../../../components/DatePicker";
import { TimePicker } from "../../../components/TimePicker";

// ── Tipler ────────────────────────────────────────────────────────────────────
type EtiketKey = "Acil" | "Hatırlatma" | "Bilgilendirme" | "Teslimat" | "Rapor Teslim" | "Ek Analiz";

interface YapilanItem { id: number; metin: string; tamamlandi: boolean; }
interface Gorev {
  id: number;
  baslik: string;
  pano: string;
  etiket: EtiketKey;
  tarih: string;
  siparisKodu?: string;
  musteriAdi?: string;
  musteriTel?: string;
  aciklama: string;
  atanan: string;
  yapilanlar: YapilanItem[];
}
interface Pano { key: string; baslik: string; sira: number; }

// ── Mock veri ─────────────────────────────────────────────────────────────────
const INIT_PANOLAR: Pano[] = [
  { key: "yapilacaklar", baslik: "YAPILACAKLAR", sira: 1 },
  { key: "yapiliyor",    baslik: "YAPILIYOR",    sira: 2 },
  { key: "yapildi",      baslik: "YAPILDI",      sira: 3 },
];

let _nextId = 100;
const INIT_GOREVLER: Gorev[] = [
  { id: 1,  baslik: "EĞİTİM",                   pano: "yapilacaklar", etiket: "Hatırlatma", tarih: "03.07.2026 15:26", aciklama: "Hocam müsait olduğunuzda (en kısa sürede) MODÜL 17 ve 18 eğitimleri offline olarak sisteme yükleyebilir misiniz?", atanan: "NACİ MURAT", yapilanlar: [] },
  { id: 2,  baslik: "BİLGİLENDİRME",            pano: "yapilacaklar", etiket: "Acil",       tarih: "13.07.2026 13:30", siparisKodu: "SA251007010", musteriAdi: "FEYZA MOLLAİBRAHİMOĞLU", musteriTel: "553 576 54 70", aciklama: "Ek analiz ödemeyini yapınca yazışması kapandı, geldiğinde bakabilir misiniz? ***TESLİMAT TARİHİ 4 AĞUSTOS SALI", atanan: "MEHMET MEŞE", yapilanlar: [] },
  { id: 3,  baslik: "Teslimat",                  pano: "yapilacaklar", etiket: "Acil",       tarih: "21.07.2026 16:57", siparisKodu: "SA260708001", musteriAdi: "AHMET TAHA KAYAOĞLU",   musteriTel: "539 929 17 38", aciklama: "Teslimat tarihi 31 Temmuz cuma ***pazartesi online görüşme ile birlikte teslim edilecek.", atanan: "ALİHSAN ŞÜKÜR", yapilanlar: [] },
  { id: 4,  baslik: "Rapor Güncelleme",          pano: "yapilacaklar", etiket: "Rapor Teslim", tarih: "28.07.2026 11:10", siparisKodu: "SA260715003", musteriAdi: "SELİN ÖZTÜRK", musteriTel: "532 445 87 20", aciklama: "Müşteri raporda tablo düzenlemesi istiyor, geri bildirim beklenecek.", atanan: "SÜMEYYE İNAN", yapilanlar: [] },
  { id: 5,  baslik: "HATIRLATMA",                pano: "yapiliyor",    etiket: "Acil",       tarih: "08.06.2026 16:45", musteriAdi: "MERVE ALPAY",             musteriTel: "505 787 87 99", aciklama: "DÜZCE ÜNİ. Tıbbi Biyokimya Eylül başında webinar için aranacak.", atanan: "SÜMEYYE İNAN", yapilanlar: [] },
  { id: 6,  baslik: "Ek Analiz Ücreti Verilecek", pano: "yapiliyor",   etiket: "Ek Analiz",  tarih: "31.07.2026 09:28", siparisKodu: "SA260301001", musteriAdi: "ENİS ULUSOY",            musteriTel: "531 308 61 21", aciklama: "", atanan: "NACİ MURAT", yapilanlar: [] },
  { id: 7,  baslik: "BEYZA NUR CAN",             pano: "yapildi",      etiket: "Hatırlatma", tarih: "01.08.2026 18:00", siparisKodu: "TR260731004", musteriAdi: "BEYZA NUR CAN",          musteriTel: "546 673 20 76", aciklama: "Ücret belirlendiği halde müşteri ödeme yapmadı. Siparişinin ücretlendirildiği hatırlatılacak!", atanan: "EİSTATİSTİK ANALİZÖR", yapilanlar: [] },
  { id: 8,  baslik: "Eğitim",                    pano: "yapildi",      etiket: "Acil",       tarih: "01.08.2026 12:38", siparisKodu: "TR260716007", musteriAdi: "GİZEM ZEVDE AYDIN",      musteriTel: "553 986 57 97", aciklama: "Tekrar aradım, tel kullanılmamakta, ödeme yapmadı. Sistemden yazmıştım dönüş yok, iptal ediyorum.", atanan: "SÜMEYYE İNAN", yapilanlar: [] },
  { id: 9,  baslik: "Eğitim",                    pano: "yapildi",      etiket: "Acil",       tarih: "01.08.2026 12:43", siparisKodu: "TR260723004", musteriAdi: "MUSTAFA ÇOBANER",        musteriTel: "541 363 07 07", aciklama: "Henüz düşünme aşamasındayım dedi. Salı günü tekrar arayacağım, netleşmiş olacak.", atanan: "SÜMEYYE İNAN", yapilanlar: [] },
  { id: 10, baslik: "Bilgilendirme",              pano: "yapildi",      etiket: "Bilgilendirme", tarih: "28.07.2026 10:15", siparisKodu: "SA260722001", musteriAdi: "CAN DEMİR", musteriTel: "544 231 09 88", aciklama: "Analiz tamamlandı, müşteriye bildirim gönderildi.", atanan: "NACİ MURAT", yapilanlar: [] },
];

// ── Atanabilir kullanıcılar (Admin + Analistler) ─────────────────────────────
interface AtanabilirKullanici { value: string; label: string; rol: "Admin" | "Analist" | "Asistan"; }
const ATANABILIR: AtanabilirKullanici[] = [
  { value: "KEREM MURAT",           label: "Kerem Murat",           rol: "Admin"    },
  { value: "NACİ MURAT",            label: "Naci Murat",            rol: "Analist"  },
  { value: "SÜMEYYE İNAN",          label: "Sümeyye İnan",          rol: "Analist"  },
  { value: "MEHMET MEŞE",           label: "Mehmet Meşe",           rol: "Analist"  },
  { value: "ALİHSAN ŞÜKÜR",         label: "Alihsan Şükür",         rol: "Analist"  },
  { value: "EİSTATİSTİK ANALİZÖR",  label: "Eistatistik Analizör",  rol: "Analist"  },
  { value: "EMRE KAYA",             label: "Emre Kaya",             rol: "Asistan"  },
  { value: "DİLARA YILMAZ",         label: "Dilara Yılmaz",         rol: "Asistan"  },
];

const ROL_RENK: Record<AtanabilirKullanici["rol"], { bg: string; color: string }> = {
  Admin:   { bg: "#fff3f2", color: "#c85a51" },
  Analist: { bg: "var(--blue-soft)", color: "var(--blue)" },
  Asistan: { bg: "#f0faf6", color: "#287a55" },
};

// ── Etiket renk eşleşmesi ─────────────────────────────────────────────────────
const ETIKET_CLS: Record<EtiketKey, string> = {
  "Acil":          "gorev-etiket gorev-etiket-acil",
  "Hatırlatma":    "gorev-etiket gorev-etiket-hatirlatma",
  "Bilgilendirme": "gorev-etiket gorev-etiket-bilgilendirme",
  "Teslimat":      "gorev-etiket gorev-etiket-teslimat",
  "Rapor Teslim":  "gorev-etiket gorev-etiket-rapor",
  "Ek Analiz":     "gorev-etiket gorev-etiket-ekanaliz",
};
const ETIKET_LIST: EtiketKey[] = ["Acil", "Hatırlatma", "Bilgilendirme", "Teslimat", "Rapor Teslim", "Ek Analiz"];

// ── İkon ─────────────────────────────────────────────────────────────────────
type IName = "folder" | "plus" | "x" | "dots" | "trash" | "edit" | "check";
function Icon({ name, size = 16 }: { name: IName; size?: number }) {
  const p: Record<IName, React.ReactNode> = {
    folder: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></>,
    plus:   <><path d="M12 5v14M5 12h14" /></>,
    x:      <><path d="m18 6-12 12M6 6l12 12" /></>,
    dots:   <><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
    trash:  <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></>,
    edit:   <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    check:  <><path d="M20 6 9 17l-5-5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>;
}

// ── SimpleSelect (portal, arama yok) ─────────────────────────────────────────
interface SSOption { value: string; label: string; meta?: string; metaBg?: string; metaColor?: string; }
function SimpleSelect({ id, value, onChange, options, placeholder = "Seçin" }: {
  id?: string; value: string; onChange: (v: string) => void;
  options: SSOption[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0 });
  const trigRef = useRef<HTMLButtonElement>(null);
  const panRef  = useRef<HTMLDivElement>(null);
  const ITEM_H  = 44; const PAD = 10;
  const panH    = options.length * ITEM_H + PAD;

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (trigRef.current?.contains(e.target as Node)) return;
      if (panRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown",   onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function toggle() {
    if (!trigRef.current) return;
    const r = trigRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom - 8;
    const top = spaceBelow < panH ? r.top - panH - 4 : r.bottom + 4;
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
          {o.meta && (
            <span style={{ fontSize: ".54rem", fontWeight: 800, padding: ".15rem .45rem", borderRadius: 99, background: o.metaBg ?? "var(--canvas)", color: o.metaColor ?? "var(--muted)", letterSpacing: ".04em" }}>
              {o.meta}
            </span>
          )}
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
          {selected ? (
            <>
              <span>{selected.label}</span>
              {selected.meta && (
                <span style={{ fontSize: ".52rem", fontWeight: 800, padding: ".12rem .4rem", borderRadius: 99, background: selected.metaBg ?? "var(--canvas)", color: selected.metaColor ?? "var(--muted)" }}>
                  {selected.meta}
                </span>
              )}
            </>
          ) : <span className="cs-placeholder">{placeholder}</span>}
        </span>
        <span className="cs-arrow">▾</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </>
  );
}

// ── Kart 3-nokta menüsü ───────────────────────────────────────────────────────
function CardMenu({ onDelete }: { onDelete: () => void }) {
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
    document.addEventListener("keydown",   onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function toggle() {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.right - 140 });
    setOpen(o => !o);
  }

  const menu = (
    <div ref={panRef} role="menu" style={{
      position: "fixed", top: pos.top, left: pos.left, width: 140, zIndex: 9999,
      background: "#fff", border: "1px solid var(--line)", borderRadius: 9,
      boxShadow: "0 12px 30px rgba(19,43,70,.13)", padding: ".3rem",
      animation: "profile-menu-in .12s ease-out",
    }}>
      <button role="menuitem" onClick={() => setOpen(false)} style={{
        width: "100%", padding: ".45rem .65rem", border: 0, borderRadius: 6,
        background: "transparent", color: "#3f556a", font: "inherit",
        fontSize: ".7rem", fontWeight: 700, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: ".45rem",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--canvas)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <Icon name="edit" size={14} />Düzenle
      </button>
      <button role="menuitem" onClick={() => { setOpen(false); onDelete(); }} style={{
        width: "100%", padding: ".45rem .65rem", border: 0, borderRadius: 6,
        background: "transparent", color: "#c85a51", font: "inherit",
        fontSize: ".7rem", fontWeight: 700, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: ".45rem",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "#fff3f2")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <Icon name="trash" size={14} />Sil
      </button>
    </div>
  );

  return (
    <>
      <button ref={btnRef} type="button" aria-haspopup="menu" aria-expanded={open} onClick={toggle}
        style={{ width: 28, height: 28, border: "1px solid var(--line)", borderRadius: 6, background: "#fff", color: "var(--muted)", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0, transition: ".1s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--canvas)")}
        onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
        aria-label="Kart seçenekleri">
        <Icon name="dots" size={16} />
      </button>
      {open && typeof document !== "undefined" && createPortal(menu, document.body)}
    </>
  );
}

// ── Görev kartı ───────────────────────────────────────────────────────────────
function GorevCard({ gorev, onDelete }: { gorev: Gorev; onDelete: () => void }) {
  return (
    <article className="gorev-card">
      <div className="gorev-card-top">
        <span className={ETIKET_CLS[gorev.etiket]}>{gorev.etiket}</span>
        <span className="gorev-card-tarih">{gorev.tarih}</span>
      </div>
      <p className="gorev-card-title">{gorev.baslik}</p>
      {gorev.siparisKodu && (
        <div className="gorev-card-meta">
          <span className="gorev-card-meta-icon"><Icon name="folder" size={13} /></span>
          <span>{gorev.siparisKodu}</span>
        </div>
      )}
      {gorev.musteriAdi && (
        <div className="gorev-card-meta">
          <span className="gorev-card-meta-icon"><Icon name="folder" size={13} /></span>
          <span>{gorev.musteriAdi}{gorev.musteriTel ? ` — ${gorev.musteriTel}` : ""}</span>
        </div>
      )}
      {gorev.aciklama && <p className="gorev-card-desc">{gorev.aciklama}</p>}
      <div className="gorev-card-foot">
        <span className="gorev-card-atanan">{gorev.atanan}</span>
        <CardMenu onDelete={onDelete} />
      </div>
    </article>
  );
}

// ── Yeni Görev modalı ─────────────────────────────────────────────────────────
function GorevEkleModal({ panolar, onClose, onSave }: {
  panolar: Pano[];
  onClose: () => void;
  onSave: (g: Omit<Gorev, "id">) => void;
}) {
  const [baslik,   setBaslik]   = useState("");
  const [pano,     setPano]     = useState(panolar[0]?.key ?? "");
  const [atanan,   setAtanan]   = useState(ATANABILIR[0].value);
  const [tarih,    setTarih]    = useState("");
  const [saat,     setSaat]     = useState("");
  const [etiket,   setEtiket]   = useState<EtiketKey>("Acil");
  const [aciklama, setAciklama] = useState("");
  const [yapilanlar, setYapilanlar] = useState<YapilanItem[]>([]);
  const [saved,    setSaved]    = useState(false);

  function addYapilanlar() {
    setYapilanlar(prev => [...prev, { id: Date.now(), metin: "", tamamlandi: false }]);
  }
  function updateYapilanlar(id: number, metin: string) {
    setYapilanlar(prev => prev.map(y => y.id === id ? { ...y, metin } : y));
  }
  function removeYapilanlar(id: number) {
    setYapilanlar(prev => prev.filter(y => y.id !== id));
  }

  function handleSave() {
    if (!baslik.trim()) return;
    const tarihStr = [tarih, saat].filter(Boolean).join(" ");
    onSave({
      baslik: baslik.trim(), pano, etiket, atanan: atanan.trim(),
      tarih: tarihStr || new Date().toLocaleDateString("tr-TR"),
      aciklama: aciklama.trim(),
      yapilanlar: yapilanlar.filter(y => y.metin.trim()),
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 700);
  }

  const panoOptions   = panolar.map(p => ({ value: p.key, label: p.baslik }));
  const etiketOptions = ETIKET_LIST.map(e => ({ value: e, label: e }));
  const atananOptions = ATANABILIR.map(k => ({
    value:     k.value,
    label:     k.label,
    meta:      k.rol,
    metaBg:    ROL_RENK[k.rol].bg,
    metaColor: ROL_RENK[k.rol].color,
  }));

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="gm-title">
        <header className="admin-modal-head">
          <h2 id="gm-title">Kart Bilgileri</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Kapat">×</button>
        </header>

        <div className="admin-modal-body">
          {/* Satır 1: Başlık + Pano */}
          <div className="admin-modal-grid-2">
            <div className="form-field">
              <label htmlFor="gm-baslik">İş Başlığı</label>
              <input id="gm-baslik" type="text" placeholder="Görev başlığı"
                value={baslik} onChange={e => setBaslik(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="gm-pano">Pano Adı</label>
              <SimpleSelect id="gm-pano" value={pano} onChange={setPano} options={panoOptions} placeholder="Pano seçin" />
            </div>
          </div>

          {/* Satır 2: Atananlar + Bitirme Zamanı + Etiket */}
          <div className="admin-modal-grid-3">
            <div className="form-field">
              <label htmlFor="gm-atanan">Atananlar</label>
              <SimpleSelect id="gm-atanan" value={atanan} onChange={setAtanan}
                options={atananOptions} placeholder="Kişi seçin" />
            </div>
            <div className="form-field">
              <label>Bitirme Zamanı</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".4rem" }}>
                <DatePicker value={tarih} onChange={setTarih} placeholder="GG.AA.YYYY" />
                <TimePicker value={saat}  onChange={setSaat} />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="gm-etiket">Etiket</label>
              <SimpleSelect id="gm-etiket" value={etiket} onChange={v => setEtiket(v as EtiketKey)} options={etiketOptions} />
            </div>
          </div>

          {/* Açıklama */}
          <div className="form-field">
            <label htmlFor="gm-aciklama">Açıklama</label>
            <textarea id="gm-aciklama" rows={4} placeholder="Görev açıklaması veya notlar…"
              value={aciklama} onChange={e => setAciklama(e.target.value)}
              style={{ resize: "vertical" }} />
          </div>

          {/* Yapılacaklar listesi */}
          <div className="form-field">
            <label>Yapılacaklar Listesi</label>
            <div className="yapilanlar-list">
              {yapilanlar.map(y => (
                <div key={y.id} className="yapilanlar-item">
                  <input className="yapilanlar-input" type="text" placeholder="Yapılacak madde…"
                    value={y.metin} onChange={e => updateYapilanlar(y.id, e.target.value)} />
                  <button type="button" className="yapilanlar-remove" onClick={() => removeYapilanlar(y.id)} aria-label="Kaldır">
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ))}
              <button type="button" className="yapilanlar-add" onClick={addYapilanlar}>
                <Icon name="plus" size={13} /> Ekle
              </button>
            </div>
          </div>
        </div>

        <footer className="admin-modal-foot">
          <button className="btn-cancel" onClick={onClose}>Kapat</button>
          <button className="btn-save" onClick={handleSave} disabled={!baslik.trim()}
            style={saved ? { background: "#287a55" } : {}}>
            {saved ? <><Icon name="check" size={14} /> Kaydedildi</> : "Kaydet"}
          </button>
        </footer>
      </section>
    </div>
  );
}

// ── Yeni Pano modalı ──────────────────────────────────────────────────────────
function PanoEkleModal({ onClose, onSave, mevcutSira }: {
  onClose: () => void;
  onSave: (p: Omit<Pano, "key">) => void;
  mevcutSira: number;
}) {
  const [baslik,   setBaslik]   = useState("");
  const [sira,     setSira]     = useState(String(mevcutSira + 1));
  const [aciklama, setAciklama] = useState("");
  const [saved,    setSaved]    = useState(false);

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
              <div className="form-field">
                <label htmlFor="pm-baslik">Pano Başlığı</label>
                <input id="pm-baslik" type="text" placeholder="Pano başlığı"
                  value={baslik} onChange={e => setBaslik(e.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="pm-sira">Pano Sırası</label>
                <input id="pm-sira" type="number" min={1}
                  value={sira} onChange={e => setSira(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="pm-aciklama">Açıklama</label>
              <textarea id="pm-aciklama" rows={3} placeholder="Açıklama"
                value={aciklama} onChange={e => setAciklama(e.target.value)}
                style={{ resize: "vertical" }} />
            </div>
          </div>
        </div>

        <footer className="admin-modal-foot">
          <button className="btn-cancel" onClick={onClose}>Kapat</button>
          <button className="btn-save" onClick={handleSave} disabled={!baslik.trim()}
            style={saved ? { background: "#287a55" } : {}}>
            {saved ? <><Icon name="check" size={14} /> Kaydedildi</> : "Kaydet"}
          </button>
        </footer>
      </section>
    </div>
  );
}

// ── Ana sayfa ─────────────────────────────────────────────────────────────────
export default function GorevListesiKartPage() {
  const [panolar,   setPanolar]   = useState<Pano[]>(INIT_PANOLAR);
  const [gorevler,  setGorevler]  = useState<Gorev[]>(INIT_GOREVLER);
  const [gorevModal, setGorevModal] = useState(false);
  const [panoModal,  setPanoModal]  = useState(false);

  const maxSira = panolar.reduce((m, p) => Math.max(m, p.sira), 0);

  function addGorev(g: Omit<Gorev, "id">) {
    setGorevler(prev => [{ id: ++_nextId, ...g }, ...prev]);
  }

  function addPano(p: Omit<Pano, "key">) {
    const key = `pano-${Date.now()}`;
    setPanolar(prev => [...prev, { key, ...p }]);
  }

  function deleteGorev(id: number) {
    setGorevler(prev => prev.filter(g => g.id !== id));
  }

  const sorted = [...panolar].sort((a, b) => a.sira - b.sira);

  return (
    <AdminShell>
      <div className="kanban-page">
        <div className="kanban-header">
          <h1 className="kanban-title">Görev Listesi</h1>
          <button type="button" className="orders-create" onClick={() => setGorevModal(true)}>
            <Icon name="plus" size={15} /> Yeni Görev Ekle
          </button>
          <button type="button" className="orders-create" style={{ background: "var(--blue)", boxShadow: "0 8px 18px rgba(23,117,169,.2)" }}
            onClick={() => setPanoModal(true)}>
            <Icon name="plus" size={15} /> Yeni Pano Ekle
          </button>
        </div>

        <div className="kanban-board">
          {sorted.map(pano => {
            const cards = gorevler.filter(g => g.pano === pano.key);
            return (
              <div key={pano.key} className="kanban-col">
                <div className="kanban-col-head">
                  <span className="kanban-col-title">{pano.baslik}</span>
                  <span className="kanban-col-count">{cards.length}</span>
                </div>
                {cards.map(gorev => (
                  <GorevCard key={gorev.id} gorev={gorev} onDelete={() => deleteGorev(gorev.id)} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {gorevModal && (
        <GorevEkleModal
          panolar={panolar}
          onClose={() => setGorevModal(false)}
          onSave={g => { addGorev(g); setGorevModal(false); }}
        />
      )}
      {panoModal && (
        <PanoEkleModal
          mevcutSira={maxSira}
          onClose={() => setPanoModal(false)}
          onSave={p => { addPano(p); setPanoModal(false); }}
        />
      )}
    </AdminShell>
  );
}
