"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileMenu } from "../components/ProfileMenu";
import { NotificationMenu } from "../components/NotificationMenu";

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

const showcasedServices = [
  {
    id: "statistical-analysis",
    category: "ANALİZ VE ARAŞTIRMA",
    title: "İstatistiksel veri analizi",
    description: "Tez, makale ve araştırma verilerinizi akademik standartlarda analiz edip raporluyoruz.",
    image: "/service-illustrations/statistical-analysis-v2.png",
  },
  {
    id: "power-analysis",
    category: "ARAŞTIRMA PLANLAMA",
    title: "Power ve örneklem analizi",
    description: "Çalışmanız için gerekli örneklem büyüklüğünü ve istatistiksel gücü belirliyoruz.",
    image: "/service-illustrations/power-analysis-v2.png",
  },
  {
    id: "mentoring",
    category: "DANIŞMANLIK",
    title: "Online mentörlük",
    description: "Akademik ve istatistiksel sürecinizi uzmanınızla birebir görüşmelerle ilerletin.",
    image: "/service-illustrations/mentoring-v2.png",
  },
  {
    id: "graphical-abstract",
    category: "AKADEMİK SUNUM",
    title: "Graphical abstract",
    description: "Araştırmanızın yöntemini ve bulgularını yayın kalitesinde görsel anlatıma dönüştürün.",
    image: "/service-illustrations/graphical-abstract-v2.png",
  },
  {
    id: "proforma-invoice",
    category: "FİNANSAL BELGE",
    title: "Proforma fatura",
    description: "Kurum, proje ve bütçe onay süreçleriniz için proforma fatura talep edin.",
    image: "/service-illustrations/proforma-invoice-v2.png",
  },
  {
    id: "academic-mobile-app",
    category: "DİJİTAL ÜRÜN",
    title: "Akademik mobil uygulama",
    description: "Araştırma projenize özel mobil uygulama kapsamını birlikte oluşturalım.",
    image: "/service-illustrations/academic-mobile-app-v2.png",
  },
];

const analyses = [
  { code: "SA260723002", name: "Yüksek lisans tezi veri analizi", status: "Görüşme bugün", next: "14:30 · Google Meet", progress: 82, action: "Görüşmeye katıl" },
  { code: "SA260721001", name: "Regresyon analizi ve raporlama", status: "Analiz hazırlanıyor", next: "Tahmini teslim · 29 Temmuz", progress: 58, action: "Süreci görüntüle" },
  { code: "DS260723008", name: "Güç analizi danışmanlığı", status: "Onayınız bekleniyor", next: "Ücret teklifini inceleyin", progress: 24, action: "Teklifi incele" },
];

export default function DashboardPage() {
  const [activeService, setActiveService] = useState(0);
  const [showcasePaused, setShowcasePaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next");
  const service = showcasedServices[activeService];

  useEffect(() => {
    if (showcasePaused) return;
    const rotation = window.setInterval(() => {
      setSlideDirection("next");
      setActiveService((current) => (current + 1) % showcasedServices.length);
    }, 5500);
    return () => window.clearInterval(rotation);
  }, [showcasePaused]);

  const showPreviousService = () => {
    setSlideDirection("previous");
    setActiveService((current) => (current - 1 + showcasedServices.length) % showcasedServices.length);
  };

  const showNextService = () => {
    setSlideDirection("next");
    setActiveService((current) => (current + 1) % showcasedServices.length);
  };

  const selectShowcaseService = (index: number) => {
    if (index === activeService) return;
    setSlideDirection(index > activeService ? "next" : "previous");
    setActiveService(index);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">İçeriğe geç</a>
      <header className="topbar">
        <Link className="brand" href="/dashboard" aria-label="Eİstatistik ana sayfa">
          <Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority />
        </Link>
        <nav className="main-nav" aria-label="Ana navigasyon">
          <Link className="active" href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
          <Link href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <Link href="/egitimler"><Icon name="book" size={17} />Eğitimlerim</Link>
          <a href="#"><Icon name="spark" size={17} />Hizmetler</a>
        </nav>
        <div className="top-actions">
          <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç">
            <Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} />
          </a>
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </header>

      <main id="main-content" className="dashboard dashboard-home">
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

          <section
            className="services-showcase"
            aria-roledescription="carousel"
            aria-label="Hizmetlerimiz"
            onMouseEnter={() => setShowcasePaused(true)}
            onMouseLeave={() => setShowcasePaused(false)}
            onFocus={() => setShowcasePaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setShowcasePaused(false);
            }}
          >
            <div className="section-title">
              <div><p className="eyebrow">SİZE ÖZEL ÇÖZÜMLER</p><h2>Hizmetlerimiz</h2></div>
              <div className="showcase-nav">
                <button onClick={showPreviousService} aria-label="Önceki hizmet">‹</button>
                <button onClick={showNextService} aria-label="Sonraki hizmet">›</button>
              </div>
            </div>
            <article className={`showcase-card slide-${slideDirection}`} key={service.id} aria-live="polite">
              <div className="showcase-visual">
                <Image src={service.image} alt="" fill sizes="(max-width: 1080px) 80vw, 34vw" />
              </div>
              <div className="showcase-copy">
                <span>{service.category}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <Link href={`/yeni-analiz-talebi?service=${service.id}`}>
                Hizmeti incele <Icon name="arrow" size={16} />
              </Link>
            </article>
            <div className="showcase-footer">
              <div className="showcase-dots" aria-label="Hizmet seçimi">
                {showcasedServices.map((item, index) => (
                  <button
                    key={item.id}
                    className={index === activeService ? "active" : ""}
                    onClick={() => selectShowcaseService(index)}
                    aria-label={`${index + 1}. hizmet: ${item.title}`}
                    aria-current={index === activeService ? "true" : undefined}
                  />
                ))}
              </div>
              <span>{String(activeService + 1).padStart(2, "0")} / {String(showcasedServices.length).padStart(2, "0")}</span>
            </div>
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
