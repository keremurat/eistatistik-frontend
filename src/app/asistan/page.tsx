"use client";

import { AssistantHeader } from "./AssistantHeader";

type IconName = "arrow" | "calendar" | "check" | "clock" | "education" | "file" | "home" | "message" | "orders" | "tasks";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    education: <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 12v5c3 2 7 2 10 0v-5" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    orders: <><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3M9 12h6M9 16h4" /></>,
    tasks: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const priorities = [
  { time: "09:30", type: "TESLİM KONTROLÜ", title: "Teslim süresi geçen siparişleri inceleyin", meta: "10 sipariş işlem bekliyor", tone: "danger", action: "Siparişleri aç" },
  { time: "11:00", type: "MÜŞTERİ YANITI", title: "Yanıt bekleyen yazışmaları kontrol edin", meta: "En eski mesaj 6 Ağustos 19:03", tone: "amber", action: "Yazışmaları aç" },
  { time: "14:30", type: "EK ANALİZ", title: "Yeni ek analiz taleplerini sınıflandırın", meta: "53 açık talep bulunuyor", tone: "blue", action: "Talepleri aç" },
];

export default function AssistantHomePage() {
  return (
    <div className="app-shell assistant-shell">
      <a className="skip-link" href="#assistant-main">İçeriğe geç</a>
      <AssistantHeader />

      <main id="assistant-main" className="dashboard dashboard-home assistant-dashboard">
        <section className="daily-brief assistant-brief">
          <div className="brief-copy">
            <p className="eyebrow light">CUMA · 7 AĞUSTOS 2026</p>
            <h1>Günaydın.</h1>
            <p>Bugün <strong>10 geciken teslim</strong> ve <strong>3 müşteri yanıtı</strong> öncelikli görünüyor.</p>
          </div>
          <div className="brief-stats assistant-brief-stats" aria-label="Asistan operasyon özeti">
            <div><strong>46</strong><span>devam eden sipariş</span></div>
            <div><strong>27</strong><span>yaklaşan teslim</span></div>
            <div><strong>53</strong><span>ek analiz talebi</span></div>
            <div><strong>3</strong><span>yanıt bekleyen</span></div>
          </div>
          <a className="primary-button" href="#assistant-priorities">İş planını görüntüle <Icon name="arrow" size={16} /></a>
        </section>

        <section className="assistant-workspace">
          <div id="assistant-priorities" className="assistant-priority-panel">
            <header className="assistant-section-head">
              <div><p className="eyebrow">BUGÜNKÜ İŞ AKIŞI</p><h2>Öncelikleriniz</h2></div>
              <span>3 işlem bekliyor</span>
            </header>
            <div className="assistant-priority-list">
              {priorities.map((item) => <article key={item.type}>
                <time>{item.time}</time>
                <i className={item.tone} aria-hidden="true" />
                <div><small className={item.tone}>{item.type}</small><h3>{item.title}</h3><p>{item.meta}</p></div>
                <button>{item.action}<Icon name="arrow" size={15} /></button>
              </article>)}
            </div>
          </div>

          <aside className="assistant-side-panel">
            <header className="assistant-section-head">
              <div><p className="eyebrow">OPERASYON ÖZETİ</p><h2>İş planları</h2></div>
              <span>77 toplam</span>
            </header>
            <div className="assistant-todo-summary">
              <div><span>Yapılacak</span><strong>13</strong><small>Bugün başlanacak görevler</small></div>
              <div><span>Yapılıyor</span><strong>1</strong><small>Aktif olarak işleniyor</small></div>
              <div><span>Tamamlandı</span><strong>63</strong><small>Son 30 günlük toplam</small></div>
            </div>
            <div className="assistant-status-note">
              <span><Icon name="check" size={17} /></span>
              <div><strong>İş planının %82’si tamamlandı</strong><p>Bugün için 14 açık görev bulunuyor.</p></div>
            </div>
            <button className="assistant-all-tasks">Tüm görevleri görüntüle <Icon name="arrow" size={15} /></button>
          </aside>
        </section>

        <section className="assistant-queue-strip" aria-label="Hızlı durum özeti">
          <div><span className="assistant-queue-icon"><Icon name="clock" /></span><p><strong>10 geciken teslim</strong><small>Kontrol ve yönlendirme gerekiyor</small></p></div>
          <div><span className="assistant-queue-icon"><Icon name="file" /></span><p><strong>27 yaklaşan teslim</strong><small>Önümüzdeki üç iş günü</small></p></div>
          <div><span className="assistant-queue-icon"><Icon name="message" /></span><p><strong>3 müşteri yanıtı</strong><small>En eski yanıt dün alındı</small></p></div>
        </section>
      </main>
    </div>
  );
}
