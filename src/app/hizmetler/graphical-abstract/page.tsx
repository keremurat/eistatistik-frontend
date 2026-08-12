import Link from "next/link";
import { LandingFaq } from "../../components/LandingFaq";
import { LandingFooter } from "../../components/LandingFooter";
import { LandingHeader } from "../../components/LandingHeader";
import { getGmailContactUrl } from "../../lib/contact";

const deliverables = [
  ["01", "Yayın kalitesinde tasarım", "Makalenizin yöntemini ve temel bulgularını tek bakışta anlaşılır, dengeli bir görsel anlatıya dönüştürüyoruz."],
  ["02", "Dergiye uygun ölçüler", "Hedef derginin boyut, oran, çözünürlük ve dosya formatı gereksinimlerine göre çıktı hazırlıyoruz."],
  ["03", "Düzenlenebilir kaynak dosya", "Teslim paketi PowerPoint kaynak dosyasıyla birlikte yüksek çözünürlüklü PNG ve PDF çıktıları içerir."],
  ["04", "Uzman revizyonu", "Bilimsel doğruluk, metin yoğunluğu ve görsel hiyerarşi uzman kontrolünden geçirilir; geri bildiriminizle son düzenleme yapılır."],
];

const process = [
  ["01", "Çalışmanızı paylaşın", "Makale özeti, yöntem, ana bulgular, hedef dergi ve varsa görsel yönlendirmelerinizi güvenli çalışma alanına yükleyin."],
  ["02", "Bilimsel hikâyeyi çıkaralım", "Uzmanımız çalışmanızın problem, yöntem, bulgu ve sonuç akışını sadeleştirerek görselin bilgi mimarisini kurar."],
  ["03", "Tasarım hazırlansın", "Akış, ikonografi, renk ve tipografi; akademik yayın standartlarına uygun tek bir kompozisyonda birleştirilir."],
  ["04", "Kontrol edin ve teslim alın", "Taslağı çalışma alanınızdan inceleyin, revizyonunuzu iletin ve onaylanan dosyaları düzenlenebilir formatta indirin."],
];

const faqs: Array<[string, string]> = [
  ["Graphical Abstract nedir?", "Graphical Abstract, bir bilimsel çalışmanın araştırma sorusunu, yöntemini ve temel sonuçlarını tek bir görsel akışta özetleyen yayın materyalidir. Okuyucunun çalışmanın ana mesajını kısa sürede anlamasını sağlar."],
  ["Hangi dosyaları göndermeliyim?", "Makalenizin güncel metni veya özeti, yöntem ve temel bulgular, kullanılmasını istediğiniz görseller ile hedef derginin Graphical Abstract kurallarını paylaşmanız yeterlidir."],
  ["Teslim paketinde hangi dosyalar bulunur?", "Onaylanan tasarım düzenlenebilir PowerPoint kaynak dosyasıyla birlikte yüksek çözünürlüklü PNG ve PDF formatlarında teslim edilir."],
  ["Teslim süresi ne kadardır?", "Graphical Abstract hizmetinin standart teslim süresi 7 iş günüdür. Süre, gerekli materyallerin eksiksiz iletilmesiyle başlar."],
  ["Revizyon yapılıyor mu?", "Evet. İlk taslağın ardından içerik doğruluğu ve görsel düzenle ilgili geri bildiriminizi çalışma alanınızdan iletebilir, kapsam içindeki revizyonunuzu talep edebilirsiniz."],
  ["Tasarım hedef derginin kurallarına uyarlanabilir mi?", "Evet. Derginin ölçü, çözünürlük, yazı boyutu ve dosya formatı kriterlerini ilettiğinizde teslim dosyaları bu teknik gereksinimlere göre hazırlanır."],
];

export default function GraphicalAbstractPage() {
  return (
    <main className="landing-page analysis-service-page graphical-service-page">
      <LandingHeader />

      <section className="graphical-hero">
        <div className="graphical-hero-copy">
          <p className="analysis-eyebrow">GRAPHICAL ABSTRACT TASARIMI</p>
          <h1>Araştırmanızı tek bakışta <span>anlaşılır kılın.</span></h1>
          <p>Yönteminizi ve temel bulgularınızı, hedef derginizin teknik standartlarına uygun, yayın kalitesinde bir görsel anlatıya dönüştürelim.</p>
          <div className="analysis-hero-actions"><Link href="/giris">Graphical Abstract talebi oluştur <span>→</span></Link><a href="#graphical-process">Süreci inceleyin</a></div>
          <div className="analysis-hero-proof"><span>7 iş günü teslim</span><span>PowerPoint kaynak dosyası</span><span>Uzman revizyonu</span></div>
        </div>

        <div className="graphical-hero-media" aria-label="Graphical Abstract tanıtım videosu">
          <div className="graphical-monitor">
            <div className="graphical-monitor-bar"><i /><i /><i /><b>Graphical Abstract · Tanıtım</b></div>
            <div className="graphical-video-wrap">
              <iframe src="https://www.youtube.com/embed/gwgd7eehFc0?rel=0&modestbranding=1" title="Graphical Abstract hizmeti tanıtım videosu" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
          </div>
          <div className="graphical-monitor-neck" /><div className="graphical-monitor-base" />
          <div className="graphical-float"><span>TESLİM PAKETİ</span><strong>PPTX · PNG · PDF</strong><small>Düzenlenebilir ve yayına hazır</small></div>
        </div>
      </section>

      <section className="analysis-trust-strip" aria-label="Graphical Abstract avantajları">
        <div><strong>01</strong><span><b>Bilimsel doğruluk</b>Mesajınız uzman kontrolüyle sadeleştirilir</span></div>
        <div><strong>02</strong><span><b>Görsel hiyerarşi</b>Karmaşık süreçler anlaşılır bir akışa dönüşür</span></div>
        <div><strong>03</strong><span><b>Yayın uyumu</b>Çıktılar hedef derginin kriterlerine hazırlanır</span></div>
      </section>

      <section className="graphical-purpose">
        <div><p className="analysis-eyebrow">NEDEN GRAPHICAL ABSTRACT?</p><h2>Okuyucuyu makalenize taşıyan güçlü bir ilk temas.</h2><p>İyi tasarlanmış bir Graphical Abstract yalnızca estetik bir özet değildir. Araştırmanın mantığını görünür kılar, temel sonucu öne çıkarır ve çalışmanızın dijital platformlarda daha hızlı anlaşılmasına yardımcı olur.</p></div>
        <div className="graphical-purpose-grid"><article><span>01</span><h3>Karmaşık yöntemi sadeleştirin.</h3><p>Değişkenler, gruplar ve analiz akışı tek bir görsel rota üzerinde okunur.</p></article><article><span>02</span><h3>Ana bulguyu görünür kılın.</h3><p>Okuyucunun hatırlaması gereken sonuç, gereksiz ayrıntılardan ayrıştırılır.</p></article><article><span>03</span><h3>Yayın etkisini güçlendirin.</h3><p>Makaleniz web, sunum ve sosyal bilim iletişiminde paylaşılabilir bir materyal kazanır.</p></article></div>
      </section>

      <section className="graphical-deliverables">
        <header><p className="analysis-eyebrow">HİZMET KAPSAMI</p><h2>Sadece bir görsel değil, eksiksiz bir yayın paketi.</h2></header>
        <div>{deliverables.map(([number,title,copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="graphical-process" id="graphical-process">
        <div className="graphical-process-intro"><p className="analysis-eyebrow">ÜRETİM SÜRECİ</p><h2>Bilimsel içerikten yayın kalitesinde görsele.</h2><p>Her adım çalışma alanınızda şeffaf biçimde ilerler. Dosyalar, görüşmeler, taslak ve revizyon aynı sipariş altında tutulur.</p><Link href="/giris">Çalışmanızı gönderin <span>→</span></Link></div>
        <div className="graphical-process-list">{process.map(([number,title,copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </section>

      <section className="analysis-faq-section graphical-faq"><div><h2>Graphical Abstract hakkında merak ettikleriniz.</h2><p>Hedef derginizin farklı bir teknik şartı varsa çalışmanızla birlikte iletin; tasarım ekibimiz kapsamı değerlendirsin.</p><a href={getGmailContactUrl("Graphical Abstract")} target="_blank" rel="noopener noreferrer">info@eistatistik.com</a></div><LandingFaq items={faqs} /></section>

      <section className="analysis-final-cta"><div><span>ARAŞTIRMANIZI GÖRSELLEŞTİRELİM</span><h2>Bilimsel mesajınızı tek karede anlatın.</h2><p>Makalenizi ve hedef dergi bilgilerini paylaşın. Uzman ekibimiz içeriğinizi yayın kalitesinde bir Graphical Abstract’a dönüştürsün.</p></div><Link href="/giris">Graphical Abstract talebi <span>→</span></Link></section>
      <LandingFooter />
    </main>
  );
}
