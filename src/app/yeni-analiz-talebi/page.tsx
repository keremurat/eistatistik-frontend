"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "../components/BrandLogo";
import { CustomerEducationMenu } from "../components/CustomerEducationMenu";
import { NotificationMenu } from "../components/NotificationMenu";
import { ProfileMenu } from "../components/ProfileMenu";

type IconName = "arrow" | "back" | "book" | "chart" | "check" | "clock" | "file" | "home" | "invoice" | "lock" | "message" | "people" | "phone" | "spark" | "target" | "upload";
type RequestFile = { id: string; name: string; size: number };
type RequestFileKind = "excel" | "word" | "powerpoint" | "spss" | "pdf" | "image" | "video" | "archive" | "generic";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /><path d="m3 7 6-4 6 6 6-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2-7 6-7s6 3 6 7" /><circle cx="17" cy="8" r="2" /><path d="M16 14c3 0 5 2 5 6" /></>,
    phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2M9 6h6" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 14v5h14v-5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function RequestFileIcon({ filename }: { filename: string }) {
  const extension = filename.split(".").pop()?.toLocaleLowerCase("tr") ?? "";
  const kind: RequestFileKind =
    ["xls", "xlsx", "csv"].includes(extension) ? "excel" :
    ["doc", "docx", "rtf"].includes(extension) ? "word" :
    ["ppt", "pptx", "pps", "ppsx"].includes(extension) ? "powerpoint" :
    ["sav", "zsav", "sps", "spv", "spo"].includes(extension) ? "spss" :
    extension === "pdf" ? "pdf" :
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension) ? "image" :
    ["mp4", "mov", "avi", "webm"].includes(extension) ? "video" :
    ["zip", "rar", "7z", "tar", "gz"].includes(extension) ? "archive" : "generic";
  const paths: Partial<Record<RequestFileKind, string>> = {
    excel: "/icons/icons8-microsoft-excel-2019-48.png",
    word: "/icons/icons8-microsoft-word-2025-48.png",
    powerpoint: "/icons/icons8-microsoft-powerpoint-2025-48.png",
    spss: "/icons/icons8-spss-50.png",
    pdf: "/icons/icons8-pdf-48.png",
    image: "/icons/icons8-image-file-50.png",
    video: "/icons/icons8-video-48.png",
    archive: "/icons/icons8-winrar-48.png",
  };
  const path = paths[kind];
  if (path) return <span className="request-file-icon"><Image src={path} alt="" width={48} height={48} /></span>;
  return <span className="request-file-icon generic"><Icon name="file" size={23} /></span>;
}

function formatRequestFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;
}

const services = [
  { id: "statistical-analysis", icon: "chart" as IconName, title: "İstatistiksel veri analizi" },
  { id: "power-analysis", icon: "target" as IconName, title: "Power ve örneklem analizi" },
  { id: "mentoring", icon: "people" as IconName, title: "Online mentörlük" },
  { id: "graphical-abstract", icon: "spark" as IconName, title: "Graphical abstract" },
  { id: "proforma-invoice", icon: "invoice" as IconName, title: "Proforma fatura" },
  { id: "academic-mobile-app", icon: "phone" as IconName, title: "Akademik mobil uygulama" },
];

const reportingLabels: Record<string, string> = {
  outputs: "Program çıktıları",
  tables: "Tablolaştırılmış sonuçlar",
  interpreted: "Tablolar ve akademik yorum",
};

const graphicalAbstractReportingLabels: Record<string, string> = {
  powerpoint: "PowerPoint",
};

const graphicalAbstractDeliveryLabels: Record<string, string> = {
  "7d": "7 iş günü",
};

const proformaReportingLabels: Record<string, string> = {
  "proforma-delivery": "Proforma Fatura Gönderimi",
};

const proformaDeliveryLabels: Record<string, string> = {
  "12h": "12 saat",
};

const mobilePlatformLabels: Record<string, string> = {
  ios: "İOS (Iphone/Ipad)",
  android: "Android",
  "cross-platform": "Cross-Platform",
};

const mobileAppReportingLabels: Record<string, string> = {
  discovery: "İhtiyaç Analizi ve Tasarım",
  application: "Mobil Uygulama",
  documentation: "Mobil Uygulama + Akademik Dokümantasyon",
  publishing: "Mobil Uygulama + Store Yayınlama",
  complete: "Tam Araştırma Paketi",
};

const mobileAppDeliveryLabels: Record<string, string> = {
  "3d": "3 iş günü",
  "1w": "1 hafta",
  "2w": "2 hafta",
  "1m": "1 ay",
  "2m": "2 ay",
  "3m": "3 ay",
  "6m": "6 ay",
};

const deliveryLabels: Record<string, string> = {
  "12h": "12 saat",
  "24h": "24 saat",
  "2d": "2 iş günü analiz süresi ve 3. iş günü sonu teslimat",
  "3d": "3 iş günü analiz süresi ve 4. iş günü sonu teslimat",
  "4d": "4 iş günü analiz süresi ve 5. iş günü sonu teslimat",
  "7d": "7 iş günü analiz süresi ve 8. iş günü sonu teslimat",
  "14d": "14 iş günü analiz süresi ve 15. iş günü sonu teslimat",
  "30d": "30 iş günü analiz süresi ve 31. iş günü sonu teslimat",
};

const mentoringDurationLabels: Record<string, string> = {
  "30m": "30 dakika",
  "1h": "1 saat",
  "2h": "2 saat",
  "3h": "3 saat",
  "12h": "12 saat",
};

const mentoringPrices: Record<string, string> = {
  "30m": "3.500,00 TL",
  "1h": "6.650,00 TL",
  "2h": "12.600,00 TL",
  "3h": "16.800,00 TL",
  "12h": "78.050,00 TL",
};

function RequestDropdown({ label, placeholder, value, options, onChange }: {
  label: string;
  placeholder: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const panelId = useId();

  useEffect(() => {
    function closeOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);

  return (
    <div className="form-field request-dropdown-field">
      <label id={`${buttonId}-label`} htmlFor={buttonId}>{label} *</label>
      <div className="cs-wrap request-dropdown" ref={wrapRef}>
        <button id={buttonId} type="button" className={`cs-trigger request-dropdown-trigger${open ? " open" : ""}`} aria-labelledby={`${buttonId}-label ${buttonId}`} aria-controls={panelId} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
          <span className={value ? undefined : "cs-placeholder"}>{options[value] ?? placeholder}</span>
          <span className="cs-arrow" aria-hidden="true">▾</span>
        </button>
        {open && <div id={panelId} className="cs-panel request-dropdown-panel" role="listbox" aria-labelledby={`${buttonId}-label`}>
          {Object.entries(options).map(([optionValue, optionLabel]) => <button type="button" role="option" aria-selected={value === optionValue} className={`cs-option${value === optionValue ? " active" : ""}`} key={optionValue} onClick={() => { onChange(optionValue); setOpen(false); }}><span>{optionLabel}</span>{value === optionValue && <Icon name="check" size={15} />}</button>)}
        </div>}
      </div>
    </div>
  );
}

export default function NewRequestPage() {
  const [selected, setSelected] = useState("statistical-analysis");
  const [title, setTitle] = useState("");
  const [mobilePlatform, setMobilePlatform] = useState("");
  const [reporting, setReporting] = useState("");
  const [delivery, setDelivery] = useState("");
  const [purpose, setPurpose] = useState("");
  const [files, setFiles] = useState<RequestFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (requestedService && services.some((service) => service.id === requestedService)) {
      const selectionTask = window.setTimeout(() => {
        setSelected(requestedService);
        if (requestedService === "graphical-abstract") {
          setReporting("powerpoint");
          setDelivery("7d");
        } else if (requestedService === "proforma-invoice") {
          setReporting("proforma-delivery");
          setDelivery("12h");
        }
      }, 0);
      return () => window.clearTimeout(selectionTask);
    }
  }, []);

  const selectedService = services.find((service) => service.id === selected) ?? services[0];
  const isPowerAnalysis = selected === "power-analysis";
  const isMentoring = selected === "mentoring";
  const isGraphicalAbstract = selected === "graphical-abstract";
  const isProformaInvoice = selected === "proforma-invoice";
  const isAcademicMobileApp = selected === "academic-mobile-app";
  const hasStandardReporting = isPowerAnalysis || isMentoring;
  const selectedReporting = hasStandardReporting ? "standard" : reporting;
  const activeReportingLabels = isGraphicalAbstract ? graphicalAbstractReportingLabels : isProformaInvoice ? proformaReportingLabels : isAcademicMobileApp ? mobileAppReportingLabels : reportingLabels;
  const activeDeliveryLabels = isMentoring ? mentoringDurationLabels : isGraphicalAbstract ? graphicalAbstractDeliveryLabels : isProformaInvoice ? proformaDeliveryLabels : isAcademicMobileApp ? mobileAppDeliveryLabels : deliveryLabels;
  const formValid = Boolean(selected && title.trim() && (!isAcademicMobileApp || mobilePlatform) && selectedReporting && delivery && purpose.trim());

  function addFiles(selectedFiles: File[]) {
    const validFiles = selectedFiles.filter((file) => file.size <= 25 * 1024 * 1024);
    setFiles((current) => {
      const currentIds = new Set(current.map((file) => file.id));
      const additions = validFiles
        .map((file) => ({ id: `${file.name}-${file.size}-${file.lastModified}`, name: file.name, size: file.size }))
        .filter((file) => !currentIds.has(file.id));
      return [...current, ...additions];
    });
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formValid) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <BrandLogo />
        <nav className="main-nav" aria-label="Ana navigasyon">
          <Link href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
          <Link href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <CustomerEducationMenu />
          <Link className="active" href="/hizmetler"><Icon name="spark" size={17} />Hizmetler</Link>
        </nav>
        <div className="top-actions"><a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a><NotificationMenu role="musteri" /><ProfileMenu /></div>
      </header>

      <main className="request-page request-one-page" id="main-content">
        {submitted ? (
          <section className="request-success"><span><Icon name="check" size={28} /></span><p className="eyebrow">TALEBİNİZ ALINDI</p><h1>Uzman değerlendirmesi başladı</h1><p>Talebiniz incelendikten sonra kapsam, ücret ve teslim tarihi hesabınıza bildirilecek.</p><div><strong>Geçici talep numarası</strong><code>TA260724018</code></div><Link href="/siparislerim">Siparişlerime git <Icon name="arrow" size={16} /></Link></section>
        ) : (
          <>
            <div className="request-back-row"><Link className="back-link" href="/hizmetler"><Icon name="back" size={15} />Hizmetlere dön</Link></div>
            <header className="request-one-hero">
              <div><h1>Yeni analiz talebi</h1></div>
              <div className="request-note"><Icon name="clock" size={20} /><div><strong>Ortalama 3 dakika</strong><span>Tüm bilgiler tek seferde alınır</span></div></div>
            </header>

            <form className="request-form-layout request-one-layout" onSubmit={submitRequest}>
              <section className="request-form-panel request-one-form">
                <header className="request-panel-heading"><div><p className="eyebrow">TALEP BİLGİLERİ</p><h2>Çalışmanızın kapsamı</h2></div><span>Zorunlu alanlar *</span></header>

                <div className="form-field">
                  <label>Hizmet *</label>
                  <div className="request-service-select request-service-locked" aria-label={`Seçilen hizmet: ${selectedService.title}`}><span><Icon name={selectedService.icon} size={18} /></span><strong>{selectedService.title}</strong><span className="request-service-lock"><Icon name="lock" size={15} /></span></div>
                </div>

                <div className="form-field"><label htmlFor="request-title">İş başlığı *</label><input id="request-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Örn. Doktora tezimin istatistiksel analizi" required /></div>

                {isAcademicMobileApp && <RequestDropdown label="Mobil uygulama hangi platformlarda çalışacak" placeholder="Platform seçin" value={mobilePlatform} options={mobilePlatformLabels} onChange={setMobilePlatform} />}

                <div className="request-one-fields">
                  {hasStandardReporting ? (
                    <div className="form-field request-fixed-field">
                      <label>Teslim türü *</label>
                      <div className="request-fixed-value" aria-label="Teslim türü: Standart"><strong>Standart</strong><span><Icon name="lock" size={15} /></span></div>
                      {isPowerAnalysis && <p className="request-field-note"><Icon name="message" size={15} />Sipariş Görüşmesinde detaylı bilgi aktarılacaktır.</p>}
                    </div>
                  ) : (
                    <RequestDropdown label="Teslim türü" placeholder="Teslim türünü belirleyin" value={reporting} options={activeReportingLabels} onChange={setReporting} />
                  )}
                  <RequestDropdown label={isMentoring ? "Mentörlük saati" : "Teslim zamanı"} placeholder={isMentoring ? "Mentörlük saatini belirleyin" : "Teslim zamanını belirleyin"} value={delivery} options={activeDeliveryLabels} onChange={setDelivery} />
                </div>

                <div className="form-field"><label htmlFor="request-purpose">Çalışmanızın konusu ve beklentiniz *</label><textarea id="request-purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="Araştırma sorunuzu, veri yapınızı ve analizden beklentinizi kısaca açıklayın." required /></div>

                <div className="request-upload-section">
                  <div><label>Çalışma dosyaları</label><span>İsteğe bağlı · Dosya başına en fazla 25 MB</span></div>
                  <input ref={fileInputRef} className="visually-hidden-file-input" type="file" multiple accept=".doc,.docx,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.pps,.ppsx,.sav,.zsav,.sps,.spv,.spo,.pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.mov,.avi,.webm,.zip,.rar,.7z,.tar,.gz" onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
                  <div className="upload-zone clickable-upload" role="button" tabIndex={0} aria-label="Dosya seç" onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInputRef.current?.click(); } }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(Array.from(event.dataTransfer.files)); }}>
                    <Icon name="file" size={26} /><strong>Dosyaları buraya bırakın</strong><span>Office, SPSS, PDF, görsel, video veya arşiv · En fazla 25 MB</span><span className="upload-drop-btn">{files.length ? "Başka dosya ekle" : "Dosya seç"}</span>
                  </div>
                  <p className="privacy-note">Kişisel veya hassas veri içeren dosyaları yüklemeden önce anonimleştirmenizi öneririz.</p>
                </div>
              </section>

              <aside className="request-file-panel" aria-label="Eklenen dosyalar">
                <header><div><p className="eyebrow">ÇALIŞMA DOSYALARI</p><h2>Eklenen dosyalar</h2></div><span>{files.length}</span></header>
                {files.length > 0 ? (
                  <div className="request-file-list">{files.map((file) => <div key={file.id}><RequestFileIcon filename={file.name} /><span><strong>{file.name}</strong><small>{formatRequestFileSize(file.size)}</small></span><button type="button" onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}>Kaldır</button></div>)}</div>
                ) : (
                  <div className="request-file-empty"><span><Icon name="file" size={22} /></span><strong>Henüz dosya eklenmedi</strong><p>Seçtiğiniz çalışma dosyaları burada listelenir.</p></div>
                )}
              </aside>

              <aside className="request-summary request-one-summary">
                <p className="eyebrow">TALEP ÖZETİ</p>
                <div className="summary-service"><span className="service-icon small"><Icon name={selectedService.icon} size={18} /></span><strong>{selectedService.title}</strong></div>
                <dl>
                  <div><dt>İş başlığı</dt><dd>{title || "Henüz girilmedi"}</dd></div>
                  {isAcademicMobileApp && <div><dt>Platform</dt><dd>{mobilePlatformLabels[mobilePlatform] ?? "Henüz seçilmedi"}</dd></div>}
                  <div><dt>Teslim türü</dt><dd>{hasStandardReporting ? "Standart" : activeReportingLabels[selectedReporting] ?? "Henüz seçilmedi"}</dd></div>
                  <div><dt>{isMentoring ? "Mentörlük saati" : "Teslim zamanı"}</dt><dd>{activeDeliveryLabels[delivery] ?? "Henüz seçilmedi"}</dd></div>
                  <div><dt>Dosyalar</dt><dd>{files.length ? `${files.length} dosya eklendi` : "Dosya eklenmedi"}</dd></div>
                </dl>
                <div className={`request-price-note${isMentoring ? " mentoring-price-note" : ""}`}><span><Icon name="message" size={18} /></span><div><strong>{isMentoring ? "Mentörlük ücreti" : "Ücret bilgisi"}</strong><p>{isMentoring ? mentoringPrices[delivery] ?? "Mentörlük saatini seçtiğinizde ücret burada gösterilir." : "Kapsam uzman tarafından incelendikten sonra net teklif hesabınıza iletilir."}</p></div></div>
                <button className="request-submit-button" type="submit" disabled={!formValid}>Analiz talebini gönder <Icon name="arrow" size={17} /></button>
                {!formValid && <p className="request-submit-hint">Göndermek için zorunlu alanları tamamlayın.</p>}
              </aside>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
