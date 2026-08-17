"use client";

import Link from "next/link";
import { use, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { KULLANICILAR, Kullanici, KullaniciRol } from "../data";
import { SystemDropdown } from "../../../components/SystemDropdown";

type Section = "ozet" | "siparisler" | "egitimler" | "aktivite" | "cari" | "duzenle";

type IconName = "arrow" | "back" | "book" | "check" | "clock" | "edit" | "file" |
  "list" | "minus" | "plus" | "save" | "shield" | "trash" | "user" | "warning" | "x";

function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow:   <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back:    <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    book:    <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    check:   <path d="m5 12 4 4L19 6" />,
    clock:   <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    edit:    <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    file:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    list:    <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
    minus:   <path d="M5 12h14" />,
    plus:    <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    save:    <><path d="M19 21H5a2 2 0 0 0-2-2V7l4-4h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v4h8" /></>,
    shield:  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    trash:   <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></>,
    user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    warning: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" /></>,
    x:       <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS: { key: Section; icon: IconName; label: string }[] = [
  { key: "ozet",      icon: "user",  label: "Özet & Rapor"       },
  { key: "siparisler",icon: "file",  label: "Siparişler"         },
  { key: "egitimler", icon: "book",  label: "Eğitim Talepleri"   },
  { key: "aktivite",  icon: "clock", label: "Aktivite Günlüğü"   },
  { key: "cari",      icon: "list",  label: "Cari Hareketler"    },
  { key: "duzenle",   icon: "edit",  label: "Düzenle"            },
];

// ── Yardımcı bileşenler ──────────────────────────────────────────────────────
function PanelHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="detail-panel-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
    </header>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "10rem", gap: ".4rem",
      color: "#94aab7", padding: "2rem",
    }}>
      <Icon name="minus" size={24} />
      <span style={{ fontSize: ".75rem" }}>{label}</span>
    </div>
  );
}

// ── Bölümler ──────────────────────────────────────────────────────────────────
function OzetSection({ u }: { u: Kullanici }) {
  const toplamTutar  = u.cariHareketler.filter(h => h.tur === "odeme").reduce((s, h) => s + h.tutar, 0);
  const minOdeme     = u.cariHareketler.length ? Math.min(...u.cariHareketler.filter(h => h.tur === "odeme").map(h => h.tutar).filter(Boolean)) : 0;
  const maxOdeme     = u.cariHareketler.length ? Math.max(...u.cariHareketler.filter(h => h.tur === "odeme").map(h => h.tutar).filter(Boolean)) : 0;
  const ortalama     = u.siparisler.length ? Math.round(toplamTutar / u.siparisler.length) : 0;

  const stats = [
    { label: "Toplam Sipariş Adedi",    value: `${u.siparisler.length} adet sipariş` },
    { label: "Minimum Ödeme",           value: minOdeme ? `${minOdeme.toLocaleString("tr")} TL` : "—" },
    { label: "Maksimum Ödeme",          value: maxOdeme ? `${maxOdeme.toLocaleString("tr")} TL` : "—" },
    { label: "Toplam Ödeme",            value: toplamTutar ? `${toplamTutar.toLocaleString("tr")} TL` : "—" },
    { label: "Eğitim Talebi Sayısı",    value: `${u.egitimTalepleri.length} talep` },
    { label: "Aktivite Kaydı",          value: `${u.aktivite.length} kayıt` },
    { label: "Ortalama Ücret",          value: ortalama ? `${ortalama.toLocaleString("tr")} TL` : "0 TL" },
    { label: "Kayıt Tarihi",            value: u.kayitTarihi },
  ];

  return (
    <div className="detail-stack">
      {/* Profil kartı */}
      <section className="detail-panel">
        <PanelHeading eyebrow="KİŞİSEL BİLGİLER" title="Profil" />
        <div style={{ padding: "1.25rem 1.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <span style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--blue-soft)", color: "var(--blue)",
              display: "grid", placeItems: "center", flexShrink: 0, fontSize: "1.1rem", fontWeight: 800,
            }}>
              {u.adSoyad.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </span>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: ".9rem", color: "var(--ink)" }}>{u.adSoyad}</p>
              <p style={{ margin: 0, fontSize: ".68rem", color: "#8493a0" }}>{u.eposta}</p>
            </div>
          </div>
          <dl className="detail-facts">
            <dt>GSM</dt><dd>{u.gsm}</dd>
            <dt>Tür</dt><dd>{u.tur}</dd>
            <dt>Durum</dt><dd style={{ color: u.durum === "Aktif" ? "#287a55" : "#8493a0", fontWeight: 800 }}>{u.durum}</dd>
            <dt>Rol</dt><dd>{u.rol}</dd>
            {u.universite && <><dt>Üniversite</dt><dd>{u.universite}</dd></>}
            {u.fakulte    && <><dt>Fakülte</dt><dd>{u.fakulte}</dd></>}
            {u.bolum      && <><dt>Bölüm</dt><dd>{u.bolum}</dd></>}
            {u.il         && <><dt>İl / İlçe</dt><dd>{u.il} — {u.ilce}</dd></>}
            {u.adres      && <><dt>Adres</dt><dd>{u.adres}</dd></>}
          </dl>
        </div>
      </section>

      {/* Rapor */}
      <section className="detail-panel">
        <PanelHeading eyebrow="RAPORLAR" title="Hesap Özeti" />
        <div style={{ padding: "0 1.4rem 1.25rem" }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: ".65rem 0", borderBottom: "1px solid #f0f3f5",
            }}>
              <span style={{ fontSize: ".72rem", color: "#54687a", fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: ".72rem", color: "var(--ink)", fontWeight: 800 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SiparislerSection({ u }: { u: Kullanici }) {
  if (u.siparisler.length === 0) return (
    <section className="detail-panel">
      <PanelHeading eyebrow="SİPARİŞLER" title="Siparişler" />
      <EmptyState label="Sipariş bulunamadı" />
    </section>
  );

  const durumRenk: Record<string, { bg: string; color: string }> = {
    yapiliyor:  { bg: "#eaf4fb", color: "#1775a9" },
    teslim:     { bg: "#edf7f1", color: "#287a55" },
    beklemede:  { bg: "#fdf3e7", color: "#b66d2e" },
    iptal:      { bg: "#fff3f2", color: "#c85a51" },
  };
  const durumEtiket: Record<string, string> = {
    yapiliyor: "Yapılıyor", teslim: "Teslim Edildi", beklemede: "Beklemede", iptal: "İptal",
  };

  return (
    <section className="detail-panel">
      <PanelHeading eyebrow="SİPARİŞLER" title="Siparişler" />
      <div style={{ padding: "0 1.4rem 1.25rem" }}>
        {u.siparisler.map((s) => (
          <div key={s.kod} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto auto",
            alignItems: "center", gap: ".75rem",
            padding: ".75rem 0", borderBottom: "1px solid #f0f3f5",
          }}>
            <span style={{ display: "flex", color: "#94aab7" }}><Icon name="file" size={15} /></span>
            <div>
              <p style={{ margin: 0, fontSize: ".73rem", fontWeight: 800, color: "var(--ink)" }}>{s.hizmet}</p>
              <p style={{ margin: 0, fontSize: ".63rem", color: "#8493a0" }}>
                <code style={{ fontFamily: "ui-monospace,monospace" }}>{s.kod}</code> · {s.tarih}
              </p>
            </div>
            <span style={{
              padding: ".22rem .6rem", borderRadius: 99,
              background: durumRenk[s.durum].bg, color: durumRenk[s.durum].color,
              fontSize: ".62rem", fontWeight: 800,
            }}>
              {durumEtiket[s.durum]}
            </span>
            <span style={{ fontSize: ".72rem", fontWeight: 800, color: "#3f556a", whiteSpace: "nowrap" }}>
              {s.tutar.toLocaleString("tr")} TL
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EgitimlerSection({ u }: { u: Kullanici }) {
  if (u.egitimTalepleri.length === 0) return (
    <section className="detail-panel">
      <PanelHeading eyebrow="EĞİTİM TALEPLERİ" title="Eğitim Talepleri" />
      <EmptyState label="Eğitim talebi bulunamadı" />
    </section>
  );

  const durumRenk: Record<string, { bg: string; color: string }> = {
    devam:        { bg: "#eaf4fb", color: "#1775a9" },
    tamamlandi:   { bg: "#edf7f1", color: "#287a55" },
    beklemede:    { bg: "#fdf3e7", color: "#b66d2e" },
  };
  const durumEtiket: Record<string, string> = {
    devam: "Devam Ediyor", tamamlandi: "Tamamlandı", beklemede: "Beklemede",
  };

  return (
    <section className="detail-panel">
      <PanelHeading eyebrow="EĞİTİM TALEPLERİ" title="Eğitim Talepleri" />
      <div style={{ padding: "0 1.4rem 1.25rem" }}>
        {u.egitimTalepleri.map((e, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto",
            alignItems: "center", gap: ".75rem",
            padding: ".75rem 0", borderBottom: "1px solid #f0f3f5",
          }}>
            <span style={{ display: "flex", color: "#94aab7" }}><Icon name="book" size={15} /></span>
            <div>
              <p style={{ margin: 0, fontSize: ".73rem", fontWeight: 800, color: "var(--ink)" }}>{e.egitim}</p>
              <p style={{ margin: 0, fontSize: ".63rem", color: "#8493a0" }}>{e.tarih}</p>
            </div>
            <span style={{
              padding: ".22rem .6rem", borderRadius: 99,
              background: durumRenk[e.durum].bg, color: durumRenk[e.durum].color,
              fontSize: ".62rem", fontWeight: 800,
            }}>
              {durumEtiket[e.durum]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AktiviteSection({ u }: { u: Kullanici }) {
  if (u.aktivite.length === 0) return (
    <section className="detail-panel">
      <PanelHeading eyebrow="AKTİVİTE GÜNLÜĞÜ" title="Aktivite Günlüğü" />
      <EmptyState label="Aktivite kaydı bulunamadı" />
    </section>
  );
  return (
    <section className="detail-panel">
      <PanelHeading eyebrow="AKTİVİTE GÜNLÜĞÜ" title="Aktivite Günlüğü" />
      <div style={{ padding: "0 1.4rem 1.25rem" }}>
        {u.aktivite.map((a, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto",
            alignItems: "center", gap: ".75rem",
            padding: ".65rem 0", borderBottom: "1px solid #f0f3f5",
          }}>
            <span style={{ display: "flex", color: "#94aab7" }}><Icon name="clock" size={14} /></span>
            <span style={{ fontSize: ".72rem", color: "var(--ink)", fontWeight: 700 }}>{a.islem}</span>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: ".63rem", color: "#8493a0" }}>{a.tarih}</p>
              <p style={{ margin: 0, fontSize: ".6rem", color: "#b0bfc9", fontFamily: "ui-monospace,monospace" }}>{a.ip}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CariSection({ u }: { u: Kullanici }) {
  if (u.cariHareketler.length === 0) return (
    <section className="detail-panel">
      <PanelHeading eyebrow="CARİ HAREKETLER" title="Cari Hareketler" />
      <EmptyState label="Cari hareket bulunamadı" />
    </section>
  );

  const turRenk: Record<string, { icon: IconName; color: string }> = {
    odeme: { icon: "plus",  color: "#287a55" },
    iade:  { icon: "minus", color: "#c85a51" },
    borc:  { icon: "warning", color: "#b66d2e" },
  };

  const toplam = u.cariHareketler.reduce((s, h) =>
    s + (h.tur === "odeme" ? h.tutar : h.tur === "iade" ? -h.tutar : 0), 0);

  return (
    <section className="detail-panel">
      <PanelHeading eyebrow="CARİ HAREKETLER" title="Cari Hareketler" />
      <div style={{ padding: "0 1.4rem 1.25rem" }}>
        {u.cariHareketler.map((h, i) => {
          const t = turRenk[h.tur];
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto",
              alignItems: "center", gap: ".75rem",
              padding: ".65rem 0", borderBottom: "1px solid #f0f3f5",
            }}>
              <span style={{ display: "flex", color: t.color }}><Icon name={t.icon} size={14} /></span>
              <div>
                <p style={{ margin: 0, fontSize: ".72rem", fontWeight: 700, color: "var(--ink)" }}>{h.aciklama}</p>
                <p style={{ margin: 0, fontSize: ".63rem", color: "#8493a0" }}>{h.tarih}</p>
              </div>
              <span style={{ fontSize: ".75rem", fontWeight: 800, color: t.color, whiteSpace: "nowrap" }}>
                {h.tur === "iade" ? "−" : "+"}{h.tutar.toLocaleString("tr")} TL
              </span>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: ".75rem" }}>
          <span style={{ fontSize: ".7rem", fontWeight: 800, color: "var(--navy)" }}>
            Toplam: {toplam.toLocaleString("tr")} TL
          </span>
        </div>
      </div>
    </section>
  );
}

function DuzenleSection({ u }: { u: Kullanici }) {
  const [adi,       setAdi]       = useState(u.adSoyad);
  const [eposta,    setEposta]    = useState(u.eposta);
  const [gsm,       setGsm]       = useState(u.gsm);
  const [il,        setIl]        = useState(u.il ?? "");
  const [ilce,      setIlce]      = useState(u.ilce ?? "");
  const [adres,     setAdres]     = useState(u.adres ?? "");
  const [univ,      setUniv]      = useState(u.universite ?? "");
  const [fak,       setFak]       = useState(u.fakulte ?? "");
  const [bolum,     setBolum]     = useState(u.bolum ?? "");
  const [rol,       setRol]       = useState<KullaniciRol>(u.rol);
  const [durum,     setDurum]     = useState(u.durum);
  const [saved,     setSaved]     = useState(false);
  const [showDel,   setShowDel]   = useState(false);

  const ROLLER: KullaniciRol[] = ["Müşteri", "Analist", "Editör", "Asistan", "Admin"];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="detail-stack">
      {/* Bilgi formu */}
      <section className="detail-panel">
        <PanelHeading eyebrow="KULLANICI DÜZENLEMEe" title="Bilgileri Güncelle" />
        <div className="settings-panel-body">
          <div className="edu-row-2">
            <div className="form-field">
              <label htmlFor="ku-adi">Adı Soyadı</label>
              <input id="ku-adi" value={adi} onChange={(e) => setAdi(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="ku-eposta">E-posta</label>
              <input id="ku-eposta" value={eposta} onChange={(e) => setEposta(e.target.value)} />
            </div>
          </div>
          <div className="edu-row-2">
            <div className="form-field">
              <label htmlFor="ku-gsm">GSM</label>
              <input id="ku-gsm" value={gsm} onChange={(e) => setGsm(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Rol</label>
              <SystemDropdown ariaLabel="Kullanıcı rolü" value={rol} onChange={(value) => setRol(value as KullaniciRol)} options={ROLLER.map(item => ({ value: item, label: item }))} />
            </div>
          </div>
          <div className="edu-row-2">
            <div className="form-field">
              <label htmlFor="ku-il">İl</label>
              <input id="ku-il" value={il} onChange={(e) => setIl(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="ku-ilce">İlçe</label>
              <input id="ku-ilce" value={ilce} onChange={(e) => setIlce(e.target.value)} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="ku-adres">Adres</label>
            <textarea id="ku-adres" rows={2} value={adres} onChange={(e) => setAdres(e.target.value)} style={{ resize: "vertical" }} />
          </div>
          <div className="form-field">
            <label htmlFor="ku-univ">Üniversite</label>
            <input id="ku-univ" value={univ} onChange={(e) => setUniv(e.target.value)} />
          </div>
          <div className="edu-row-2">
            <div className="form-field">
              <label htmlFor="ku-fak">Fakülte</label>
              <input id="ku-fak" value={fak} onChange={(e) => setFak(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="ku-bolum">Bölüm</label>
              <input id="ku-bolum" value={bolum} onChange={(e) => setBolum(e.target.value)} />
            </div>
          </div>
          <div className="settings-actions">
            <span className={`settings-note${saved ? " success" : ""}`} role="status">
              {saved ? <><Icon name="check" size={13} /> Kaydedildi</> : ""}
            </span>
            <button type="button" onClick={handleSave}
              className="settings-save"
              style={{ background: saved ? "#287a55" : undefined }}>
              <Icon name={saved ? "check" : "save"} size={14} />
              {saved ? "Kaydedildi" : "Kaydet"}
            </button>
          </div>
        </div>
      </section>

      {/* Durum & Aksiyonlar */}
      <section className="detail-panel">
        <PanelHeading eyebrow="AKSİYONLAR" title="Hesap Yönetimi" />
        <div style={{ padding: "1rem 1.4rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {/* Durum toggle */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: ".85rem 1rem", borderRadius: 10,
            background: durum === "Aktif" ? "#f2faf6" : "#f8f8f9",
            border: `1px solid ${durum === "Aktif" ? "#c8e6d4" : "#e2e8ec"}`,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: ".74rem", fontWeight: 800, color: "var(--ink)" }}>
                Hesap Durumu
              </p>
              <p style={{ margin: 0, fontSize: ".65rem", color: "#8493a0", marginTop: ".15rem" }}>
                {durum === "Aktif"
                  ? "Kullanıcı sisteme giriş yapabilir ve işlem gerçekleştirebilir."
                  : "Kullanıcı sisteme erişemiyor, tüm oturumlar kapatıldı."}
              </p>
            </div>
            <button type="button"
              onClick={() => setDurum(d => d === "Aktif" ? "Pasif" : "Aktif")}
              style={{
                padding: ".4rem 1rem", border: 0, borderRadius: 8,
                background: durum === "Aktif" ? "#ad4f4f" : "#287a55",
                color: "#fff", fontSize: ".68rem", fontWeight: 800, cursor: "pointer",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
              {durum === "Aktif" ? "Pasife Al" : "Aktife Al"}
            </button>
          </div>

          {/* Hesap sil */}
          <div style={{
            padding: ".85rem 1rem", borderRadius: 10,
            background: "#fff3f2", border: "1px solid #f5ccc9",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: ".74rem", fontWeight: 800, color: "#ad4f4f" }}>
                  Hesabı Sil
                </p>
                <p style={{ margin: 0, fontSize: ".65rem", color: "#c77070", marginTop: ".15rem" }}>
                  Bu işlem geri alınamaz. Kullanıcıya ait tüm veriler silinir.
                </p>
              </div>
              {!showDel ? (
                <button type="button" onClick={() => setShowDel(true)}
                  style={{
                    padding: ".4rem 1rem", border: "1px solid #f5ccc9", borderRadius: 8,
                    background: "#fff", color: "#ad4f4f",
                    fontSize: ".68rem", fontWeight: 800, cursor: "pointer",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                  <Icon name="trash" size={13} /> Sil
                </button>
              ) : (
                <div style={{ display: "flex", gap: ".4rem", flexShrink: 0 }}>
                  <button type="button" onClick={() => setShowDel(false)}
                    style={{
                      padding: ".4rem .85rem", border: "1px solid #dce5ea", borderRadius: 8,
                      background: "#fff", color: "#526a7d",
                      fontSize: ".68rem", fontWeight: 800, cursor: "pointer",
                    }}>
                    İptal
                  </button>
                  <button type="button"
                    style={{
                      padding: ".4rem .85rem", border: 0, borderRadius: 8,
                      background: "#ad4f4f", color: "#fff",
                      fontSize: ".68rem", fontWeight: 800, cursor: "pointer",
                    }}>
                    Evet, sil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Ana sayfa ─────────────────────────────────────────────────────────────────
export default function KullaniciDetayPage({ params }: { params: Promise<{ id: string }> }) {
  return <AdminShell><UserDetailContent params={params} /></AdminShell>;
}

export function UserDetailContent({ params, basePath = "/admin/kullanici-yonetimi" }: { params: Promise<{ id: string }>; basePath?: string }) {
  const { id }   = use(params);
  const u        = KULLANICILAR.find((k) => k.id === Number(id));
  const [section, setSection] = useState<Section>("ozet");

  if (!u) return (
    <>
      <div className="st-page">
        <div style={{ padding: "3rem", textAlign: "center", color: "#8493a0" }}>
          Kullanıcı bulunamadı.
          <br />
          <Link href={basePath} style={{ color: "var(--blue)", fontSize: ".8rem" }}>
            Listeye dön
          </Link>
        </div>
      </div>
    </>
  );

  const initials = u.adSoyad.split(" ").map(w => w[0]).slice(0, 2).join("");

  return (
    <>
      <main className="detail-page">
        <Link className="back-link" href={basePath}>
          <Icon name="back" size={15} />Kullanıcı Listesine dön
        </Link>

        {/* Hero */}
        <header className="detail-hero">
          <div className="detail-title">
            <span style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "var(--blue-soft)", color: "var(--blue)",
              display: "grid", placeItems: "center",
              fontSize: ".85rem", fontWeight: 800, flexShrink: 0,
            }}>
              {initials}
            </span>
            <div>
              <p className="eyebrow" style={{ marginBottom: ".15rem" }}>
                #{u.id} · {u.kayitTarihi}
              </p>
              <h1>{u.adSoyad}</h1>
            </div>
          </div>
          <div className="detail-current-state">
            <span className={`state-pulse ${u.durum === "Aktif" ? "" : "cancelled"}`} />
            <div>
              <p className="eyebrow light">HESAP DURUMU</p>
              <p style={{ margin: 0, fontWeight: 800 }}>{u.durum}</p>
              <p style={{ margin: 0, fontSize: ".65rem", color: "#8493a0", marginTop: ".1rem" }}>
                {u.rol} · {u.tur}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSection("duzenle")}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              padding: "0 1.25rem", minHeight: 40, border: 0, borderRadius: 8,
              background: "var(--navy)", color: "#fff",
              font: "inherit", fontSize: ".72rem", fontWeight: 800, cursor: "pointer",
            }}>
            <Icon name="edit" size={15} />Düzenle
          </button>
        </header>

        {/* Workspace */}
        <div className="detail-workspace">
          <aside className="detail-sidebar">
            <p>KULLANICI MENÜSÜ</p>
            <nav>
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={section === item.key ? "active" : ""}
                  onClick={() => setSection(item.key)}>
                  <Icon name={item.icon} size={15} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="sidebar-help">
              <p>ID #{u.id}</p>
              <p>Kayıt: {u.kayitTarihi}</p>
            </div>
          </aside>

          <div className="detail-content">
            {section === "ozet"       && <OzetSection u={u} />}
            {section === "siparisler" && <SiparislerSection u={u} />}
            {section === "egitimler"  && <EgitimlerSection u={u} />}
            {section === "aktivite"   && <AktiviteSection u={u} />}
            {section === "cari"       && <CariSection u={u} />}
            {section === "duzenle"    && <DuzenleSection u={u} />}
          </div>
        </div>
      </main>
    </>
  );
}
