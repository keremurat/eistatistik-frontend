"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Appointment, readAppointments } from "./appointmentData";

type Tab = "upcoming" | "past";
type IconName = "plus" | "calendar" | "clock" | "user" | "empty";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    user: <><circle cx="12" cy="8" r="3" /><path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" /></>,
    empty: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M9 14l6 6M15 14l-6 6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const formatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function AppointmentRows({ records }: { records: Appointment[] }) {
  if (records.length === 0) return <div className="appointment-empty"><span><Icon name="empty" size={28} /></span><strong>Bu bölümde randevu yok</strong><p>Yeni bir görüşme planladığınızda tarih ve katılımcı bilgileri burada görünecek.</p></div>;
  return <div className="appointment-list">{records.map((record) => {
    const start = new Date(record.start);
    const end = new Date(record.end);
    return <article className="appointment-row" key={record.id}>
      <div className="appointment-date"><span>{start.toLocaleDateString("tr-TR", { day: "2-digit" })}</span><small>{start.toLocaleDateString("tr-TR", { month: "short" })}</small></div>
      <div className="appointment-copy"><strong>{record.title}</strong><p>{record.description || "Randevu açıklaması eklenmedi."}</p></div>
      <div className="appointment-meta"><span><Icon name="clock" size={15} />{formatter.format(start)} – {end.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span><span><Icon name="user" size={15} />{record.customer} · {record.assignee}</span></div>
      <span className={`appointment-status ${record.status}`}>{record.status === "planlandi" ? "Planlandı" : record.status === "iptal" ? "İptal" : "Tamamlandı"}</span>
    </article>;
  })}</div>;
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => setAppointments(readAppointments()), []);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    return {
      upcoming: appointments.filter(item => item.status === "planlandi" && new Date(item.end) >= now).sort((a, b) => +new Date(a.start) - +new Date(b.start)),
      past: appointments.filter(item => item.status !== "planlandi" || new Date(item.end) < now).sort((a, b) => +new Date(b.start) - +new Date(a.start)),
    };
  }, [appointments]);

  const visible = tab === "upcoming" ? upcoming : past;
  return <AdminShell><div className="st-page appointments-page">
    <header className="orders-hero"><div><h1>Randevular</h1></div><Link className="orders-create" href="/admin/randevular/ekle"><Icon name="plus" size={17} />Yeni randevu</Link></header>
    <section className="detail-panel appointment-panel" aria-label="Randevu listesi">
      <div className="order-tabs appointment-tabs" role="tablist" aria-label="Randevu durumu">
        <button type="button" role="tab" aria-selected={tab === "upcoming"} className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")}><Icon name="clock" size={16} />Yaklaşan <span>{upcoming.length}</span></button>
        <button type="button" role="tab" aria-selected={tab === "past"} className={tab === "past" ? "active" : ""} onClick={() => setTab("past")}><Icon name="calendar" size={16} />Geçmiş <span>{past.length}</span></button>
      </div>
      <AppointmentRows records={visible} />
    </section>
  </div></AdminShell>;
}
