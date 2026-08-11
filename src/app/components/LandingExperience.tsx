"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const scenes = [
  {
    label: "Gününüzü görün",
    title: "Her şey tek bakışta önünüzde.",
    body: "Yaklaşan görüşmeler, bekleyen teklifler ve devam eden analizler çalışma alanınızda bir araya gelir.",
    route: "/dashboard",
  },
  {
    label: "Süreci izleyin",
    title: "Talebiniz hangi aşamada, bilin.",
    body: "Sipariş durumunu, seçtiğiniz teslim süresini, dosyaları ve uzman mesajlarını aynı akıştan takip edin.",
    route: "/siparislerim",
  },
  {
    label: "Talebinizi oluşturun",
    title: "İhtiyacınızı adım adım anlatın.",
    body: "Hizmeti seçin, çalışma bilgilerini girin ve dosyalarınızı yükleyin. Uzman ekip talebinizi değerlendirsin.",
    route: "/yeni-analiz-talebi",
  },
  {
    label: "Bilginizi geliştirin",
    title: "Analizden eğitime aynı hesap.",
    body: "Satın aldığınız eğitimlere devam edin, dokümanlara erişin ve akademik sürecinizi kesintisiz yönetin.",
    route: "/egitimler",
  },
];

export function LandingExperience() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    let frame = 0;

    const syncActiveScene = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActive((current) => current === closestIndex ? current : closestIndex);
      frame = 0;
    };

    const handlePositionChange = () => {
      if (!frame) frame = window.requestAnimationFrame(syncActiveScene);
    };

    syncActiveScene();
    window.addEventListener("scroll", handlePositionChange, { passive: true });
    window.addEventListener("resize", handlePositionChange);

    return () => {
      window.removeEventListener("scroll", handlePositionChange);
      window.removeEventListener("resize", handlePositionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="landing-experience" id="platform">
      <header className="landing-section-heading">
        <p className="landing-kicker">ÇALIŞMA ALANINIZ</p>
        <h2>Dağınık akademik süreç, tek bir akışa dönüşür.</h2>
        <p>Talep oluşturduğunuz andan sonuç dosyalarınızı teslim aldığınız güne kadar hiçbir ayrıntı kaybolmaz.</p>
      </header>

      <div className="landing-experience-grid">
        <div className="landing-mac-sticky" aria-live="polite">
          <div className="landing-mac">
            <div className="landing-mac-top"><span /><span /><span /><strong>app.eistatistik.com</strong></div>
            <div className="landing-mac-screen">
              <ProductScene active={active} />
            </div>
            <div className="landing-mac-foot" />
          </div>
          <p>{scenes[active].label}</p>
        </div>

        <div className="landing-experience-steps">
          {scenes.map((scene, index) => (
            <article
              className={active === index ? "active" : ""}
              data-scene={index}
              key={scene.title}
              ref={(node) => { itemRefs.current[index] = node; }}
            >
              <span>{scene.label}</span>
              <h3>{scene.title}</h3>
              <p>{scene.body}</p>
              <a href={scene.route}>Ekranı inceleyin <b aria-hidden="true">→</b></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SceneHeader({ active }: { active: number }) {
  return (
    <div className="product-scene-header">
      <span className="product-scene-logo">
        <Image src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} />
      </span>
      <nav>
        <span className={active === 0 ? "active" : ""}>Genel bakış</span>
        <span className={active === 1 ? "active" : ""}>Siparişlerim</span>
        <span className={active === 3 ? "active" : ""}>Eğitimlerim</span>
        <span className={active === 2 ? "active" : ""}>Hizmetler</span>
      </nav>
      <b>EY</b>
    </div>
  );
}

function ProductScene({ active }: { active: number }) {
  return (
    <div className="landing-product-scene" key={active}>
      <SceneHeader active={active} />
      {active === 0 && <OverviewScene />}
      {active === 1 && <ProgressScene />}
      {active === 2 && <RequestScene />}
      {active === 3 && <EducationScene />}
    </div>
  );
}

function OverviewScene() {
  return (
    <div className="scene-canvas overview-scene">
      <section className="scene-welcome">
        <div><small>CUMA · 24 TEMMUZ</small><h4>Günaydın, Elif.</h4><p>Bugün <b>14:30’da bir görüşmeniz</b> var.</p></div>
        <dl><div><dt>3</dt><dd>aktif analiz</dd></div><div><dt>1</dt><dd>bekleyen işlem</dd></div></dl>
      </section>
      <div className="overview-columns">
        <section className="scene-panel scene-agenda"><header><span>Günlük akış</span><b>24 Tem</b></header><h5>Bugün</h5><article><time>14:30</time><i /><div><small>GÖRÜŞME</small><strong>Ek analiz değerlendirmesi</strong><span>Google Meet · Dr. Naci Yılmaz</span></div></article></section>
        <section className="scene-panel scene-status"><header><span>Devam eden analiz</span><b>%82</b></header><h5>Yüksek lisans tezi veri analizi</h5><div className="scene-progress"><i /></div><p>Rapor son kontrol aşamasında</p></section>
      </div>
    </div>
  );
}

function ProgressScene() {
  const steps = ["Talep alındı", "Teklif hazır", "Ödeme", "Analiz", "Teslim"];
  return (
    <div className="scene-canvas progress-scene">
      <div className="scene-title-row"><div><small>SA260803014</small><h4>Yüksek lisans tezi veri analizi</h4></div><span>Analiz devam ediyor</span></div>
      <section className="scene-panel order-progress-panel">
        <div className="scene-order-steps">{steps.map((step, index) => <div className={index < 4 ? "done" : ""} key={step}><i>{index < 3 ? "✓" : index + 1}</i><span>{step}</span></div>)}</div>
        <div className="scene-order-info"><div><small>Teslim tarihi</small><strong>8 Ağustos 2026</strong></div><div><small>Teslim süresi</small><strong>3 iş günü</strong></div><div><small>Uzman</small><strong>Dr. Naci Yılmaz</strong></div></div>
      </section>
      <section className="scene-file-row"><span>XLSX</span><div><strong>orneklem_verileri.xlsx</strong><small>1,8 MB · Veri setiniz incelendi</small></div><b>Hazır</b></section>
    </div>
  );
}

function RequestScene() {
  return (
    <div className="scene-canvas request-scene-preview">
      <div className="scene-request-steps"><span className="active">1 <b>Hizmet</b></span><i /><span>2 <b>Bilgiler</b></span><i /><span>3 <b>Dosyalar</b></span><i /><span>4 <b>Onay</b></span></div>
      <div className="scene-request-body">
        <section><small>SEÇİLEN HİZMET</small><h4>İstatistiksel veri analizi</h4><p>Çalışmanızın kapsamını birlikte netleştirelim.</p><div className="scene-fields"><label>Sipariş başlığı<strong>Tezimin istatistiksel analizi</strong></label><label>Teslim süresi<strong>3 iş günü</strong></label></div></section>
        <aside><span>ANALİZ DOSYALARI</span><div><b>XLSX</b><strong>tez_verileri.xlsx</strong><small>Yüklemeye hazır</small></div><button>Devam et →</button></aside>
      </div>
    </div>
  );
}

function EducationScene() {
  return (
    <div className="scene-canvas education-scene">
      <aside><small>EĞİTİM PROGRAMINIZ</small><h4>5’i Bir Arada</h4><div className="course-progress"><i /></div><p>%64 tamamlandı</p><nav><span className="done">1 · Temel veri analizi</span><span className="active">2 · İleri düzey analiz</span><span>3 · Ölçek geliştirme</span><span>4 · Güç analizi</span></nav></aside>
      <section><div className="scene-video"><span>▶</span><small>DERS 2.4</small><strong>Regresyon analizi ve yorumlama</strong></div><footer><div><small>Sıradaki ders</small><strong>Model varsayımlarının kontrolü</strong></div><button>Derse devam et →</button></footer></section>
    </div>
  );
}
