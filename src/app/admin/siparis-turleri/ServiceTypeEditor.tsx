"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { SystemDropdown } from "../../components/SystemDropdown";
import { ServiceOption, ServiceStatus, ServiceType } from "./serviceTypeData";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  plus: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z",
  trash: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z",
  image: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z",
  play: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z",
  info: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z",
  file: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z",
  truck: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function OptionEditor({ title, addLabel, placeholder, rows, onChange }: { title: string; addLabel: string; placeholder: string; rows: ServiceOption[]; onChange: (rows: ServiceOption[]) => void }) {
  function update(index: number, key: keyof ServiceOption, value: string) {
    onChange(rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row));
  }
  return (
    <div className="stype-options">
      <div className="stype-options-title"><strong>{title}</strong><span>Etiket solda, değer sağda.</span></div>
      <div className="stype-option-rows">
        {rows.map((row, index) => (
          <div className="stype-option-row" key={`${title}-${index}`}>
            <input value={row.label} onChange={(event) => update(index, "label", event.target.value)} placeholder={placeholder} aria-label={`${title} ${index + 1} etiketi`} />
            <input value={row.value} onChange={(event) => update(index, "value", event.target.value)} placeholder="1.0" aria-label={`${title} ${index + 1} değeri`} />
            <button type="button" onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))} aria-label={`${index + 1}. satırı kaldır`}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      <button className="stype-add" type="button" onClick={() => onChange([...rows, { label: "", value: "" }])}><Icon name="plus" size={16} />{addLabel}</button>
    </div>
  );
}

export function ServiceTypeEditor({
  initial,
  existingCodes,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: ServiceType;
  existingCodes: string[];
  submitLabel: string;
  onSubmit: (value: Omit<ServiceType, "id">) => void;
  onDelete?: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [initialFee, setInitialFee] = useState(String(initial?.initialFee ?? 0));
  const [order, setOrder] = useState(String(initial?.order ?? 1));
  const [status, setStatus] = useState<ServiceStatus>(initial?.status ?? "aktif");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [helpVideo, setHelpVideo] = useState(initial?.helpVideo ?? "");
  const [deliveryTimes, setDeliveryTimes] = useState<ServiceOption[]>(initial?.deliveryTimes ?? []);
  const [deliveryTypes, setDeliveryTypes] = useState<ServiceOption[]>(initial?.deliveryTypes ?? []);
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [automaticPricing, setAutomaticPricing] = useState(initial?.automaticPricing ?? false);
  const [error, setError] = useState("");
  const previewCode = code.trim().toUpperCase() || "KOD";
  const previewTitle = title.trim() || "Sipariş türü başlığı";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    const cleanTitle = title.trim();
    const cleanOrder = Number.parseInt(order, 10);
    if (!normalizedCode || !cleanTitle || !Number.isFinite(cleanOrder) || cleanOrder < 1) {
      setError("Kod, başlık ve geçerli bir sıralama değeri zorunludur.");
      return;
    }
    if (existingCodes.some((item) => item.toUpperCase() === normalizedCode)) {
      setError("Bu kodla tanımlanmış bir sipariş türü zaten bulunuyor.");
      return;
    }
    onSubmit({
      code: normalizedCode,
      title: cleanTitle,
      description: description.trim(),
      order: cleanOrder,
      status,
      initialFee: Number(initialFee) || 0,
      helpVideo: helpVideo.trim(),
      deliveryTimes: deliveryTimes.filter((row) => row.label.trim()),
      deliveryTypes: deliveryTypes.filter((row) => row.label.trim()),
      logoUrl: logoUrl.trim(),
      automaticPricing,
    });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href="/admin/siparis-turleri"><Icon name="back" size={16} />Sipariş türlerine dön</Link>
      <form className="stype-layout" onSubmit={handleSubmit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="info" size={18} /></span><h2>Temel bilgiler</h2></header>
            <div className="stype-grid three">
              <label className="stype-field"><span>Kod</span><input value={code} onChange={(event) => { setCode(event.target.value.toUpperCase()); setError(""); }} placeholder="Örn. SA" maxLength={8} autoFocus /></label>
              <label className="stype-field"><span>Başlık</span><input value={title} onChange={(event) => { setTitle(event.target.value); setError(""); }} placeholder="Sipariş türü adı" /></label>
              <label className="stype-field"><span>İlk ücret (TL)</span><input value={initialFee} onChange={(event) => setInitialFee(event.target.value)} type="number" min="0" step="0.01" /></label>
            </div>
            <div className="stype-grid two">
              <label className="stype-field"><span>Sıralama</span><input value={order} onChange={(event) => { setOrder(event.target.value); setError(""); }} type="number" min="1" /><small>Küçük sayı listede daha önce görünür.</small></label>
              <label className="stype-field"><span>Durum</span><SystemDropdown value={status} onChange={(value) => setStatus(value as ServiceStatus)} ariaLabel="Sipariş türü durumu" options={[{ value: "aktif", label: "Aktif" }, { value: "pasif", label: "Pasif" }]} /></label>
            </div>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="file" size={18} /></span><h2>İçerik</h2></header>
            <label className="stype-field"><span>Açıklama</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Sipariş türünü kısa ve net biçimde açıklayın" /></label>
            <label className="stype-field">
              <span>Yardım videosu</span>
              <div className="stype-video">
                <input value={helpVideo} onChange={(event) => setHelpVideo(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                <a className={!helpVideo ? "disabled" : ""} href={helpVideo || undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!helpVideo}><Icon name="play" size={16} />Önizle</a>
              </div>
              <small>URL girildiğinde müşteriye yardım videosu bağlantısı gösterilir.</small>
            </label>
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="truck" size={18} /></span><h2>Teslimat ayarları</h2></header>
            <OptionEditor title="Teslimat zamanları" addLabel="Zaman ekle" placeholder="Örn. 12 saat" rows={deliveryTimes} onChange={setDeliveryTimes} />
            <OptionEditor title="Teslimat türleri" addLabel="Tür ekle" placeholder="Örn. Standart" rows={deliveryTypes} onChange={setDeliveryTypes} />
          </section>

          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="image" size={18} /></span><h2>Görsel ve fiyat</h2></header>
            <label className="stype-field"><span>Logo URL</span><input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="https://..." /><small>Görsel, sağdaki müşteri önizlemesinde gösterilir.</small></label>
            <label className="stype-check"><input type="checkbox" checked={automaticPricing} onChange={(event) => setAutomaticPricing(event.target.checked)} /><span>Fiyat otomatik olarak belirlensin</span></label>
          </section>

          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onDelete && <button className="fav-delete" type="button" onClick={onDelete}>Türü sil</button>}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card stype-preview">
          <div className="stype-preview-media">
            {logoUrl ? <Image src={logoUrl} alt="Hizmet görseli önizlemesi" width={900} height={500} unoptimized /> : <Icon name="image" size={28} />}
          </div>
          <div className="stype-preview-copy">
            <span>{previewCode}</span>
            <h2>{previewTitle}</h2>
            <p>{description.trim() || "Açıklama burada görüntülenecek."}</p>
            {helpVideo && <a href={helpVideo} target="_blank" rel="noopener noreferrer"><Icon name="play" size={14} />Yardım videosu</a>}
            <button type="button" tabIndex={-1}>Talep Et</button>
          </div>
        </aside>
      </form>
    </div>
  );
}
