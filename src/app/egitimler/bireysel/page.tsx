import Image from "next/image";
import Link from "next/link";
import { EduHeroVideo } from "../../components/EduHeroVideo";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingHeader } from "../../components/LandingHeader";
import { modules } from "./modules";

type IconName =
  | "office" | "chart" | "scale" | "power" | "layers" | "grid" | "book" | "compass"
  | "message" | "trend" | "image" | "database" | "network" | "diagram" | "sliders"
  | "share" | "certificate" | "clock" | "play" | "arrow";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    office: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></>,
    chart: <><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></>,
    scale: <><path d="M12 3v18M6 21h12" /><path d="m12 6-6 3m6-3 6 3" /><path d="M2 12a4 4 0 0 0 8 0M14 12a4 4 0 0 0 8 0" /></>,
    power: <path d="M13 2 4 14h6l-1 8 10-13h-6l1-7z" />,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><polygon points="16 8 14 14 8 16 10 10 16 8" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    network: <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 7 10.5 16M17 7 13.5 16M7 6h10" /></>,
    diagram: <><rect x="8" y="3" width="8" height="5" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /><rect x="14" y="16" width="7" height="5" rx="1" /><path d="M12 8v4M6.5 16v-2h11v2" /></>,
    sliders: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" /><path d="M2 14h4M10 8h4M18 16h4" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" /></>,
    certificate: <><circle cx="12" cy="8" r="5" /><path d="m8.5 12-1.5 9L12 18.5 17 21l-1.5-9" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const faqs: Array<[string, string]> = [
  ["Eğitimlere nasıl katılabilirim?", "İlgilendiğiniz modülün içeriğini inceledikten sonra sistem üzerinden talep oluşturabilirsiniz. Kontenjan ve takvim bilgisi talebiniz sonrası sizinle paylaşılır."],
  ["Eğitimler sertifikalı mı?", "Evet. Modülleri başarıyla tamamlayan katılımcılara katılım sertifikası verilir."],
  ["Eğitimler çevrim içi mi yürütülüyor?", "Modüller çevrim içi ve etkileşimli biçimde yürütülür; kayıtlara ve materyallere çalışma alanınızdan erişebilirsiniz."],
  ["Modülleri ayrı ayrı mı almam gerekiyor?", "Dilerseniz tek bir modüle, dilerseniz birbirini tamamlayan modüllere birlikte katılabilirsiniz. İhtiyacınıza göre bir program öneririz."],
  ["Ön bilgi gerektiren modüller var mı?", "Bazı ileri düzey modüller temel istatistik bilgisi gerektirir. Modül içeriğinde önerilen ön koşulları belirtiyoruz."],
];

export default function IndividualEducationPage() {
  return (
    <main className="landing-page analysis-service-page edu-service-page">
      <LandingHeader />

      <section className="edu-hero">
        <div className="edu-hero-pattern" aria-hidden="true" />
        <div className="edu-hero-copy">
          <p className="analysis-eyebrow">BİREYSEL EĞİTİM</p>
          <h1>Alanına göre <span>modüler bir eğitim yolculuğu.</span></h1>
          <p>Eğitimlerimize hoş geldiniz. İçeriklerimiz alanlarına göre modüler biçimde düzenlendi; her modülün başlığına tıklayarak kapsamına ulaşabilirsiniz. Yeni eğitimlerden haberdar olmak için web sitemizi ve sosyal medya hesaplarımızı takipte kalın.</p>
          <div className="analysis-hero-actions">
            <Link href="/giris">Eğitim talebi oluştur <span aria-hidden="true">→</span></Link>
            <a href="#edu-modules">Modülleri gör</a>
          </div>
          <div className="analysis-hero-proof"><span>17 eğitim modülü</span><span>Sertifikalı programlar</span><span>Uzman eğitmenler</span></div>
        </div>

        <div className="edu-hero-visual">
          <EduHeroVideo />
          <div className="edu-badge-float">
            <i><Icon name="certificate" size={19} /></i>
            <span><strong>Sertifikalı</strong><small>Katılım belgesi</small></span>
          </div>
        </div>
      </section>

      <section className="analysis-trust-strip" aria-label="Eğitim özellikleri">
        <div><strong>01</strong><span><b>Modüler içerik</b>İhtiyacınıza göre tek modül veya program</span></div>
        <div><strong>02</strong><span><b>Sertifikalı katılım</b>Tamamlanan modüller için katılım belgesi</span></div>
        <div><strong>03</strong><span><b>Uzman eğitmen</b>Alanında deneyimli hocalarla çevrim içi ders</span></div>
      </section>

      <section className="edu-catalog" id="edu-modules">
        <header><p className="analysis-eyebrow">EĞİTİM MODÜLLERİ</p><h2>Modül adına tıklayarak içeriğe ulaşın.</h2><p>Temel istatistikten ileri modellemeye, nitel araştırmadan bilimsel yazıma kadar tüm programlar tek katalogda.</p></header>
        <div className="edu-module-grid">
          {modules.map((module) => (
            <Link className="edu-module-card" key={module.slug} href={`/egitimler/bireysel/${module.slug}`}>
              <div className={`edu-module-cover edu-t-${module.tone}`}>
                <Image src={module.img} alt="" fill sizes="(max-width:620px) 100vw, (max-width:900px) 50vw, (max-width:1180px) 33vw, 25vw" />
                <span className="edu-module-tag">{module.tag}</span>
              </div>
              <div className="edu-module-body">
                <h3>{module.title}</h3>
                <div className="edu-module-meta">
                  <span><Icon name="certificate" size={15} />Sertifikalı</span>
                  <span><Icon name="clock" size={15} />{module.days}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="analysis-faq-section edu-faq">
        <div><h2>Eğitimler hakkında merak ettikleriniz.</h2><p>Programlar, takvim veya kapsam hakkında sorularınız için bize ulaşın.</p><a href="mailto:destek@eistatistik.com">destek@eistatistik.com</a></div>
        <LandingFaq items={faqs} />
      </section>

      <section className="analysis-final-cta"><div><span>ÖĞRENMEYE BUGÜN BAŞLAYIN</span><h2>Size uygun modülle yolculuğa başlayın.</h2><p>İlgilendiğiniz modülleri seçin; uygun program ve takvimi birlikte planlayalım.</p></div><Link href="/giris">Eğitim talebi oluştur <span>→</span></Link></section>

      <footer className="landing-footer"><Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} /><div><Link href="/#services">Hizmetler</Link><Link href="/#platform">Platform</Link><a href="mailto:destek@eistatistik.com">İletişim</a><Link href="/giris">Giriş yap</Link></div><p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p></footer>
    </main>
  );
}
