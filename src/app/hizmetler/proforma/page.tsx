import Image from "next/image";
import Link from "next/link";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingHeader } from "../../components/LandingHeader";

const needs = [
  ["Proje yürütücüsüne ait bilgiler", "Ad soyad ve iletişim bilgileri — faturanın kime düzenleneceğini belirler."],
  ["Proje adı", "Çalışmanızın resmi başlığı, teklif ve belge üzerinde bu şekilde yer alır."],
  ["Proje numarası", "Varsa kurum, enstitü veya destek programına ait proje numarası."],
  ["Projenin amacı", "Kapsamı doğru fiyatlandırabilmemiz için çalışmanın hedefi."],
  ["Test edilecek hipotezler", "Projeye ait hipotezler, gerekli analiz kapsamını netleştirir."],
];

const flow = [
  ["01", "Talebiniz uzmanca değerlendirilir", "Bilgiler tarafımıza ulaştıktan sonra alan uzmanı hocalarımız kapsamı inceler; ilgili fiyat teklifi PDF olarak hazırlanıp sistem üzerinden sizlere iletilir."],
  ["02", "Kuruma özel bilgiler eklenir", "Başvuru yapılacak kuruma göre bilgi talepleri değişebilir. Proforma faturada bulunması gereken özel bilgiler varsa talep aşamasında bunları ayrıntılı biçimde iletmeniz yeterlidir."],
  ["03", "Hizmet e-fatura ile tamamlanır", "Hizmet alımı firmamızdan yapılacaksa tüm analiz süreçleriniz online yürütülür; hizmet bedeline ait fatura e-fatura olarak düzenlenip tarafınıza online gönderilir."],
];

const faqs: Array<[string, string]> = [
  ["Süreç nasıl işliyor?", "Gerekli bilgileri sistem üzerinden ilettikten sonra talebiniz alan uzmanımızca değerlendirilir. Kapsam netleştiğinde fiyat teklifi PDF olarak hazırlanır ve aynı ekrandan tarafınıza iletilir; onayınızın ardından süreç başlar."],
  ["Bu süreçte nasıl iletişim kurabilirim?", "Talebinize özel yazışma alanını kullanabilir, ek bilgi ve belgeleri buradan paylaşabilirsiniz. Gerektiğinde sistem üzerinden çevrim içi görüşme de planlanabilir."],
  ["Çalıştığım alanı (tıp, diş hekimliği vb.) bilen bir uzmanla mı çalışacağım?", "Evet. Tıp, diş hekimliği, sağlık, sosyal ve eğitim bilimleri gibi farklı alanlardaki çalışmalar, konu ve yöntem ihtiyacına göre o alanı bilen uzmana yönlendirilir."],
  ["Analizler için teslim süresi nedir?", "Teslim süresi çalışmanın kapsamına ve seçtiğiniz hizmete göre belirlenir. Talep aşamasında size uygun teslim seçeneğini görebilir ve seçebilirsiniz."],
  ["Sonuçları hangi formatta alacağım?", "Kapsama göre analiz raporu, düzenlenebilir tablolar, yayın kalitesinde grafikler, program çıktıları ve videolu anlatım çalışma alanınıza yüklenir."],
  ["Ek analiz yaptırmak istersem ne yapmalıyım?", "Uygun siparişlerde teslim sonrasında Ek Analiz talebi açabilirsiniz. Yeni ihtiyacınızı mevcut çalışma üzerinden iletmeniz yeterlidir."],
  ["Sesli rapor desteği alabilir miyim?", "Analiz sonuçlarınız, bulguların nasıl yorumlanacağını adım adım açıklayan videolu ve sesli uzman anlatımıyla birlikte sunulabilir. Böylece raporu kendi çalışmanıza güvenle aktarabilirsiniz."],
];

export default function ProformaPage() {
  return (
    <main className="landing-page analysis-service-page proforma-service-page">
      <LandingHeader />

      <section className="proforma-hero">
        <div className="proforma-hero-pattern" aria-hidden="true" />
        <div className="proforma-hero-copy">
          <p className="analysis-eyebrow">PROFORMA FATURA</p>
          <h1>Kurumsal başvurularınız için <span>hazır proforma.</span></h1>
          <p>Bilimsel araştırma süreçlerinizde ihtiyaç duyacağınız proforma talepleriniz birkaç saat içinde yanıtlanır. Sağlıklı bir süreç yönetimi ve kesin fiyatlandırma için gereken bilgileri iletmeniz yeterlidir.</p>
          <div className="analysis-hero-actions">
            <Link href="/giris">Proforma talebi oluştur <span aria-hidden="true">→</span></Link>
            <a href="#proforma-needs">Gerekli bilgiler</a>
          </div>
          <div className="analysis-hero-proof"><span>Birkaç saatte yanıt</span><span>PDF fiyat teklifi</span><span>Online e-fatura</span></div>
        </div>

        <div className="proforma-hero-visual" aria-label="Proforma fatura önizlemesi">
          <div className="proforma-doc">
            <div className="proforma-doc-bar"><i /><i /><i /><b>Proforma fatura</b></div>
            <div className="proforma-doc-body">
              <div className="proforma-doc-head">
                <Image src="/Siyah e-istatistik.png" alt="Eİstatistik" width={150} height={35} />
                <span>PROFORMA FATURA</span>
              </div>
              <div className="proforma-doc-meta">
                <p>Sayın</p>
                <div><span>Kurum / Kuruluş / Şahıs adı</span><i /></div>
                <div><span>T.C. Kimlik / Vergi No</span><i /></div>
                <div><span>Telefon</span><i /></div>
                <div><span>E-posta</span><i /></div>
              </div>
              <div className="proforma-doc-table">
                <div className="proforma-doc-row head"><span>No</span><span>İş tanımı</span><span>Adet</span><span>Tutar</span></div>
                <div className="proforma-doc-row"><span>1</span><span>İstatistiksel veri analizi</span><span>1</span><b>Teklife özel</b></div>
              </div>
              <div className="proforma-doc-totals">
                <div><span>Ara toplam</span><b>Teklife özel</b></div>
                <div><span>KDV</span><b>Muaf</b></div>
                <div className="grand"><span>Toplam</span><b>PDF ile</b></div>
              </div>
            </div>
          </div>
          <div className="proforma-float response"><span>Yanıt süresi</span><strong>Birkaç saat</strong></div>
          <div className="proforma-float delivery"><span>Teslim</span><strong>PDF fiyat teklifi</strong><small>Sistem üzerinden</small></div>
        </div>
      </section>

      <section className="analysis-trust-strip" aria-label="Proforma avantajları">
        <div><strong>01</strong><span><b>Hızlı geri dönüş</b>Talebiniz birkaç saat içinde yanıtlanır</span></div>
        <div><strong>02</strong><span><b>Kesin fiyatlandırma</b>Kapsama göre net, gerekçeli teklif</span></div>
        <div><strong>03</strong><span><b>Kuruma uygun belge</b>Başvuru biriminin istediği formata uyum</span></div>
      </section>

      <section className="proforma-needs" id="proforma-needs">
        <header><h2>Kesin bir teklif için ihtiyaç duyduğumuz bilgiler.</h2><p>Aşağıdaki bilgileri talep aşamasında sistem üzerinden ilettiğinizde, uzman ekibimiz kapsamı doğru değerlendirip proformanızı hazırlar.</p></header>
        <div className="proforma-need-list">{needs.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{copy}</p></div></article>)}</div>
      </section>

      <section className="proforma-flow">
        <div className="proforma-flow-intro"><h2>Talepten e-faturaya kadar tek akış.</h2><p>Proforma sürecinin her adımı çalışma alanınıza işlenir; teklif, onay ve fatura aynı yerden ilerler.</p><Link href="/giris">Talebinizi başlatın <span>→</span></Link></div>
        <div className="proforma-flow-list">{flow.map(([number, title, copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </section>

      <section className="analysis-faq-section proforma-faq">
        <div><h2>Proforma hakkında merak ettikleriniz.</h2><p>Başvuru biriminizin farklı bir bilgi talebi varsa iletin; uzman ekibimiz süreci sizinle birlikte netleştirsin.</p><a href="mailto:destek@eistatistik.com">destek@eistatistik.com</a></div>
        <LandingFaq items={faqs} />
      </section>

      <section className="analysis-final-cta"><div><span>PROFORMANIZI BİRLİKTE HAZIRLAYALIM</span><h2>Başvuru sürecinize doğru belgeyle başlayın.</h2><p>Proje bilgilerinizi iletin. Uzman ekibimiz kapsamı değerlendirip fiyat teklifinizi hazırlasın.</p></div><Link href="/giris">Proforma talebi oluştur <span>→</span></Link></section>

      <footer className="landing-footer"><Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} /><div><Link href="/#services">Hizmetler</Link><Link href="/#platform">Platform</Link><a href="mailto:destek@eistatistik.com">İletişim</a><Link href="/giris">Giriş yap</Link></div><p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p></footer>
    </main>
  );
}
