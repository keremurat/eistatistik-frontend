"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../AdminShell";
import { DatePicker } from "../../components/DatePicker";
import { TimePicker } from "../../components/TimePicker";
import { SystemDropdown } from "../../components/SystemDropdown";
import { useToast } from "../../components/ToastProvider";
import { Icerik, IcerikTuru, bultenOptions, readBultenler, readIcerikler, writeIcerikler } from "./data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  file: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,44l44,44H152ZM200,216H56V40h80V88a8,8,0,0,0,8,8h56Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const turOptions = [
  { value: "video", label: "Video" },
  { value: "dosya", label: "Dosya" },
  { value: "metin", label: "Metin" },
];

const KIND: Record<IcerikTuru, string> = { video: "Video", dosya: "Dosya", metin: "Metin" };

export function IcerikForm({ mode, base = null }: { mode: "ekle" | "duzenle"; base?: Icerik | null }) {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState(bultenOptions());
  const [bultenId, setBultenId] = useState(base?.bultenId ?? "");
  const [baslik, setBaslik] = useState(base?.baslik ?? "");
  const [aciklama, setAciklama] = useState(base?.aciklama ?? "");
  const [tur, setTur] = useState<IcerikTuru>(base?.tur ?? "video");
  const [tarih, setTarih] = useState(base ? base.yayinTarihi.split(" ")[0] : "");
  const [saat, setSaat] = useState(base ? base.yayinTarihi.split(" ")[1] ?? "09:00" : "09:00");
  const [youtube, setYoutube] = useState(base?.youtubeUrl ?? "");
  const [dosya, setDosya] = useState(base?.dosya ?? "");
  const [genislik, setGenislik] = useState<"normal" | "tam">(base?.genislik ?? "normal");
  const [yayinda, setYayinda] = useState(base?.yayinda ?? false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOptions(readBultenler().map((item) => ({ value: item.id, label: item.baslik }))));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (mode === "duzenle" && !base) {
    return (
      <AdminShell>
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>İçerik bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/icerikler">Listeye dön</Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!baslik.trim()) {
      setError("Başlık zorunludur.");
      return;
    }
    const current = readIcerikler();
    const record: Icerik = {
      id: base?.id ?? `i${Date.now()}`,
      bultenId,
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      tur,
      yayinTarihi: `${tarih} ${saat}`.trim(),
      youtubeUrl: youtube.trim(),
      dosya,
      genislik,
      yayinda,
    };
    writeIcerikler(base?.id ? current.map((item) => item.id === base.id ? record : item) : [record, ...current]);
    toast.success(mode === "duzenle" ? "İçerik güncellendi." : "İçerik oluşturuldu.");
    router.push("/admin/icerikler");
  }

  function remove() {
    if (!base?.id) return;
    writeIcerikler(readIcerikler().filter((item) => item.id !== base.id));
    toast.success("İçerik silindi.");
    router.push("/admin/icerikler");
  }

  const newsletter = options.find((option) => option.value === bultenId)?.label || "Bülten seçilmedi";

  return (
    <AdminShell>
      <div className="fav-page stype-page">
        <Link className="fav-back" href="/admin/icerikler"><Icon name="back" size={16} />İçeriklere dön</Link>
        <form className="stype-layout" onSubmit={save}>
          <div className="stype-stack">
            <section className="fav-card stype-section">
              <header><span className="fav-mark"><Icon name="file" /></span><h2>Temel bilgiler</h2></header>
              <label className="stype-field">
                <span>Bülten</span>
                <SystemDropdown value={bultenId} onChange={setBultenId} placeholder="Bülten seç" ariaLabel="Bülten" options={options} />
              </label>
              <label className="stype-field">
                <span>Başlık</span>
                <input id="ic-baslik" value={baslik} onChange={(event) => { setBaslik(event.target.value); setError(""); }} placeholder="İçerik başlığı" autoFocus />
              </label>
              <label className="stype-field">
                <span>Açıklama</span>
                <textarea id="ic-aciklama" value={aciklama} rows={4} onChange={(event) => setAciklama(event.target.value)} />
              </label>
              <div className="icerik-split">
                <label className="stype-field">
                  <span>İçerik türü</span>
                  <SystemDropdown value={tur} onChange={(value) => setTur(value as IcerikTuru)} ariaLabel="İçerik türü" options={turOptions} />
                </label>
                <label className="stype-field">
                  <span>Yayın tarihi</span>
                  <div className="appt-when">
                    <DatePicker id="ic-tarih" value={tarih} onChange={setTarih} />
                    <TimePicker id="ic-saat" value={saat} onChange={setSaat} placeholder="SS:DD" />
                  </div>
                </label>
              </div>
              <label className="stype-field">
                <span>YouTube URL</span>
                <input id="ic-yt" value={youtube} onChange={(event) => setYoutube(event.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
                <small>YouTube linki girilirse dosya yerine embed gösterilir.</small>
              </label>
              <div className="stype-field">
                <span>Dosya</span>
                <input ref={fileRef} className="lesson-file-input" type="file" onChange={(event) => { setDosya(event.target.files?.[0]?.name ?? ""); event.target.value = ""; }} />
                <button className="llist-upload" type="button" onClick={() => fileRef.current?.click()}>
                  {dosya || "Dosya seç veya sürükle bırak"}
                  <small>YouTube yoksa dosya gösterilir.</small>
                </button>
              </div>
            </section>

            <section className="fav-card stype-section">
              <header><h2>Yerleşim ve yayın</h2></header>
              <div className="stype-field">
                <span>Sayfada kaç kolon?</span>
                <div className="icerik-width">
                  <button className={genislik === "normal" ? "on" : ""} type="button" onClick={() => setGenislik("normal")}>Normal</button>
                  <button className={genislik === "tam" ? "on" : ""} type="button" onClick={() => setGenislik("tam")}>Tam genişlik</button>
                </div>
              </div>
              <div className="role-option">
                <span><strong>Yayında</strong><small>Açıkken içerik yayınlanır.</small></span>
                <button type="button" role="switch" aria-checked={yayinda} aria-label="Yayında" className={`role-switch${yayinda ? " on" : ""}`} onClick={() => setYayinda((value) => !value)}>
                  <span />
                </button>
              </div>
            </section>

            <div className="fav-actions">
              {error && <p role="alert">{error}</p>}
              {mode === "duzenle" && base?.id && (confirming ? (
                <>
                  <p>Bu işlem geri alınamaz.</p>
                  <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
                  <button className="fav-delete" type="button" onClick={remove}>Evet, sil</button>
                </>
              ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>İçeriği sil</button>)}
              <button className="fav-save" type="submit">{mode === "ekle" ? "Oluştur" : "Güncelle"}</button>
            </div>
          </div>

          <aside className="fav-card acct-summary" aria-label="İçerik önizleme">
            <header><span className="fav-mark"><Icon name="file" /></span><h2>Önizleme</h2></header>
            <span className={`stype-status ${yayinda ? "aktif" : "pasif"}`}>{yayinda ? "Yayında" : "Taslak"}</span>
            <p className="acct-figure">{KIND[tur]}</p>
            <dl className="acct-rows">
              <div><dt>Başlık</dt><dd className="wrap">{baslik.trim() || "Başlıksız içerik"}</dd></div>
              <div><dt>Bülten</dt><dd className="wrap">{newsletter}</dd></div>
              <div><dt>Tarih</dt><dd>{`${tarih} ${saat}`.trim() || "—"}</dd></div>
              <div><dt>Genişlik</dt><dd>{genislik === "tam" ? "Tam genişlik" : "Normal"}</dd></div>
              <div><dt>Kaynak</dt><dd className="wrap">{youtube.trim() ? "YouTube" : dosya || "Eklenmedi"}</dd></div>
            </dl>
            <p className="tm-bubble">{aciklama.trim() || "Açıklama eklenmedi."}</p>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
