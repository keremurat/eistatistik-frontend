"use client";

import Link from "next/link";
import Image from "next/image";
import { ProfileMenu } from "../../components/ProfileMenu";
import { useState } from "react";

type Section = "overview" | "files" | "payment" | "messages" | "deliveries" | "appointments" | "invoice" | "extra";
type IconName = "arrow" | "back" | "bell" | "book" | "calendar" | "card" | "check" | "clock" | "copy" | "download" | "file" | "home" | "invoice" | "message" | "plus" | "search" | "spark" | "upload" | "video";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const navItems: { key: Section; label: string; icon: IconName }[] = [
  { key: "overview", label: "Genel bakış", icon: "home" },
  { key: "files", label: "Sipariş Kalemleri", icon: "file" },
  { key: "payment", label: "Ödeme", icon: "card" },
  { key: "messages", label: "Yazışmalar", icon: "message" },
  { key: "deliveries", label: "Teslimatlar", icon: "download" },
  { key: "appointments", label: "Randevular", icon: "calendar" },
  { key: "invoice", label: "Fatura", icon: "invoice" },
];

export default function OrderDetailPage() {
  const [section, setSection] = useState<Section>("overview");
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "card">("transfer");
  const isDelivered = false;
  const visibleNav = isDelivered ? [...navItems, { key: "extra" as Section, label: "Ek analiz", icon: "spark" as IconName }] : navItems;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/dashboard" aria-label="Eİstatistik ana sayfa"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority /></Link>
        <nav className="main-nav">
          <Link href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
          <Link className="active" href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <Link href="/egitimler"><Icon name="book" size={17} />Eğitimlerim</Link><Link href="/yeni-analiz-talebi"><Icon name="spark" size={17} />Hizmetler</Link>
        </nav>
        <div className="top-actions"><a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a><button className="icon-button" aria-label="Bildirimler"><Icon name="bell" /><span className="notification-dot">2</span></button><ProfileMenu /></div>
      </header>

      <main className="detail-page">
        <Link className="back-link" href="/siparislerim"><Icon name="back" size={16} />Siparişlerime dön</Link>
        <header className="detail-hero">
          <div className="detail-title"><span className="detail-file-icon"><Icon name="file" size={22} /></span><div><p className="eyebrow">DS260723008 · 23 TEMMUZ 2026</p><h1>Güç analizi danışmanlığı</h1></div></div>
          <div className="detail-current-state"><span className="state-pulse" /><div><small>MEVCUT DURUM</small><strong>Ücret teklifiniz hazır</strong><span>Analizin başlayabilmesi için ödeme yapmanız gerekiyor.</span></div></div>
          <button onClick={() => setSection("payment")}>Ödemeye git <Icon name="arrow" size={16} /></button>
        </header>

        <div className="detail-workspace">
          <aside className="detail-sidebar" aria-label="Sipariş bölümleri">
            <p>SİPARİŞ MENÜSÜ</p>
            <nav>{visibleNav.map(item => <button key={item.key} className={section === item.key ? "active" : ""} onClick={() => setSection(item.key)}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.key === "payment" && <i>1</i>}</button>)}</nav>
            <div className="sidebar-help"><Icon name="message" size={17} /><div><strong>Yardıma mı ihtiyacınız var?</strong><span>Destek ekibine yazın</span></div></div>
          </aside>
          <section className="detail-content">
            {section === "overview" && <Overview onPayment={() => setSection("payment")} />}
            {section === "files" && <Files />}
            {section === "payment" && <Payment method={paymentMethod} onMethod={setPaymentMethod} />}
            {section === "messages" && <Messages />}
            {section === "deliveries" && <Deliveries onPayment={() => setSection("payment")} />}
            {section === "appointments" && <Appointments />}
            {section === "invoice" && <Invoice onPayment={() => setSection("payment")} />}
            {section === "extra" && <ExtraAnalysis />}
          </section>
        </div>
      </main>
      <button className="support-button"><Icon name="message" /><span>Destek</span></button>
    </div>
  );
}

function PanelHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <header className="detail-panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <span>{description}</span>}</div></header>;
}

function Overview({ onPayment }: { onPayment: () => void }) {
  const steps = [
    ["Talep oluşturuldu", "23 Tem · 23:11", "done"], ["Teklif hazırlandı", "24 Tem · 09:18", "current"],
    ["Ödeme", "Bekleniyor", ""], ["Analiz", "Sırada", ""], ["Teslim", "Planlandı", ""],
  ];
  return <div className="detail-stack">
    <section className="overview-status">
      <div><p className="eyebrow light">SONRAKİ ADIM</p><h2>Teklifinizi inceleyip ödemeyi tamamlayın</h2><p>Ödemeniz onaylandığında analiz süreci otomatik olarak başlayacak.</p></div>
      <button onClick={onPayment}>5.000 TL öde <Icon name="arrow" size={16} /></button>
    </section>
    <section className="detail-panel"><PanelHeading eyebrow="SÜREÇ" title="Sipariş durumu" /><div className="detail-timeline">{steps.map(([title,date,state]) => <div className={state} key={title}><span>{state === "done" ? <Icon name="check" size={14} /> : ""}</span><strong>{title}</strong><small>{date}</small></div>)}</div></section>
    <section className="detail-panel"><PanelHeading eyebrow="AYRINTILAR" title="Sipariş bilgileri" /><dl className="detail-facts">
      <div><dt>Sipariş tarihi</dt><dd>23 Temmuz 2026</dd></div><div><dt>Seçilen teslimat</dt><dd>12 saat</dd></div>
      <div><dt>Planlanan teslim</dt><dd>Ödeme sonrası belirlenir</dd></div><div><dt>Toplam ücret</dt><dd>5.000 TL</dd></div>
      <div><dt>Ödeme durumu</dt><dd className="warning">Ödeme bekleniyor</dd></div><div><dt>Teslimat yöntemi</dt><dd>Rapor dosyası + videolu anlatım</dd></div>
    </dl></section>
    <section className="detail-panel"><PanelHeading eyebrow="İLK DOSYALAR" title="Talep sırasında yüklenen dosyalar" /><div className="initial-file"><span className="doc-badge">XLSX</span><div><strong>orneklem_verileri.xlsx</strong><small>1,8 MB · 23 Temmuz 2026</small></div><button><Icon name="download" size={17} />İndir</button></div></section>
  </div>;
}

function Files() {
  return <div className="detail-stack"><section className="detail-panel"><PanelHeading eyebrow="DOSYA PAYLAŞIMI" title="Sipariş Kalemleri" description="Analizde kullanılacak Word ve Excel dosyalarını burada paylaşabilirsiniz." />
    <div className="file-toolbar"><div><button className="active">Tümü · 2</button><button>Benim yüklediklerim · 1</button><button>Uzman dosyaları · 1</button></div><button className="upload-button"><Icon name="upload" size={16} />Dosya yükle</button></div>
    <div className="work-files"><article><span className="doc-badge">XLSX</span><div><strong>orneklem_verileri.xlsx</strong><small>Sizin yüklediğiniz · 23 Temmuz · 1,8 MB</small></div><button><Icon name="download" size={17} /></button></article><article><span className="doc-badge word">DOCX</span><div><strong>analiz_plani.docx</strong><small>Uzman tarafından · Bugün · 420 KB</small></div><button><Icon name="download" size={17} /></button></article></div>
  </section><div className="upload-zone"><Icon name="upload" size={24} /><strong>Dosyanızı buraya bırakın</strong><span>Word veya Excel · En fazla 25 MB</span></div></div>;
}

function Payment({ method, onMethod }: { method: "transfer" | "card"; onMethod: (value: "transfer" | "card") => void }) {
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountState, setDiscountState] = useState<"idle" | "success" | "error">("idle");
  const applyDiscount = () => setDiscountState(discountCode.trim().toLocaleUpperCase("tr") === "EISTATISTIK10" ? "success" : "error");

  return <div className="payment-layout"><section className="detail-panel payment-main"><PanelHeading eyebrow="GÜVENLİ ÖDEME" title="Ödeme yönteminizi seçin" />
    <div className={`discount-entry ${discountOpen ? "open" : ""}`}>
      <button className="discount-trigger" onClick={() => setDiscountOpen(value => !value)} aria-expanded={discountOpen}>
        <span>%</span><strong>İndirim kodu gir</strong><i>{discountOpen ? "−" : "+"}</i>
      </button>
      {discountOpen && <div className="discount-form">
        <label><span>İndirim kodu</span><input value={discountCode} onChange={event => { setDiscountCode(event.target.value); setDiscountState("idle"); }} placeholder="Kodunuzu yazın" /></label>
        <button onClick={applyDiscount} disabled={!discountCode.trim()}>Uygula</button>
        {discountState === "success" && <p className="success">Kod uygulandı. Ödeme özetiniz güncellendi.</p>}
        {discountState === "error" && <p className="error">Bu kod geçerli değil. Kodu kontrol edip tekrar deneyin.</p>}
      </div>}
    </div>
    <div className="payment-tabs"><button className={method === "transfer" ? "active" : ""} onClick={() => onMethod("transfer")}><Icon name="invoice" size={18} />Havale / EFT</button><button className={method === "card" ? "active" : ""} onClick={() => onMethod("card")}><Icon name="card" size={18} />Kredi kartı</button></div>
    {method === "transfer" ? <div className="bank-box"><h3>Banka bilgileri</h3><dl><div><dt>Alıcı</dt><dd>Eİstatistik Akademi Ltd. Şti.</dd></div><div><dt>Banka</dt><dd>Akbank · 19 Mayıs Üniversitesi Şubesi</dd></div><div><dt>IBAN</dt><dd><code>TR64 0004 6013 8988 8000 0143 16</code><button><Icon name="copy" size={15} />Kopyala</button></dd></div><div><dt>Açıklama</dt><dd><code>DS260723008</code><button><Icon name="copy" size={15} />Kopyala</button></dd></div></dl><div className="receipt-upload"><Icon name="upload" size={22} /><div><strong>Dekont yükle</strong><span>PDF, JPG veya PNG · En fazla 10 MB</span></div><button>Dosya seç</button></div></div>
    : <div className="card-form"><label>Kart üzerindeki isim<input placeholder="Ad Soyad" /></label><label>Kart numarası<input placeholder="0000 0000 0000 0000" /></label><div><label>Son kullanma<input placeholder="AA / YY" /></label><label>CVV<input placeholder="•••" /></label></div><p>Ödemeniz 3D Secure ile güvenli şekilde tamamlanır.</p></div>}
    <label className="agreement"><input type="checkbox" />Ön bilgilendirme formunu ve mesafeli satış sözleşmesini okudum, kabul ediyorum.</label>
    <button className="pay-button">{method === "transfer" ? "Ödeme bildirimini gönder" : `${discountState === "success" ? "4.500" : "5.000"} TL öde`} <Icon name="arrow" size={16} /></button>
  </section><aside className="payment-summary"><p className="eyebrow">ÖDEME ÖZETİ</p><h2>Güç analizi danışmanlığı</h2><dl><div><dt>Hizmet bedeli</dt><dd>5.000 TL</dd></div><div><dt>İndirim</dt><dd>{discountState === "success" ? "−500 TL" : "0 TL"}</dd></div><div className="total"><dt>Toplam</dt><dd>{discountState === "success" ? "4.500 TL" : "5.000 TL"}</dd></div></dl><p>Fatura bilgilerinizi ödeme öncesinde Fatura bölümünden düzenleyebilirsiniz.</p></aside></div>;
}

function Messages() {
  return <section className="detail-panel messages-panel"><PanelHeading eyebrow="İLETİŞİM" title="Uzmanınızla yazışmalar" description="Siparişinizle ilgili tüm mesajlar burada saklanır." /><div className="messages-thread"><div className="system-note">Sipariş oluşturuldu · 23 Temmuz, 23:11</div><article className="expert-message"><span>NY</span><div><strong>Dr. Naci Yılmaz <small>Bugün, 09:21</small></strong><p>Merhaba Kerem Bey, dosyanızı inceledim. Analiz öncesinde grup dağılımlarını doğrulamamız gerekiyor.</p></div></article><article className="customer-message"><div><strong>Siz <small>Bugün, 09:34</small></strong><p>Merhaba, güncel Excel dosyasını Sipariş Kalemleri bölümüne ekledim.</p></div></article></div><div className="message-composer"><textarea placeholder="Mesajınızı yazın…" /><div><button><Icon name="plus" size={17} />Dosya ekle</button><span>Mesai saatlerinde ortalama 1 saat içinde yanıtlanır.</span><button className="send">Gönder <Icon name="arrow" size={15} /></button></div></div></section>;
}

function Deliveries({ onPayment }: { onPayment: () => void }) {
  return <section className="detail-panel locked-panel"><PanelHeading eyebrow="TESLİM ALANI" title="Teslimatlar" description="Analiz raporunuz, ek dosyalarınız ve videolu anlatımınız burada yayınlanır." /><div className="locked-state"><span><Icon name="download" size={24} /></span><h3>Analiz henüz başlamadı</h3><p>Teslim dosyalarının hazırlanabilmesi için önce ödemenizi tamamlamanız gerekiyor.</p><button onClick={onPayment}>Ödemeye git <Icon name="arrow" size={16} /></button><div className="delivery-preview"><span><Icon name="file" />Analiz raporu</span><span><Icon name="file" />Sonuç tabloları</span><span><Icon name="video" />Videolu anlatım</span></div></div></section>;
}

function Appointments() {
  return <section className="detail-panel"><PanelHeading eyebrow="GÖRÜŞMELER" title="Randevular" description="Bu siparişe ait görüşmeler dashboard takviminizde de görünür." /><div className="appointment-card"><div className="appointment-date"><strong>30</strong><span>TEM</span></div><div><span>11:00–11:30 · Google Meet</span><h3>Analiz öncesi değerlendirme</h3><p>Dr. Naci Yılmaz ile 30 dakikalık çevrim içi görüşme</p></div><button>Takvime ekle</button></div></section>;
}

function Invoice({ onPayment }: { onPayment: () => void }) {
  return <section className="detail-panel locked-panel"><PanelHeading eyebrow="FATURALANDIRMA" title="Fatura" description="Fatura bilgileriniz ve düzenlenen belgeleriniz." /><div className="invoice-settings"><div><h3>Fatura bilgileri</h3><p>Kerem Murat · Bireysel</p></div><button>Bilgileri düzenle</button></div><div className="locked-state compact"><span><Icon name="invoice" size={23} /></span><h3>Faturanız ödeme sonrasında hazırlanacak</h3><p>Ödeme tamamlandığında PDF faturanız buradan indirilebilir.</p><button onClick={onPayment}>Ödemeye git <Icon name="arrow" size={16} /></button></div></section>;
}

function ExtraAnalysis() {
  return <section className="detail-panel"><PanelHeading eyebrow="TESLİM SONRASI" title="Ek analiz talebi" /><div className="extra-analysis"><Icon name="spark" size={25} /><h3>Sonuçlar için ek bir çalışmaya mı ihtiyacınız var?</h3><p>Talebinizi açıklayın ve gerekiyorsa yeni dosyalar ekleyin. Uzmanınız kapsamı değerlendirip ayrı bir teklif hazırlayacak.</p><button>Ek analiz talep et <Icon name="arrow" size={16} /></button></div></section>;
}
