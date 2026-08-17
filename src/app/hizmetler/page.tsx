import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "../components/BrandLogo";
import { CustomerEducationMenu } from "../components/CustomerEducationMenu";
import { NotificationMenu } from "../components/NotificationMenu";
import { ProfileMenu } from "../components/ProfileMenu";

type IconName = "arrow" | "check" | "file" | "home" | "message" | "spark";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    message: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 12Z" />,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const services = [
  { id:"statistical-analysis", image:"/service-illustrations/statistical-analysis-v2.png", eyebrow:"ANALİZ VE ARAŞTIRMA", title:"İstatistiksel veri analizi", description:"Tez, makale veya araştırmanızdaki veriler analiz edilir; sonuçlar akademik standartlara uygun şekilde raporlanır.", fit:"Tez, makale ve bilimsel araştırmalar için", outputs:["Analiz raporu","Sonuç tabloları","Videolu anlatım"] },
  { id:"power-analysis", image:"/service-illustrations/power-analysis-v2.png", eyebrow:"ARAŞTIRMA PLANLAMA", title:"Power ve örneklem analizi", description:"Araştırmanız için gerekli örneklem büyüklüğü veya mevcut çalışmanızın istatistiksel gücü hesaplanır.", fit:"Araştırma planlama ve etik kurul başvuruları için", outputs:["Power raporu","Örneklem hesabı","Yöntem açıklaması"] },
  { id:"mentoring", image:"/service-illustrations/mentoring-v2.png", eyebrow:"DANIŞMANLIK", title:"Online mentörlük", description:"Analiz yöntemi, bulguların yorumlanması veya akademik süreçle ilgili uzmanla birebir çevrim içi çalışın.", fit:"Sürecini uzmanla birlikte yürütmek isteyenler için", outputs:["Birebir görüşme","Yol haritası","Görüşme notları"] },
  { id:"graphical-abstract", image:"/service-illustrations/graphical-abstract-v2.png", eyebrow:"AKADEMİK SUNUM", title:"Graphical abstract", description:"Çalışmanızın yöntemini ve temel bulgularını dergi standartlarına uygun tek bir görsel anlatıma dönüştürün.", fit:"Makale gönderimi ve akademik sunumlar için", outputs:["Yayın kalitesinde görsel","Revizyon","Kaynak dosya"] },
  { id:"proforma-invoice", image:"/service-illustrations/proforma-invoice-v2.png", eyebrow:"FİNANSAL BELGE", title:"Proforma fatura", description:"Kurum, proje veya bütçe onayı süreçleriniz için hizmet kapsamını ve ücret bilgisini içeren proforma fatura talep edin.", fit:"Kurum ödemesi ve bütçe onayı gereken siparişler için", outputs:["Kurumsal proforma","Hizmet dökümü","PDF belge"] },
  { id:"academic-mobile-app", image:"/service-illustrations/academic-mobile-app-v2.png", eyebrow:"DİJİTAL ÜRÜN", title:"Akademik mobil uygulama", description:"Akademik çalışmalarınıza yönelik mobil uygulama ihtiyacınızı paylaşın; kapsam ve geliştirme planı birlikte oluşturulsun.", fit:"Araştırma ve akademik projeler için özel mobil çözüm", outputs:["İhtiyaç analizi","Kapsam planı","Teknik değerlendirme"] },
];

export default function ServicesPage() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <BrandLogo />
        <nav className="main-nav" aria-label="Ana navigasyon">
          <Link href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
          <Link href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
          <CustomerEducationMenu />
          <Link className="active" href="/hizmetler"><Icon name="spark" size={17} />Hizmetler</Link>
        </nav>
        <div className="top-actions"><a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a><NotificationMenu role="musteri" /><ProfileMenu /></div>
      </header>

      <main className="request-page service-selection-page" id="main-content">
        <div className="service-selection-viewport">
          <header className="request-hero service-selection-hero"><div><h1>Çalışmanız için doğru hizmeti seçin.</h1></div></header>

          <section className="service-grid" aria-label="Hizmet seçenekleri">
            {services.map((service) => (
              <article className="service-card" key={service.id}>
                <Link className="service-select-overlay" href={`/yeni-analiz-talebi?service=${service.id}`} aria-label={`${service.title} hizmetini seç`} />
                <div className="service-illustration"><Image src={service.image} alt="" fill sizes="(max-width:760px) 100vw, 33vw" /></div>
                <p className="eyebrow">{service.eyebrow}</p><h2>{service.title}</h2><p className="service-description">{service.description}</p>
                <div className="service-fit">{service.fit}</div>
                <ul>{service.outputs.map((output) => <li key={output}><Icon name="check" size={13} />{output}</li>)}</ul>
                <div className="service-card-action"><span>Bu hizmeti seç</span><Icon name="arrow" size={16} /></div>
              </article>
            ))}
          </section>
        </div>

        <section className="guidance-panel"><span className="guidance-icon"><Icon name="message" size={23} /></span><div><p className="eyebrow light">KARAR VEREMEDİNİZ Mİ?</p><h2>Çalışmanızı kısaca anlatın, doğru hizmeti birlikte belirleyelim.</h2><p>Ekibimiz talebinizi inceleyip sizi uygun hizmete yönlendirsin.</p></div><Link href="/yeni-analiz-talebi?service=mentoring">Yönlendirme iste <Icon name="arrow" size={16} /></Link></section>
      </main>
    </div>
  );
}
