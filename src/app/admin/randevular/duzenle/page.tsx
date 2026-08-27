"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { DatePicker } from "../../../components/DatePicker";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { TimePicker } from "../../../components/TimePicker";
import { Appointment, AppointmentStatus, assigneeOptions, customerOptions, parseAppointmentDate, readAppointments, writeAppointments } from "../appointmentData";

type IconName = "back" | "calendar" | "save" | "info" | "video" | "refresh";
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
    refresh: <><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const statusOptions = [
  { value: "planlandi", label: "Planlandı" },
  { value: "tamamlandi", label: "Tamamlandı" },
  { value: "iptal", label: "İptal" },
];

function isoToDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}
function isoToTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function EditForm() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";

  // useSearchParams + Suspense bu bileşeni istemci tarafında render eder; localStorage'ı doğrudan
  // lazy-init ile okumak güvenlidir (SSR'de Suspense fallback görünür, hydration uyumsuzluğu olmaz).
  const [record] = useState<Appointment | null>(() => readAppointments().find(item => item.id === id) ?? null);

  const [title, setTitle] = useState(record?.title ?? "");
  const [customerId, setCustomerId] = useState(record?.customerId ?? "");
  const [assigneeId, setAssigneeId] = useState(record?.assigneeId ?? "");
  const [startDate, setStartDate] = useState(record ? isoToDate(record.start) : "");
  const [startTime, setStartTime] = useState(record ? isoToTime(record.start) : "");
  const [endDate, setEndDate] = useState(record ? isoToDate(record.end) : "");
  const [endTime, setEndTime] = useState(record ? isoToTime(record.end) : "");
  const [status, setStatus] = useState<AppointmentStatus>(record?.status ?? "planlandi");
  const [description, setDescription] = useState(record?.description ?? "");
  const [error, setError] = useState("");
  const [meetRefreshed, setMeetRefreshed] = useState(false);
  const notFound = !record;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record) return;
    const customer = customerOptions.find(item => item.value === customerId);
    const assignee = assigneeOptions.find(item => item.value === assigneeId);
    const start = parseAppointmentDate(startDate, startTime);
    const end = parseAppointmentDate(endDate, endTime);
    if (!title.trim() || !customer || !assignee || !start || !end) return setError("Başlık, müşteri, atanan kişi, başlangıç ve bitiş bilgileri zorunludur.");
    if (end <= start) return setError("Bitiş zamanı başlangıç zamanından sonra olmalıdır.");
    const next = readAppointments().map(item => item.id === record.id ? {
      ...item,
      title: title.trim(), customerId, customer: customer.label, assigneeId, assignee: assignee.label,
      start: start.toISOString(), end: end.toISOString(), description: description.trim(), status,
    } : item);
    writeAppointments(next);
    router.push("/admin/randevular");
  }

  if (notFound) return (
    <div className="st-page appointment-create-page">
      <header className="favorite-category-create-header"><Link className="back-link" href="/admin/randevular"><Icon name="back" size={16} />Randevulara dön</Link><h1>Randevuyu Düzenle</h1></header>
      <section className="detail-panel"><div className="settings-panel-body"><p style={{ color: "var(--muted)", fontSize: ".72rem" }}>Randevu bulunamadı.</p></div></section>
    </div>
  );

  return (
    <form className="st-page appointment-create-page" onSubmit={submit}>
      <header className="favorite-category-create-header"><Link className="back-link" href="/admin/randevular"><Icon name="back" size={16} />Randevulara dön</Link><h1>Randevuyu Düzenle</h1></header>
      <div className="appointment-create-layout">
        <section className="detail-panel appointment-form-panel">
          <div className="service-form-section-heading"><span><Icon name="calendar" size={16} /></span><strong>Randevu bilgileri</strong></div>
          <div className="settings-panel-body">
            <div className="form-field"><label htmlFor="appointment-title">Başlık <em>*</em></label><input id="appointment-title" value={title} onChange={event => { setTitle(event.target.value); setError(""); }} /></div>
            <div className="form-grid">
              <div className="form-field"><label>Müşteri <em>*</em></label><SystemDropdown value={customerId} onChange={value => { setCustomerId(value); setError(""); }} placeholder="Müşteri seçin" ariaLabel="Randevu müşterisi" options={customerOptions} searchable searchPlaceholder="Müşteri ara…" /></div>
              <div className="form-field"><label>Atanan kişi <em>*</em></label><SystemDropdown value={assigneeId} onChange={value => { setAssigneeId(value); setError(""); }} placeholder="Ekip üyesi seçin" ariaLabel="Randevuya atanan kişi" options={assigneeOptions} searchable searchPlaceholder="Kişi ara…" /></div>
            </div>
            <div className="form-grid appointment-datetime-grid">
              <fieldset><legend>Başlangıç <em>*</em></legend><div><DatePicker id="appointment-start-date" value={startDate} onChange={value => { setStartDate(value); setError(""); }} required /><TimePicker id="appointment-start-time" value={startTime} onChange={value => { setStartTime(value); setError(""); }} /></div></fieldset>
              <fieldset><legend>Bitiş <em>*</em></legend><div><DatePicker id="appointment-end-date" value={endDate} onChange={value => { setEndDate(value); setError(""); }} required /><TimePicker id="appointment-end-time" value={endTime} onChange={value => { setEndTime(value); setError(""); }} /></div></fieldset>
            </div>
            <div className="form-field"><label>Durum</label><SystemDropdown value={status} onChange={value => setStatus(value as AppointmentStatus)} ariaLabel="Randevu durumu" options={statusOptions} /></div>
            <div className="form-field"><label htmlFor="appointment-description">Açıklama</label><textarea id="appointment-description" className="small" value={description} onChange={event => setDescription(event.target.value)} placeholder="Randevu açıklaması…" /></div>
          </div>
        </section>
        <aside className="detail-panel appointment-actions" aria-label="Randevu işlemleri">
          <div className="appointment-actions-head"><span><Icon name="info" size={16} /></span><div><strong>İşlemler</strong><small>Değişiklikleri kontrol ederek güncelleyin.</small></div></div>
          {error && <p className="appointment-error" role="alert">{error}</p>}
          <button className="settings-save" type="submit"><Icon name="save" size={16} />Güncelle</button>
          <Link href="/admin/randevular">Vazgeç</Link>
          <div className="appointment-meet-box">
            <p>Google Meet</p>
            <a className="appointment-meet-btn" href="https://meet.google.com/" target="_blank" rel="noopener noreferrer"><Icon name="video" size={14} />Meet Linkine Git</a>
            <button type="button" className="appointment-meet-refresh" onClick={() => { setMeetRefreshed(true); setTimeout(() => setMeetRefreshed(false), 2000); }}>
              <Icon name="refresh" size={14} />{meetRefreshed ? "Yenilendi" : "Yenile"}
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}

export default function EditAppointmentPage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditForm />
      </Suspense>
    </AdminShell>
  );
}
