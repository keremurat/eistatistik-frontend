"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CustomerEducationMenu } from "../../components/CustomerEducationMenu";
import { NotificationMenu } from "../../components/NotificationMenu";
import { ProfileMenu } from "../../components/ProfileMenu";

type MeetingStatus = "today" | "upcoming" | "completed";
type MeetingFilter = "all" | MeetingStatus;
type IconName = "arrow" | "calendar" | "clock" | "home" | "search" | "tasks" | "video";

type Meeting = {
  id: number;
  day: number;
  month: string;
  date: string;
  time: string;
  duration: string;
  title: string;
  customer: string;
  order: string;
  status: MeetingStatus;
  note: string;
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    tasks: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const meetings: Meeting[] = [
  { id: 1, day: 4, month: "Ağu", date: "Bugün", time: "14:30", duration: "45 dk.", title: "Analiz öncesi değerlendirme", customer: "Kerem Murat", order: "SA260803014", status: "today", note: "Veri seti, araştırma soruları ve analiz planı görüşülecek." },
  { id: 2, day: 7, month: "Ağu", date: "7 Ağustos 2026", time: "11:00", duration: "30 dk.", title: "Ek analiz değerlendirmesi", customer: "Derya Aydın", order: "EA260729004", status: "upcoming", note: "Ek analiz kapsamı ve teslim planı netleştirilecek." },
  { id: 3, day: 12, month: "Ağu", date: "12 Ağustos 2026", time: "15:30", duration: "45 dk.", title: "Yöntem ve kapsam görüşmesi", customer: "Mehmet Kaya", order: "SA260801009", status: "upcoming", note: "Regresyon modeli ve raporlama kapsamı değerlendirilecek." },
  { id: 4, day: 18, month: "Ağu", date: "18 Ağustos 2026", time: "10:00", duration: "30 dk.", title: "Sonuç sunumu", customer: "Selin Demir", order: "PA260802006", status: "upcoming", note: "Power analizi sonuçları müşteriye sunulacak." },
  { id: 5, day: 31, month: "Tem", date: "31 Temmuz 2026", time: "13:00", duration: "40 dk.", title: "Analiz sonuçları görüşmesi", customer: "Onur Şen", order: "SA260728002", status: "completed", note: "Görüşme tamamlandı ve toplantı notları siparişe eklendi." },
];

const filters: { key: MeetingFilter; label: string }[] = [
  { key: "all", label: "Tüm görüşmeler" }, { key: "today", label: "Bugün" }, { key: "upcoming", label: "Yaklaşan" }, { key: "completed", label: "Tamamlanan" },
];

const calendarDays = [
  { day: 27, muted: true }, { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true }, { day: 31, muted: true },
  ...Array.from({ length: 31 }, (_, index) => ({ day: index + 1, muted: false })),
  { day: 1, muted: true }, { day: 2, muted: true }, { day: 3, muted: true }, { day: 4, muted: true }, { day: 5, muted: true }, { day: 6, muted: true },
];

export default function AnalystMeetingsPage() {
  const [filter, setFilter] = useState<MeetingFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState(4);

  const counts = useMemo(() => Object.fromEntries(filters.map(item => [item.key, item.key === "all" ? meetings.length : meetings.filter(meeting => meeting.status === item.key).length])) as Record<MeetingFilter, number>, []);
  const visibleMeetings = useMemo(() => {
    const normalized = query.toLocaleLowerCase("tr");
    return meetings.filter(meeting => (filter === "all" || meeting.status === filter) && `${meeting.title} ${meeting.customer} ${meeting.order}`.toLocaleLowerCase("tr").includes(normalized));
  }, [filter, query]);
  const selectedMeetings = meetings.filter(meeting => meeting.month === "Ağu" && meeting.day === selectedDay);

  return <div className="app-shell">
    <a className="skip-link" href="#analyst-meetings">İçeriğe geç</a>
    <header className="topbar">
      <Link className="brand" href="/analizor"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority /></Link>
      <nav className="main-nav" aria-label="Analizör navigasyonu">
        <Link href="/analizor"><Icon name="home" />Genel bakış</Link>
        <Link href="/analizor/islerim"><Icon name="tasks" />İşlerim</Link>
        <CustomerEducationMenu />
        <Link className="active" href="/analizor/gorusmeler"><Icon name="video" />Görüşmeler</Link>
        <Link href="/analizor/takvim"><Icon name="calendar" />Takvim</Link>
      </nav>
      <div className="top-actions">
        <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
        <NotificationMenu role="analizor" />
        <ProfileMenu roleLabel="Analizör hesabı" ordersHref="/analizor/islerim" ordersLabel="İşlerim" name="Naci Yılmaz" email="analizor@eistatistik.com" initials="NY" />
      </div>
    </header>

    <main id="analyst-meetings" className="orders-page analyst-meetings-page">
      <header className="orders-hero analyst-meetings-hero">
        <div><p className="eyebrow">GÖRÜŞME MERKEZİ</p><h1>Görüşmeler</h1><p>Size atanan müşteri görüşmelerini takip edin, hazırlık notlarına erişin ve zamanı geldiğinde görüşmeye katılın.</p></div>
        <aside className="next-meeting-card"><span className="next-meeting-icon"><Icon name="video" /></span><div><small>SIRADAKİ GÖRÜŞME</small><strong>Bugün · 14:30</strong><p>Kerem Murat · 45 dakika</p></div><button>Görüşmeye katıl <Icon name="arrow" size={15} /></button></aside>
      </header>

      <nav className="order-tabs" aria-label="Görüşme durumları">
        {filters.map(item => <button key={item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}<span>{counts[item.key]}</span></button>)}
      </nav>

      <section className="orders-toolbar" aria-label="Görüşme arama">
        <label className="orders-search"><Icon name="search" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Görüşme, müşteri veya sipariş kodu ara…" /></label>
        <span className="result-count">{visibleMeetings.length} görüşme gösteriliyor</span>
      </section>

      <div className="meetings-workspace">
        <section className="meeting-schedule">
          <header><div><p className="eyebrow">PROGRAMINIZ</p><h2>Görüşme listesi</h2></div><span>{visibleMeetings.length} kayıt</span></header>
          <div className="meeting-schedule-list">
            {visibleMeetings.map(meeting => <article className={`meeting-schedule-row ${meeting.status}`} key={meeting.id}>
              <span className="meeting-date"><strong>{String(meeting.day).padStart(2, "0")}</strong><small>{meeting.month}</small></span>
              <div className="meeting-main"><span className={`meeting-status ${meeting.status}`}>{meeting.status === "today" ? "BUGÜN" : meeting.status === "completed" ? "TAMAMLANDI" : "YAKLAŞAN"}</span><h3>{meeting.title}</h3><p>{meeting.customer} · {meeting.order}</p><small>{meeting.note}</small></div>
              <div className="meeting-time"><Icon name="clock" size={16} /><span><strong>{meeting.time}</strong><small>{meeting.duration}</small></span></div>
              <button className={meeting.status === "today" ? "primary" : ""}>{meeting.status === "completed" ? "Notları görüntüle" : meeting.status === "today" ? "Görüşmeye katıl" : "Görüşmeyi aç"}<Icon name="arrow" size={15} /></button>
            </article>)}
            {visibleMeetings.length === 0 && <div className="meetings-empty"><Icon name="calendar" size={25} /><h3>Görüşme bulunamadı</h3><p>Arama metnini veya durum filtresini değiştirin.</p></div>}
          </div>
        </section>

        <aside className="meeting-calendar-card">
          <div className="section-title"><div><p className="eyebrow">TAKVİM</p><h2>Ağustos 2026</h2></div><div className="calendar-nav"><button aria-label="Önceki ay">‹</button><button aria-label="Sonraki ay">›</button></div></div>
          <div className="weekdays"><span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span></div>
          <div className="calendar-grid">
            {calendarDays.map((item, index) => {
              const hasMeeting = !item.muted && meetings.some(meeting => meeting.month === "Ağu" && meeting.day === item.day);
              return <button key={`${item.day}-${index}`} className={`${item.muted ? "muted" : ""} ${!item.muted && item.day === selectedDay ? "selected" : ""} ${hasMeeting ? "has-event" : ""}`} onClick={() => !item.muted && setSelectedDay(item.day)}>{item.day}</button>;
            })}
          </div>
          <div className="selected-meeting-day"><span><strong>{selectedDay}</strong><small>Ağustos</small></span><div>{selectedMeetings.length ? selectedMeetings.map(meeting => <p key={meeting.id}><b>{meeting.time}</b><span>{meeting.title}<small>{meeting.customer}</small></span></p>) : <p className="empty-day">Bu gün için görüşme bulunmuyor.</p>}</div></div>
        </aside>
      </div>
    </main>
  </div>;
}
