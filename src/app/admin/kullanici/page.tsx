"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminShell } from "../AdminShell";

type Tab = "reports" | "orders" | "education" | "activity" | "financials";
type IconName = "file" | "plus" | "user";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
  );
}

const TABS: { key: Tab; label: string }[] = [
  { key: "reports",    label: "Raporlar" },
  { key: "orders",     label: "Siparişler" },
  { key: "education",  label: "Eğitim Talepleri" },
  { key: "activity",   label: "Aktivite Günlüğü" },
  { key: "financials", label: "Cari Hareketler" },
];

const user = {
  name: "KEREM MURAT",
  type: "Bireysel Kullanıcı",
  gsm: "5332509720",
  email: "keremmurat6155@gmail.com",
  university: "ONDOKUZ MAYIS ÜNİVERSİTESİ",
  faculty: "MÜHENDİSLİK FAKÜLTESİ",
  department: "ENDÜSTRİ MÜHENDİSLİĞİ BÖLÜMÜ",
  city: "Samsun – İlkadım",
  address: "Atakum Mah. Ordu Cad. No:5",
};

const reportStats = [
  { label: "Toplam Sipariş Adeti",    value: "1 adet sipariş vermiştir" },
  { label: "Minimum Ödeme",           value: "0,0 TL" },
  { label: "Maksimum Ödeme",          value: "0,0 TL" },
  { label: "Ek Analiz İsteği Sayısı", value: "0 adet ek analiz isteği mevcuttur" },
  { label: "Yazışma Sayısı",          value: "SA260731010; Kullanıcı(1) — Yönetim(0)" },
  { label: "Ortalama Ücret",          value: "0 TL" },
  { label: "Ortanca Ücret",           value: "0 TL" },
];

const orders = [
  { id: 1, title: "Kerem Murat Deneme", code: "SA260731010", status: "Sipariş verildi", fee: "0,0", createdAt: "31/07/2026 16:26" },
];

const educationRequests = [
  { id: 1, code: "TR260113003", status: "İptal edildi",   createdAt: "13/01/2026 12:00" },
  { id: 2, code: "TR250903004", status: "Ödeme yapıldı.", createdAt: "03/09/2025 09:51" },
];

const activityLog = [
  { v: 37, time: "15/01/2026 13:18", actor: "Sistem", name: "KEREM MURAT", email: "keremmurat6155@gmail.com", phone: "5332509720", status: "true", count: 26, loginAt: "15.01.2026 10:18", ip: "176.40.240.242",                          lastLogin: "13.01.2026 10:00" },
  { v: 38, time: "18/02/2026 14:26", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 27, loginAt: "18.02.2026 11:26", ip: "176.40.241.165",                          lastLogin: "15.01.2026 10:01" },
  { v: 39, time: "24/03/2026 20:32", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 28, loginAt: "24.03.2026 17:32", ip: "2a00:1d34:d021:4800:95c3:567d:ed80:fdc9", lastLogin: "18.02.2026 11:22" },
  { v: 40, time: "14/04/2026 14:16", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 29, loginAt: "14.04.2026 11:16", ip: "176.40.241.242",                          lastLogin: "24.03.2026 17:35" },
  { v: 41, time: "12/05/2026 17:08", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 30, loginAt: "12.05.2026 14:08", ip: "176.40.242.209",                          lastLogin: "14.04.2026 11:11" },
  { v: 42, time: "21/07/2026 21:57", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 31, loginAt: "21.07.2026 18:57", ip: "104.23.172.133",                          lastLogin: "12.05.2026 14:09" },
  { v: 43, time: "31/07/2026 01:11", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 32, loginAt: "30.07.2026 22:11", ip: "104.23.172.133",                          lastLogin: "21.07.2026 21:00" },
  { v: 44, time: "31/07/2026 10:03", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 33, loginAt: "31.07.2026 07:03", ip: "176.40.240.242",                          lastLogin: "30.07.2026 22:11" },
  { v: 45, time: "31/07/2026 11:56", actor: "Sistem", name: "—",           email: "—",                       phone: "—",           status: "—",    count: 33, loginAt: "31.07.2026 07:03", ip: "176.40.240.242",                          lastLogin: "31.07.2026 07:03" },
];

function ReportsTab() {
  return (
    <div className="ur-stats">
      {reportStats.map((s) => (
        <div key={s.label} className="ur-stat-row">
          <span className="ur-stat-label">{s.label}</span>
          <span className="ur-stat-value">{s.value}</span>
        </div>
      ))}
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="ur-table-wrap">
      <table className="ur-table">
        <thead>
          <tr><th>ID</th><th>Başlık</th><th>Kod</th><th>Durumu</th><th>Ücret</th><th>Oluşturulma Zamanı</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td><Link href="/admin/siparisler/DS260723008" style={{ color: "var(--blue)", fontWeight: 800 }}>{o.title}</Link></td>
              <td style={{ color: "var(--blue)" }}>{o.code}</td>
              <td>{o.status}</td>
              <td>{o.fee}</td>
              <td>{o.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EducationTab() {
  return (
    <div className="ur-table-wrap">
      <table className="ur-table">
        <thead>
          <tr><th>ID</th><th>Kod</th><th>Durumu</th><th>Oluşturulma Zamanı</th></tr>
        </thead>
        <tbody>
          {educationRequests.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td style={{ color: "var(--blue)" }}>{e.code}</td>
              <td>{e.status}</td>
              <td>{e.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityTab() {
  return (
    <div className="ur-table-wrap">
      <table className="ur-table">
        <thead>
          <tr>
            <th>Versiyon</th>
            <th>İşlem Zamanı</th>
            <th>İşlemi Yapan</th>
            <th>Adı Soyadı</th>
            <th>E-posta</th>
            <th>Telefon/GSM</th>
            <th>Durum</th>
            <th>Giriş Sayısı</th>
            <th>Sisteme Giriş Zamanı</th>
            <th>IP</th>
            <th>Son Giriş Zamanı</th>
          </tr>
        </thead>
        <tbody>
          {activityLog.map((a) => (
            <tr key={a.v}>
              <td style={{ textAlign: "center" }}>{a.v}</td>
              <td>{a.time}</td>
              <td>{a.actor}</td>
              <td style={{ color: a.name !== "—" ? "var(--blue)" : undefined }}>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.phone}</td>
              <td>{a.status}</td>
              <td style={{ textAlign: "center" }}>{a.count}</td>
              <td>{a.loginAt}</td>
              <td className="ur-ip">{a.ip}</td>
              <td>{a.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FinancialsTab() {
  return (
    <div>
      <div className="ur-cari-toolbar">
        <button className="ur-add-btn"><Icon name="plus" size={14} /> Ekle</button>
        <div className="ur-balance">
          <strong>Proje Bakiyesi: 0 TL</strong>
          <span>(+: Kullanıcı fazla ödeme yapmış) (−: Kullanıcının ödeyeceği tutar)</span>
        </div>
      </div>
      <div className="ur-table-wrap">
        <table className="ur-table">
          <thead>
            <tr><th>İşlem ID</th><th>Proje Adı</th><th>Sipariş Kodu</th><th>Birim</th><th>Tutar</th><th>Tarih</th></tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="ur-empty">Henüz cari hareket bulunmuyor.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function KullaniciRaporuPage() {
  const [tab, setTab] = useState<Tab>("reports");

  return (
    <AdminShell>
      <div className="ur-page">
        <div className="ur-page-header">
          <h1 className="ur-page-title">Kullanıcı Raporu</h1>
        </div>

        <div className="ur-layout">
          {/* Sol — kullanıcı kartı */}
          <aside className="ur-card">
            <div className="ur-avatar">
              <Icon name="user" size={40} />
            </div>
            <h2 className="ur-card-name">{user.name}</h2>
            <p className="ur-card-type">{user.type}</p>
            <div className="ur-info">
              <div className="ur-info-row"><span className="ur-info-key">GSM:</span><span className="ur-info-val">{user.gsm}</span></div>
              <div className="ur-info-row"><span className="ur-info-key">Üniversite:</span><span className="ur-info-val">{user.university}</span></div>
              <div className="ur-info-row"><span className="ur-info-key">Fakülte:</span><span className="ur-info-val">{user.faculty}</span></div>
              <div className="ur-info-row"><span className="ur-info-key">Bölüm:</span><span className="ur-info-val">{user.department}</span></div>
              <div className="ur-info-row"><span className="ur-info-key">İl – İlçe:</span><span className="ur-info-val">{user.city}</span></div>
              <div className="ur-info-row"><span className="ur-info-key">Adres:</span><span className="ur-info-val">{user.address}</span></div>
            </div>
          </aside>

          {/* Sağ — sekmeli içerik */}
          <section className="ur-detail">
            <nav className="ur-tabs" aria-label="Kullanıcı sekmeleri">
              {TABS.map((t) => (
                <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </nav>
            <div className="ur-tab-body">
              {tab === "reports"    && <ReportsTab />}
              {tab === "orders"     && <OrdersTab />}
              {tab === "education"  && <EducationTab />}
              {tab === "activity"   && <ActivityTab />}
              {tab === "financials" && <FinancialsTab />}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
