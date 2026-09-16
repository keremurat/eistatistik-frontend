"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

type Role = "admin" | "editor" | "analizor" | "asistan";
type Section = "account" | "security" | "system";

const ROLE_HOME: Record<Role, string> = { admin: "/admin", editor: "/editor", analizor: "/analizor", asistan: "/asistan" };
const ADMIN_SETTINGS = [
  ["Anasayfa Ayarları", "Landing sayfasının içerik ve görünürlük ayarları", "/admin/anasayfa-ayarlari"],
  ["Plan Ayarları", "Üyelik planları ve hizmet kapsamları", "/admin/plan-ayarlari"],
  ["Mentörlük Ayarları", "Mentörlük talep ve çalışma kuralları", "/admin/egitim-talepleri/mentorluk-ayari"],
  ["Sipariş Türleri", "Sipariş türleri, teslimat ve fiyat seçenekleri", "/admin/siparis-turleri"],
  ["Mesaj Şablonları", "Sistem genelinde kullanılan hazır mesajlar", "/admin/mesaj-sablonlari"],
  ["İndirim Kodları", "Kuponlar, limitler ve geçerlilik tarihleri", "/admin/indirim-kodlari"],
  ["Rol ve Yetki Yönetimi", "Roller ve özellik bayrakları", "/admin/rol-yonetimi"],
] as const;

function subscribeRole(callback: () => void) { window.addEventListener("storage", callback); return () => window.removeEventListener("storage", callback); }

function SettingsIcon() {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.5v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.5h.3A1.7 1.7 0 0 0 4 8.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.46 3.6l.06.06A1.7 1.7 0 0 0 8.4 4a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 9.8 2.3V2h4.1v.3A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 8.4a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.3v4.1h-.3A1.7 1.7 0 0 0 19.4 15Z"/></svg>;
}

export function RoleSettingsContent({ role, roleLabel, name, email }: { role: Role; roleLabel: string; name: string; email: string }) {
  const router = useRouter();
  const toast = useToast();
  const currentRole = useSyncExternalStore(subscribeRole, () => localStorage.getItem("eistatistik_role"), () => null);
  const [section, setSection] = useState<Section>(role === "admin" ? "system" : "account");
  const [fullName, setFullName] = useState(name);
  const [mail, setMail] = useState(email);
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentRole === null || currentRole === role) return;
    router.replace(ROLE_HOME[currentRole as Role] ?? "/giris");
  }, [currentRole, role, router]);

  if (currentRole !== role) return null;

  function saveAccount(event: FormEvent) {
    event.preventDefault();
    if (!fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { setError("Ad soyad ve geçerli bir e-posta adresi gerekli."); return; }
    setError(""); toast.success("Hesap bilgileriniz kaydedildi.");
  }

  function savePassword(event: FormEvent) {
    event.preventDefault();
    if (!currentPassword) { setError("Mevcut parolanızı girin."); return; }
    if (password.length < 6) { setError("Yeni parola en az 6 karakter olmalı."); return; }
    if (password !== confirm) { setError("Yeni parolalar eşleşmiyor."); return; }
    setError(""); setCurrentPassword(""); setPassword(""); setConfirm(""); toast.success("Parolanız güncellendi.");
  }

  return <div className="detail-page role-settings-page">
    <header className="detail-hero">
      <div className="detail-title"><span className="detail-file-icon"><SettingsIcon /></span><div><p className="eyebrow">{roleLabel.toLocaleUpperCase("tr-TR")}</p><h1>Ayarlar</h1></div></div>
      <div className="detail-current-state"><div><small>HESAP SAHİBİ</small><strong>{name}</strong><span>{email}</span></div></div>
    </header>
    <div className="detail-workspace">
      <aside className="detail-sidebar" aria-label="Ayarlar bölümleri"><p>AYARLAR MENÜSÜ</p><nav>
        <button className={section === "account" ? "active" : ""} onClick={() => { setSection("account"); setError(""); }}>Hesap bilgileri</button>
        <button className={section === "security" ? "active" : ""} onClick={() => { setSection("security"); setError(""); }}>Güvenlik</button>
        {role === "admin" && <button className={section === "system" ? "active" : ""} onClick={() => { setSection("system"); setError(""); }}>Sistem ayarları</button>}
      </nav></aside>
      <section className="detail-content">
        {section === "account" && <form className="detail-stack" onSubmit={saveAccount}><section className="detail-panel"><header className="detail-panel-heading"><div><p className="eyebrow">HESABIM</p><h2>Hesap bilgileri</h2><span>Yalnızca bu role ait kullanıcı bilgilerini güncelleyin.</span></div></header><div className="settings-panel-body"><div className="form-field"><label>Ad Soyad</label><input value={fullName} onChange={event => setFullName(event.target.value)} /></div><div className="form-grid"><div className="form-field"><label>E-posta</label><input type="email" value={mail} onChange={event => setMail(event.target.value)} /></div><div className="form-field"><label>Telefon</label><input value={phone} onChange={event => setPhone(event.target.value)} placeholder="(555) 555 55 55" /></div></div></div><footer className="settings-actions"><span className="settings-note error">{error}</span><button className="settings-save" type="submit">Değişiklikleri kaydet</button></footer></section></form>}
        {section === "security" && <form className="detail-stack" onSubmit={savePassword}><section className="detail-panel"><header className="detail-panel-heading"><div><p className="eyebrow">GÜVENLİK</p><h2>Parola değiştir</h2><span>Hesabınız için güçlü ve benzersiz bir parola kullanın.</span></div></header><div className="settings-panel-body"><div className="form-field"><label>Mevcut parola</label><input type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} /></div><div className="form-grid"><div className="form-field"><label>Yeni parola</label><input type="password" value={password} onChange={event => setPassword(event.target.value)} /></div><div className="form-field"><label>Yeni parola tekrar</label><input type="password" value={confirm} onChange={event => setConfirm(event.target.value)} /></div></div></div><footer className="settings-actions"><span className="settings-note error">{error}</span><button className="settings-save" type="submit">Parolayı güncelle</button></footer></section></form>}
        {section === "system" && role === "admin" && <section className="detail-panel"><header className="detail-panel-heading"><div><p className="eyebrow">YÖNETİM MERKEZİ</p><h2>Sistem ayarları</h2><span>Platform yapılandırmalarının tamamına tek menüden ulaşın.</span></div></header><div className="settings-hub-list">{ADMIN_SETTINGS.map(([title, description, href]) => <Link href={href} key={href}><span><strong>{title}</strong><small>{description}</small></span><b>›</b></Link>)}</div></section>}
      </section>
    </div>
  </div>;
}
