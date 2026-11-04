"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { DatePicker } from "../../../components/DatePicker";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { Egitim, EgitimDurum, EgitimTur, EsnekKota, Sertifika, mockCustomers } from "./data";

const MODULES = ["MODÜL 1", "MODÜL 2", "MODÜL 3", "MODÜL 4", "MODÜL 5", "MODÜL 6", "MODÜL 7", "MODÜL 8", "MODÜL 12", "MODÜL 14", "MODÜL 15", "MENTÖRLÜK", "ÖZEL"];

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  book: "M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-8,160H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40H200Z",
  image: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z",
  users: "M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z",
} as const;

export type EducationDraft = Omit<Egitim, "id" | "katilan" | "baslamaFull" | "bitisFull">;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function money(value: string) {
  const amount = Number(value);
  if (!value.trim() || !Number.isFinite(amount)) return "—";
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(amount)} TL`;
}

export function EducationEditor({
  initial,
  basePath,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: Egitim;
  basePath: string;
  submitLabel: string;
  onSubmit: (value: EducationDraft) => void;
  onDelete?: () => void;
}) {
  const [adi, setAdi] = useState(initial?.adi ?? "");
  const [aciklama, setAciklama] = useState(initial?.aciklama ?? "");
  const [eiUrl, setEiUrl] = useState(initial?.eiUrl ?? "");
  const [canliUrl, setCanliUrl] = useState(initial?.canliUrl ?? "");
  const [imgUrl, setImgUrl] = useState(initial?.imgUrl ?? "");
  const [ucret, setUcret] = useState(initial ? String(initial.ucret) : "");
  const [baslama, setBaslama] = useState(initial?.baslama ?? "");
  const [bitis, setBitis] = useState(initial?.bitis ?? "");
  const [kota, setKota] = useState(initial ? String(initial.kota) : "");
  const [esnekKota, setEsnekKota] = useState<EsnekKota>(initial?.esnekKota ?? "Esnek Değil");
  const [moduller, setModuller] = useState<string[]>(initial?.moduller ?? []);
  const [modulInput, setModulInput] = useState("");
  const [tur, setTur] = useState<EgitimTur>(initial?.tur ?? "Online");
  const [erisimZamani, setErisimZamani] = useState(initial ? String(initial.erisimZamani) : "");
  const [durum, setDurum] = useState<EgitimDurum>(initial?.durum ?? "Aktif");
  const [sertifika, setSertifika] = useState<Sertifika>(initial?.sertifika ?? "Sertifikasız");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const moduleRef = useRef<HTMLInputElement>(null);
  const suggestions = MODULES.filter((item) => !moduller.includes(item) && item.toLocaleLowerCase("tr-TR").includes(modulInput.trim().toLocaleLowerCase("tr-TR")));

  function addModule(value: string) {
    const next = value.trim().toUpperCase();
    if (next && !moduller.includes(next)) setModuller((current) => [...current, next]);
    setModulInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adi.trim()) {
      setError("Eğitim adı zorunludur.");
      return;
    }
    onSubmit({
      adi: adi.trim(),
      aciklama: aciklama.trim(),
      tur,
      kota: Number(kota) || 0,
      esnekKota,
      durum,
      baslama,
      bitis,
      ucret: Number(ucret) || 0,
      eiUrl: eiUrl.trim(),
      canliUrl: canliUrl.trim(),
      imgUrl: imgUrl.trim(),
      moduller,
      erisimZamani: Number(erisimZamani) || 0,
      sertifika,
    });
  }

  function downloadCustomers() {
    const header = "No,Kullanıcı,Sipariş kodu,Kayıt tarihi,GSM,E-posta,Durum";
    const rows = mockCustomers.map((customer) => [customer.no, customer.kullanici, customer.siparisKodu, customer.tarih, customer.gsm, customer.email, customer.durum].join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "egitim-musterileri.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Eğitim listesine dön</Link>
      <form className="stype-layout" onSubmit={handleSubmit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="book" size={18} /></span><h2>Eğitim</h2></header>
            <label className="stype-field"><span>Eğitim adı</span><input value={adi} onChange={(event) => { setAdi(event.target.value); setError(""); }} placeholder="Eğitim adı" autoFocus /></label>
            <label className="stype-field"><span>Açıklama</span><textarea value={aciklama} onChange={(event) => setAciklama(event.target.value)} placeholder="Eğitimi kısa ve net biçimde anlatın" /></label>
            <div className="stype-grid two">
              <label className="stype-field"><span>Tür</span><SystemDropdown value={tur} onChange={(value) => setTur(value as EgitimTur)} ariaLabel="Eğitim türü" options={[{ value: "Online", label: "Online" }, { value: "Offline", label: "Offline" }]} /></label>
              <label className="stype-field"><span>Yayın durumu</span><SystemDropdown value={durum} onChange={(value) => setDurum(value as EgitimDurum)} ariaLabel="Yayın durumu" options={[{ value: "Aktif", label: "Aktif" }, { value: "Pasif", label: "Pasif" }]} /></label>
            </div>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="users" size={18} /></span><h2>Ücret ve kota</h2></header>
            <div className="stype-grid two">
              <label className="stype-field"><span>Ücret (TL)</span><input value={ucret} onChange={(event) => setUcret(event.target.value)} type="number" min="0" placeholder="0" /></label>
              <label className="stype-field"><span>Kota</span><input value={kota} onChange={(event) => setKota(event.target.value)} type="number" min="0" placeholder="30" /></label>
            </div>
            <div className="stype-grid two">
              <label className="stype-field"><span>Kota esnekliği</span><SystemDropdown value={esnekKota} onChange={(value) => setEsnekKota(value as EsnekKota)} ariaLabel="Kota esnekliği" options={[{ value: "Esnek Değil", label: "Esnek değil" }, { value: "Esnek", label: "Esnek" }]} /></label>
              <label className="stype-field"><span>Erişim (ay)</span><input value={erisimZamani} onChange={(event) => setErisimZamani(event.target.value)} type="number" min="0" placeholder="12" /></label>
            </div>
            <label className="stype-field"><span>Sertifika</span><SystemDropdown value={sertifika} onChange={(value) => setSertifika(value as Sertifika)} ariaLabel="Sertifika durumu" options={[{ value: "Sertifikasız", label: "Sertifikasız" }, { value: "Sertifikalı", label: "Sertifikalı" }]} /></label>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="book" size={18} /></span><h2>Tarih</h2></header>
            <div className="stype-grid two">
              <label className="stype-field"><span>Başlangıç</span><DatePicker value={baslama} onChange={setBaslama} /></label>
              <label className="stype-field"><span>Bitiş</span><DatePicker value={bitis} onChange={setBitis} /></label>
            </div>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="image" size={18} /></span><h2>Bağlantı ve görsel</h2></header>
            <label className="stype-field"><span>eistatistik adresi</span><input value={eiUrl} onChange={(event) => setEiUrl(event.target.value)} placeholder="https://eistatistik.com/…" /></label>
            <label className="stype-field"><span>Canlı yayın adresi</span><input value={canliUrl} onChange={(event) => setCanliUrl(event.target.value)} placeholder="https://…" /></label>
            <div className="stype-field">
              <span>Eğitim görseli</span>
              <button className="elist-file" type="button" onClick={() => fileRef.current?.click()}>{imgUrl || "900 × 500 görsel seç"}</button>
              <input ref={fileRef} className="admin-form-file-input" type="file" accept="image/*" onChange={(event) => setImgUrl(event.target.files?.[0]?.name ?? imgUrl)} />
              <small>Önerilen ölçü 900 × 500.</small>
            </div>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="book" size={18} /></span><h2>Modüller</h2></header>
            <div className="stype-field">
              <span>Modül ekle</span>
              <div className="elist-modules" onClick={() => moduleRef.current?.focus()}>
                {moduller.map((item) => (
                  <span key={item}>{item}<button type="button" aria-label={`${item} kaldır`} onClick={(event) => { event.stopPropagation(); setModuller((current) => current.filter((module) => module !== item)); }}>×</button></span>
                ))}
                <input
                  ref={moduleRef}
                  value={modulInput}
                  onChange={(event) => setModulInput(event.target.value.toUpperCase())}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addModule(modulInput); } }}
                  placeholder={moduller.length === 0 ? "Modül adı" : ""}
                  aria-label="Modül adı"
                />
              </div>
              <small>Enter ile eklenir. Listeden de seçebilirsiniz.</small>
              {modulInput && suggestions.length > 0 && (
                <div className="elist-suggest">
                  {suggestions.map((item) => <button key={item} type="button" onClick={() => addModule(item)}>+ {item}</button>)}
                </div>
              )}
            </div>
          </section>

          {initial && (
            <section className="fav-card elist-people" aria-label="Kayıtlı müşteriler">
              <header>
                <span className="fav-mark"><Icon name="users" size={18} /></span>
                <h2>Kayıtlı müşteriler</h2>
                <button type="button" onClick={downloadCustomers}>Excel</button>
              </header>
              <ul>
                {mockCustomers.map((customer) => (
                  <li key={customer.no}>
                    <strong>{customer.kullanici}</strong>
                    <span>{customer.siparisKodu}</span>
                    <small>{customer.tarih} · {customer.email}</small>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onDelete && <button className="fav-delete" type="button" onClick={onDelete}>Eğitimi sil</button>}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card elist-preview" aria-label="Eğitim önizlemesi">
          <div className="elist-preview-media"><Icon name="image" size={28} /><span>{imgUrl || "900 × 500"}</span></div>
          <div className="elist-preview-copy">
            <span className={`stype-status ${durum === "Aktif" ? "aktif" : "pasif"}`}>{durum}</span>
            <h2>{adi.trim() || "Eğitim adı"}</h2>
            <p>{aciklama.trim() || "Açıklama burada görünecek."}</p>
            <dl>
              <div><dt>Ücret</dt><dd>{money(ucret)}</dd></div>
              <div><dt>Tarih</dt><dd>{baslama || bitis ? `${baslama || "—"} – ${bitis || "—"}` : "—"}</dd></div>
              <div><dt>Kota</dt><dd>{kota || "—"} · {esnekKota}</dd></div>
              <div><dt>Tür</dt><dd>{tur}</dd></div>
              <div><dt>Erişim</dt><dd>{erisimZamani ? `${erisimZamani} ay` : "—"}</dd></div>
              <div><dt>Sertifika</dt><dd>{sertifika}</dd></div>
              <div><dt>Modüller</dt><dd>{moduller.join(" · ") || "—"}</dd></div>
            </dl>
          </div>
        </aside>
      </form>
    </div>
  );
}
