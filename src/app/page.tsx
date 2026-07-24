"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type IconName = "arrow" | "bell" | "book" | "calendar" | "check" | "chevron" | "clock" | "file" | "home" | "message" | "plus" | "search" | "spark";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const calendarDays = [
  { day: 29, muted: true }, { day: 30, muted: true }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
  { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 },
  { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 },
  { day: 23, event: "message" }, { day: 24, event: "meeting" }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
  { day: 29 }, { day: 30, event: "meeting" }, { day: 31 }, { day: 1, muted: true }, { day: 2, muted: true },
];

const analyses = [
  { code: "SA260723002", name: "Yüksek lisans tezi veri analizi", status: "Görüşme bugün", next: "14:30 · Google Meet", progress: 82, action: "Görüşmeye katıl" },
  { code: "SA260721001", name: "Regresyon analizi ve raporlama", status: "Analiz hazırlanıyor", next: "Tahmini teslim · 29 Temmuz", progress: 58, action: "Süreci görüntüle" },
  { code: "DS260723008", name: "Güç analizi danışmanlığı", status: "Onayınız bekleniyor", next: "Ücret teklifini inceleyin", progress: 24, action: "Teklifi incele" },
];

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(24);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">İçeriğe geç</a>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Eİstatistik ana sayfa">
          <Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority />
        </Link>
        <nav className="main-nav" aria-label="Ana navigasyon">
          <a className="active" href="#"><Icon name="home" size={17} />Genel bakış</a>
          <Link href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <Link href="/egitimler"><Icon name="book" size={17} />Eğitimlerim</Link>
          <a href="#"><Icon name="spark" size={17} />Hizmetler</a>
        </nav>
        <div className="top-actions">
          <button className="icon-button search-button" aria-label="Ara"><Icon name="search" /></button>
          <button className="icon-button" aria-label="Bildirimler"><Icon name="bell" /><span className="notification-dot">2</span></button>
          <button className="profile-button" aria-label="Profil menüsünü aç">
            <span className="avatar">KM</span><span className="profile-copy"><strong>Kerem Murat</strong><small>Müşteri hesabı</small></span><span>⌄</span>
          </button>
        </div>
      </header>

      <main id="main-content" className="dashboard">
        <section className="daily-brief">
          <div className="brief-copy">
            <p className="eyebrow light">CUMA · 24 TEMMUZ 2026</p>
            <h1>Günaydın, Kerem.</h1>
            <p>Bugün <strong>14:30’da bir görüşmeniz</strong> var. Bir teklif de onayınızı bekliyor.</p>
          </div>
          <div className="brief-stats" aria-label="Günlük hesap özeti">
            <div><strong>3</strong><span>aktif analiz</span></div>
            <div><strong>1</strong><span>bekleyen işlem</span></div>
            <div><strong>2</strong><span>yaklaşan görüşme</span></div>
          </div>
          <Link className="primary-button" href="/yeni-analiz-talebi"><Icon name="plus" size={18} />Yeni analiz talebi</Link>
        </section>

        <section className="focus-grid">
          <section className="today-panel">
            <div className="section-title">
              <div><p className="eyebrow">GÜNLÜK AKIŞ</p><h2>Bugün</h2></div>
              <span className="date-chip">24 Tem</span>
            </div>
            <div className="agenda">
              <article className="agenda-item featured">
                <div className="agenda-time"><strong>14:30</strong><span>45 dk.</span></div>
                <span className="agenda-line" />
                <div className="agenda-copy">
                  <span className="type-label">GÖRÜŞME</span>
                  <h3>Ek analiz değerlendirmesi</h3>
                  <p>Yüksek lisans tezi veri analizi</p>
                  <div className="agenda-meta"><span>Google Meet</span><span>Dr. Naci Yılmaz</span></div>
                </div>
                <button>Görüşmeye katıl <Icon name="arrow" size={16} /></button>
              </article>
              <article className="agenda-item">
                <div className="agenda-time"><strong>Bugün</strong><span>23:59</span></div>
                <span className="agenda-line amber" />
                <div className="agenda-copy">
                  <span className="type-label amber-text">ONAY BEKLİYOR</span>
                  <h3>Ücret teklifini inceleyin</h3>
                  <p>Güç analizi danışmanlığı · DS260723008</p>
                </div>
                <button className="quiet-button">Teklifi incele <Icon name="arrow" size={16} /></button>
              </article>
              <article className="agenda-item subtle">
                <div className="agenda-time"><strong>Yeni</strong><span>09:18</span></div>
                <span className="agenda-line neutral" />
                <div className="agenda-copy">
                  <span className="type-label neutral-text">UZMAN MESAJI</span>
                  <h3>Veri dosyanız incelendi</h3>
                  <p>Uzmanınız kısa bir açıklama ekledi.</p>
                </div>
                <button className="quiet-button">Mesajı aç <Icon name="arrow" size={16} /></button>
              </article>
            </div>
          </section>

          <section id="calendar" className="calendar-panel">
            <div className="section-title">
              <div><p className="eyebrow">PROGRAMINIZ</p><h2>Temmuz 2026</h2></div>
              <div className="calendar-nav"><button aria-label="Önceki ay">‹</button><button aria-label="Sonraki ay">›</button></div>
            </div>
            <div className="weekdays">{["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(day => <span key={day}>{day}</span>)}</div>
            <div className="calendar-grid">
              {calendarDays.map((item, index) => (
                <button
                  key={`${item.day}-${index}`}
                  className={`${item.muted ? "muted" : ""} ${selectedDay === item.day && !item.muted ? "selected" : ""} ${item.event ? `has-event ${item.event}` : ""}`}
                  onClick={() => !item.muted && setSelectedDay(item.day)}
                  aria-label={`${item.day} Temmuz${item.event ? ", etkinlik var" : ""}`}
                >{item.day}</button>
              ))}
            </div>
            <div className="calendar-detail">
              <div><span className="detail-date">24</span><span><strong>Cuma</strong><small>Temmuz 2026</small></span></div>
              <div className="detail-event"><span /><div><strong>14:30 · Ek analiz görüşmesi</strong><small>Google Meet · 45 dakika</small></div></div>
            </div>
            <a className="text-link" href="#">Tüm takvimi görüntüle <Icon name="arrow" size={16} /></a>
          </section>
        </section>

        <section id="analyses" className="analyses-section">
          <div className="section-title wide-title">
            <div><p className="eyebrow">ÇALIŞMA ALANI</p><h2>Aktif analizler</h2></div>
            <Link className="text-link" href="/siparislerim">Tüm siparişler <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="analysis-table">
            <div className="table-head"><span>Analiz</span><span>Mevcut durum</span><span>İlerleme</span><span>Sonraki adım</span></div>
            {analyses.map((item) => (
              <article className="analysis-row" key={item.code}>
                <div className="analysis-name"><span className="file-icon"><Icon name="file" size={18} /></span><span><strong>{item.name}</strong><small>{item.code}</small></span></div>
                <div className="status-cell"><span className={item.progress < 30 ? "status-mark amber" : "status-mark"} /><span><strong>{item.status}</strong><small>{item.next}</small></span></div>
                <div className="progress-cell"><div><span style={{ width: `${item.progress}%` }} /></div><small>{item.progress}%</small></div>
                <button className="row-action">{item.action}<Icon name="chevron" size={16} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="lower-grid">
          <section id="learning" className="learning-panel">
            <div className="learning-visual"><span className="ring ring-one" /><span className="ring ring-two" /><span className="play">▶</span></div>
            <div className="learning-copy">
              <p className="eyebrow light">EĞİTİMİM</p>
              <h2>SPSS ile uygulamalı veri analizi</h2>
              <p>Sonraki ders · Çoklu regresyon ve model kontrolü</p>
              <div className="learning-progress"><span /></div>
              <small>8 / 12 ders tamamlandı · %64</small>
            </div>
            <button>Eğitime devam et <Icon name="arrow" size={16} /></button>
          </section>

          <section className="updates-panel">
            <div className="section-title">
              <div><p className="eyebrow">HESABINIZ</p><h2>Son güncellemeler</h2></div>
              <button className="mark-read">Tümünü okundu işaretle</button>
            </div>
            <div className="updates-list">
              <a href="#"><span className="update-icon"><Icon name="file" size={17} /></span><span><strong>Raporunuza yeni dosya eklendi</strong><small>Regresyon analizi · 18 dakika önce</small></span><Icon name="chevron" size={16} /></a>
              <a href="#"><span className="update-icon"><Icon name="calendar" size={17} /></span><span><strong>Görüşmeniz planlandı</strong><small>24 Temmuz, 14:30 · Dün</small></span><Icon name="chevron" size={16} /></a>
              <a href="#"><span className="update-icon"><Icon name="message" size={17} /></span><span><strong>Uzmanınız mesaj gönderdi</strong><small>Yüksek lisans tezi analizi · Dün</small></span><Icon name="chevron" size={16} /></a>
            </div>
          </section>
        </section>
      </main>
      <button className="support-button" aria-label="Destek"><Icon name="message" /><span>Destek</span></button>
    </div>
  );
}
