"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { ProfileMenu } from "../components/ProfileMenu";
import { NotificationMenu } from "../components/NotificationMenu";
import { BrandLogo } from "../components/BrandLogo";

type Section = "account" | "billing" | "security";
type BillingType = "individual" | "corporate";
type IconName = "arrow" | "back" | "book" | "card" | "check" | "file" | "home" | "invoice" | "message" | "shield" | "spark" | "user";

const navItems: { key: Section; label: string; icon: IconName }[] = [
  { key: "account", label: "Hesap bilgileri", icon: "user" },
  { key: "billing", label: "Fatura bilgileri", icon: "invoice" },
  { key: "security", label: "Güvenlik", icon: "shield" },
];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <div className="form-field"><label>{label}{hint && <em> {hint}</em>}</label>{children}</div>;
}

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("account");

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">İçeriğe geç</a>
      <header className="topbar">
        <BrandLogo />
        <nav className="main-nav" aria-label="Ana navigasyon">
          <Link href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
          <Link href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <Link href="/egitimler"><Icon name="book" size={17} />Eğitimlerim</Link>
          <Link href="/yeni-analiz-talebi"><Icon name="spark" size={17} />Hizmetler</Link>
        </nav>
        <div className="top-actions">
          <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </header>

      <main id="main-content" className="detail-page">
        <Link className="back-link" href="/dashboard"><Icon name="back" size={16} />Genel bakışa dön</Link>
        <header className="detail-hero">
          <div className="detail-title"><span className="detail-file-icon"><Icon name="user" size={22} /></span><div><p className="eyebrow">HESABIM</p><h1>Ayarlar</h1></div></div>
          <div className="detail-current-state"><span className="state-pulse" /><div><small>HESAP SAHİBİ</small><strong>Kerem Murat</strong><span>kerem@example.com</span></div></div>
        </header>

        <div className="detail-workspace">
          <aside className="detail-sidebar" aria-label="Ayarlar bölümleri">
            <p>AYARLAR MENÜSÜ</p>
            <nav>{navItems.map(item => <button key={item.key} className={section === item.key ? "active" : ""} onClick={() => setSection(item.key)}><Icon name={item.icon} size={17} /><span>{item.label}</span></button>)}</nav>
            <div className="sidebar-help"><Icon name="message" size={17} /><div><strong>Yardıma mı ihtiyacınız var?</strong><span>Destek ekibine yazın</span></div></div>
          </aside>
          <section className="detail-content">
            {section === "account" && <AccountSection />}
            {section === "billing" && <BillingSection />}
            {section === "security" && <SecuritySection />}
          </section>
        </div>
      </main>
      <button className="support-button" aria-label="Destek"><Icon name="message" /><span>Destek</span></button>
    </div>
  );
}

function useSavedNote() {
  const [note, setNote] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const flash = (type: "success" | "error", text: string) => setNote({ type, text });
  return { note, flash };
}

function AccountSection() {
  const [fullName, setFullName] = useState("Kerem Murat");
  const [email, setEmail] = useState("kerem@example.com");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const { note, flash } = useSavedNote();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      flash("error", "Ad Soyad ve geçerli bir e-posta gerekli.");
      return;
    }
    flash("success", "Hesap bilgileriniz kaydedildi.");
  }

  return <form className="detail-stack" onSubmit={handleSubmit}>
    <section className="detail-panel">
      <header className="detail-panel-heading"><div><p className="eyebrow">KİŞİSEL</p><h2>Hesap bilgileri</h2><span>Yalnızca kendi hesabınıza ait bilgileri güncelleyebilirsiniz.</span></div></header>
      <div className="settings-panel-body">
        <Field label="Ad Soyad *"><input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Örn. Kerem Murat" /></Field>
        <div className="form-grid">
          <Field label="E-posta adresi *"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@eposta.com" autoComplete="email" /></Field>
          <Field label="Cep telefonu"><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555 55 55" inputMode="tel" /></Field>
        </div>
      </div>
      <div className="settings-actions">{note && <span className={`settings-note ${note.type}`} role="status">{note.text}</span>}<button className="settings-save" type="submit"><Icon name="check" size={16} />Değişiklikleri kaydet</button></div>
    </section>

    <section className="detail-panel">
      <header className="detail-panel-heading"><div><p className="eyebrow">EK BİLGİLER</p><h2>Akademik bilgiler</h2><span>Bu bilgiler taleplerinizin doğru değerlendirilmesine yardımcı olur.</span></div></header>
      <div className="settings-panel-body">
        <ChoiceField label="Akademik seviye" options={["Lisans", "Yüksek lisans", "Doktora", "Akademik yayın"]} value={academicLevel} onChange={setAcademicLevel} />
        <Field label="Üniversite"><input value={university} onChange={e => setUniversity(e.target.value)} placeholder="Üniversitenizi yazın" /></Field>
        <div className="form-grid">
          <Field label="Fakülte"><input value={faculty} onChange={e => setFaculty(e.target.value)} placeholder="Fakülteniz" /></Field>
          <Field label="Bölüm"><input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Bölümünüz" /></Field>
        </div>
      </div>
      <div className="settings-actions"><button className="settings-save" type="submit"><Icon name="check" size={16} />Değişiklikleri kaydet</button></div>
    </section>
  </form>;
}

function BillingSection() {
  const [billingType, setBillingType] = useState<BillingType>("individual");
  const [tcNo, setTcNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [taxNo, setTaxNo] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const { note, flash } = useSavedNote();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (billingType === "individual" && tcNo.trim().length !== 11) {
      flash("error", "TC Kimlik No 11 haneli olmalıdır.");
      return;
    }
    if (billingType === "corporate" && (!companyName.trim() || !taxNo.trim())) {
      flash("error", "Firma ünvanı ve vergi numarası gereklidir.");
      return;
    }
    flash("success", "Fatura bilgileriniz kaydedildi.");
  }

  return <form className="detail-stack" onSubmit={handleSubmit}>
    <section className="detail-panel">
      <header className="detail-panel-heading"><div><p className="eyebrow">FATURALANDIRMA</p><h2>Fatura bilgileri</h2><span>Siparişleriniz için düzenlenecek faturalarda bu bilgiler kullanılır.</span></div></header>
      <div className="settings-panel-body">
        <ChoiceField label="Fatura türü *" options={[["individual", "Bireysel"], ["corporate", "Kurumsal"]]} value={billingType} onChange={value => setBillingType(value as BillingType)} />

        {billingType === "individual" ? <>
          <Field label="TC Kimlik No *"><input value={tcNo} onChange={e => setTcNo(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="11 haneli kimlik numaranız" inputMode="numeric" /></Field>
        </> : <>
          <Field label="Firma ünvanı *"><input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Şirketinizin ticari ünvanı" /></Field>
          <div className="form-grid">
            <Field label="Vergi dairesi *"><input value={taxOffice} onChange={e => setTaxOffice(e.target.value)} placeholder="Vergi daireniz" /></Field>
            <Field label="Vergi numarası *"><input value={taxNo} onChange={e => setTaxNo(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="Vergi numaranız" inputMode="numeric" /></Field>
          </div>
        </>}

        <div className="form-grid">
          <Field label="İl"><input value={city} onChange={e => setCity(e.target.value)} placeholder="İl" /></Field>
          <Field label="İlçe"><input value={district} onChange={e => setDistrict(e.target.value)} placeholder="İlçe" /></Field>
        </div>
        <Field label="Fatura adresi"><textarea className="small" value={address} onChange={e => setAddress(e.target.value)} placeholder="Fatura gönderim adresiniz" /></Field>
        <p className="settings-hint">Fatura bilgilerinizi ödeme öncesinde sipariş detayındaki Fatura bölümünden de güncelleyebilirsiniz.</p>
      </div>
      <div className="settings-actions">{note && <span className={`settings-note ${note.type}`} role="status">{note.text}</span>}<button className="settings-save" type="submit"><Icon name="check" size={16} />Fatura bilgilerini kaydet</button></div>
    </section>
  </form>;
}

function SecuritySection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const { note, flash } = useSavedNote();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current) { flash("error", "Mevcut parolanızı girin."); return; }
    if (next.length < 6) { flash("error", "Yeni parola en az 6 karakter olmalı."); return; }
    if (next !== confirm) { flash("error", "Yeni parolalar eşleşmiyor."); return; }
    flash("success", "Parolanız güncellendi.");
    setCurrent(""); setNext(""); setConfirm("");
  }

  return <form className="detail-stack" onSubmit={handleSubmit}>
    <section className="detail-panel">
      <header className="detail-panel-heading"><div><p className="eyebrow">GÜVENLİK</p><h2>Parola değiştir</h2><span>Hesabınızın güvenliği için güçlü bir parola kullanın.</span></div></header>
      <div className="settings-panel-body">
        <Field label="Mevcut parola *"><input type="password" value={current} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" /></Field>
        <div className="form-grid">
          <Field label="Yeni parola *" hint="(en az 6 karakter)"><input type="password" value={next} onChange={e => setNext(e.target.value)} autoComplete="new-password" /></Field>
          <Field label="Yeni parola tekrar *"><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" /></Field>
        </div>
      </div>
      <div className="settings-actions">{note && <span className={`settings-note ${note.type}`} role="status">{note.text}</span>}<button className="settings-save" type="submit"><Icon name="shield" size={16} />Parolayı güncelle</button></div>
    </section>
  </form>;
}

function ChoiceField({ label, options, value, onChange }: { label: string; options: (string | [string, string])[]; value: string; onChange: (value: string) => void }) {
  const normalized = options.map(option => Array.isArray(option) ? option : [option, option] as [string, string]);
  return <fieldset className="choice-field"><legend>{label}</legend><div>{normalized.map(([optionValue, optionLabel]) => <button type="button" key={optionValue} className={value === optionValue ? "active" : ""} onClick={() => onChange(optionValue)}>{value === optionValue && <Icon name="check" size={13} />}{optionLabel}</button>)}</div></fieldset>;
}
