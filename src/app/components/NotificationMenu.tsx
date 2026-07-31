"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NotificationIconName = "bell" | "file" | "calendar" | "message" | "card";

function NotificationMenuIcon({ name, size = 17 }: { name: NotificationIconName; size?: number }) {
  const paths: Record<NotificationIconName, React.ReactNode> = {
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type NotificationItem = {
  id: string;
  icon: NotificationIconName;
  title: string;
  meta: string;
  href: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  { id: "n1", icon: "file", title: "Raporunuza yeni dosya eklendi", meta: "Regresyon analizi · 18 dakika önce", href: "/siparislerim/DS260723008", read: false },
  { id: "n2", icon: "calendar", title: "Görüşmeniz planlandı", meta: "24 Temmuz, 14:30 · Google Meet", href: "/siparislerim/DS260723008", read: false },
  { id: "n3", icon: "message", title: "Uzmanınız mesaj gönderdi", meta: "Yüksek lisans tezi analizi · Dün", href: "/siparislerim/DS260723008", read: true },
  { id: "n4", icon: "card", title: "Ücret teklifiniz hazır", meta: "Güç analizi danışmanlığı · Dün", href: "/siparislerim/DS260723008", read: true },
];

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

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

  const markAllRead = () => setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  const markRead = (id: string) => setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));

  return (
    <div className="notification-menu-wrap" ref={menuRef}>
      <button
        className={`icon-button ${open ? "open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-label={unreadCount > 0 ? `Bildirimler, ${unreadCount} okunmamış` : "Bildirimler"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <NotificationMenuIcon name="bell" size={20} />
        {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown" role="menu">
          <div className="notification-dropdown-head">
            <div><strong>Bildirimler</strong>{unreadCount > 0 && <span>{unreadCount} yeni</span>}</div>
            <button onClick={markAllRead} disabled={unreadCount === 0}>Tümünü okundu işaretle</button>
          </div>
          <div className="notification-list">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.href}
                role="menuitem"
                className={notification.read ? "notification-item" : "notification-item unread"}
                onClick={() => { markRead(notification.id); setOpen(false); }}
              >
                <span className="notification-icon"><NotificationMenuIcon name={notification.icon} /></span>
                <span className="notification-text"><strong>{notification.title}</strong><small>{notification.meta}</small></span>
                {!notification.read && <span className="notification-unread-dot" aria-hidden="true" />}
              </Link>
            ))}
          </div>
          <Link className="notification-dropdown-foot" href="/dashboard" role="menuitem" onClick={() => setOpen(false)}>Tüm bildirimleri gör</Link>
        </div>
      )}
    </div>
  );
}
