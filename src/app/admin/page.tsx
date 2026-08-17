"use client";

import Link from "next/link";
import { AdminShell, useDataHidden } from "./AdminShell";
import { AdminAnalyticsSection } from "./AnalyticsDashboard";

function OrdersIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function CalendarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h3M8 17h6" />
    </svg>
  );
}

const briefStats = [
  { value: 13, label: "teslim tarihi geçen" },
  { value: 44, label: "teslim tarihi yaklaşan" },
  { value: 1, label: "ücretlendirilecek" },
  { value: 0, label: "havale onayı bekleyen" },
  { value: 0, label: "cevap bekleyen" },
];

export default function AdminHomePage() {
  return <AdminShell><AdminDashboard /></AdminShell>;
}

function AdminDashboard() {
  const hidden = useDataHidden();

  return (
    <>
      <section className="daily-brief admin-brief">
        <div className="brief-copy">
          <p className="eyebrow light">CUMA · 31 TEMMUZ 2026</p>
          <h1>Merhaba, Kerem.</h1>
          <p>{hidden ? "Panel verileri gizlendi. Görüntülemek için üst bardaki göz simgesine dokunun." : <><strong>13 siparişin teslim tarihi geçti</strong>, 44 sipariş için süre yaklaşıyor. Bir teklif de ücretlendirme bekliyor.</>}</p>
        </div>
        <div className="brief-stats" aria-label="Bekleyen işlemler">
          {briefStats.map((stat) => <div key={stat.label}><strong>{hidden ? "•" : stat.value}</strong><span>{stat.label}</span></div>)}
        </div>
        <div className="admin-brief-actions">
          <Link className="primary-button" href="/admin/siparisler"><OrdersIcon />Sipariş Yönetimi</Link>
          <Link className="admin-brief-secondary" href="/admin/takvim"><CalendarIcon />Yaklaşan görüşmeler</Link>
        </div>
      </section>

      <AdminAnalyticsSection />
    </>
  );
}
