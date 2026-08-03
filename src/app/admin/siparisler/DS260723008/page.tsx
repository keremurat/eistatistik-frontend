"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { AdminShell } from "../../AdminShell";
import { DatePicker } from "../../../components/DatePicker";

type AdminSection = "overview" | "items" | "pricing" | "payment" | "messages" | "results" | "analyst" | "delivery" | "notes";
type IconName = "arrow" | "assign" | "back" | "card" | "chart" | "check" | "clock" | "cloudUp" | "copy" | "download" | "eye" | "file" | "heart" | "invoice" | "list" | "message" | "note" | "package" | "percent" | "plus" | "search" | "star" | "tag" | "upload" | "user" | "video" | "x";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow:   <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    assign:  <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>,
    back:    <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    card:    <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    chart:   <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>,
    check:   <path d="M20 6 9 17l-5-5" />,
    clock:   <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    cloudUp: <><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></>,
    copy:    <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    download:<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    eye:     <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    file:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    heart:   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    list:    <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    note:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>,
    package: <><path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></>,
    percent: <><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
    plus:    <path d="M12 5v14M5 12h14" />,
    search:  <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    star:    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
    tag:     <><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.3-7.3a1 1 0 0 0 0-1.41z" /><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" /></>,
    upload:  <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></>,
    user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    video:   <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
    x:       <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type FileKind = "excel" | "word" | "powerpoint" | "spss" | "pdf" | "image" | "video" | "archive" | "generic";
function FileTypeIcon({ filename }: { filename: string }) {
  const ext = filename.split(".").pop()?.toLocaleLowerCase("tr") ?? "";
  const kind: FileKind =
    ["xls","xlsx","csv"].includes(ext) ? "excel" :
    ["doc","docx","rtf"].includes(ext) ? "word" :
    ["ppt","pptx","pps","ppsx"].includes(ext) ? "powerpoint" :
    ["sav","zsav","sps","spv","spo"].includes(ext) ? "spss" :
    ext === "pdf" ? "pdf" :
    ["jpg","jpeg","png","gif","webp","svg"].includes(ext) ? "image" :
    ["mp4","mov","avi","webm"].includes(ext) ? "video" :
    ["zip","rar","7z","tar","gz"].includes(ext) ? "archive" : "generic";
  const iconPaths: Partial<Record<FileKind,string>> = {
    excel:"/icons/icons8-microsoft-excel-2019-48.png", word:"/icons/icons8-microsoft-word-2025-48.png",
    powerpoint:"/icons/icons8-microsoft-powerpoint-2025-48.png", spss:"/icons/icons8-spss-50.png",
    pdf:"/icons/icons8-pdf-48.png", image:"/icons/icons8-image-file-50.png",
    video:"/icons/icons8-video-48.png", archive:"/icons/icons8-winrar-48.png",
  };
  const src = iconPaths[kind];
  if (src) return <span className="provided-file-icon"><Image src={src} alt={kind} width={50} height={50} /></span>;
  return <span className="file-type-icon generic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><path className="file-sheet" d="M6 2.75h8l4 4V21.25H6z" /><path className="file-fold" d="M14 2.75v4h4" /><path d="M9 9h6M9 12h6M9 15h4" /></svg></span>;
}

function PanelHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <header className="detail-panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <span>{description}</span>}</div></header>;
}

const sidebarItems: { key: AdminSection; icon: IconName; label: string; badge?: number }[] = [
  { key: "overview",  icon: "file",    label: "Sipariş Ayrıntıları" },
  { key: "items",     icon: "list",    label: "Sipariş Kalemleri" },
  { key: "pricing",   icon: "tag",     label: "Güncel Ücret Belirle" },
  { key: "payment",   icon: "card",    label: "Ödeme" },
  { key: "messages",  icon: "message", label: "Yazışma", badge: 2 },
  { key: "results",   icon: "chart",   label: "Analiz Sonuçları" },
  { key: "analyst",   icon: "user",    label: "Analizör İşlemleri" },
  { key: "delivery",  icon: "package", label: "Teslimat İşlemleri" },
  { key: "notes",     icon: "note",    label: "Görev/Görüşme Notları" },
];

const timelineSteps = [
  { label: "Sipariş Verildi",  sub: "31.07.2026 14:34", state: "done"    as const },
  { label: "Ücret Belirlendi", sub: "",                  state: "done"    as const },
  { label: "Ödeme Yapıldı",   sub: "",                  state: "done"    as const },
  { label: "Yapılıyor",       sub: "",                  state: "current" as const },
  { label: "Yapıldı",         sub: "",                  state: ""        as const },
  { label: "Teslim Edildi",   sub: "06.08.2026",        state: ""        as const },
];

/* ─── Ana sayfa ───────────────────────────────────────────────── */
function AdminOrderDetailPageContent() {
  const params  = useSearchParams();
  const initSec = (params.get("section") ?? "overview") as AdminSection;
  const [section, setSection] = useState<AdminSection>(initSec);
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "card">("transfer");
  const [servicePrice, setServicePrice] = useState("7.700,00");

  return (
    <AdminShell>
      <div className="detail-page">
        <Link className="back-link" href="/admin/siparisler"><Icon name="back" size={16} />Siparişlere dön</Link>

        <header className="detail-hero admin-detail-hero">
          <div className="admin-hero-left">
            <div className="detail-title">
              <span className="detail-file-icon"><Icon name="file" size={22} /></span>
              <div>
                <p className="eyebrow">PA260731006 · 31.07.2026 14:34</p>
                <h1>Yetişkinlerde Oral Hijyen Davranışları, Algılanan Engeller ve Motivasyon: Kesitsel Bir Anket Çalışması</h1>
              </div>
            </div>
            <div className="admin-hero-meta">
              <span className="admin-hero-status"><span className="state-dot" /><strong>Yapılıyor</strong></span>
              <span className="admin-hero-note">Siparişle ilgili detaylara sekmelere tıklayarak ulaşabilirsiniz.</span>
            </div>
          </div>
          <div className="admin-hero-actions">
            <button className="admin-action-btn"><Icon name="heart" size={15} />Favorilere Ekle</button>
            <button className="admin-action-btn"><Icon name="percent" size={15} />İndirim Kodu Tanımla</button>
            <button className="admin-action-btn accent"><Icon name="assign" size={15} />Görev Ata</button>
          </div>
        </header>

        <div className="detail-workspace">
          <aside className="detail-sidebar">
            <p>SİPARİŞ MENÜSÜ</p>
            <nav>
              {sidebarItems.map((item) => (
                <button key={item.key} className={section === item.key ? "active" : ""} onClick={() => setSection(item.key)}>
                  <Icon name={item.icon} size={16} />{item.label}
                  {item.badge ? <i>{item.badge}</i> : <span />}
                </button>
              ))}
            </nav>
          </aside>

          <section className="detail-content">
            {section === "overview"  && <OverviewSection onSection={setSection} />}
            {section === "items"     && <FilesSection />}
            {section === "pricing"   && <PricingSection price={servicePrice} onSave={setServicePrice} />}
            {section === "payment"   && <PaymentSection method={paymentMethod} onMethod={setPaymentMethod} price={servicePrice} />}
            {section === "messages"  && <MessagesSection />}
            {section === "results"   && <AnalysisResultsSection />}
            {section === "analyst"   && <AnalystSection />}
            {section === "delivery"  && <DeliverySection />}
            {section === "notes"   && <NotesSection />}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminOrderDetailPage() {
  return <Suspense><AdminOrderDetailPageContent /></Suspense>;
}

/* ─── Sipariş Ayrıntıları ─────────────────────────────────────── */
function OverviewSection({ onSection }: { onSection: (s: AdminSection) => void }) {
  const orderFiles = [
    { name: "Çalışma Planı.docx", size: "0.02 MB" },
    { name: "Makale 1.pdf",        size: "1.36 MB" },
    { name: "Makale 2.pdf",        size: "8.95 MB" },
    { name: "Çalışma Planı.docx", size: "0.02 MB" },
  ];
  return (
    <div className="detail-stack">
      <section className="detail-panel">
        <div className="detail-timeline six-steps">
          {timelineSteps.map((step) => (
            <div key={step.label} className={step.state}>
              <span>{step.state === "done" && <Icon name="check" size={13} />}</span>
              <strong>{step.label}</strong><small>{step.sub || " "}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-panel">
        <dl className="detail-facts">
          <div><dt>Müşteri Adı Soyadı</dt><dd style={{ color: "var(--blue)" }}>ECE GÜNER</dd></div>
          <div><dt>Sipariş Tarihi</dt><dd>31.07.2026</dd></div>
          <div><dt>Teslimat Tarihi</dt><dd>06.08.2026</dd></div>
          <div><dt>Ücretlendirme</dt><dd style={{ color: "#287a55" }}>7.700,00 TL (Ödendi)</dd></div>
          <div><dt>Teslimat Şekli</dt><dd>Power analizi için tek bir teslimat şekli bulunmaktadır</dd></div>
          <div><dt>Teslimat Süresi</dt><dd>4 iş günü analiz süresi ve 5. iş günü sonu teslimat</dd></div>
        </dl>
      </section>

      <section className="detail-panel">
        <PanelHeading eyebrow="DOSYALAR" title="Sipariş Dosyaları" />
        <div className="admin-files-grid">
          {orderFiles.map((file, i) => (
            <div key={i} className="admin-file-row">
              <FileTypeIcon filename={file.name} />
              <div className="admin-file-info"><strong>{file.name}</strong><small>{file.size}</small></div>
              <div className="admin-file-btns">
                <button aria-label="Önizle"><Icon name="eye" size={15} /></button>
                <button aria-label="İndir"><Icon name="download" size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-panel">
        <PanelHeading eyebrow="BAĞLANTI" title="İlgili Sipariş" />
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Sipariş Kodu</th><th>Başlık</th><th>Ücret</th><th>Oluşturulma</th><th>Durum</th></tr></thead>
            <tbody><tr>
              <td>26737</td>
              <td><strong style={{ color: "var(--blue)" }}>PA260731006</strong></td>
              <td>Yetişkinlerde Oral Hijyen Davranışları, Algılanan Engeller ve Motivasyon</td>
              <td style={{ fontVariantNumeric: "tabular-nums" }}>7.700,00 TL</td>
              <td>31.07.2026</td>
              <td><span className="t-status active">Yapılıyor</span></td>
            </tr></tbody>
          </table>
        </div>
      </section>

      <section className="detail-panel">
        <PanelHeading eyebrow="HIZLI ERİŞİM" title="Bölümlere Git" />
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", padding: "1.2rem 1.4rem" }}>
          {(["items","pricing","payment","messages","results","analyst"] as AdminSection[]).map((key) => {
            const item = sidebarItems.find((s) => s.key === key)!;
            return <button key={key} className="context-action" onClick={() => onSection(key)}><Icon name={item.icon} size={15} />{item.label}<Icon name="arrow" size={14} /></button>;
          })}
        </div>
      </section>
    </div>
  );
}

/* ─── Sipariş Kalemleri ───────────────────────────────────────── */
function FilesSection() {
  const [fileFilter, setFileFilter] = useState<"all" | "customer" | "expert">("all");
  const [workFiles, setWorkFiles] = useState([
    { name: "orneklem_verileri.xlsx", owner: "customer" as const, meta: "Müşteri yükledi · 31.07.2026 · 1,8 MB" },
    { name: "analiz_plani.docx",      owner: "expert"   as const, meta: "Uzman tarafından · Bugün · 420 KB" },
  ]);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visible = workFiles.filter((f) => fileFilter === "all" || f.owner === fileFilter);

  function fmtSize(b: number) { return b < 1024*1024 ? `${Math.max(1,Math.round(b/1024))} KB` : `${(b/(1024*1024)).toLocaleString("tr-TR",{maximumFractionDigits:1})} MB`; }
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.size <= 25*1024*1024);
    if (valid.length) { setWorkFiles((cur) => [...valid.map((f) => ({ name: f.name, owner: "expert" as const, meta: `Uzman · Şimdi · ${fmtSize(f.size)}` })), ...cur]); setUploadMessage({ type: "success", text: `${valid.length} dosya eklendi.` }); }
    if (valid.length !== files.length) setUploadMessage({ type: "error", text: "Bazı dosyalar 25 MB sınırını aşıyor." });
    e.target.value = "";
  }
  return (
    <div className="detail-stack">
      <section className="detail-panel">
        <PanelHeading eyebrow="DOSYA PAYLAŞIMI" title="Sipariş Kalemleri" description="Analizde kullanılacak ve teslim edilecek tüm dosyalar." />
        <div className="file-toolbar">
          <div role="group">
            <button className={fileFilter==="all"      ? "active":""} onClick={()=>setFileFilter("all")}>Tümü · {workFiles.length}</button>
            <button className={fileFilter==="customer" ? "active":""} onClick={()=>setFileFilter("customer")}>Müşteri · {workFiles.filter(f=>f.owner==="customer").length}</button>
            <button className={fileFilter==="expert"   ? "active":""} onClick={()=>setFileFilter("expert")}>Uzman · {workFiles.filter(f=>f.owner==="expert").length}</button>
          </div>
          <input ref={fileInputRef} className="visually-hidden-file-input" type="file" multiple onChange={handleFiles} />
          <button className="upload-button" onClick={() => fileInputRef.current?.click()}><Icon name="upload" size={16} />Dosya yükle</button>
        </div>
        {uploadMessage && <p className={`file-upload-message ${uploadMessage.type}`} role="status">{uploadMessage.text}</p>}
        <div className="work-files">
          {visible.map((file, i) => (
            <article key={i}><FileTypeIcon filename={file.name} /><div><strong>{file.name}</strong><small>{file.meta}</small></div><button aria-label="İndir"><Icon name="download" size={17} /></button></article>
          ))}
        </div>
      </section>
      <div className="upload-zone"><Icon name="upload" size={24} /><strong>Dosyanızı buraya bırakın</strong><span>Office, SPSS, PDF, görsel, video veya arşiv · En fazla 25 MB</span></div>
    </div>
  );
}

/* ─── Güncel Ücret Belirle ────────────────────────────────────── */
function PricingSection({ price, onSave }: { price: string; onSave: (v: string) => void }) {
  const [draft, setDraft] = useState(price);
  const [saved, setSaved] = useState(false);
  function save() {
    if (!draft.trim()) return;
    onSave(draft.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  return (
    <section className="detail-panel">
      <PanelHeading eyebrow="FİYATLANDIRMA" title="Güncel Ücret Belirle" description="Burada girdiğiniz tutar Ödeme sekmesinde müşteriye gösterilir." />
      <div className="pricing-body">
        <div className="pricing-row">
          <label htmlFor="service-price">Hizmet Bedeli</label>
          <div className="pricing-amount-wrap">
            <input id="service-price" type="text" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); }} placeholder="0,00" />
            <span>TL</span>
          </div>
          <button className="pricing-save-btn" onClick={save}>
            {saved ? <><Icon name="check" size={15} />Kaydedildi</> : <>Kaydet</>}
          </button>
        </div>
      </div>
      <p className="pricing-note">Müşteriye gösterilen tutar: <strong>{price} TL</strong>. Teklifi kaydettiğinizde Ödeme sekmesi güncellenir ve müşteri bilgilendirilir.</p>
    </section>
  );
}

/* ─── Ödeme ───────────────────────────────────────────────────── */
function PaymentSection({ method, onMethod, price }: { method: "transfer" | "card"; onMethod: (v: "transfer" | "card") => void; price: string }) {
  const [approvalOpen, setApprovalOpen]   = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  return (
    <div className="payment-layout">
      <section className="detail-panel payment-main">
        <PanelHeading eyebrow="ÖDEME DURUMU" title={method === "transfer" ? "Havale / EFT ile ödeme" : "Kredi kartı ile ödeme"} description="Müşterinin ödeme bilgileri ve dekont durumu." />
        {method === "transfer" ? (
          <>
            <div className="bank-box">
              <h3>Banka bilgileri</h3>
              <dl>
                <div><dt>Adı Soyadı</dt><dd>Naci MURAT</dd></div>
                <div><dt>Banka</dt><dd>Akbank (0046) — 19 Mayıs Üniversitesi Şubesi (01389)</dd></div>
                <div><dt>IBAN</dt><dd><code>TR64 0004 6013 8988 8000 0143 16</code><button><Icon name="copy" size={15} />Kopyala</button></dd></div>
                <div><dt>Açıklama</dt><dd><code>PA260731006</code><button><Icon name="copy" size={15} />Kopyala</button></dd></div>
              </dl>
              <div className="receipt-upload" style={{ opacity: .6, pointerEvents: "none" }}>
                <Icon name="upload" size={22} />
                <div><strong>Dekont bekleniyor</strong><span>Müşteri henüz dekont yüklemedi</span></div>
              </div>
            </div>
            <button className={`payment-contract-consent ${paymentApproved ? "accepted" : ""}`} type="button" onClick={() => setApprovalOpen(true)}>
              <span>{paymentApproved ? <Icon name="check" size={15} /> : ""}</span>
              <strong>Ödemeyi <u>manuel onaylayın</u></strong>
              <i>{paymentApproved ? "Onaylandı" : "Onayla"}</i>
            </button>
            <button className="pay-button" disabled={!paymentApproved}>Ödeme onaylandı — Analizi başlat <Icon name="arrow" size={16} /></button>
          </>
        ) : (
          <div className="secure-card-redirect">
            <span><Icon name="card" size={25} /></span>
            <div><p className="eyebrow">AKBANK 3D SECURE</p><h3>Kredi kartı ödemesi</h3><p>Müşteri Akbank 3D Secure üzerinden ödeme yapacak. Ödeme onaylandığında sistem otomatik bildirecek.</p></div>
          </div>
        )}
      </section>

      <aside className="payment-summary">
        <p className="eyebrow">ÖDEME ÖZETİ</p>
        <h2>Yetişkinlerde Oral Hijyen Davranışları</h2>
        <dl className="payment-price-lines">
          <div><dt>Hizmet bedeli</dt><dd>{price} TL</dd></div>
          <div><dt>İndirim</dt><dd>0 TL</dd></div>
        </dl>
        <dl className="payment-total"><div className="total"><dt>Toplam</dt><dd>{price} TL</dd></div></dl>
        <div className="summary-payment-methods">
          <p>ÖDEME YÖNTEMİ</p>
          <div className="payment-tabs">
            <button className={method==="transfer" ? "active":""} onClick={()=>onMethod("transfer")}><Icon name="invoice" size={18} /><span>Havale / EFT</span><small>Manuel onay</small></button>
            <button className={method==="card"     ? "active":""} onClick={()=>onMethod("card")}><Icon name="card" size={18} /><span>Kredi kartı</span><small>3D Secure</small></button>
          </div>
        </div>
      </aside>

      {approvalOpen && (
        <AdminPaymentApprovalModal price={price} onClose={() => setApprovalOpen(false)} onAccept={() => { setPaymentApproved(true); setApprovalOpen(false); }} />
      )}
    </div>
  );
}

function AdminPaymentApprovalModal({ price, onClose, onAccept }: { price: string; onClose: () => void; onAccept: () => void }) {
  useEffect(() => { function h(e: KeyboardEvent) { if (e.key==="Escape") onClose(); } window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
  return (
    <div className="legal-modal-backdrop" role="presentation">
      <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="admin-pay-title" style={{ maxWidth: 480 }}>
        <header><div><p>ÖDEME ONAY</p><h2 id="admin-pay-title">Ödemeyi Manuel Onayla</h2></div><button onClick={onClose} aria-label="Kapat">×</button></header>
        <div style={{ padding: "1.5rem 1.4rem", color: "var(--ink)", fontSize: ".7rem", lineHeight: 1.7 }}>
          <p>Müşterinin banka havalesi ile ödeme yaptığını teyit ediyorsunuz.</p>
          <dl className="detail-facts" style={{ marginTop: "1rem", borderTop: "1px solid var(--line)" }}>
            <div><dt>Müşteri</dt><dd>ECE GÜNER</dd></div>
            <div><dt>Tutar</dt><dd>{price} TL</dd></div>
            <div><dt>Sipariş Kodu</dt><dd>PA260731006</dd></div>
          </dl>
        </div>
        <footer>
          <div><Icon name="card" size={18} /><span>Bu işlem geri alınamaz.</span></div>
          <div><button className="legal-cancel" onClick={onClose}>Vazgeç</button><button className="legal-accept" onClick={onAccept}>Ödemeyi Onayla</button></div>
        </footer>
      </section>
    </div>
  );
}

/* ─── Yazışma ─────────────────────────────────────────────────── */
function MessagesSection() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  function send() { const t = message.trim(); if (!t) return; setSent((c) => [...c, t]); setMessage(""); }
  return (
    <section className="detail-panel messages-panel">
      <PanelHeading eyebrow="İLETİŞİM VE HAREKETLER" title="Sipariş yazışmaları" description="Müşteri ve uzman arasındaki mesajlar ile sistem hareketleri." />
      <div className="message-composer">
        <label htmlFor="admin-msg">Admin Mesajı</label>
        <textarea id="admin-msg" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key==="Enter" && (e.ctrlKey||e.metaKey)) send(); }} placeholder="Müşteriye veya uzmana mesaj gönderin…" />
        <div><button className="send" type="button" onClick={send} disabled={!message.trim()}>Gönder <Icon name="arrow" size={15} /></button></div>
      </div>
      <div className="messages-thread">
        <div className="thread-day"><span>Bugün</span></div>
        {[...sent].reverse().map((msg, i) => (
          <article className="customer-message sent" key={i}><div><strong>Admin <small>Şimdi</small></strong><p>{msg}</p><span className="message-delivery"><Icon name="check" size={12} />Gönderildi</span></div></article>
        ))}
        <div className="system-note"><Icon name="upload" size={13} />orneklem_verileri.xlsx dosyası eklendi <time>09:35</time></div>
        <article className="customer-message"><div><strong>ECE GÜNER <small>09:34</small></strong><p>Merhaba, güncel Excel dosyasını Sipariş Kalemleri bölümüne ekledim.</p></div></article>
        <article className="expert-message"><span>NY</span><div><strong>Yasin Yılmaz <small>09:21</small></strong><p>Merhaba, dosyayı inceledim. Analiz öncesinde grup dağılımlarını doğrulamamız gerekiyor.</p></div></article>
        <div className="thread-day"><span>31 Temmuz 2026</span></div>
        <details className="system-event offer-event" open>
          <summary><span className="system-event-marker"><Icon name="card" size={14} /></span><div><small>SİSTEM HAREKETİ</small><strong>Ücret teklifi hazırlandı</strong><time>09:18</time></div><i>Ayrıntılar</i></summary>
          <dl><div><dt>Teklif tutarı</dt><dd>7.700,00 TL</dd></div><div><dt>Durum</dt><dd>Ödeme bekleniyor</dd></div></dl>
        </details>
        <details className="system-event">
          <summary><span className="system-event-marker"><Icon name="check" size={14} /></span><div><small>SİSTEM HAREKETİ</small><strong>Sipariş oluşturuldu</strong><time>31.07.2026 14:34</time></div><i>Ayrıntılar</i></summary>
          <dl><div><dt>Hizmet</dt><dd>Power analizi</dd></div><div><dt>Teslimat süresi</dt><dd>4 iş günü</dd></div></dl>
        </details>
      </div>
    </section>
  );
}

/* ─── Analiz Sonuçları ────────────────────────────────────────── */
function AnalysisResultsSection() {
  const [deliveryFiles, setDeliveryFiles] = useState<{ name: string; size: string }[]>([]);
  const [reportFiles,   setReportFiles]   = useState<{ name: string; size: string }[]>([]);
  const deliveryRef = useRef<HTMLInputElement>(null);
  const reportRef   = useRef<HTMLInputElement>(null);
  function fmtSize(b: number) { return b < 1024*1024 ? `${Math.max(1,Math.round(b/1024))} KB` : `${(b/(1024*1024)).toLocaleString("tr-TR",{maximumFractionDigits:1})} MB`; }
  function makeHandler(setter: React.Dispatch<React.SetStateAction<{ name: string; size: string }[]>>, ref: React.RefObject<HTMLInputElement | null>) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const valid = Array.from(e.target.files ?? []).filter((f) => f.size <= 50*1024*1024);
      if (valid.length) setter((c) => [...c, ...valid.map((f) => ({ name: f.name, size: fmtSize(f.size) }))]);
      if (ref.current) ref.current.value = "";
    };
  }
  return (
    <section className="detail-panel">
      <PanelHeading eyebrow="TESLİMAT" title="Teslimat Raporları" description="Müşteriye teslim edilecek analiz dosyaları ve analizör raporu." />

      <div className="result-subsection">
        <div className="result-subsection-head">
          <strong>Teslimat Dosyası</strong>
          <input ref={deliveryRef} className="visually-hidden-file-input" type="file" multiple onChange={makeHandler(setDeliveryFiles, deliveryRef)} />
          <button className="upload-button" style={{ minHeight: 30, fontSize: ".58rem" }} onClick={() => deliveryRef.current?.click()}><Icon name="upload" size={14} />Dosya Yükle</button>
        </div>
        {deliveryFiles.length === 0 ? (
          <p className="result-empty-box amber">Teslimat dosyası eklenmemiştir.</p>
        ) : (
          <div className="result-file-list">
            {deliveryFiles.map((f, i) => (
              <div key={i} className="result-file-row"><FileTypeIcon filename={f.name} /><div><strong>{f.name}</strong><small>{f.size}</small></div><button aria-label="İndir"><Icon name="download" size={15} /></button></div>
            ))}
          </div>
        )}
      </div>

      <div className="result-subsection">
        <div className="result-subsection-head">
          <strong>Analizör Raporu</strong>
          <input ref={reportRef} className="visually-hidden-file-input" type="file" multiple onChange={makeHandler(setReportFiles, reportRef)} />
          <button className="upload-button" style={{ minHeight: 30, fontSize: ".58rem" }} onClick={() => reportRef.current?.click()}><Icon name="upload" size={14} />Dosya Yükle</button>
        </div>
        {reportFiles.length === 0 ? (
          <p className="result-empty-box teal">Analizör dosyası eklenmemiştir.</p>
        ) : (
          <div className="result-file-list">
            {reportFiles.map((f, i) => (
              <div key={i} className="result-file-row"><FileTypeIcon filename={f.name} /><div><strong>{f.name}</strong><small>{f.size}</small></div><button aria-label="İndir"><Icon name="download" size={15} /></button></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Görev / Görüşme Notları ────────────────────────────────── */
type TaskEntry = { assignee: string; board: string; description: string; response: string; deadline: string; };
type MeetingNote = { text: string; createdAt: string; };

function NotesSection() {
  const [tab,           setTab]          = useState<"task" | "meeting">("task");
  const [tasks,         setTasks]        = useState<TaskEntry[]>([]);
  const [adding,        setAdding]       = useState(false);
  const [draft,         setDraft]        = useState<Partial<TaskEntry>>({ assignee: ANALYSTS[0], board: "", description: "", response: "", deadline: "" });
  const [meetingNotes,  setMeetingNotes] = useState<MeetingNote[]>([]);
  const [noteText,      setNoteText]     = useState("");
  const [noteSaved,     setNoteSaved]    = useState(false);

  function fmtNow() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  function saveTask() {
    if (!draft.description?.trim()) return;
    setTasks((cur) => [...cur, {
      assignee:    draft.assignee    ?? "",
      board:       draft.board       ?? "",
      description: draft.description ?? "",
      response:    draft.response    ?? "",
      deadline:    draft.deadline    ?? "",
    }]);
    setDraft({ assignee: ANALYSTS[0], board: "", description: "", response: "", deadline: "" });
    setAdding(false);
  }

  function saveMeetingNote() {
    const text = noteText.trim();
    if (!text) return;
    setMeetingNotes((cur) => [{ text, createdAt: fmtNow() }, ...cur]);
    setNoteText("");
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  function fmtDeadline(v: string) { return v || "—"; }

  return (
    <div className="detail-panel">
      <div style={{ padding: "1.2rem 1.4rem 0" }}>
        <div className="notes-tab-bar">
          <button className={tab === "task"    ? "active" : ""} onClick={() => setTab("task")}>Görev</button>
          <button className={tab === "meeting" ? "active" : ""} onClick={() => setTab("meeting")}>Görüşme Notları</button>
        </div>
      </div>

      {/* ── Görev sekmesi ── */}
      {tab === "task" && (
        <div style={{ padding: "0 1.4rem 1.4rem" }}>
          <div className="notes-tab-body">
            <div className="notes-toolbar">
              <button className="notes-add-btn" type="button" onClick={() => setAdding((v) => !v)}>
                <Icon name="plus" size={14} />{adding ? "Vazgeç" : "Görev Ekle"}
              </button>
            </div>

            {adding && (
              <div className="notes-add-form">
                <div className="notes-add-grid">
                  {/* Atanan Kullanıcı — custom portal dropdown */}
                  <CustomDropdown
                    value={draft.assignee ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, assignee: v }))}
                    options={ANALYSTS}
                    placeholder="Kullanıcı seçin…"
                  />
                  {/* Pano Adı */}
                  <input className="notes-input" placeholder="Pano Adı" value={draft.board ?? ""} onChange={(e) => setDraft((d) => ({ ...d, board: e.target.value }))} />
                  {/* Açıklama */}
                  <input className="notes-input" placeholder="Açıklama" value={draft.description ?? ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
                  {/* Cevap */}
                  <input className="notes-input" placeholder="Cevap" value={draft.response ?? ""} onChange={(e) => setDraft((d) => ({ ...d, response: e.target.value }))} />
                  {/* Bitirme Zamanı — custom portal takvim */}
                  <DatePicker
                    value={draft.deadline ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, deadline: v }))}
                    placeholder="GG.AA.YYYY"
                  />
                </div>
                <div className="notes-form-footer">
                  <button className="notes-form-cancel" type="button" onClick={() => { setAdding(false); setDraft({ assignee: ANALYSTS[0], board: "", description: "", response: "", deadline: "" }); }}>Vazgeç</button>
                  <button className="notes-form-save" type="button" onClick={saveTask} disabled={!draft.description?.trim()}>Kaydet</button>
                </div>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table className="notes-table">
                <thead>
                  <tr>
                    <th>Atanan Kullanıcılar</th>
                    <th>Pano Adı</th>
                    <th>Açıklama</th>
                    <th>Cevap</th>
                    <th>Bitirme Zamanı</th>
                    <th style={{ width: 32 }} />
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 && (
                    <tr><td colSpan={6}><div className="notes-empty">Görev ataması mevcut değildir.</div></td></tr>
                  )}
                  {tasks.map((task, i) => (
                    <tr key={i}>
                      <td style={{ color: "var(--blue)", fontWeight: 800 }}>{task.assignee}</td>
                      <td>{task.board || "—"}</td>
                      <td>{task.description}</td>
                      <td>{task.response || "—"}</td>
                      <td>{fmtDeadline(task.deadline)}</td>
                      <td><button className="notes-task-remove" type="button" onClick={() => setTasks((cur) => cur.filter((_, j) => j !== i))} aria-label="Görevi sil">×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Görüşme Notları sekmesi ── */}
      {tab === "meeting" && (
        <div style={{ padding: "0 1.4rem 1.4rem" }}>
          <div className="notes-tab-body">
            <div className="meeting-form">
              <textarea
                className="meeting-textarea"
                placeholder="Görüşme notunuzu buraya yazın…"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) saveMeetingNote(); }}
              />
              <button className="meeting-save-btn" type="button" onClick={saveMeetingNote} disabled={!noteText.trim()}>
                {noteSaved ? <><Icon name="check" size={15} />Kaydedildi</> : <>Not Ekle</>}
              </button>
            </div>

            <div className="meeting-notes-list">
              {meetingNotes.length === 0 && (
                <div className="meeting-notes-empty">Henüz görüşme notu eklenmedi.</div>
              )}
              {meetingNotes.map((note, i) => (
                <div key={i} className="meeting-note-item">
                  <div className="meeting-note-meta">
                    <span>Admin</span>
                    {note.createdAt}
                  </div>
                  <p className="meeting-note-text">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Generic portal dropdown (aynı AnalystDropdown görünümü) ── */
function CustomDropdown({ value, onChange, options, placeholder = "Seçin…" }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  const [open,    setOpen]   = useState(false);
  const [menuPos, setMenuPos]= useState({ top: 0, left: 0, width: 200 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function h(e: MouseEvent) {
      if (btnRef.current  && !btnRef.current.contains(e.target as Node) &&
          menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function esc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", h); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", esc); };
  }, []);
  function openMenu() {
    if (btnRef.current) { const r = btnRef.current.getBoundingClientRect(); setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width }); }
    setOpen((o) => !o);
  }
  return (
    <div className="analyst-dropdown-wrap">
      <button ref={btnRef} type="button" className={`analyst-dropdown-btn ${open ? "open" : ""}`} aria-expanded={open} aria-haspopup="listbox" onClick={openMenu} style={{ minHeight: 38 }}>
        <span style={!value ? { color: "#aab5be" } : {}}>{value || placeholder}</span>
        <span className="caret">⌄</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div ref={menuRef} className="analyst-dropdown-menu" role="listbox" style={{ position: "fixed", top: menuPos.top, left: menuPos.left, width: menuPos.width, zIndex: 9999 }}>
          {options.map((opt) => (
            <button key={opt} type="button" role="option" aria-selected={opt === value} className={opt === value ? "active-opt" : ""} onClick={() => { onChange(opt); setOpen(false); }}>{opt}</button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

/* ─── Analizör İşlemleri: dropdown ───────────────────────────── */
const ANALYSTS = ["YASİN YILDIRIM", "ESRA ÖZTÜRK", "RABİA AKSOY", "KAAN KARA", "ALİ İHSAN D.", "FATİH AKAR"];

function AnalystDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 200 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (
        btnRef.current  && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    function esc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", esc); };
  }, []);

  function openMenu() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen((o) => !o);
  }

  return (
    <div className="analyst-dropdown-wrap">
      <button ref={btnRef} type="button" className={`analyst-dropdown-btn ${open ? "open" : ""}`} aria-expanded={open} aria-haspopup="listbox" onClick={openMenu}>
        {value || "Analizör Seçin"}<span className="caret">⌄</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div ref={menuRef} className="analyst-dropdown-menu" role="listbox" style={{ position: "fixed", top: menuPos.top, left: menuPos.left, width: menuPos.width, zIndex: 9999 }}>
          {ANALYSTS.map((a) => (
            <button key={a} type="button" role="option" aria-selected={a === value} className={a === value ? "active-opt" : ""} onClick={() => { onChange(a); setOpen(false); }}>{a}</button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

/* ─── Analizör İşlemleri: takvim seçici ──────────────────────── */
function DateRangePicker({ value, onChange }: { value: { start: Date; end: Date }; onChange: (v: { start: Date; end: Date }) => void }) {
  const [open,      setOpen]     = useState(false);
  const [phase,     setPhase]    = useState<"start" | "end">("start");
  const [tempStart, setTempStart]= useState<Date | null>(null);
  const [hover,     setHover]    = useState<Date | null>(null);
  const [viewYear,  setViewYear] = useState(value.start.getFullYear());
  const [viewMonth, setViewMonth]= useState(value.start.getMonth());
  const [popupPos,  setPopupPos] = useState({ top: 0, left: 0, width: 310 });
  const btnRef   = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (
        btnRef.current   && !btnRef.current.contains(e.target as Node) &&
        popupRef.current && !popupRef.current.contains(e.target as Node)
      ) { setOpen(false); reset(); }
    }
    function esc(e: KeyboardEvent) { if (e.key === "Escape") { setOpen(false); reset(); } }
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", esc); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openCalendar() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPopupPos({ top: r.bottom + 6, left: r.left, width: Math.max(310, r.width) });
    }
    setViewYear(value.start.getFullYear());
    setViewMonth(value.start.getMonth());
    setOpen((o) => !o);
  }

  function reset() { setPhase("start"); setTempStart(null); setHover(null); }
  function fmt(d: Date) { return `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`; }
  function sameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

  function handleDay(day: Date) {
    if (phase === "start") { setTempStart(day); setPhase("end"); return; }
    const s = tempStart!;
    const [start, end] = day >= s ? [s, day] : [day, s];
    onChange({ start, end }); reset(); setOpen(false);
  }

  function effectiveRange() {
    if (phase === "end" && tempStart) {
      const e = hover || tempStart;
      return tempStart <= e ? { start: tempStart, end: e } : { start: e, end: tempStart };
    }
    return value;
  }

  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const firstDow    = (() => { const d = new Date(viewYear, viewMonth, 1).getDay(); return d===0 ? 6 : d-1; })();
  const today       = new Date();
  const MONTHS      = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  const range       = effectiveRange();

  function dayClass(day: Date) {
    const cls = ["cal-day"];
    if (sameDay(day, today)) cls.push("today-mark");
    if (range) {
      const isS = sameDay(day, range.start), isE = sameDay(day, range.end);
      if (isS && isE) { cls.push("range-start"); cls.push("range-end"); }
      else if (isS) cls.push("range-start");
      else if (isE) cls.push("range-end");
      else if (day > range.start && day < range.end) cls.push("in-range");
    }
    return cls.join(" ");
  }

  function prevMonth() { if (viewMonth===0) { setViewMonth(11); setViewYear(y=>y-1); } else setViewMonth(m=>m-1); }
  function nextMonth() { if (viewMonth===11) { setViewMonth(0); setViewYear(y=>y+1); } else setViewMonth(m=>m+1); }

  const popup = (
    <div ref={popupRef} className="date-picker-popup" style={{ position: "fixed", top: popupPos.top, left: popupPos.left, width: popupPos.width, zIndex: 9999 }}>
      <div className="cal-header">
        <button type="button" onClick={prevMonth}>‹</button>
        <strong>{MONTHS[viewMonth]} {viewYear}</strong>
        <button type="button" onClick={nextMonth}>›</button>
      </div>
      <div className="cal-weekdays">{["Pt","Sa","Ça","Pe","Cu","Ct","Pz"].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="cal-grid">
        {Array.from({ length: firstDow }, (_, i) => <div key={`e${i}`} className="cal-day empty" />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = new Date(viewYear, viewMonth, i+1);
          return (
            <button key={i} type="button" className={dayClass(day)}
              onMouseEnter={() => phase==="end" && setHover(day)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleDay(day)}>
              {i+1}
            </button>
          );
        })}
      </div>
      <p className="cal-hint">{phase === "end" ? "Bitiş tarihini seçin" : "Başlangıç tarihini seçin"}</p>
    </div>
  );

  return (
    <div className="date-range-wrap">
      <button ref={btnRef} type="button" className={`date-range-btn ${open ? "open" : ""}`} onClick={openCalendar}>
        <span>{fmt(value.start)} – {fmt(value.end)}</span>
        <Icon name="clock" size={15} />
      </button>
      {open && typeof document !== "undefined" && createPortal(popup, document.body)}
    </div>
  );
}

/* ─── Teslimat İşlemleri ──────────────────────────────────────── */
const DEFAULT_MESSAGE = "Sayın hocam istenilen analizler ekte sunulmuştur. Ek istek analizlerinizi sistem üzerinden girebilirsiniz. EİSTATİSTİK'i tercih ettiğiniz için teşekkür eder çalışmalarınızda yanınızda olduğumuzu hatırlatırız.";

function DeliverySection() {
  const [tab,           setTab]           = useState<"customer" | "analyst">("customer");
  const [files,         setFiles]         = useState<{ name: string; size: string }[]>([]);
  const [dragOver,      setDragOver]      = useState(false);
  const [message,       setMessage]       = useState(DEFAULT_MESSAGE);
  const [videoUrl,      setVideoUrl]      = useState("");
  const [videos,        setVideos]        = useState<string[]>([]);
  const [done,          setDone]          = useState(false);
  const [analystFiles,  setAnalystFiles]  = useState<{ name: string; size: string }[]>([]);
  const [analystDragOver, setAnalystDragOver] = useState(false);
  const [analystDone,   setAnalystDone]   = useState(false);
  const fileInputRef        = useRef<HTMLInputElement>(null);
  const analystFileInputRef = useRef<HTMLInputElement>(null);

  function fmtSize(b: number) { return b < 1024*1024 ? `${Math.max(1,Math.round(b/1024))} KB` : `${(b/(1024*1024)).toLocaleString("tr-TR",{maximumFractionDigits:1})} MB`; }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const valid = Array.from(list).filter((f) => f.size <= 500*1024*1024);
    setFiles((cur) => [...cur, ...valid.map((f) => ({ name: f.name, size: fmtSize(f.size) }))]);
    setDone(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function removeFile(i: number) { setFiles((cur) => cur.filter((_, j) => j !== i)); setDone(false); }

  function addAnalystFiles(list: FileList | null) {
    if (!list) return;
    const valid = Array.from(list).filter((f) => f.size <= 500*1024*1024);
    setAnalystFiles((cur) => [...cur, ...valid.map((f) => ({ name: f.name, size: fmtSize(f.size) }))]);
    setAnalystDone(false);
  }

  function handleAnalystDrop(e: React.DragEvent) {
    e.preventDefault(); setAnalystDragOver(false);
    addAnalystFiles(e.dataTransfer.files);
  }

  function removeAnalystFile(i: number) { setAnalystFiles((cur) => cur.filter((_, j) => j !== i)); setAnalystDone(false); }

  function addVideo() {
    const url = videoUrl.trim();
    if (!url) return;
    setVideos((cur) => [...cur, url]);
    setVideoUrl("");
  }

  function removeVideo(i: number) { setVideos((cur) => cur.filter((_, j) => j !== i)); }

  function submit() { setDone(true); }

  const canSubmit = files.length > 0 || videos.length > 0;

  return (
    <div className="detail-panel">
      <div style={{ padding: "1.2rem 1.4rem 0" }}>
        <button className="delivery-cancel-btn" type="button" onClick={() => { setFiles([]); setVideos([]); setMessage(DEFAULT_MESSAGE); setDone(false); }}>
          İptal Et
        </button>

        <div className="delivery-tab-bar">
          <button className={tab === "customer" ? "active" : ""} onClick={() => setTab("customer")}>Müşteri Teslimat Dosyaları</button>
          <button className={tab === "analyst"  ? "active" : ""} onClick={() => setTab("analyst")}>Analizör Dosyaları</button>
        </div>
      </div>

      {tab === "customer" && (
        <div style={{ padding: "0 1.4rem 1.4rem" }}>
          <div className="delivery-tab-body">

            {/* Upload zone */}
            <div>
              <p className="delivery-field-label">Teslimat Dosyaları Ekle</p>
              <input ref={fileInputRef} className="visually-hidden-file-input" type="file" multiple onChange={(e) => addFiles(e.target.files)} />
              <div
                className={`delivery-drop-zone ${dragOver ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                aria-label="Dosya yükle alanı"
              >
                <Icon name="file" size={26} />
                <strong>Dosyaları buraya bırakın</strong>
                <span>Office, SPSS, PDF, görsel, video veya arşiv · En fazla 25 MB</span>
                <span className="upload-drop-btn" onClick={() => fileInputRef.current?.click()}>Dosya seç</span>
              </div>
              {files.length > 0 && (
                <div className="delivery-file-list">
                  {files.map((f, i) => (
                    <div key={i} className="delivery-file-row">
                      <FileTypeIcon filename={f.name} />
                      <div><strong>{f.name}</strong><small>{f.size}</small></div>
                      <button type="button" onClick={() => removeFile(i)} aria-label={`${f.name} kaldır`}><Icon name="x" size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <p className="delivery-field-label">Teslimat Mesajı</p>
              <textarea className="delivery-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
            </div>

            {/* YouTube link */}
            <div>
              <p className="delivery-field-label">Sesli Teslimat Dosyası</p>
              <div className="delivery-video-row">
                <input
                  className="delivery-video-input"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVideo(); } }}
                  placeholder="Bağlantı Adresi(YouTube)"
                />
                <button className="delivery-video-add" type="button" onClick={addVideo} disabled={!videoUrl.trim()} aria-label="Video ekle">+</button>
              </div>
              {videos.length > 0 && (
                <div className="delivery-video-list">
                  {videos.map((url, i) => (
                    <div key={i} className="delivery-video-item">
                      <span className="delivery-video-icon" aria-hidden="true">
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.27 8.27 0 0 0 4.84 1.55V7.1a4.85 4.85 0 0 1-1.07-.41z"/></svg>
                      </span>
                      <span className="delivery-video-url">{url}</span>
                      <button type="button" onClick={() => removeVideo(i)} aria-label="Videoyu kaldır">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              className={`delivery-submit-btn ${done ? "done" : ""}`}
              onClick={submit}
              disabled={!canSubmit}
            >
              {done
                ? <><Icon name="check" size={17} />Teslimat Tamamlandı</>
                : "Teslimat Dosyalarını Ekle"}
            </button>
          </div>
        </div>
      )}

      {tab === "analyst" && (
        <div style={{ padding: "0 1.4rem 1.4rem" }}>
          <div className="delivery-tab-body">
            <div>
              <p className="delivery-field-label">Analiz Dosyalarını Ekle</p>
              <input ref={analystFileInputRef} className="visually-hidden-file-input" type="file" multiple onChange={(e) => addAnalystFiles(e.target.files)} />
              <div
                className={`delivery-drop-zone ${analystDragOver ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setAnalystDragOver(true); }}
                onDragLeave={() => setAnalystDragOver(false)}
                onDrop={handleAnalystDrop}
                aria-label="Analizör dosyası yükle alanı"
              >
                <Icon name="file" size={26} />
                <strong>Dosyaları buraya bırakın</strong>
                <span>Office, SPSS, PDF, görsel, video veya arşiv · En fazla 25 MB</span>
                <span className="upload-drop-btn" onClick={() => analystFileInputRef.current?.click()}>Dosya seç</span>
              </div>
              {analystFiles.length > 0 && (
                <div className="delivery-file-list">
                  {analystFiles.map((f, i) => (
                    <div key={i} className="delivery-file-row">
                      <FileTypeIcon filename={f.name} />
                      <div><strong>{f.name}</strong><small>{f.size}</small></div>
                      <button type="button" onClick={() => removeAnalystFile(i)} aria-label={`${f.name} kaldır`}><Icon name="x" size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`delivery-submit-btn ${analystDone ? "done" : ""}`}
              onClick={() => setAnalystDone(true)}
              disabled={analystFiles.length === 0}
            >
              {analystDone
                ? <><Icon name="check" size={17} />Dosyalar Kaydedildi</>
                : "Dosyaları Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Analizör İşlemleri: ana bileşen ────────────────────────── */
type LogEntry = { name: string; fee: string; assignedAt: string; range: string };

function AnalystSection() {
  const [tab,       setTab]       = useState<"assign" | "review">("assign");
  const [analyst,   setAnalyst]   = useState("YASİN YILDIRIM");
  const [fee,       setFee]       = useState("");
  const [dateRange, setDateRange] = useState({ start: new Date(2026, 6, 31), end: new Date(2026, 7, 6) });
  const [log,       setLog]       = useState<LogEntry[]>([
    { name: "YASİN YILDIRIM", fee: "0.0", assignedAt: "31/07/2026 14:37", range: "07/31/2026 – 08/06/2026" },
  ]);
  const [saved, setSaved] = useState(false);

  function fmtDate(d: Date) { return `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`; }
  function fmtNow() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  function save() {
    if (!analyst) return;
    setLog((cur) => [{ name: analyst, fee: fee || "0.0", assignedAt: fmtNow(), range: `${fmtDate(dateRange.start)} – ${fmtDate(dateRange.end)}` }, ...cur]);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  return (
    <section className="detail-panel">
      <div className="analyst-tabs-bar">
        <button className={tab==="assign" ? "active":""} onClick={() => setTab("assign")}>Analizör Ata</button>
        <button className={tab==="review" ? "active":""} onClick={() => setTab("review")}>Analizör Değerlendirme</button>
      </div>

      {tab === "assign" && (
        <>
          <div className="analyst-form">
            <div className="analyst-field">
              <label>Analizör Adı</label>
              <AnalystDropdown value={analyst} onChange={setAnalyst} />
            </div>
            <div className="analyst-field">
              <label>Analizör Ücreti</label>
              <div className="analyst-price-wrap">
                <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="0.0" min="0" step="0.01" />
                <span>₺</span>
              </div>
            </div>
            <div className="analyst-field">
              <label>Başlama ve Bitirme Zamanı</label>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
            <button type="button" className="analyst-save-btn" onClick={save}>
              {saved ? <><Icon name="check" size={16} />Kaydedildi</> : "Kaydet"}
            </button>
          </div>

          <div className="analyst-log-wrap">
            <table className="analyst-log-table">
              <thead>
                <tr>
                  <th>Analizör Adı</th>
                  <th>Analizör Ücreti</th>
                  <th>Atanma Zamanı</th>
                  <th>Başlama ve Bitirme Zamanı</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.name}</td>
                    <td>{entry.fee}</td>
                    <td>{entry.assignedAt}</td>
                    <td>{entry.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "review" && (
        <div style={{ minHeight: 220, display: "grid", placeContent: "center", color: "var(--muted)", fontSize: ".7rem" }}>
          Analizör değerlendirme bölümü yakında kullanıma açılacak.
        </div>
      )}
    </section>
  );
}
