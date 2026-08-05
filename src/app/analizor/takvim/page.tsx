"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CustomerEducationMenu } from "../../components/CustomerEducationMenu";
import { NotificationMenu } from "../../components/NotificationMenu";
import { ProfileMenu } from "../../components/ProfileMenu";

type ViewMode = "month" | "week" | "day";
type EventType = "meeting" | "delivery" | "task";
type IconName = "calendar" | "clock" | "home" | "tasks" | "video";
type ScheduleEvent = { id: number; day: number; time: string; title: string; meta: string; type: EventType; orderCode: string };

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    tasks: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const events: ScheduleEvent[] = [
  { id: 1, day: 4, time: "09:30", title: "Veri seti kontrolü", meta: "SA260803014 · Kerem Murat", type: "task", orderCode: "SA260803014" },
  { id: 2, day: 4, time: "14:30", title: "Analiz öncesi görüşme", meta: "Kerem Murat · Google Meet", type: "meeting", orderCode: "SA260803014" },
  { id: 3, day: 4, time: "17:00", title: "Analiz raporu teslimi", meta: "SA260803014", type: "delivery", orderCode: "SA260803014" },
  { id: 4, day: 5, time: "17:00", title: "Regresyon raporu teslimi", meta: "SA260801009 · Derya Aydın", type: "delivery", orderCode: "SA260801009" },
  { id: 5, day: 7, time: "11:00", title: "Ek analiz değerlendirmesi", meta: "Derya Aydın · Google Meet", type: "meeting", orderCode: "SA260801009" },
  { id: 6, day: 10, time: "10:00", title: "Sonuç tablolarını kontrol et", meta: "SA260801009", type: "task", orderCode: "SA260801009" },
  { id: 7, day: 12, time: "15:30", title: "Yöntem ve kapsam görüşmesi", meta: "Mehmet Kaya · Google Meet", type: "meeting", orderCode: "SA260803014" },
  { id: 8, day: 14, time: "16:00", title: "Ek analiz teslimi", meta: "EA260729004", type: "delivery", orderCode: "EA260729004" },
  { id: 9, day: 18, time: "10:00", title: "Power analizi sonuç sunumu", meta: "Selin Demir · Google Meet", type: "meeting", orderCode: "PA260802006" },
  { id: 10, day: 21, time: "17:30", title: "Power analizi teslimi", meta: "PA260802006", type: "delivery", orderCode: "PA260802006" },
];

const monthDays = [
  { day: 27, other: true }, { day: 28, other: true }, { day: 29, other: true }, { day: 30, other: true }, { day: 31, other: true },
  ...Array.from({ length: 31 }, (_, index) => ({ day: index + 1, other: false })),
  { day: 1, other: true }, { day: 2, other: true }, { day: 3, other: true }, { day: 4, other: true }, { day: 5, other: true }, { day: 6, other: true },
];
const weekDays = [3, 4, 5, 6, 7, 8, 9];
const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const augustWeekdays = ["", "Cumartesi", "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Pazartesi"];

function eventHref(event: ScheduleEvent) {
  const section = event.type === "task" ? "items" : event.type === "meeting" ? "notes" : "delivery";
  return `/analizor/islerim/${event.orderCode}?section=${section}`;
}

function EventPill({ event, compact = false }: { event: ScheduleEvent; compact?: boolean }) {
  return <Link className={`analyst-cal-event ${event.type} ${compact ? "compact" : ""}`} href={eventHref(event)} title={`${event.time} · ${event.title}`} onClick={(clickEvent) => clickEvent.stopPropagation()}><span /><b>{event.time}</b><span>{event.title}</span></Link>;
}

export default function AnalystCalendarPage() {
  const [view, setView] = useState<ViewMode>("month");
  const [selectedDay, setSelectedDay] = useState(4);
  const [types, setTypes] = useState<Record<EventType, boolean>>({ meeting: true, delivery: true, task: true });
  const visibleEvents = useMemo(() => events.filter(event => types[event.type]), [types]);
  const selectedEvents = visibleEvents.filter(event => event.day === selectedDay);

  const toggleType = (type: EventType) => setTypes(current => ({ ...current, [type]: !current[type] }));

  return <div className="app-shell">
    <a className="skip-link" href="#analyst-calendar-page">İçeriğe geç</a>
    <header className="topbar">
      <Link className="brand" href="/analizor"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority /></Link>
      <nav className="main-nav" aria-label="Analizör navigasyonu">
        <Link href="/analizor"><Icon name="home" />Genel bakış</Link>
        <Link href="/analizor/islerim"><Icon name="tasks" />İşlerim</Link>
        <CustomerEducationMenu />
        <Link href="/analizor/gorusmeler"><Icon name="video" />Görüşmeler</Link>
        <Link className="active" href="/analizor/takvim"><Icon name="calendar" />Takvim</Link>
      </nav>
      <div className="top-actions">
        <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
        <NotificationMenu role="analizor" />
        <ProfileMenu roleLabel="Analizör hesabı" ordersHref="/analizor/islerim" ordersLabel="İşlerim" name="Naci Yılmaz" email="analizor@eistatistik.com" initials="NY" />
      </div>
    </header>

    <main id="analyst-calendar-page" className="orders-page analyst-calendar-page">
      <header className="analyst-calendar-hero">
        <div><p className="eyebrow">ÇALIŞMA TAKVİMİ</p><h1>Takvim</h1><p>Görüşmelerinizi, teslim tarihlerinizi ve kişisel işlerinizi tek program üzerinden takip edin.</p></div>
        <div className="calendar-hero-actions"><button onClick={() => setSelectedDay(4)}>Bugüne dön</button><div><button onClick={() => setView("month")} className={view === "month" ? "active" : ""}>Ay</button><button onClick={() => setView("week")} className={view === "week" ? "active" : ""}>Hafta</button><button onClick={() => setView("day")} className={view === "day" ? "active" : ""}>Gün</button></div></div>
      </header>

      <section className="analyst-calendar-toolbar">
        <div><button aria-label="Önceki dönem">‹</button><h2>{view === "day" ? `${selectedDay} Ağustos 2026` : view === "week" ? "3–9 Ağustos 2026" : "Ağustos 2026"}</h2><button aria-label="Sonraki dönem">›</button></div>
        <div className="calendar-type-filters">
          <button className={types.meeting ? "active meeting" : ""} onClick={() => toggleType("meeting")}><span />Görüşmeler</button>
          <button className={types.delivery ? "active delivery" : ""} onClick={() => toggleType("delivery")}><span />Teslimler</button>
          <button className={types.task ? "active task" : ""} onClick={() => toggleType("task")}><span />İşler</button>
        </div>
      </section>

      <div className="analyst-calendar-workspace">
        <section className="analyst-calendar-main">
          {view === "month" && <div className="analyst-month-view">
            {['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(day => <span className="analyst-cal-day-head" key={day}>{day}</span>)}
            {monthDays.map((item, index) => <div key={`${item.day}-${index}`} className={`analyst-month-cell ${item.other ? "other" : ""} ${!item.other && item.day === 4 ? "today" : ""} ${!item.other && selectedDay === item.day ? "selected" : ""}`} role={item.other ? undefined : "button"} tabIndex={item.other ? undefined : 0} aria-label={item.other ? undefined : `${item.day} Ağustos programını göster`} onClick={() => !item.other && setSelectedDay(item.day)} onKeyDown={(event) => { if (!item.other && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedDay(item.day); } }}>
              <span className="analyst-date-number">{item.day}</span><div>{!item.other && visibleEvents.filter(event => event.day === item.day).slice(0, 3).map(event => <EventPill event={event} compact key={event.id} />)}</div>
            </div>)}
          </div>}
          {view === "week" && <div className="analyst-week-view">
            <div className="analyst-week-header"><span />{weekDays.map(day => <button className={day === 4 ? "today" : ""} onClick={() => setSelectedDay(day)} key={day}><small>{['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][day - 3]}</small><strong>{day}</strong></button>)}</div>
            {hours.map(hour => <div className="analyst-week-hour" key={hour}><span>{hour}</span>{weekDays.map(day => <div key={day}>{visibleEvents.filter(event => event.day === day && event.time.startsWith(hour.slice(0,2))).map(event => <EventPill event={event} compact key={event.id} />)}</div>)}</div>)}
          </div>}
          {view === "day" && <div className="analyst-day-view">
            {hours.map(hour => <div className="analyst-day-hour" key={hour}><span>{hour}</span><div>{visibleEvents.filter(event => event.day === selectedDay && event.time.startsWith(hour.slice(0,2))).map(event => <EventPill event={event} key={event.id} />)}</div></div>)}
          </div>}
        </section>

        <aside className="analyst-day-agenda">
          <header><p className="eyebrow">SEÇİLİ GÜN</p><div><strong>{selectedDay}</strong><span>Ağustos<small>2026 · {augustWeekdays[selectedDay]}</small></span></div></header>
          <div className="analyst-day-events">{selectedEvents.length ? selectedEvents.map(event => <Link className="analyst-day-event-link" href={eventHref(event)} key={event.id} aria-label={`${event.title} ayrıntılarını aç`}><span className={`agenda-event-icon ${event.type}`}>{event.type === "meeting" ? <Icon name="video" size={16} /> : event.type === "delivery" ? <Icon name="calendar" size={16} /> : <Icon name="tasks" size={16} />}</span><div><small>{event.time} · {event.type === "meeting" ? "GÖRÜŞME" : event.type === "delivery" ? "TESLİM" : "İŞ"}</small><strong>{event.title}</strong><p>{event.meta}</p></div><span className="analyst-event-open" aria-hidden="true">→</span></Link>) : <div className="analyst-day-empty"><Icon name="calendar" size={23} /><strong>Programınız boş</strong><p>Bu gün için planlanmış bir etkinlik bulunmuyor.</p></div>}</div>
          <footer><div><span className="meeting" />Görüşme</div><div><span className="delivery" />Teslim</div><div><span className="task" />İş</div></footer>
        </aside>
      </div>
    </main>
  </div>;
}
