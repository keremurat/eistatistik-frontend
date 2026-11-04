"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotificationMenu } from "../components/NotificationMenu";
import { ProfileMenu } from "../components/ProfileMenu";
import { useAccess } from "../components/AccessProvider";
import { CustomerNavIcon } from "../components/CustomerNavIcon";

function NavIcon({ name }: { name: "home" | "orders" | "education" | "manage" | "calendar" }) {
  const mapped = name === "home" ? "overview" : name;
  return <CustomerNavIcon name={mapped} />;
}

const managementItems: { label: string; permission: string; href?: string; children?: [string, string][] }[] = [
  { label: "Eğitim Talepleri", permission: "egitim.yonetim", children: [
    ["Eğitim Listesi", "/asistan/yonetim/egitim-listesi"],
  ] },
  { label: "Kullanıcı Yönetimi", permission: "kullanici.listele", children: [["Kullanıcılar", "/asistan/yonetim/kullanicilar"]] },
  { label: "Duyurular", permission: "diger.duyuru", href: "/asistan/yonetim/duyurular" },
  { label: "Görev Listesi", permission: "pano.listele", href: "/asistan/yonetim/gorev-listesi" },
];

function AssistantManagementMenu() {
  const pathname = usePathname();
  const { can } = useAccess();
  const items = managementItems.filter(item => can(item.permission));
  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = pathname.startsWith("/asistan/yonetim");
  const openMenu = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const closeMenu = () => { closeTimer.current = setTimeout(() => { setOpen(false); setSubMenu(null); }, 150); };

  useEffect(() => {
    const outside = (event: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) { setOpen(false); setSubMenu(null); } };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setSubMenu(null); } };
    document.addEventListener("mousedown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  if (items.length === 0) return null;

  return <div className="education-nav-wrap" ref={wrapRef} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
    <button className={`${active ? "active " : ""}education-nav-trigger`} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu">
      <NavIcon name="manage" />Yönetim<span className="nav-caret" aria-hidden="true">⌄</span>
    </button>
    {open && <div className="admin-menu" role="menu" onMouseEnter={openMenu}>
      {items.map(item => item.children ? <div className="admin-menu-item-wrap" key={item.label} onMouseEnter={() => setSubMenu(item.label)} onMouseLeave={() => setSubMenu(null)}>
        <button className={`admin-menu-item-btn${subMenu === item.label ? " open" : ""}`} role="menuitem" onClick={() => setSubMenu(value => value === item.label ? null : item.label)}>
          {item.label}<span aria-hidden="true">›</span>
        </button>
        {subMenu === item.label && <div className="admin-submenu" role="menu">{item.children.map(([label, href]) => <Link key={href} href={href} role="menuitem" onClick={() => { setOpen(false); setSubMenu(null); }}>{label}</Link>)}</div>}
      </div> : <Link key={item.href} href={item.href ?? "#"} role="menuitem" onClick={() => setOpen(false)}>{item.label}</Link>)}
    </div>}
  </div>;
}

function AssistantOrdersMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = pathname.startsWith("/asistan/siparisler");
  const openMenu = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const closeMenu = () => { closeTimer.current = setTimeout(() => setOpen(false), 150); };

  useEffect(() => {
    const outside = (event: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  return <div className="education-nav-wrap" ref={wrapRef} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
    <button className={`${active ? "active " : ""}education-nav-trigger`} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu">
      <NavIcon name="orders" />Siparişler<span className="nav-caret" aria-hidden="true">⌄</span>
    </button>
    {open && <div className="education-dropdown" role="menu" onMouseEnter={openMenu}>
      <Link href="/asistan/siparisler" role="menuitem" onClick={() => setOpen(false)}>Mevcut Siparişler / Analizler</Link>
    </div>}
  </div>;
}

function AssistantEducationMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = pathname.startsWith("/asistan/egitimler");
  const openMenu = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const closeMenu = () => { closeTimer.current = setTimeout(() => setOpen(false), 150); };

  useEffect(() => {
    const outside = (event: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  return <div className="education-nav-wrap" ref={wrapRef} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
    <button className={`${active ? "active " : ""}education-nav-trigger`} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu">
      <NavIcon name="education" />Eğitimler<span className="nav-caret" aria-hidden="true">⌄</span>
    </button>
    {open && <div className="education-dropdown" role="menu" onMouseEnter={openMenu}>
      <Link href="/asistan/egitimler/yeni" role="menuitem" onClick={() => setOpen(false)}>Yeni eğitim satın al</Link>
      <Link href="/asistan/egitimler/satin-alinan" role="menuitem" onClick={() => setOpen(false)}>Satın alınan eğitimlerim</Link>
    </div>}
  </div>;
}

export function AssistantHeader() {
  const pathname = usePathname();
  const { can } = useAccess();
  return <header className="topbar">
    <Link className="brand" href="/asistan" aria-label="eistatistik asistan ana sayfası"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority /></Link>
    <nav className="main-nav" aria-label="Asistan navigasyonu">
      {can("menu.dashboard") && <Link className={pathname === "/asistan" ? "active" : ""} href="/asistan"><NavIcon name="home" />Anasayfa</Link>}
      {can("siparis.listele") && <AssistantOrdersMenu />}
      {can("menu.egitim") && <AssistantEducationMenu />}
      {can("menu.kullanici") || can("egitim.yonetim") || can("diger.duyuru") || can("pano.listele") ? <AssistantManagementMenu /> : null}
      {can("menu.takvim") && <Link className={pathname === "/asistan/takvim" ? "active" : ""} href="/asistan/takvim"><NavIcon name="calendar" />Takvim</Link>}
    </nav>
    <div className="top-actions">
      <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
      <NotificationMenu role="asistan" />
      <ProfileMenu roleLabel="Asistan hesabı" settingsHref="/asistan/ayarlar" ordersHref="/asistan/siparisler" ordersLabel="Siparişler" name="eistatistik Asistan" email="asistan@eistatistik.com" initials="EA" />
    </div>
  </header>;
}
