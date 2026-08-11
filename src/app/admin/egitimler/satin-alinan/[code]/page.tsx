"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "../../../AdminShell";
import { MessageTemplatePicker } from "../../../../components/MessageTemplatePicker";

type Section = "overview" | "payment" | "messages" | "content" | "invoice" | "tasks" | "activity" | "products";

const records: Record<string, { student: string; email: string; education: string; date: string; price: string; access: string; status: "pending" | "active" | "cancelled" }> = {
  TR260731004: { student: "Beyza Nur Can", email: "beyza.can@example.com", education: "Modül 6. Meta Analizi Eğitimi", date: "31 Temmuz 2026 · 12:36", price: "4.000 TL", access: "12 ay", status: "pending" },
  TR260730009: { student: "Ahmet Yalnız", email: "ahmet.yalniz@example.com", education: "İstatistiğin Her Şeyi", date: "30 Temmuz 2026 · 23:18", price: "15.000 TL", access: "36 ay", status: "active" },
  TR260730002: { student: "Ezgi Sonkaya", email: "ezgi.sonkaya@example.com", education: "Makale Destek", date: "30 Temmuz 2026 · 11:25", price: "10.000 TL", access: "36 ay", status: "pending" },
  TR260702003: { student: "Betül Uzun Özer", email: "betul.ozer@example.com", education: "5’i Bir Arada", date: "2 Temmuz 2026 · 09:21", price: "9.000 TL", access: "12 ay", status: "active" },
  TR260802001: { student: "Yeni kursiyer seçilecek", email: "Henüz atanmadı", education: "5’i Bir Arada", date: "4 Ağustos 2026 · Taslak", price: "9.000 TL", access: "12 ay", status: "pending" },
  TR260802002: { student: "Yeni kursiyer seçilecek", email: "Henüz atanmadı", education: "İstatistiğin Her Şeyi", date: "4 Ağustos 2026 · Taslak", price: "15.000 TL", access: "36 ay", status: "pending" },
  TR260802003: { student: "Yeni kursiyer seçilecek", email: "Henüz atanmadı", education: "Makale Destek", date: "4 Ağustos 2026 · Taslak", price: "10.000 TL", access: "36 ay", status: "pending" },
  TR260802004: { student: "Yeni kursiyer seçilecek", email: "Henüz atanmadı", education: "Temel Düzey Veri Analizi", date: "4 Ağustos 2026 · Taslak", price: "4.000 TL", access: "12 ay", status: "pending" },
  TR260802005: { student: "Yeni kursiyer seçilecek", email: "Henüz atanmadı", education: "İleri Düzey Veri Analizi", date: "4 Ağustos 2026 · Taslak", price: "4.000 TL", access: "12 ay", status: "pending" },
  TR260802006: { student: "Yeni kursiyer seçilecek", email: "Henüz atanmadı", education: "Ölçek Geliştirme ve YEM", date: "4 Ağustos 2026 · Taslak", price: "4.000 TL", access: "12 ay", status: "pending" },
  TR180914002: { student: "Çağrı Gümüşkaptan", email: "cagri.g@example.com", education: "Modül 1", date: "14 Eylül 2018 · 11:14", price: "550 TL", access: "Sona erdi", status: "cancelled" },
  TR180626001: { student: "Figen Çavuşoğlu", email: "figen.c@example.com", education: "Modül 2", date: "26 Haziran 2018 · 09:37", price: "500 TL", access: "Sona erdi", status: "cancelled" },
  TR170623003: { student: "Aslı Kurtgöz", email: "asli.k@example.com", education: "Modül 1", date: "23 Haziran 2017 · 17:04", price: "500 TL", access: "Sona erdi", status: "active" },
  TR181221009: { student: "Melek Ertürk Yavuz", email: "melek.e@example.com", education: "Modül 2", date: "21 Aralık 2018 · 19:14", price: "650 TL", access: "Sona erdi", status: "cancelled" },
  TR180504005: { student: "Doğan Kahraman", email: "dogan.k@example.com", education: "Modül 1", date: "4 Mayıs 2018 · 20:57", price: "500 TL", access: "Sona erdi", status: "cancelled" },
  TR180626005: { student: "Elçin İnceoğlu", email: "elcin.i@example.com", education: "Modül 5", date: "26 Haziran 2018 · 17:07", price: "600 TL", access: "Sona erdi", status: "cancelled" },
  TR180506001: { student: "Fatih Nazmi Yaman", email: "fatih.y@example.com", education: "Modül 1", date: "6 Mayıs 2018 · 21:23", price: "1.000 TL", access: "Sona erdi", status: "cancelled" },
  TR180629001: { student: "Güven Soner", email: "guven.s@example.com", education: "Modül 2", date: "29 Haziran 2018 · 11:57", price: "500 TL", access: "Sona erdi", status: "cancelled" },
  TR180629002: { student: "Özge Öz", email: "ozge.o@example.com", education: "Modül 2", date: "29 Haziran 2018 · 11:57", price: "500 TL", access: "Sona erdi", status: "active" },
  TR180831021: { student: "Özgür Çalkın", email: "ozgur.c@example.com", education: "Modül 1", date: "31 Ağustos 2018 · 14:47", price: "700 TL", access: "Sona erdi", status: "cancelled" },
};

const statusText = {
  pending: { label: "Ödeme bekliyor", note: "Ücret belirlendi, ödeme yapılması bekleniyor." },
  active: { label: "Erişim aktif", note: "Kursiyer eğitim içeriklerine erişebilir." },
  cancelled: { label: "İptal edildi", note: "Eğitim erişimi kapatıldı." },
};

const sidebar: { key: Section; label: string; icon: string }[] = [
  { key: "overview", label: "Eğitim Detayları", icon: "book" },
  { key: "payment", label: "Ödeme İşlemleri", icon: "card" },
  { key: "messages", label: "Yazışma", icon: "message" },
  { key: "content", label: "Eğitim İçerikleri", icon: "play" },
  { key: "invoice", label: "Fatura", icon: "invoice" },
  { key: "tasks", label: "Görevler", icon: "check" },
];

function Icon({ name, size = 17 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v16H7.5A3.5 3.5 0 0 0 4 21.5z"/><path d="M4 5.5v16M8 6h8M8 10h6"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>,
    play: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="m10 8 5 4-5 4z"/></>,
    invoice: <><path d="M6 2h9l4 4v16H6zM14 2v5h5M9 12h7M9 16h7"/></>,
    check: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/></>,
    back: <path d="m15 18-6-6 6-6"/>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
    percent: <><path d="m19 5-14 14"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></>,
    assign: <><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M18 8v6M15 11h6"/></>,
    activity: <path d="M3 12h4l2-5 4 10 2-5h6"/>,
    products: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function PanelTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <header className="education-panel-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action}</header>;
}

export default function AdminPurchasedEducationDetail() {
  return <AdminShell><PurchasedEducationDetailContent /></AdminShell>;
}

export function PurchasedEducationDetailContent({ basePath = "/admin/egitimler" }: { basePath?: string }) {
  const params = useParams<{ code: string }>();
  const query = useSearchParams();
  const requested = query.get("section") as Section | null;
  const [section, setSection] = useState<Section>(requested === "activity" || requested === "products" ? requested : "overview");
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const code = params.code;
  const record = records[code] ?? { student: "Beyza Nur Can", email: "beyza.can@example.com", education: "Modül 6. Meta Analizi Eğitimi", date: "31 Temmuz 2026 · 12:36", price: "4.000 TL", access: "12 ay", status: "pending" as const };
  const state = statusText[record.status];
  const sendMessage = () => { const clean = message.trim(); if (!clean) return; setSentMessages(current => [...current, clean]); setMessage(""); };

  return <div className="detail-page shared-order-detail education-detail-page">
    <header className="detail-hero admin-detail-hero">
      <div className="admin-hero-left"><div className="detail-title"><span className="detail-file-icon"><Icon name="book" size={21}/></span><div><div className="detail-title-topline"><Link className="back-link detail-hero-back" href={`${basePath}/satin-alinan`}><Icon name="back" size={14}/>Eğitim kayıtlarına dön</Link><p className="eyebrow">{code} · {record.date}</p></div><h1>{record.education}</h1></div></div><div className="admin-hero-meta"><span className={`education-detail-status ${record.status}`}><i/><strong>{state.label}</strong></span><span className="admin-hero-note">{record.student} · {state.note}</span></div></div>
      <div className="admin-hero-actions"><button className="admin-action-btn"><Icon name="heart" size={15}/>Favorilere Ekle</button><button className="admin-action-btn"><Icon name="percent" size={15}/>İndirim Kodu Tanımla</button><button className="admin-action-btn accent"><Icon name="assign" size={15}/>Görev Ata</button></div>
    </header>

    <div className="detail-workspace"><aside className="detail-sidebar"><p>EĞİTİM MENÜSÜ</p><nav>{sidebar.map(item => <button key={item.key} className={section === item.key ? "active" : ""} onClick={() => setSection(item.key)}><Icon name={item.icon}/>{item.label}<span/></button>)}</nav></aside>
      <main className="detail-content">
        {section === "overview" && <div className="detail-stack"><section className="detail-panel"><PanelTitle eyebrow="KAYIT ÖZETİ" title="Eğitim detayları"/><dl className="education-detail-facts"><div><dt>Kursiyer</dt><dd>{record.student}<small>{record.email}</small></dd></div><div><dt>Eğitim</dt><dd>{record.education}<small>Kendi hızında eğitim</small></dd></div><div><dt>Video erişim süresi</dt><dd>{record.access}</dd></div><div><dt>Ücret</dt><dd>{record.price}</dd></div><div><dt>Ödeme durumu</dt><dd><span className={`education-inline-state ${record.status}`}>{state.label}</span></dd></div><div><dt>Sertifika</dt><dd>Eğitim tamamlandığında verilecek</dd></div></dl></section><section className="detail-panel"><PanelTitle eyebrow="MÜFREDAT" title="Modül bilgisi"/><div className="education-module-list">{["Meta analize giriş ve araştırma sorusu", "Etki büyüklüğü hesaplama", "Heterojenlik ve model seçimi", "Yayın yanlılığı", "Sonuçların raporlanması"].map((module, index) => <div key={module}><span>{String(index + 1).padStart(2, "0")}</span><strong>{module}</strong><small>{index + 5} ders</small></div>)}</div></section></div>}
        {section === "payment" && <section className="detail-panel"><PanelTitle eyebrow="ÖDEME" title="Ödeme işlemleri" action={<span className={`education-inline-state ${record.status}`}>{state.label}</span>}/><div className="education-payment-grid"><div><span>Eğitim bedeli</span><strong>{record.price}</strong><small>KDV dahil toplam tutar</small></div><div><span>Ödeme yöntemi</span><strong>Henüz seçilmedi</strong><small>Havale / EFT veya kredi kartı</small></div><div><span>İndirim</span><strong>0 TL</strong><small>Tanımlı indirim kodu yok</small></div></div><div className="education-info-banner">Ödeme tamamlandığında erişim otomatik olarak açılır ve fatura süreci başlatılır.</div></section>}
        {section === "messages" && <section className="detail-panel messages-panel">
          <header className="detail-panel-heading"><div><p className="eyebrow">İLETİŞİM VE HAREKETLER</p><h2>Eğitim yazışmaları</h2><span>Kursiyer mesajları ve eğitimle ilgili sistem hareketleri tek kronolojide tutulur.</span></div></header>
          <div className="message-guidance"><span><Icon name="message" size={19}/></span><div><strong>Kursiyerle iletişim</strong><p>Bu alan yalnızca eğitim kaydıyla ilgili mesajlaşma ve bilgilendirmeler içindir.</p></div></div>
          <div className="message-composer"><label htmlFor="admin-education-message">Admin Mesajı</label><textarea id="admin-education-message" value={message} onChange={event => setMessage(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) sendMessage(); }} placeholder="Kursiyere mesajınızı yazın…"/><div><MessageTemplatePicker scope="education" onSelect={setMessage}/><button className="send" type="button" onClick={sendMessage} disabled={!message.trim()}>Gönder <Icon name="arrow" size={15}/></button></div></div>
          <div className="response-expectation"><Icon name="clock" size={16}/><span><strong>Yanıt süresi:</strong> Mesai saatlerinde ortalama 1 saat.</span></div>
          <div className="messages-thread"><div className="thread-day"><span>Bugün</span></div>
            {[...sentMessages].reverse().map((sent, index) => <article className="customer-message sent" key={`${sent}-${index}`}><div><strong>Admin <small>Şimdi</small></strong><p>{sent}</p><span className="message-delivery"><Icon name="check" size={12}/>Gönderildi</span></div></article>)}
            <article className="customer-message"><div><strong>{record.student} <small>10:24</small></strong><p>Merhaba, ödeme süreciyle ilgili bilgi rica ediyorum.</p></div></article>
            <article className="expert-message"><span>NY</span><div><strong>Naci Yılmaz <small>10:31</small></strong><p>Merhaba, ödeme adımlarıyla ilgili bilgilendirme kursiyere iletildi.</p></div></article>
            <div className="thread-day"><span>{record.date.split(" · ")[0]}</span></div>
            <details className="system-event" open><summary><span className="system-event-marker"><Icon name="check" size={14}/></span><div><small>SİSTEM HAREKETİ</small><strong>Eğitim kaydı oluşturuldu</strong><time>{record.date.split(" · ")[1]}</time></div><i>Ayrıntılar</i></summary><dl><div><dt>Eğitim</dt><dd>{record.education}</dd></div><div><dt>Durum</dt><dd>{state.label}</dd></div><div><dt>Erişim süresi</dt><dd>{record.access}</dd></div></dl></details>
          </div>
        </section>}
        {section === "content" && <section className="detail-panel"><PanelTitle eyebrow="İÇERİK YÖNETİMİ" title="Eğitim içerikleri" action={<button className="admin-action-btn">Erişimi yönet</button>}/><div className="education-info-banner">{record.status === "active" ? "Kursiyerin eğitim içeriklerine erişimi açık." : "İçerikler ödeme tamamlandıktan sonra kursiyere açılacak."}</div><div className="education-content-list">{["Meta Analizi Eğitim Dokümanları", "Temel kavramlar ve veri hazırlığı", "Etki büyüklüklerinin hesaplanması", "CMA uygulamaları ve raporlama"].map((title, index) => <div key={title}><span><Icon name={index ? "play" : "invoice"}/></span><div><strong>{title}</strong><small>{index ? `${index + 2} video · ${35 + index * 12} dk.` : "6 doküman"}</small></div><button>İncele</button></div>)}</div></section>}
        {section === "invoice" && <section className="detail-panel"><PanelTitle eyebrow="FATURA" title="Fatura bilgileri"/><div className="education-empty-state"><Icon name="invoice" size={28}/><strong>Henüz fatura oluşturulmadı</strong><p>Fatura, ödeme onaylandıktan sonra bu alanda görüntülenecek.</p></div></section>}
        {section === "tasks" && <section className="detail-panel"><PanelTitle eyebrow="OPERASYON" title="Görevler" action={<button className="admin-action-btn accent"><Icon name="assign"/>Yeni görev</button>}/><div className="education-task-list"><article><span className="done"><Icon name="check"/></span><div><strong>Ödeme hatırlatması gönder</strong><small>eistatistik Analizör · 1 Ağustos 2026 18:00</small></div><em>Tamamlandı</em></article><article><span><Icon name="check"/></span><div><strong>Erişim tanımını kontrol et</strong><small>Ödeme onayından sonra</small></div><em>Bekliyor</em></article></div></section>}
        {section === "activity" && <section className="detail-panel"><PanelTitle eyebrow="KAYIT GEÇMİŞİ" title="Aktivite"/><div className="education-activity-list">{[["Eğitim kaydı oluşturuldu", record.date], ["Ücret tanımlandı", "31 Temmuz 2026 · 12:41"], ["Ödeme hatırlatması gönderildi", "1 Ağustos 2026 · 18:00"]].map(([title, time]) => <div key={title}><i/><div><strong>{title}</strong><small>{time}</small></div></div>)}</div></section>}
        {section === "products" && <section className="detail-panel"><PanelTitle eyebrow="ÜRÜNLER" title="Eğitime ürün ata" action={<button className="admin-action-btn accent"><Icon name="products"/>Ürün ata</button>}/><div className="education-empty-state"><Icon name="products" size={28}/><strong>Atanmış ek ürün yok</strong><p>Bu eğitim kaydına doküman, mentörlük saati veya ek modül atayabilirsiniz.</p></div></section>}
      </main>
    </div>
  </div>;
}
