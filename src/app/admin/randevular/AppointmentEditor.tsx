"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { DatePicker } from "../../components/DatePicker";
import { SystemDropdown } from "../../components/SystemDropdown";
import { TimePicker } from "../../components/TimePicker";
import { Appointment, AppointmentStatus, assigneeOptions, customerOptions, parseAppointmentDate } from "./appointmentData";

const STATUS_OPTIONS = [
  { value: "planlandi", label: "Planlandı" },
  { value: "tamamlandi", label: "Tamamlandı" },
  { value: "iptal", label: "İptal" },
];

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  calendar: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48ZM208,208H48V96H208V208Z",
  video: "M164,72V184a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H156A8,8,0,0,1,164,72Zm68.16,1.83a8,8,0,0,0-8.16,0l-40,24A8,8,0,0,0,180,104v48a8,8,0,0,0,4,6.93l40,24a8,8,0,0,0,12-6.93V80A8,8,0,0,0,232.16,73.83Z",
  refresh: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16h28.69L189.23,72.57a80,80,0,1,0,1.67,114.78,8,8,0,0,1,11,11.64,96,96,0,1,1-2-137.4L224,84.69V56a8,8,0,0,1,16,0Z",
} as const;

export type AppointmentDraft = {
  title: string;
  customerId: string;
  assigneeId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  status: AppointmentStatus;
};

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function isoToDate(iso: string) {
  const date = new Date(iso);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

export function isoToTime(iso: string) {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function statusLabel(status: AppointmentStatus) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? "Planlandı";
}

function statusClass(status: AppointmentStatus) {
  if (status === "iptal") return "user-chip iptal";
  if (status === "tamamlandi") return "user-chip tamamlandi";
  return "user-chip devam";
}

export function AppointmentEditor({
  initial,
  basePath,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Appointment;
  basePath: string;
  submitLabel: string;
  onSubmit: (value: AppointmentDraft) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [customerId, setCustomerId] = useState(initial?.customerId ?? "");
  const [assigneeId, setAssigneeId] = useState(initial?.assigneeId ?? "");
  const [startDate, setStartDate] = useState(initial ? isoToDate(initial.start) : "");
  const [startTime, setStartTime] = useState(initial ? isoToTime(initial.start) : "");
  const [endDate, setEndDate] = useState(initial ? isoToDate(initial.end) : "");
  const [endTime, setEndTime] = useState(initial ? isoToTime(initial.end) : "");
  const [status, setStatus] = useState<AppointmentStatus>(initial?.status ?? "planlandi");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [meetRefreshed, setMeetRefreshed] = useState(false);

  const customer = customerOptions.find((item) => item.value === customerId)?.label ?? "Seçilmedi";
  const assignee = assigneeOptions.find((item) => item.value === assigneeId)?.label ?? "Seçilmedi";
  const when = startTime && endTime ? `${startTime} – ${endTime}` : "—";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const start = parseAppointmentDate(startDate, startTime);
    const end = parseAppointmentDate(endDate, endTime);
    if (!title.trim() || !customerId || !assigneeId || !start || !end) {
      setError("Başlık, müşteri, atanan kişi, başlangıç ve bitiş bilgileri zorunludur.");
      return;
    }
    if (end <= start) {
      setError("Bitiş zamanı başlangıç zamanından sonra olmalıdır.");
      return;
    }
    onSubmit({ title: title.trim(), customerId, assigneeId, startDate, startTime, endDate, endTime, description: description.trim(), status });
  }

  return (
    <div className="fav-page stype-page">
      <Link className="fav-back" href={basePath}><Icon name="back" size={16} />Randevulara dön</Link>
      <form className="stype-layout" onSubmit={submit}>
        <div className="stype-stack">
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="calendar" /></span><h2>Randevu bilgileri</h2></header>
            <label className="stype-field">
              <span>Başlık</span>
              <input value={title} onChange={(event) => { setTitle(event.target.value); setError(""); }} placeholder="Örn. Tez veri analizi kapsam görüşmesi" autoFocus />
            </label>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Müşteri</span>
                <SystemDropdown value={customerId} onChange={(value) => { setCustomerId(value); setError(""); }} placeholder="Müşteri seçin" ariaLabel="Randevu müşterisi" searchable searchPlaceholder="Müşteri ara…" options={customerOptions} />
              </label>
              <label className="stype-field">
                <span>Atanan kişi</span>
                <SystemDropdown value={assigneeId} onChange={(value) => { setAssigneeId(value); setError(""); }} placeholder="Ekip üyesi seçin" ariaLabel="Randevuya atanan kişi" searchable searchPlaceholder="Kişi ara…" options={assigneeOptions} />
              </label>
            </div>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Başlangıç</span>
                <div className="appt-when">
                  <DatePicker id="appointment-start-date" value={startDate} onChange={(value) => { setStartDate(value); setError(""); }} />
                  <TimePicker id="appointment-start-time" value={startTime} onChange={(value) => { setStartTime(value); setError(""); }} />
                </div>
              </label>
              <label className="stype-field">
                <span>Bitiş</span>
                <div className="appt-when">
                  <DatePicker id="appointment-end-date" value={endDate} onChange={(value) => { setEndDate(value); setError(""); }} />
                  <TimePicker id="appointment-end-time" value={endTime} onChange={(value) => { setEndTime(value); setError(""); }} />
                </div>
              </label>
            </div>
            {initial && (
              <label className="stype-field">
                <span>Durum</span>
                <SystemDropdown value={status} onChange={(value) => setStatus(value as AppointmentStatus)} ariaLabel="Randevu durumu" options={STATUS_OPTIONS} />
              </label>
            )}
            <label className="stype-field">
              <span>Açıklama</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Görüşmede ele alınacak konuları ve hazırlık notlarını yazın" />
            </label>
          </section>
          <div className="fav-actions">
            {error && <p role="alert">{error}</p>}
            {onCancel && status !== "iptal" && (confirming ? (
              <>
                <p>Bu işlem geri alınamaz.</p>
                <button className="user-cancel" type="button" onClick={() => setConfirming(false)}>Vazgeç</button>
                <button className="fav-delete" type="button" onClick={onCancel}>Evet, iptal et</button>
              </>
            ) : <button className="fav-delete" type="button" onClick={() => setConfirming(true)}>Randevuyu iptal et</button>)}
            <button className="fav-save" type="submit">{submitLabel}</button>
          </div>
        </div>

        <aside className="fav-card acct-summary" aria-label="Randevu özeti">
          <header><span className="fav-mark"><Icon name="calendar" /></span><h2>Özet</h2></header>
          <span className={statusClass(status)}>{statusLabel(status)}</span>
          <p className="acct-figure">{when}</p>
          <dl className="acct-rows">
            <div><dt>Başlık</dt><dd className="wrap">{title.trim() || "Başlık"}</dd></div>
            <div><dt>Müşteri</dt><dd>{customer}</dd></div>
            <div><dt>Atanan</dt><dd>{assignee}</dd></div>
            <div><dt>Tarih</dt><dd>{startDate || "—"}</dd></div>
          </dl>
          <p className="llist-empty">{description.trim() || "Açıklama burada görünecek."}</p>
          {initial && (
            <div className="appt-meet">
              <a href="https://meet.google.com/" target="_blank" rel="noopener noreferrer"><Icon name="video" size={16} />Meet linkine git</a>
              <button type="button" onClick={() => { setMeetRefreshed(true); window.setTimeout(() => setMeetRefreshed(false), 2000); }}>
                <Icon name="refresh" size={16} />{meetRefreshed ? "Yenilendi" : "Yenile"}
              </button>
            </div>
          )}
        </aside>
      </form>
    </div>
  );
}
