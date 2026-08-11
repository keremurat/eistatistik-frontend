import Image from "next/image";
import Link from "next/link";
import { GMAIL_CONTACT_URL } from "../lib/contact";

function SocialIcon({ name }: { name: "instagram" | "x" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "instagram" ? (
        <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>
      ) : <><path d="M5 4l14 16" /><path d="M19 4 5 20" /></>}
    </svg>
  );
}

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-grid">
        <div className="landing-footer-brand">
          <Image src="/Beyaz e-istatistik.png" alt="eistatistik" width={230} height={54} />
          <p>İstatistiğe ihtiyaç duyan herkes için online istatistik otomasyonu.</p>
        </div>

        <nav className="landing-footer-column" aria-label="Hızlı erişim">
          <h2>Hızlı Erişim</h2>
          <Link href="/">Anasayfa</Link>
          <Link href="/#services">Hizmetlerimiz</Link>
          <Link href="/egitimler/bireysel">Eğitimler</Link>
          <Link href="/#platform">Platform</Link>
          <Link href="/#process">Nasıl çalışır?</Link>
          <Link href="/#yorumlar">Yorumlar</Link>
          <Link href="/#faq">Merak edilenler</Link>
          <Link href="/#faq">Blog</Link>
          <Link href="/neler-yaptik/davetli-konusmalar">Neler Yaptık?</Link>
          <Link href="/#iletisim">İletişim</Link>
        </nav>

        <nav className="landing-footer-column" aria-label="Hizmetlerimiz">
          <h2>Hizmetlerimiz</h2>
          <Link href="/hizmetler/istatistiksel-analiz">İstatistiksel Analiz</Link>
          <Link href="/hizmetler/power-analizi">Power Analizi</Link>
          <Link href="/#services">Graphical Abstract</Link>
          <Link href="/hizmetler/gecerlilik-guvenilirlik">Geçerlilik ve Güvenilirlik Analizi</Link>
          <Link href="/hizmetler/proforma">Proforma</Link>
          <Link href="/hizmetler/danismanlik">Danışmanlık</Link>
        </nav>

        <address className="landing-footer-column landing-footer-contact">
          <h2>İletişim</h2>
          <p>Ondokuz Mayıs Üniversitesi<br />Teknopark, Kurupelit Yerleşkesi<br />55139 Atakum/Samsun</p>
          <div><a href="tel:+908508851256">0 (850) 885 12 56</a><a href="tel:+905386150444">0 (538) 615 04 44</a></div>
          <a href={GMAIL_CONTACT_URL} target="_blank" rel="noopener noreferrer">info@eistatistik.com</a>
        </address>
      </div>

      <div className="landing-footer-bottom">
        <p>© 2026 eistatistik. Tüm hakları saklıdır.</p>
        <div className="landing-footer-socials" aria-label="Sosyal medya hesapları">
          <a href="https://www.instagram.com/eistatistik/" target="_blank" rel="noopener noreferrer" aria-label="eistatistik Instagram hesabı"><SocialIcon name="instagram" /></a>
          <a href="https://x.com/naci_murat" target="_blank" rel="noopener noreferrer" aria-label="Naci Murat X hesabı"><SocialIcon name="x" /></a>
        </div>
      </div>
    </footer>
  );
}
