"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { DatePicker } from "../../../components/DatePicker";
import { SystemDropdown } from "../../../components/SystemDropdown";
import { TimePicker } from "../../../components/TimePicker";
import { assigneeOptions, customerOptions, parseAppointmentDate, readAppointments, writeAppointments } from "../appointmentData";

type IconName = "back" | "calendar" | "save" | "info";
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AddAppointmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const customer = customerOptions.find(item => item.value === customerId);
    const assignee = assigneeOptions.find(item => item.value === assigneeId);
    const start = parseAppointmentDate(startDate, startTime);
    const end = parseAppointmentDate(endDate, endTime);
    if (!title.trim() || !customer || !assignee || !start || !end) return setError("Başlık, müşteri, atanan kişi, başlangıç ve bitiş bilgileri zorunludur.");
    if (end <= start) return setError("Bitiş zamanı başlangıç zamanından sonra olmalıdır.");
    writeAppointments([...readAppointments(), {
      id: `RDV-${Date.now()}`,
      title: title.trim(), customerId, customer: customer.label, assigneeId, assignee: assignee.label,
      start: start.toISOString(), end: end.toISOString(), description: description.trim(), status: "planlandi",
    }]);
    router.push("/admin/randevular");
  }

  return <AdminShell><form className="st-page appointment-create-page" onSubmit={submit}>
    <header className="favorite-category-create-header"><Link className="back-link" href="/admin/randevular"><Icon name="back" size={16} />Randevulara dön</Link><h1>Yeni randevu</h1></header>
    <div className="appointment-create-layout">
      <section className="detail-panel appointment-form-panel">
        <div className="service-form-section-heading"><span><Icon name="calendar" size={16} /></span><strong>Randevu bilgileri</strong></div>
        <div className="settings-panel-body">
          <div className="form-field"><label htmlFor="appointment-title">Başlık <em>*</em></label><input id="appointment-title" value={title} onChange={event => { setTitle(event.target.value); setError(""); }} placeholder="Örn. Tez veri analizi kapsam görüşmesi" autoFocus /></div>
          <div className="form-grid">
            <div className="form-field"><label>Müşteri <em>*</em></label><SystemDropdown value={customerId} onChange={value => { setCustomerId(value); setError(""); }} placeholder="Müşteri seçin" ariaLabel="Randevu müşterisi" options={customerOptions} /></div>
            <div className="form-field"><label>Atanan kişi <em>*</em></label><SystemDropdown value={assigneeId} onChange={value => { setAssigneeId(value); setError(""); }} placeholder="Ekip üyesi seçin" ariaLabel="Randevuya atanan kişi" options={assigneeOptions} /></div>
          </div>
          <div className="form-grid appointment-datetime-grid">
            <fieldset><legend>Başlangıç <em>*</em></legend><div><DatePicker id="appointment-start-date" value={startDate} onChange={value => { setStartDate(value); setError(""); }} required /><TimePicker id="appointment-start-time" value={startTime} onChange={value => { setStartTime(value); setError(""); }} /></div></fieldset>
            <fieldset><legend>Bitiş <em>*</em></legend><div><DatePicker id="appointment-end-date" value={endDate} onChange={value => { setEndDate(value); setError(""); }} required /><TimePicker id="appointment-end-time" value={endTime} onChange={value => { setEndTime(value); setError(""); }} /></div></fieldset>
          </div>
          <div className="form-field"><label htmlFor="appointment-description">Açıklama</label><textarea id="appointment-description" className="small" value={description} onChange={event => setDescription(event.target.value)} placeholder="Görüşmede ele alınacak konuları ve hazırlık notlarını yazın" /></div>
        </div>
      </section>
      <aside className="detail-panel appointment-actions" aria-label="Randevu işlemleri">
        <div className="appointment-actions-head"><span><Icon name="info" size={16} /></span><div><strong>İşlemler</strong><small>Bilgileri kontrol ederek randevuyu oluşturun.</small></div></div>
        {error && <p className="appointment-error" role="alert">{error}</p>}
        <button className="settings-save" type="submit"><Icon name="save" size={16} />Randevu oluştur</button>
        <Link href="/admin/randevular">Vazgeç</Link>
      </aside>
    </div>
  </form></AdminShell>;
}
