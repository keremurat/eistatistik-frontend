"use client";

import Link from "next/link";
import Image from "next/image";
import { ProfileMenu } from "../../components/ProfileMenu";
import { useEffect, useRef, useState } from "react";

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

type FileKind = "excel" | "word" | "powerpoint" | "spss" | "pdf" | "image" | "video" | "archive" | "generic";

function FileTypeIcon({ filename }: { filename: string }) {
  const extension = filename.split(".").pop()?.toLocaleLowerCase("tr") ?? "";
  const kind: FileKind =
    ["xls", "xlsx", "csv"].includes(extension) ? "excel" :
    ["doc", "docx", "rtf"].includes(extension) ? "word" :
    ["ppt", "pptx", "pps", "ppsx"].includes(extension) ? "powerpoint" :
    ["sav", "zsav", "sps", "spv", "spo"].includes(extension) ? "spss" :
    extension === "pdf" ? "pdf" :
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension) ? "image" :
    ["mp4", "mov", "avi", "webm"].includes(extension) ? "video" :
    ["zip", "rar", "7z", "tar", "gz"].includes(extension) ? "archive" :
    "generic";

  const labels: Record<FileKind, string> = {
    excel: "Microsoft Excel",
    word: "Microsoft Word",
    powerpoint: "Microsoft PowerPoint",
    spss: "IBM SPSS",
    pdf: "PDF",
    image: "Görsel",
    video: "Video",
    archive: "Arşiv",
    generic: "Dosya",
  };

  const iconPaths: Partial<Record<FileKind, string>> = {
    excel: "/icons/icons8-microsoft-excel-2019-48.png",
    word: "/icons/icons8-microsoft-word-2025-48.png",
    powerpoint: "/icons/icons8-microsoft-powerpoint-2025-48.png",
    spss: "/icons/icons8-spss-50.png",
    pdf: "/icons/icons8-pdf-48.png",
    image: "/icons/icons8-image-file-50.png",
    video: "/icons/icons8-video-48.png",
    archive: "/icons/icons8-winrar-48.png",
  };
  const iconPath = iconPaths[kind];

  if (iconPath) {
    return (
      <span className="provided-file-icon" aria-label={`${labels[kind]} dosyası`} title={`${labels[kind]} dosyası`}>
        <Image src={iconPath} alt="" width={50} height={50} />
      </span>
    );
  }

  return (
    <span className="file-type-icon generic" aria-label="Dosya" title="Dosya">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path className="file-sheet" d="M6 2.75h8l4 4V21.25H6z" />
        <path className="file-fold" d="M14 2.75v4h4" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    </span>
  );
}

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
    <section className="detail-panel"><PanelHeading eyebrow="İLK DOSYALAR" title="Talep sırasında yüklenen dosyalar" /><div className="initial-file"><FileTypeIcon filename="orneklem_verileri.xlsx" /><div><strong>orneklem_verileri.xlsx</strong><small>1,8 MB · 23 Temmuz 2026</small></div><button><Icon name="download" size={17} />İndir</button></div></section>
  </div>;
}

function Files() {
  const [fileFilter, setFileFilter] = useState<"all" | "customer" | "expert">("all");
  const [workFiles, setWorkFiles] = useState([
    { name: "orneklem_verileri.xlsx", owner: "customer" as const, meta: "Sizin yüklediğiniz · 23 Temmuz · 1,8 MB" },
    { name: "analiz_plani.docx", owner: "expert" as const, meta: "Uzman tarafından · Bugün · 420 KB" },
  ]);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visibleFiles = workFiles.filter((file) => fileFilter === "all" || file.owner === fileFilter);
  const customerFileCount = workFiles.filter((file) => file.owner === "customer").length;
  const expertFileCount = workFiles.filter((file) => file.owner === "expert").length;

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;
  }

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    const acceptedExtensions = [
      "doc", "docx", "rtf",
      "xls", "xlsx", "csv",
      "ppt", "pptx", "pps", "ppsx",
      "sav", "zsav", "sps", "spv", "spo",
      "pdf",
      "jpg", "jpeg", "png", "gif", "webp", "svg",
      "mp4", "mov", "avi", "webm",
      "zip", "rar", "7z", "tar", "gz",
    ];
    const validFiles = selectedFiles.filter((file) => {
      const extension = file.name.split(".").pop()?.toLocaleLowerCase("tr") ?? "";
      return acceptedExtensions.includes(extension) && file.size <= 25 * 1024 * 1024;
    });

    if (validFiles.length) {
      setWorkFiles((current) => [
        ...validFiles.map((file) => ({
          name: file.name,
          owner: "customer" as const,
          meta: `Sizin yüklediğiniz · Şimdi · ${formatFileSize(file.size)}`,
        })),
        ...current,
      ]);
      setFileFilter("customer");
      setUploadMessage({ type: "success", text: `${validFiles.length} dosya başarıyla listeye eklendi.` });
    }

    if (validFiles.length !== selectedFiles.length) {
      setUploadMessage({ type: "error", text: "Bazı dosyalar desteklenmiyor veya 25 MB sınırını aşıyor." });
    }

    event.target.value = "";
  }

  return <div className="detail-stack"><section className="detail-panel"><PanelHeading eyebrow="DOSYA PAYLAŞIMI" title="Sipariş Kalemleri" description="Analizde kullanılacak çalışma, veri, sunum, görsel ve arşiv dosyalarını burada paylaşabilirsiniz." />
    <div className="file-toolbar"><div role="group" aria-label="Dosyaları filtrele"><button className={fileFilter === "all" ? "active" : ""} onClick={() => setFileFilter("all")} aria-pressed={fileFilter === "all"}>Tümü · {workFiles.length}</button><button className={fileFilter === "customer" ? "active" : ""} onClick={() => setFileFilter("customer")} aria-pressed={fileFilter === "customer"}>Benim yüklediklerim · {customerFileCount}</button><button className={fileFilter === "expert" ? "active" : ""} onClick={() => setFileFilter("expert")} aria-pressed={fileFilter === "expert"}>Uzman dosyaları · {expertFileCount}</button></div><input ref={fileInputRef} className="visually-hidden-file-input" type="file" multiple accept=".doc,.docx,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.pps,.ppsx,.sav,.zsav,.sps,.spv,.spo,.pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.mov,.avi,.webm,.zip,.rar,.7z,.tar,.gz" onChange={handleFileSelection} /><button className="upload-button" type="button" onClick={() => fileInputRef.current?.click()}><Icon name="upload" size={16} />Dosya yükle</button></div>
    {uploadMessage && <p className={`file-upload-message ${uploadMessage.type}`} role="status">{uploadMessage.text}</p>}
    <div className="work-files">{visibleFiles.map((file, index) => <article key={`${file.owner}-${file.name}-${index}`}><FileTypeIcon filename={file.name} /><div><strong>{file.name}</strong><small>{file.meta}</small></div><button aria-label={`${file.name} dosyasını indir`}><Icon name="download" size={17} /></button></article>)}</div>
  </section><div className="upload-zone"><Icon name="upload" size={24} /><strong>Dosyanızı buraya bırakın</strong><span>Office, SPSS, PDF, görsel, video veya arşiv · En fazla 25 MB</span></div></div>;
}

function Payment({ method, onMethod }: { method: "transfer" | "card"; onMethod: (value: "transfer" | "card") => void }) {
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountState, setDiscountState] = useState<"idle" | "success" | "error">("idle");
  const [cardAgreementOpen, setCardAgreementOpen] = useState(false);
  const [cardAgreementAccepted, setCardAgreementAccepted] = useState(false);
  const [transferAgreementOpen, setTransferAgreementOpen] = useState(false);
  const [transferAgreementAccepted, setTransferAgreementAccepted] = useState(false);
  const applyDiscount = () => setDiscountState(discountCode.trim().toLocaleUpperCase("tr") === "EISTATISTIK10" ? "success" : "error");

  return <div className="payment-layout"><section className="detail-panel payment-main"><PanelHeading eyebrow="GÜVENLİ ÖDEME" title={method === "transfer" ? "Havale / EFT ile ödeme" : "Kredi kartı ile ödeme"} description={method === "transfer" ? "Aşağıdaki banka bilgilerini kullanarak ödemenizi tamamlayın ve dekontunuzu yükleyin." : "Kart bilgilerinizi güvenli ödeme alanına girin."} />
    {method === "transfer" ? <>
      <div className="bank-box"><h3>Banka bilgileri</h3><dl><div><dt>Adı Soyadı</dt><dd>Naci MURAT</dd></div><div><dt>Banka</dt><dd>Akbank (0046) — 19 Mayıs Üniversitesi Şubesi (01389)</dd></div><div><dt>Hesap No</dt><dd><code>0014316</code></dd></div><div><dt>IBAN</dt><dd><code>TR64 0004 6013 8988 8000 0143 16</code><button><Icon name="copy" size={15} />Kopyala</button></dd></div><div><dt>Açıklama</dt><dd><code>DS260723008</code><button><Icon name="copy" size={15} />Kopyala</button></dd></div></dl><div className="receipt-upload"><Icon name="upload" size={22} /><div><strong>Dekont yükle</strong><span>PDF, JPG veya PNG · En fazla 10 MB</span></div><button>Dosya seç</button></div></div>
      <button className={`payment-contract-consent ${transferAgreementAccepted ? "accepted" : ""}`} type="button" onClick={() => setTransferAgreementOpen(true)}>
        <span>{transferAgreementAccepted ? <Icon name="check" size={15} /> : ""}</span>
        <strong><u>Sözleşmeyi</u> okudum ve kabul ediyorum.</strong>
        <i>{transferAgreementAccepted ? "Onaylandı" : "İncele"}</i>
      </button>
      <button className="pay-button" disabled={!transferAgreementAccepted}>Ödeme bildirimini gönder <Icon name="arrow" size={16} /></button>
    </> : <>
      <div className="secure-card-redirect">
        <span><Icon name="card" size={25} /></span>
        <div><p className="eyebrow">AKBANK 3D SECURE</p><h3>Ödemeniz Akbank güvencesiyle tamamlanacak</h3><p>Sonraki ekranda 3D güvenlikli Akbank Ortak Ödeme sayfasına yönlendirileceksiniz. Gerekli ve geçerli kart bilgilerini girdikten sonra tekrar EİSTATİSTİK sistemine geri döndürüleceksiniz.</p></div>
      </div>
      <button className={`payment-contract-consent ${cardAgreementAccepted ? "accepted" : ""}`} type="button" onClick={() => setCardAgreementOpen(true)}>
        <span>{cardAgreementAccepted ? <Icon name="check" size={15} /> : ""}</span>
        <strong><u>Sözleşmeyi</u> okudum ve kabul ediyorum.</strong>
        <i>{cardAgreementAccepted ? "Onaylandı" : "İncele"}</i>
      </button>
      <div className="payment-privacy-note"><Icon name="card" size={17} /><span>Kart bilgileriniz EİSTATİSTİK tarafından alınmaz veya kaydedilmez.</span></div>
      <button className="pay-button" disabled={!cardAgreementAccepted}>Kredi Kartı ile Ödeme Yap <Icon name="arrow" size={16} /></button>
    </>}
  </section><aside className="payment-summary">
    <p className="eyebrow">ÖDEME ÖZETİ</p>
    <h2>Güç analizi danışmanlığı</h2>
    <dl className="payment-price-lines"><div><dt>Hizmet bedeli</dt><dd>5.000 TL</dd></div><div><dt>İndirim</dt><dd className={discountState === "success" ? "discounted" : ""}>{discountState === "success" ? "−500 TL" : "0 TL"}</dd></div></dl>
    <div className={`discount-entry summary-discount ${discountOpen ? "open" : ""}`}>
      <button className="discount-trigger" onClick={() => setDiscountOpen(value => !value)} aria-expanded={discountOpen}>
        <span>%</span><strong>İndirim kodu gir</strong><i>{discountOpen ? "−" : "+"}</i>
      </button>
      {discountOpen && <div className="discount-form">
        <label><span>İndirim kodu</span><input value={discountCode} onChange={event => { setDiscountCode(event.target.value); setDiscountState("idle"); }} placeholder="Kodunuzu yazın" /></label>
        <button onClick={applyDiscount} disabled={!discountCode.trim()}>Uygula</button>
        {discountState === "success" && <p className="success">Kod uygulandı.</p>}
        {discountState === "error" && <p className="error">Kod geçerli değil.</p>}
      </div>}
    </div>
    <dl className="payment-total"><div className="total"><dt>Toplam</dt><dd>{discountState === "success" ? "4.500 TL" : "5.000 TL"}</dd></div></dl>
    <div className="summary-payment-methods">
      <p>ÖDEME YÖNTEMİ</p>
      <div className="payment-tabs"><button className={method === "transfer" ? "active" : ""} onClick={() => onMethod("transfer")}><Icon name="invoice" size={18} /><span>Havale / EFT</span><small>Manuel onay</small></button><button className={method === "card" ? "active" : ""} onClick={() => onMethod("card")}><Icon name="card" size={18} /><span>Kredi kartı</span><small>3D Secure</small></button></div>
    </div>
    <p>Fatura bilgilerinizi ödeme öncesinde Fatura bölümünden düzenleyebilirsiniz.</p>
  </aside>
  {cardAgreementOpen && <PaymentAgreementModal context="card" onClose={() => setCardAgreementOpen(false)} onAccept={() => { setCardAgreementAccepted(true); setCardAgreementOpen(false); }} />}
  {transferAgreementOpen && <PaymentAgreementModal context="transfer" onClose={() => setTransferAgreementOpen(false)} onAccept={() => { setTransferAgreementAccepted(true); setTransferAgreementOpen(false); }} />}
  </div>;
}

function PaymentAgreementModal({ context, onClose, onAccept }: { context: "card" | "transfer"; onClose: () => void; onAccept: () => void }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/legal/uyelik-sozlesmesi.txt")
      .then((response) => response.text())
      .then((text) => {
        if (active) {
          setContent(text);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function handleScroll() {
    const element = contentRef.current;
    if (!element) return;
    const scrollableDistance = element.scrollHeight - element.clientHeight;
    const nextProgress = scrollableDistance <= 0 ? 100 : Math.min(100, Math.max(0, (element.scrollTop / scrollableDistance) * 100));
    setProgress(nextProgress);
    if (nextProgress >= 99 || scrollableDistance <= 0) setReachedEnd(true);
  }

  return <div className="legal-modal-backdrop" role="presentation">
    <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="payment-contract-title">
      <header><div><p>{context === "transfer" ? "HAVALE / EFT ÖNCESİ ONAY" : "KREDİ KARTI ÖNCESİ ONAY"}</p><h2 id="payment-contract-title">Sözleşme ve Kullanım Koşulları</h2></div><button onClick={onClose} aria-label="Pencereyi kapat">×</button></header>
      <div className="legal-scroll-progress" role="progressbar" aria-label="Sözleşme okuma ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }} /></div>
      <div className="legal-document-content" ref={contentRef} onScroll={handleScroll} tabIndex={0}>
        {loading ? <div className="legal-loading">Sözleşme yükleniyor…</div> : <pre>{content}</pre>}
      </div>
      <footer><div><Icon name="card" size={18} /><span>{reachedEnd ? "Belgenin sonuna ulaştınız." : "Kabul edebilmek için belgenin sonuna kadar ilerleyin."}</span></div><div><button className="legal-cancel" onClick={onClose}>Vazgeç</button><button className="legal-accept" onClick={onAccept} disabled={!reachedEnd}>Okudum ve kabul ediyorum</button></div></footer>
    </section>
  </div>;
}

function Messages() {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);

  function sendMessage() {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;
    setSentMessages((current) => [...current, cleanMessage]);
    setMessage("");
  }

  return <section className="detail-panel messages-panel">
    <PanelHeading eyebrow="İLETİŞİM VE HAREKETLER" title="Sipariş yazışmaları" description="Mesajlarınız ve siparişinizdeki önemli değişiklikler tek bir kronolojide tutulur." />
    <div className="message-guidance">
      <span><Icon name="message" size={19} /></span>
      <div><strong>Yeni analiz talepleri için ayrı talep oluşturun</strong><p>Bu alan mevcut siparişinizle ilgili soru, dosya ve bilgilendirmeler içindir.</p></div>
      <Link href="/yeni-analiz-talebi">Yeni analiz talebi <Icon name="arrow" size={14} /></Link>
    </div>
    <div className="message-composer">
      <label htmlFor="order-message">Mesajınız</label>
      <textarea id="order-message" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) sendMessage(); }} placeholder="Uzmanınıza mesajınızı yazın…" />
      <div><button className="send" type="button" onClick={sendMessage} disabled={!message.trim()}>Gönder <Icon name="arrow" size={15} /></button></div>
    </div>
    <div className="response-expectation"><Icon name="clock" size={16} /><span><strong>Yanıt süresi:</strong> Mesai saatlerinde ortalama 1 saat.</span></div>
    <div className="messages-thread">
      <div className="thread-day"><span>Bugün</span></div>
      {[...sentMessages].reverse().map((sentMessage, index) => <article className="customer-message sent" key={`${sentMessage}-${index}`}><div><strong>Siz <small>Şimdi</small></strong><p>{sentMessage}</p><span className="message-delivery"><Icon name="check" size={12} />Gönderildi</span></div></article>)}
      <div className="system-note"><Icon name="upload" size={13} />orneklem_verileri.xlsx dosyası Sipariş Kalemleri’ne eklendi <time>09:35</time></div>
      <article className="customer-message"><div><strong>Siz <small>09:34</small></strong><p>Merhaba, güncel Excel dosyasını Sipariş Kalemleri bölümüne ekledim.</p></div></article>
      <article className="expert-message"><span>NY</span><div><strong>Dr. Naci Yılmaz <small>09:21</small></strong><p>Merhaba Kerem Bey, dosyanızı inceledim. Analiz öncesinde grup dağılımlarını doğrulamamız gerekiyor.</p></div></article>
      <div className="thread-day"><span>24 Temmuz 2026</span></div>
      <details className="system-event offer-event">
        <summary><span className="system-event-marker"><Icon name="card" size={14} /></span><div><small>SİSTEM HAREKETİ</small><strong>Ücret teklifi hazırlandı</strong><time>09:18</time></div><i>Ayrıntılar</i></summary>
        <dl><div><dt>Teklif tutarı</dt><dd>5.000 TL</dd></div><div><dt>Durum</dt><dd>Onayınız ve ödemeniz bekleniyor</dd></div></dl>
      </details>
      <div className="thread-day"><span>23 Temmuz 2026</span></div>
      <details className="system-event" open>
        <summary><span className="system-event-marker"><Icon name="check" size={14} /></span><div><small>SİSTEM HAREKETİ</small><strong>Sipariş oluşturuldu</strong><time>23:11</time></div><i>Ayrıntılar</i></summary>
        <dl><div><dt>Hizmet</dt><dd>Power ve örneklem analizi</dd></div><div><dt>Seçilen teslimat</dt><dd>12 saat</dd></div><div><dt>Teslim şekli</dt><dd>Rapor + videolu anlatım</dd></div></dl>
      </details>
    </div>
  </section>;
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
