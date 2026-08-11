import Image from "next/image";
import Link from "next/link";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingHeader } from "../../components/LandingHeader";
import { LandingFooter } from "../../components/LandingFooter";
import { getGmailContactUrl } from "../../lib/contact";

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
  ["Süreç Nasıl İşliyor?", "Talep oluşturduğunuzda hipotezlerinizi, isteklerinizi ve verilerinizi inceleyerek size ulaşıyoruz. Önceliğimiz, isteklerinizden yola çıkarak önerilerde bulunmak ve çalışmanızı daha güçlü hale getirebilmek için nihai kapsamı birlikte belirlemektir. İstekler netleştiğinde fiyat teklifini gönderiyoruz; kabul ettiğiniz anda süreç başlıyor. Seçtiğiniz analiz süresi içinde sonuçlar iletiliyor. Sonuçları inceledikten sonra farklı bir analiz isterseniz ücretsiz ek analiz talebinde bulunabilirsiniz."],
  ["Bu Süreçte Nasıl İletişim Kurabilirim?", "İstatistiksel veri analizi öncesinde, süreç boyunca ve sonrasında bize dilediğiniz zaman ulaşabilirsiniz. 0 (850) 885 12 56 numaralı hattımızdan bilgi alabilir, soru sorabilir ve analizinizi yöneten uzmanla görüşebilirsiniz. Ayrıca siparişinize ait yazışma alanından uzmanınıza doğrudan mesaj iletebilirsiniz."],
  ["Benim Çalıştığım Alan İle İlgili (Tıp, Diş Hekimliği Vb.) Benim Dilimden Anlayabilecek Hocalar İle Mi Çalışacağım?", "Talebinizi oluşturduğunuzda çalışmanız alanına göre uygun uzmanımıza yönlendirilir. Böylece alanınızdaki terminolojiyi, analiz türlerini ve kullanılan yöntemleri bilen bir istatistik uzmanıyla iletişim kurmanın rahatlığını yaşarsınız."],
  ["Analizler İçin Teslimat Süresi Nedir?", "Süreyi siz belirlersiniz. 12 saat ile 30 gün arasında değişen seçeneklerden çalışmanıza uygun olanı seçebilirsiniz. Ortalama teslimat için 7 gün, acil analiz ihtiyacında ise 12 saat seçeneğini kullanabilirsiniz."],
  ["Sonuçları Hangi Formatta Alacağım?", "Sonuçlarınızı üç farklı biçimde alabilirsiniz: tablo ve yorum içeren ayrıntılı akademik rapor, istediğiniz formatta düzenlenebilir sonuç tabloları ve analizlerden elde edilen orijinal program ya da Excel çıktı dosyaları. Çalışmanın başında farklı bir tablo veya teslim formatı da talep edebilirsiniz."],
  ["Analiz Raporumu İnceledim, Birkaç Analiz Daha Yapılmasını İstiyorum Ne Yapmalıyım?", "Raporunuz teslim edildikten sonra hesabınızda görünen ek analiz hakkını kullanarak yeni isteklerinizi ücretsiz biçimde gönderebilirsiniz. Uzmanınız raporu güncelleyerek yeniden çalışma alanınıza iletir."],
  ["Sesli Rapor Desteği", "Evet. Veri analizi raporunuz için sesli veya videolu anlatım talep edebilirsiniz. Sonuçlarınız uzmanınız tarafından adım adım açıklanır ve anlatıma çalışma alanınızdan dilediğiniz zaman erişebilirsiniz."],
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
      <header className="analysis-regression-head"><div><small>MODEL 01</small><strong>Doğrusal regresyon</strong></div><span><i /> Model uyumu yüksek</span></header>
      <div className="analysis-regression-plot">
        <svg viewBox="0 0 640 220" preserveAspectRatio="none">
          <g className="regression-svg-grid"><line x1="52" y1="28" x2="620" y2="28" /><line x1="52" y1="72" x2="620" y2="72" /><line x1="52" y1="116" x2="620" y2="116" /><line x1="52" y1="160" x2="620" y2="160" /></g>
          <g className="regression-svg-labels"><text x="8" y="32">80</text><text x="8" y="76">60</text><text x="8" y="120">40</text><text x="8" y="164">20</text><text x="52" y="204">Düşük</text><text x="286" y="204">Bağımsız değişken</text><text x="592" y="204">Yüksek</text></g>
          <path className="regression-svg-band" d="M70 157 L604 35 L604 67 L70 181 Z" />
          <line className="regression-svg-line" x1="70" y1="169" x2="604" y2="51" />
          <g className="regression-svg-points"><circle cx="82" cy="170" r="5"/><circle cx="144" cy="150" r="5"/><circle cx="204" cy="158" r="5"/><circle cx="266" cy="125" r="5"/><circle cx="326" cy="136" r="5"/><circle cx="390" cy="93" r="5"/><circle cx="452" cy="108" r="5"/><circle cx="514" cy="67" r="5"/><circle cx="584" cy="49" r="5"/></g>
        </svg>
      </div>
      <footer className="analysis-regression-stats"><div><small>R²</small><strong>.78</strong><span>Açıklanan varyans</span></div><div><small>β</small><strong>.64</strong><span>Pozitif etki</span></div><div><small>p</small><strong>&lt; .001</strong><span className="significant">Anlamlı</span></div></footer>
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
              <div className="analysis-window-nav"><Image src="/Siyah e-istatistik.png" alt="eistatistik" width={170} height={40} /><span>Veri özeti</span><span>Analizler</span><span>Rapor</span></div>
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
          <div className="deliverable-feature"><div className="deliverable-visual deliverable-report"><div><b>ANALİZ RAPORU</b><i /><i /><i /><section><span /><span /><span /><span /><span /></section></div><em>PDF</em></div><span>PDF / DOCX</span><strong>Akademik analiz raporu</strong><p>Yöntem, bulgular ve yorumlarıyla tez veya makalenize aktarabileceğiniz düzenli rapor.</p></div>
          <div><div className="deliverable-visual deliverable-table"><header><b>Sonuç tablosu</b><span>XLSX</span></header><section>{Array.from({ length: 15 }).map((_, index) => <i key={index} />)}</section></div><span>XLSX</span><strong>Düzenlenebilir tablolar</strong><p>Sonuçlarınızı tekrar kullanabileceğiniz temiz tablolar.</p></div>
          <div><div className="deliverable-visual deliverable-chart"><header><b>Şekil 01</b><span>300 DPI</span></header><section><i /><i /><i /><i /><i /><i /></section></div><span>PNG / TIFF / EPS</span><strong>Yayın kalitesinde grafikler</strong><p>Dergi ve enstitü standartlarına uygun görseller.</p></div>
          <div><div className="deliverable-visual deliverable-video"><div><i /><span>▶</span></div><footer><b>Uzman anlatımı</b><small>08:42</small></footer></div><span>VIDEO</span><strong>Videolu anlatım</strong><p>Analizin ne söylediğini adım adım açıklayan uzman anlatımı.</p></div>
        </div>
      </section>

      <section className="analysis-faq-section">
        <div><h2>Analiz hizmeti hakkında merak ettikleriniz.</h2><p>Kapsamınız farklıysa talebinizi iletin; uzman ekibimiz çalışmanızı inceleyerek yanıtlasın.</p><a href={getGmailContactUrl("İstatistiksel Veri Analizi")} target="_blank" rel="noopener noreferrer">info@eistatistik.com</a></div>
        <LandingFaq items={faqs} />
      </section>

      <section className="analysis-final-cta"><div><span>ÇALIŞMANIZI BİRLİKTE NETLEŞTİRELİM</span><h2>Veriniz hazırsa, doğru analizle başlayalım.</h2><p>Dosyalarınızı güvenle yükleyin. Uzman ekibimiz kapsamı ve teslim planını sizinle paylaşsın.</p></div><Link href="/giris">Analiz talebi oluştur <span>→</span></Link></section>

      <LandingFooter />
    </main>
  );
}
