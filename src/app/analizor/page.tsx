"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NotificationMenu } from "../components/NotificationMenu";
import { ProfileMenu } from "../components/ProfileMenu";
import { CustomerEducationMenu } from "../components/CustomerEducationMenu";

type IconName = "arrow" | "calendar" | "check" | "clock" | "file" | "home" | "message" | "tasks" | "video";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    tasks: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const calendarDays = [
  { day: 27, muted: true }, { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true }, { day: 31, muted: true },
  ...Array.from({ length: 31 }, (_, index) => ({ day: index + 1, muted: false })),
  { day: 1, muted: true }, { day: 2, muted: true }, { day: 3, muted: true }, { day: 4, muted: true }, { day: 5, muted: true }, { day: 6, muted: true },
];

const dayDetails: Record<number, { title: string; meta: string }> = {
  3: { title: "Analiz öncesi görüşme", meta: "14:30 · Kerem Murat · Google Meet" },
  5: { title: "Regresyon raporu teslimi", meta: "17:00 · SA260805014" },
  7: { title: "Ek analiz değerlendirmesi", meta: "11:00 · Derya Aydın" },
  12: { title: "Yöntem görüşmesi", meta: "15:30 · Mehmet Kaya" },
};

const jobs = [
  { code: "SA260803014", title: "Yüksek lisans tezi veri analizi", customer: "Kerem Murat", due: "Bugün · 17:00", status: "Rapor hazırlanıyor", progress: 82 },
  { code: "SA260801009", title: "Regresyon analizi ve yorumlama", customer: "Derya Aydın", due: "5 Ağustos", status: "Analiz devam ediyor", progress: 58 },
  { code: "EA260729004", title: "Ek analiz değerlendirmesi", customer: "Mehmet Kaya", due: "7 Ağustos", status: "Yanıt bekleniyor", progress: 34 },
];

export default function AnalystDashboardPage() {
  const [selectedDay, setSelectedDay] = useState(3);
  const selectedDetail = dayDetails[selectedDay];

  return (
    <div className="app-shell analyst-shell">
      <a className="skip-link" href="#analyst-main">İçeriğe geç</a>
      <header className="topbar">
        <Link className="brand" href="/analizor" aria-label="eistatistik analizör ana sayfası">
          <Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority />
        </Link>
        <nav className="main-nav" aria-label="Analizör navigasyonu">
          <Link className="active" href="/analizor"><Icon name="home" />Genel bakış</Link>
          <Link href="/analizor/islerim"><Icon name="tasks" />İşlerim</Link>
          <CustomerEducationMenu />
          <Link href="/analizor/gorusmeler"><Icon name="video" />Görüşmeler</Link>
          <Link href="/analizor/takvim"><Icon name="calendar" />Takvim</Link>
        </nav>
        <div className="top-actions">
          <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç">
            <Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} />
          </a>
          <NotificationMenu role="analizor" />
          <ProfileMenu roleLabel="Analizör hesabı" ordersHref="/analizor/islerim" ordersLabel="İşlerim" name="Naci Yılmaz" email="analizor@eistatistik.com" initials="NY" />
        </div>
      </header>

      <main id="analyst-main" className="dashboard dashboard-home analyst-dashboard">
        <section className="daily-brief analyst-brief">
          <div className="brief-copy">
            <p className="eyebrow light">PAZARTESİ · 3 AĞUSTOS 2026</p>
            <h1>Günaydın, Naci.</h1>
            <p>Bugün <strong>2 tesliminiz</strong> ve <strong>14:30’da bir görüşmeniz</strong> var.</p>
          </div>
          <div className="brief-stats analyst-brief-stats" aria-label="Analizör iş özeti">
            <div><strong>6</strong><span>aktif çalışma</span></div>
            <div><strong>2</strong><span>yaklaşan teslim</span></div>
            <div><strong>3</strong><span>cevap bekliyor</span></div>
            <div><strong>1</strong><span>ek analiz</span></div>
          </div>
          <a className="primary-button" href="#upcoming-work">İşlerimi görüntüle <Icon name="arrow" size={16} /></a>
        </section>

        <section className="focus-grid analyst-focus-grid">
          <div className="today-panel">
            <div className="section-title"><div><p className="eyebrow">BUGÜNKÜ İŞ AKIŞI</p><h2>Öncelikleriniz</h2></div><span className="date-chip">3 Ağu</span></div>
            <div className="agenda">
              <article className="agenda-item">
                <div className="agenda-time"><strong>09:30</strong><span>Tamamlandı</span></div><span className="agenda-line neutral" />
                <div className="agenda-copy"><span className="type-label neutral-text">DOSYA İNCELEME</span><h3>Yeni veri setini kontrol edin</h3><p>SA260803014 · Kerem Murat</p></div>
                <button className="quiet-button"><Icon name="check" size={15} />Tamamlandı</button>
              </article>
              <article className="agenda-item featured">
                <div className="agenda-time"><strong>14:30</strong><span>45 dk.</span></div><span className="agenda-line" />
                <div className="agenda-copy"><span className="type-label">ATANAN GÖRÜŞME</span><h3>Analiz öncesi değerlendirme</h3><p>Yüksek lisans tezi veri analizi</p><div className="agenda-meta"><span>Google Meet</span><span>Kerem Murat</span></div></div>
                <button>Görüşmeye katıl <Icon name="arrow" size={15} /></button>
              </article>
              <article className="agenda-item">
                <div className="agenda-time"><strong>17:00</strong><span>Bugün</span></div><span className="agenda-line amber" />
                <div className="agenda-copy"><span className="type-label amber-text">TESLİM</span><h3>Analiz raporunu tamamlayın</h3><p>SA260803014 · Son kontrol bekliyor</p></div>
                <button className="quiet-button">İşi aç <Icon name="arrow" size={15} /></button>
              </article>
            </div>
          </div>

          <div id="analyst-calendar" className="calendar-panel">
            <div className="section-title"><div><p className="eyebrow">ÇALIŞMA TAKVİMİ</p><h2>Ağustos 2026</h2></div><div className="calendar-nav"><button aria-label="Önceki ay">‹</button><button aria-label="Sonraki ay">›</button></div></div>
            <div className="weekdays"><span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span></div>
            <div className="calendar-grid">
              {calendarDays.map((item, index) => {
                const hasEvent = !item.muted && Boolean(dayDetails[item.day]);
                return <button key={`${item.muted ? "other" : "current"}-${item.day}-${index}`} className={`${item.muted ? "muted" : ""} ${selectedDay === item.day && !item.muted ? "selected" : ""} ${hasEvent ? "has-event" : ""}`} onClick={() => !item.muted && setSelectedDay(item.day)}>{item.day}</button>;
              })}
            </div>
            <div className="calendar-detail">
              <div><span className="detail-date">{selectedDay}</span><span><strong>Ağustos</strong><small>2026</small></span></div>
              <div className="detail-event"><span /><div><strong>{selectedDetail?.title ?? "Planlanmış iş yok"}</strong><small>{selectedDetail?.meta ?? "Bu gün için takviminiz boş."}</small></div></div>
            </div>
          </div>
        </section>

        <section id="upcoming-work" className="analyses-section analyst-jobs">
          <div className="section-title wide-title"><div><p className="eyebrow">YAKLAŞAN İŞLER</p><h2>Teslim planınız</h2></div><a className="text-link" href="#upcoming-work">Tüm işleri görüntüle <Icon name="arrow" size={15} /></a></div>
          <div className="analysis-table">
            <div className="table-head analyst-table-head"><span>Çalışma</span><span>Müşteri</span><span>Teslim</span><span>Durum</span><span>İlerleme</span></div>
            {jobs.map((job) => <article className="analysis-row analyst-job-row" key={job.code}>
              <div className="analysis-name"><span className="file-icon"><Icon name="file" size={17} /></span><span><strong>{job.title}</strong><small>{job.code}</small></span></div>
              <span className="analyst-customer">{job.customer}</span><strong className="analyst-due">{job.due}</strong>
              <div className="status-cell"><span className={`status-mark ${job.progress < 40 ? "amber" : ""}`} /><span><strong>{job.status}</strong></span></div>
              <div className="progress-cell"><div><span style={{ width: `${job.progress}%` }} /></div><small>{job.progress}%</small></div>
            </article>)}
          </div>
        </section>

        <section id="meetings" className="analyst-meetings-panel">
          <div className="section-title"><div><p className="eyebrow">ATANAN GÖRÜŞMELER</p><h2>Sıradaki görüşmeler</h2></div><span className="date-chip">3 görüşme</span></div>
          <div className="analyst-meeting-list">
            <article><span className="meeting-date"><strong>03</strong><small>Ağu</small></span><div><strong>Analiz öncesi değerlendirme</strong><p>14:30 · Kerem Murat · Google Meet</p></div><button>Görüşmeye katıl <Icon name="video" size={15} /></button></article>
            <article><span className="meeting-date"><strong>07</strong><small>Ağu</small></span><div><strong>Ek analiz değerlendirmesi</strong><p>11:00 · Derya Aydın · Google Meet</p></div><button className="quiet-button">Detayı aç <Icon name="arrow" size={15} /></button></article>
            <article><span className="meeting-date"><strong>12</strong><small>Ağu</small></span><div><strong>Yöntem ve kapsam görüşmesi</strong><p>15:30 · Mehmet Kaya · Google Meet</p></div><button className="quiet-button">Detayı aç <Icon name="arrow" size={15} /></button></article>
          </div>
        </section>
      </main>
    </div>
  );
}
