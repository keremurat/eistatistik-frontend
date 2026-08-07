"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EducationIcon } from "../../../egitimler/EducationShell";
import { AdminShell } from "../../AdminShell";

const courses = [
  { code: "TR260802001", title: "5’i Bir Arada", description: "Temel veri analizinden meta analize uzanan kapsamlı eğitim paketi.", price: "9.000 TL", access: "12 ay", modules: "5 modül", duration: "41 saat", level: "Başlangıç–İleri", tone: "blue", state: "payment" },
  { code: "TR260802002", title: "İstatistiğin Her Şeyi", description: "Araştırma tasarımından raporlamaya kadar bütünlüklü istatistik programı.", price: "15.000 TL", access: "36 ay", modules: "14 modül", duration: "68 saat", level: "Tüm seviyeler", tone: "navy", state: "available" },
  { code: "TR260802003", title: "Makale Destek", description: "Makalenizi yöntem, analiz ve raporlama adımlarında uzmanla geliştirin.", price: "10.000 TL", access: "36 ay", modules: "6 görüşme", duration: "Doküman destekli", level: "Araştırmacılar", tone: "sand", state: "owned" },
  { code: "TR260802004", title: "Temel Düzey Veri Analizi", description: "SPSS ile veri hazırlama, betimsel istatistik ve temel testler.", price: "4.000 TL", access: "12 ay", modules: "8 modül", duration: "16 saat", level: "Başlangıç", tone: "green", state: "available" },
  { code: "TR260802005", title: "İleri Düzey Veri Analizi", description: "Regresyon, çok değişkenli analiz ve ileri modelleme teknikleri.", price: "4.000 TL", access: "12 ay", modules: "9 modül", duration: "19 saat", level: "İleri", tone: "purple", state: "available" },
  { code: "TR260802006", title: "Ölçek Geliştirme ve YEM", description: "Ölçek geliştirme, doğrulayıcı faktör analizi ve yapısal eşitlik.", price: "4.000 TL", access: "12 ay", modules: "7 modül", duration: "15 saat", level: "Orta–İleri", tone: "orange", state: "available" },
];

export default function AdminNewEducationPage() {
  return <AdminShell><NewEducationContent /></AdminShell>;
}

export function NewEducationContent({ basePath = "/admin/egitimler" }: { basePath?: string }) {
  const [type, setType] = useState<"self" | "live">("self");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => courses.filter(course => [course.title, course.description].some(value => value.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")))), [query]);

  return <div className="education-page admin-education-catalog">
    <header className="education-heading"><div><p className="eyebrow">YENİ EĞİTİM SATIN AL</p><h1>Öğrenme biçimini seçin</h1><p>Müşteri eğitim kataloğundaki programları aynı akışla inceleyin ve panelden ayrılmadan kayıt oluşturun.</p></div><Link className="education-secondary" href={`${basePath}/satin-alinan`}>Satın alınan eğitimlere dön</Link></header>
    <nav className="education-view-tabs" aria-label="Eğitim yönetimi görünümü"><Link href={`${basePath}/satin-alinan`}>Satın alınan eğitimler</Link><Link className="active" href={`${basePath}/yeni`}>Yeni eğitim satın al</Link></nav>
    <section className="training-type-switch">
      <button className={type === "self" ? "active" : ""} onClick={() => setType("self")}><span><EducationIcon name="play"/></span><div><strong>Kendi hızında eğitimler</strong><small>Dilediğiniz zaman başlayan, kayıt süresi boyunca erişilebilen eğitimler.</small></div><i>{courses.length} eğitim</i></button>
      <button className={type === "live" ? "active" : ""} onClick={() => setType("live")}><span><EducationIcon name="users"/></span><div><strong>Canlı eğitimler</strong><small>Uzman eğitmenlerle planlanmış çevrim içi dersler.</small></div><i>Yakında</i></button>
    </section>
    {type === "live" ? <section className="catalog-empty"><EducationIcon name="users" size={28}/><h2>Yeni canlı eğitim takvimi hazırlanıyor</h2><p>Programlar yayınlandığında bu alandan müşteri kaydı oluşturabilirsiniz.</p><button>Yeni program oluştur</button></section> : <section className="education-section catalog-section">
      <header><div><p className="eyebrow">KENDİ HIZINDA</p><h2>Satıştaki eğitimler</h2></div><label className="catalog-search"><EducationIcon name="search" size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Eğitim ara"/></label></header>
      <div className="course-catalog-grid">{filtered.map((course, index) => <article key={course.code}><div className={`catalog-cover cover-${course.tone}`}><span>0{index + 1}</span><strong>{course.title}</strong><small>{course.level}</small></div><div className="catalog-course-body"><div className="catalog-price"><span>KENDİ HIZINDA</span><strong>{course.price}</strong></div><h3>{course.title}</h3><p>{course.description}</p><ul><li><EducationIcon name="book" size={15}/>{course.modules}</li><li><EducationIcon name="clock" size={15}/>{course.duration}</li><li><EducationIcon name="check" size={15}/>{course.access} erişim</li></ul><Link className={course.state === "owned" ? "owned" : course.state === "payment" ? "payment" : ""} href={`${basePath}/satin-alinan/${course.code}`}>{course.state === "owned" ? "Kaydı görüntüle" : course.state === "payment" ? "Ödemeyi tamamla" : "Eğitimi incele"}<EducationIcon name="arrow" size={15}/></Link></div></article>)}</div>
    </section>}
  </div>;
}
