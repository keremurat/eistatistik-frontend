"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuIcon = "settings" | "orders" | "logout";

function ProfileMenuIcon({ name }: { name: MenuIcon }) {
  const paths: Record<MenuIcon, React.ReactNode> = {
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.5v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.5h.3A1.7 1.7 0 0 0 4 8.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.46 3.6l.06.06A1.7 1.7 0 0 0 8.4 4a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 9.8 2.3V2h4.1v.3A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 8.4a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.3v4.1h-.3a1.7 1.7 0 0 0-1.7 1.1Z" /></>,
    orders: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
  };

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

interface ProfileMenuProps {
  roleLabel?: string;
  ordersHref?: string;
  ordersLabel?: string;
  name?: string;
  email?: string;
  initials?: string;
}

export function ProfileMenu({ roleLabel = "Müşteri hesabı", ordersHref = "/siparislerim", ordersLabel = "Siparişler", name = "Kerem Murat", email = "kerem@example.com", initials = "KM" }: ProfileMenuProps = {}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="profile-menu-wrap" ref={menuRef}>
      <button
        className={`profile-button ${open ? "open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-label="Profil menüsünü aç"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="avatar">{initials}</span>
        <span className="profile-copy"><strong>{name}</strong><small>{roleLabel}</small></span>
        <span className="profile-caret">⌄</span>
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-head">
            <span className="avatar">{initials}</span>
            <span><strong>{name}</strong><small>{email}</small></span>
          </div>
          <nav aria-label="Profil işlemleri">
            <Link href="/ayarlar" role="menuitem" onClick={() => setOpen(false)}><ProfileMenuIcon name="settings" /><span>Ayarlar</span></Link>
            <Link href={ordersHref} role="menuitem" onClick={() => setOpen(false)}><ProfileMenuIcon name="orders" /><span>{ordersLabel}</span></Link>
            <Link className="logout" href="/giris" role="menuitem" onClick={() => { localStorage.removeItem("eistatistik_role"); setOpen(false); }}><ProfileMenuIcon name="logout" /><span>Çıkış yap</span></Link>
          </nav>
        </div>
      )}
    </div>
  );
}
