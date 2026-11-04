"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { useToast } from "../../../components/ToastProvider";
import { Kullanici, KullaniciDurum, KullaniciRol, readUsers, writeUsers } from "../data";

type Section = "ozet" | "siparisler" | "egitimler" | "aktivite" | "cari" | "duzenle";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "ozet", label: "Özet" },
  { key: "siparisler", label: "Siparişler" },
  { key: "egitimler", label: "Eğitimler" },
  { key: "aktivite", label: "Aktivite" },
  { key: "cari", label: "Cari" },
  { key: "duzenle", label: "Düzenle" },
];

const ROLES: KullaniciRol[] = ["Müşteri", "Analist", "Editör", "Asistan", "Admin"];

const ORDER_LABEL = { yapiliyor: "Yapılıyor", teslim: "Teslim edildi", beklemede: "Beklemede", iptal: "İptal" };
const COURSE_LABEL = { devam: "Devam ediyor", tamamlandi: "Tamamlandı", beklemede: "Beklemede" };

function money(value: number) {
  return `${value.toLocaleString("tr-TR")} TL`;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
}

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`role-switch${checked ? " on" : ""}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

export default function KullaniciDetayPage({ params }: { params: Promise<{ id: string }> }) {
  return <AdminShell><UserDetailContent params={params} /></AdminShell>;
}

export function UserDetailContent({ params, basePath = "/admin/kullanici-yonetimi" }: { params: Promise<{ id: string }>; basePath?: string }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<Kullanici | null | undefined>(undefined);
  const [section, setSection] = useState<Section>("ozet");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setUser(readUsers().find((item) => item.id === Number(id)) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  if (user === undefined) {
    return <div className="fav-page"><div className="fav-card fav-empty"><strong>Kullanıcı yükleniyor</strong><p>Hesap hazırlanıyor.</p></div></div>;
  }
  if (user === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Kullanıcı bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href={basePath}>Listeye dön</Link>
        </div>
      </div>
    );
  }

  function save(next: Kullanici) {
    writeUsers(readUsers().map((item) => item.id === next.id ? next : item));
    setUser(next);
    toast.success("Kullanıcı bilgileri güncellendi.");
  }

  function remove() {
    writeUsers(readUsers().filter((item) => item.id !== user?.id));
    toast.success("Kullanıcı silindi.");
    router.push(basePath);
  }

  const counts: Partial<Record<Section, number>> = {
    siparisler: user.siparisler.length,
    egitimler: user.egitimTalepleri.length,
    aktivite: user.aktivite.length,
    cari: user.cariHareketler.length,
  };

  return (
    <div className="fav-page">
      <Link className="fav-back" href={basePath}><svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" /></svg>Kullanıcı listesine dön</Link>
      <header className="fav-head">
        <div>
          <h1>{user.adSoyad}</h1>
          <p>#{user.id} · {user.kayitTarihi} · {user.rol} · {user.tur}</p>
        </div>
        <span className={`stype-status ${user.durum === "Aktif" ? "aktif" : "pasif"}`}>{user.durum}</span>
      </header>

      <div className="role-heads" role="tablist" aria-label="Kullanıcı bölümleri">
        {SECTIONS.map((item) => (
          <button key={item.key} type="button" role="tab" aria-selected={section === item.key} className={section === item.key ? "on" : ""} onClick={() => setSection(item.key)}>
            {item.label}
            {counts[item.key] !== undefined && <span>{counts[item.key]}</span>}
          </button>
        ))}
      </div>

      {section === "ozet" && <Summary user={user} />}
      {section === "siparisler" && <Orders user={user} />}
      {section === "egitimler" && <Courses user={user} />}
      {section === "aktivite" && <Activity user={user} />}
      {section === "cari" && <Ledger user={user} />}
      {section === "duzenle" && <Editor key={user.id} user={user} onSave={save} onDelete={remove} />}
    </div>
  );
}

function Summary({ user }: { user: Kullanici }) {
  const paid = user.cariHareketler.filter((item) => item.tur === "odeme").map((item) => item.tutar);
  const total = paid.reduce((sum, value) => sum + value, 0);
  const average = user.siparisler.length ? Math.round(total / user.siparisler.length) : 0;
  const facts = [
    ["E-posta", user.eposta],
    ["GSM", user.gsm],
    ["Tür", user.tur],
    ["Durum", user.durum],
    ["Rol", user.rol],
    ["Üniversite", user.universite],
    ["Fakülte", user.fakulte],
    ["Bölüm", user.bolum],
    ["İl / İlçe", user.il ? `${user.il}${user.ilce ? ` / ${user.ilce}` : ""}` : ""],
    ["Adres", user.adres],
  ].filter((item) => item[1]);
  const stats = [
    ["Toplam sipariş", `${user.siparisler.length} adet`],
    ["Minimum ödeme", paid.length ? money(Math.min(...paid)) : "—"],
    ["Maksimum ödeme", paid.length ? money(Math.max(...paid)) : "—"],
    ["Toplam ödeme", total ? money(total) : "—"],
    ["Eğitim talebi", `${user.egitimTalepleri.length} talep`],
    ["Aktivite", `${user.aktivite.length} kayıt`],
    ["Ortalama ücret", average ? money(average) : "0 TL"],
    ["Kayıt tarihi", user.kayitTarihi],
  ];

  return (
    <div className="stype-stack">
      <section className="fav-card stype-section">
        <header><span className="fav-mark user-initials">{initials(user.adSoyad)}</span><h2>Profil</h2></header>
        <dl className="acct-rows">
          {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd className="wrap">{value}</dd></div>)}
        </dl>
      </section>
      <section className="fav-card stype-section">
        <header><h2>Hesap özeti</h2></header>
        <dl className="acct-rows">
          {stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>
    </div>
  );
}

function Orders({ user }: { user: Kullanici }) {
  return (
    <section className="fav-card stype-section">
      <header><h2>Siparişler</h2></header>
      {user.siparisler.length === 0 ? <p className="llist-empty">Sipariş bulunamadı.</p> : user.siparisler.map((order) => (
        <div className="user-row" key={order.kod}>
          <span><strong>{order.hizmet}</strong><small>{order.kod} · {order.tarih}</small></span>
          <span className={`user-chip ${order.durum}`}>{ORDER_LABEL[order.durum]}</span>
          <strong className="user-money">{money(order.tutar)}</strong>
        </div>
      ))}
    </section>
  );
}

function Courses({ user }: { user: Kullanici }) {
  return (
    <section className="fav-card stype-section">
      <header><h2>Eğitim talepleri</h2></header>
      {user.egitimTalepleri.length === 0 ? <p className="llist-empty">Eğitim talebi bulunamadı.</p> : user.egitimTalepleri.map((course, index) => (
        <div className="user-row" key={`${course.egitim}-${index}`}>
          <span><strong>{course.egitim}</strong><small>{course.tarih}</small></span>
          <span className={`user-chip ${course.durum}`}>{COURSE_LABEL[course.durum]}</span>
        </div>
      ))}
    </section>
  );
}

function Activity({ user }: { user: Kullanici }) {
  return (
    <section className="fav-card stype-section">
      <header><h2>Aktivite günlüğü</h2></header>
      {user.aktivite.length === 0 ? <p className="llist-empty">Aktivite kaydı bulunamadı.</p> : user.aktivite.map((entry, index) => (
        <div className="user-row" key={`${entry.tarih}-${index}`}>
          <span><strong>{entry.islem}</strong><small>{entry.tarih}</small></span>
          <code>{entry.ip}</code>
        </div>
      ))}
    </section>
  );
}

function Ledger({ user }: { user: Kullanici }) {
  const total = user.cariHareketler.reduce((sum, item) => sum + (item.tur === "odeme" ? item.tutar : item.tur === "iade" ? -item.tutar : 0), 0);
  return (
    <section className="fav-card stype-section">
      <header><h2>Cari hareketler</h2></header>
      {user.cariHareketler.length === 0 ? <p className="llist-empty">Cari hareket bulunamadı.</p> : (
        <>
          {user.cariHareketler.map((item, index) => (
            <div className="user-row" key={`${item.tarih}-${index}`}>
              <span><strong>{item.aciklama}</strong><small>{item.tarih}</small></span>
              <span className={`user-chip ${item.tur}`}>{item.tur === "odeme" ? "Ödeme" : item.tur === "iade" ? "İade" : "Borç"}</span>
              <strong className="user-money">{item.tur === "iade" ? "−" : "+"}{money(item.tutar)}</strong>
            </div>
          ))}
          <p className="acct-figure">{money(total)}</p>
        </>
      )}
    </section>
  );
}

function Editor({ user, onSave, onDelete }: { user: Kullanici; onSave: (next: Kullanici) => void; onDelete: () => void }) {
  const [adSoyad, setAdSoyad] = useState(user.adSoyad);
  const [eposta, setEposta] = useState(user.eposta);
  const [gsm, setGsm] = useState(user.gsm);
  const [rol, setRol] = useState<KullaniciRol>(user.rol);
  const [durum, setDurum] = useState<KullaniciDurum>(user.durum);
  const [il, setIl] = useState(user.il ?? "");
  const [ilce, setIlce] = useState(user.ilce ?? "");
  const [adres, setAdres] = useState(user.adres ?? "");
  const [universite, setUniversite] = useState(user.universite ?? "");
  const [fakulte, setFakulte] = useState(user.fakulte ?? "");
  const [bolum, setBolum] = useState(user.bolum ?? "");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  function save() {
    if (!adSoyad.trim() || !eposta.trim()) {
      setError("Ad soyad ve e-posta zorunludur.");
      return;
    }
    onSave({
      ...user,
      adSoyad: adSoyad.trim(),
      eposta: eposta.trim(),
      gsm: gsm.trim(),
      rol,
      durum,
      il: il.trim(),
      ilce: ilce.trim(),
      adres: adres.trim(),
      universite: universite.trim(),
      fakulte: fakulte.trim(),
      bolum: bolum.trim(),
    });
  }

  return (
    <section className="fav-card stype-section">
      <header><h2>Bilgileri güncelle</h2></header>
      <div className="stype-grid two">
        <label className="stype-field"><span>Adı soyadı</span><input value={adSoyad} onChange={(event) => { setAdSoyad(event.target.value); setError(""); }} /></label>
        <label className="stype-field"><span>E-posta</span><input value={eposta} onChange={(event) => { setEposta(event.target.value); setError(""); }} /></label>
      </div>
      <div className="stype-grid two">
        <label className="stype-field"><span>GSM</span><input value={gsm} onChange={(event) => setGsm(event.target.value)} /></label>
        <label className="stype-field">
          <span>Rol</span>
          <SystemDropdown ariaLabel="Kullanıcı rolü" value={rol} onChange={(value) => setRol(value as KullaniciRol)} options={ROLES.map((item) => ({ value: item, label: item }))} />
        </label>
      </div>
      <div className="stype-grid two">
        <label className="stype-field"><span>İl</span><input value={il} onChange={(event) => setIl(event.target.value)} /></label>
        <label className="stype-field"><span>İlçe</span><input value={ilce} onChange={(event) => setIlce(event.target.value)} /></label>
      </div>
      <label className="stype-field"><span>Adres</span><textarea value={adres} onChange={(event) => setAdres(event.target.value)} /></label>
      <label className="stype-field"><span>Üniversite</span><input value={universite} onChange={(event) => setUniversite(event.target.value)} /></label>
      <div className="stype-grid two">
        <label className="stype-field"><span>Fakülte</span><input value={fakulte} onChange={(event) => setFakulte(event.target.value)} /></label>
        <label className="stype-field"><span>Bölüm</span><input value={bolum} onChange={(event) => setBolum(event.target.value)} /></label>
      </div>
      <div className="role-option">
        <span><strong>Hesap durumu</strong><small>{durum === "Aktif" ? "Kullanıcı sisteme giriş yapabilir." : "Kullanıcı sisteme erişemiyor."}</small></span>
        <Switch checked={durum === "Aktif"} onChange={(on) => setDurum(on ? "Aktif" : "Pasif")} label="Hesap durumu" />
      </div>
      <div className="fav-actions">
        {error && <p role="alert">{error}</p>}
        {confirming ? (
          <>
            <p>Bu işlem geri alınamaz.</p>
            <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
            <button className="fav-delete" type="button" onClick={onDelete}>Evet, sil</button>
          </>
        ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>Hesabı sil</button>}
        <button className="fav-save" type="button" onClick={save}>Kaydet</button>
      </div>
    </section>
  );
}
