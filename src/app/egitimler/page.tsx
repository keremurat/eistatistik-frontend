import Link from "next/link";
import { EducationIcon, EducationShell } from "./EducationShell";

export default function MyEducationPage() {
  return <EducationShell>
    <header className="education-heading">
      <div><p className="eyebrow">ÖĞRENME ALANI</p><h1>Eğitimlerim</h1><p>Satın aldığınız eğitimlere devam edin ve ilerlemenizi takip edin.</p></div>
      <Link className="education-primary" href="/egitimler/katalog"><EducationIcon name="book" size={17} />Eğitim kataloğunu aç</Link>
    </header>
    <nav className="education-view-tabs" aria-label="Eğitim görünümü">
      <Link className="active" href="/egitimler">Eğitimlerim <span>2</span></Link>
      <Link href="/egitimler/katalog">Eğitim kataloğu</Link>
    </nav>
    <section className="learning-resume">
      <div className="learning-resume-art"><span>08</span><small>12 dersten</small></div>
      <div className="learning-resume-copy">
        <p className="eyebrow light">KALDIĞINIZ YERDEN</p>
        <h2>SPSS ile uygulamalı veri analizi</h2>
        <p>Sonraki ders: Çoklu regresyon ve model kontrolü</p>
        <div className="course-progress"><span style={{ width: "64%" }} /></div>
        <small>%64 tamamlandı · Son çalışma bugün, 10:24</small>
      </div>
      <button>Eğitime devam et <EducationIcon name="arrow" size={16} /></button>
    </section>
    <section className="education-section">
      <header><div><p className="eyebrow">KÜTÜPHANENİZ</p><h2>Tüm eğitimleriniz</h2></div><span>2 eğitim</span></header>
      <div className="owned-course-grid">
        <article>
          <div className="course-cover cover-blue"><span>VERİ<br />ANALİZİ</span><i>01</i></div>
          <div className="owned-course-body"><span className="course-kind">KENDİ HIZINDA</span><h3>SPSS ile uygulamalı veri analizi</h3><p>12 modül · 18 saat · 12 ay erişim</p><div className="course-progress"><span style={{ width: "64%" }} /></div><small>8 / 12 ders tamamlandı</small><button>Devam et <EducationIcon name="arrow" size={15} /></button></div>
        </article>
        <article>
          <div className="course-cover cover-sand"><span>MAKALE<br />DESTEK</span><i>02</i></div>
          <div className="owned-course-body"><span className="course-kind">MENTÖRLÜK PAKETİ</span><h3>Akademik makale destek programı</h3><p>6 görüşme · Dokümanlar · 36 ay erişim</p><div className="course-progress"><span style={{ width: "15%" }} /></div><small>Başlangıç görüşmesi planlanıyor</small><button>Programı görüntüle <EducationIcon name="arrow" size={15} /></button></div>
        </article>
      </div>
    </section>
  </EducationShell>;
}

