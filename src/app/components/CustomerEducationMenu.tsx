"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function MenuIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
  </svg>;
}

export function CustomerEducationMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = pathname.startsWith("/egitimler");

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return <div className="education-nav-wrap" ref={wrapRef} onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
    <button className={`${active ? "active " : ""}education-nav-trigger`} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu">
      <MenuIcon />Eğitimler
    </button>
    {open && <div className="education-dropdown" role="menu" onMouseEnter={openMenu}>
      <Link href="/egitimler" role="menuitem" onClick={() => setOpen(false)}>Eğitimlerim</Link>
      <Link href="/egitimler/katalog" role="menuitem" onClick={() => setOpen(false)}>Eğitim kataloğu</Link>
    </div>}
  </div>;
}
