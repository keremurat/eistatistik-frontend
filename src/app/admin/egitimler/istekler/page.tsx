"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../../AdminShell";

type RequestStatus = "new" | "reviewing" | "completed";
type Filter = "all" | RequestStatus;

type EducationRequest = {
  id: number;
  name: string;
  email: string;
  owned: string[];
  request: string;
  createdAt: string;
  status: RequestStatus;
};

const requests: EducationRequest[] = [
  { id: 13, name: "Gül Dural", email: "gul.dural@example.com", owned: [], request: "R programlama ile ileri istatistik ve veri görselleştirme eğitimi talep ediyorum.", createdAt: "07.09.2022 · 13:02", status: "new" },
  { id: 12, name: "Ülkü Saygılı", email: "ulku.saygili@example.com", owned: ["Modül 1"], request: "Temel eğitimin devamı olarak çok değişkenli analiz eğitimi eklenebilir mi?", createdAt: "07.09.2022 · 10:20", status: "reviewing" },
  { id: 11, name: "Aylin Yeşilgöz", email: "aylin.yesilgoz@example.com", owned: ["Modül 6"], request: "Meta analiz eğitimi için uygulamalı ileri düzey yeni bir modül istiyorum.", createdAt: "06.09.2022 · 22:03", status: "new" },
  { id: 10, name: "Aylin Yeşilgöz", email: "aylin.yesilgoz@example.com", owned: ["Modül 5"], request: "Bibliyometrik veri analizi ve VOSviewer uygulamaları eğitimi talep ediyorum.", createdAt: "06.09.2022 · 22:03", status: "reviewing" },
  { id: 9, name: "Aylin Yeşilgöz", email: "aylin.yesilgoz@example.com", owned: ["Modül 4"], request: "G*Power içerisinde tekrarlı ölçümler için örnek uygulamalar eklenmesini istiyorum.", createdAt: "06.09.2022 · 22:03", status: "completed" },
  { id: 8, name: "Aylin Yeşilgöz", email: "aylin.yesilgoz@example.com", owned: ["Modül 3"], request: "Yapısal eşitlik modellemesinde aracılık ve düzenleyicilik analizi eğitimi.", createdAt: "06.09.2022 · 22:03", status: "completed" },
  { id: 7, name: "Aylin Yeşilgöz", email: "aylin.yesilgoz@example.com", owned: ["Modül 2"], request: "İleri regresyon varsayımları ve model karşılaştırma uygulamaları eklenebilir.", createdAt: "06.09.2022 · 22:03", status: "completed" },
];

const statusMeta: Record<RequestStatus, { label: string; detail: string }> = {
  new: { label: "Yeni istek", detail: "Henüz incelenmedi" },
  reviewing: { label: "İnceleniyor", detail: "Değerlendirmede" },
  completed: { label: "Sonuçlandı", detail: "İşlem tamamlandı" },
};

const tabs: { key: Filter; label: string }[] = [
  { key: "all", label: "Tüm istekler" },
  { key: "new", label: "Yeni" },
  { key: "reviewing", label: "İncelenen" },
  { key: "completed", label: "Sonuçlanan" },
];

export default function EducationRequestsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<EducationRequest | null>(null);
  const counts = useMemo(() => ({ all: requests.length, new: requests.filter(item => item.status === "new").length, reviewing: requests.filter(item => item.status === "reviewing").length, completed: requests.filter(item => item.status === "completed").length }), []);
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr");
    return requests.filter(item => (filter === "all" || item.status === filter) && (!normalized || [item.name, item.email, item.request, ...item.owned].some(value => value.toLocaleLowerCase("tr").includes(normalized))));
  }, [filter, query]);

  return <AdminShell><div className="education-requests-page">
    <header className="orders-hero admin-education-hero"><div><p className="eyebrow">EĞİTİM YÖNETİMİ</p><h1>Eğitim İstekleri</h1><p>Kullanıcıların yeni eğitim ve içerik taleplerini inceleyin, önceliklendirin ve sonuçlandırın.</p></div><div className="admin-education-summary" aria-label="Eğitim isteği özeti"><span><strong>{counts.all}</strong><small>toplam istek</small></span><span><strong>{counts.new}</strong><small>yeni istek</small></span><span><strong>{counts.reviewing}</strong><small>inceleniyor</small></span></div></header>
    <nav className="order-tabs admin-education-tabs" aria-label="Eğitim isteği durumları">{tabs.map(tab => <button key={tab.key} className={filter === tab.key ? "active" : ""} onClick={() => setFilter(tab.key)}>{tab.label}<span>{counts[tab.key]}</span></button>)}</nav>
    <section className="orders-toolbar admin-education-toolbar"><label className="orders-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Kullanıcı, eğitim veya istek metni ara…"/></label><span className="result-count">{visible.length} istek gösteriliyor</span></section>
    <section className="education-request-list"><header><div><p className="eyebrow">KULLANICI TALEPLERİ</p><h2>İstek listesi</h2></div><span>En yeni istekler önce gösterilir</span></header><div className="education-request-scroll"><div className="education-request-head"><span>Kullanıcı</span><span>Mevcut eğitimler</span><span>İstek metni</span><span>Eklenme zamanı</span><span>Durum</span><span>İşlem</span></div>{visible.length ? visible.map(item => <article className="education-request-row" key={item.id} onClick={() => setSelected(item)}>
      <div className="education-request-user"><span>{item.name.split(" ").map(part => part[0]).join("").slice(0,2)}</span><div><strong>{item.name}</strong><small>#{String(item.id).padStart(3,"0")} · {item.email}</small></div></div>
      <div className="education-owned-list">{item.owned.length ? item.owned.map(course => <span key={course}>{course}</span>) : <small>Henüz eğitim yok</small>}</div>
      <p className="education-request-copy">{item.request}</p><time>{item.createdAt}</time>
      <div className={`education-request-status ${item.status}`}><i/><div><strong>{statusMeta[item.status].label}</strong><small>{statusMeta[item.status].detail}</small></div></div>
      <button className="education-row-action" onClick={event => { event.stopPropagation(); setSelected(item); }}>İncele <span aria-hidden="true">→</span></button>
    </article>) : <div className="orders-empty">Filtrelerle eşleşen eğitim isteği bulunamadı.</div>}</div></section>
    {selected && <div className="dm-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="dm-modal education-request-modal" role="dialog" aria-modal="true" aria-labelledby="education-request-title" onMouseDown={event => event.stopPropagation()}><header className="dm-header"><div><p className="eyebrow">EĞİTİM İSTEĞİ · #{selected.id}</p><h2 id="education-request-title">{selected.name}</h2></div><button className="dm-close-btn" onClick={() => setSelected(null)} aria-label="Kapat">×</button></header><div className="dm-body"><dl><div><dt>Kullanıcı</dt><dd>{selected.name}<small>{selected.email}</small></dd></div><div><dt>Mevcut eğitimler</dt><dd>{selected.owned.join(", ") || "Henüz eğitim yok"}</dd></div><div><dt>Eklenme zamanı</dt><dd>{selected.createdAt}</dd></div></dl><div className="education-request-full"><span>İSTEK METNİ</span><p>{selected.request}</p></div><label><span>İnceleme notu</span><textarea placeholder="Ekip için değerlendirme notu ekleyin…"/></label></div><footer className="dm-footer"><button className="dm-btn secondary" onClick={() => setSelected(null)}>Kapat</button><button className="dm-btn primary" onClick={() => setSelected(null)}>İncelemeye al</button></footer></section></div>}
  </div></AdminShell>;
}
