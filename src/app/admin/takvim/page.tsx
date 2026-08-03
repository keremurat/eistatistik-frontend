"use client";

import { useState, useMemo } from "react";
import { AdminShell } from "../AdminShell";

// ── Tipler ────────────────────────────────────────────────────────────────────
type ViewMode = "ay" | "hafta" | "gun";

interface CalEvent {
  id: number;
  dateStr: string; // "YYYY-MM-DD"
  time: string;    // "HH:MM"
  code: string;
  isEk: boolean;
  type: "sa" | "pa";
  atanan: string;
}

// ── Sabitler ──────────────────────────────────────────────────────────────────
const USERS = [
  "EİSTATİSTİK ANALİZÖR", "KEREM MURAT", "MEHMET MEŞE", "KAAN KARAKAYA",
  "YASİN YILDIRIM", "SÜMEYYE İNAN", "RABİA AKTAŞ", "ESRA ÖZTÜRK",
  "Eistatistik Genel Analizör", "E YÖNETİM", "ALİİHSAN ŞÜKÜR", "FATİH AKAR", "NACİ MURAT",
];

const DAYS   = ["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"];
const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const HOURS  = ["08","09","10","11","12","13","14","15","16","17","18","19"];

// ── Mock veri (Ağustos 2026) ──────────────────────────────────────────────────
const ALL_EVENTS: CalEvent[] = [
  // Jul 27
  { id:1,  dateStr:"2026-07-27", time:"16:51", code:"SA260716006", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  // Jul 31
  { id:2,  dateStr:"2026-07-31", time:"09:00", code:"SA260711005", isEk:true,  type:"sa", atanan:"SÜMEYYE İNAN" },
  // Aug 3
  { id:3,  dateStr:"2026-08-03", time:"09:00", code:"SA260725002", isEk:true,  type:"sa", atanan:"MEHMET MEŞE" },
  { id:4,  dateStr:"2026-08-03", time:"09:00", code:"SA260729013", isEk:true,  type:"sa", atanan:"NACİ MURAT" },
  { id:5,  dateStr:"2026-08-03", time:"09:43", code:"SA260730002", isEk:true,  type:"sa", atanan:"KEREM MURAT" },
  { id:6,  dateStr:"2026-08-03", time:"10:24", code:"SA260617010", isEk:false, type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  { id:7,  dateStr:"2026-08-03", time:"11:45", code:"SA260721006", isEk:false, type:"sa", atanan:"SÜMEYYE İNAN" },
  { id:8,  dateStr:"2026-08-03", time:"13:37", code:"SA260722004", isEk:false, type:"sa", atanan:"EİSTATİSTİK ANALİZÖR" },
  { id:9,  dateStr:"2026-08-03", time:"15:03", code:"SA260727022", isEk:false, type:"sa", atanan:"FATİH AKAR" },
  { id:10, dateStr:"2026-08-03", time:"16:21", code:"SA260713005", isEk:false, type:"sa", atanan:"ESRA ÖZTÜRK" },
  { id:11, dateStr:"2026-08-03", time:"16:43", code:"SA260713020", isEk:false, type:"sa", atanan:"RABİA AKTAŞ" },
  // Aug 4
  { id:12, dateStr:"2026-08-04", time:"09:00", code:"SA260728012", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  { id:13, dateStr:"2026-08-04", time:"10:47", code:"SA260731002", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  { id:14, dateStr:"2026-08-04", time:"11:17", code:"SA260723009", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:15, dateStr:"2026-08-04", time:"11:25", code:"SA260723020", isEk:false, type:"sa", atanan:"SÜMEYYE İNAN" },
  { id:16, dateStr:"2026-08-04", time:"11:53", code:"SA260723003", isEk:false, type:"sa", atanan:"EİSTATİSTİK ANALİZÖR" },
  // Aug 5
  { id:17, dateStr:"2026-08-05", time:"09:00", code:"SA260716018", isEk:true,  type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  { id:18, dateStr:"2026-08-05", time:"10:47", code:"SA260723011", isEk:false, type:"sa", atanan:"FATİH AKAR" },
  { id:19, dateStr:"2026-08-05", time:"10:50", code:"PA260727004", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  { id:20, dateStr:"2026-08-05", time:"12:11", code:"SA260729009", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  { id:21, dateStr:"2026-08-05", time:"13:23", code:"SA260724005", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  { id:22, dateStr:"2026-08-05", time:"14:13", code:"SA260730003", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:23, dateStr:"2026-08-05", time:"15:10", code:"SA260725003", isEk:false, type:"sa", atanan:"SÜMEYYE İNAN" },
  // Aug 6
  { id:24, dateStr:"2026-08-06", time:"09:00", code:"SA260708004", isEk:false, type:"sa", atanan:"EİSTATİSTİK ANALİZÖR" },
  { id:25, dateStr:"2026-08-06", time:"09:00", code:"SA260724001", isEk:false, type:"sa", atanan:"RABİA AKTAŞ" },
  { id:26, dateStr:"2026-08-06", time:"09:00", code:"SA260730007", isEk:false, type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  { id:27, dateStr:"2026-08-06", time:"09:00", code:"SA260731015", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  { id:28, dateStr:"2026-08-06", time:"09:00", code:"SA260801002", isEk:true,  type:"sa", atanan:"FATİH AKAR" },
  { id:29, dateStr:"2026-08-06", time:"11:03", code:"SA260728003", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  { id:30, dateStr:"2026-08-06", time:"11:27", code:"SA260727017", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:31, dateStr:"2026-08-06", time:"11:39", code:"SA260612011", isEk:false, type:"sa", atanan:"SÜMEYYE İNAN" },
  { id:32, dateStr:"2026-08-06", time:"14:37", code:"PA260731006", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  // Aug 7
  { id:33, dateStr:"2026-08-07", time:"09:00", code:"SA260624016", isEk:false, type:"sa", atanan:"EİSTATİSTİK ANALİZÖR" },
  { id:34, dateStr:"2026-08-07", time:"09:00", code:"SA260725014", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  { id:35, dateStr:"2026-08-07", time:"11:38", code:"SA260801005", isEk:false, type:"sa", atanan:"RABİA AKTAŞ" },
  { id:36, dateStr:"2026-08-07", time:"12:04", code:"SA260729003", isEk:false, type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  { id:37, dateStr:"2026-08-07", time:"12:19", code:"SA260718006", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  { id:38, dateStr:"2026-08-07", time:"15:54", code:"SA260719004", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:39, dateStr:"2026-08-07", time:"16:58", code:"SA260720012", isEk:false, type:"sa", atanan:"SÜMEYYE İNAN" },
  // Aug 10
  { id:40, dateStr:"2026-08-10", time:"09:00", code:"SA260716021", isEk:true,  type:"sa", atanan:"KEREM MURAT" },
  { id:41, dateStr:"2026-08-10", time:"14:20", code:"SA260730004", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  // Aug 11
  { id:42, dateStr:"2026-08-11", time:"09:00", code:"SA260730008", isEk:true,  type:"sa", atanan:"NACİ MURAT" },
  { id:43, dateStr:"2026-08-11", time:"09:00", code:"SA260731011", isEk:true,  type:"sa", atanan:"SÜMEYYE İNAN" },
  { id:44, dateStr:"2026-08-11", time:"09:00", code:"SA260731013", isEk:true,  type:"sa", atanan:"EİSTATİSTİK ANALİZÖR" },
  { id:45, dateStr:"2026-08-11", time:"09:00", code:"SA260731014", isEk:true,  type:"sa", atanan:"KEREM MURAT" },
  { id:46, dateStr:"2026-08-11", time:"09:00", code:"SA260802003", isEk:true,  type:"sa", atanan:"RABİA AKTAŞ" },
  { id:47, dateStr:"2026-08-11", time:"09:47", code:"SA260803004", isEk:true,  type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  { id:48, dateStr:"2026-08-11", time:"11:18", code:"PA260723005", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  { id:49, dateStr:"2026-08-11", time:"13:37", code:"SA260722003", isEk:false, type:"sa", atanan:"FATİH AKAR" },
  { id:50, dateStr:"2026-08-11", time:"15:54", code:"SA260731003", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:51, dateStr:"2026-08-11", time:"16:43", code:"SA260721013", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  // Aug 12
  { id:52, dateStr:"2026-08-12", time:"09:00", code:"SA260731011", isEk:true,  type:"sa", atanan:"SÜMEYYE İNAN" },
  { id:53, dateStr:"2026-08-12", time:"12:11", code:"PA260724006", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  // Aug 13
  { id:54, dateStr:"2026-08-13", time:"09:00", code:"SA260724003", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  { id:55, dateStr:"2026-08-13", time:"09:00", code:"SA260724008", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:56, dateStr:"2026-08-13", time:"09:00", code:"SA260724013", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  // Aug 17
  { id:57, dateStr:"2026-08-17", time:"09:00", code:"SA260810001", isEk:false, type:"sa", atanan:"SÜMEYYE İNAN" },
  { id:58, dateStr:"2026-08-17", time:"10:30", code:"SA260810002", isEk:true,  type:"sa", atanan:"KEREM MURAT" },
  { id:59, dateStr:"2026-08-17", time:"13:15", code:"PA260810003", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  // Aug 18
  { id:60, dateStr:"2026-08-18", time:"09:00", code:"SA260811001", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  { id:61, dateStr:"2026-08-18", time:"11:00", code:"SA260811004", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:62, dateStr:"2026-08-18", time:"14:00", code:"PA260811002", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  // Aug 19
  { id:63, dateStr:"2026-08-19", time:"09:00", code:"SA260812003", isEk:true,  type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  { id:64, dateStr:"2026-08-19", time:"11:30", code:"SA260812005", isEk:false, type:"sa", atanan:"FATİH AKAR" },
  // Aug 20
  { id:65, dateStr:"2026-08-20", time:"10:15", code:"SA260813004", isEk:false, type:"sa", atanan:"RABİA AKTAŞ" },
  { id:66, dateStr:"2026-08-20", time:"13:00", code:"SA260813007", isEk:true,  type:"sa", atanan:"EİSTATİSTİK ANALİZÖR" },
  // Aug 21
  { id:67, dateStr:"2026-08-21", time:"09:00", code:"SA260814005", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  { id:68, dateStr:"2026-08-21", time:"14:30", code:"SA260814008", isEk:false, type:"sa", atanan:"SÜMEYYE İNAN" },
  // Aug 24
  { id:69, dateStr:"2026-08-24", time:"09:00", code:"SA260817001", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  { id:70, dateStr:"2026-08-24", time:"11:30", code:"SA260817002", isEk:true,  type:"sa", atanan:"FATİH AKAR" },
  { id:71, dateStr:"2026-08-24", time:"15:00", code:"PA260817006", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  // Aug 25
  { id:72, dateStr:"2026-08-25", time:"09:00", code:"SA260818003", isEk:false, type:"sa", atanan:"MEHMET MEŞE" },
  { id:73, dateStr:"2026-08-25", time:"11:00", code:"SA260818006", isEk:false, type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  // Aug 26
  { id:74, dateStr:"2026-08-26", time:"10:00", code:"SA260819004", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  { id:75, dateStr:"2026-08-26", time:"14:00", code:"SA260819007", isEk:true,  type:"sa", atanan:"RABİA AKTAŞ" },
  // Aug 27
  { id:76, dateStr:"2026-08-27", time:"09:00", code:"SA260820005", isEk:false, type:"sa", atanan:"NACİ MURAT" },
  { id:77, dateStr:"2026-08-27", time:"13:45", code:"PA260820008", isEk:false, type:"pa", atanan:"ESRA ÖZTÜRK" },
  // Aug 28
  { id:78, dateStr:"2026-08-28", time:"09:00", code:"SA260821002", isEk:false, type:"sa", atanan:"EİSTATİSTİK ANALİZÖR" },
  { id:79, dateStr:"2026-08-28", time:"14:30", code:"SA260821006", isEk:true,  type:"sa", atanan:"MEHMET MEŞE" },
  // Aug 31
  { id:80, dateStr:"2026-08-31", time:"09:00", code:"SA260824001", isEk:false, type:"sa", atanan:"ALİİHSAN ŞÜKÜR" },
  { id:81, dateStr:"2026-08-31", time:"11:30", code:"SA260824004", isEk:false, type:"sa", atanan:"FATİH AKAR" },
  // Sep 1
  { id:82, dateStr:"2026-09-01", time:"09:00", code:"SA260825001", isEk:false, type:"sa", atanan:"KEREM MURAT" },
  // Sep 2
  { id:83, dateStr:"2026-09-02", time:"10:00", code:"SA260826003", isEk:true,  type:"sa", atanan:"NACİ MURAT" },
];

// ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────────
function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function monthGrid(y: number, m: number): Date[] {
  const start = new Date(y, m, 1).getDay();
  return Array.from({ length: 42 }, (_, i) => new Date(y, m, 1 - start + i));
}

function weekDays(base: Date): Date[] {
  const d = base.getDay();
  return Array.from({ length: 7 }, (_, i) => new Date(base.getFullYear(), base.getMonth(), base.getDate() - d + i));
}

function byDateMap(events: CalEvent[]): Record<string, CalEvent[]> {
  const m: Record<string, CalEvent[]> = {};
  events.forEach(e => { (m[e.dateStr] ??= []).push(e); });
  return m;
}

// ── İkon ─────────────────────────────────────────────────────────────────────
type IName = "left" | "right";
function Icon({ name, size = 15 }: { name: IName; size?: number }) {
  const p: Record<IName, React.ReactNode> = {
    left:  <polyline points="15 18 9 12 15 6" />,
    right: <polyline points="9 6 15 12 9 18" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>;
}

// ── Etkinlik çipi ─────────────────────────────────────────────────────────────
function EventChip({ ev }: { ev: CalEvent }) {
  return (
    <a
      className={`cal-event${ev.type === "pa" ? " cal-event-pa" : ""}`}
      href={`/admin/siparisler/${ev.code}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="cal-dot" />
      <span className="cal-event-text">{ev.time} {ev.code}{ev.isEk ? " Ek" : ""}</span>
    </a>
  );
}

// ── Ay görünümü ───────────────────────────────────────────────────────────────
function MonthView({ year, month, events }: { year: number; month: number; events: CalEvent[] }) {
  const days  = useMemo(() => monthGrid(year, month), [year, month]);
  const byDay = useMemo(() => byDateMap(events), [events]);
  const today = toStr(new Date());

  return (
    <div className="cal-month">
      {DAYS.map(d => <div key={d} className="cal-day-head">{d}</div>)}
      {days.map((d, i) => {
        const str   = toStr(d);
        const other = d.getMonth() !== month;
        return (
          <div key={i} className={`cal-cell${other ? " cal-cell-other" : ""}${str === today ? " cal-cell-today" : ""}`}>
            <span className="cal-date-num">{d.getDate()}</span>
            <div className="cal-cell-events">
              {(byDay[str] ?? []).map(ev => <EventChip key={ev.id} ev={ev} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Hafta görünümü ────────────────────────────────────────────────────────────
function WeekView({ base, events }: { base: Date; events: CalEvent[] }) {
  const days  = useMemo(() => weekDays(base), [base]);
  const byDay = useMemo(() => byDateMap(events), [events]);
  const today = toStr(new Date());

  return (
    <div className="cal-week">
      <div className="cal-week-head">
        <div className="cal-week-gutter" />
        {days.map((d, i) => {
          const str = toStr(d);
          return (
            <div key={i} className={`cal-week-day-head${str === today ? " today" : ""}`}>
              <span>{DAYS[d.getDay()]}</span>
              <strong>{d.getDate()}</strong>
            </div>
          );
        })}
      </div>
      <div className="cal-week-body">
        {HOURS.map(h => (
          <div key={h} className="cal-week-row">
            <div className="cal-week-gutter">{h}:00</div>
            {days.map((d, i) => {
              const str  = toStr(d);
              const evs  = (byDay[str] ?? []).filter(e => e.time.startsWith(h));
              return (
                <div key={i} className={`cal-week-cell${str === today ? " today" : ""}`}>
                  {evs.map(ev => <EventChip key={ev.id} ev={ev} />)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gün görünümü ──────────────────────────────────────────────────────────────
function DayView({ base, events }: { base: Date; events: CalEvent[] }) {
  const str      = toStr(base);
  const dayEvs   = events.filter(e => e.dateStr === str);
  const today    = toStr(new Date());
  const isToday  = str === today;

  return (
    <div className="cal-day-view">
      <div className={`cal-day-view-head${isToday ? " today" : ""}`}>
        <span>{DAYS[base.getDay()]}</span>
        <strong>{base.getDate()} {MONTHS[base.getMonth()]} {base.getFullYear()}</strong>
      </div>
      <div className="cal-day-body">
        {HOURS.map(h => {
          const evs = dayEvs.filter(e => e.time.startsWith(h));
          return (
            <div key={h} className={`cal-day-row${evs.length > 0 ? " has-events" : ""}`}>
              <span className="cal-day-time">{h}:00</span>
              <div className="cal-day-events">
                {evs.map(ev => <EventChip key={ev.id} ev={ev} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Ana sayfa ─────────────────────────────────────────────────────────────────
const TODAY = new Date(2026, 7, 3); // 3 Ağustos 2026

export default function TakvimPage() {
  const [view,         setView]        = useState<ViewMode>("ay");
  const [current,      setCurrent]     = useState<Date>(TODAY);
  const [selectedUser, setSelectedUser]= useState<string | null>(null);

  const y = current.getFullYear();
  const m = current.getMonth();

  function prev() {
    if (view === "ay")    setCurrent(new Date(y, m - 1, 1));
    else if (view === "hafta") setCurrent(new Date(y, m, current.getDate() - 7));
    else                  setCurrent(new Date(y, m, current.getDate() - 1));
  }
  function next() {
    if (view === "ay")    setCurrent(new Date(y, m + 1, 1));
    else if (view === "hafta") setCurrent(new Date(y, m, current.getDate() + 7));
    else                  setCurrent(new Date(y, m, current.getDate() + 1));
  }
  function goToday() { setCurrent(TODAY); }

  const filtered = useMemo(
    () => selectedUser ? ALL_EVENTS.filter(e => e.atanan === selectedUser) : ALL_EVENTS,
    [selectedUser],
  );

  function headerLabel() {
    if (view === "ay") return `${MONTHS[m].toUpperCase()} ${y}`;
    if (view === "hafta") {
      const [first, last] = [weekDays(current)[0], weekDays(current)[6]];
      return first.getMonth() === last.getMonth()
        ? `${first.getDate()}–${last.getDate()} ${MONTHS[first.getMonth()]} ${y}`
        : `${first.getDate()} ${MONTHS[first.getMonth()]} – ${last.getDate()} ${MONTHS[last.getMonth()]} ${y}`;
    }
    return `${current.getDate()} ${MONTHS[m]} ${y}`;
  }

  return (
    <AdminShell>
      <div className="cal-page">

        {/* Takvim ana alanı */}
        <div className="cal-main">

          {/* Kontroller */}
          <div className="cal-controls">
            <div className="cal-nav-group">
              <button className="cal-nav-btn" onClick={prev}   aria-label="Önceki"><Icon name="left"  /></button>
              <button className="cal-nav-btn" onClick={next}   aria-label="Sonraki"><Icon name="right" /></button>
              <button className="cal-today-btn" onClick={goToday}>Bugün</button>
            </div>
            <span className="cal-period-label">{headerLabel()}</span>
            <div className="cal-view-group">
              {(["ay","hafta","gun"] as ViewMode[]).map(v => (
                <button key={v} className={`cal-view-btn${view === v ? " active" : ""}`} onClick={() => setView(v)}>
                  {v === "ay" ? "Ay" : v === "hafta" ? "Hafta" : "Gün"}
                </button>
              ))}
            </div>
          </div>

          {/* Görünüm */}
          <div className="cal-view-wrap">
            {view === "ay"    && <MonthView year={y} month={m} events={filtered} />}
            {view === "hafta" && <WeekView  base={current} events={filtered} />}
            {view === "gun"   && <DayView   base={current} events={filtered} />}
          </div>
        </div>

        {/* Sağ kenar */}
        <aside className="cal-sidebar">

          {/* Renk açıklaması */}
          <div className="cal-legend">
            <p className="cal-legend-title">Renk göstergesi</p>
            <div className="cal-legend-item">
              <span className="cal-legend-dot cal-legend-dot-sa" />
              <span>Sipariş / Analiz</span>
            </div>
            <div className="cal-legend-item">
              <span className="cal-legend-dot cal-legend-dot-pa" />
              <span>Görüşme / Toplantı</span>
            </div>
          </div>

          <div className="cal-sidebar-divider" />

          {/* Kullanıcı filtresi */}
          <button
            className={`cal-user-item${!selectedUser ? " active" : ""}`}
            onClick={() => setSelectedUser(null)}
          >Tümü</button>
          {USERS.map(u => (
            <button
              key={u}
              className={`cal-user-item${selectedUser === u ? " active" : ""}`}
              onClick={() => setSelectedUser(selectedUser === u ? null : u)}
            >{u}</button>
          ))}
        </aside>

      </div>
    </AdminShell>
  );
}
