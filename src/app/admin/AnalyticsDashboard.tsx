"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDataHidden } from "./AdminShell";
import { AreaChart, BarChart, Donut, HorizontalBars, RadialProgress } from "./charts";
import { SystemDropdown } from "../components/SystemDropdown";

type Period = "all" | "month" | "year" | "custom";
type IconName = "archive" | "arrow" | "clock" | "file" | "money" | "orders" | "pending" | "transfer" | "user";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    archive: <><path d="M4 7h16v13H4z" /><path d="M3 3h18v4H3zM9 12h6" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h5" /></>,
    money: <><path d="M3 6h18v12H3z" /><path d="M7 12h.01M17 12h.01" /><circle cx="12" cy="12" r="2.5" /></>,
    orders: <><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3M9 12h6M9 16h4" /></>,
    pending: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 17h.01" /></>,
    transfer: <><path d="M4 7h16M6 3h12l2 4H4zM6 11v7M10 11v7M14 11v7M18 11v7M3 21h18" /></>,
    user: <><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const analysts = ["Tümü", "Esra Öztürk", "Emre Dündar", "Gizem Şahin", "Fatih Akar", "Ertuğrul Gümüşsu", "Aliihsan Şükür", "Mehmet Meşe", "Naci Murat", "Rabia Aktaş", "eistatistik Genel Analizör"];
const services = ["Tümü", "İstatistiksel veri analizi", "Power analizi", "Proforma fatura", "Online mentörlük", "Geçerlilik ve güvenilirlik analizi", "İstatistiksel danışmanlık", "Graphical Abstract"];
const monthLabels = ["Eyl 25", "Eki", "Kas", "Ara", "Oca 26", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"];

const statusColors = ["#1775a9", "#7451d4", "#d08a22", "#22a89a", "#56a733", "#c9574f", "#98a5b2"];
const serviceColors = ["#1775a9", "#132b46", "#2da87b", "#d69120", "#7157cf", "#38a7c0", "#cb5961"];

const analystPerformance = [
  { label: "eistatistik Genel Analizör", values: [2549, 2507] },
  { label: "Rabia Aktaş", values: [1466, 1447] },
  { label: "Naci Murat", values: [1294, 1272] },
  { label: "Mehmet Meşe", values: [487, 478] },
  { label: "Aliihsan Şükür", values: [424, 418] },
  { label: "Ertuğrul Gümüşsu", values: [365, 365] },
  { label: "Fatih Akar", values: [339, 325] },
  { label: "Gizem Şahin", values: [41, 41] },
];

const orders = [
  ["SA260723011", "Doktora tezi analizi", "Kerem Murat", "İstatistiksel veri analizi", "Ücretlendirildi", "5.000 TL", "23.07.2026"],
  ["DS260723008", "Araştırma planı danışmanlığı", "Ayşe Yıldız", "Online mentörlük", "Ücretlendirildi", "6.650 TL", "23.07.2026"],
  ["PA260723007", "Örneklem büyüklüğü hesabı", "Mehmet Demir", "Power analizi", "Teslim edildi", "3.000 TL", "23.07.2026"],
  ["PR260723006", "Kurumsal proforma talebi", "E Yönetim", "Proforma fatura", "Teslim edildi", "-", "23.07.2026"],
  ["SA260723002", "Yüksek lisans tezi", "Zeynep Kaya", "İstatistiksel veri analizi", "Teslim edildi", "4.200 TL", "22.07.2026"],
  ["GA260721005", "Makale görsel özeti", "Deniz Yılmaz", "Graphical Abstract", "Ek analiz", "7.250 TL", "21.07.2026"],
];

function factorFor(analyst: string, service: string, period: Period) {
  const analystIndex = Math.max(0, analysts.indexOf(analyst));
  const serviceIndex = Math.max(0, services.indexOf(service));
  const periodFactor = period === "month" ? .16 : period === "year" ? .72 : period === "custom" ? .43 : 1;
  return periodFactor * (analyst === "Tümü" ? 1 : .13 + (analystIndex % 4) * .035) * (service === "Tümü" ? 1 : .18 + (serviceIndex % 3) * .04);
}

const fmt = (value: number) => new Intl.NumberFormat("tr-TR").format(Math.max(0, Math.round(value)));

export function AdminAnalyticsSection() {
  const hidden = useDataHidden();
  const [period, setPeriod] = useState<Period>("all");
  const [analyst, setAnalyst] = useState("Tümü");
  const [service, setService] = useState("Tümü");
  const factor = factorFor(analyst, service, period);

  const data = useMemo(() => {
    const ordersTotal = Math.round(14008 * factor);
    const monthlyOrders = [186, 156, 209, 162, 163, 197, 173, 207, 175, 208, 141, 188].map((v, i) => Math.round(v * factor * (1 + ((analysts.indexOf(analyst) + services.indexOf(service) + i) % 3) * .025)));
    const revenue = [1.31, 1.08, 1.02, 1.19, 1.24, 1.61, 1.28, 1.42, 1.27, 1.61, 1.02, .79].map(v => Math.round(v * 1_000_000 * factor));
    const statusValues = [18, 9, 13, 11, 30, 15, 4].map(v => Math.max(1, Math.round(v * factor)));
    const serviceValues = [72, 14, 7, 3, 2, 1.5, .5].map(v => Math.max(.2, v * factor));
    const selectedOrders = orders.filter(row => service === "Tümü" || row[3] === service).slice(0, analyst === "Tümü" ? 6 : 4);
    return { ordersTotal, monthlyOrders, revenue, statusValues, serviceValues, selectedOrders };
  }, [factor, analyst, service]);

  const mask = (value: string | number) => hidden ? "•••" : value;
  const statusSegments = ["Sipariş alındı", "Ücretlendirildi", "Yapılıyor", "Tamamlandı", "Teslim edildi", "İptal", "Transfer reddedildi"].map((label, i) => ({ label, value: hidden ? 0 : data.statusValues[i], color: statusColors[i] }));
  const serviceSegments = services.slice(1).map((label, i) => ({ label, value: hidden ? 0 : data.serviceValues[i], color: serviceColors[i] }));
  const filteredPerformance = analyst === "Tümü" ? analystPerformance : analystPerformance.filter(item => item.label === analyst);
  const metrics = [
    { icon: "orders" as IconName, value: fmt(data.ordersTotal), label: "Toplam sipariş", tone: "navy" },
    { icon: "clock" as IconName, value: fmt(82 * factor), label: "Aktif sipariş", tone: "orange" },
    { icon: "money" as IconName, value: `${fmt(1_420_800 * factor)} TL`, label: "Dönem geliri", tone: "green" },
    { icon: "pending" as IconName, value: fmt(4 * Math.max(factor, .25)), label: "Ücretlendirme bekleyen", tone: "violet" },
    { icon: "transfer" as IconName, value: fmt(2 * Math.max(factor, .2)), label: "Transfer onayı", tone: "cyan" },
    { icon: "archive" as IconName, value: fmt(489 * factor), label: "Arşivlenen", tone: "slate" },
  ];

  return (
    <div className="admin-analytics">
      <section className="analytics-filter" aria-label="Dashboard filtreleri">
        <div className="analytics-periods" role="group" aria-label="Tarih aralığı">
          {(["all", "month", "year", "custom"] as Period[]).map(item => <button key={item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item === "all" ? "Tüm zamanlar" : item === "month" ? "Bu ay" : item === "year" ? "Bu yıl" : "Özel filtre"}</button>)}
        </div>
        <div className="analytics-selects">
          <label><span>Analizör</span><SystemDropdown ariaLabel="Analizör filtresi" value={analyst} onChange={setAnalyst} options={analysts.map(item => ({ value: item, label: item }))} /></label>
          <label><span>Sipariş türü</span><SystemDropdown ariaLabel="Sipariş türü filtresi" value={service} onChange={setService} options={services.map(item => ({ value: item, label: item }))} /></label>
          <p><strong>{analyst === "Tümü" ? "Tüm analizörler" : analyst}</strong><span>{service === "Tümü" ? "Tüm hizmetler" : service}</span></p>
        </div>
      </section>

      <section className="analytics-metrics" aria-label="Özet metrikler">
        {metrics.map(metric => <article key={metric.label}><i className={metric.tone}><Icon name={metric.icon} /></i><div><strong>{mask(metric.value)}</strong><span>{metric.label}</span></div></article>)}
      </section>

      <section className="analytics-grid primary">
        <article className="analytics-card analytics-orders-chart"><header><div><p className="eyebrow">SİPARİŞ HACMİ</p><h2>Aylık sipariş sayısı</h2></div><span>Son 12 ay</span></header><div className="analytics-chart-body"><BarChart values={hidden ? data.monthlyOrders.map(() => 0) : data.monthlyOrders} labels={monthLabels} /></div></article>
        <article className="analytics-card"><header><div><p className="eyebrow">OPERASYON</p><h2>Durum dağılımı</h2></div><span>{mask(fmt(data.ordersTotal))} sipariş</span></header><div className="analytics-donut-layout"><Donut segments={statusSegments} size={176} thickness={25}><strong>{mask(fmt(data.ordersTotal))}</strong><small>toplam</small></Donut><div className="analytics-legend">{statusSegments.map(segment => <span key={segment.label}><i style={{background: segment.color}} />{segment.label}</span>)}</div></div></article>
      </section>

      <article className="analytics-card analytics-revenue"><header><div><p className="eyebrow">FİNANSAL AKIŞ</p><h2>Aylık gelir</h2></div><span>Ödemesi tamamlanan siparişler</span></header><div className="analytics-area-wrap"><AreaChart values={hidden ? data.revenue.map(() => 0) : data.revenue} labels={monthLabels} height={210} valueFormatter={value => `${fmt(value)} TL`} /><div className="analytics-axis">{monthLabels.map((label, index) => <span key={label} style={{left:`${(index / (monthLabels.length - 1 || 1)) * 100}%`}}>{label}</span>)}</div></div></article>

      <section className="analytics-grid secondary">
        <article className="analytics-card"><header><div><p className="eyebrow">HİZMET PORTFÖYÜ</p><h2>Sipariş türü dağılımı</h2></div><span>Seçili dönem</span></header><div className="analytics-donut-layout service"><Donut segments={serviceSegments} size={188} thickness={27}><strong>{mask(fmt(data.ordersTotal))}</strong><small>toplam</small></Donut><div className="analytics-legend">{serviceSegments.map(segment => <span key={segment.label}><i style={{background: segment.color}} />{segment.label}</span>)}</div></div></article>
        <article className="analytics-card"><header><div><p className="eyebrow">TESLİMAT KALİTESİ</p><h2>Teslim süresi analizi</h2></div><span>{mask(fmt(9078 * factor))} teslim</span></header><div className="delivery-analysis"><RadialProgress value={hidden ? 0 : 83.4} size={190}><small>Zamanında teslim</small><strong>{hidden ? "•••" : "%83,4"}</strong></RadialProgress><dl><div><dt>{mask(`${fmt(42 * factor)} sa`)}</dt><dd>Söz verilen ort.</dd></div><div><dt>{mask(`${fmt(39 * factor)} sa`)}</dt><dd>Gerçekleşen ort.</dd></div><div><dt>{mask("%83,4")}</dt><dd>Zamanında teslim</dd></div></dl></div></article>
      </section>

      <article className="analytics-card analytics-performance"><header><div><p className="eyebrow">EKİP PERFORMANSI</p><h2>Analizör performansı</h2></div><span>Sipariş sayısına göre</span></header><div className="performance-legend"><span><i />Toplam sipariş</span><span><i />Teslim edilen</span></div><HorizontalBars rows={hidden ? filteredPerformance.map(row => ({...row, values:[0,0]})) : filteredPerformance} /></article>

      <article className="analytics-card analytics-latest"><header><div><p className="eyebrow">SON HAREKETLER</p><h2>Son siparişler</h2></div><Link href="/admin/siparisler">Tümünü görüntüle <Icon name="arrow" size={15} /></Link></header><div className="orders-table analytics-recent-orders"><div className="orders-table-head"><span>Sipariş</span><span>Müşteri</span><span>Hizmet</span><span>Durum</span><span>Tutar</span><span>İşlem</span></div>{hidden ? <div className="masked-cell">Veriler gizlendi</div> : data.selectedOrders.map(row => <article className="orders-row" key={row[0]}><Link className="order-row-link" href="/admin/siparisler" aria-label={`${row[1]} siparişini görüntüle`} /><div className="order-identity"><span className="order-file"><Icon name="file" /></span><span><strong>{row[1]}</strong><small>{row[0]} · {row[6]}</small></span></div><div className="order-identity"><span className="order-file"><Icon name="user" /></span><span><strong>{row[2]}</strong><small>Müşteri hesabı</small></span></div><div className="analytics-order-service"><strong>{row[3]}</strong></div><div className="order-state"><span className={`state-dot ${row[4] === "Teslim edildi" ? "completed" : row[4] === "Ek analiz" ? "action" : ""}`} /><span><strong>{row[4]}</strong></span></div><div className="analytics-order-price"><strong>{row[5]}</strong></div><div className="order-actions"><Link href="/admin/siparisler" className="context-action">Detay <Icon name="arrow" size={15} /></Link></div></article>)}</div></article>
    </div>
  );
}
