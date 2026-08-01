"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "../components/ProfileMenu";
import { NotificationMenu } from "../components/NotificationMenu";

const DataHiddenContext = createContext(false);
/** Admin panelinde verilerin gizli (göz kapalı) olup olmadığını okur. */
export function useDataHidden() {
  return useContext(DataHiddenContext);
}

type AdminIconName = "home" | "orders" | "education" | "manage" | "calendar" | "message" | "eye" | "eyeOff";

function AdminIcon({ name, size = 17 }: { name: AdminIconName; size?: number }) {
  const paths: Record<AdminIconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    orders: <><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /><path d="M9 12h6M9 16h4" /></>,
    education: <><path d="m22 10-10-5L2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" /></>,
    manage: <><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M9 12h6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a15 15 0 0 1-2.2 2.8M6.2 6.2C3.4 8 2 12 2 12s3.5 6 10 6a10 10 0 0 0 4.1-.8" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type MenuKey = "orders" | "education" | "manage";
type MenuItemDef = { label: string; href: string; subItems?: { label: string; href: string }[] };
const menus: { key: MenuKey; label: string; icon: AdminIconName; items: MenuItemDef[] }[] = [
  { key: "orders", label: "Sipariş Yönetimi", icon: "orders", items: [
    { label: "Mevcut Siparişler / Analizler", href: "/admin/siparisler" },
    { label: "Yeni Analiz Talebi Oluştur", href: "/admin/yeni-analiz-talebi" },
    { label: "Arşiv", href: "/admin/arsiv" },
  ] },
  { key: "education", label: "Eğitimler", icon: "education", items: [
    { label: "Satın Alınan Eğitimler", href: "#" },
    { label: "Yeni Eğitim Satın Al", href: "#" },
    { label: "Eğitim İstekleri", href: "#" },
    { label: "Arşiv", href: "#" },
  ] },
  { key: "manage", label: "Yönetim", icon: "manage", items: [
    { label: "Sipariş Türleri", href: "/admin/siparis-turleri" },
    { label: "Sipariş Analizör Değiştir", href: "/admin/analizor-degistir" },
    { label: "Mesaj Şablonları", href: "/admin/mesaj-sablonlari" },
    { label: "Eğitim Talepleri", href: "#", subItems: [
      { label: "Eğitim Listesi", href: "/admin/egitim-talepleri/egitim-listesi" },
      { label: "Modül Listesi", href: "/admin/egitim-talepleri/modul-listesi" },
      { label: "Ders Listesi", href: "/admin/egitim-talepleri/ders-listesi" },
      { label: "Mentörlük Ayarı", href: "/admin/egitim-talepleri/mentorluk-ayari" },
    ] },
    { label: "İndirim Kodları", href: "#" },
    { label: "Rol Yönetimi", href: "#" },
    { label: "Kullanıcı Yönetimi", href: "#" },
    { label: "Duyurular", href: "#" },
    { label: "Görev İşlemleri", href: "#" },
    { label: "Proje Muhasebesi Ekle", href: "#" },
  ] },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [openMenu, setOpenMenu]       = useState<MenuKey | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [dataHidden, setDataHidden]   = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function closeAll() { setOpenMenu(null); setOpenSubMenu(null); }
    function closeOnOutsideClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) closeAll();
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#admin-main">İçeriğe geç</a>
      <header className="topbar">
        <Link className="brand" href="/admin" aria-label="Eİstatistik yönetim ana sayfa"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority /></Link>
        <nav className="admin-nav" aria-label="Yönetici navigasyonu" ref={navRef}>
          <Link className={pathname === "/admin" ? "active" : ""} href="/admin"><AdminIcon name="home" />Anasayfa</Link>
          {menus.map((menu) => {
            const menuActive = menu.items.some((item) => {
              if (item.href !== "#" && pathname.startsWith(item.href)) return true;
              return item.subItems?.some((s) => s.href !== "#" && pathname.startsWith(s.href)) ?? false;
            });
            return (
            <div className="admin-nav-wrap" key={menu.key}>
              <button className={`admin-nav-trigger${menuActive ? " active" : ""}`} aria-expanded={openMenu === menu.key} aria-haspopup="menu" onClick={() => { setOpenMenu((current) => (current === menu.key ? null : menu.key)); setOpenSubMenu(null); }}>
                <AdminIcon name={menu.icon} />{menu.label}<span className="nav-caret">⌄</span>
              </button>
              {openMenu === menu.key && (
                <div className="admin-menu" role="menu">
                  {menu.items.map((item) => {
                    if (item.subItems) {
                      return (
                        <div key={item.label} className="admin-menu-item-wrap">
                          <button
                            className={`admin-menu-item-btn${openSubMenu === item.label ? " open" : ""}`}
                            onClick={() => setOpenSubMenu((s) => s === item.label ? null : item.label)}
                            aria-expanded={openSubMenu === item.label}
                            aria-haspopup="menu"
                            role="menuitem"
                          >
                            {item.label}<span className="admin-sub-arrow">›</span>
                          </button>
                          {openSubMenu === item.label && (
                            <div className="admin-submenu" role="menu">
                              {item.subItems.map((sub) => (
                                <Link key={sub.label} role="menuitem" href={sub.href}
                                  onClick={() => { setOpenMenu(null); setOpenSubMenu(null); }}>
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return <Link key={item.label} role="menuitem" href={item.href} onClick={() => setOpenMenu(null)}>{item.label}</Link>;
                  })}
                </div>
              )}
            </div>
            );
          })}
          <Link href="#"><AdminIcon name="calendar" />Takvim</Link>
        </nav>
        <div className="top-actions">
          <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
          <button className={`icon-button ${dataHidden ? "open" : ""}`} onClick={() => setDataHidden((current) => !current)} aria-pressed={dataHidden} aria-label={dataHidden ? "Verileri göster" : "Verileri gizle"} title={dataHidden ? "Verileri göster" : "Verileri gizle"}>
            <AdminIcon name={dataHidden ? "eyeOff" : "eye"} size={20} />
          </button>
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </header>
      <main id="admin-main" className="admin-dash"><DataHiddenContext.Provider value={dataHidden}>{children}</DataHiddenContext.Provider></main>
      <button className="support-button" aria-label="Destek"><AdminIcon name="message" /><span>Destek</span></button>
    </div>
  );
}
