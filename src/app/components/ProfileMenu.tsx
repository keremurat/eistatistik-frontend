"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CURRENT_ACCOUNT_KEY } from "../lib/accountStorage";
import { useCustomerSession } from "./CustomerSessionGate";
import { clearSession, logoutUser } from "@/lib/api/auth";

type MenuIcon = "settings" | "orders" | "logout" | "dashboard";

function ProfileMenuIcon({ name }: { name: MenuIcon }) {
  const paths: Record<MenuIcon, React.ReactNode> = {
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.5v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.5h.3A1.7 1.7 0 0 0 4 8.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.46 3.6l.06.06A1.7 1.7 0 0 0 8.4 4a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 9.8 2.3V2h4.1v.3A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 8.4a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.3v4.1h-.3a1.7 1.7 0 0 0-1.7 1.1Z" /></>,
    orders: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
    dashboard: <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>,
  };

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

interface ProfileMenuProps {
  roleLabel?: string;
  settingsHref?: string | null;
  ordersHref?: string;
  ordersLabel?: string;
  dashboardHref?: string;
  name?: string;
  email?: string;
  initials?: string;
}

export function ProfileMenu({ roleLabel = "Müşteri hesabı", settingsHref = "/ayarlar", ordersHref = "/siparislerim", ordersLabel = "Siparişler", dashboardHref, name = "Kerem Murat", email = "kerem@example.com", initials = "KM" }: ProfileMenuProps = {}) {
  const router = useRouter();
  const sessionUser = useCustomerSession();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const displayedEmail = sessionUser?.email ?? email;
  const displayedName = sessionUser ? sessionUser.email.split("@")[0] : name;
  const displayedInitials = sessionUser ? sessionUser.email.slice(0, 2).toLocaleUpperCase("tr") : initials;

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    try {
      if (sessionUser) await logoutUser();
      clearSession();
      localStorage.removeItem(CURRENT_ACCOUNT_KEY);
      setOpen(false);
      router.replace("/giris");
      router.refresh();
    } catch {
      setLogoutError("Çıkış şu anda tamamlanamadı. Lütfen tekrar deneyin.");
      setLoggingOut(false);
    }
  }

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
        aria-label={open ? "Profil menüsünü kapat" : "Profil menüsünü aç"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="avatar">
          <span className="avatar-initials">{displayedInitials}</span>
          <svg className="avatar-user" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" /></svg>
        </span>
        <span className="profile-copy"><strong>{displayedName}</strong><small>{roleLabel}</small></span>
        <span className="profile-caret" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="m4.5 6.25 3.5 3.5 3.5-3.5" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-head">
            <span className="avatar">{displayedInitials}</span>
            <span><strong>{displayedName}</strong><small>{displayedEmail}</small></span>
          </div>
          <nav aria-label="Profil işlemleri">
            {dashboardHref && <Link href={dashboardHref} role="menuitem" onClick={() => setOpen(false)}><ProfileMenuIcon name="dashboard" /><span>Admin Dashboard</span></Link>}
            {settingsHref && <Link href={settingsHref} role="menuitem" onClick={() => setOpen(false)}><ProfileMenuIcon name="settings" /><span>Ayarlar</span></Link>}
            <Link href={ordersHref} role="menuitem" onClick={() => setOpen(false)}><ProfileMenuIcon name="orders" /><span>{ordersLabel}</span></Link>
            <button className="logout" type="button" role="menuitem" onClick={handleLogout} disabled={loggingOut}><ProfileMenuIcon name="logout" /><span>{loggingOut ? "Çıkış yapılıyor…" : "Çıkış yap"}</span></button>
          </nav>
          {logoutError && <p className="profile-logout-error" role="alert">{logoutError}</p>}
        </div>
      )}
    </div>
  );
}
