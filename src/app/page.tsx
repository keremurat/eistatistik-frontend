import Image from "next/image";
import Link from "next/link";
import { LandingExperience } from "./components/LandingExperience";
import { LandingFaq } from "./components/LandingFaq";
import { LandingHeader } from "./components/LandingHeader";
import { LandingProcess } from "./components/LandingProcess";

const services = [
  { title: "İstatistiksel veri analizi", copy: "Tez, makale ve araştırmalarınız için yöntem seçimi, analiz ve akademik standartlarda raporlama.", image: "/service-illustrations/statistical-analysis-v2.png", type: "Analiz ve araştırma" },
  { title: "Power ve örneklem analizi", copy: "Araştırmanızın ihtiyaç duyduğu örneklem büyüklüğünü ve istatistiksel gücü güvenle planlayın.", image: "/service-illustrations/power-analysis-v2.png", type: "Araştırma planlama" },
  { title: "Online mentörlük", copy: "Yöntem, bulgular ve akademik süreç boyunca alanında deneyimli bir uzmanla birebir çalışın.", image: "/service-illustrations/mentoring-v2.png", type: "Danışmanlık" },
  { title: "Graphical abstract", copy: "Araştırmanızın yöntemini ve bulgularını yayın kalitesinde anlaşılır bir görsel anlatıma dönüştürün.", image: "/service-illustrations/graphical-abstract-v2.png", type: "Akademik sunum" },
  { title: "Proforma fatura", copy: "Kurumsal satın alma ve akademik bütçe süreçleri için gerekli proforma belgelerinizi oluşturun.", image: "/service-illustrations/proforma-invoice-v2.png", type: "Finansal belge" },
  { title: "Akademik mobil uygulama", copy: "Araştırma ve eğitim içeriğinizi hedef kitlenize özel bir dijital ürüne dönüştürün.", image: "/service-illustrations/academic-mobile-app-v2.png", type: "Dijital ürün" },
];

const serviceLinks = ["/hizmetler/istatistiksel-analiz", "/hizmetler/power-analizi", "/giris", "/giris", "/giris", "/giris"];

const faqs: Array<[string, string]> = [
  ["Hangi alanlarda analiz desteği alabilirim?", "Sağlık bilimlerinden sosyal bilimlere kadar nicel araştırmalarda yöntem seçimi, veri analizi, yorumlama ve raporlama desteği alabilirsiniz."],
  ["Dosyalarım ve araştırma verilerim güvende mi?", "Dosyalar yalnızca ilgili çalışma kapsamında yetkilendirilmiş ekip tarafından erişilen müşteri alanında tutulur."],
  ["Teslim sürecini nasıl takip edeceğim?", "Siparişinizin her aşaması çalışma alanınıza işlenir. Bildirimler, mesajlar ve görüşmeler aynı sipariş altında görünür."],
  ["Analiz tamamlandıktan sonra destek alabilir miyim?", "Teslimden sonra siparişiniz uygunsa ek analiz talebi oluşturabilir, sonuçlarla ilgili görüşme planlayabilirsiniz."],
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <LandingHeader />

      <section className="landing-hero">
        <div className="landing-hero-fibers" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="landing-hero-content">
          <div className="landing-hero-copy">
            <p className="landing-kicker">ANALİZ, EĞİTİM VE AKADEMİK DANIŞMANLIK</p>
            <h1>Araştırmanızın her adımında <span>netlik.</span></h1>
            <p>Uzman desteği, güvenli dosya paylaşımı ve şeffaf süreç yönetimi tek çalışma alanında.</p>
            <div className="landing-hero-actions">
              <Link href="/giris">Analiz talebi oluştur <span aria-hidden="true">→</span></Link>
              <a href="#platform">Platformu görün</a>
            </div>
          </div>
          <div className="landing-hero-product" aria-label="Eİstatistik müşteri çalışma alanı önizlemesi">
            <div className="landing-hero-browser">
              <div className="landing-browser-bar"><span /><span /><span /><b>app.eistatistik.com</b></div>
              <div className="landing-browser-screen"><iframe src="/dashboard" title="Eİstatistik çalışma alanı" tabIndex={-1} /></div>
            </div>
            <div className="landing-float-card float-meeting"><strong>14:30</strong><span>Uzman görüşmeniz</span></div>
            <div className="landing-float-card float-progress"><span>Analiz ilerlemesi</span><strong>%82</strong><i /></div>
          </div>
        </div>
      </section>

      <section className="landing-proof" aria-label="Eistatistik ürün ailesi">
        <p>Eistatistik ürün ailesi, araştırmanın her aşamasında yanınızda.</p>
        <div className="landing-family-logos">
          <a href="#services" className="landing-family-brand brand-eistatistik">
            <span className="landing-family-logo"><Image src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} /></span>
            <small>Analiz ve danışmanlık</small>
          </a>
          <div className="landing-family-brand brand-akademi">
            <span className="landing-family-logo"><Image src="/eistatistik-akademi.png" alt="Eİstatistik Akademi" width={1321} height={331} /></span>
            <small>Uygulamalı eğitim</small>
          </div>
          <a href="https://www.istabot.com/" target="_blank" rel="noreferrer" className="landing-family-brand brand-istabot">
            <span className="landing-family-logo"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></span>
            <small>Analiz asistanı</small>
          </a>
        </div>
      </section>

      <section className="landing-services" id="services">
        <header className="landing-section-heading services-heading">
          <h2>Araştırmanız için gereken uzmanlık, tek yerde.</h2>
          <p>Standart bir paket değil, çalışmanızın gerçek ihtiyacına göre şekillenen profesyonel destek.</p>
        </header>
        <div className="landing-service-grid">
          {services.map((service, index) => (
            <article className={`landing-service-card service-${index + 1}`} key={service.title}>
              <div className="landing-service-visual"><Image src={service.image} alt="" fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
              <div>
                <span>{service.type}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <Link href={serviceLinks[index]}>Hizmeti inceleyin <b aria-hidden="true">→</b></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <LandingExperience />

      <LandingProcess />

      <section className="landing-values">
        <div className="landing-value-primary">
          <p>Veriniz yalnızca bir dosya değildir.</p>
          <h2>Araştırmanızın emeğini ciddiye alan bir çalışma alanı.</h2>
          <Link href="/giris">Çalışma alanınızı açın <span aria-hidden="true">→</span></Link>
        </div>
        <div className="landing-value security"><strong>Güvenli dosya paylaşımı</strong><p>Analiz dosyaları, sonuçlar ve yazışmalar siparişe bağlı tutulur.</p></div>
        <div className="landing-value transparent"><strong>Şeffaf ilerleme</strong><p>Sırada ne olduğunu ve sizden ne beklendiğini her an görün.</p></div>
        <div className="landing-value human"><strong>Gerçek uzman iletişimi</strong><p>Otomatik yanıtlar yerine çalışmanızı bilen uzmanla görüşün.</p></div>
      </section>

      <section className="landing-faq" id="faq">
        <div><h2>Başlamadan önce merak ettikleriniz.</h2><p>Yanıtını bulamadığınız bir konu için ekibimizle iletişime geçebilirsiniz.</p><a href="mailto:destek@eistatistik.com">destek@eistatistik.com</a></div>
        <LandingFaq items={faqs} />
      </section>

      <section className="landing-final-cta">
        <div><h2>Çalışmanız hazırsa, biz de hazırız.</h2><p>Talebinizi oluşturun. Uzman ekibimiz kapsamı birlikte netleştirsin.</p></div>
        <Link href="/giris">Analiz talebi oluştur <span aria-hidden="true">→</span></Link>
      </section>

      <footer className="landing-footer">
        <Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} />
        <div><a href="#services">Hizmetler</a><a href="#platform">Platform</a><a href="mailto:destek@eistatistik.com">İletişim</a><Link href="/giris">Giriş yap</Link></div>
        <p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p>
      </footer>
    </main>
  );
}
