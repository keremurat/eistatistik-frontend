"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { AppointmentDraft, AppointmentEditor, isoToDate, isoToTime } from "../AppointmentEditor";
import { Appointment, assigneeOptions, customerOptions, parseAppointmentDate, readAppointments, writeAppointments } from "../appointmentData";

export default function AppointmentDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <AppointmentDetail id={params.id} />
    </AdminShell>
  );
}

export function AppointmentDetail({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const [item, setItem] = useState<Appointment | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItem(readAppointments().find((record) => record.id === id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  function save(value: AppointmentDraft) {
    if (!item) return;
    const customer = customerOptions.find((option) => option.value === value.customerId);
    const assignee = assigneeOptions.find((option) => option.value === value.assigneeId);
    const start = parseAppointmentDate(value.startDate, value.startTime);
    const end = parseAppointmentDate(value.endDate, value.endTime);
    if (!customer || !assignee || !start || !end) return;
    const sameStart = isoToDate(item.start) === value.startDate && isoToTime(item.start) === value.startTime;
    const sameEnd = isoToDate(item.end) === value.endDate && isoToTime(item.end) === value.endTime;
    const next = readAppointments().map((record) => record.id === item.id ? {
      ...record,
      title: value.title,
      customerId: value.customerId,
      customer: customer.label,
      assigneeId: value.assigneeId,
      assignee: assignee.label,
      start: sameStart ? record.start : start.toISOString(),
      end: sameEnd ? record.end : end.toISOString(),
      description: value.description,
      status: value.status,
    } : record);
    writeAppointments(next);
    toast.success("Randevu güncellendi.");
    router.push("/admin/randevular");
  }

  function cancel() {
    const next = readAppointments().map((record) => record.id === id ? { ...record, status: "iptal" as const } : record);
    writeAppointments(next);
    toast.success("Randevu iptal edildi.");
    setItem(next.find((record) => record.id === id) ?? null);
  }

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Randevu bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href="/admin/randevular">Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <AppointmentEditor key={`${item.id}-${item.status}`} initial={item} basePath="/admin/randevular" submitLabel="Güncelle" onSubmit={save} onCancel={cancel} />;
}
