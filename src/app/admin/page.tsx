"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminShell, useDataHidden } from "./AdminShell";
import { TimeGreeting } from "../components/TimeGreeting";

const pulse = [
  { label: "Teslim tarihi geçen", value: "13" },
  { label: "Ücretlendirme bekleyen", value: "1" },
  { label: "Havale onayı", value: "0" },
  { label: "Cevap bekleyen", value: "0" },
];

type Task = { title: string; meta: string; urgent?: boolean };
const taskGroups: { key: string; title: string; tone: string; items: Task[] }[] = [
  {
    key: "todo",
    title: "Yapılacaklar",
    tone: "#d08a22",
    items: [
      { title: "Teslimat", meta: "Ahmet Taha Kayaoğlu · bugün 16:00", urgent: true },
      { title: "Ek analiz teslim", meta: "Gizem Kılıç · SA260715003", urgent: true },
      { title: "Analiz teslimi", meta: "Meriç Öztürk Yaşar · bugün", urgent: true },
      { title: "İnceleme", meta: "Damla Amasya · SA260723001" },
    ],
  },
  {
    key: "doing",
    title: "Yapılıyor",
    tone: "#1775a9",
    items: [
      { title: "Ek analiz ücreti", meta: "Enis Ulusoy · Naci Murat" },
      { title: "Hatırlatma araması", meta: "Merve Alpay · Sümeyye İnan" },
    ],
  },
  {
    key: "done",
    title: "Tamamlananlar",
    tone: "#22a89a",
    items: [
      { title: "Sipariş teslimi", meta: "Fatma Nur Kaya · Naci Murat" },
      { title: "Rapor teslim", meta: "Neslihan Ünal Akdemir" },
      { title: "IDP ek analiz teslim", meta: "Leyla Yaman Üzümcü" },
    ],
  },
];

type OrderItem = { code: string; title: string; who: string; when: string; urgent?: boolean };
type StatGroup = { id: string; label: string; hint: string; href: string; items: OrderItem[] };

const statGroups: StatGroup[] = [
  {
    id: "due",
    label: "Teslim edilecekler",
    hint: "Teslim tarihi yaklaşan",
    href: "/admin/siparisler",
    items: [
      { code: "SA260731014", title: "Doktora tezi analizi", who: "Rabia Aktaş", when: "Bugün 16:00", urgent: true },
      { code: "DS260731008", title: "Araştırma planı danışmanlığı", who: "Naci Murat", when: "Bugün 15:30", urgent: true },
      { code: "PA260731003", title: "Örneklem büyüklüğü hesabı", who: "Mehmet Meşe", when: "Bugün 14:00", urgent: true },
      { code: "SA260801004", title: "Makale veri analizi", who: "Fatih Akar", when: "1 Ağustos 11:00" },
      { code: "SA260803011", title: "Geçerlilik analizi", who: "Ertuğrul Gümüşsu", when: "3 Ağustos 10:00" },
    ],
  },
  {
    id: "late",
    label: "Teslim tarihi geçen",
    hint: "Süresi dolmuş sipariş",
    href: "/admin/siparisler",
    items: [
      { code: "SA260720001", title: "Anket analizi", who: "Esra Öztürk", when: "24 Temmuz", urgent: true },
      { code: "SA260718002", title: "Ek analiz teslim", who: "Rabia Aktaş", when: "28 Temmuz", urgent: true },
      { code: "SA260715003", title: "İlave istatistik raporu", who: "Aliihsan Şükür", when: "29 Temmuz", urgent: true },
      { code: "DS260710006", title: "Tez danışmanlığı", who: "Naci Murat", when: "30 Temmuz", urgent: true },
    ],
  },
  {
    id: "price",
    label: "Ücretlendirilecekler",
    hint: "Teklif bekleyen talep",
    href: "/admin/siparisler",
    items: [
      { code: "TA260731002", title: "Yeni analiz talebi", who: "Enis Ulusoy", when: "Bugün 09:40" },
    ],
  },
  {
    id: "transfer-order",
    label: "Havale onayı",
    hint: "Sipariş",
    href: "/admin/siparisler",
    items: [],
  },
  {
    id: "transfer-edu",
    label: "Havale onayı",
    hint: "Eğitim",
    href: "/admin/egitimler/satin-alinan",
    items: [],
  },
  {
    id: "extra-free",
    label: "Ek analiz",
    hint: "Ücretsiz",
    href: "/admin/siparisler",
    items: [
      { code: "SA260728001", title: "IDP ek tablo", who: "Rabia Aktaş", when: "Leyla Yaman Üzümcü" },
      { code: "SA260722003", title: "Ek grafik", who: "Naci Murat", when: "Meriç Öztürk Yaşar" },
    ],
  },
  {
    id: "extra-paid",
    label: "Ek analiz",
    hint: "Ücretli",
    href: "/admin/siparisler",
    items: [
      { code: "SA260301001", title: "Ek analiz ücreti", who: "Naci Murat", when: "9.600 TL · Enis Ulusoy" },
      { code: "SA260801001", title: "Ek model", who: "Naci Murat", when: "Esma Dinger" },
    ],
  },
  {
    id: "reply",
    label: "Cevap bekleyen",
    hint: "Yazışması açık sipariş",
    href: "/admin/siparisler",
    items: [],
  },
];

export default function AdminHomePage() {
  return <AdminShell><AnalysisHome /></AdminShell>;
}

function AnalysisHome() {
  const hidden = useDataHidden();

  return (
    <div className="admin-home">
      <section className="daily-brief admin-brief">
        <div className="brief-copy">
          <p className="eyebrow light">CUMA · 31 TEMMUZ 2026</p>
          <h1><TimeGreeting name="Kerem" /></h1>
          <p>Sipariş, görüşme, eğitim ve ekip bugün aynı panelde.</p>
        </div>
        <div className="brief-stats" aria-label="Günün özeti">
          {pulse.map((item) => <div key={item.label}><strong>{hidden ? "•••" : item.value}</strong><span>{item.label}</span></div>)}
        </div>
      </section>

      <TaskRow hidden={hidden} />
      <StatBoard hidden={hidden} />
    </div>
  );
}

function TaskRow({ hidden }: { hidden: boolean }) {
  return (
    <section className="home-band" aria-label="Görevler">
      <div className="home-band-title">
        <h2>Görevler</h2>
        <Link href="/admin/gorev-isleri/gorev-listesi">Tüm görevler</Link>
      </div>
      <div className="home-task-row">
        {taskGroups.map((group) => (
          <article key={group.key} className="analytics-card home-task-card">
            <div className="home-task-top">
              <h3><i style={{ background: group.tone }} />{group.title}</h3>
              <strong>{hidden ? "•" : group.items.length}</strong>
            </div>
            <ul>
              {group.items.map((item) => (
                <li key={item.title + item.meta}>
                  <Link href="/admin/gorev-isleri/gorev-listesi">
                    <b>{item.title}</b>
                    <small>{hidden ? "Gizli" : item.meta}</small>
                  </Link>
                  {item.urgent && !hidden && <WarnIcon label="Teslim tarihi yakın" />}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatBoard({ hidden }: { hidden: boolean }) {
  const [selected, setSelected] = useState(statGroups[0].id);
  const group = statGroups.find((item) => item.id === selected) ?? statGroups[0];
  const urgentCount = group.items.filter((item) => item.urgent).length;

  return (
    <section className="home-band" aria-label="Sipariş istatistikleri">
      <div className="home-band-title">
        <h2>Sipariş istatistikleri</h2>
        <span>{hidden ? "•••" : statGroups.reduce((sum, item) => sum + item.items.length, 0)} kayıt</span>
      </div>
      <div className="home-stat-grid" role="tablist">
        {statGroups.map((item) => {
          const late = item.id === "late";
          const warn = item.items.some((row) => row.urgent);
          const quiet = item.items.length === 0;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === selected}
              className={[item.id === selected ? "active" : "", late ? "late" : warn ? "warn" : "", quiet ? "quiet" : ""].filter(Boolean).join(" ")}
              onClick={() => setSelected(item.id)}
            >
              <span>{item.label}</span>
              <b>
                {hidden ? "•" : item.items.length}
                {(warn || late) && !hidden && <WarnIcon label={late ? "Teslim tarihi geçmiş" : "Teslim tarihi yakın"} />}
              </b>
              <small>{item.hint}</small>
            </button>
          );
        })}
      </div>
      <article className="analytics-card home-sheet" role="tabpanel">
        <header>
          <div>
            <p className="eyebrow">{group.hint}</p>
            <h2>{group.label}</h2>
          </div>
          <Link href={group.href}>Listeye git</Link>
        </header>
        {hidden ? <p className="home-detail-empty">Veriler gizlendi.</p> : group.items.length === 0 ? (
          <p className="home-detail-empty">Bu başlıkta bekleyen kayıt yok.</p>
        ) : (
          <ul>
            {urgentCount > 0 && <li className="home-sheet-note">{urgentCount} kaydın teslimi bugün ya da geçmiş.</li>}
            {group.items.map((item) => (
              <li key={item.code}>
                <Link href={group.href}>
                  <b>{item.title}</b>
                  <small>{item.code} · {item.who}</small>
                </Link>
                <em>{item.when}{item.urgent && <WarnIcon label="Teslim tarihi yakın" />}</em>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

function WarnIcon({ label }: { label: string }) {
  return (
    <svg className="home-warn" viewBox="0 0 24 24" aria-label={label} role="img">
      <path fill="currentColor" d="M12 3.2 1.8 20.2a1.2 1.2 0 0 0 1.04 1.8h18.32a1.2 1.2 0 0 0 1.04-1.8L12 3.2Zm0 6.1a1 1 0 0 1 1 1v4.2a1 1 0 1 1-2 0v-4.2a1 1 0 0 1 1-1Zm0 9.15a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3Z" />
    </svg>
  );
}
