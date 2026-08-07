import Image from "next/image";
import Link from "next/link";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingHeader } from "../../components/LandingHeader";

const stages = [
  {
    number: "01",
    title: "Araştırmanızı doğru zeminde planlayın.",
    lead: "Analize başlamadan önce araştırma sorusunu, hipotezleri ve veri toplama planını birlikte netleştiriyoruz.",
    points: ["Güç ve örneklem büyüklüğü analizi", "Araştırma deseni ve hipotezlerin kontrolü", "Etik kurul ve veri toplama planı", "Veri giriş şablonlarının hazırlanması"],
    note: "Doğru planlanan çalışma, analiz aşamasında telafisi zor hataları daha veri toplanmadan önler.",
    visual: "plan",
  },
  {
    number: "02",
    title: "Verinize uygun yöntemi seçin.",
    lead: "Hazır bir test listesi uygulamıyoruz. Varsayımları inceliyor, araştırma sorunuza ve veri yapınıza uygun yöntemi belirliyoruz.",
    points: ["Normallik ve varsayım kontrolleri", "Parametrik ve parametrik olmayan testler", "Regresyon, ANOVA ve çok değişkenli analizler", "Geçerlilik ve güvenilirlik incelemeleri"],
    note: "Yöntem kararı yalnızca benzer makalelere değil, çalışmanızın özgün veri yapısına dayanır.",
    visual: "analyse",
  },
  {
    number: "03",
    title: "Sonuçları akademik bir anlatıya dönüştürün.",
    lead: "Bulguları yalnızca çıktı olarak teslim etmiyor; tez, makale ve yayın standartlarına uygun biçimde raporluyoruz.",
    points: ["Akademik sonuç tabloları", "Bulguların istatistiksel yorumlanması", "Yayın kalitesinde grafikler", "Video anlatım ve uzman görüşmesi"],
    note: "Grafikler EPS, TIFF, JPG ve PNG gibi yayın süreçlerinde ihtiyaç duyulan formatlarda hazırlanabilir.",
    visual: "report",
  },
];

const methods = ["Tanımlayıcı istatistikler", "Bağımsız / eşli örneklem testleri", "ANOVA ve MANOVA", "Regresyon analizi", "Korelasyon analizi", "Ki-kare testleri", "Mann–Whitney U", "Wilcoxon ve Kruskal–Wallis", "Ölçek analizi", "Yapısal eşitlik modellemesi", "Power analizi", "Veri görselleştirme"];

const faqs: Array<[string, string]> = [
  ["Süreç nasıl işliyor?", "Talebinizi ve dosyalarınızı ilettikten sonra uzman ekibimiz kapsamı inceler, size fiyat ve teslim süresi sunar. Onayınızın ardından çalışma aynı sipariş ekranından takip edilir."],
  ["Uzmanımla nasıl iletişim kurabilirim?", "Siparişe özel yazışma alanını kullanabilir, gerekli durumlarda sistem üzerinden çevrim içi görüşme planlayabilirsiniz."],
  ["Çalışma alanımı bilen bir uzmanla mı çalışacağım?", "Evet. Tıp, sağlık, sosyal bilimler ve eğitim bilimleri gibi farklı alanlardaki çalışmalar, konu ve yöntem ihtiyacına göre uygun uzmana yönlendirilir."],
  ["Analizler için teslim süresi nedir?", "Teslim süresi veri setinin kapsamına ve seçilen hizmete göre belirlenir. Talep oluştururken size uygun teslim seçeneğini seçebilirsiniz."],
  ["Sonuçları hangi formatta alacağım?", "Kapsama göre analiz raporu, düzenlenebilir tablolar, grafik dosyaları, program çıktıları ve videolu anlatım çalışma alanınıza yüklenir."],
  ["Teslimden sonra ek analiz isteyebilir miyim?", "Uygun siparişlerde teslim sonrasında Ek Analiz talebi açabilir, yeni ihtiyacınızı mevcut çalışma üzerinden iletebilirsiniz."],
];

function StageVisual({ type }: { type: string }) {
  if (type === "plan") return (
    <div className="analysis-stage-visual visual-plan" aria-hidden="true">
      <div className="analysis-data-sheet"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="analysis-sample-card"><span>Örneklem</span><strong>n = 248</strong><small>Güç · %95</small></div>
      <div className="analysis-orbit orbit-one" /><div className="analysis-orbit orbit-two" />
    </div>
  );
  if (type === "analyse") return (
    <div className="analysis-stage-visual visual-analyse" aria-hidden="true">
      <div className="analysis-chart-grid"><span /><span /><span /><span /></div>
      <div className="analysis-chart-line"><i /><i /><i /><i /><i /><i /></div>
      <div className="analysis-result-pill"><b>p</b> &lt; .001 <span>Anlamlı</span></div>
    </div>
  );
  return (
    <div className="analysis-stage-visual visual-report" aria-hidden="true">
      <div className="analysis-report-page"><span /><span /><span /><span /><div><i /><i /><i /><i /><i /></div></div>
      <div className="analysis-format-card"><strong>4</strong><span>teslim formatı</span></div>
    </div>
  );
}

export default function StatisticalAnalysisPage() {
  return (
    <main className="landing-page analysis-service-page">
      <LandingHeader />

      <section className="analysis-hero">
        <div className="analysis-hero-grid" aria-hidden="true" />
        <div className="analysis-hero-copy">
          <p className="analysis-eyebrow">İSTATİSTİKSEL VERİ ANALİZİ</p>
          <h1>Verinizi doğru yöntemle <span>anlama dönüştürün.</span></h1>
          <p>Planlamadan akademik raporlamaya kadar tüm analiz sürecini alanınıza uygun uzmanla, şeffaf biçimde yönetin.</p>
          <div className="analysis-hero-actions">
            <Link href="/giris">Analiz talebi oluştur <span aria-hidden="true">→</span></Link>
            <a href="#analysis-process">Süreci inceleyin</a>
          </div>
          <div className="analysis-hero-proof"><span>15+ yıl deneyim</span><span>Alan uzmanı eşleşmesi</span><span>Güvenli dosya paylaşımı</span></div>
        </div>
        <div className="analysis-hero-visual" aria-label="İstatistiksel analiz raporu önizlemesi">
          <div className="analysis-window">
            <div className="analysis-window-bar"><i /><i /><i /><b>Analiz çalışma alanı</b></div>
            <div className="analysis-window-content">
              <div className="analysis-window-nav"><Image src="/Siyah e-istatistik.png" alt="Eİstatistik" width={170} height={40} /><span>Veri özeti</span><span>Analizler</span><span>Rapor</span></div>
              <div className="analysis-window-main">
                <div className="analysis-window-heading"><div><small>ÇALIŞMA ÖZETİ</small><strong>Tez veri analizi</strong></div><b>Rapor hazır</b></div>
                <div className="analysis-window-cards"><div><small>Örneklem</small><strong>248</strong><span>katılımcı</span></div><div><small>Değişken</small><strong>18</strong><span>aktif alan</span></div><div><small>Güven düzeyi</small><strong>%95</strong><span>doğrulandı</span></div></div>
                <div className="analysis-window-chart"><div className="chart-y"><span>80</span><span>60</span><span>40</span><span>20</span></div><div className="chart-bars"><i /><i /><i /><i /><i /><i /></div><div className="chart-trend" /></div>
              </div>
            </div>
          </div>
          <div className="analysis-float-result"><span>İstatistiksel anlamlılık</span><strong>p &lt; .001</strong><i>Doğrulandı</i></div>
          <div className="analysis-float-delivery"><span>Teslim paketi</span><strong>Rapor · Tablo · Video</strong></div>
        </div>
      </section>

      <section className="analysis-trust-strip" aria-label="Hizmet özellikleri">
        <div><strong>01</strong><span><b>İhtiyaca özel kapsam</b>Standart paket yerine çalışmanıza özel plan</span></div>
        <div><strong>02</strong><span><b>Şeffaf çalışma alanı</b>Süreç, mesajlar ve teslimler tek ekranda</span></div>
        <div><strong>03</strong><span><b>Yayın odaklı çıktı</b>Akademik standartlara uygun raporlama</span></div>
      </section>

      <section className="analysis-process" id="analysis-process">
        <header><h2>Analiz yalnızca bir test çalıştırmak değildir.</h2><p>Doğru sonuç; doğru plan, doğru yöntem ve doğru akademik anlatının birlikte kurulmasıyla ortaya çıkar.</p></header>
        <div className="analysis-stage-list">
          {stages.map((stage) => (
            <article className="analysis-stage" key={stage.number}>
              <div className="analysis-stage-number">{stage.number}</div>
              <div className="analysis-stage-copy"><h3>{stage.title}</h3><p>{stage.lead}</p><ul>{stage.points.map((point) => <li key={point}>{point}</li>)}</ul><blockquote>{stage.note}</blockquote></div>
              <StageVisual type={stage.visual} />
            </article>
          ))}
        </div>
      </section>

      <section className="analysis-methods">
        <div className="analysis-methods-intro"><h2>Çalışmanızın ihtiyacı hangi yöntemse.</h2><p>Yöntem seçimi araştırma sorusu, veri türü ve varsayım kontrolleri birlikte değerlendirilerek yapılır.</p><Link href="/giris">Çalışmanızı anlatın <span>→</span></Link></div>
        <div className="analysis-method-list">{methods.map((method, index) => <div key={method}><span>{String(index + 1).padStart(2, "0")}</span><strong>{method}</strong></div>)}</div>
      </section>

      <section className="analysis-deliverables">
        <div className="analysis-deliverable-heading"><p>TESLİM PAKETİ</p><h2>Sadece sonuç değil, kullanılabilir bir çalışma teslim alın.</h2></div>
        <div className="analysis-deliverable-grid">
          <div className="deliverable-feature"><span>PDF / DOCX</span><strong>Akademik analiz raporu</strong><p>Yöntem, bulgular ve yorumlarıyla tez veya makalenize aktarabileceğiniz düzenli rapor.</p></div>
          <div><span>XLSX</span><strong>Düzenlenebilir tablolar</strong><p>Sonuçlarınızı tekrar kullanabileceğiniz temiz tablolar.</p></div>
          <div><span>PNG / TIFF / EPS</span><strong>Yayın kalitesinde grafikler</strong><p>Dergi ve enstitü standartlarına uygun görseller.</p></div>
          <div><span>VIDEO</span><strong>Videolu anlatım</strong><p>Analizin ne söylediğini adım adım açıklayan uzman anlatımı.</p></div>
        </div>
      </section>

      <section className="analysis-faq-section">
        <div><h2>Analiz hizmeti hakkında merak ettikleriniz.</h2><p>Kapsamınız farklıysa talebinizi iletin; uzman ekibimiz çalışmanızı inceleyerek yanıtlasın.</p><a href="mailto:destek@eistatistik.com">destek@eistatistik.com</a></div>
        <LandingFaq items={faqs} />
      </section>

      <section className="analysis-final-cta"><div><span>ÇALIŞMANIZI BİRLİKTE NETLEŞTİRELİM</span><h2>Veriniz hazırsa, doğru analizle başlayalım.</h2><p>Dosyalarınızı güvenle yükleyin. Uzman ekibimiz kapsamı ve teslim planını sizinle paylaşsın.</p></div><Link href="/giris">Analiz talebi oluştur <span>→</span></Link></section>

      <footer className="landing-footer"><Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} /><div><Link href="/#services">Hizmetler</Link><Link href="/#platform">Platform</Link><a href="mailto:destek@eistatistik.com">İletişim</a><Link href="/giris">Giriş yap</Link></div><p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p></footer>
    </main>
  );
}
