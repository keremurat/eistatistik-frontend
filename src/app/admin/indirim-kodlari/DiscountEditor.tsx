"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { DatePicker } from "../../components/DatePicker";
import { SystemDropdown } from "../../components/SystemDropdown";
import { formatTutar, IndirimKodu } from "./data";

const TYPES = [
  { value: "percentage", label: "Yüzde" },
  { value: "amount", label: "Tutar" },
];

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  tag: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96.62,96L48,132.69V48h84.69L240,155.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z",
} as const;

export type DiscountDraft = Omit<IndirimKodu, "id">;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function DiscountEditor({
  initial,
  basePath,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: IndirimKodu;
  basePath: string;
  submitLabel: string;
  onSubmit: (value: DiscountDraft) => void;
  onDelete?: () => void;
}) {
  const [kod, setKod] = useState(initial?.kod ?? "");
  const [aciklama, setAciklama] = useState(initial?.aciklama ?? "");
  const [tip, setTip] = useState(initial?.tip ?? "");
  const [tutar, setTutar] = useState(initial ? String(initial.tutar) : "");
  const [limit, setLimit] = useState(initial ? String(initial.limit) : "");
  const [baslama, setBaslama] = useState(initial?.baslama ?? "");
  const [bitis, setBitis] = useState(initial?.bitis ?? "");
  const [error, setError] = useState("");
  const ordersHref = basePath.startsWith("/editor") ? "/editor/siparisler" : "/admin/siparisler";
  const amount = Number(tutar);
  const usageLimit = Number(limit);
  const tipLabel = TYPES.find((item) => item.value === tip)?.label ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!aciklama.trim() || (tip !== "percentage" && tip !== "amount") || !tutar.trim() || !Number.isFinite(amount) || amount < 0 || !limit.trim() || !Number.isInteger(usageLimit) || usageLimit < 1 || !baslama || !bitis) {
      setError("Açıklama, tip, tutar, limit ve tarihler zorunludur.");
      return;
    }
    onSubmit({
      kod: kod.trim(),
      aciklama: aciklama.trim(),
      aciklamaLink: initial?.aciklamaLink ?? false,
      tip: tip as "percentage" | "amount",
      tutar: amount,
      limit: usageLimit,
      kullanilan: initial?.kullanilan ?? 0,
      baslama,
      bitis,
    });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />İndirim kodlarına dön</Link>
      <form className="stype-layout" onSubmit={handleSubmit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="tag" size={18} /></span><h2>Kupon</h2></header>
            <label className="stype-field">
              <span>Kupon kodu</span>
              <input value={kod} onChange={(event) => { setKod(event.target.value); setError(""); }} placeholder="Boş bırakılırsa otomatik oluşturulur" autoFocus />
              {!initial && <small>Kod boş bırakılırsa sistem benzersiz bir kod üretir.</small>}
            </label>
            <label className="stype-field">
              <span>Kupon açıklaması</span>
              <textarea value={aciklama} onChange={(event) => { setAciklama(event.target.value); setError(""); }} placeholder="Kodun nerede kullanılacağını yazın" />
              {initial?.aciklamaLink && <Link href={ordersHref}>Siparişlere git</Link>}
            </label>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Tipi</span>
                <SystemDropdown value={tip} onChange={(value) => { setTip(value); setError(""); }} placeholder="Tip seçin" ariaLabel="İndirim tipi" options={TYPES} />
              </label>
              <label className="stype-field">
                <span>{tip === "amount" ? "Tutar (₺)" : "Tutar"}</span>
                <input value={tutar} onChange={(event) => { setTutar(event.target.value); setError(""); }} type="number" min="0" placeholder="0" />
              </label>
            </div>
            <label className="stype-field">
              <span>Kullanım limiti</span>
              <input value={limit} onChange={(event) => { setLimit(event.target.value); setError(""); }} type="number" min="1" placeholder="1" />
            </label>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Başlama tarihi</span>
                <DatePicker value={baslama} onChange={(value) => { setBaslama(value); setError(""); }} />
              </label>
              <label className="stype-field">
                <span>Bitiş tarihi</span>
                <DatePicker value={bitis} onChange={(value) => { setBitis(value); setError(""); }} />
              </label>
            </div>
          </section>
          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onDelete && <button className="fav-delete" type="button" onClick={onDelete}>Kodu sil</button>}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card acct-summary" aria-label="Kupon önizlemesi">
          <header><span className="fav-mark"><Icon name="tag" size={18} /></span><h2>Kupon önizleme</h2></header>
          <p className="acct-figure">{tip === "percentage" || tip === "amount" ? formatTutar(tip, Number.isFinite(amount) ? amount : 0) : "—"}</p>
          <strong className="ik-code">{kod.trim() || "Otomatik kod"}</strong>
          <dl className="acct-rows">
            <div><dt>Tip</dt><dd>{tipLabel || "—"}</dd></div>
            <div><dt>Limit</dt><dd>{limit.trim() || "—"} / {initial?.kullanilan ?? 0}</dd></div>
            <div><dt>Başlangıç</dt><dd>{baslama || "—"}</dd></div>
            <div><dt>Bitiş</dt><dd>{bitis || "—"}</dd></div>
          </dl>
          <p className="llist-empty">{aciklama.trim() || "Açıklama burada görünecek."}</p>
        </aside>
      </form>
    </div>
  );
}
