import Link from "next/link";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingHeader } from "../../components/LandingHeader";
import { LandingFooter } from "../../components/LandingFooter";
import { getGmailContactUrl } from "../../lib/contact";

const powerSteps = [
  ["01", "Hipotezi netleştirin", "Primer çıktıyı ve araştırmada sınanacak temel hipotezi birlikte belirleyelim."],
  ["02", "Literatürü değerlendirin", "Benzer çalışmalardaki ortalama, standart sapma ve beklenen etkiyi inceleyelim."],
  ["03", "Pilot veriyi kullanın", "Uygun kaynak yoksa pilot çalışmanızdan güvenilir bir etki büyüklüğü üretelim."],
  ["04", "Örneklemi hesaplayın", "Test türü, alfa, güç ve beklenen kayıplarla gerekli minimum örneklemi belirleyelim."],
  ["05", "Sonucu raporlayın", "Etik kurul, tez veya makalenizde kullanabileceğiniz yöntem açıklamasını hazırlayalım."],
];

const faqs: Array<[string, string]> = [
  ["Süreç Nasıl İşliyor?", "Power analizi talebinde bulunduğunuzda seçtiğiniz süreye göre ücret otomatik olarak karşınıza çıkacaktır. Ödeme yaptığınız andan itibaren seçtiğiniz süre (12 saat – 7 gün) sonucunda raporunuz sizlere iletilecektir. Raporunuzu sistem üzerinde ilgili sipariş numaranıza ait “teslimat dosyası” sekmesinden indirebilirsiniz."],
  ["Bu Süreçte Nasıl İletişim Kurabilirim?", "Power analizi öncesi, süreç ve sonrasında bizlere dilediğiniz zaman ulaşabilirsiniz. 08508851256 numaralı hattımızı arayarak bilgi alabilir, soru sorabilir, istatistik analiz sürecinizi yöneten hocanız ile görüşebilirsiniz. Aynı zamanda siparişinize ait “yazışma” sekmesi ile hocanıza sorularınızı ileterek aktif olarak yazışma sekmesini kullanabilirsiniz."],
  ["Benim Çalıştığım Alan İle İlgili (Tıp, Diş Hekimliği Vb.) Benim Dilimden Anlayabilecek Hocalar İle Mi Çalışacağım?", "Çalışmanız için talep oluşturduğunuzda sizlerin alanına göre hocalarımızı yönlendiriyoruz. Bu sayede alanınızdaki terimleri, yapılan analiz türlerini, kullanılan yöntemleri bilen bir istatistik uzmanı ile iletişime geçmenin konforunu yaşayabilirsiniz."],
  ["Power Analizi İçin Teslimat Süresi Nedir?", "Süreyi tamamen siz belirliyorsunuz. 12 saat – 7 gün arasında değişen seçeneklerden size uygun olan süreyi seçebilirsiniz."],
  ["Power Analizi Raporumu İnceledim, Farklı Bir Örnek Çalışma İle Tekrar Analiz Yapılmasını İstiyorum Ne Yapmalıyım?", "Raporunuzu incelediğinizde yeni bir hesaplama için, raporunuzun sizlere teslim edildiği andan itibaren görecek olduğunuz “ek analiz” hakkınızı kullanarak örnek yeni bir çalışma gönderebilirsiniz. Raporunuz güncellenerek sizlere tekrar iletilecektir."],
];

export default function PowerAnalysisPage() {
  return (
    <main className="landing-page analysis-service-page power-service-page">
      <LandingHeader />

      <section className="power-hero">
        <div className="power-hero-grid" aria-hidden="true" />
        <div className="power-hero-copy">
          <p className="analysis-eyebrow">POWER VE ÖRNEKLEM ANALİZİ</p>
          <h1>Örneklemi tahminle değil, <span>kanıtla belirleyin.</span></h1>
          <p>Araştırmanız için gereken örneklem büyüklüğünü bilimsel, gerekçelendirilebilir ve etik kurul standartlarına uygun biçimde hesaplayın.</p>
          <div className="analysis-hero-actions"><Link href="/giris">Power analizi talebi oluştur <span>→</span></Link><a href="#power-process">Nasıl çalışır?</a></div>
          <div className="analysis-hero-proof"><span>A priori ve post hoc analiz</span><span>Etik kurul uyumlu rapor</span><span>Uzman yöntem desteği</span></div>
        </div>

        <div className="power-hero-visual" aria-label="Power analizi örnek hesaplama ekranı">
          <div className="power-calculator">
            <div className="power-calculator-bar"><i /><i /><i /><b>Örneklem planlama çalışma alanı</b></div>
            <div className="power-calculator-body">
              <div className="power-calc-heading"><div><small>İKİ BAĞIMSIZ GRUP</small><strong>Örneklem hesaplaması</strong></div><span>Hesaplandı</span></div>
              <div className="power-fields"><label>Etki büyüklüğü <b>0.50</b><i><em /></i></label><label>α hata olasılığı <b>0.05</b><i><em /></i></label><label>Test gücü (1−β) <b>0.80</b><i><em /></i></label></div>
              <div className="power-distribution"><div className="curve curve-a" /><div className="curve curve-b" /><span className="mean-a">Kontrol</span><span className="mean-b">Deney</span><i className="power-threshold" /></div>
              <div className="power-result-row"><div><small>Toplam örneklem</small><strong>128</strong></div><div><small>Grup başına</small><strong>64</strong></div><div><small>Gerçekleşen güç</small><strong>%80.1</strong></div></div>
            </div>
          </div>
          <div className="power-float-card float-power"><span>Test gücü</span><strong>%80</strong><i><em /></i></div>
          <div className="power-float-card float-sample"><span>Önerilen örneklem</span><strong>n = 128</strong><small>%10 kayıp dahil</small></div>
        </div>
      </section>

      <section className="analysis-trust-strip" aria-label="Power analizi avantajları">
        <div><strong>α</strong><span><b>Tip I hata kontrolü</b>Yanlış pozitif sonuç riskini sınırlandırın</span></div>
        <div><strong>β</strong><span><b>Tip II hata kontrolü</b>Gerçek etkiyi kaçırma riskini azaltın</span></div>
        <div><strong>1−β</strong><span><b>Yeterli test gücü</b>Çalışmayı en az %80 güçle planlayın</span></div>
      </section>

      <section className="power-importance">
        <header><h2>Ne eksik ne fazla. Araştırmanız için gereken kadar.</h2><p>Yetersiz örneklem gerçek bir farkı kaçırabilir; gereğinden fazla örneklem ise zaman, bütçe ve etik kaynakları gereksiz tüketir.</p></header>
        <div className="power-importance-grid">
          <article className="power-importance-main"><div className="power-balance-graphic" aria-hidden="true"><span className="balance-low">Yetersiz</span><i /><b>Optimum örneklem</b><i /><span className="balance-high">Gereğinden fazla</span></div><h3>Bilimsel doğruluk ile kaynak verimliliğini dengeleyin.</h3><p>Güç analizi, araştırmanın bir farkı saptayabilecek yeterlilikte olmasını sağlarken gereksiz katılımcı ve maliyet kullanımını önler.</p></article>
          <article><span>ETİK KURUL</span><h3>Başvurunuzu sayısal gerekçeyle destekleyin.</h3><p>Klinik araştırma ve hayvan deneylerinde örneklem sayısının neden yeterli olduğunu açıkça raporlayın.</p></article>
          <article><span>YAYIN SÜRECİ</span><h3>Yöntem bölümünüzü güçlendirin.</h3><p>Hakemlerin örneklem yeterliliği sorusuna tekrarlanabilir bir hesaplamayla yanıt verin.</p></article>
        </div>
      </section>

      <section className="power-process" id="power-process">
        <div className="power-process-intro"><h2>Beş adımda savunulabilir bir örneklem planı.</h2><p>Hesaplama, yalnızca programa birkaç sayı girmek değildir. Her parametrenin araştırmanız içinde bilimsel bir karşılığı olmalıdır.</p></div>
        <div className="power-step-list">{powerSteps.map(([number,title,copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </section>

      <section className="power-concepts">
        <div className="power-concepts-copy"><h2>Hesabın arkasındaki dört temel kavram.</h2><p>Power raporunda yer alan her değer, araştırmanızın hata toleransını ve gerçek etkiyi yakalama kapasitesini tanımlar.</p><Link href="/giris">Çalışmanızı değerlendirelim <span>→</span></Link></div>
        <div className="power-concept-grid">
          <article><span>α</span><div><strong>Tip I hata</strong><p>Gerçekte olmayan bir farkı varmış gibi kabul etme olasılığı.</p></div><b>Genellikle 0.05</b></article>
          <article><span>β</span><div><strong>Tip II hata</strong><p>Gerçekte var olan etkiyi istatistiksel olarak kaçırma olasılığı.</p></div><b>En fazla 0.20</b></article>
          <article><span>1−β</span><div><strong>Testin gücü</strong><p>Araştırmanın gerçek bir etkiyi doğru biçimde saptama olasılığı.</p></div><b>En az %80</b></article>
          <article><span>d</span><div><strong>Etki büyüklüğü</strong><p>Gruplar veya değişkenler arasındaki farkın standartlaştırılmış ölçüsü.</p></div><b>Veriye özel</b></article>
        </div>
      </section>

      <section className="power-tools">
        <div><p>HESAPLAMA ARAÇLARI</p><h2>Doğru araç, doğru parametre ve uzman kontrolü.</h2><span>Hesaplamalarda araştırmanın ihtiyacına göre lisanslı ve bilimsel olarak kabul gören yazılımlar kullanılır.</span></div>
        <div className="power-tool-cloud"><strong>G*Power</strong><strong>IBM SPSS SamplePower</strong><strong>PASS</strong><strong>STATA</strong><strong>R Project</strong><strong>Minitab</strong><strong>MedCalc</strong><strong>OpenEpi</strong></div>
      </section>

      <section className="analysis-faq-section power-faq"><div><h2>Power analizi hakkında merak ettikleriniz.</h2><p>Araştırma tasarımınız standart örneklere uymuyorsa talebinizi iletin; yöntem ekibimiz kapsamı değerlendirsin.</p><a href={getGmailContactUrl("Power Analizi")} target="_blank" rel="noopener noreferrer">info@eistatistik.com</a></div><LandingFaq items={faqs} /></section>

      <section className="analysis-final-cta"><div><span>ÖRNEKLEMİNİZİ BİRLİKTE PLANLAYALIM</span><h2>Araştırmanıza doğru sayıyla başlayın.</h2><p>Hipotezinizi ve çalışma planınızı iletin. Uzman ekibimiz gerekli parametreleri birlikte netleştirsin.</p></div><Link href="/giris">Power analizi talebi <span>→</span></Link></section>

      <LandingFooter />
    </main>
  );
}
