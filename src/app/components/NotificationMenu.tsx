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

export type NotificationRole = "musteri" | "analizor" | "asistan" | "editor" | "admin";

type NotificationConfig = {
  items: NotificationItem[];
  allHref: string;
};

const notificationConfigs: Record<NotificationRole, NotificationConfig> = {
  musteri: {
    allHref: "/dashboard",
    items: [
      { id: "musteri-dosya", icon: "file", title: "Raporunuza yeni dosya eklendi", meta: "Regresyon analizi · 18 dakika önce", href: "/siparislerim/DS260723008", read: false },
      { id: "musteri-gorusme", icon: "calendar", title: "Görüşmeniz planlandı", meta: "24 Temmuz, 14:30 · Google Meet", href: "/siparislerim/DS260723008", read: false },
      { id: "musteri-mesaj", icon: "message", title: "Uzmanınız mesaj gönderdi", meta: "Yüksek lisans tezi analizi · Dün", href: "/siparislerim/DS260723008", read: true },
      { id: "musteri-teklif", icon: "card", title: "Ücret teklifiniz hazır", meta: "Güç analizi danışmanlığı · Dün", href: "/siparislerim/DS260723008", read: true },
    ],
  },
  analizor: {
    allHref: "/analizor/islerim",
    items: [
      { id: "analizor-is", icon: "file", title: "Yeni bir iş size atandı", meta: "Power ve örneklem analizi · 8 dakika önce", href: "/analizor/islerim", read: false },
      { id: "analizor-gorusme", icon: "calendar", title: "Görüşmeniz yaklaşıyor", meta: "Bugün 14:30 · Kerem Murat", href: "/analizor/gorusmeler", read: false },
      { id: "analizor-mesaj", icon: "message", title: "Müşteri yeni yanıt gönderdi", meta: "SA260803014 · 36 dakika önce", href: "/analizor/islerim", read: true },
      { id: "analizor-teslim", icon: "bell", title: "Teslim süresi yaklaşıyor", meta: "2 çalışma bugün teslim edilecek", href: "/analizor/takvim", read: true },
    ],
  },
  asistan: {
    allHref: "/asistan",
    items: [
      { id: "asistan-teslim", icon: "bell", title: "Teslim süresi geçen siparişler var", meta: "10 sipariş kontrol bekliyor", href: "/asistan", read: false },
      { id: "asistan-yanit", icon: "message", title: "Yeni müşteri yanıtları alındı", meta: "3 yazışma işlem bekliyor", href: "/asistan", read: false },
      { id: "asistan-ek-analiz", icon: "file", title: "Ek analiz talepleri güncellendi", meta: "53 açık talep bulunuyor", href: "/asistan", read: true },
      { id: "asistan-takvim", icon: "calendar", title: "Bugünün iş planı hazır", meta: "14 açık görev", href: "/asistan", read: true },
    ],
  },
  admin: {
    allHref: "/admin",
    items: [
      { id: "admin-siparis", icon: "file", title: "Yeni sipariş oluşturuldu", meta: "İstatistiksel veri analizi · 5 dakika önce", href: "/admin/siparisler", read: false },
      { id: "admin-odeme", icon: "card", title: "Ödeme bildirimi bekliyor", meta: "Dekont kontrolü gerekli · 14 dakika önce", href: "/admin/siparisler", read: false },
      { id: "admin-kullanici", icon: "bell", title: "Yeni kullanıcı kaydı", meta: "Müşteri hesabı · 1 saat önce", href: "/admin/kullanici-yonetimi", read: true },
      { id: "admin-takvim", icon: "calendar", title: "Takvim ataması güncellendi", meta: "Analizör görüşmesi · Dün", href: "/admin/takvim", read: true },
    ],
  },
  editor: {
    allHref: "/editor",
    items: [],
  },
};

export function NotificationMenu({ role = "musteri" }: { role?: NotificationRole }) {
  const [open, setOpen] = useState(false);
  const [readIdsByRole, setReadIdsByRole] = useState<Record<NotificationRole, string[]>>({
    musteri: [],
    analizor: [],
    asistan: [],
    editor: [],
    admin: [],
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const config = notificationConfigs[role];
  const notifications = config.items.map((notification) => ({
    ...notification,
    read: notification.read || readIdsByRole[role].includes(notification.id),
  }));
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

  const markAllRead = () => setReadIdsByRole((current) => ({
    ...current,
    [role]: config.items.map((notification) => notification.id),
  }));
  const markRead = (id: string) => setReadIdsByRole((current) => ({
    ...current,
    [role]: current[role].includes(id) ? current[role] : [...current[role], id],
  }));

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
          <Link className="notification-dropdown-foot" href={config.allHref} role="menuitem" onClick={() => setOpen(false)}>Tüm bildirimleri gör</Link>
        </div>
      )}
    </div>
  );
}
