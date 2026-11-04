"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../AdminShell";
import { useToast } from "../../components/ToastProvider";
import { Sablon, readSablonlar, writeSablonlar } from "./data";

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

export function SablonForm({ mode, base = null }: { mode: "ekle" | "duzenle"; base?: Sablon | null }) {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [baslik, setBaslik] = useState(base?.baslik ?? "");
  const [aciklama, setAciklama] = useState(base?.aciklama ?? "");
  const [videoUrl, setVideoUrl] = useState(base?.videoUrl ?? "");
  const [dosya, setDosya] = useState(base?.dosya ?? "");
  const [sira, setSira] = useState(String(base?.sira ?? 1));
  const [yayinda, setYayinda] = useState(base?.yayinda ?? true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  if (mode === "duzenle" && !base) {
    return (
      <AdminShell>
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Şablon bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/analiz-sablonlari">Listeye dön</Link>
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
    const order = Number(sira);
    const current = readSablonlar();
    const record: Sablon = {
      id: base?.id ?? `s${Date.now()}`,
      sira: Number.isFinite(order) ? order : 1,
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      videoUrl: videoUrl.trim(),
      dosya,
      yayinda,
    };
    writeSablonlar(base?.id ? current.map((item) => item.id === base.id ? record : item) : [record, ...current]);
    toast.success(mode === "duzenle" ? "Şablon güncellendi." : "Şablon oluşturuldu.");
    router.push("/admin/analiz-sablonlari");
  }

  function remove() {
    if (!base?.id) return;
    writeSablonlar(readSablonlar().filter((item) => item.id !== base.id));
    toast.success("Şablon silindi.");
    router.push("/admin/analiz-sablonlari");
  }

  return (
    <AdminShell>
      <div className="fav-page stype-page">
        <Link className="fav-back" href="/admin/analiz-sablonlari"><Icon name="back" size={16} />Şablonlara dön</Link>
        <form className="stype-layout" onSubmit={save}>
          <div className="stype-stack">
            <section className="fav-card stype-section">
              <header><span className="fav-mark"><Icon name="file" /></span><h2>Analizörlerin erişeceği şablon</h2></header>
              <label className="stype-field">
                <span>Başlık</span>
                <input id="sb-baslik" value={baslik} onChange={(event) => { setBaslik(event.target.value); setError(""); }} placeholder="Şablon başlığı" autoFocus />
              </label>
              <label className="stype-field">
                <span>Açıklama</span>
                <textarea id="sb-aciklama" value={aciklama} rows={5} onChange={(event) => setAciklama(event.target.value)} placeholder="Şablonun kısa açıklaması" />
              </label>
            </section>

            <section className="fav-card stype-section">
              <header><h2>Kaynak ve yayın</h2></header>
              <label className="stype-field">
                <span>Video URL</span>
                <input id="sb-video" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://www.youtube.com/…" />
                <small>YouTube veya Vimeo linki (opsiyonel)</small>
              </label>
              <div className="stype-field">
                <span>Dosya</span>
                <input ref={fileRef} className="lesson-file-input" type="file" onChange={(event) => { setDosya(event.target.files?.[0]?.name ?? ""); event.target.value = ""; }} />
                <button className="llist-upload" type="button" onClick={() => fileRef.current?.click()}>
                  {dosya || "Dosya seç"}
                  <small>PDF, Word veya diğer belgeler (opsiyonel)</small>
                </button>
              </div>
              <label className="stype-field">
                <span>Sıra</span>
                <input id="sb-sira" type="number" min="1" value={sira} onChange={(event) => setSira(event.target.value)} />
              </label>
              <div className="role-option">
                <span><strong>Yayında</strong><small>Analizörlere gösterilir</small></span>
                <button type="button" role="switch" aria-checked={yayinda} aria-label="Yayında" className={`role-switch${yayinda ? " on" : ""}`} onClick={() => setYayinda((value) => !value)}>
                  <span />
                </button>
              </div>
            </section>

            <div className="fav-actions">
              {error && <p role="alert">{error}</p>}
              {mode === "duzenle" && base?.id && (confirming ? (
                <>
                  <p>Bu şablonu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
                  <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
                  <button className="fav-delete" type="button" onClick={remove}>Evet, sil</button>
                </>
              ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>Şablonu sil</button>)}
              <button className="fav-save" type="submit">{mode === "ekle" ? "Kaydet" : "Güncelle"}</button>
            </div>
          </div>

          <aside className="fav-card acct-summary" aria-label="Şablon önizleme">
            <header><span className="fav-mark"><Icon name="file" /></span><h2>Önizleme</h2></header>
            <span className={`stype-status ${yayinda ? "aktif" : "pasif"}`}>{yayinda ? "Yayında" : "Taslak"}</span>
            <p className="acct-figure">{sira || "1"}</p>
            <dl className="acct-rows">
              <div><dt>Başlık</dt><dd className="wrap">{baslik.trim() || "Başlıksız şablon"}</dd></div>
              <div><dt>Video</dt><dd>{videoUrl.trim() ? "Var" : "Yok"}</dd></div>
              <div><dt>Dosya</dt><dd className="wrap">{dosya || "Yok"}</dd></div>
            </dl>
            <p className="tm-bubble">{aciklama.trim() || "Açıklama eklenmedi."}</p>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
