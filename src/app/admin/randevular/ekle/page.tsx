"use client";

import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { AppointmentDraft, AppointmentEditor } from "../AppointmentEditor";
import { assigneeOptions, customerOptions, parseAppointmentDate, readAppointments, writeAppointments } from "../appointmentData";

export default function AddAppointmentPage() {
  const router = useRouter();
  const toast = useToast();

  function create(value: AppointmentDraft) {
    const customer = customerOptions.find((item) => item.value === value.customerId);
    const assignee = assigneeOptions.find((item) => item.value === value.assigneeId);
    const start = parseAppointmentDate(value.startDate, value.startTime);
    const end = parseAppointmentDate(value.endDate, value.endTime);
    if (!customer || !assignee || !start || !end) return;
    writeAppointments([...readAppointments(), {
      id: `RDV-${Date.now()}`,
      title: value.title,
      customerId: value.customerId,
      customer: customer.label,
      assigneeId: value.assigneeId,
      assignee: assignee.label,
      start: start.toISOString(),
      end: end.toISOString(),
      description: value.description,
      status: "planlandi",
    }]);
    toast.success("Randevu oluşturuldu.");
    router.push("/admin/randevular");
  }

  return (
    <AdminShell>
      <AppointmentEditor basePath="/admin/randevular" submitLabel="Randevu oluştur" onSubmit={create} />
    </AdminShell>
  );
}
