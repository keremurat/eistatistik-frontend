import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LandingHeader } from "../../components/LandingHeader";

export const metadata: Metadata = { title: "Davetli Konuşmalar | Eİstatistik" };

type Reference = { name: string; logo: string };

const references: Reference[] = [
  { name: "TUSAŞ Motor Sanayii (TEI)", logo: "/davet/tei.webp" },
  { name: "TDB Uluslararası Diş Hekimliği Kongresi", logo: "/davet/tdb.webp" },
  { name: "Atılım Üniversitesi", logo: "/davet/atilim.webp" },
  { name: "Türk Nöroloji Derneği", logo: "/davet/noroloji_dernegi.webp" },
  { name: "Gazi Üniversitesi", logo: "/davet/gazi.png" },
  { name: "TRT Radyo Haber", logo: "/davet/trt.jpg" },
  { name: "CNN Türk", logo: "/davet/cnn.png" },
  { name: "Haber AKS", logo: "/davet/haber_aks.jpg" },
  { name: "Restoratif Diş Hekimliği Derneği", logo: "/davet/restoratif.jpg" },
  { name: "Ebeler Derneği", logo: "/davet/ebeler_dernegi.webp" },
  { name: "MedicalPark Samsun", logo: "/davet/medical.png" },
  { name: "Eskişehir Osmangazi Diş Hekimliği", logo: "/davet/eskisehir.png" },
  { name: "Konya Selçuk Üniversitesi Diş Hekimliği Fakültesi", logo: "/davet/selcuk_uni.jpg" },
  { name: "Samsun Teknopark", logo: "/davet/samsun_teknopark.jpg" },
  { name: "SAMSİAD", logo: "/davet/SAMSİAD.jpg" },
  { name: "GİYAT", logo: "/davet/giyat.jpg" },
  { name: "IF", logo: "/davet/if.jpg" },
  { name: "Purple Talk", logo: "/davet/purpletalk.png" },
];

export default function DavetliKonusmalarPage() {
  return (
    <main className="landing-page nywork-page">
      <LandingHeader />

      <section className="ny-hero">
        <p className="analysis-eyebrow">Eİstatistik</p>
        <h1>Neler Yaptık?</h1>
        <p className="ny-hero-sub">Davetli Konuşmalar</p>
        <p className="ny-hero-lead">Bugüne kadar birçok kurum, kuruluş ve platformda istatistik alanına yönelik bilgi ve deneyimlerimizi aktardık.</p>
        <div className="ny-hero-proof"><span>{references.length}+ kurum ve platform</span><span>Kongre ve konferanslar</span><span>Ulusal medya</span></div>
      </section>

      <section className="ny-section">
        <div className="ny-grid">
          {references.map((ref) => (
            <article className="ny-card" key={ref.name}>
              <div className="ny-plate">
                <Image src={ref.logo} alt={ref.name} fill sizes="(max-width:680px) 50vw, (max-width:1024px) 33vw, 22vw" />
              </div>
              <p className="ny-name">{ref.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="analysis-final-cta"><div><span>BİRLİKTE ÇALIŞALIM</span><h2>Etkinliğinizde bizi konuk edin.</h2><p>Kurumunuz, kongreniz veya platformunuz için istatistik odaklı bir sunum planlayalım.</p></div><a href="mailto:destek@eistatistik.com">Bize ulaşın <span>→</span></a></section>

      <footer className="landing-footer"><Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} /><div><Link href="/#services">Hizmetler</Link><Link href="/#platform">Platform</Link><a href="mailto:destek@eistatistik.com">İletişim</a><Link href="/giris">Giriş yap</Link></div><p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p></footer>
    </main>
  );
}
