"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EducationIcon, EducationShell } from "../EducationShell";
import { MessageTemplatePicker } from "../../components/MessageTemplatePicker";

type Tab = "overview" | "curriculum" | "payment" | "messages" | "content" | "invoice";

const modules = [
  ["01", "Temel düzey veri analizi", "8 ders · 7 saat"],
  ["02", "İleri düzey veri analizi", "10 ders · 9 saat"],
  ["03", "Ölçek geliştirme ve yapısal eşitlik modellemesi", "9 ders · 8 saat"],
  ["04", "G*Power ile güç analizi", "6 ders · 5 saat"],
  ["05", "Meta analiz eğitimi", "12 ders · 12 saat"],
];

const educationSections: { key: Tab; label: string; icon: "book" | "file" | "card" | "message" | "play"; badge?: string; locked?: boolean }[] = [
  { key: "overview", label: "Genel bakış", icon: "book" },
  { key: "curriculum", label: "Müfredat", icon: "file", badge: "5" },
  { key: "payment", label: "Ödeme", icon: "card", badge: "1" },
  { key: "messages", label: "Yazışmalar", icon: "message" },
  { key: "content", label: "Eğitim içerikleri", icon: "play", locked: true },
  { key: "invoice", label: "Fatura", icon: "file", locked: true },
];

export default function EducationDetailPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [method, setMethod] = useState<"transfer" | "card">("transfer");

  return <EducationShell>
    <Link className="back-link" href="/egitimler/katalog">Eğitim kataloğuna dön</Link>
    <section className="course-detail-hero">
      <div className="course-detail-art"><span>5</span><small>eğitim bir arada</small></div>
      <div className="course-detail-intro"><p className="eyebrow light">KENDİ HIZINDA · TR260723010</p><h1>5’i Bir Arada</h1><p>Temel veri analizinden meta analize kadar araştırmanızda ihtiyaç duyacağınız beş kapsamlı program.</p><ul><li>45 ders</li><li>41 saat video</li><li>12 ay erişim</li><li>5 modül</li></ul></div>
      <aside><span>PAKET FİYATI</span><strong>9.000 TL</strong><small>Ödeme bekleniyor</small><button onClick={() => setTab("payment")}>Ödemeyi tamamla <EducationIcon name="arrow" size={16} /></button></aside>
    </section>
    <section className="course-workspace">
      <aside className="course-sidebar">
        <p>EĞİTİM MENÜSÜ</p>
        <nav aria-label="Eğitim bölümleri">
          {educationSections.map((item) => <button key={item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)}>
            <EducationIcon name={item.icon} size={17} />
            <span>{item.label}</span>
            {item.badge && <i>{item.badge}</i>}
            {item.locked && <small aria-label="Ödeme sonrasında açılır">Kilitli</small>}
          </button>)}
        </nav>
        <div className="course-access-note">
          <EducationIcon name="clock" size={18} />
          <div><strong>12 ay erişim</strong><span>Ödeme onayından sonra başlar</span></div>
        </div>
      </aside>
      <div className="course-tab-content">
        {tab === "overview" && <Overview onCurriculum={() => setTab("curriculum")} />}
        {tab === "curriculum" && <Curriculum />}
        {tab === "payment" && <EducationPayment method={method} onMethod={setMethod} />}
        {tab === "messages" && <EducationMessages />}
        {(tab === "content" || tab === "invoice") && <LockedContent kind={tab} onPayment={() => setTab("payment")} />}
      </div>
    </section>
  </EducationShell>;
}

function Overview({ onCurriculum }: { onCurriculum: () => void }) {
  return <div className="course-overview-grid">
    <section><p className="eyebrow">PROGRAM HAKKINDA</p><h2>Araştırmanızın her aşaması için tek program</h2><p>Beş eğitimi tek bir öğrenme yolunda birleştiren bu paket; veri hazırlama, temel ve ileri analizler, ölçek geliştirme, güç analizi ve meta analiz konularını uygulamalı olarak ele alır.</p>
      <h3>Bu eğitim kimler için?</h3><ul><li>Lisansüstü tez hazırlayan araştırmacılar</li><li>Makale analizlerini kendisi yürütmek isteyen akademisyenler</li><li>İstatistik bilgisini sistemli biçimde geliştirmek isteyenler</li></ul>
      <button onClick={onCurriculum}>Tüm müfredatı incele <EducationIcon name="arrow" size={16} /></button>
    </section>
    <aside><p className="eyebrow">PROGRAM BİLGİLERİ</p><dl><div><dt>Seviye</dt><dd>Başlangıç–İleri</dd></div><div><dt>Erişim</dt><dd>12 ay</dd></div><div><dt>Toplam içerik</dt><dd>45 ders · 41 saat</dd></div><div><dt>Sertifika</dt><dd>Katılım sertifikası</dd></div></dl></aside>
  </div>;
}

function Curriculum() {
  return <section className="curriculum-panel"><header><div><p className="eyebrow">5 MODÜL · 45 DERS</p><h2>Program müfredatı</h2></div><span>Toplam 41 saat</span></header><div>{modules.map(module => <article key={module[0]}><span>{module[0]}</span><div><strong>{module[1]}</strong><small>{module[2]}</small></div><button aria-label={`${module[1]} ayrıntıları`}>+</button></article>)}</div></section>;
}

function EducationPayment({ method, onMethod }: { method: "transfer" | "card"; onMethod: (value: "transfer" | "card") => void }) {
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountState, setDiscountState] = useState<"idle" | "success" | "error">("idle");
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [transferAccepted, setTransferAccepted] = useState(false);
  const [cardAccepted, setCardAccepted] = useState(false);
  const agreementAccepted = method === "transfer" ? transferAccepted : cardAccepted;
  const applyDiscount = () => setDiscountState(discountCode.trim().toLocaleUpperCase("tr") === "EISTATISTIK10" ? "success" : "error");

  return <div className="payment-layout education-payment"><section className="detail-panel payment-main">
    <header className="detail-panel-heading"><div><p className="eyebrow">GÜVENLİ ÖDEME</p><h2>{method === "transfer" ? "Havale / EFT ile ödeme" : "Kredi kartı ile ödeme"}</h2><span>{method === "transfer" ? "Ödemenizi tamamlayın, ardından dekontunuzu yükleyin." : "Akbank 3D Secure ödeme sayfasına güvenle yönlendirileceksiniz."}</span></div></header>
    {method === "transfer" ? <div className="bank-box"><h3>Banka bilgileri</h3><dl><div><dt>Adı Soyadı</dt><dd>Naci MURAT</dd></div><div><dt>Banka</dt><dd>Akbank (0046) — 19 Mayıs Üniversitesi Şubesi (01389)</dd></div><div><dt>Hesap No</dt><dd><code>0014316</code></dd></div><div><dt>IBAN</dt><dd><code>TR64 0004 6013 8988 8000 0143 16</code><button>Kopyala</button></dd></div><div><dt>Açıklama</dt><dd><code>TR260723010</code><button>Kopyala</button></dd></div></dl><div className="receipt-upload"><EducationIcon name="file" size={22} /><div><strong>Dekont yükle</strong><span>PDF, JPG veya PNG · En fazla 10 MB</span></div><button>Dosya seç</button></div></div>
    : <div className="secure-card-redirect"><span><EducationIcon name="card" size={25} /></span><div><p className="eyebrow">AKBANK 3D SECURE</p><h3>Ödemeniz Akbank güvencesiyle tamamlanacak</h3><p>Sonraki ekranda Akbank Ortak Ödeme sayfasına yönlendirileceksiniz. Kart bilgileriniz EİSTATİSTİK tarafından alınmaz veya kaydedilmez.</p></div></div>}
    <button className={`payment-contract-consent ${agreementAccepted ? "accepted" : ""}`} type="button" onClick={() => setAgreementOpen(true)}>
      <span>{agreementAccepted ? <EducationIcon name="check" size={15} /> : ""}</span>
      <strong><u>Sözleşmeyi</u> okudum ve kabul ediyorum.</strong>
      <i>{agreementAccepted ? "Onaylandı" : "İncele"}</i>
    </button>
    <button className="pay-button" disabled={!agreementAccepted}>{method === "transfer" ? "Ödeme bildirimini gönder" : "Kredi Kartı ile Ödeme Yap"} <EducationIcon name="arrow" size={16} /></button>
  </section>
  <aside className="payment-summary"><p className="eyebrow">ÖDEME ÖZETİ</p><h2>5’i Bir Arada</h2><div className="education-summary-facts"><span>5 modül · 45 ders</span><span>41 saat video</span><span>12 ay erişim</span><span>Katılım sertifikası</span></div><dl className="payment-price-lines"><div><dt>Eğitim bedeli</dt><dd>9.000 TL</dd></div><div><dt>İndirim</dt><dd className={discountState === "success" ? "discounted" : ""}>{discountState === "success" ? "−900 TL" : "0 TL"}</dd></div></dl>
    <div className={`discount-entry summary-discount ${discountOpen ? "open" : ""}`}><button className="discount-trigger" onClick={() => setDiscountOpen(value => !value)} aria-expanded={discountOpen}><span>%</span><strong>İndirim kodu gir</strong><i>{discountOpen ? "−" : "+"}</i></button>{discountOpen && <div className="discount-form"><label><span>İndirim kodu</span><input value={discountCode} onChange={event => { setDiscountCode(event.target.value); setDiscountState("idle"); }} placeholder="Kodunuzu yazın" /></label><button onClick={applyDiscount} disabled={!discountCode.trim()}>Uygula</button>{discountState === "success" && <p className="success">Kod uygulandı.</p>}{discountState === "error" && <p className="error">Kod geçerli değil.</p>}</div>}</div>
    <dl className="payment-total"><div className="total"><dt>Toplam</dt><dd>{discountState === "success" ? "8.100 TL" : "9.000 TL"}</dd></div></dl>
    <div className="summary-payment-methods"><p>ÖDEME YÖNTEMİ</p><div className="payment-tabs"><button className={method === "transfer" ? "active" : ""} onClick={() => onMethod("transfer")}><EducationIcon name="file" size={18} /><span>Havale / EFT</span><small>Manuel onay</small></button><button className={method === "card" ? "active" : ""} onClick={() => onMethod("card")}><EducationIcon name="card" size={18} /><span>Kredi kartı</span><small>3D Secure</small></button></div></div>
    <p>Fatura bilgilerinizi ödeme tamamlanmadan önce düzenleyebilirsiniz.</p></aside>
    {agreementOpen && <EducationAgreementModal method={method} onClose={() => setAgreementOpen(false)} onAccept={() => { if (method === "transfer") setTransferAccepted(true); else setCardAccepted(true); setAgreementOpen(false); }} />}
  </div>;
}

function EducationAgreementModal({ method, onClose, onAccept }: { method: "transfer" | "card"; onClose: () => void; onAccept: () => void }) {
  const [content, setContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/legal/uyelik-sozlesmesi.txt").then((response) => response.text()).then(setContent);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function handleScroll() {
    const element = contentRef.current;
    if (!element) return;
    const distance = element.scrollHeight - element.clientHeight;
    const nextProgress = distance <= 0 ? 100 : Math.min(100, (element.scrollTop / distance) * 100);
    setProgress(nextProgress);
    if (nextProgress >= 99 || distance <= 0) setReachedEnd(true);
  }

  return <div className="legal-modal-backdrop" role="presentation"><section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="education-contract-title">
    <header><div><p>{method === "transfer" ? "HAVALE / EFT ÖNCESİ ONAY" : "KREDİ KARTI ÖNCESİ ONAY"}</p><h2 id="education-contract-title">Sözleşme ve Kullanım Koşulları</h2></div><button onClick={onClose} aria-label="Pencereyi kapat">×</button></header>
    <div className="legal-scroll-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }} /></div>
    <div className="legal-document-content" ref={contentRef} onScroll={handleScroll} tabIndex={0}>{content ? <pre>{content}</pre> : <div className="legal-loading">Sözleşme yükleniyor…</div>}</div>
    <footer><div><EducationIcon name="check" size={18} /><span>{reachedEnd ? "Belgenin sonuna ulaştınız." : "Kabul edebilmek için belgenin sonuna kadar ilerleyin."}</span></div><div><button className="legal-cancel" onClick={onClose}>Vazgeç</button><button className="legal-accept" onClick={onAccept} disabled={!reachedEnd}>Okudum ve kabul ediyorum</button></div></footer>
  </section></div>;
}

function EducationMessages() {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const isAnalyst = useSyncExternalStore(
    (notify) => { window.addEventListener("storage", notify); return () => window.removeEventListener("storage", notify); },
    () => localStorage.getItem("eistatistik_role") === "analizor",
    () => false,
  );

  function sendMessage() {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;
    setSentMessages((current) => [...current, cleanMessage]);
    setMessage("");
  }

  return <section className="detail-panel messages-panel">
    <header className="detail-panel-heading"><div><p className="eyebrow">İLETİŞİM VE HAREKETLER</p><h2>Eğitim yazışmaları</h2><span>Mesajlarınız ve eğitiminizle ilgili önemli değişiklikler tek bir kronolojide tutulur.</span></div></header>
    <div className="message-guidance">
      <span><EducationIcon name="message" size={19} /></span>
      <div><strong>Program ekibiyle iletişim</strong><p>Bu alan yalnızca 5’i Bir Arada eğitiminizle ilgili soru ve bilgilendirmeler içindir.</p></div>
    </div>
    <div className="message-composer">
      <label htmlFor="education-message">Mesajınız</label>
      <textarea id="education-message" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) sendMessage(); }} placeholder="Program ekibine mesajınızı yazın…" />
      <div>{isAnalyst && <MessageTemplatePicker scope="education" onSelect={setMessage}/>}<button className="send" type="button" onClick={sendMessage} disabled={!message.trim()}>Gönder <EducationIcon name="arrow" size={15} /></button></div>
    </div>
    <div className="response-expectation"><EducationIcon name="clock" size={16} /><span><strong>Yanıt süresi:</strong> Mesai saatlerinde ortalama 1 saat.</span></div>
    <div className="messages-thread">
      <div className="thread-day"><span>Bugün</span></div>
      {[...sentMessages].reverse().map((sentMessage, index) => <article className="customer-message sent" key={`${sentMessage}-${index}`}><div><strong>Siz <small>Şimdi</small></strong><p>{sentMessage}</p><span className="message-delivery"><EducationIcon name="check" size={12} />Gönderildi</span></div></article>)}
      <article className="expert-message"><span>NY</span><div><strong>Dr. Naci Yılmaz <small>09:21</small></strong><p>Merhaba Kerem Bey, eğitiminizle ilgili tüm sorularınızı bu alan üzerinden bize iletebilirsiniz.</p></div></article>
      <div className="thread-day"><span>23 Temmuz 2026</span></div>
      <details className="system-event" open>
        <summary><span className="system-event-marker"><EducationIcon name="check" size={14} /></span><div><small>SİSTEM HAREKETİ</small><strong>Eğitim kaydı oluşturuldu</strong><time>23:09</time></div><i>Ayrıntılar</i></summary>
        <dl><div><dt>Eğitim</dt><dd>5’i Bir Arada</dd></div><div><dt>Durum</dt><dd>Ödeme bekleniyor</dd></div><div><dt>Erişim süresi</dt><dd>12 ay</dd></div></dl>
      </details>
    </div>
  </section>;
}

function LockedContent({ kind, onPayment }: { kind: "content" | "invoice"; onPayment: () => void }) {
  return <section className="education-locked"><span><EducationIcon name={kind === "content" ? "play" : "file"} size={25} /></span><h2>{kind === "content" ? "Eğitim içerikleri ödeme sonrasında açılacak" : "Faturanız ödeme sonrasında hazırlanacak"}</h2><p>{kind === "content" ? "Ödemeniz onaylandığında dersler ve dokümanlar otomatik olarak erişiminize açılır." : "Ödeme tamamlandığında PDF faturanız bu bölümde yer alır."}</p><button onClick={onPayment}>Ödemeye git <EducationIcon name="arrow" size={16} /></button></section>;
}
