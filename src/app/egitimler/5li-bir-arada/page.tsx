"use client";

import Link from "next/link";
import { useState } from "react";
import { EducationIcon, EducationShell } from "../EducationShell";

type Tab = "overview" | "curriculum" | "payment" | "messages" | "content" | "invoice";

const modules = [
  ["01", "Temel düzey veri analizi", "8 ders · 7 saat"],
  ["02", "İleri düzey veri analizi", "10 ders · 9 saat"],
  ["03", "Ölçek geliştirme ve yapısal eşitlik modellemesi", "9 ders · 8 saat"],
  ["04", "G*Power ile güç analizi", "6 ders · 5 saat"],
  ["05", "Meta analiz eğitimi", "12 ders · 12 saat"],
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
      <nav className="course-tabs" aria-label="Eğitim bölümleri">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Eğitim detayları</button>
        <button className={tab === "curriculum" ? "active" : ""} onClick={() => setTab("curriculum")}>Müfredat <span>5</span></button>
        <button className={tab === "payment" ? "active" : ""} onClick={() => setTab("payment")}>Ödeme</button>
        <button className={tab === "messages" ? "active" : ""} onClick={() => setTab("messages")}>Yazışma</button>
        <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>Eğitim içerikleri <i>⌁</i></button>
        <button className={tab === "invoice" ? "active" : ""} onClick={() => setTab("invoice")}>Fatura <i>⌁</i></button>
      </nav>
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
  const applyDiscount = () => setDiscountState(discountCode.trim().toLocaleUpperCase("tr") === "EISTATISTIK10" ? "success" : "error");

  return <div className="payment-layout education-payment"><section className="detail-panel payment-main">
    <header className="detail-panel-heading"><div><p className="eyebrow">GÜVENLİ ÖDEME</p><h2>Ödeme yönteminizi seçin</h2><span>Analiz siparişlerinizde kullandığınız güvenli ödeme adımları.</span></div></header>
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
    <div className="payment-tabs"><button className={method === "transfer" ? "active" : ""} onClick={() => onMethod("transfer")}><EducationIcon name="file" size={18} />Havale / EFT</button><button className={method === "card" ? "active" : ""} onClick={() => onMethod("card")}><EducationIcon name="card" size={18} />Kredi kartı</button></div>
    {method === "transfer" ? <div className="bank-box"><h3>Banka bilgileri</h3><dl><div><dt>Alıcı</dt><dd>Eİstatistik Akademi Ltd. Şti.</dd></div><div><dt>Banka</dt><dd>Akbank · 19 Mayıs Üniversitesi Şubesi</dd></div><div><dt>IBAN</dt><dd><code>TR64 0004 6013 8988 8000 0143 16</code><button>Kopyala</button></dd></div><div><dt>Açıklama</dt><dd><code>TR260723010</code><button>Kopyala</button></dd></div></dl><div className="receipt-upload"><EducationIcon name="file" size={22} /><div><strong>Dekont yükle</strong><span>PDF, JPG veya PNG · En fazla 10 MB</span></div><button>Dosya seç</button></div></div>
    : <div className="card-form"><label>Kart üzerindeki isim<input placeholder="Ad Soyad" /></label><label>Kart numarası<input placeholder="0000 0000 0000 0000" /></label><div><label>Son kullanma<input placeholder="AA / YY" /></label><label>CVV<input placeholder="•••" /></label></div><p>Ödemeniz 3D Secure ile güvenli şekilde tamamlanır.</p></div>}
    <label className="agreement"><input type="checkbox" />Ön bilgilendirme formunu ve mesafeli satış sözleşmesini okudum, kabul ediyorum.</label>
    <button className="pay-button">{method === "transfer" ? "Ödeme bildirimini gönder" : `${discountState === "success" ? "8.100" : "9.000"} TL öde`} <EducationIcon name="arrow" size={16} /></button>
  </section>
  <aside className="payment-summary"><p className="eyebrow">ÖDEME ÖZETİ</p><h2>5’i Bir Arada</h2><div className="education-summary-facts"><span>5 modül · 45 ders</span><span>41 saat video</span><span>12 ay erişim</span><span>Katılım sertifikası</span></div><dl><div><dt>Eğitim bedeli</dt><dd>9.000 TL</dd></div><div><dt>İndirim</dt><dd>{discountState === "success" ? "−900 TL" : "0 TL"}</dd></div><div className="total"><dt>Toplam</dt><dd>{discountState === "success" ? "8.100 TL" : "9.000 TL"}</dd></div></dl><p>Fatura bilgilerinizi ödeme tamamlanmadan önce düzenleyebilirsiniz.</p></aside></div>;
}

function EducationMessages() {
  return <section className="education-messages"><header><p className="eyebrow">EĞİTİM DESTEĞİ</p><h2>Program ekibiyle yazışma</h2><p>Bu paket mentörlük desteği içerdiği için sorularınızı buradan iletebilirsiniz.</p></header><div><textarea placeholder="Mesajınızı yazın…" /><button>Gönder <EducationIcon name="arrow" size={15} /></button></div><small>Mesai saatlerinde ortalama 1 saat içinde yanıtlanır.</small></section>;
}

function LockedContent({ kind, onPayment }: { kind: "content" | "invoice"; onPayment: () => void }) {
  return <section className="education-locked"><span><EducationIcon name={kind === "content" ? "play" : "file"} size={25} /></span><h2>{kind === "content" ? "Eğitim içerikleri ödeme sonrasında açılacak" : "Faturanız ödeme sonrasında hazırlanacak"}</h2><p>{kind === "content" ? "Ödemeniz onaylandığında dersler ve dokümanlar otomatik olarak erişiminize açılır." : "Ödeme tamamlandığında PDF faturanız bu bölümde yer alır."}</p><button onClick={onPayment}>Ödemeye git <EducationIcon name="arrow" size={16} /></button></section>;
}
