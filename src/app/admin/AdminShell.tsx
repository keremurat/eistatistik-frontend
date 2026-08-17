"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "../components/ProfileMenu";
import { NotificationMenu } from "../components/NotificationMenu";
import { FavoritesProvider, useFavorites } from "./FavoritesContext";

const DataHiddenContext = createContext(false);
/** Admin panelinde verilerin gizli (göz kapalı) olup olmadığını okur. */
export function useDataHidden() {
  return useContext(DataHiddenContext);
}
/** Sayısal değeri, göz kapalıyken •••  ile maskeler. */
export function MaskedNum({ children }: { children: React.ReactNode }) {
  const hidden = useDataHidden();
  if (hidden) return <span style={{ color: "var(--muted)", letterSpacing: ".1em", userSelect: "none", fontWeight: 700 }}>• • •</span>;
  return <>{children}</>;
}

type AdminIconName = "home" | "orders" | "education" | "manage" | "calendar" | "message" | "eye" | "eyeOff" | "star" | "starFilled" | "trash" | "inbox";

function AdminIcon({ name, size = 17 }: { name: AdminIconName; size?: number }) {
  const paths: Record<AdminIconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    orders: <><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /><path d="M9 12h6M9 16h4" /></>,
    education: <><path d="m22 10-10-5L2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" /></>,
    manage: <><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M9 12h6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    eye:        <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff:     <><path d="m3 3 18 18" /><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a15 15 0 0 1-2.2 2.8M6.2 6.2C3.4 8 2 12 2 12s3.5 6 10 6a10 10 0 0 0 4.1-.8" /></>,
    star:       <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
    starFilled: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="currentColor" />,
    trash:      <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></>,
    inbox:      <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

/* ── Favoriler dropdown ──────────────────────────────────────────────────── */
function FavoritesMenu() {
  const { favs, toggle } = useFavorites();
  const [open, setOpen]  = useState(false);
  const menuRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false); }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="favorites-menu-wrap" ref={menuRef}>
      <button
        className={`icon-button${open ? " open" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Favoriler${favs.length > 0 ? `, ${favs.length} öğe` : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <AdminIcon name={favs.length > 0 ? "starFilled" : "star"} size={20} />
        {favs.length > 0 && <span className="notification-dot" style={{ background: "#b66d2e" }}>{favs.length}</span>}
      </button>

      {open && (
        <div className="favorites-dropdown" role="menu">
          <div className="favorites-dropdown-head">
            <strong>Favoriler</strong>
            {favs.length > 0 && <span>{favs.length} öğe</span>}
          </div>

          {favs.length === 0 ? (
            <div className="favorites-empty">
              <AdminIcon name="inbox" size={28} />
              <p>Henüz favori eklenmedi</p>
            </div>
          ) : (
            <div className="favorites-list">
              {favs.map(fav => (
                <div key={fav.id} className="favorites-item" role="menuitem">
                  <Link href={fav.href} onClick={() => setOpen(false)} className="favorites-item-body">
                    <AdminIcon name="starFilled" size={13} />
                    <span className="favorites-item-text">
                      <strong>{fav.label}</strong>
                      {fav.sub && <small>{fav.sub}</small>}
                    </span>
                  </Link>
                  <button
                    className="favorites-item-remove"
                    aria-label={`${fav.label} favorilerden çıkar`}
                    onClick={() => toggle(fav)}
                  >
                    <AdminIcon name="trash" size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type MenuKey = "orders" | "education" | "manage";
type MenuItemDef = { label: string; href: string; subItems?: { label: string; href: string }[] };
const adminMenus: { key: MenuKey; label: string; icon: AdminIconName; items: MenuItemDef[] }[] = [
  { key: "orders", label: "Sipariş Yönetimi", icon: "orders", items: [
    { label: "Mevcut Siparişler / Analizler", href: "/admin/siparisler" },
    { label: "Yeni Analiz Talebi Oluştur", href: "/admin/yeni-analiz-talebi" },
    { label: "Arşiv", href: "/admin/arsiv" },
  ] },
  { key: "education", label: "Eğitimler", icon: "education", items: [
    { label: "Satın Alınan Eğitimler", href: "/admin/egitimler/satin-alinan" },
    { label: "Yeni Eğitim Satın Al", href: "/admin/egitimler/yeni" },
    { label: "Eğitim İstekleri", href: "/admin/egitimler/istekler" },
    { label: "Arşiv", href: "/admin/egitimler/arsiv" },
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
    { label: "İndirim Kodları", href: "/admin/indirim-kodlari" },
    { label: "Rol Yönetimi", href: "/admin/rol-yonetimi" },
    { label: "Kullanıcı Yönetimi", href: "#", subItems: [
      { label: "Kullanıcılar", href: "/admin/kullanici-yonetimi" },
      { label: "Toplu Mesaj Gönder", href: "/admin/toplu-mesaj" },
    ] },
    { label: "Duyurular", href: "/admin/duyurular" },
    { label: "Görev İşlemleri", href: "#", subItems: [
      { label: "Görev Listesi (Kart)", href: "/admin/gorev-isleri/gorev-listesi-kart" },
      { label: "Görev Listesi", href: "/admin/gorev-isleri/gorev-listesi" },
      { label: "Arşiv", href: "/admin/gorev-isleri/arsiv" },
    ] },
    { label: "Proje Muhasebesi Ekle", href: "/admin/proje-muhasebesi" },
  ] },
];

const editorMenus: typeof adminMenus = [
  { key: "orders", label: "Sipariş Yönetimi", icon: "orders", items: [
    { label: "Mevcut Siparişler / Analizler", href: "/editor/siparisler" },
    { label: "Yeni Analiz Talebi Oluştur", href: "/editor/yeni-analiz-talebi" },
  ] },
  { key: "education", label: "Eğitimler", icon: "education", items: [
    { label: "Satın Alınan Eğitimler", href: "/editor/egitimler/satin-alinan" },
    { label: "Yeni Eğitim Satın Al", href: "/editor/egitimler/yeni" },
  ] },
  { key: "manage", label: "Yönetim", icon: "manage", items: [
    { label: "Eğitim Talepleri", href: "#", subItems: [
      { label: "Eğitim Listesi", href: "/editor/egitim-talepleri/egitim-listesi" },
      { label: "Modül Listesi", href: "/editor/egitim-talepleri/modul-listesi" },
      { label: "Ders Listesi", href: "/editor/egitim-talepleri/ders-listesi" },
      { label: "Mentörlük Ayarı", href: "/editor/egitim-talepleri/mentorluk-ayari" },
    ] },
    { label: "İndirim Kodları", href: "/editor/indirim-kodlari" },
    { label: "Kullanıcı Yönetimi", href: "#", subItems: [
      { label: "Kullanıcılar", href: "/editor/kullanici-yonetimi" },
    ] },
    { label: "Duyurular", href: "/editor/duyurular" },
    { label: "Görev İşlemleri", href: "#", subItems: [
      { label: "Görev Listesi (Kart)", href: "/editor/gorev-isleri/gorev-listesi-kart" },
      { label: "Görev Listesi", href: "/editor/gorev-isleri/gorev-listesi" },
      { label: "Arşiv", href: "/editor/gorev-isleri/arsiv" },
    ] },
  ] },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [openMenu, setOpenMenu]       = useState<MenuKey | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [dataHidden, setDataHidden]   = useState(false);
  const navRef          = useRef<HTMLElement>(null);
  const menuCloseTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subCloseTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const isEditor = pathname.startsWith("/editor");
  const menus = isEditor ? editorMenus : adminMenus;
  const homeHref = isEditor ? "/editor" : "/admin";
  const calendarHref = isEditor ? "/editor/takvim" : "/admin/takvim";

  useEffect(() => {
    function closeAll() { setOpenMenu(null); setOpenSubMenu(null); }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function openMenuKey(key: MenuKey) {
    if (menuCloseTimer.current) { clearTimeout(menuCloseTimer.current); menuCloseTimer.current = null; }
    setOpenMenu(key);
    setOpenSubMenu(null);
  }
  function scheduleCloseMenu() {
    menuCloseTimer.current = setTimeout(() => { setOpenMenu(null); setOpenSubMenu(null); }, 150);
  }
  function openSub(label: string) {
    if (subCloseTimer.current) { clearTimeout(subCloseTimer.current); subCloseTimer.current = null; }
    setOpenSubMenu(label);
  }
  function scheduleCloseSub() {
    subCloseTimer.current = setTimeout(() => setOpenSubMenu(null), 150);
  }

  return (
    <FavoritesProvider>
    <div className={`app-shell${isEditor ? " editor-shell" : ""}`}>
      <a className="skip-link" href="#admin-main">İçeriğe geç</a>
      <header className="topbar">
        <Link className="brand" href={homeHref} aria-label={`eistatistik ${isEditor ? "editör" : "yönetim"} ana sayfa`}><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority /></Link>
        <nav className="admin-nav" aria-label={isEditor ? "Editör navigasyonu" : "Yönetici navigasyonu"} ref={navRef}>
          <Link className={pathname === homeHref ? "active" : ""} href={homeHref}><AdminIcon name="home" />Anasayfa</Link>
          {menus.map((menu) => {
            const menuActive = menu.items.some((item) => {
              if (item.href !== "#" && pathname.startsWith(item.href)) return true;
              return item.subItems?.some((s) => s.href !== "#" && pathname.startsWith(s.href)) ?? false;
            });
            return (
            <div
              className="admin-nav-wrap"
              key={menu.key}
              onMouseEnter={() => openMenuKey(menu.key)}
              onMouseLeave={scheduleCloseMenu}
            >
              <button
                className={`admin-nav-trigger${menuActive ? " active" : ""}`}
                aria-expanded={openMenu === menu.key}
                aria-haspopup="menu"
                onClick={() => { setOpenMenu((c) => (c === menu.key ? null : menu.key)); setOpenSubMenu(null); }}
              >
                <AdminIcon name={menu.icon} />{menu.label}<span className="nav-caret">⌄</span>
              </button>
              {openMenu === menu.key && (
                <div className="admin-menu" role="menu">
                  {menu.items.map((item) => {
                    if (item.subItems) {
                      return (
                        <div
                          key={item.label}
                          className="admin-menu-item-wrap"
                          onMouseEnter={() => openSub(item.label)}
                          onMouseLeave={scheduleCloseSub}
                        >
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
          <Link className={pathname === calendarHref ? "active" : ""} href={calendarHref}><AdminIcon name="calendar" />Takvim</Link>
        </nav>
        <div className="top-actions">
          <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
          <button className={`icon-button ${dataHidden ? "open" : ""}`} onClick={() => setDataHidden((current) => !current)} aria-pressed={dataHidden} aria-label={dataHidden ? "Verileri göster" : "Verileri gizle"} title={dataHidden ? "Verileri göster" : "Verileri gizle"}>
            <AdminIcon name={dataHidden ? "eyeOff" : "eye"} size={20} />
          </button>
          <FavoritesMenu />
          <NotificationMenu role={isEditor ? "editor" : "admin"} />
          <ProfileMenu roleLabel={isEditor ? "Editör hesabı" : "Yönetici"} ordersHref={isEditor ? "/editor/siparisler" : "/admin/siparisler"} ordersLabel="Sipariş Yönetimi" name={isEditor ? "eistatistik Editör" : undefined} email={isEditor ? "editor@eistatistik.com" : undefined} initials={isEditor ? "EE" : undefined} />
        </div>
      </header>
      <main id="admin-main" className="admin-dash" data-hidden={dataHidden ? "true" : undefined}>
        <DataHiddenContext.Provider value={dataHidden}>{children}</DataHiddenContext.Provider>
      </main>
      <button className="support-button" aria-label="Destek"><AdminIcon name="message" /><span>Destek</span></button>
    </div>
    </FavoritesProvider>
  );
}
