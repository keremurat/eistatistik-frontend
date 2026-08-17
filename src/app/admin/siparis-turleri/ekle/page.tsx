"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { readServiceTypes, ServiceOption, ServiceStatus, writeServiceTypes } from "../serviceTypeData";

type IconName = "back" | "save" | "plus" | "trash" | "image" | "play" | "info" | "file" | "delivery";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    delivery: <><rect x="3" y="6" width="13" height="11" rx="1" /><path d="M16 10h3l2 3v4h-5M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function OptionEditor({ title, hint, rows, onChange }: { title:string; hint:string; rows:ServiceOption[]; onChange:(rows:ServiceOption[])=>void }) {
  function update(index:number, key:keyof ServiceOption, value:string) {
    onChange(rows.map((row,rowIndex) => rowIndex === index ? { ...row, [key]:value } : row));
  }
  return (
    <div className="service-option-editor">
      <div className="service-option-title"><strong>{title}</strong><span>{hint}</span></div>
      {rows.length > 0 && <div className="service-option-head"><span>Etiket</span><span>Değer</span><span /></div>}
      <div className="service-option-rows">
        {rows.map((row,index) => (
          <div className="service-option-row" key={`${title}-${index}`}>
            <input value={row.label} onChange={(event) => update(index,"label",event.target.value)} placeholder={title === "Teslimat zamanları" ? "Örn. 12 saat" : "Örn. Standart"} aria-label={`${title} ${index + 1} etiketi`} />
            <input value={row.value} onChange={(event) => update(index,"value",event.target.value)} placeholder="1.0" aria-label={`${title} ${index + 1} değeri`} />
            <button type="button" onClick={() => onChange(rows.filter((_,rowIndex) => rowIndex !== index))} aria-label={`${index + 1}. satırı kaldır`}><Icon name="trash" size={15} /></button>
          </div>
        ))}
      </div>
      <button className="service-option-add" type="button" onClick={() => onChange([...rows,{ label:"", value:"" }])}><Icon name="plus" size={15} />{title === "Teslimat zamanları" ? "Zaman ekle" : "Tür ekle"}</button>
    </div>
  );
}

export default function SiparisTuruEklePage() {
  const router = useRouter();
  const [code,setCode] = useState("");
  const [title,setTitle] = useState("");
  const [initialFee,setInitialFee] = useState("0");
  const [order,setOrder] = useState("1");
  const [status,setStatus] = useState<ServiceStatus>("aktif");
  const [description,setDescription] = useState("");
  const [helpVideo,setHelpVideo] = useState("");
  const [deliveryTimes,setDeliveryTimes] = useState<ServiceOption[]>([]);
  const [deliveryTypes,setDeliveryTypes] = useState<ServiceOption[]>([]);
  const [logoUrl,setLogoUrl] = useState("");
  const [automaticPricing,setAutomaticPricing] = useState(false);
  const [error,setError] = useState("");

  function handleSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    const cleanTitle = title.trim();
    const cleanOrder = Number.parseInt(order,10);
    if (!normalizedCode || !cleanTitle || !Number.isFinite(cleanOrder) || cleanOrder < 1) {
      setError("Kod, başlık ve geçerli bir sıralama değeri zorunludur.");
      return;
    }
    const current = readServiceTypes();
    if (current.some((type) => type.code.toUpperCase() === normalizedCode)) {
      setError("Bu kodla tanımlanmış bir sipariş türü zaten bulunuyor.");
      return;
    }
    writeServiceTypes([...current,{
      id:typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      code:normalizedCode,title:cleanTitle,description:description.trim(),order:cleanOrder,status,
      initialFee:Number(initialFee) || 0,helpVideo:helpVideo.trim(),
      deliveryTimes:deliveryTimes.filter((row) => row.label.trim()),
      deliveryTypes:deliveryTypes.filter((row) => row.label.trim()),
      logoUrl:logoUrl.trim(),automaticPricing,
    }]);
    router.push("/admin/siparis-turleri");
  }

  return (
    <AdminShell>
      <form className="st-page service-type-create-page" onSubmit={handleSubmit}>
        <header className="favorite-category-create-header">
          <Link className="back-link" href="/admin/siparis-turleri"><Icon name="back" size={16} />Sipariş türlerine dön</Link>
          <h1>Yeni Sipariş Türü</h1>
        </header>

        <div className="service-type-create-layout">
          <div className="service-type-form-stack">
            <section className="detail-panel">
              <div className="service-form-section-heading"><span><Icon name="info" size={16} /></span><strong>Temel bilgiler</strong></div>
              <div className="settings-panel-body">
                <div className="st-form-row3">
                  <div className="form-field"><label htmlFor="service-code">Kod <em>*</em></label><input id="service-code" value={code} onChange={(event) => { setCode(event.target.value.toUpperCase());setError(""); }} placeholder="Örn. SA" maxLength={8} /></div>
                  <div className="form-field"><label htmlFor="service-title">Başlık <em>*</em></label><input id="service-title" value={title} onChange={(event) => { setTitle(event.target.value);setError(""); }} placeholder="Sipariş türü adı" /></div>
                  <div className="form-field"><label htmlFor="service-fee">İlk ücret (TL)</label><input id="service-fee" value={initialFee} onChange={(event) => setInitialFee(event.target.value)} type="number" min="0" step="0.01" /></div>
                </div>
                <div className="form-grid">
                  <div className="form-field"><label htmlFor="service-order">Sıralama <em>*</em></label><input id="service-order" value={order} onChange={(event) => { setOrder(event.target.value);setError(""); }} type="number" min="1" /><p className="settings-hint">Küçük sayı listede daha önce görünür.</p></div>
                  <div className="form-field"><label>Durum <em>*</em></label><SystemDropdown value={status} onChange={(value) => setStatus(value as ServiceStatus)} ariaLabel="Sipariş türü durumu" options={[{value:"aktif",label:"Aktif"},{value:"pasif",label:"Pasif"}]} /></div>
                </div>
              </div>
            </section>

            <section className="detail-panel">
              <div className="service-form-section-heading"><span><Icon name="file" size={16} /></span><strong>İçerik</strong></div>
              <div className="settings-panel-body">
                <div className="form-field"><label htmlFor="service-description">Açıklama</label><textarea id="service-description" className="small" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Sipariş türünü kısa ve net biçimde açıklayın" /></div>
                <div className="form-field"><label htmlFor="service-video">Yardım videosu (YouTube URL)</label><div className="service-video-field"><input id="service-video" value={helpVideo} onChange={(event) => setHelpVideo(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." /><a className={!helpVideo ? "disabled" : ""} href={helpVideo || undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!helpVideo}><Icon name="play" size={15} />Önizle</a></div><p className="settings-hint">URL girildiğinde müşteriye “Yardım videosu” bağlantısı gösterilir.</p></div>
              </div>
            </section>

            <section className="detail-panel">
              <div className="service-form-section-heading"><span><Icon name="delivery" size={16} /></span><strong>Teslimat ayarları</strong></div>
              <div className="settings-panel-body service-options-stack">
                <OptionEditor title="Teslimat zamanları" hint="Örn. 12 saat → 1.0" rows={deliveryTimes} onChange={setDeliveryTimes} />
                <OptionEditor title="Teslimat türleri" hint="Örn. SPSS → 1.0" rows={deliveryTypes} onChange={setDeliveryTypes} />
              </div>
            </section>

            <section className="detail-panel">
              <div className="service-form-section-heading"><span><Icon name="image" size={16} /></span><strong>Görsel ve fiyat ayarları</strong></div>
              <div className="settings-panel-body">
                <div className="form-field"><label htmlFor="service-logo">Logo URL <em>(900×500)</em></label><input id="service-logo" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="https://..." /><p className="settings-hint">Görsel URL girildiğinde sağdaki müşteri önizlemesinde gösterilir.</p></div>
                <label className="service-auto-price"><input type="checkbox" checked={automaticPricing} onChange={(event) => setAutomaticPricing(event.target.checked)} /><span>Fiyat otomatik olarak belirlensin</span></label>
              </div>
            </section>
          </div>

          <aside className="detail-panel service-customer-preview">
            <div className="service-customer-preview-head"><span>Önizleme</span><small>Müşteri görünümü</small></div>
            <div className="service-customer-preview-media">
              {logoUrl ? <img src={logoUrl} alt="Hizmet görseli önizlemesi" /> : <Icon name="image" size={28} />}
            </div>
            <div className="service-customer-preview-copy">
              <span>{code.trim().toUpperCase() || "KOD"}</span>
              <h2>{title.trim() || "Sipariş Türü Başlığı"}</h2>
              <p>{description.trim() || "Açıklama burada görüntülenecek."}</p>
              {helpVideo && <a href={helpVideo} target="_blank" rel="noopener noreferrer"><Icon name="play" size={14} />Yardım videosu</a>}
              <button type="button" tabIndex={-1}>Talep Et</button>
            </div>
          </aside>
        </div>

        <div className="service-type-form-actions">
          {error && <p className="settings-note error" role="alert">{error}</p>}
          <Link href="/admin/siparis-turleri">İptal</Link>
          <button type="submit"><Icon name="save" size={16} />Kaydet</button>
        </div>
      </form>
    </AdminShell>
  );
}
