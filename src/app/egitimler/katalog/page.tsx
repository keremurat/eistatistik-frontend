"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EducationIcon, EducationShell } from "../EducationShell";

const courses = [
  { title: "5’i Bir Arada", description: "Temel veri analizinden meta analize uzanan kapsamlı eğitim paketi.", price: "9.000 TL", access: "12 ay", modules: "5 modül", duration: "41 saat", level: "Başlangıç–İleri", tone: "blue", state: "payment" },
  { title: "İstatistiğin Her Şeyi", description: "Araştırma tasarımından raporlamaya kadar bütünlüklü istatistik programı.", price: "15.000 TL", access: "36 ay", modules: "14 modül", duration: "68 saat", level: "Tüm seviyeler", tone: "navy", state: "available" },
  { title: "Makale Destek", description: "Makalenizi yöntem, analiz ve raporlama adımlarında uzmanla geliştirin.", price: "10.000 TL", access: "36 ay", modules: "6 görüşme", duration: "Doküman destekli", level: "Araştırmacılar", tone: "sand", state: "owned" },
  { title: "Temel Düzey Veri Analizi", description: "SPSS ile veri hazırlama, betimsel istatistik ve temel testler.", price: "4.000 TL", access: "12 ay", modules: "8 modül", duration: "16 saat", level: "Başlangıç", tone: "green", state: "available" },
  { title: "İleri Düzey Veri Analizi", description: "Regresyon, çok değişkenli analiz ve ileri modelleme teknikleri.", price: "4.000 TL", access: "12 ay", modules: "9 modül", duration: "19 saat", level: "İleri", tone: "purple", state: "available" },
  { title: "Ölçek Geliştirme ve YEM", description: "Ölçek geliştirme, doğrulayıcı faktör analizi ve yapısal eşitlik.", price: "4.000 TL", access: "12 ay", modules: "7 modül", duration: "15 saat", level: "Orta–İleri", tone: "orange", state: "available" },
];

export default function EducationCatalogPage() {
  const [type, setType] = useState<"self" | "live">("self");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => courses.filter(course => course.title.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))), [query]);

  return <EducationShell>
    <header className="education-heading">
      <div><p className="eyebrow">EĞİTİM KATALOĞU</p><h1>Öğrenme biçiminizi seçin</h1><p>İhtiyacınıza uygun programı inceleyin; satın almadan önce tüm içeriği görün.</p></div>
      <Link className="education-secondary" href="/egitimler">Eğitimlerime dön</Link>
    </header>
    <nav className="education-view-tabs"><Link href="/egitimler">Eğitimlerim</Link><Link className="active" href="/egitimler/katalog">Eğitim kataloğu</Link></nav>
    <section className="training-type-switch">
      <button className={type === "self" ? "active" : ""} onClick={() => setType("self")}><span><EducationIcon name="play" /></span><div><strong>Kendi hızında eğitimler</strong><small>Dilediğiniz zaman başlayın, kendi programınızda ilerleyin.</small></div><i>{courses.length} eğitim</i></button>
      <button className={type === "live" ? "active" : ""} onClick={() => setType("live")}><span><EducationIcon name="users" /></span><div><strong>Canlı eğitimler</strong><small>Uzman eğitmenlerle planlanmış çevrim içi dersler.</small></div><i>Yakında</i></button>
    </section>
    {type === "live" ? <section className="catalog-empty"><EducationIcon name="users" size={28} /><h2>Yeni canlı eğitim takvimi hazırlanıyor</h2><p>Program yayınlandığında bildirim alacaksınız.</p><button>Bildirimleri aç</button></section> :
    <section className="education-section catalog-section">
      <header><div><p className="eyebrow">KENDİ HIZINIZDA</p><h2>Satıştaki eğitimler</h2></div><label className="catalog-search"><EducationIcon name="search" size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Eğitim ara" /></label></header>
      <div className="course-catalog-grid">{filtered.map((course, index) => <article key={course.title}>
        <div className={`catalog-cover cover-${course.tone}`}><span>0{index + 1}</span><strong>{course.title}</strong><small>{course.level}</small></div>
        <div className="catalog-course-body"><div className="catalog-price"><span>KENDİ HIZINDA</span><strong>{course.price}</strong></div><h3>{course.title}</h3><p>{course.description}</p>
          <ul><li><EducationIcon name="book" size={15} />{course.modules}</li><li><EducationIcon name="clock" size={15} />{course.duration}</li><li><EducationIcon name="check" size={15} />{course.access} erişim</li></ul>
          <Link className={course.state === "owned" ? "owned" : course.state === "payment" ? "payment" : ""} href={course.title === "5’i Bir Arada" ? "/egitimler/5li-bir-arada" : "/egitimler/5li-bir-arada"}>
            {course.state === "owned" ? "Eğitime devam et" : course.state === "payment" ? "Ödemeyi tamamla" : "Eğitimi incele"}<EducationIcon name="arrow" size={15} />
          </Link>
        </div>
      </article>)}</div>
    </section>}
  </EducationShell>;
}

