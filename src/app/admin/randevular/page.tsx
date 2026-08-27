"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { Appointment, readAppointments, writeAppointments } from "./appointmentData";

type Tab = "upcoming" | "past";
type IconName = "plus" | "calendar" | "clock" | "user" | "empty" | "video" | "edit" | "close";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    user: <><circle cx="12" cy="8" r="3" /><path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" /></>,
    empty: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M9 14l6 6M15 14l-6 6" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const formatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function statusLabel(status: Appointment["status"]) {
  return status === "planlandi" ? "Planlandı" : status === "iptal" ? "İptal" : "Tamamlandı";
}

function AppointmentRows({ records, onCancel }: { records: Appointment[]; onCancel: (record: Appointment) => void }) {
  if (records.length === 0) return <div className="appointment-empty"><span><Icon name="empty" size={28} /></span><strong>Bu bölümde randevu yok</strong><p>Yeni bir görüşme planladığınızda tarih ve katılımcı bilgileri burada görünecek.</p></div>;
  return <div className="appointment-list">{records.map((record) => {
    const start = new Date(record.start);
    const end = new Date(record.end);
    return <article className="appointment-row" key={record.id}>
      <div className="appointment-date"><span>{start.toLocaleDateString("tr-TR", { day: "2-digit" })}</span><small>{start.toLocaleDateString("tr-TR", { month: "short" })}</small></div>
      <div className="appointment-copy"><strong>{record.title}</strong><p>{record.description || "Randevu açıklaması eklenmedi."}</p></div>
      <div className="appointment-meta"><span><Icon name="clock" size={15} />{formatter.format(start)} – {end.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span><span><Icon name="user" size={15} />{record.customer} · {record.assignee}</span></div>
      <div className="appointment-actions-inline">
        <span className={`appointment-status ${record.status}`}>{statusLabel(record.status)}</span>
        <a className="appointment-meet-btn" href="https://meet.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Google Meet bağlantısına git"><Icon name="video" size={14} />Meet</a>
        <Link className="appointment-icon-btn" href={`/admin/randevular/duzenle?id=${record.id}`} aria-label="Randevuyu düzenle"><Icon name="edit" size={14} /></Link>
        {record.status !== "iptal" && (
          <button type="button" className="appointment-icon-btn danger" onClick={() => onCancel(record)} aria-label="Randevuyu iptal et"><Icon name="close" size={14} /></button>
        )}
      </div>
    </article>;
  })}</div>;
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage yalnızca istemcide okunur (hydration uyumsuzluğunu önler)
  useEffect(() => setAppointments(readAppointments()), []);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    return {
      upcoming: appointments.filter(item => item.status === "planlandi" && new Date(item.end) >= now).sort((a, b) => +new Date(a.start) - +new Date(b.start)),
      past: appointments.filter(item => item.status !== "planlandi" || new Date(item.end) < now).sort((a, b) => +new Date(b.start) - +new Date(a.start)),
    };
  }, [appointments]);

  function confirmCancel() {
    if (!cancelTarget) return;
    const next = appointments.map(item => item.id === cancelTarget.id ? { ...item, status: "iptal" as const } : item);
    setAppointments(next);
    writeAppointments(next);
    setCancelTarget(null);
  }

  const visible = tab === "upcoming" ? upcoming : past;
  return <AdminShell><div className="st-page appointments-page">
    <header className="orders-hero"><div><h1>Randevular</h1></div><Link className="orders-create" href="/admin/randevular/ekle"><Icon name="plus" size={17} />Yeni randevu</Link></header>
    <section className="detail-panel appointment-panel" aria-label="Randevu listesi">
      <div className="order-tabs appointment-tabs" role="tablist" aria-label="Randevu durumu">
        <button type="button" role="tab" aria-selected={tab === "upcoming"} className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")}><Icon name="clock" size={16} />Yaklaşan <span>{upcoming.length}</span></button>
        <button type="button" role="tab" aria-selected={tab === "past"} className={tab === "past" ? "active" : ""} onClick={() => setTab("past")}><Icon name="calendar" size={16} />Geçmiş <span>{past.length}</span></button>
      </div>
      <AppointmentRows records={visible} onCancel={setCancelTarget} />
    </section>

    {cancelTarget && typeof document !== "undefined" && createPortal(
      <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setCancelTarget(null); }}>
        <section className="legal-modal ms-edit-modal" style={{ maxWidth: 420, minHeight: 0 }} role="dialog" aria-modal="true" aria-labelledby="cancel-appt-title">
          <header>
            <div>
              <p className="eyebrow">DİKKAT</p>
              <h2 id="cancel-appt-title" style={{ fontSize: ".9rem" }}>Randevuyu iptal et</h2>
            </div>
            <button aria-label="Kapat" onClick={() => setCancelTarget(null)}>×</button>
          </header>
          <div className="ms-edit-body">
            <p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>
              <strong>{cancelTarget.title}</strong> randevusunu iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
          </div>
          <footer>
            <div />
            <div>
              <button className="legal-cancel" onClick={() => setCancelTarget(null)}>Vazgeç</button>
              <button className="legal-accept" style={{ background: "#c85a51" }} onClick={confirmCancel}>Evet, İptal Et</button>
            </div>
          </footer>
        </section>
      </div>,
      document.body
    )}
  </div></AdminShell>;
}
