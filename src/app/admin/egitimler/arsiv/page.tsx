"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { SystemDropdown } from "../../../components/SystemDropdown";

type ArchiveStatus = "cancelled" | "completed" | "expired";
type Filter = "all" | ArchiveStatus;

type ArchiveRecord = { code: string; student: string; email: string; education: string; registeredAt: string; period: string; status: ArchiveStatus; price: number };

const records: ArchiveRecord[] = [
  { code: "TR180914002", student: "Çağrı Gümüşkaptan", email: "cagri.g@example.com", education: "Modül 1", registeredAt: "14.09.2018 · 11:14", period: "01.01.2016 — 14.01.2022", status: "cancelled", price: 550 },
  { code: "TR180626001", student: "Figen Çavuşoğlu", email: "figen.c@example.com", education: "Modül 2", registeredAt: "26.06.2018 · 09:37", period: "01.01.2016 — 14.02.2022", status: "cancelled", price: 500 },
  { code: "TR170623003", student: "Aslı Kurtgöz", email: "asli.k@example.com", education: "Modül 1", registeredAt: "23.06.2017 · 17:04", period: "01.01.2016 — 14.01.2022", status: "completed", price: 500 },
  { code: "TR181221009", student: "Melek Ertürk Yavuz", email: "melek.e@example.com", education: "Modül 2", registeredAt: "21.12.2018 · 19:14", period: "01.01.2016 — 14.01.2022", status: "cancelled", price: 650 },
  { code: "TR180504005", student: "Doğan Kahraman", email: "dogan.k@example.com", education: "Modül 1", registeredAt: "04.05.2018 · 20:57", period: "01.01.2016 — 14.01.2022", status: "cancelled", price: 500 },
  { code: "TR180626005", student: "Elçin İnceoğlu", email: "elcin.i@example.com", education: "Modül 5", registeredAt: "26.06.2018 · 17:07", period: "21.02.2022 — 21.08.2022", status: "expired", price: 600 },
  { code: "TR180506001", student: "Fatih Nazmi Yaman", email: "fatih.y@example.com", education: "Modül 1", registeredAt: "06.05.2018 · 21:23", period: "01.01.2016 — 14.01.2022", status: "expired", price: 1000 },
  { code: "TR180629001", student: "Güven Soner", email: "guven.s@example.com", education: "Modül 2", registeredAt: "29.06.2018 · 11:57", period: "01.01.2016 — 14.02.2022", status: "cancelled", price: 500 },
  { code: "TR180629002", student: "Özge Öz", email: "ozge.o@example.com", education: "Modül 2", registeredAt: "29.06.2018 · 11:57", period: "01.01.2016 — 14.02.2022", status: "completed", price: 500 },
  { code: "TR180831021", student: "Özgür Çalkın", email: "ozgur.c@example.com", education: "Modül 1", registeredAt: "31.08.2018 · 14:47", period: "01.01.2016 — 14.01.2022", status: "expired", price: 700 },
];

const statusMeta: Record<ArchiveStatus, { label: string; detail: string }> = {
  cancelled: { label: "İptal edildi", detail: "Kayıt kapatıldı" },
  completed: { label: "Tamamlandı", detail: "Ödeme yapıldı" },
  expired: { label: "Erişim sona erdi", detail: "Süre tamamlandı" },
};

const tabs: { key: Filter; label: string }[] = [{ key: "all", label: "Tüm kayıtlar" }, { key: "cancelled", label: "İptal edilen" }, { key: "completed", label: "Tamamlanan" }, { key: "expired", label: "Süresi dolan" }];
const money = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export default function EducationArchivePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [education, setEducation] = useState("all");
  const [restore, setRestore] = useState<ArchiveRecord | null>(null);
  const educationOptions = useMemo(() => Array.from(new Set(records.map(item => item.education))), []);
  const counts = useMemo(() => ({ all: records.length, cancelled: records.filter(item => item.status === "cancelled").length, completed: records.filter(item => item.status === "completed").length, expired: records.filter(item => item.status === "expired").length }), []);
  const visible = useMemo(() => { const normalized = query.trim().toLocaleLowerCase("tr"); return records.filter(item => (filter === "all" || item.status === filter) && (education === "all" || item.education === education) && (!normalized || [item.code, item.student, item.email, item.education].some(value => value.toLocaleLowerCase("tr").includes(normalized)))); }, [education, filter, query]);

  return <AdminShell><div className="education-archive-page">
    <header className="orders-hero admin-education-hero"><div><p className="eyebrow">EĞİTİM YÖNETİMİ</p><h1>Eğitim Arşivi</h1><p>İptal edilen, tamamlanan veya erişim süresi sona eren eğitim kayıtlarını görüntüleyin.</p></div><div className="admin-education-summary" aria-label="Eğitim arşivi özeti"><span><strong>{counts.all}</strong><small>arşiv kaydı</small></span><span><strong>{counts.cancelled}</strong><small>iptal edildi</small></span><span><strong>{counts.expired}</strong><small>süresi doldu</small></span></div></header>
    <nav className="order-tabs admin-education-tabs" aria-label="Arşiv durumları">{tabs.map(tab => <button key={tab.key} className={filter === tab.key ? "active" : ""} onClick={() => setFilter(tab.key)}>{tab.label}<span>{counts[tab.key]}</span></button>)}</nav>
    <section className="orders-toolbar admin-education-toolbar"><label className="orders-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Sipariş kodu, kursiyer veya eğitim ara…"/></label><label className="admin-education-select"><span>Eğitim</span><SystemDropdown ariaLabel="Eğitim filtresi" value={education} onChange={setEducation} options={[{ value: "all", label: "Tüm eğitimler" }, ...educationOptions.map(option => ({ value: option, label: option }))]} /></label><span className="result-count">{visible.length} kayıt gösteriliyor</span></section>
    <section className="education-archive-list"><header><div><p className="eyebrow">ARŞİVLENEN KAYITLAR</p><h2>Eğitim geçmişi</h2></div><span>Kayıtlar salt okunur olarak saklanır</span></header><div className="education-archive-scroll"><div className="education-archive-head"><span>Kayıt</span><span>Kursiyer</span><span>Eğitim</span><span>Kayıt tarihi</span><span>Başlangıç ve bitiş</span><span>Durum</span><span>Ücret</span><span>İşlem</span></div>{visible.length ? visible.map(item => <article className="education-archive-row" key={item.code}>
      <div className="education-registration"><span>EDU</span><div><strong>{item.code}</strong><small>Arşiv kaydı</small></div></div><div className="education-student"><strong>{item.student}</strong><small>{item.email}</small></div><div className="education-name"><strong>{item.education}</strong><small>Kendi hızında eğitim</small></div><time>{item.registeredAt}</time><span className="education-access-period">{item.period}</span><div className={`education-request-status ${item.status}`}><i/><div><strong>{statusMeta[item.status].label}</strong><small>{statusMeta[item.status].detail}</small></div></div><strong className="education-price">{money.format(item.price)}</strong><div className="education-archive-actions"><Link href={`/admin/egitimler/satin-alinan/${item.code}`} aria-label={`${item.code} kaydını görüntüle`}>Görüntüle</Link><button onClick={() => setRestore(item)} aria-label={`${item.code} kaydını arşivden çıkar`}>↺</button></div>
    </article>) : <div className="orders-empty">Filtrelerle eşleşen arşiv kaydı bulunamadı.</div>}</div></section>
    {restore && <div className="dm-backdrop" role="presentation" onMouseDown={() => setRestore(null)}><section className="dm-modal education-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="restore-title" onMouseDown={event => event.stopPropagation()}><header className="dm-header"><div><p className="eyebrow">ARŞİV İŞLEMİ</p><h2 id="restore-title">Kaydı arşivden çıkar</h2></div><button className="dm-close-btn" onClick={() => setRestore(null)} aria-label="Kapat">×</button></header><div className="dm-body"><p><strong>{restore.code}</strong> numaralı {restore.education} kaydı yeniden aktif eğitim kayıtları listesine taşınacak.</p><p>Bu işlem eğitim erişimini otomatik olarak açmaz; erişim durumunu kayıt detayından ayrıca yönetebilirsiniz.</p></div><footer className="dm-footer"><button className="dm-btn secondary" onClick={() => setRestore(null)}>Vazgeç</button><button className="dm-btn primary" onClick={() => setRestore(null)}>Arşivden çıkar</button></footer></section></div>}
  </div></AdminShell>;
}
