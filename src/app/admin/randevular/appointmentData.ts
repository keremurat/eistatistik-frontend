export type AppointmentStatus = "planlandi" | "tamamlandi" | "iptal";

export type Appointment = {
  id: string;
  title: string;
  customerId: string;
  customer: string;
  assigneeId: string;
  assignee: string;
  start: string;
  end: string;
  description: string;
  status: AppointmentStatus;
};

export const APPOINTMENTS_STORAGE_KEY = "eistatistik.admin.appointments.v1";

export const customerOptions = [
  { value: "kerem-murat", label: "Kerem Murat" },
  { value: "yesim-yaptirmis", label: "Yeşim Yaptırmış" },
  { value: "e-yonetim", label: "E Yönetim" },
  { value: "ayse-kaya", label: "Ayşe Kaya" },
  { value: "mehmet-arslan", label: "Mehmet Arslan" },
];

export const assigneeOptions = [
  { value: "naci-murat", label: "Naci Murat" },
  { value: "rabia-aktas", label: "Rabia Aktaş" },
  { value: "fatih-akar", label: "Fatih Akar" },
  { value: "aliihsan-sukur", label: "Aliihsan Şükür" },
  { value: "genel-analizor", label: "eistatistik Genel Analizör" },
];

export const defaultAppointments: Appointment[] = [
  { id: "RDV-2401", title: "Tez veri analizi kapsam görüşmesi", customerId: "kerem-murat", customer: "Kerem Murat", assigneeId: "naci-murat", assignee: "Naci Murat", start: "2026-07-28T14:30:00", end: "2026-07-28T15:00:00", description: "Analiz kapsamı ve teslimat planı görüşüldü.", status: "tamamlandi" },
  { id: "RDV-2402", title: "Power analizi ön değerlendirme", customerId: "yesim-yaptirmis", customer: "Yeşim Yaptırmış", assigneeId: "rabia-aktas", assignee: "Rabia Aktaş", start: "2026-07-24T11:00:00", end: "2026-07-24T11:30:00", description: "Örneklem ve etki büyüklüğü bilgileri değerlendirildi.", status: "tamamlandi" },
  { id: "RDV-2403", title: "Online mentörlük görüşmesi", customerId: "ayse-kaya", customer: "Ayşe Kaya", assigneeId: "fatih-akar", assignee: "Fatih Akar", start: "2026-07-18T16:00:00", end: "2026-07-18T17:00:00", description: "Araştırma yöntemi ve raporlama planı ele alındı.", status: "tamamlandi" },
  { id: "RDV-2404", title: "Graphical Abstract içerik toplantısı", customerId: "mehmet-arslan", customer: "Mehmet Arslan", assigneeId: "aliihsan-sukur", assignee: "Aliihsan Şükür", start: "2026-07-11T10:00:00", end: "2026-07-11T10:45:00", description: "Görsel anlatı ve teslim dosyaları değerlendirildi.", status: "tamamlandi" },
];

export function readAppointments(): Appointment[] {
  if (typeof window === "undefined") return defaultAppointments;
  try {
    const raw = window.localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) return defaultAppointments;
    const records = JSON.parse(raw) as Appointment[];
    return Array.isArray(records) ? records : defaultAppointments;
  } catch {
    return defaultAppointments;
  }
}

export function writeAppointments(records: Appointment[]) {
  window.localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(records));
}

export function parseAppointmentDate(date: string, time: string) {
  const [day, month, year] = date.split(".").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![day, month, year, hour, minute].every(Number.isFinite)) return null;
  const value = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(value.getTime()) ? null : value;
}
