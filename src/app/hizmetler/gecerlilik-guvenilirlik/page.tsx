import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingHeader } from "../../components/LandingHeader";

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
  ["Geçerlilik ve güvenilirlik arasındaki fark nedir?", "Güvenilirlik ölçümün kararlı ve tutarlı olmasını; geçerlilik ise ölçme aracının amaçlanan yapıyı gerçekten ölçmesini ifade eder. Güvenilirlik geçerlilik için gereklidir ancak tek başına yeterli değildir."],
  ["Hazır bir ölçek kullanırken yeniden analiz gerekir mi?", "Ölçeğin farklı bir örneklem, kültür veya dilde kullanılması durumunda yapının ve güvenilirliğin yeniden incelenmesi gerekebilir. Karar araştırma bağlamına göre verilir."],
  ["Ölçek geliştirme sürecinin hangi aşamalarında destek alabilirim?", "Madde havuzu planlama, uzman görüşü, pilot uygulama, faktör analizi, madde eleme ve nihai raporlama aşamalarında destek alabilirsiniz."],
  ["Analiz için kaç katılımcı gerekir?", "Gerekli örneklem; madde sayısı, faktör yapısı, analiz yöntemi ve beklenen yükler gibi değişkenlere bağlıdır. Çalışmanız için ayrıca Power ve örneklem analizi yapılabilir."],
  ["Sonuçları hangi formatlarda alacağım?", "Kapsama göre analiz raporu, faktör tabloları, uyum indeksleri, model görselleri, program çıktıları ve videolu anlatım teslim edilir."],
  ["Teslimden sonra madde yapısını yeniden inceletebilir miyim?", "Uygun siparişlerde Ek Analiz talebi oluşturarak alternatif faktör yapıları veya farklı madde kararları için yeni değerlendirme isteyebilirsiniz."],
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

      <section className="analysis-faq-section validity-faq"><div><h2>Ölçek analizi hakkında merak ettikleriniz.</h2><p>Ölçeğiniz geliştirme, uyarlama veya tekrar doğrulama aşamasındaysa kapsamı birlikte netleştirebiliriz.</p><a href="mailto:destek@eistatistik.com">destek@eistatistik.com</a></div><LandingFaq items={faqs} /></section>

      <section className="analysis-final-cta"><div><span>ÖLÇME ARACINIZI BİRLİKTE İNCELEYELİM</span><h2>Sonuçlarınızdan önce ölçümünüze güvenin.</h2><p>Ölçek formunuzu ve veri setinizi yükleyin. Uzman ekibimiz uygun analiz kapsamını sizinle paylaşsın.</p></div><Link href="/giris">Analiz talebi oluştur <span>→</span></Link></section>

      <footer className="landing-footer"><Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} /><div><Link href="/#services">Hizmetler</Link><Link href="/#platform">Platform</Link><a href="mailto:destek@eistatistik.com">İletişim</a><Link href="/giris">Giriş yap</Link></div><p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p></footer>
    </main>
  );
}
