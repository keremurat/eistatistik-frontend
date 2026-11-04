"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../AdminShell";
import { useToast } from "../../components/ToastProvider";
import { Hizmet, readHizmetler, slugify, writeHizmetler } from "./data";

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

export function HizmetForm({ mode, base = null }: { mode: "ekle" | "duzenle"; base?: Hizmet | null }) {
  const router = useRouter();
  const toast = useToast();
  const [baslik, setBaslik] = useState(base?.baslik ?? "");
  const [kartOzeti, setKartOzeti] = useState(base?.kartOzeti ?? "");
  const [icerik, setIcerik] = useState(base?.icerik ?? "");
  const [ikon, setIkon] = useState(base?.ikon ?? "");
  const [videoUrl, setVideoUrl] = useState(base?.videoUrl ?? "");
  const [seoMeta, setSeoMeta] = useState(base?.seoMeta ?? "");
  const [sira, setSira] = useState(String(base?.sira ?? 0));
  const [aktif, setAktif] = useState(base?.aktif ?? true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const slug = mode === "duzenle" && base ? base.slug : (baslik.trim() ? slugify(baslik) : "");

  if (mode === "duzenle" && !base) {
    return (
      <AdminShell>
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Hizmet bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/hizmetler">Listeye dön</Link>
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
    const current = readHizmetler();
    const record: Hizmet = {
      id: base?.id ?? `h${Date.now()}`,
      sira: Number.isFinite(order) ? order : 0,
      baslik: baslik.trim(),
      slug,
      kartOzeti: kartOzeti.trim(),
      icerik: icerik.trim(),
      ikon: ikon.trim(),
      videoUrl: videoUrl.trim(),
      seoMeta: seoMeta.trim(),
      aktif,
    };
    writeHizmetler(base?.id ? current.map((item) => item.id === base.id ? record : item) : [record, ...current]);
    toast.success(mode === "duzenle" ? "Hizmet güncellendi." : "Hizmet oluşturuldu.");
    router.push("/admin/hizmetler");
  }

  function remove() {
    if (!base?.id) return;
    writeHizmetler(readHizmetler().filter((item) => item.id !== base.id));
    toast.success("Hizmet silindi.");
    router.push("/admin/hizmetler");
  }

  return (
    <AdminShell>
      <div className="fav-page stype-page">
        <Link className="fav-back" href="/admin/hizmetler"><Icon name="back" size={16} />Hizmetlere dön</Link>
        <form className="stype-layout" onSubmit={save}>
          <div className="stype-stack">
            <section className="fav-card stype-section">
              <header><span className="fav-mark"><Icon name="file" /></span><h2>Sayfa bilgileri</h2></header>
              <label className="stype-field">
                <span>Başlık</span>
                <input id="hz-baslik" value={baslik} onChange={(event) => { setBaslik(event.target.value); setError(""); }} placeholder="Hizmet başlığı" autoFocus />
                <small>URL: /hizmetler/{slug || "…"}{mode === "duzenle" ? " (değiştirilemez)" : ""}</small>
              </label>
              <label className="stype-field">
                <span>Kart özeti</span>
                <textarea id="hz-ozet" value={kartOzeti} rows={3} onChange={(event) => setKartOzeti(event.target.value)} placeholder="Ana sayfadaki hizmet kartında görünecek kısa özet" />
              </label>
              <label className="stype-field">
                <span>İçerik</span>
                <textarea id="hz-icerik" className="guide-body" value={icerik} rows={12} onChange={(event) => setIcerik(event.target.value)} placeholder="Hizmet detay sayfasının içeriği" />
              </label>
            </section>

            <section className="fav-card stype-section">
              <header><h2>Görünüm ve SEO</h2></header>
              <label className="stype-field">
                <span>İkon</span>
                <input id="hz-ikon" value={ikon} onChange={(event) => setIkon(event.target.value)} placeholder="bar-chart-2" />
                <small>ör. bar-chart-2, activity, file-text</small>
              </label>
              <label className="stype-field">
                <span>Video URL</span>
                <input id="hz-video" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://www.youtube.com/…" />
                <small>YouTube linki — watch/shorts/embed hepsi olur</small>
              </label>
              <label className="stype-field">
                <span>SEO meta açıklama</span>
                <textarea id="hz-seo" value={seoMeta} rows={4} onChange={(event) => setSeoMeta(event.target.value)} />
              </label>
              <label className="stype-field">
                <span>Sıra</span>
                <input id="hz-sira" type="number" min="0" value={sira} onChange={(event) => setSira(event.target.value)} />
              </label>
              <div className="role-option">
                <span><strong>Aktif</strong><small>Ana sayfada gösterilir</small></span>
                <button type="button" role="switch" aria-checked={aktif} aria-label="Aktif" className={`role-switch${aktif ? " on" : ""}`} onClick={() => setAktif((value) => !value)}>
                  <span />
                </button>
              </div>
            </section>

            <div className="fav-actions">
              {error && <p role="alert">{error}</p>}
              {mode === "duzenle" && base?.id && (confirming ? (
                <>
                  <p>Bu hizmet sayfasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
                  <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
                  <button className="fav-delete" type="button" onClick={remove}>Evet, sil</button>
                </>
              ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>Hizmeti sil</button>)}
              <button className="fav-save" type="submit">{mode === "ekle" ? "Oluştur" : "Kaydet"}</button>
            </div>
          </div>

          <aside className="fav-card acct-summary" aria-label="Hizmet önizleme">
            <header><span className="fav-mark"><Icon name="file" /></span><h2>Önizleme</h2></header>
            <span className={`stype-status ${aktif ? "aktif" : "pasif"}`}>{aktif ? "Aktif" : "Pasif"}</span>
            <p className="acct-figure">{sira || "0"}</p>
            <dl className="acct-rows">
              <div><dt>Başlık</dt><dd className="wrap">{baslik.trim() || "Başlıksız hizmet"}</dd></div>
              <div><dt>Adres</dt><dd className="wrap">/hizmetler/{slug || "…"}</dd></div>
              <div><dt>İkon</dt><dd>{ikon.trim() || "—"}</dd></div>
              <div><dt>Video</dt><dd>{videoUrl.trim() ? "Var" : "Yok"}</dd></div>
            </dl>
            <p className="tm-bubble">{kartOzeti.trim() || "Kart özeti eklenmedi."}</p>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
