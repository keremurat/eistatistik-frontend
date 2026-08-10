import Image from "next/image";
import Link from "next/link";
import { LandingExperience } from "./components/LandingExperience";
import { LandingFaq } from "./components/LandingFaq";
import { LandingHeader } from "./components/LandingHeader";
import { LandingProcess } from "./components/LandingProcess";
import { HeroFamilyField } from "./components/HeroFamilyField";

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
  ["İstatistik analizi hizmeti ne kadar sürer?", "Analiz süresi veri seti büyüklüğüne ve analiz türüne göre değişir. Standart SPSS veya R analizleri genellikle 1–3 iş günü içinde teslim edilir. Acil siparişlerde 24 saat içinde teslimat seçeneği de mevcuttur."],
  ["Hangi istatistik programlarıyla analiz yapıyorsunuz?", "SPSS, R, Python, STATA, AMOS, LISREL ve Minitab başta olmak üzere tüm yaygın istatistik yazılımlarıyla analiz gerçekleştiriyoruz. Danışmanınızın talep ettiği program hangisi olursa olsun destek sağlayabiliriz."],
  ["Tez analizi için hangi dosyaları göndermem gerekir?", "Ham veri dosyanızı (Excel, SPSS .sav, CSV vb.), anket formunuzu ve tez konunuzu/araştırma sorularınızı paylaşmanız yeterlidir. Sipariş sonrası sistem üzerinden güvenli biçimde yükleyebilirsiniz."],
  ["Fiyatlandırma nasıl belirleniyor?", "Fiyat; analiz türü, değişken sayısı ve teslimat süresine göre otomatik olarak hesaplanır. Sipariş formunu doldurduğunuzda anında fiyat teklifi alırsınız. Gizli ek ücret yoktur."],
  ["Analiz sonuçları nasıl teslim edilir?", "Analiz çıktıları, yorumlu rapor ve orijinal program çıktıları (SPSS output, R Markdown vb.) ile birlikte platform üzerinden iletilir. Bulguların tez yazımına aktarılması konusunda da destek sunuyoruz."],
  ["Hangi analiz türlerini yapabiliyorsunuz?", "Güvenilirlik ve geçerlilik, faktör analizi, regresyon (doğrusal/lojistik/çoklu), ANOVA, MANOVA, kümeleme, SEM/YEM, survival analizi, meta-analiz ve daha pek çok yöntem sunulmaktadır."],
  ["Analizin doğruluğu garanti ediliyor mu?", "Evet. Tüm analizler alanında uzman istatistikçiler tarafından gerçekleştirilir ve kalite kontrolden geçirilir. Teslim sonrası makul süre içinde revizyon talep etme hakkınız bulunmaktadır."],
  ["İstatistik eğitimi de veriliyor mu?", "Evet. Bireysel ve kurumsal istatistik eğitimleri düzenlenmektedir. SPSS, R, Python ve STATA için temel–orta–ileri düzey canlı eğitimler mevcuttur."],
];

const invitedOrganizationLogos = [
  { src: "/davet-transparent/atılım.png", alt: "Atılım Üniversitesi" },
  { src: "/davet-transparent/birlik.png", alt: "Birlik" },
  { src: "/davet-transparent/canakkale.png", alt: "Çanakkale" },
  { src: "/davet-transparent/ebeler.png", alt: "Ebeler Derneği" },
  { src: "/davet-transparent/eskisehir.png", alt: "Eskişehir" },
  { src: "/davet-transparent/gazi.png", alt: "Gazi Üniversitesi" },
  { src: "/davet-transparent/giyat.png", alt: "GİYAT" },
  { src: "/davet-transparent/hesireler.png", alt: "Hemşireler" },
  { src: "/davet-transparent/if.png", alt: "IF" },
  { src: "/davet-transparent/inonu.png", alt: "İnönü Üniversitesi" },
  { src: "/davet-transparent/jinekolojik.png", alt: "Jinekolojik Onkoloji" },
  { src: "/davet-transparent/ktü.png", alt: "Karadeniz Teknik Üniversitesi" },
  { src: "/davet-transparent/medical.png", alt: "Medical" },
  { src: "/davet-transparent/mobid.png", alt: "MOBİD" },
  { src: "/davet-transparent/noroloji.png", alt: "Nöroloji Derneği" },
  { src: "/davet-transparent/omu.png", alt: "Ondokuz Mayıs Üniversitesi" },
  { src: "/davet-transparent/omusem.png", alt: "OMÜSEM" },
  { src: "/davet-transparent/ordu_uni.png", alt: "Ordu Üniversitesi" },
  { src: "/davet-transparent/otat.png", alt: "OTAT" },
  { src: "/davet-transparent/pedodonti.png", alt: "Pedodonti Derneği" },
  { src: "/davet-transparent/purpletalk.png", alt: "PurpleTalk" },
  { src: "/davet-transparent/rte.png", alt: "Recep Tayyip Erdoğan Üniversitesi" },
  { src: "/davet-transparent/samsiad.png", alt: "SAMSİAD" },
  { src: "/davet-transparent/sanovel.png", alt: "Sanovel" },
  { src: "/davet-transparent/sanset.png", alt: "SANSET" },
  { src: "/davet-transparent/selcuk.png", alt: "Selçuk Üniversitesi" },
  { src: "/davet-transparent/tei.png", alt: "TEI" },
  { src: "/davet-transparent/tpid.png", alt: "TPİD" },
  { src: "/davet-transparent/trt.png", alt: "TRT" },
];

function FooterSocialIcon({ name }: { name: "instagram" | "x" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "instagram" ? (
        <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>
      ) : (
        <><path d="M5 4l14 16" /><path d="M19 4 5 20" /></>
      )}
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="landing-page">
      <LandingHeader />

      <section className="landing-hero">
        <HeroFamilyField />
        <div className="landing-hero-content">
          <div className="landing-hero-copy">
            <p className="landing-kicker">TÜRKİYE’NİN LİDER ANALİZ PLATFORMU</p>
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
            <div className="landing-float-card float-tools">
              <span>ANALİZ ARAÇLARI</span>
              <div>{["SPSS", "R", "Python", "STATA", "AMOS", "LISREL", "Minitab"].map((tool) => <strong key={tool}>{tool}</strong>)}</div>
            </div>
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

      <section className="landing-logo-marquee" aria-label="Birlikte çalıştığımız kurumlar">
        <div className="landing-logo-marquee-track">
          {[false, true].map((duplicate) => (
            <div className="landing-logo-marquee-group" aria-hidden={duplicate || undefined} key={duplicate ? "duplicate" : "primary"}>
              {invitedOrganizationLogos.map((logo) => (
                <span className="landing-logo-marquee-item" key={`${duplicate ? "duplicate" : "primary"}-${logo.src}`}>
                  <Image src={logo.src} alt={duplicate ? "" : logo.alt} width={180} height={88} sizes="180px" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} />
            <p>İstatistiğe ihtiyaç duyan herkes için online istatistik otomasyonu.</p>
          </div>

          <nav className="landing-footer-column" aria-label="Hızlı erişim">
            <h2>Hızlı Erişim</h2>
            <Link href="/">Anasayfa</Link>
            <a href="#services">Hizmetlerimiz</a>
            <Link href="/egitimler/bireysel">Eğitimler</Link>
            <a href="#platform">Platform</a>
            <a href="#process">Nasıl çalışır?</a>
            <a href="#faq">Merak edilenler</a>
            <a href="#faq">Blog</a>
            <Link href="/neler-yaptik/davetli-konusmalar">Neler Yaptık?</Link>
            <a href="mailto:info@eistatistik.com">İletişim</a>
          </nav>

          <nav className="landing-footer-column" aria-label="Hizmetlerimiz">
            <h2>Hizmetlerimiz</h2>
            <Link href="/hizmetler/istatistiksel-analiz">İstatistiksel Analiz</Link>
            <Link href="/hizmetler/power-analizi">Power Analizi</Link>
            <a href="#services">Graphical Abstract</a>
            <a href="#services">Veri İşleme</a>
            <Link href="/hizmetler/gecerlilik-guvenilirlik">Geçerlilik ve Güvenilirlik Analizi</Link>
            <Link href="/hizmetler/proforma">Proforma</Link>
            <a href="#services">Danışmanlık</a>
          </nav>

          <address className="landing-footer-column landing-footer-contact">
            <h2>İletişim</h2>
            <p>Körfez Mahallesi<br />19 Mayıs Kümesi<br />Küme Evleri No:188-14<br />Atakum, Samsun</p>
            <div><a href="tel:+908508851256">0 (850) 885 12 56</a><a href="tel:+905386150444">0 (538) 615 04 44</a></div>
            <a href="mailto:info@eistatistik.com">info@eistatistik.com</a>
          </address>
        </div>

        <div className="landing-footer-bottom">
          <p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p>
          <div className="landing-footer-socials" aria-label="Sosyal medya hesapları">
            <a href="https://www.instagram.com/eistatistik/" target="_blank" rel="noopener noreferrer" aria-label="Eİstatistik Instagram hesabı"><FooterSocialIcon name="instagram" /></a>
            <a href="https://x.com/naci_murat" target="_blank" rel="noopener noreferrer" aria-label="Naci Murat X hesabı"><FooterSocialIcon name="x" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
