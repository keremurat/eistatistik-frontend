"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { ProfileMenu } from "../components/ProfileMenu";
import { NotificationMenu } from "../components/NotificationMenu";
import { BrandLogo } from "../components/BrandLogo";
import { CustomerEducationMenu } from "../components/CustomerEducationMenu";

export type EducationIconName =
  | "arrow" | "bell" | "book" | "calendar" | "card" | "check" | "clock" | "file"
  | "home" | "message" | "play" | "search" | "spark" | "tasks" | "users" | "video";

export function EducationIcon({ name, size = 20 }: { name: EducationIconName; size?: number }) {
  const paths: Record<EducationIconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
    tasks: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function EducationShell({ children }: { children: React.ReactNode }) {
  const isAnalyst = useSyncExternalStore(
    (notify) => {
      window.addEventListener("storage", notify);
      return () => window.removeEventListener("storage", notify);
    },
    () => localStorage.getItem("eistatistik_role") === "analizor",
    () => false,
  );

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">İçeriğe geç</a>
    <header className="topbar">
      <BrandLogo />
      <nav className="main-nav" aria-label="Ana navigasyon">
        {isAnalyst ? <>
          <Link href="/analizor"><EducationIcon name="home" size={17} />Genel bakış</Link>
          <Link href="/analizor/islerim"><EducationIcon name="tasks" size={17} />İşlerim</Link>
          <CustomerEducationMenu />
          <Link href="/analizor#meetings"><EducationIcon name="video" size={17} />Görüşmeler</Link>
          <Link href="/analizor#analyst-calendar"><EducationIcon name="calendar" size={17} />Takvim</Link>
        </> : <>
          <Link href="/dashboard"><EducationIcon name="home" size={17} />Genel bakış</Link>
          <Link href="/siparislerim"><EducationIcon name="file" size={17} />Siparişlerim</Link>
          <CustomerEducationMenu />
          <Link href="/yeni-analiz-talebi"><EducationIcon name="spark" size={17} />Hizmetler</Link>
        </>}
      </nav>
      <div className="top-actions">
        <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç">
          <Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} />
        </a>
        <NotificationMenu />
        {isAnalyst
          ? <ProfileMenu roleLabel="Analizör hesabı" ordersHref="/analizor/islerim" ordersLabel="İşlerim" name="Naci Yılmaz" email="analizor@eistatistik.com" initials="NY" />
          : <ProfileMenu />}
      </div>
    </header>
    <main id="main-content" className="education-page">{children}</main>
    <button className="support-button" aria-label="Destek"><EducationIcon name="message" /><span>Destek</span></button>
  </div>;
}
