import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EduDetailTabs } from "../../../components/EduDetailTabs";
import { LandingHeader } from "../../../components/LandingHeader";
import { getDetail, getModule, modules } from "../modules";

type IconName = "users" | "clock" | "award" | "chart";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    award: <><circle cx="12" cy="8" r="5" /><path d="m8.5 12-1.5 9L12 18.5 17 21l-1.5-9" /></>,
    chart: <><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function generateStaticParams() {
  return modules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const module = getModule(slug);
  return { title: module ? `${module.title} | Eİstatistik` : "Eğitim | Eİstatistik" };
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = getModule(slug);
  if (!module) notFound();
  const detail = getDetail(module);

  return (
    <main className="landing-page analysis-service-page edu-detail-page">
      <LandingHeader />

      <section className="edu-detail-hero">
        <div className="edu-detail-hero-head">
          <p className="analysis-eyebrow">{module.tag.toLocaleUpperCase("tr")} EĞİTİMİ</p>
          <h1>{module.title}</h1>
          <span className="edu-detail-rule" aria-hidden="true" />
        </div>
      </section>

      <section className="edu-detail-top">
        <aside className="edu-detail-card">
          <div className="edu-detail-card-head">EĞİTİM DETAYLARI</div>
          <ul className="edu-detail-facts">
            <li><span className="edu-fact-ic"><Icon name="users" size={18} /></span><div><small>Kontenjan</small><strong>{detail.kontenjan}</strong></div></li>
            <li><span className="edu-fact-ic"><Icon name="clock" size={18} /></span><div><small>Süre</small><strong>{module.days}</strong></div></li>
            <li><span className="edu-fact-ic"><Icon name="award" size={18} /></span><div><small>Sertifika</small><strong>{detail.sertifika}</strong></div></li>
            <li><span className="edu-fact-ic"><Icon name="chart" size={18} /></span><div><small>Seviye</small><strong>{detail.level}</strong></div></li>
          </ul>
          <Link className="edu-detail-join" href="/giris">Katıl / Haber ver</Link>
        </aside>

        <div className={`edu-detail-banner edu-t-${module.tone}${detail.videoId ? " edu-detail-banner--video" : ""}`}>
          {detail.videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${detail.videoId}?autoplay=1&mute=1&playsinline=1&rel=0`}
              title={module.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <>
              <Image src={module.img} alt="" fill sizes="(max-width:900px) 100vw, 55vw" priority />
              <div className="edu-detail-banner-cap">
                <span>{module.tag} eğitimi</span>
                <strong>{module.title}</strong>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="edu-detail-note"><p>{detail.note}</p></section>

      <EduDetailTabs content={detail.content} materials={detail.materials} faqs={detail.faqs} gallery={detail.gallery} />

      <section className="analysis-final-cta"><div><span>KONTENJAN İLE SINIRLIDIR</span><h2>Bu eğitimde yerinizi ayırtın.</h2><p>Eğitim talebi oluşturun; uygun program ve takvimi sizinle birlikte planlayalım.</p></div><Link href="/giris">Eğitim talebi oluştur <span>→</span></Link></section>

      <footer className="landing-footer"><Image src="/Beyaz e-istatistik.png" alt="Eİstatistik" width={230} height={54} /><div><Link href="/#services">Hizmetler</Link><Link href="/#platform">Platform</Link><a href="mailto:destek@eistatistik.com">İletişim</a><Link href="/giris">Giriş yap</Link></div><p>© 2026 Eİstatistik. Tüm hakları saklıdır.</p></footer>
    </main>
  );
}
