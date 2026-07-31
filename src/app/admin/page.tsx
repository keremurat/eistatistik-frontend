"use client";

import { useState } from "react";
import { AdminShell, useDataHidden } from "./AdminShell";
import { AreaChart, Donut, Sparkline } from "./charts";

type IconName = "arrow" | "card" | "chevron" | "clock" | "file" | "invoice" | "message" | "orders" | "plus" | "users" | "spark";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    orders: <><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /><path d="M9 12h6M9 16h4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const briefStats = [
  { value: 13, label: "teslim tarihi geçen" },
  { value: 44, label: "teslim tarihi yaklaşan" },
  { value: 1, label: "ücretlendirilecek" },
  { value: 0, label: "havale onayı bekleyen" },
  { value: 0, label: "cevap bekleyen" },
];

const revenue = {
  monthly: { labels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], values: [78, 92, 85, 110, 98, 125, 132, 120, 142, 138, 150, 143], total: "₺142.560", delta: "▲ %8,2" },
  yearly: { labels: ["2021", "2022", "2023", "2024", "2025", "2026"], values: [540, 720, 910, 1180, 1360, 1520], total: "₺1.520.400", delta: "▲ %11,7" },
};

const taskSegments = [
  { label: "Yapılacaklar", value: 12, color: "#132b46" },
  { label: "Yapılıyor", value: 2, color: "#1775a9" },
  { label: "Tamamlananlar", value: 8, color: "#3c8a6b" },
];

const deliveryBars = [
  { label: "Teslim edilecek", value: 1, color: "#3c8a6b" },
  { label: "Tarihi yaklaşan", value: 44, color: "#c98a2e" },
  { label: "Tarihi geçen", value: 13, color: "#c85a51" },
];

const paymentSegments = [
  { label: "Havale / EFT", value: 62, color: "#1775a9" },
  { label: "Kredi kartı", value: 38, color: "#9cc4d8" },
];

const recentOrders: { code: string; customer: string; type: string; amount: string; status: "action" | "active" | "completed"; statusLabel: string }[] = [
  { code: "DS260723008", customer: "Kerem Murat", type: "Güç analizi danışmanlığı", amount: "5.000 TL", status: "action", statusLabel: "Onay bekliyor" },
  { code: "SA260723002", customer: "Ayşe Yıldız", type: "Yüksek lisans tezi analizi", amount: "7.500 TL", status: "active", statusLabel: "Hazırlanıyor" },
  { code: "PA260723007", customer: "Mehmet Demir", type: "Örneklem & power analizi", amount: "3.000 TL", status: "completed", statusLabel: "Teslim edildi" },
  { code: "SA260721005", customer: "Zeynep Kaya", type: "Ölçek güvenilirlik analizi", amount: "4.200 TL", status: "completed", statusLabel: "Teslim edildi" },
  { code: "PR260723006", customer: "Ali Vural", type: "Proforma fatura talebi", amount: "—", status: "active", statusLabel: "İşlemde" },
];

export default function AdminHomePage() {
  return <AdminShell><AdminDashboard /></AdminShell>;
}

function AdminDashboard() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const hidden = useDataHidden();
  const activeRevenue = revenue[period];
  const taskTotal = taskSegments.reduce((sum, segment) => sum + segment.value, 0);
  const completionRate = Math.round((taskSegments[2].value / taskTotal) * 100);
  const deliveryMax = Math.max(...deliveryBars.map((bar) => bar.value));
  const extraFree = 22;
  const extraPaid = 24;
  const extraTotal = extraFree + extraPaid;

  return (
    <>
      <div className="admin-fold">
      <section className="daily-brief admin-brief">
        <div className="brief-copy">
          <p className="eyebrow light">CUMA · 31 TEMMUZ 2026</p>
          <h1>Merhaba, Kerem.</h1>
          <p>{hidden ? "Panel verileri gizlendi. Görüntülemek için üst bardaki göz simgesine dokunun." : <><strong>13 siparişin teslim tarihi geçti</strong>, 44 sipariş için süre yaklaşıyor. Bir teklif de ücretlendirme bekliyor.</>}</p>
        </div>
        <div className="brief-stats" aria-label="Bekleyen işlemler">
          {briefStats.map((stat) => <div key={stat.label}><strong>{hidden ? "•" : stat.value}</strong><span>{stat.label}</span></div>)}
        </div>
        <a className="primary-button" href="/admin/siparisler"><Icon name="orders" size={18} />Sipariş Yönetimi</a>
      </section>

      <section className="admin-grid-2">
        <div className="detail-panel">
          <header className="detail-panel-heading"><div><p className="eyebrow">CİRO</p><h2>Ciro trendi</h2></div>
            <div className="rev-toggle" role="group" aria-label="Ciro dönemi">
              <button className={period === "monthly" ? "active" : ""} onClick={() => setPeriod("monthly")}>Aylık</button>
              <button className={period === "yearly" ? "active" : ""} onClick={() => setPeriod("yearly")}>Yıllık</button>
            </div>
          </header>
          <div className="admin-panel-body">
            <div className="rev-head">
              <div className="rev-kpi"><strong>{hidden ? "₺•••" : activeRevenue.total}</strong><small>{period === "monthly" ? "Temmuz 2026" : "2026 · yıl toplamı"}</small></div>
              {!hidden && <span className="rev-delta">{activeRevenue.delta} <small style={{ color: "#8a99a6", fontWeight: 700 }}>geçen döneme göre</small></span>}
            </div>
            <div className="rev-chart"><AreaChart values={hidden ? activeRevenue.values.map(() => 0) : activeRevenue.values} /></div>
            <div className="area-labels">{activeRevenue.labels.map((label) => <span key={label}>{label}</span>)}</div>
          </div>
          <div className="admin-panel-foot">
            <a href="#">Ay / Yıl istatistikleri <Icon name="chevron" size={14} /></a>
            <a href="#">AKBANK nakit akışı <Icon name="chevron" size={14} /></a>
            <a href="#">EFT / Havale listesi <Icon name="chevron" size={14} /></a>
          </div>
        </div>

        <div className="detail-panel">
          <header className="detail-panel-heading"><div><p className="eyebrow">İŞ PLANLARI</p><h2>Görev durumu</h2></div></header>
          <div className="donut-panel-body">
            <Donut segments={hidden ? taskSegments.map((segment) => ({ ...segment, value: 0 })) : taskSegments} size={132} thickness={16}>
              <strong>{hidden ? "•" : taskTotal}</strong><small>görev</small>
            </Donut>
            <div>
              <div className="chart-legend">
                {taskSegments.map((segment) => <div key={segment.label}><i style={{ background: segment.color }} /><span>{segment.label}</span><b>{hidden ? "•" : segment.value}</b></div>)}
              </div>
              <div className="completion-bar">
                <div><span style={{ width: hidden ? "0%" : `${completionRate}%` }} /></div>
                <small>Tamamlanma oranı · %{hidden ? "•" : completionRate}</small>
              </div>
            </div>
          </div>
          <div className="admin-panel-foot"><a href="#">İş planlarını aç <Icon name="chevron" size={14} /></a></div>
        </div>
      </section>
      </div>

      <section className="admin-grid-3">
        <div className="detail-panel">
          <header className="detail-panel-heading"><div><p className="eyebrow">OPERASYON</p><h2>Teslimat & ek analiz</h2></div></header>
          <div className="admin-panel-body">
            <div className="bar-list">
              {deliveryBars.map((bar) => (
                <div className="bar-row" key={bar.label}>
                  <span>{bar.label}</span>
                  <div><i style={{ width: hidden ? "0%" : `${Math.max(6, (bar.value / deliveryMax) * 100)}%`, background: bar.color }} /></div>
                  <b>{hidden ? "•" : bar.value}</b>
                </div>
              ))}
            </div>
            <div className="split-bar">
              <p>EK ANALİZ TALEPLERİ</p>
              {hidden ? (
                <div className="split-track"><span style={{ width: "100%", background: "#eef2f4" }} /></div>
              ) : (
                <div className="split-track">
                  <span style={{ width: `${(extraFree / extraTotal) * 100}%`, background: "#94b8cb" }}>{extraFree}</span>
                  <span style={{ width: `${(extraPaid / extraTotal) * 100}%`, background: "#1775a9" }}>{extraPaid}</span>
                </div>
              )}
              <div className="split-legend"><span><i style={{ background: "#94b8cb" }} />Ücretsiz</span><span><i style={{ background: "#1775a9" }} />Ücretli</span></div>
            </div>
          </div>
        </div>

        <div className="detail-panel">
          <header className="detail-panel-heading"><div><p className="eyebrow">KULLANICILAR</p><h2>Kullanıcı büyümesi</h2></div></header>
          <div className="admin-panel-body">
            <div className="admin-kpis">
              <div><strong>{hidden ? "•••" : "9.724"}</strong><small>Toplam kullanıcı</small></div>
              <div><strong>{hidden ? "•••" : "+15"}</strong><small>Yeni (son 1 hafta)</small></div>
              <div><strong>{hidden ? "•••" : "36"}</strong><small>Günlük giriş</small></div>
            </div>
            <div className="user-spark"><Sparkline values={hidden ? [0, 0, 0, 0, 0, 0, 0] : [22, 28, 31, 26, 34, 30, 36]} width={280} height={64} /></div>
          </div>
          <div className="admin-panel-foot">
            <a href="#">Sipariş / kullanıcı istatistikleri <Icon name="chevron" size={14} /></a>
            <a href="#">Sistem kullanımı <Icon name="chevron" size={14} /></a>
          </div>
        </div>

        <div className="detail-panel">
          <header className="detail-panel-heading"><div><p className="eyebrow">ÖDEME</p><h2>Ödeme & havale</h2></div></header>
          <div className="donut-panel-body">
            <Donut segments={hidden ? paymentSegments.map((segment) => ({ ...segment, value: 0 })) : paymentSegments} size={120} thickness={15}>
              <strong>{hidden ? "•" : "%62"}</strong><small>havale</small>
            </Donut>
            <div>
              <div className="chart-legend">
                {paymentSegments.map((segment) => <div key={segment.label}><i style={{ background: segment.color }} /><span>{segment.label}</span><b>{hidden ? "•" : `%${segment.value}`}</b></div>)}
              </div>
              <div className="completion-bar"><small>Havale onayı bekleyen · {hidden ? "•" : "0"} işlem</small></div>
            </div>
          </div>
          <div className="admin-panel-foot"><a href="#">AKBANK nakit akışı <Icon name="chevron" size={14} /></a></div>
        </div>
      </section>

      <section className="detail-panel">
        <header className="detail-panel-heading"><div><p className="eyebrow">SON HAREKET</p><h2>Son siparişler</h2></div><a className="admin-foot-link" href="#">Tümünü gör <Icon name="arrow" size={15} /></a></header>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead><tr><th>Sipariş</th><th>Müşteri</th><th>Tutar</th><th>Durum</th></tr></thead>
            <tbody>
              {hidden ? (
                <tr><td colSpan={4} className="masked-cell">Veriler gizlendi</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.code}>
                    <td><strong>{order.type}</strong><div style={{ color: "#8a99a6", fontSize: ".56rem", marginTop: "2px" }}>{order.code}</div></td>
                    <td>{order.customer}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{order.amount}</td>
                    <td><span className={`t-status ${order.status}`}>{order.statusLabel}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
