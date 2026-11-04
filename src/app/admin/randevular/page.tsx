"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Appointment, readAppointments } from "./appointmentData";

type Tab = "upcoming" | "past";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

const MEET_URL = "https://meet.google.com/";

function MeetIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M164,72V184a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H156A8,8,0,0,1,164,72Zm68.16,1.83a8,8,0,0,0-8.16,0l-40,24A8,8,0,0,0,180,104v48a8,8,0,0,0,4,6.93l40,24a8,8,0,0,0,12-6.93V80A8,8,0,0,0,232.16,73.83Z" />
    </svg>
  );
}

function Caret() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

function statusLabel(status: Appointment["status"]) {
  return status === "planlandi" ? "Planlandı" : status === "iptal" ? "İptal" : "Tamamlandı";
}

function statusClass(status: Appointment["status"]) {
  if (status === "iptal") return "user-chip iptal";
  if (status === "tamamlandi") return "user-chip tamamlandi";
  return "user-chip devam";
}

function clock(date: Date) {
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAppointments(readAppointments()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    return {
      upcoming: appointments.filter((item) => item.status === "planlandi" && new Date(item.end) >= now).sort((a, b) => +new Date(a.start) - +new Date(b.start)),
      past: appointments.filter((item) => item.status !== "planlandi" || new Date(item.end) < now).sort((a, b) => +new Date(b.start) - +new Date(a.start)),
    };
  }, [appointments]);

  const pool = tab === "upcoming" ? upcoming : past;
  const needle = query.trim().toLocaleLowerCase("tr-TR");
  const visible = needle
    ? pool.filter((item) => `${item.title} ${item.customer} ${item.assignee} ${item.id} ${item.description}`.toLocaleLowerCase("tr-TR").includes(needle))
    : pool;

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Randevular <span>{appointments.length}</span></h1>
            <p>Yaklaşan ve geçmiş görüşmeler. Satıra girince randevu açılır.</p>
          </div>
          <Link className="orders-create" href="/admin/randevular/ekle"><PlusIcon />Yeni randevu</Link>
        </header>

        <section className="fav-card" aria-label="Randevu listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık, müşteri, kişi veya ID ara" aria-label="Randevularda ara" />
          </label>
          <div className="role-heads" role="tablist" aria-label="Randevu durumu">
            <button type="button" role="tab" aria-selected={tab === "upcoming"} className={tab === "upcoming" ? "on" : ""} onClick={() => setTab("upcoming")}>Yaklaşan <span>{upcoming.length}</span></button>
            <button type="button" role="tab" aria-selected={tab === "past"} className={tab === "past" ? "on" : ""} onClick={() => setTab("past")}>Geçmiş <span>{past.length}</span></button>
          </div>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{needle ? "Eşleşen randevu yok" : "Bu bölümde randevu yok"}</strong>
              <p>{needle ? "Aramayı değiştirin." : "Yeni bir görüşme planladığınızda tarih ve katılımcı bilgileri burada görünecek."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((record) => {
                const start = new Date(record.start);
                const end = new Date(record.end);
                const month = start.toLocaleDateString("tr-TR", { month: "short" }).replace(".", "");
                return (
                  <li key={record.id}>
                    <div className="appt-row">
                      <Link href={`/admin/randevular/${record.id}`}>
                        <span className="appt-day"><strong>{String(start.getDate()).padStart(2, "0")}</strong><small>{month}</small></span>
                        <span className="fav-copy">
                          <strong>{record.title}</strong>
                          <small className="mtpl-snippet">{clock(start)} – {clock(end)} · {record.customer} · {record.assignee}</small>
                        </span>
                        <span className={statusClass(record.status)}>{statusLabel(record.status)}</span>
                        <Caret />
                      </Link>
                      <a className="appt-meet-btn" href={MEET_URL} target="_blank" rel="noopener noreferrer">
                        <MeetIcon />Meet
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
