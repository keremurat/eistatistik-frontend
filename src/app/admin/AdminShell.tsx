"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "../components/ProfileMenu";
import { CustomerNavIcon } from "../components/CustomerNavIcon";
import { NotificationMenu } from "../components/NotificationMenu";
import { useAccess } from "../components/AccessProvider";
import { FavoritesProvider, useFavorites } from "./FavoritesContext";

const DataHiddenContext = createContext(false);
/** Admin panelinde verilerin gizli (göz kapalı) olup olmadığını okur. */
export function useDataHidden() {
  return useContext(DataHiddenContext);
}
/** Sayısal değeri, göz kapalıyken •••  ile maskeler. */
export function MaskedNum({ children }: { children: React.ReactNode }) {
  const hidden = useDataHidden();
  if (hidden) return <span className="masked-number-placeholder">• • •</span>;
  return <>{children}</>;
}

type AdminIconName = "home" | "orders" | "education" | "manage" | "calendar" | "message" | "eye" | "eyeOff" | "star" | "starFilled" | "trash" | "inbox" | "users" | "role" | "transfer" | "tag" | "card" | "send" | "book" | "layers" | "settings";

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
    users:      <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    role:       <><path d="M12 3l7 3v5c0 4.2-2.8 7.3-7 8.8-4.2-1.5-7-4.6-7-8.8V6l7-3Z" /><path d="m9 11.5 2 2 4-4" /></>,
    transfer:   <><path d="M4 8h13" /><path d="m13 4 4 4-4 4" /><path d="M20 16H7" /><path d="m11 12-4 4 4 4" /></>,
    tag:        <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" /></>,
    card:       <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
    send:       <><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></>,
    book:       <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    layers:     <><path d="m12 2 10 5-10 5L2 7l10-5Z" /><path d="m2 12 10 5 10-5" /><path d="m2 17 10 5 10-5" /></>,
    settings:   <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" /><path d="M1 14h6M9 8h6M17 16h6" /></>,
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
        {favs.length > 0 && <span className="notification-dot favorites-notification-dot">{favs.length}</span>}
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
type MenuItemDef = { label: string; href: string; icon?: AdminIconName; permission?: string; subItems?: { label: string; href: string; permission?: string }[] };
type ManagementGroup = { label: string; items: { label: string; href: string; icon: AdminIconName; permission: string }[] };

function filterMenuItems(items: MenuItemDef[], canSee: (permission?: string) => boolean): MenuItemDef[] {
  return items.flatMap(item => {
    if (item.subItems) {
      const subItems = item.subItems.filter(subItem => canSee(subItem.permission));
      return subItems.length > 0 ? [{ ...item, subItems }] : [];
    }
    return canSee(item.permission) ? [item] : [];
  });
}

const managementGroups: ManagementGroup[] = [
  { label: "Sipariş Ayarları", items: [
    { label: "Favori Kategorileri", href: "/admin/favori-kategorileri", icon: "star", permission: "siparis.dashboard" },
    { label: "Sipariş Türleri", href: "/admin/siparis-turleri", icon: "orders", permission: "siparis.dashboard" },
    { label: "Sipariş Analizör Değiştir", href: "/admin/analizor-degistir", icon: "transfer", permission: "siparis.analizor" },
    { label: "Mesaj Şablonları", href: "/admin/mesaj-sablonlari", icon: "message", permission: "diger.mesaj" },
    { label: "Proje Muhasebesi", href: "/admin/proje-muhasebesi", icon: "card", permission: "siparis.dashboard" },
  ] },
  { label: "Eğitim Talepleri", items: [
    { label: "Eğitim Listesi", href: "/admin/egitim-talepleri/egitim-listesi", icon: "education", permission: "egitim.yonetim" },
    { label: "Modül Listesi", href: "/admin/egitim-talepleri/modul-listesi", icon: "layers", permission: "egitim.yonetim" },
    { label: "Ders Listesi", href: "/admin/egitim-talepleri/ders-listesi", icon: "book", permission: "egitim.yonetim" },
    { label: "Mentörlük Ayarı", href: "/admin/egitim-talepleri/mentorluk-ayari", icon: "users", permission: "egitim.yonetim" },
    { label: "İndirim Kodları", href: "/admin/indirim-kodlari", icon: "tag", permission: "kupon.listele" },
    { label: "Rol Yönetimi", href: "/admin/rol-yonetimi", icon: "role", permission: "diger.rol" },
  ] },
  { label: "Kullanıcı Yönetimi", items: [
    { label: "Kullanıcılar", href: "/admin/kullanici-yonetimi", icon: "users", permission: "kullanici.listele" },
    { label: "Toplu Mesaj Gönder", href: "/admin/toplu-mesaj", icon: "send", permission: "kullanici.whatsapp" },
    { label: "Randevular", href: "/admin/randevular", icon: "calendar", permission: "diger.takvim" },
    { label: "Rehber Adımları", href: "/admin/rehber-adimlari", icon: "book", permission: "diger.dashboard" },
    { label: "Duyurular", href: "/admin/duyurular", icon: "message", permission: "diger.duyuru" },
  ] },
  { label: "Abonelik", items: [
    { label: "Abonelikler", href: "/admin/abonelikler", icon: "card", permission: "diger.dashboard" },
    { label: "Plan Ayarları", href: "/admin/plan-ayarlari", icon: "settings", permission: "diger.dashboard" },
    { label: "Bültenler", href: "/admin/bultenler", icon: "send", permission: "diger.dashboard" },
    { label: "İçerikler", href: "/admin/icerikler", icon: "inbox", permission: "diger.dashboard" },
    { label: "Bülten Önizleme", href: "/admin/bulten-onizleme", icon: "eye", permission: "diger.dashboard" },
    { label: "Hizmetler", href: "/admin/hizmetler", icon: "orders", permission: "diger.dashboard" },
  ] },
  { label: "Şablon Ayarları", items: [
    { label: "Analiz Şablonları", href: "/admin/analiz-sablonlari", icon: "layers", permission: "diger.dashboard" },
    { label: "Şablon Görünümü", href: "/admin/sablon-gorunumu", icon: "eye", permission: "diger.dashboard" },
  ] },
  { label: "Görev İşlemleri", items: [
    { label: "Görev Listesi (Kart)", href: "/admin/gorev-isleri/gorev-listesi-kart", icon: "orders", permission: "pano.listele" },
    { label: "Görev Listesi", href: "/admin/gorev-isleri/gorev-listesi", icon: "manage", permission: "pano.listele" },
    { label: "Arşiv", href: "/admin/gorev-isleri/arsiv", icon: "inbox", permission: "pano.listele" },
  ] },
  { label: "Site Ayarları", items: [
    { label: "Anasayfa Ayarları", href: "/admin/anasayfa-ayarlari", icon: "home", permission: "diger.dashboard" },
  ] },
];
const adminMenus: { key: MenuKey; label: string; icon: AdminIconName; items: MenuItemDef[] }[] = [
  { key: "orders", label: "Sipariş Yönetimi", icon: "orders", items: [
    { label: "Mevcut Siparişler / Analizler", href: "/admin/siparisler", icon: "orders", permission: "siparis.listele" },
    { label: "Yeni Analiz Talebi Oluştur", href: "/admin/yeni-analiz-talebi", icon: "layers", permission: "siparis.olustur" },
    { label: "Arşiv", href: "/admin/arsiv", icon: "inbox", permission: "siparis.listele" },
  ] },
  { key: "education", label: "Eğitimler", icon: "education", items: [
    { label: "Satın Alınan Eğitimler", href: "/admin/egitimler/satin-alinan", icon: "education", permission: "egitim.listele" },
    { label: "Yeni Eğitim Satın Al", href: "/admin/egitimler/yeni", icon: "book", permission: "egitim.olustur" },
    { label: "Eğitim İstekleri", href: "/admin/egitimler/istekler", icon: "message", permission: "egitim.listele" },
    { label: "Arşiv", href: "/admin/egitimler/arsiv", icon: "inbox", permission: "egitim.listele" },
  ] },
  { key: "manage", label: "Yönetim", icon: "manage", items: [
    { label: "Sipariş Türleri", href: "/admin/siparis-turleri", permission: "siparis.dashboard" },
    { label: "Sipariş Analizör Değiştir", href: "/admin/analizor-degistir", permission: "siparis.analizor" },
    { label: "Mesaj Şablonları", href: "/admin/mesaj-sablonlari", permission: "diger.mesaj" },
    { label: "Eğitim Talepleri", href: "#", permission: "egitim.yonetim", subItems: [
      { label: "Eğitim Listesi", href: "/admin/egitim-talepleri/egitim-listesi", permission: "egitim.yonetim" },
      { label: "Modül Listesi", href: "/admin/egitim-talepleri/modul-listesi", permission: "egitim.yonetim" },
      { label: "Ders Listesi", href: "/admin/egitim-talepleri/ders-listesi", permission: "egitim.yonetim" },
      { label: "Mentörlük Ayarı", href: "/admin/egitim-talepleri/mentorluk-ayari", permission: "egitim.yonetim" },
    ] },
    { label: "İndirim Kodları", href: "/admin/indirim-kodlari", permission: "kupon.listele" },
    { label: "Rol Yönetimi", href: "/admin/rol-yonetimi", permission: "diger.rol" },
    { label: "Kullanıcı Yönetimi", href: "#", permission: "kullanici.listele", subItems: [
      { label: "Kullanıcılar", href: "/admin/kullanici-yonetimi", permission: "kullanici.listele" },
      { label: "Toplu Mesaj Gönder", href: "/admin/toplu-mesaj", permission: "kullanici.whatsapp" },
    ] },
    { label: "Duyurular", href: "/admin/duyurular", permission: "diger.duyuru" },
    { label: "Görev İşlemleri", href: "#", permission: "pano.listele", subItems: [
      { label: "Görev Listesi (Kart)", href: "/admin/gorev-isleri/gorev-listesi-kart", permission: "pano.listele" },
      { label: "Görev Listesi", href: "/admin/gorev-isleri/gorev-listesi", permission: "pano.listele" },
      { label: "Arşiv", href: "/admin/gorev-isleri/arsiv", permission: "pano.listele" },
    ] },
    { label: "Proje Muhasebesi Ekle", href: "/admin/proje-muhasebesi", permission: "siparis.dashboard" },
  ] },
];

const editorMenus: typeof adminMenus = [
  { key: "orders", label: "Sipariş Yönetimi", icon: "orders", items: [
    { label: "Mevcut Siparişler / Analizler", href: "/editor/siparisler", icon: "orders", permission: "siparis.listele" },
    { label: "Yeni Analiz Talebi Oluştur", href: "/editor/yeni-analiz-talebi", icon: "layers", permission: "siparis.olustur" },
  ] },
  { key: "education", label: "Eğitimler", icon: "education", items: [
    { label: "Satın Alınan Eğitimler", href: "/editor/egitimler/satin-alinan", icon: "education", permission: "egitim.listele" },
    { label: "Yeni Eğitim Satın Al", href: "/editor/egitimler/yeni", icon: "book", permission: "egitim.olustur" },
  ] },
  { key: "manage", label: "Yönetim", icon: "manage", items: [
    { label: "Eğitim Talepleri", href: "#", permission: "egitim.yonetim", subItems: [
      { label: "Eğitim Listesi", href: "/editor/egitim-talepleri/egitim-listesi", permission: "egitim.yonetim" },
      { label: "Modül Listesi", href: "/editor/egitim-talepleri/modul-listesi", permission: "egitim.yonetim" },
      { label: "Ders Listesi", href: "/editor/egitim-talepleri/ders-listesi", permission: "egitim.yonetim" },
      { label: "Mentörlük Ayarı", href: "/editor/egitim-talepleri/mentorluk-ayari", permission: "egitim.yonetim" },
    ] },
    { label: "İndirim Kodları", href: "/editor/indirim-kodlari", permission: "kupon.listele" },
    { label: "Kullanıcı Yönetimi", href: "#", permission: "kullanici.listele", subItems: [
      { label: "Kullanıcılar", href: "/editor/kullanici-yonetimi", permission: "kullanici.listele" },
    ] },
    { label: "Duyurular", href: "/editor/duyurular", permission: "diger.duyuru" },
    { label: "Görev İşlemleri", href: "#", permission: "pano.listele", subItems: [
      { label: "Görev Listesi (Kart)", href: "/editor/gorev-isleri/gorev-listesi-kart", permission: "pano.listele" },
      { label: "Görev Listesi", href: "/editor/gorev-isleri/gorev-listesi", permission: "pano.listele" },
      { label: "Arşiv", href: "/editor/gorev-isleri/arsiv", permission: "pano.listele" },
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
  const access = useAccess();
  const isEditor = pathname.startsWith("/editor");
  const canSee = (permission?: string) => !permission || access.can(permission);
  const visibleGroups = managementGroups
    .map(group => ({ ...group, items: group.items.filter(item => canSee(item.permission)) }))
    .filter(group => group.items.length > 0);
  const menus = (isEditor ? editorMenus : adminMenus)
    .map(menu => ({ ...menu, items: filterMenuItems(menu.items, canSee) }))
    .filter(menu => menu.key === "manage" && !isEditor ? visibleGroups.length > 0 : menu.items.length > 0);
  const homeHref = isEditor ? "/editor" : "/admin";
  const calendarHref = isEditor ? "/editor/takvim" : "/admin/takvim";
  const managementHrefs = isEditor
    ? editorMenus.find((menu) => menu.key === "manage")?.items.flatMap((item) => [item.href, ...(item.subItems?.map((subItem) => subItem.href) ?? [])]) ?? []
    : managementGroups.flatMap((group) => group.items.map((item) => item.href));
  const isManagementPage = managementHrefs.some((href) => href !== "#" && pathname.startsWith(href));

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

  const inAdminDesk = !isEditor && (pathname.startsWith("/admin/dashboard") || managementHrefs.some((href) => href !== "#" && (pathname === href || pathname.startsWith(`${href}/`))));
  const topMenus = isEditor ? menus : menus.filter((menu) => menu.key !== "manage");
  const activeDeskGroup = visibleGroups.find((group) => group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)))?.label ?? null;

  return (
    <FavoritesProvider>
    <div className={`app-shell customer-shell${inAdminDesk ? " dash-app" : ""}`}>
      <a className="skip-link" href="#admin-main">İçeriğe geç</a>
      {inAdminDesk ? (
        <aside className="dash-side">
          <Link className="brand" href="/admin/dashboard" aria-label="Admin dashboard"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority /></Link>
          <p className="dash-kicker">Dashboard</p>
          <nav aria-label="Yönetici navigasyonu">
            <Link className={pathname.startsWith("/admin/dashboard") ? "active" : ""} href="/admin/dashboard"><CustomerNavIcon name="dashboard" />Özet</Link>
            {visibleGroups.map((group) => {
              const open = (openSubMenu ?? activeDeskGroup) === group.label;
              return (
                <div className="dash-group" key={group.label}>
                  <button type="button" className={open ? "open" : ""} aria-expanded={open} onClick={() => setOpenSubMenu(open ? "" : group.label)}>
                    {group.label}
                    <span className="dash-caret" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m4 6.25 4 4 4-4" /></svg></span>
                  </button>
                  {open && (
                    <div className="dash-sub">
                      {group.items.map((item) => <Link key={item.href} className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "active" : ""} href={item.href}>{item.label}</Link>)}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <Link className="dash-exit" href="/admin">Dashboarddan çık</Link>
          <div className="dash-side-tools">
            <button className={`icon-button ${dataHidden ? "open" : ""}`} onClick={() => setDataHidden((current) => !current)} aria-pressed={dataHidden} aria-label={dataHidden ? "Verileri göster" : "Verileri gizle"} title={dataHidden ? "Verileri göster" : "Verileri gizle"}>
              <AdminIcon name={dataHidden ? "eyeOff" : "eye"} size={20} />
            </button>
            <FavoritesMenu />
            <NotificationMenu role="admin" />
            <ProfileMenu roleLabel={access.roleName || "Yönetici"} settingsHref="/admin/ayarlar" ordersHref="/admin/siparisler" ordersLabel="Sipariş Yönetimi" dashboardHref={canSee("menu.dashboard") ? "/admin/dashboard" : undefined} name="Kerem Murat" email="admin@eistatistik.com" initials="KM" />
          </div>
        </aside>
      ) : (
      <header className="topbar">
        <Link className="brand" href={homeHref} aria-label={`eistatistik ${isEditor ? "editör" : "yönetim"} ana sayfa`}><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority /></Link>
        <nav className="admin-nav" aria-label={isEditor ? "Editör navigasyonu" : "Yönetici navigasyonu"} ref={navRef}>
          <Link className={pathname === homeHref ? "active" : ""} href={homeHref}><CustomerNavIcon name="overview" />Anasayfa</Link>
          {topMenus.map((menu) => {
            const menuActive = (menu.key === "manage" && !isEditor && managementGroups.some(group => group.items.some(item => pathname.startsWith(item.href)))) || menu.items.some((item) => {
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
                <CustomerNavIcon name={menu.icon === "orders" ? "orders" : menu.icon === "education" ? "education" : "manage"} />{menu.label}<span className="nav-caret">⌄</span>
              </button>
              {openMenu === menu.key && (
                menu.key === "manage" && !isEditor ? <div className="admin-menu admin-management-menu" role="menu" aria-label="Yönetim bölümleri">
                  {visibleGroups.map((group) => <section className="admin-management-group" key={group.label}>
                    <h2>{group.label}</h2>
                    <div>{group.items.map((item) => <Link key={item.label} role="menuitem" href={item.href} onClick={() => setOpenMenu(null)}><AdminIcon name={item.icon} size={16} /><span>{item.label}</span></Link>)}</div>
                  </section>)}
                </div> : <div className="admin-menu admin-section-menu" role="menu">
                  <section className="admin-management-group">
                    <h2>{menu.label}</h2>
                    <div>{menu.items.map((item) => {
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
                    return <Link key={item.label} role="menuitem" href={item.href} onClick={() => setOpenMenu(null)}>{item.icon && <AdminIcon name={item.icon} size={16} />}<span>{item.label}</span></Link>;
                  })}</div>
                  </section>
                </div>
              )}
            </div>
            );
          })}
          {canSee("menu.takvim") && <Link className={pathname === calendarHref ? "active" : ""} href={calendarHref}><CustomerNavIcon name="calendar" />Takvim</Link>}
        </nav>
        <div className="top-actions">
          <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
          <button className={`icon-button ${dataHidden ? "open" : ""}`} onClick={() => setDataHidden((current) => !current)} aria-pressed={dataHidden} aria-label={dataHidden ? "Verileri göster" : "Verileri gizle"} title={dataHidden ? "Verileri göster" : "Verileri gizle"}>
            <AdminIcon name={dataHidden ? "eyeOff" : "eye"} size={20} />
          </button>
          <FavoritesMenu />
          <NotificationMenu role={isEditor ? "editor" : "admin"} />
          <ProfileMenu roleLabel={access.roleName || (isEditor ? "Editör hesabı" : "Yönetici")} settingsHref={isEditor ? "/editor/ayarlar" : "/admin/ayarlar"} ordersHref={isEditor ? "/editor/siparisler" : "/admin/siparisler"} ordersLabel="Sipariş Yönetimi" dashboardHref={!isEditor && canSee("menu.dashboard") ? "/admin/dashboard" : undefined} name={isEditor ? "eistatistik Editör" : "Kerem Murat"} email={isEditor ? "editor@eistatistik.com" : "admin@eistatistik.com"} initials={isEditor ? "EE" : "KM"} />
        </div>
      </header>
      )}
      <main id="admin-main" className={`admin-dash${isManagementPage ? " admin-management-page" : ""}`} data-hidden={dataHidden ? "true" : undefined}>
        <DataHiddenContext.Provider value={dataHidden}>{children}</DataHiddenContext.Provider>
      </main>
    </div>
    </FavoritesProvider>
  );
}
