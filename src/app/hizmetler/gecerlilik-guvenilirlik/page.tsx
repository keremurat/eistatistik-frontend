import Link from "next/link";
import type { CSSProperties } from "react";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingHeader } from "../../components/LandingHeader";
import { LandingFooter } from "../../components/LandingFooter";
import { getGmailContactUrl } from "../../lib/contact";

const analysisTypes = [
  ["İç tutarlılık", "Cronbach Alfa, Omega ve madde–toplam korelasyonlarıyla ölçeğin kendi içindeki uyumunu değerlendirin.", "α / ω"],
  ["Yapı geçerliliği", "Açımlayıcı ve doğrulayıcı faktör analizleriyle maddelerin kuramsal yapıyı temsil edip etmediğini inceleyin.", "EFA / CFA"],
  ["Ölçüt geçerliliği", "Ölçeğinizi kabul görmüş bir dış ölçütle karşılaştırarak eş zamanlı veya yordayıcı kanıt üretin.", "r"],
  ["Zamana karşı kararlılık", "Test–tekrar test ve gözlemciler arası uyum ölçümleriyle sonuçların tekrarlanabilirliğini gösterin.", "ICC"],
];

const process = [
  ["01", "Ölçme aracını tanıyın", "Ölçeğin amacı, hedef kitlesi, madde yapısı ve varsa uyarlama süreci değerlendirilir."],
  ["02", "Veriyi hazırlayın", "Eksik gözlemler, ters maddeler, aykırı değerler ve analiz varsayımları kontrol edilir."],
  ["03", "Yapıyı test edin", "Araştırma tasarımına göre EFA, CFA ve ilgili uyum indeksleri uygulanır."],
  ["04", "Tutarlılığı ölçün", "Alfa, Omega, KR-20, split-half veya ICC gibi uygun katsayılar hesaplanır."],
  ["05", "Kanıtları raporlayın", "Madde kararları, katsayılar, faktör yapısı ve yöntem açıklaması akademik biçimde sunulur."],
];

const faqs: Array<[string, string]> = [
  ["Süreç Nasıl İşliyor?", "Talep oluşturduğunuzda hipotezlerinizi, isteklerinizi, verilerinizi inceleyerek sizlere ulaşıyoruz. Önceliğimiz sizin isteklerinizden yola çıkarak, önerilerde bulunarak çalışmalarınızı daha güçlü hale getirebilmek için sizlerle iletişim kurarak nihai istekleri belirlemek. İstekler netleştiğinde sizlere fiyat teklifi gönderiyoruz ve kabul ettiğiniz andan itibaren süreç başlıyor. Örneğin 7 gün olarak seçtiğiniz analiz süresi için, 7 gün içinde sonuçlar sizlere iletiliyor. Sonuçları inceledikten sonra farklı bir analiz yapılmasını isterseniz “ek analiz” talebinde bulunabilirsiniz. Bu tamamen ücretsizdir."],
  ["Bu Süreçte Nasıl İletişim Kurabilirim?", "İstatistiksel veri analizi süreci öncesi, süreç ve sonrasında bizlere dilediğiniz zaman ulaşabilirsiniz. 08508851256 numaralı hattımızı arayarak bilgi alabilir, soru sorabilir, istatistiksel veri analiz sürecinizi yöneten hocanız ile görüşebilirsiniz. Aynı zamanda siparişinize ait “yazışma” sekmesi ile hocanıza sorularınızı ileterek aktif olarak yazışma sekmesini kullanabilirsiniz."],
  ["Benim Çalıştığım Alan İle İlgili (Tıp, Diş Hekimliği Vb.) Benim Dilimden Anlayabilecek Hocalar İle Mi Çalışacağım?", "Çalışmanız için talep oluşturduğunuzda sizlerin alanına göre hocalarımızı yönlendiriyoruz. Bu sayede alanınızdaki terimleri, yapılan analiz türlerini, kullanılan yöntemleri bilen bir istatistik uzmanı ile iletişime geçmenin konforunu yaşayabilirsiniz."],
  ["Analizler İçin Teslimat Süresi Nedir?", "Süreyi tamamen siz belirliyorsunuz. 12 saat – 30 gün arasında değişen seçeneklerden size uygun olan süreyi seçebilirsiniz. Ortalama bir süre için 7 gün seçebilir, acil bir analiz durumunda 12 saat içinde teslimat isteyebilirsiniz."],
  ["Sonuçları Hangi Formatta Alacağım?", "Sonuçlarınızı 3 farklı formatta alabilirsiniz.\n\n1. Tablo ve Yorum: Bu teslimat şeklinde analiz sonuçlarınız tablo, yorum ve grafikler halinde teslim edilir. Yorumlar istatistiksel olarak tüm detayları ile birlikte hazırlanır. Tablolar APA formatına uygundur. Eğer istediğiniz farklı bir tablo formatı olursa çalışmanın başında bize iletebilirsiniz.\n\n2. Tablo: Bu teslimat şeklinde analiz sonuçları tablo olarak istediğiniz formatta talep edebilirsiniz. Tabloları gördüğünde yorumları yapabilen kişiler için uygun bir formattır. Dilerseniz örnek yorumlama tablo altına eklenir.\n\n3. Program çıktısı: Bu teslimat şeklinde analizlerden elde edilen sonuçlar program çıktı dosyası veya Excel dosyası içinde teslim edilir. Program çıktısını gördüğünde tablo şekline dönüştürebilen ve yorumlayabilen kişiler için uygundur."],
  ["Analiz Raporumu İnceledim, Birkaç Analiz Daha Yapılmasını İstiyorum Ne Yapmalıyım?", "Raporunuzu incelediğinizde eklenmesini istediğiniz yeni analizler için, raporunuzun sizlere teslim edildiği andan itibaren görecek olduğunuz “ek analiz” hakkınızı kullanarak ücretsiz olarak yeni isteklerinizi gönderebilirsiniz. Raporunuz güncellenerek sizlere tekrar iletilecektir."],
  ["Sesli Rapor Desteği", "Veri analizi raporunuz için bizlerden sesli rapor talep edebilirsiniz. Sonuçlarınız video olarak adım adım anlatılacak ve sizler de dilediğiniz zaman video açıklamaya ulaşıyor olabileceksiniz."],
];

export default function ValidityReliabilityPage() {
  return (
    <main className="landing-page analysis-service-page validity-service-page">
      <LandingHeader />

      <section className="validity-hero">
        <div className="validity-hero-pattern" aria-hidden="true" />
        <div className="validity-hero-copy">
          <p className="analysis-eyebrow">GEÇERLİLİK VE GÜVENİLİRLİK ANALİZİ</p>
          <h1>Ölçümünüz tutarlıysa, <span>sonucunuz güven verir.</span></h1>
          <p>Ölçek geliştirme ve uyarlama çalışmalarınızda madde yapısını, ölçüm kararlılığını ve geçerlilik kanıtlarını uzman desteğiyle inceleyin.</p>
          <div className="analysis-hero-actions"><Link href="/giris">Analiz talebi oluştur <span>→</span></Link><a href="#validity-scope">Analiz kapsamı</a></div>
          <div className="analysis-hero-proof"><span>Ölçek geliştirme</span><span>Ölçek uyarlama</span><span>Akademik raporlama</span></div>
        </div>

        <div className="validity-hero-visual" aria-label="Geçerlilik ve güvenilirlik analiz ekranı">
          <div className="validity-workspace">
            <div className="validity-window-bar"><i /><i /><i /><b>Ölçek değerlendirme çalışma alanı</b></div>
            <div className="validity-window-body">
              <div className="validity-window-head"><div><small>ÖLÇEK ANALİZİ</small><strong>Araştırma Tutum Ölçeği</strong></div><span>28 madde</span></div>
              <div className="validity-score-grid"><article><span>Güvenilirlik</span><strong>.91</strong><i><em /></i><small>Yüksek iç tutarlılık</small></article><article><span>KMO değeri</span><strong>.87</strong><i><em /></i><small>Faktör analizine uygun</small></article></div>
              <div className="validity-factor-area">
                <div className="validity-factor-chart"><span>Faktör 1</span><i style={{"--load":"88%"} as CSSProperties} /><i style={{"--load":"72%"} as CSSProperties} /><i style={{"--load":"65%"} as CSSProperties} /><i style={{"--load":"79%"} as CSSProperties} /></div>
                <div className="validity-factor-chart second"><span>Faktör 2</span><i style={{"--load":"54%"} as CSSProperties} /><i style={{"--load":"83%"} as CSSProperties} /><i style={{"--load":"69%"} as CSSProperties} /><i style={{"--load":"76%"} as CSSProperties} /></div>
              </div>
              <div className="validity-model"><span>F1</span><i /><b>M01</b><i /><b>M02</b><i /><b>M03</b><i /><span>F2</span></div>
            </div>
          </div>
          <div className="validity-float alpha"><span>Cronbach Alfa</span><strong>α = .91</strong><small>Güvenilir</small></div>
          <div className="validity-float fit"><span>Model uyumu</span><strong>CFI .96</strong><i><em /></i></div>
        </div>
      </section>

      <section className="validity-duality">
        <article><span>01</span><div><small>GÜVENİLİRLİK</small><h2>Aynı koşullarda benzer sonuç üretir mi?</h2><p>Ölçümün kararlılığını, iç tutarlılığını ve tekrarlanabilirliğini test edin.</p></div></article>
        <article><span>02</span><div><small>GEÇERLİLİK</small><h2>Gerçekten ölçmek istediğiniz yapıyı ölçüyor mu?</h2><p>Kapsam, yapı ve ölçüt kanıtlarıyla ölçme aracının amacına uygunluğunu gösterin.</p></div></article>
      </section>

      <section className="validity-scope" id="validity-scope">
        <header><h2>Tek bir katsayı değil, bütünlüklü ölçüm kanıtı.</h2><p>Her araştırmada aynı analiz setini uygulamak yerine ölçeğin türüne, geliştirme aşamasına ve veri yapısına uygun kanıtları seçiyoruz.</p></header>
        <div className="validity-type-grid">{analysisTypes.map(([title,copy,mark],index) => <article key={title} className={index===0?"featured":""}><span>{mark}</span><h3>{title}</h3><p>{copy}</p><b>{String(index+1).padStart(2,"0")}</b></article>)}</div>
      </section>

      <section className="validity-process">
        <div className="validity-process-intro"><h2>Ham maddelerden savunulabilir bir ölçme aracına.</h2><p>Analiz kararları görünür, gerekçeli ve tez ya da makalenizde açıklanabilir biçimde ilerler.</p><Link href="/giris">Ölçeğinizi değerlendirelim <span>→</span></Link></div>
        <div className="validity-process-list">{process.map(([number,title,copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </section>

      <section className="validity-techniques">
        <div><p>ANALİZ TEKNİKLERİ</p><h2>Çalışmanızın ihtiyacına göre doğru test seti.</h2><span>IBM SPSS, AMOS, R Project ve Minitab gibi araçlarla sonuçlar uzman kontrolünde hazırlanır.</span></div>
        <div className="validity-technique-columns"><section><strong>Güvenilirlik</strong><ul><li>Cronbach Alfa ve Omega</li><li>Split-half</li><li>Kuder–Richardson 20</li><li>Test–tekrar test</li><li>ICC ve gözlemciler arası uyum</li></ul></section><section><strong>Geçerlilik</strong><ul><li>Kapsam geçerliliği</li><li>Açımlayıcı faktör analizi</li><li>Doğrulayıcı faktör analizi</li><li>Ölçüt ve uyum geçerliliği</li><li>Yakınsak ve ayrışan geçerlilik</li></ul></section></div>
      </section>

      <section className="validity-report">
        <div className="validity-report-visual" aria-hidden="true"><div className="validity-report-sheet"><span /><span /><span /><div><i /><i /><i /><i /><i /></div></div><div className="validity-report-badge"><strong>5</strong><span>teslim bileşeni</span></div></div>
        <div><h2>Yalnızca “güvenilir” demekle kalmayan bir rapor.</h2><p>Madde kararları, faktör yükleri, uyum indeksleri ve kullanılan yöntemin gerekçesi tek bir akademik anlatıda bir araya gelir.</p><ul><li>Analiz ve yöntem raporu</li><li>Madde ve faktör tabloları</li><li>Model görselleri</li><li>Program çıktıları</li><li>Videolu uzman anlatımı</li></ul></div>
      </section>

      <section className="analysis-faq-section validity-faq"><div><h2>Ölçek analizi hakkında merak ettikleriniz.</h2><p>Ölçeğiniz geliştirme, uyarlama veya tekrar doğrulama aşamasındaysa kapsamı birlikte netleştirebiliriz.</p><a href={getGmailContactUrl("Geçerlilik ve Güvenilirlik Analizi")} target="_blank" rel="noopener noreferrer">info@eistatistik.com</a></div><LandingFaq items={faqs} /></section>

      <section className="analysis-final-cta"><div><span>ÖLÇME ARACINIZI BİRLİKTE İNCELEYELİM</span><h2>Sonuçlarınızdan önce ölçümünüze güvenin.</h2><p>Ölçek formunuzu ve veri setinizi yükleyin. Uzman ekibimiz uygun analiz kapsamını sizinle paylaşsın.</p></div><Link href="/giris">Analiz talebi oluştur <span>→</span></Link></section>

      <LandingFooter />
    </main>
  );
}
