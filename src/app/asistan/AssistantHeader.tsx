"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotificationMenu } from "../components/NotificationMenu";
import { ProfileMenu } from "../components/ProfileMenu";

function NavIcon({ name }: { name: "home" | "orders" | "education" | "manage" | "calendar" }) {
  const paths = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    orders: <><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3M9 12h6M9 16h4" /></>,
    education: <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 12v5c3 2 7 2 10 0v-5" /></>,
    manage: <><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M9 12h6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const managementItems = [
  { label: "Eğitim Talepleri", children: [
    ["Eğitim Listesi", "/asistan/yonetim/egitim-listesi"],
  ] },
  { label: "Kullanıcı Yönetimi", children: [["Kullanıcılar", "/asistan/yonetim/kullanicilar"]] },
  { label: "Duyurular", href: "/asistan/yonetim/duyurular" },
  { label: "Görev Listesi", href: "/asistan/yonetim/gorev-listesi" },
] as const;

function AssistantManagementMenu() {
  const pathname = usePathname();
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

  return <div className="education-nav-wrap" ref={wrapRef} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
    <button className={`${active ? "active " : ""}education-nav-trigger`} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu">
      <NavIcon name="manage" />Yönetim<span className="nav-caret" aria-hidden="true">⌄</span>
    </button>
    {open && <div className="admin-menu" role="menu" onMouseEnter={openMenu}>
      {managementItems.map(item => "children" in item ? <div className="admin-menu-item-wrap" key={item.label} onMouseEnter={() => setSubMenu(item.label)} onMouseLeave={() => setSubMenu(null)}>
        <button className={`admin-menu-item-btn${subMenu === item.label ? " open" : ""}`} role="menuitem" onClick={() => setSubMenu(value => value === item.label ? null : item.label)}>
          {item.label}<span aria-hidden="true">›</span>
        </button>
        {subMenu === item.label && <div className="admin-submenu" role="menu">{item.children.map(([label, href]) => <Link key={href} href={href} role="menuitem" onClick={() => { setOpen(false); setSubMenu(null); }}>{label}</Link>)}</div>}
      </div> : <Link key={item.href} href={item.href} role="menuitem" onClick={() => setOpen(false)}>{item.label}</Link>)}
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
  return <header className="topbar">
    <Link className="brand" href="/asistan" aria-label="Eİstatistik asistan ana sayfası"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority /></Link>
    <nav className="main-nav" aria-label="Asistan navigasyonu">
      <Link className={pathname === "/asistan" ? "active" : ""} href="/asistan"><NavIcon name="home" />Anasayfa</Link>
      <AssistantOrdersMenu />
      <AssistantEducationMenu />
      <AssistantManagementMenu />
      <Link className={pathname === "/asistan/takvim" ? "active" : ""} href="/asistan/takvim"><NavIcon name="calendar" />Takvim</Link>
    </nav>
    <div className="top-actions">
      <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
      <NotificationMenu role="asistan" />
      <ProfileMenu roleLabel="Asistan hesabı" ordersHref="/asistan/siparisler" ordersLabel="Siparişler" name="Eİstatistik Asistan" email="asistan@eistatistik.com" initials="EA" />
    </div>
  </header>;
}
