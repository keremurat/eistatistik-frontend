"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ProfileMenu } from "../components/ProfileMenu";

type Category = "all" | "analysis" | "consulting" | "presentation" | "other";
type IconName = "arrow" | "back" | "bell" | "book" | "chart" | "check" | "clock" | "file" | "home" | "invoice" | "message" | "people" | "phone" | "plus" | "search" | "spark" | "target";
type RequestFile = { id: string; name: string; size: number };
type RequestFileKind = "excel" | "word" | "powerpoint" | "spss" | "pdf" | "image" | "video" | "archive" | "generic";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /><path d="m3 7 6-4 6 6 6-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2-7 6-7s6 3 6 7" /><circle cx="17" cy="8" r="2" /><path d="M16 14c3 0 5 2 5 6" /></>,
    phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2M9 6h6" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
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
    ["zip", "rar", "7z", "tar", "gz"].includes(extension) ? "archive" :
    "generic";
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
  {
    id: "statistical-analysis",
    category: "analysis" as const,
    icon: "chart" as IconName,
    illustration: "/service-illustrations/statistical-analysis-v2.png",
    eyebrow: "ANALİZ VE ARAŞTIRMA",
    title: "İstatistiksel veri analizi",
    description: "Tez, makale veya araştırmanızdaki veriler analiz edilir; sonuçlar akademik standartlara uygun şekilde raporlanır.",
    outputs: ["Analiz raporu", "Sonuç tabloları", "Videolu anlatım"],
    fit: "Tez, makale ve bilimsel araştırmalar için",
  },
  {
    id: "power-analysis",
    category: "analysis" as const,
    icon: "target" as IconName,
    illustration: "/service-illustrations/power-analysis-v2.png",
    eyebrow: "ANALİZ VE ARAŞTIRMA",
    title: "Power ve örneklem analizi",
    description: "Araştırmanız için gerekli örneklem büyüklüğü veya mevcut çalışmanızın istatistiksel gücü hesaplanır.",
    outputs: ["Power raporu", "Örneklem hesabı", "Yöntem açıklaması"],
    fit: "Araştırma planlama ve etik kurul başvuruları için",
  },
  {
    id: "mentoring",
    category: "consulting" as const,
    icon: "people" as IconName,
    illustration: "/service-illustrations/mentoring-v2.png",
    eyebrow: "DANIŞMANLIK",
    title: "Online mentörlük",
    description: "Analiz yöntemi, bulguların yorumlanması veya akademik süreçle ilgili uzmanla birebir çevrim içi çalışın.",
    outputs: ["Birebir görüşme", "Yol haritası", "Görüşme notları"],
    fit: "Sürecini uzmanla birlikte yürütmek isteyenler için",
  },
  {
    id: "graphical-abstract",
    category: "presentation" as const,
    icon: "spark" as IconName,
    illustration: "/service-illustrations/graphical-abstract-v2.png",
    eyebrow: "AKADEMİK SUNUM",
    title: "Graphical abstract",
    description: "Çalışmanızın yöntemini ve temel bulgularını dergi standartlarına uygun tek bir görsel anlatıma dönüştürün.",
    outputs: ["Yayın kalitesinde görsel", "Revizyon", "Kaynak dosya"],
    fit: "Makale gönderimi ve akademik sunumlar için",
  },
  {
    id: "proforma-invoice",
    category: "other" as const,
    icon: "invoice" as IconName,
    illustration: "/service-illustrations/proforma-invoice-v2.png",
    eyebrow: "FİNANSAL BELGE",
    title: "Proforma fatura",
    description: "Kurum, proje veya bütçe onayı süreçleriniz için hizmet kapsamını ve ücret bilgisini içeren proforma fatura talep edin.",
    outputs: ["Kurumsal proforma", "Hizmet dökümü", "PDF belge"],
    fit: "Kurum ödemesi ve bütçe onayı gereken siparişler için",
  },
  {
    id: "academic-mobile-app",
    category: "other" as const,
    icon: "phone" as IconName,
    illustration: "/service-illustrations/academic-mobile-app-v2.png",
    eyebrow: "DİJİTAL ÜRÜN",
    title: "Akademik mobil uygulama",
    description: "Akademik çalışmalarınıza yönelik mobil uygulama ihtiyacınızı paylaşın; kapsam ve geliştirme planı birlikte oluşturulsun.",
    outputs: ["İhtiyaç analizi", "Kapsam planı", "Teknik değerlendirme"],
    fit: "Araştırma ve akademik projeler için özel mobil çözüm",
  },
];

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "Tüm hizmetler" },
  { key: "analysis", label: "Analiz ve araştırma" },
  { key: "consulting", label: "Danışmanlık" },
  { key: "presentation", label: "Akademik sunum" },
  { key: "other", label: "Diğer hizmetler" },
];
const reportingLabels: Record<string, string> = {
  outputs: "Program çıktıları",
  tables: "Tablolaştırılmış sonuçlar",
  interpreted: "Tablolar ve akademik yorum",
};
const deliveryLabels: Record<string, string> = {
  "12h": "12 saat",
  "24h": "24 saat",
  "3d": "3 iş günü",
  "7d": "7 iş günü",
};

export default function NewRequestPage() {
  const [category, setCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (requestedService && services.some((service) => service.id === requestedService)) {
      const selectionTask = window.setTimeout(() => setSelected(requestedService), 0);
      return () => window.clearTimeout(selectionTask);
    }
  }, []);
  const [files, setFiles] = useState<RequestFile[]>([]);
  const [reporting, setReporting] = useState("");
  const [delivery, setDelivery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const visibleServices = useMemo(() => services.filter(service => category === "all" || service.category === category), [category]);
  const selectedService = services.find(service => service.id === selected);
  const workInfoValid = title.trim() && studyType && academicLevel && purpose.trim();
  const deliveryValid = reporting && delivery;
  const stepLabels = ["Hizmet", "Çalışma bilgileri", "Dosyalar", "Teslimat", "Onay"];

  function goTo(nextStep: number) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/dashboard" aria-label="Eİstatistik ana sayfa"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority /></Link>
        <nav className="main-nav">
          <Link href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
          <Link href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <Link href="/egitimler"><Icon name="book" size={17} />Eğitimlerim</Link>
          <a className="active" href="#"><Icon name="spark" size={17} />Hizmetler</a>
        </nav>
        <div className="top-actions"><a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a><button className="icon-button" aria-label="Bildirimler"><Icon name="bell" /><span className="notification-dot">2</span></button><ProfileMenu /></div>
      </header>

      <main className="request-page">
        <Link className="back-link" href="/siparislerim"><Icon name="back" size={16} />Siparişlerime dön</Link>
        <div className="request-progress" aria-label="Talep oluşturma adımları">
          {stepLabels.map((label, index) => <div className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""} key={label}><button onClick={() => index + 1 < step && goTo(index + 1)}><span>{step > index + 1 ? <Icon name="check" size={12} /> : index + 1}</span><strong>{label}</strong></button>{index < stepLabels.length - 1 && <i />}</div>)}
        </div>

        {step === 1 && <><RequestHero step={1} title="Nasıl yardımcı olabiliriz?" description="İhtiyacınıza en uygun hizmeti seçin. Sonraki adımda çalışmanızın ayrıntılarını birlikte netleştireceğiz." />
          <nav className="service-categories" aria-label="Hizmet kategorileri">{categories.map(item => <button key={item.key} className={category === item.key ? "active" : ""} onClick={() => setCategory(item.key)}>{item.label}</button>)}</nav>
          <section className="service-grid">{visibleServices.map(service => <article key={service.id} className={`service-card ${selected === service.id ? "selected" : ""}`}><button className="service-select-overlay" onClick={() => setSelected(service.id)} aria-label={`${service.title} hizmetini seç`} /><div className="service-illustration"><Image src={service.illustration} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" /><span className="selection-mark">{selected === service.id ? <Icon name="check" size={15} /> : ""}</span></div><p className="eyebrow">{service.eyebrow}</p><h2>{service.title}</h2><p className="service-description">{service.description}</p><div className="service-fit">{service.fit}</div><ul>{service.outputs.map(output => <li key={output}><Icon name="check" size={13} />{output}</li>)}</ul><div className="service-card-action"><span>{selected === service.id ? "Seçildi" : "Bu hizmeti seç"}</span><Icon name="arrow" size={16} /></div></article>)}</section>
          <section className="guidance-panel"><span className="guidance-icon"><Icon name="message" size={23} /></span><div><p className="eyebrow light">KARAR VEREMEDİNİZ Mİ?</p><h2>Çalışmanızı kısaca anlatın, doğru hizmeti birlikte belirleyelim.</h2><p>Uzman ekibimiz talebinizi inceleyip sizi uygun hizmete yönlendirsin.</p></div><button>Yönlendirme iste <Icon name="arrow" size={16} /></button></section>
          <ActionBar service={selectedService} label="Çalışma bilgilerine devam et" disabled={!selectedService} onNext={() => goTo(2)} /></>}

        {step === 2 && <><RequestHero step={2} title="Çalışmanızı tanıyalım" description="Uzmanımızın kapsamı doğru değerlendirebilmesi için çalışmanızla ilgili temel bilgileri paylaşın." />
          <div className="request-form-layout"><section className="request-form-panel"><div className="selected-service-line"><span className="service-icon small"><Icon name={selectedService?.icon ?? "chart"} size={18} /></span><div><small>SEÇİLEN HİZMET</small><strong>{selectedService?.title}</strong></div><button onClick={() => goTo(1)}>Değiştir</button></div>
            <div className="form-field"><label>Çalışmanızın kısa adı *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn. Hemşirelerde tükenmişlik düzeyi araştırması" /></div>
            <ChoiceField label="Çalışma türü *" options={["Tez", "Makale", "Araştırma projesi", "Diğer"]} value={studyType} onChange={setStudyType} />
            <ChoiceField label="Akademik seviye *" options={["Lisans", "Yüksek lisans", "Doktora", "Akademik yayın"]} value={academicLevel} onChange={setAcademicLevel} />
            <div className="form-field"><label>Çalışmanızın konusu ve amacı *</label><textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Araştırma sorunuzu, amacınızı ve analizden beklentinizi kısaca açıklayın." /></div>
            <div className="form-field"><label>Eklemek istediğiniz notlar</label><textarea className="small" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Uzmanımızın bilmesi gereken ek bir detay varsa yazabilirsiniz." /></div>
          </section><RequestSummary service={selectedService} items={[["Çalışma türü", studyType], ["Akademik seviye", academicLevel]]} /></div>
          <StepActions back={() => goTo(1)} next={() => goTo(3)} disabled={!workInfoValid} label="Dosyalara devam et" /></>}

        {step === 3 && <><RequestHero step={3} title="Dosyalarınızı ekleyin" description="Analizde kullanılacak veri ve dokümanları yükleyin. Daha sonra Sipariş Kalemleri bölümünden yeni dosya ekleyebilirsiniz." />
          <div className="request-form-layout"><section className="request-form-panel file-step"><div className="request-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(Array.from(event.dataTransfer.files)); }}><Icon name="file" size={26} /><h2>Dosyalarınızı buraya bırakın</h2><p>Office, SPSS, PDF, görsel, video veya arşiv · Dosya başına en fazla 25 MB</p><label><input type="file" multiple accept=".doc,.docx,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.pps,.ppsx,.sav,.zsav,.sps,.spv,.spo,.pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.mov,.avi,.webm,.zip,.rar,.7z,.tar,.gz" onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} />{files.length ? "Başka dosya ekle" : "Dosya seç"}</label></div>
            {files.length > 0 && <div className="request-file-list">{files.map(file => <div key={file.id}><RequestFileIcon filename={file.name} /><span><strong>{file.name}</strong><small>{formatRequestFileSize(file.size)}</small></span><button type="button" onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}>Kaldır</button></div>)}</div>}
            <p className="privacy-note">Kişisel veya hassas veri içeren dosyaları yüklemeden önce anonimleştirmenizi öneririz.</p>
          </section><RequestSummary service={selectedService} items={[["Çalışma", title], ["Yüklenen dosya", `${files.length} dosya`]]} /></div>
          <StepActions back={() => goTo(2)} next={() => goTo(4)} disabled={false} label={files.length ? "Teslimata devam et" : "Dosya eklemeden devam et"} /></>}

        {step === 4 && <><RequestHero step={4} title="Teslimat tercihlerinizi belirleyin" description="Analiz sonuçlarını hangi kapsamda ve ne kadar sürede teslim almak istediğinizi seçin." />
          <div className="request-form-layout"><section className="request-form-panel"><SelectionCards title="Raporlama kapsamı *" value={reporting} onChange={setReporting} options={[["outputs","Program çıktıları","Ham program çıktıları teslim edilir."],["tables","Tablolaştırılmış sonuçlar","Sonuçlar akademik tablolara dönüştürülür."],["interpreted","Tablolar ve akademik yorum","Sonuçlar tablolaştırılır ve araştırma bağlamında yorumlanır."]]} />
            <SelectionCards title="Teslimat süresi *" value={delivery} onChange={setDelivery} options={[["12h","12 saat","Ödeme onayından sonra 12 saat içinde teslim."],["24h","24 saat","Ödeme onayından sonra 24 saat içinde teslim."],["3d","3 iş günü","2 iş günü analiz, 3. iş günü sonunda teslim."],["7d","7 iş günü","6 iş günü analiz, 7. iş günü sonunda teslim."]]} />
          </section><RequestSummary service={selectedService} items={[["Raporlama", reportingLabels[reporting] ?? ""],["Teslimat", deliveryLabels[delivery] ?? ""],["Ücret", "Uzman incelemesi sonrası"]]} /></div>
          <StepActions back={() => goTo(3)} next={() => goTo(5)} disabled={!deliveryValid} label="Talebi gözden geçir" /></>}

        {step === 5 && !submitted && <><RequestHero step={5} title="Talebinizi gözden geçirin" description="Göndermeden önce hizmet, çalışma ve teslimat bilgilerinizi son kez kontrol edin." />
          <section className="review-panel"><ReviewSection title="Hizmet" edit={() => goTo(1)} rows={[["Seçilen hizmet", selectedService?.title ?? ""]]}/><ReviewSection title="Çalışma bilgileri" edit={() => goTo(2)} rows={[["Çalışmanın kısa adı",title],["Çalışma türü",studyType],["Akademik seviye",academicLevel],["Çalışmanın amacı",purpose]]}/><ReviewFilesSection files={files} edit={() => goTo(3)} /><ReviewSection title="Teslimat" edit={() => goTo(4)} rows={[["Raporlama kapsamı",reportingLabels[reporting]],["Teslimat süresi",deliveryLabels[delivery]],["Ücretlendirme","Uzman değerlendirmesi sonrasında bildirilecek"]]}/></section>
          <StepActions back={() => goTo(4)} next={() => setSubmitted(true)} disabled={false} label="Analiz talebini gönder" /></>}

        {step === 5 && submitted && <section className="request-success"><span><Icon name="check" size={28} /></span><p className="eyebrow">TALEBİNİZ ALINDI</p><h1>Uzman değerlendirmesi başladı</h1><p>Talebiniz incelendikten sonra kapsam, ücret ve teslim tarihi hesabınıza bildirilecek.</p><div><strong>Geçici talep numarası</strong><code>TA260724018</code></div><Link href="/siparislerim">Siparişlerime git <Icon name="arrow" size={16} /></Link></section>}
      </main>
      <button className="support-button"><Icon name="message" /><span>Destek</span></button>
    </div>
  );
}

function RequestHero({ step, title, description }: { step: number; title: string; description: string }) {
  return <header className="request-hero"><div><p className="eyebrow">YENİ TALEP · {step}. ADIM</p><h1>{title}</h1><p>{description}</p></div><div className="request-note"><Icon name="clock" size={20} /><div><strong>Bilgileriniz korunuyor</strong><span>Önceki adımlara dönebilirsiniz</span></div></div></header>;
}

function ChoiceField({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset className="choice-field"><legend>{label}</legend><div>{options.map(option => <button type="button" key={option} className={value === option ? "active" : ""} onClick={() => onChange(option)}>{value === option && <Icon name="check" size={13} />}{option}</button>)}</div></fieldset>;
}

function RequestSummary({ service, items }: { service: typeof services[number] | undefined; items: [string,string][] }) {
  return <aside className="request-summary"><p className="eyebrow">TALEP ÖZETİ</p><div className="summary-service"><span className="service-icon small"><Icon name={service?.icon ?? "chart"} size={18} /></span><strong>{service?.title}</strong></div><dl>{items.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value || "Henüz seçilmedi"}</dd></div>)}</dl></aside>;
}

function StepActions({ back, next, disabled, label }: { back: () => void; next: () => void; disabled: boolean; label: string }) {
  return <div className="step-actions"><button onClick={back}><Icon name="back" size={16} />Geri</button><button className="next" onClick={next} disabled={disabled}>{label}<Icon name="arrow" size={16} /></button></div>;
}

function ActionBar({ service, label, disabled, onNext }: { service: typeof services[number] | undefined; label: string; disabled: boolean; onNext: () => void }) {
  return <div className={`request-action-bar ${service ? "visible" : ""}`}><div>{service && <><span className="service-icon small"><Icon name={service.icon} size={18} /></span><span><small>SEÇİLEN HİZMET</small><strong>{service.title}</strong></span></>}</div><button disabled={disabled} onClick={onNext}>{label}<Icon name="arrow" size={17} /></button></div>;
}

function SelectionCards({ title, options, value, onChange }: { title: string; options: string[][]; value: string; onChange: (value:string) => void }) {
  return <fieldset className="selection-cards"><legend>{title}</legend><div>{options.map(([id,name,description]) => <button type="button" key={id} className={value === id ? "active" : ""} onClick={() => onChange(id)}><span>{value === id && <Icon name="check" size={13} />}</span><div><strong>{name}</strong><small>{description}</small></div></button>)}</div></fieldset>;
}

function ReviewSection({ title, rows, edit }: { title:string; rows:string[][]; edit:()=>void }) {
  return <article><header><h2>{title}</h2><button onClick={edit}>Düzenle</button></header><dl>{rows.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article>;
}

function ReviewFilesSection({ files, edit }: { files: RequestFile[]; edit: () => void }) {
  return <article className="review-files-section">
    <header><div><h2>Dosyalar</h2><span>{files.length} dosya</span></div><button onClick={edit}>Düzenle</button></header>
    {files.length ? <div className="review-file-list">{files.map((file) => <div key={file.id}><RequestFileIcon filename={file.name} /><span><strong>{file.name}</strong><small>{formatRequestFileSize(file.size)}</small></span></div>)}</div> : <p className="review-file-empty">Bu talebe dosya eklenmedi.</p>}
  </article>;
}
