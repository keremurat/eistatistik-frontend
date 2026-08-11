import Image from "next/image";
import Link from "next/link";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingFooter } from "../../components/LandingFooter";
import { LandingHeader } from "../../components/LandingHeader";
import { getGmailContactUrl } from "../../lib/contact";

const consultingAreas = [
  {
    title: "Araştırma tasarımı",
    copy: "Araştırma sorusunu, hipotezleri ve doğru istatistiksel yöntemi çalışmanızın başında birlikte netleştirin.",
    items: ["Tez ve makale yöntem planı", "Hipotez oluşturma", "Etik kurul yöntem metni"],
  },
  {
    title: "Veri ve analiz hazırlığı",
    copy: "Veri toplamadan analiz aracına kadar bütün teknik kararları tek bir yöntem planında bir araya getirin.",
    items: ["Veri toplama araçları", "Excel ve SPSS şablonları", "Power ve örneklem planı"],
  },
  {
    title: "İstatistiksel analiz desteği",
    copy: "Veri yapınıza uygun testi seçin, analiz sonuçlarını uzman kontrolüyle değerlendirin.",
    items: ["SPSS, R, Minitab, Jamovi, AMOS ve PASS", "Test seçimi", "Sonuç kontrolü"],
  },
  {
    title: "Yayın ve sunum",
    copy: "Bulgularınızı akademik standartlara uygun, açık ve yayınlanabilir bir anlatıma dönüştürün.",
    items: ["Tablo ve veri görselleştirme", "Microsoft Office ve EndNote", "JAMA, The Lancet ve BioRender yaklaşımı"],
  },
];

const process = [
  ["İhtiyacı tanımlayın", "Çalışmanızın aşamasını, araştırma sorusunu ve karşılaştığınız problemi birlikte belirleyelim."],
  ["Uzmanınızla eşleşin", "Alanınızdaki terminolojiyi ve yöntemleri bilen danışmanla doğrudan çalışın."],
  ["Yol haritasını kurun", "Öncelikleri, kullanılacak araçları ve teslim hedeflerini net bir plana dönüştürelim."],
  ["Birlikte ilerleyin", "Kararları uygularken sorularınızı iletin, çıktıları kontrol edin ve planı gerektiğinde güncelleyin."],
];

const faqs: Array<[string, string]> = [
  ["Süreç Nasıl İşliyor?", "Talep oluşturduğunuzda hipotezlerinizi, isteklerinizi ve dosyalarınızı inceleyerek size ulaşıyoruz. Önceliğimiz, ihtiyacınızı doğru tanımlamak ve çalışmanızı güçlendirecek kapsamı birlikte belirlemektir. Kapsam netleştiğinde fiyat teklifini iletiyor, onayınızdan sonra danışmanlık sürecini başlatıyoruz."],
  ["Bu Süreçte Nasıl İletişim Kurabilirim?", "Danışmanlık öncesinde, süreç boyunca ve sonrasında bize dilediğiniz zaman ulaşabilirsiniz. 08508851256 numaralı hattımızdan bilgi alabilir, soru sorabilir ve çalışmanızı yöneten uzmanla görüşebilirsiniz. Siparişinize ait yazışma alanından uzmanınıza doğrudan mesaj da iletebilirsiniz."],
  ["Benim Çalıştığım Alan İle İlgili (Tıp, Diş Hekimliği Vb.) Benim Dilimden Anlayabilecek Hocalar İle Mi Çalışacağım?", "Talebinizi oluşturduğunuzda çalışmanız, alanınıza uygun uzmanımıza yönlendirilir. Böylece terminolojinizi, araştırma yaklaşımınızı ve kullanılan yöntemleri bilen bir istatistik uzmanıyla çalışırsınız."],
  ["Analizler İçin Teslimat Süresi Nedir?", "Süreyi çalışmanızın kapsamına göre siz belirlersiniz. 12 saat ile 30 gün arasında değişen seçeneklerden ihtiyacınıza uygun olanı seçebilirsiniz. Danışmanlık görüşmelerinin takvimi uzmanınızla birlikte planlanır."],
  ["Sonuçları Hangi Formatta Alacağım?", "Danışmanlık kapsamına göre yöntem planı, düzenlenebilir tablolar, analiz çıktıları, görseller ve uzman notları çalışma alanınıza yüklenir. Görüşme veya videolu anlatım içeren teslimler de sipariş kapsamına göre sunulabilir."],
  ["Analiz Raporumu İnceledim, Birkaç Analiz Daha Yapılmasını İstiyorum Ne Yapmalıyım?", "Teslim sonrasında çalışma alanınızda görünen ek analiz hakkını kullanarak yeni isteklerinizi iletebilirsiniz. Uzmanınız kapsamı değerlendirir, uygun istekleri raporunuza ekleyerek güncel çıktıları yeniden paylaşır."],
  ["Sesli Rapor Desteği", "Sonuçlarınızın ve yöntem kararlarının adım adım anlatıldığı sesli veya videolu rapor desteği talep edebilirsiniz. Açıklamaya çalışma alanınızdan dilediğiniz zaman erişebilirsiniz."],
];

export default function ConsultingPage() {
  return (
    <main className="landing-page analysis-service-page consulting-service-page">
      <LandingHeader />

      <section className="consulting-hero">
        <div className="consulting-hero-copy">
          <p className="analysis-eyebrow">ONLINE AKADEMİK DANIŞMANLIK</p>
          <h1>Araştırmanızın her kararında <span>uzmanınız yanınızda.</span></h1>
          <p>Yöntemden yayına kadar akademik sürecinizi alanınızı bilen bir danışmanla güvenle yönetin.</p>
          <div className="analysis-hero-actions">
            <Link href="/giris">Danışmanlık talebi oluştur <span aria-hidden="true">→</span></Link>
            <a href="#consulting-scope">Kapsamı inceleyin</a>
          </div>
        </div>

        <div className="consulting-hero-media">
          <div className="consulting-hero-photo">
            <Image
              src="/service-illustrations/consulting-hero.png"
              alt="Araştırma verilerini birlikte değerlendiren akademisyen ve istatistik danışmanı"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </div>
          <div className="consulting-media-note">
            <span>Çalışma biçimi</span>
            <strong>Birebir uzman görüşmesi</strong>
            <small>Alanınıza ve araştırma aşamanıza özel yol haritası</small>
          </div>
        </div>
      </section>

      <section className="analysis-trust-strip" aria-label="Danışmanlık hizmeti avantajları">
        <div><strong>01</strong><span><b>Alan uzmanı eşleşmesi</b>Çalışmanızın terminolojisini bilen danışman</span></div>
        <div><strong>02</strong><span><b>Uçtan uca yöntem desteği</b>Araştırma sorusundan yayına kadar rehberlik</span></div>
        <div><strong>03</strong><span><b>Güvenli çalışma alanı</b>Dosya, görüşme ve teslimler tek sistemde</span></div>
      </section>

      <section className="consulting-scope" id="consulting-scope">
        <header>
          <h2>İhtiyacınız olan desteği, doğru aşamada alın.</h2>
          <p>Danışmanlık kapsamı hazır bir paket değildir. Araştırmanızın bulunduğu noktaya göre gereken yöntem, araç ve çıktı birlikte belirlenir.</p>
        </header>
        <div className="consulting-scope-grid">
          {consultingAreas.map((area, index) => (
            <article key={area.title} className={index === 0 ? "featured" : ""}>
              <div><span>{String(index + 1).padStart(2, "0")}</span><h3>{area.title}</h3><p>{area.copy}</p></div>
              <ul>{area.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="consulting-process">
        <div className="consulting-process-intro">
          <h2>Belirsizliği net bir çalışma planına dönüştürün.</h2>
          <p>Her görüşme bir sonraki kararı açık hale getirir. Sürecin nerede olduğunu ve sizden ne beklendiğini her aşamada bilirsiniz.</p>
          <Link href="/giris">Uzmanla çalışmaya başlayın <span aria-hidden="true">→</span></Link>
        </div>
        <div className="consulting-process-list">
          {process.map(([title, copy], index) => (
            <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>
          ))}
        </div>
      </section>

      <section className="consulting-expertise">
        <div className="consulting-expertise-copy">
          <h2>Tek bir programa değil, araştırma probleminize odaklanıyoruz.</h2>
          <p>Yazılım seçimi yöntemin sonucudur. Danışmanınız veri yapınıza ve yayın hedefinize göre uygun aracı belirler.</p>
        </div>
        <div className="consulting-expertise-list">
          <article><strong>Yöntem ve hipotez</strong><p>Bilimsel soruyu test edilebilir bir modele dönüştürün.</p><span>Hipotez, test seçimi, örneklem</span></article>
          <article><strong>Veri yönetimi</strong><p>Toplama ve giriş sürecini analiz hatalarını azaltacak biçimde kurun.</p><span>Excel, SPSS, veri şablonları</span></article>
          <article><strong>Analiz ve kontrol</strong><p>Sonuçların teknik ve metodolojik doğruluğunu uzmanla doğrulayın.</p><span>R, Minitab, Jamovi, AMOS, PASS</span></article>
          <article><strong>Yayın hazırlığı</strong><p>Tablo, grafik ve kaynak yönetimini akademik standartlara taşıyın.</p><span>Office, EndNote, BioRender</span></article>
        </div>
      </section>

      <section className="consulting-reasons">
        <header><h2>Neden eistatistik danışmanlığı?</h2><p>İyi danışmanlık yalnızca soruyu yanıtlamaz, verdiğiniz kararın neden doğru olduğunu da görünür kılar.</p></header>
        <div>
          <article><span>Uzman kadro</span><p>Sağlık, eğitim ve sosyal bilimler dahil farklı alanlarda yöntem deneyimi.</p></article>
          <article><span>Size özel destek</span><p>Genel reçeteler yerine araştırmanızın ihtiyacına göre şekillenen yol haritası.</p></article>
          <article><span>Gizlilik</span><p>Verileriniz, yazışmalarınız ve çalışma çıktılarınız güvenli sistem içinde tutulur.</p></article>
          <article><span>Coğrafi sınır olmadan</span><p>Bulunduğunuz yerden alanınıza uygun uzmanla çevrim içi çalışma olanağı.</p></article>
        </div>
      </section>

      <section className="analysis-faq-section consulting-faq">
        <div><h2>Danışmanlık hakkında merak ettikleriniz.</h2><p>Kapsamınız bu örneklerin dışında kalıyorsa çalışmanızı paylaşın, uygun danışmanlık planını birlikte belirleyelim.</p><a href={getGmailContactUrl("Online Akademik Danışmanlık")} target="_blank" rel="noopener noreferrer">info@eistatistik.com</a></div>
        <LandingFaq items={faqs} />
      </section>

      <section className="analysis-final-cta">
        <div><span>ÇALIŞMANIZI BİRLİKTE PLANLAYALIM</span><h2>Bir sonraki kararınızı uzmanınızla verin.</h2><p>Araştırma aşamanızı ve ihtiyaç duyduğunuz desteği iletin. Size uygun danışmanlık kapsamını birlikte netleştirelim.</p></div>
        <Link href="/giris">Danışmanlık talebi <span aria-hidden="true">→</span></Link>
      </section>

      <LandingFooter />
    </main>
  );
}
