"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./demo.module.css";

type IconName = "arrow" | "bars" | "calendar" | "card" | "clock" | "close" | "check" | "chart" | "download" | "file" | "home" | "invoice" | "message" | "play" | "shield" | "lock" | "key";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    bars: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chart: <><path d="M4 19V9" /><path d="M10 19V5" /><path d="M16 19v-7" /><path d="M22 19H2" /></>,
    download: <><path d="M12 4v11" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></>,
    file: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5" /><path d="M9 13h6" /><path d="M9 17h4" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /><path d="M8 10h8" /><path d="M8 14h5" /></>,
    play: <path d="m9 7 8 5-8 5z" />,
    shield: <><path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 8.5 4.2-1.3 7-4.3 7-8.5V6z" /><path d="m9 12 2 2 4-4" /></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    key: <><circle cx="8" cy="15" r="3.2" /><path d="M11 15h9l-2 2" /><path d="M17 15v2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const services = [
  { number: "01", title: "İstatistiksel veri analizi", copy: "Tez, makale ve araştırmalarınız için yöntem seçimi, analiz ve akademik standartlarda raporlama.", href: "/hizmetler/istatistiksel-analiz", tag: "Analiz ve araştırma", visual: "analysis" },
  { number: "02", title: "Power ve örneklem analizi", copy: "Araştırmanızın ihtiyaç duyduğu örneklem büyüklüğünü ve istatistiksel gücü güvenle planlayın.", href: "/hizmetler/power-analizi", tag: "Araştırma planlama", visual: "power" },
  { number: "03", title: "Online mentörlük", copy: "Yöntem, bulgular ve akademik süreç boyunca alanında deneyimli bir uzmanla birebir çalışın.", href: "/hizmetler/danismanlik", tag: "Danışmanlık", visual: "mentor" },
  { number: "04", title: "Graphical abstract", copy: "Araştırmanızın yöntemini ve bulgularını yayın kalitesinde anlaşılır bir görsel anlatıma dönüştürün.", href: "/hizmetler/graphical-abstract", tag: "Akademik sunum", visual: "figure" },
  { number: "05", title: "Geçerlilik ve güvenilirlik", copy: "Ölçek çalışmalarınızı doğru yöntem, açık yorum ve yayınlanabilir raporlama ile ilerletin.", href: "/hizmetler/gecerlilik-guvenilirlik", tag: "Metodoloji", visual: "scale" },
] as const;

function ServiceVisual({ kind }: { kind: (typeof services)[number]["visual"] }) {
  if (kind === "analysis") {
    const dots = [[108, 162], [148, 138], [186, 146], [228, 116], [268, 120], [312, 96], [352, 100], [396, 72], [436, 76], [478, 50]];
    return (
      <div className={`${styles.artifact} ${styles.artifactSheet} ${styles.artifactAnalysis}`} aria-hidden="true">
        <header>
          <div><b>Şekil 1</b><span>Saçılım ve uyum doğrusu</span></div>
          <em>p = .033</em>
        </header>
        <svg viewBox="0 0 560 220" preserveAspectRatio="xMidYMid meet">
          {[52, 98, 144].map((y) => <line key={y} x1="48" x2="532" y1={y} y2={y} />)}
          <line x1="48" y1="16" x2="48" y2="190" />
          <line x1="48" y1="190" x2="532" y2="190" />
          <path d="M72 170 516 42" />
          {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" />)}
        </svg>
        <table>
          <thead><tr><th>Değişken</th><th>r</th><th>p</th></tr></thead>
          <tbody>
            <tr><td>Yaş</td><td>.21</td><td>.214</td></tr>
            <tr><td>Ölçek skoru</td><td>.62</td><td>.033</td></tr>
            <tr><td>Kalış süresi</td><td>.18</td><td>.132</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (kind === "power") {
    return (
      <div className={`${styles.artifact} ${styles.artifactSheet} ${styles.artifactPower}`} aria-hidden="true">
        <header>
          <div><b>Güç eğrisi</b><span>Örneklem hesabı</span></div>
          <em>1−β = .80</em>
        </header>
        <svg viewBox="0 0 560 220" preserveAspectRatio="xMidYMid meet">
          {[52, 98, 144].map((y) => <line key={y} x1="48" x2="532" y1={y} y2={y} />)}
          <line x1="48" y1="16" x2="48" y2="190" />
          <line x1="48" y1="190" x2="532" y2="190" />
          <line x1="48" y1="52" x2="400" y2="52" />
          <line x1="400" y1="52" x2="400" y2="190" />
          <path d="M64 176C170 172 260 130 340 88 380 68 400 52 400 52 450 36 500 34 524 32" />
          <circle cx="400" cy="52" r="6" />
        </svg>
        <table>
          <thead><tr><th>Parametre</th><th>Değer</th></tr></thead>
          <tbody>
            <tr><td>Anlamlılık</td><td>α = .05</td></tr>
            <tr><td>Etki büyüklüğü</td><td>d = .50</td></tr>
            <tr><td>Örneklem</td><td>n = 128</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (kind === "mentor") {
    return (
      <div className={`${styles.artifact} ${styles.artifactSheet}`} aria-hidden="true">
        <header>
          <div><b>Görüşme</b><span>Nazlı A. · Uzman</span></div>
          <em>Yarın · 14:00</em>
        </header>
        <div className={`${styles.artifactFrame} ${styles.artifactMentor}`}>
          <span>NA</span>
          <div>
            <b>Nazlı A.</b>
            <small>İstatistik uzmanı</small>
            <p>Yöntem notunu çalışma alanına bıraktım.</p>
          </div>
        </div>
        <table>
          <thead><tr><th>Konu</th><th>Ayrıntı</th></tr></thead>
          <tbody>
            <tr><td>Gündem</td><td>Yöntem notu</td></tr>
            <tr><td>Süre</td><td>45 dk</td></tr>
            <tr><td>Biçim</td><td>Çevrim içi</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (kind === "figure") {
    return (
      <div className={`${styles.artifact} ${styles.artifactSheet}`} aria-hidden="true">
        <header>
          <div><b>Figure 1</b><span>Graphical abstract</span></div>
          <em>A · B</em>
        </header>
        <div className={`${styles.artifactFrame} ${styles.artifactFigure}`}>
          <section>
            <i>A</i>
            <svg viewBox="0 0 132 48">
              <line x1="28" y1="16" x2="104" y2="16" />
              <circle cx="18" cy="16" r="9" />
              <circle cx="66" cy="16" r="9" />
              <circle cx="114" cy="16" r="9" />
              <text x="18" y="38">Grup</text>
              <text x="66" y="38">Yöntem</text>
              <text x="114" y="38">Bulgu</text>
            </svg>
          </section>
          <section>
            <i>B</i>
            <span><b style={{ height: "42%" }} /><b style={{ height: "78%" }} /><b style={{ height: "58%" }} /></span>
          </section>
        </div>
        <table>
          <thead><tr><th>Panel</th><th>İçerik</th></tr></thead>
          <tbody>
            <tr><td>A</td><td>Grup, yöntem, bulgu</td></tr>
            <tr><td>B</td><td>Ölçek karşılaştırması</td></tr>
            <tr><td>Teslim</td><td>Dergi formatı</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  const filled = [4, 5, 3];
  return (
    <div className={`${styles.artifact} ${styles.artifactSheet}`} aria-hidden="true">
      <header>
        <div><b>İç tutarlılık</b><span>Ölçek maddeleri</span></div>
        <em>α = .86</em>
      </header>
      <div className={`${styles.artifactFrame} ${styles.scaleBars}`}>
        {filled.map((count, index) => (
          <span key={count}>Madde {index + 1}<i className={count === 5 ? styles.scaleOn : undefined} style={{ width: `${count * 20}%` }} /></span>
        ))}
      </div>
      <table>
        <thead><tr><th>Ölçüt</th><th>Değer</th></tr></thead>
        <tbody>
          <tr><td>Cronbach α</td><td>.86</td></tr>
          <tr><td>McDonald ω</td><td>.84</td></tr>
          <tr><td>Madde sayısı</td><td>12</td></tr>
        </tbody>
      </table>
    </div>
  );
}

const flowSteps = [
  { title: "Talebinizi anlatın", copy: "Hizmeti seçin, dosyalarınızı güvenle yükleyin ve çalışma kapsamını paylaşın.", visual: "upload" },
  { title: "Uzmanla netleştirin", copy: "Ekibimiz yöntemi, teslim planını ve ihtiyacınız olan rapor formatını birlikte belirlesin.", visual: "expert" },
  { title: "Süreci takip edin", copy: "Analiz ilerlemesini, yazışmaları ve dosyaları kişisel çalışma alanınızdan izleyin.", visual: "progress" },
  { title: "Raporunuzu teslim alın", copy: "Yorumlu çıktılarınızı, tablolarınızı ve tamamlayıcı dosyalarınızı tek yerde alın.", visual: "report" },
] as const;

function FlowVisual({ kind }: { kind: (typeof flowSteps)[number]["visual"] }) {
  if (kind === "upload") {
    return (
      <>
        <div className={styles.flowDrop}>
          <span><Icon name="file" size={18} /></span>
          <div><b>Dosyanızı buraya bırakın</b><small>veya <em>dosya seçin</em></small></div>
        </div>
        <div className={styles.flowFile}><span>CSV</span><p><b>ham-veri.csv</b><small>2,4 MB · Yüklendi</small></p><em>✓</em></div>
      </>
    );
  }

  if (kind === "expert") {
    return (
      <div className={styles.flowNote}>
        <span>NA</span>
        <div>
          <b>Nazlı A.</b>
          <small>İstatistik uzmanı</small>
          <p>Değişken yapınızı kontrol ettim. Model için kısa bir not paylaştım.</p>
        </div>
      </div>
    );
  }

  if (kind === "progress") {
    const stages = [
      ["done", "✓", "Talep alındı"],
      ["done", "✓", "Uzman atandı"],
      ["on", "03", "Analiz ve kontrol"],
      ["", "04", "Rapor teslimi"],
    ] as const;
    return (
      <ol className={styles.flowStages}>
        {stages.map(([state, mark, label]) => (
          <li key={label} className={state === "done" ? styles.flowDone : state === "on" ? styles.flowOn : undefined}>
            <i>{mark}</i><b>{label}</b>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className={styles.flowReport}>
      <header><b>Analiz sonuçları</b><span><b>TR</b><span>EN</span></span></header>
      <table>
        <thead><tr><th>Değişken</th><th>Ort ± SS</th><th>p</th></tr></thead>
        <tbody>
          <tr><td>Yaş</td><td>42.8 ± 8.4</td><td>.214</td></tr>
          <tr><td>Ölçek skoru</td><td>6.2 ± 1.9</td><td className={styles.flowHit}>.033</td></tr>
        </tbody>
      </table>
      <p>Ölçek skorunda gruplar arasında anlamlı fark vardır (p = .033).</p>
      <span className={styles.flowDownload}><Icon name="download" size={15} /> Raporu indir</span>
    </div>
  );
}

const engagementModels = [
  { title: "Analiz ve raporlama", copy: "Veri setiniz, araştırma sorularınız ve teslim ihtiyacınıza göre net bir kapsam oluşturulur.", offer: "Kapsam netleşince teklif", points: ["Yöntem ve varsayım kontrolü", "Yorumlu analiz raporu", "Siparişe bağlı dosya teslimi"], href: "/giris", action: "Talep oluştur", solid: true },
  { title: "Birebir mentörlük", copy: "Analizi kendiniz yürütürken karar noktalarını uzmanla birlikte netleştirin.", offer: "Kapsam netleşince teklif", points: ["Canlı uzman görüşmesi", "Araştırmaya özel yönlendirme", "Bulguları birlikte yorumlama"], href: "/giris", action: "Talep oluştur", solid: true },
  { title: "Uygulamalı eğitimler", copy: "İstatistik araçlarını ve yöntemlerini kendi temponuzda, uygulama üzerinden öğrenin.", offer: "Kapsam netleşince teklif", points: ["Bireysel eğitim programları", "Uygulamalı ders içerikleri", "Tek hesaptan erişim"], href: "/egitimler/bireysel", action: "Eğitimleri görün", solid: false },
];

const featuredInsight = {
  category: "İstatistiksel analiz",
  title: "Doğru analiz yöntemini seçmek için nereden başlamalısınız?",
  summary: "Araştırma sorusu, veri türü ve örneklem yapısı arasındaki ilişkiyi kurarak uygun yönteme sistemli biçimde yaklaşın.",
  reading: "8 dk okuma",
  cover: "method",
} as const;

const insights = [
  { category: "Araştırma tasarımı", title: "Analize başlamadan önce veri setinizi nasıl hazırlamalısınız?", cover: "table" },
  { category: "Power analizi", title: "Örneklem büyüklüğü belirlerken en sık yapılan hatalar", cover: "power" },
  { category: "Raporlama", title: "İstatistiksel sonuçları akademik metinde açık biçimde sunmak", cover: "report" },
] as const;

function InsightCover({ kind }: { kind: "method" | "table" | "power" | "report" }) {
  const tone = kind === "method" ? styles.insightMethod : kind === "table" ? styles.insightTable : kind === "power" ? styles.insightPower : styles.insightReport;
  return (
    <div className={`${styles.insightCover} ${tone}`} aria-hidden="true">
      {kind === "method" && (
        <svg viewBox="0 0 320 180">
          <path d="M24 150C90 150 112 36 160 36s72 114 136 114" />
          <path d="M24 150C90 150 112 36 160 36s72 114 136 114V150H24Z" />
          <line x1="24" y1="150" x2="296" y2="150" />
          <rect x="198" y="18" width="92" height="28" rx="14" />
          <text x="244" y="37">p = .087</text>
        </svg>
      )}
      {kind === "table" && (
        <div>
          <b>Tablo 1</b>
          <em>Tanımlayıcı istatistikler</em>
          <i /><i />
          <span /><span /><span />
        </div>
      )}
      {kind === "power" && (
        <span>{[38, 52, 66, 84].map((height) => <i key={height} style={{ height: `${height}%` }} />)}</span>
      )}
      {kind === "report" && (
        <div>
          <b>Bulgular</b>
          <i /><i /><i />
          <em>p = .033</em>
        </div>
      )}
    </div>
  );
}

const comparisonRows = [
  ["Çalışma kapsamı", "Tek çalışma alanı", "Siparişe bağlı", "Dağınık iletişim", "Mesaj ve ekler"],
  ["Dosya paylaşımı", "Kayıtlı dosyalar", "Süreçle birlikte durur", "Kaybolabilir", "Farklı kanallarda"],
  ["İlerleme takibi", "Görünür aşamalar", "Sıradaki adım belli", "Belirsiz", "Tek tek sormak gerekir"],
  ["Uzman iletişimi", "Doğrudan uzman", "Çalışmayı yürüten kişi", "Genel destek", "Ortak bir hat"],
  ["Teslim dosyaları", "Tek yerde", "Rapor ve çıktılar", "E-posta eki", "Dağınık dosyalar"],
] as const;

const ctaPoints = ["Uzman destekli analiz", "Güvenli dosya paylaşımı", "Görünür süreç", "Yorumlu rapor"];

const faqs = [
  ["İstatistik analizi hizmeti ne kadar sürer?", "Süre; veri setinin büyüklüğüne, analiz türüne ve raporlama kapsamına göre değişir. Talebiniz incelendikten sonra teslim planı çalışma alanınızda netleştirilir."],
  ["Hangi istatistik programlarıyla çalışıyorsunuz?", "SPSS, R, Python, STATA, AMOS, LISREL ve Minitab başta olmak üzere araştırmanın gerektirdiği yaygın istatistik araçlarıyla çalışıyoruz."],
  ["Tez analizi için hangi dosyaları paylaşmalıyım?", "Ham veri dosyanız, anket veya veri toplama formunuz ve araştırma sorularınız başlangıç için yeterlidir. Ekibimiz eksik bilgileri süreç içinde sizinle netleştirir."],
  ["Fiyatlandırma nasıl belirleniyor?", "Fiyat; yöntem, değişken sayısı, raporlama kapsamı ve teslim planına göre belirlenir. Talebiniz değerlendirildikten sonra kapsam ve teklif açık biçimde paylaşılır."],
  ["Analiz sonuçları nasıl teslim ediliyor?", "Yorumlu rapor, tablolar ve kullanılan programa ait tamamlayıcı çıktılar kişisel çalışma alanınız üzerinden teslim edilir."],
];

const headlinePhrases = [
  "uzman desteğiyle ilerleyin.",
  "doğru yöntemle yön verin.",
  "sonuçlarınızı güvenle yorumlayın.",
  "araştırmanızı sağlam temellere oturtun.",
];

const logos = [
  { src: "/davet-transparent/gazi.png", alt: "Gazi Üniversitesi", height: 48 },
  { src: "/davet-transparent/omusem.png", alt: "Ondokuz Mayıs Üniversitesi Sürekli Eğitim Merkezi", height: 42 },
  { src: "/davet-transparent/tei.png", alt: "TEI", height: 38 },
  { src: "/davet-transparent/sanovel.png", alt: "Sanovel", height: 36 },
  { src: "/davet-transparent/selcuk.png", alt: "Selçuk Üniversitesi", height: 48 },
  { src: "/davet-transparent/atılım.png", alt: "Atılım Üniversitesi", height: 40 },
  { src: "/davet-transparent/inonu.png", alt: "İnönü Üniversitesi", height: 43 },
  { src: "/davet-transparent/ktü.png", alt: "Karadeniz Teknik Üniversitesi", height: 42 },
];

const orderBeats = [
  { front: "screen", section: "overview", chat: 1 },
  { front: "screen", section: "files", chat: 2 },
  { front: "phone", section: "files", chat: 2 },
  { front: "phone", section: "files", chat: 3 },
  { front: "screen", section: "payment", chat: 3 },
  { front: "screen", section: "meetings", chat: 3 },
] as const;

const orderMenu: { key: (typeof orderBeats)[number]["section"] | "messages" | "deliveries" | "invoice"; label: string; icon: IconName; badge?: string }[] = [
  { key: "overview", label: "Genel bakış", icon: "home" },
  { key: "files", label: "Sipariş Kalemleri", icon: "file" },
  { key: "payment", label: "Ödeme", icon: "card", badge: "1" },
  { key: "messages", label: "Yazışmalar", icon: "message" },
  { key: "deliveries", label: "Teslimatlar", icon: "download" },
  { key: "meetings", label: "Görüşmeler", icon: "calendar" },
  { key: "invoice", label: "Proforma Faturanız", icon: "invoice" },
];

const orderSteps = [
  ["Talep oluşturuldu", "23 Tem · 23:11", "done"],
  ["Teklif hazırlandı", "24 Tem · 09:18", "now"],
  ["Ödeme", "Bekleniyor", ""],
  ["Analiz", "Sırada", ""],
  ["Teslim", "Planlandı", ""],
] as const;

const threadItems = [
  { kind: "note" as const, text: "orneklem_verileri.xlsx dosyası Sipariş Kalemleri’ne eklendi", time: "09:35" },
  { kind: "you" as const, name: "Siz", time: "09:34", text: "Merhaba, güncel Excel dosyasını Sipariş Kalemleri bölümüne ekledim." },
  { kind: "expert" as const, name: "Dr. Naci Yılmaz", time: "09:21", text: "Merhaba Kerem Bey, dosyanızı inceledim. Analiz öncesinde grup dağılımlarını doğrulamamız gerekiyor." },
];

function HeroMock() {
  const [beat, setBeat] = useState(orderBeats.length - 1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const tick = () => setBeat((current) => (current + 1) % orderBeats.length);
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(tick, 2800);
    };
    const stop = () => window.clearInterval(timer);
    const sync = () => {
      if (document.hidden) stop();
      else start();
    };
    const frame = window.requestAnimationFrame(() => setBeat(0));
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) sync();
      else stop();
    });
    if (rootRef.current) observer.observe(rootRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.cancelAnimationFrame(frame);
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const scene = orderBeats[beat];
  const visibleThread = threadItems.slice(-scene.chat);
  return <div ref={rootRef} className={styles.heroMock} data-front={scene.front} data-section={scene.section}>
    <div className={styles.laptopBezel} aria-hidden="true" />
    <div className={styles.analysisWindow}>
      <div className={styles.appScreen}>
        <div className={styles.appHero}>
          <span className={styles.appFile}><Icon name="file" size={14} /></span>
          <div>
            <small>DS260723008 · 23 TEMMUZ 2026</small>
            <strong>Güç analizi danışmanlığı</strong>
            <em><i />Mevcut durum</em>
            <b>Ücret teklifiniz hazır</b>
          </div>
          <span className={styles.appAction}>Ödemeye git <Icon name="arrow" size={11} /></span>
        </div>
        <div className={styles.appWork}>
          <aside className={styles.appMenu}>
            <p>Sipariş menüsü</p>
            {orderMenu.map((item) => <span className={item.key === scene.section ? styles.menuOn : ""} key={item.label}><Icon name={item.icon} size={11} />{item.label}{item.badge && <i>{item.badge}</i>}</span>)}
          </aside>
          <div className={styles.appMain} key={scene.section}>
            {scene.section === "overview" && <>
              <div className={styles.appBanner}>
                <div>
                  <small>Sonraki adım</small>
                  <strong>Teklifinizi inceleyip ödemeyi tamamlayın</strong>
                  <p>Ödemeniz onaylandığında analiz süreci otomatik olarak başlayacak.</p>
                </div>
                <span>5.000 TL öde <Icon name="arrow" size={11} /></span>
              </div>
              <div className={styles.appPanel}>
                <small>Süreç</small>
                <strong>Sipariş durumu</strong>
                <ol className={styles.appTimeline}>
                  {orderSteps.map(([label, when, state]) => <li className={state === "done" ? styles.stepDone : state === "now" ? styles.stepNow : ""} key={label}><i>{state === "done" ? <Icon name="check" size={9} /> : null}</i><b>{label}</b><small>{when}</small></li>)}
                </ol>
              </div>
              <div className={styles.appFileRow}>
                <Image src="/icons/icons8-microsoft-excel-2019-48.png" alt="" width={22} height={22} />
                <p><b>orneklem_verileri.xlsx</b><small>1,8 MB · 23 Temmuz 2026</small></p>
                <span>İndir</span>
              </div>
            </>}
            {scene.section === "files" && <div className={styles.appPanel}>
              <small>Sipariş kalemleri</small>
              <strong>Çalışma dosyaları</strong>
              <div className={styles.fileFilters}><b>Tümü · 2</b><span>Benim yüklediklerim</span><span>Uzman dosyaları</span></div>
              <div className={styles.appFileRow}>
                <Image src="/icons/icons8-microsoft-excel-2019-48.png" alt="" width={22} height={22} />
                <p><b>orneklem_verileri.xlsx</b><small>Sizin yüklediğiniz · 23 Temmuz · 1,8 MB</small></p>
                <span>İndir</span>
              </div>
              <div className={styles.appFileRow}>
                <Image src="/icons/icons8-microsoft-word-2025-48.png" alt="" width={22} height={22} />
                <p><b>analiz_plani.docx</b><small>Uzman tarafından · Bugün · 420 KB</small></p>
                <span>İndir</span>
              </div>
            </div>}
            {scene.section === "payment" && <div className={styles.appPanel}>
              <small>Ödeme</small>
              <strong>Havale / EFT</strong>
              <div className={styles.payMethods}><b>Havale / EFT</b><span>Kredi kartı</span></div>
              <dl className={styles.payLines}>
                <div><dt>Banka</dt><dd>Akbank</dd></div>
                <div><dt>IBAN</dt><dd>TR64 0004 6013 8988 8000 0143 16</dd></div>
                <div><dt>Açıklama</dt><dd>DS260723008</dd></div>
                <div><dt>Toplam</dt><dd>5.000 TL</dd></div>
              </dl>
            </div>}
            {scene.section === "meetings" && <div className={styles.appPanel}>
              <small>Görüşmeler</small>
              <strong>Planlanan görüşmeler</strong>
              <div className={styles.meetCard}>
                <span><b>30</b><small>TEM</small></span>
                <div>
                  <small>11:00 · 30 dakika · Google Meet</small>
                  <b>Analiz öncesi değerlendirme</b>
                  <p>Dr. Naci Yılmaz ile çevrim içi görüşme</p>
                </div>
                <em>Takvime ekle</em>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
    <div className={styles.phoneWindow} aria-hidden="true">
      <span className={styles.phoneSpeaker} />
      <div className={styles.msgScreen}>
        <div className={styles.msgGuide}>
          <span><Icon name="message" size={13} /></span>
          <div><b>Yeni analiz talepleri için ayrı talep oluşturun</b><p>Bu alan mevcut siparişinizle ilgili soru, dosya ve bilgilendirmeler içindir.</p></div>
        </div>
        <div className={styles.msgComposer}>
          <small>Mesajınız</small>
          <span>Uzmanınıza mesajınızı yazın…</span>
          <div><em>Gönder <Icon name="arrow" size={10} /></em></div>
        </div>
        <p className={styles.msgWait}><Icon name="clock" size={11} /><span><b>Yanıt süresi:</b> Mesai saatlerinde ortalama 1 saat.</span></p>
        <div className={styles.msgThread}>
          <span className={styles.msgDay}>Bugün</span>
          {visibleThread.map((item) => {
            if (item.kind === "note") return <p className={styles.msgNote} key={item.time}><Icon name="file" size={10} />{item.text} <time>{item.time}</time></p>;
            if (item.kind === "you") return <article className={styles.msgYou} key={item.time}><b>Siz <small>{item.time}</small></b><p>{item.text}</p></article>;
            return <article className={styles.msgExpert} key={item.time}><i>NY</i><div><b>{item.name} <small>{item.time}</small></b><p>{item.text}</p></div></article>;
          })}
        </div>
      </div>
    </div>
  </div>;
}

function AnimatedHeadline() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const interval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % headlinePhrases.length);
    }, 4400);
    return () => window.clearInterval(interval);
  }, []);

  return <SoftTypedLine text={headlinePhrases[phraseIndex]} />;
}

function SoftTypedLine({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const [count, setCount] = useState(text.length);
  const [leaving, setLeaving] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (text === shown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => {
        setShown(text);
        setCount(text.length);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const leaveFrame = window.requestAnimationFrame(() => {
      setStarted(true);
      setLeaving(true);
    });
    const timer = window.setTimeout(() => {
      setLeaving(false);
      setShown(text);
      setCount(0);
    }, 280);
    return () => {
      window.cancelAnimationFrame(leaveFrame);
      window.clearTimeout(timer);
    };
  }, [text, shown]);

  useEffect(() => {
    if (leaving || count >= shown.length) return;
    const delay = shown[count] === " " ? 70 : 28;
    const timer = window.setTimeout(() => setCount((current) => current + 1), delay);
    return () => window.clearTimeout(timer);
  }, [count, shown, leaving]);

  const splitWords = shown.split(" ");
  const words = splitWords.map((word, wordIndex) => {
    const start = splitWords.slice(0, wordIndex).reduce((total, previousWord) => total + previousWord.length + 1, 0);
    return {
      wordIndex,
      start,
      spaced: wordIndex > 0 && start - 1 < count,
      characters: Array.from(word.slice(0, Math.max(0, count - start))),
    };
  });

  return <span className={`${styles.typedLine} ${started ? styles.typedLive : ""} ${leaving ? styles.typedLeaving : ""}`}>
    {words.map(({ wordIndex, start, spaced, characters }) => <span key={wordIndex}>{spaced && " "}<span className={styles.typedWord}>{characters.map((character, index) => <span className={styles.typedCharacter} key={start + index}>{character}</span>)}</span></span>)}
    {started && <span className={styles.typedCaret} aria-hidden="true" />}
  </span>;
}

export function DemoLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.reveal}`));
    const observer = reduced ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add(styles.visible));
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
    nodes.forEach((node) => reduced ? node.classList.add(styles.visible) : observer?.observe(node));
    const onPointerMove = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.(`.${styles.featureVisual}`);
      if (!(target instanceof HTMLElement)) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer?.disconnect();
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#demo-content">İçeriğe geç</a>
      <header className={styles.header} ref={headerRef}>
        <nav className={styles.nav} aria-label="Demo ana navigasyon">
          <Link href="/demo" className={styles.brand} aria-label="eistatistik demo anasayfası">
            <Image src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority />
          </Link>
          <div className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ""}`} id="demo-navigation">
            <a href="#hizmetler" onClick={closeMenu}>Hizmetler</a>
            <a href="#surec" onClick={closeMenu}>Nasıl çalışır?</a>
            <a href="#karsilastirma" onClick={closeMenu}>Karşılaştırma</a>
            <a href="#calisma-bicimleri" onClick={closeMenu}>Çalışma biçimleri</a>
            <a href="#sss" onClick={closeMenu}>SSS</a>
            <Link href="/blog" onClick={closeMenu}>Blog</Link>
            <Link href="/giris" className={styles.mobileCta} onClick={closeMenu}>Analiz talebi oluştur</Link>
          </div>
          <div className={styles.navActions}>
            <Link href="/giris" className={styles.login}>Giriş yap</Link>
            <Link href="/giris" className={styles.navCta}>Talep oluştur <Icon name="arrow" size={17} /></Link>
            <button type="button" className={styles.menuButton} aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={menuOpen} aria-controls="demo-navigation" onClick={() => setMenuOpen((value) => !value)}>
              <Icon name={menuOpen ? "close" : "bars"} />
            </button>
          </div>
        </nav>
      </header>

      <main id="demo-content">
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={`${styles.heroCopy} ${styles.reveal}`}>
              <div className={styles.heroBadge}><span>Uzman destekli analiz</span><strong>Akademik raporlama</strong></div>
              <div className={styles.heroTitleSlot}>
                <h1 className={styles.srOnly}>Analizinize uzman desteğiyle ilerleyin.</h1>
                {headlinePhrases.map((phrase) => <div className={`${styles.heroTitle} ${styles.heroTitleGhost}`} aria-hidden="true" key={phrase}><span>Analizinize</span><em>{phrase}</em></div>)}
                <div className={styles.heroTitle} aria-hidden="true"><span>Analizinize</span><em><AnimatedHeadline /></em></div>
              </div>
              <p className={styles.heroLead}>Verinizi güvenle paylaşın; yöntem seçiminden yorumlu rapora kadar uzman ekibimizle ilerleyin.</p>
              <div className={styles.heroActions}>
                <Link href="/giris" className={styles.primary}>Analiz talebi oluştur <Icon name="arrow" /></Link>
                <a href="#surec" className={styles.secondary}><span><Icon name="play" size={17} /></span> Süreci inceleyin</a>
              </div>
              <div className={styles.heroTrust}>
                <p>Birlikte çalıştığımız kurumlardan bazıları</p>
                <div className={styles.heroTrustMarquee}>
                  <div className={styles.heroTrustTrack}>
                    {[false, true].map((duplicate) => <div className={styles.heroTrustGroup} aria-hidden={duplicate || undefined} key={duplicate ? "duplicate" : "primary"}>
                      {logos.map((logo) => <Image key={`${duplicate ? "duplicate" : "primary"}-${logo.src}`} src={logo.src} alt={duplicate ? "" : logo.alt} width={180} height={88} sizes="140px" style={{ "--logo-height": `${logo.height}px` } as CSSProperties} />)}
                    </div>)}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.heroVisual} ${styles.reveal}`} aria-label="eistatistik analiz çalışma alanı temsili">
              <HeroMock />
            </div>
          </div>
        </section>

        <section className={styles.features} id="ozellikler" aria-labelledby="features-title">
          <h2 id="features-title" className={`${styles.featuresHeading} ${styles.reveal}`}>
            <span>Daha görünür süreç. Daha güvenli dosya.</span>
            <span className={styles.featureAccent}>Daha net rapor.</span>
          </h2>
          <div className={styles.featuresGrid}>
            <article className={`${styles.featureTile} ${styles.reveal}`}>
              <div className={styles.featureFrame}>
                <div className={styles.featureVisual}>
                  <div className={styles.orbit}>
                    <span className={styles.orbitRing} />
                    <span className={`${styles.orbitRing} ${styles.orbitRing2}`} />
                    <span className={`${styles.orbitRing} ${styles.orbitRing3}`} />
                    <span className={styles.orbitCore}><Image src="/logo.png" alt="" width={72} height={72} /></span>
                    {["İstatistiksel analiz", "Power analizi", "Geçerlilik", "Mentörlük"].map((label, index) => (
                      <span className={`${styles.orbitPill} ${styles[`orbitPill${index}`]}`} key={label}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>
              <h3>Uzman destekli analiz</h3>
              <p>Yöntem seçimi, analiz ve yorumlu rapor tek çalışma alanında, çalışmanızı bilen uzmanla ilerler.</p>
            </article>

            <article className={`${styles.featureTile} ${styles.reveal}`}>
              <div className={styles.featureFrame}>
                <div className={styles.featureVisual}>
                  <div className={styles.reportPreview}>
                    <div className={styles.reportHead}>
                      <div>
                        <p>Tablo 1</p>
                        <em>Tanımlayıcı istatistikler</em>
                      </div>
                      <span className={styles.langToggle}><b>TR</b><span>EN</span></span>
                    </div>
                    <table>
                      <thead><tr><th>Değişken</th><th>N</th><th>Ort ± SS</th><th>p</th></tr></thead>
                      <tbody>
                        <tr><td>Yaş</td><td>248</td><td>42.8 ± 8.4</td><td>.214</td></tr>
                        <tr><td>Ölçek skoru</td><td>248</td><td>6.2 ± 1.9</td><td>.087</td></tr>
                        <tr><td>Kalış süresi</td><td>248</td><td>3.9 ± 1.2</td><td>.132</td></tr>
                      </tbody>
                    </table>
                    <small><i>Not.</i> Değerler örnek teslim tablosudur.</small>
                  </div>
                </div>
              </div>
              <h3>Akademik rapor teslimi</h3>
              <p>Tablolar, bulgular ve yöntem notları teslim dosyanızda düzenli biçimde bir arada.</p>
            </article>

            <article className={`${styles.featureTile} ${styles.reveal}`}>
              <div className={styles.featureFrame}>
                <div className={styles.featureVisual}>
                  <div className={styles.shield}>
                    <span className={styles.shieldRing} />
                    <span className={`${styles.shieldRing} ${styles.shieldRing2}`} />
                    <span className={`${styles.shieldRing} ${styles.shieldRing3}`} />
                    <span className={styles.shieldCore}><Icon name="shield" size={34} /></span>
                    <span className={`${styles.shieldChip} ${styles.shieldChipA}`}>KVKK</span>
                    <span className={`${styles.shieldChip} ${styles.shieldChipB}`}><Icon name="lock" size={15} /></span>
                    <span className={`${styles.shieldChip} ${styles.shieldChipC}`}><Icon name="key" size={15} /></span>
                  </div>
                </div>
              </div>
              <h3>KVKK ile güvenli dosyalar</h3>
              <p>Ham veri ve raporlar yalnızca ilgili siparişin çalışma alanında kalır.</p>
            </article>

            <article className={`${styles.featureTile} ${styles.featureWide} ${styles.reveal}`}>
              <div className={styles.featureFrame}>
                <div className={styles.featureVisual}>
                  <div className={styles.proofStack}>
                    <span className={styles.proofLine} />
                    {[
                      ["Normallik", "Shapiro-Wilk · p = .087"],
                      ["Grup farkı", "t(246) = 2.14 · p = .033"],
                      ["İlişki", "r = .27 · p < .001"],
                    ].map(([title, detail], index) => (
                      <div className={`${styles.proofCard} ${styles[`proofCard${index}`]}`} key={title}>
                        <span className={styles.proofMark}><Icon name="check" size={15} /></span>
                        <div><b>{title}</b><small>{detail}</small></div>
                        <em>Uzman</em>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <h3>Uzman kontrolünden geçmiş sonuçlar</h3>
              <p>Çıktılar, kullanılan yönteme ait notlarla birlikte çalışma alanınızda doğrulanır.</p>
            </article>

            <article className={`${styles.featureTile} ${styles.featureWide} ${styles.reveal}`}>
              <div className={styles.featureFrame}>
                <div className={styles.featureVisual}>
                  <div className={styles.resultChart}>
                    <p>Ortalama ölçek skoru</p>
                    <strong>6.2 <span>p = .033</span></strong>
                    <div className={styles.resultBars}>
                      {[42, 58, 50, 66, 88].map((height, index) => (
                        <span key={height} className={index === 4 ? `${styles.resultBar} ${styles.resultAccent}` : styles.resultBar} style={{ "--h": `${height}%`, "--d": `${index * 90}ms` } as CSSProperties} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <h3>Anlamlı sonuçlar, açık yorum</h3>
              <p>Ortalama, p değeri ve grafik bulgular yorumlu raporunuzun içinde yer alır.</p>
            </article>
          </div>
        </section>

        <section className={styles.services} id="hizmetler">
          <header className={`${styles.sectionHead} ${styles.reveal}`}>
            <p className={styles.kicker}><span /> Uzmanlık alanları</p>
            <div><h2>Araştırmanızın ihtiyaç duyduğu desteği tek yerde bulun.</h2><p>Hazır bir paket yerine çalışmanızın yöntemi, kapsamı ve teslim ihtiyacına göre şekillenen profesyonel destek.</p></div>
          </header>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => (
              <article className={`${styles.serviceCard} ${index === 0 ? styles.serviceFeatured : ""} ${styles.reveal}`} key={service.title}>
                <div className={styles.serviceMedia}><ServiceVisual kind={service.visual} /></div>
                <div className={styles.serviceTop}><span>{service.number}</span><small>{service.tag}</small></div>
                <div><h3>{service.title}</h3><p>{service.copy}</p></div>
                <Link href={service.href} aria-label={`${service.title} hizmetini inceleyin`}>Hizmeti inceleyin <Icon name="arrow" size={18} /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workspaceProof} id="surec" aria-labelledby="workspace-title">
          <header className={`${styles.centerHead} ${styles.reveal}`}>
            <p className={styles.kicker}><span /> Nasıl çalışır?</p>
            <h2 id="workspace-title">Analiz sürecinizin tamamı, düzenli ve görünür.</h2>
            <p>Dosya paylaşımından uzman mesajlarına, ilerleme adımlarından teslim belgelerine kadar ihtiyacınız olan her şey aynı yerde.</p>
          </header>
          <div className={styles.flowGrid}>
            {flowSteps.map((step, index) => (
              <article className={`${styles.flowCard} ${styles.reveal}`} key={step.title}>
                <div className={styles.flowInner}>
                  <div className={styles.flowHead}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3></div>
                  <p>{step.copy}</p>
                  <div className={styles.flowVisual} aria-hidden="true"><FlowVisual kind={step.visual} /></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.comparison} id="karsilastirma">
          <header className={`${styles.comparisonHead} ${styles.reveal}`}>
            <div><p className={styles.kicker}><span /> Karşılaştırma</p><h2>Dağınık iletişim yerine, yönetilebilir bir analiz süreci.</h2></div>
            <div className={styles.comparisonAside}>
              <p>eistatistik çalışma alanı; kapsamı, dosyaları, iletişimi ve teslimi tek bir süreçte bir araya getirir.</p>
              <Link href="/giris">Analiz talebi oluştur <Icon name="arrow" size={18} /></Link>
            </div>
          </header>
          <div className={`${styles.comparisonTable} ${styles.reveal}`}>
            <div className={styles.comparisonSheet} role="table" aria-label="Çalışma yöntemi karşılaştırması">
              <div className={styles.comparisonTableHead} role="row">
                <span role="columnheader">Süreç</span>
                <div role="columnheader" className={`${styles.cmpPlan} ${styles.cmpPlanUs}`}>
                  <span className={styles.cmpPlanIcon}><Image src="/logo.png" alt="" width={28} height={28} /></span>
                  <p>eistatistik</p>
                  <small>Çalışma alanı</small>
                </div>
                <div role="columnheader" className={styles.cmpPlan}>
                  <span className={`${styles.cmpPlanIcon} ${styles.cmpPlanMuted}`}><Icon name="message" size={20} /></span>
                  <p>Geleneksel</p>
                  <small>E-posta ve ekler</small>
                </div>
              </div>
              {comparisonRows.map(([label, us, usDetail, them, themDetail]) => (
                <div className={styles.comparisonRow} role="row" key={label}>
                  <b role="rowheader">{label}</b>
                  <div role="cell" className={styles.cmpGood}><span><i><Icon name="check" size={12} /></i>{us}</span><small>{usDetail}</small></div>
                  <div role="cell"><span><i><Icon name="close" size={12} /></i>{them}</span><small>{themDetail}</small></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.engagements} id="calisma-bicimleri">
          <header className={`${styles.centerHead} ${styles.reveal}`}>
            <h2>İhtiyacınıza uygun çalışma biçimini <span>seçin.</span></h2>
            <p>Sabit bir paket yerine, araştırmanızın kapsamına ve ihtiyaç duyduğunuz desteğe göre ilerleyin.</p>
          </header>
          <div className={styles.engagementGrid}>
            {engagementModels.map((model) => (
              <article className={`${styles.engagementCard} ${styles.reveal}`} key={model.title}>
                <div className={styles.engagementInner}>
                  <h3>{model.title}</h3>
                  <p>{model.copy}</p>
                  <div className={styles.engagementFoot}>
                    <strong>{model.offer}</strong>
                    <Link href={model.href} className={model.solid ? styles.engagementSolid : styles.engagementLine}>{model.action}<Icon name="arrow" size={18} /></Link>
                    <ul>{model.points.map((point) => <li key={point}><span className={styles.engagementCheck}><Icon name="check" size={12} /></span>{point}</li>)}</ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.insights} aria-labelledby="insights-title">
          <header className={`${styles.centerHead} ${styles.reveal}`}>
            <h2 id="insights-title">Analizden önce <span>doğru soruyu sorun.</span></h2>
            <p>Araştırma tasarımı, veri hazırlığı ve raporlama için uzmanlarımızın hazırladığı kaynaklar.</p>
          </header>
          <div className={styles.insightBoard}>
            <Link href="/blog" className={`${styles.insightFeatured} ${styles.reveal}`}>
              <div className={styles.insightFeaturedInner}>
                <InsightCover kind={featuredInsight.cover} />
                <div className={styles.insightFeaturedBody}>
                  <span>{featuredInsight.category}</span>
                  <h3>{featuredInsight.title}</h3>
                  <p>{featuredInsight.summary}</p>
                  <em>Yazıyı oku <Icon name="arrow" size={16} /></em>
                  <small className={styles.insightAuthor}>
                    <i><Image src="/logo.png" alt="" width={24} height={24} /></i>
                    <span><b>eistatistik</b><span>{featuredInsight.reading}</span></span>
                  </small>
                </div>
              </div>
            </Link>
            <div className={styles.insightGrid}>
              {insights.map((post) => (
                <Link href="/blog" className={`${styles.insightCard} ${styles.reveal}`} key={post.title}>
                  <div className={styles.insightCardInner}>
                    <InsightCover kind={post.cover} />
                    <span>{post.category}</span>
                    <h3>{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/blog" className={styles.insightMore}>Tüm yazılar <Icon name="arrow" size={18} /></Link>
          </div>
        </section>

        <section className={styles.faq} id="sss">
          <header className={`${styles.centerHead} ${styles.reveal}`}><p className={styles.kicker}><span /> Sık sorulanlar</p><h2>Başlamadan önce merak ettikleriniz.</h2><p>Yanıtını bulamadığınız bir konu için ekibimizle iletişime geçebilirsiniz.</p></header>
          <div className={styles.faqList}>
            {faqs.map(([question, answer], index) => {
              const open = openFaq === index;
              return <article className={`${styles.faqItem} ${open ? styles.faqOpen : ""} ${styles.reveal} ${styles.visible}`} key={question}>
                <button type="button" aria-expanded={open} aria-controls={`demo-faq-${index}`} onClick={() => setOpenFaq(open ? -1 : index)}><span>{question}</span><i aria-hidden="true">{open ? "−" : "+"}</i></button>
                <div className={styles.faqPanel} id={`demo-faq-${index}`}><p>{answer}</p></div>
              </article>;
            })}
          </div>
        </section>

        <section className={`${styles.cta} ${styles.reveal} ${styles.visible}`}>
          <div className={styles.ctaFrame}>
            <div className={styles.ctaPanel}>
              <span className={styles.ctaLogo}><Image src="/logo.png" alt="" width={38} height={38} /></span>
              <h2>Çalışmanız hazırsa, biz de hazırız.</h2>
              <p>İhtiyacınızı birkaç adımda paylaşın. Uzman ekibimiz kapsamı sizinle birlikte netleştirsin.</p>
              <Link href="/giris" className={styles.ctaButton}>Analiz talebi oluştur <Icon name="arrow" size={18} /></Link>
              <ul>
                {ctaPoints.map((point) => <li key={point}><Icon name="check" size={16} />{point}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <div><Image src="/Beyaz e-istatistik.png" alt="eistatistik" width={230} height={54} /><p>İstatistiğe ihtiyaç duyan herkes için uzman analiz ve danışmanlık platformu.</p></div>
          <nav aria-label="Demo footer bağlantıları"><a href="#hizmetler">Hizmetler</a><a href="#surec">Nasıl çalışır?</a><a href="#calisma-bicimleri">Çalışma biçimleri</a><a href="#sss">SSS</a><Link href="/blog">Blog</Link></nav>
          <address><a href="mailto:info@eistatistik.com">info@eistatistik.com</a><a href="tel:+908508851256">0 (850) 885 12 56</a><span>Teknopark, Atakum / Samsun</span></address>
        </div>
        <div className={styles.footerBottom}><span>© 2026 eistatistik</span><div><a href="/legal/kvkk-aydinlatma-metni.txt" target="_blank" rel="noopener noreferrer">KVKK Aydınlatma Metni</a><a href="/legal/uyelik-sozlesmesi.txt" target="_blank" rel="noopener noreferrer">Üyelik Sözleşmesi</a></div></div>
      </footer>
    </div>
  );
}
