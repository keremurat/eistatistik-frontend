"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"services" | "education" | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const closeNavigation = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  // Anasayfadayken "Anasayfa"ya tıklamak yeni gezinme tetiklemediğinden sayfayı tepeye kaydır.
  const goHome = () => {
    closeNavigation();
    if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDropdown = (dropdown: "services" | "education") => {
    setActiveDropdown((current) => current === dropdown ? null : dropdown);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => closeNavigation();
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setActiveDropdown(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateHeader = () => {
      const currentY = Math.max(window.scrollY, 0);
      setScrolled(currentY > 48);
      frame = 0;
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={headerRef} className={`landing-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="landing-nav-shell">
        <Link href="/" className="landing-logo" aria-label="Eİstatistik ana sayfa">
          <Image src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority />
        </Link>
        <button className="landing-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Menüyü aç veya kapat">
          <span /><span />
        </button>
        <nav className={open ? "open" : ""} aria-label="Ana menü">
          <Link href="/" onClick={goHome}>Anasayfa</Link>

          <details className="landing-nav-dropdown" open={activeDropdown === "services"}>
            <summary onClick={(event) => { event.preventDefault(); toggleDropdown("services"); }}>Hizmetlerimiz</summary>
            <div className="landing-nav-dropdown-menu">
              <Link href="/hizmetler/istatistiksel-analiz" onClick={closeNavigation}>İstatistiksel Analiz</Link>
              <Link href="/hizmetler/power-analizi" onClick={closeNavigation}>Power Analizi</Link>
              <Link href="/#services" onClick={closeNavigation}>Graphical Abstract</Link>
              <Link href="/#services" onClick={closeNavigation}>Veri İşleme</Link>
              <Link href="/hizmetler/gecerlilik-guvenilirlik" onClick={closeNavigation}>Geçerlilik ve Güvenilirlik Analizi</Link>
              <Link href="/hizmetler/proforma" onClick={closeNavigation}>Proforma</Link>
              <Link href="/#services" onClick={closeNavigation}>Danışmanlık</Link>
            </div>
          </details>

          <details className="landing-nav-dropdown" open={activeDropdown === "education"}>
            <summary onClick={(event) => { event.preventDefault(); toggleDropdown("education"); }}>Eğitimler</summary>
            <div className="landing-nav-dropdown-menu compact">
              <Link href="/egitimler/bireysel" onClick={closeNavigation}>Bireysel Eğitim</Link>
              <Link href="/#services" onClick={closeNavigation}>Kurumsal Eğitim</Link>
            </div>
          </details>

          <Link href="/#platform" onClick={closeNavigation}>Platform</Link>
          <Link href="/#process" onClick={closeNavigation}>Nasıl çalışır?</Link>
          <Link href="/#yorumlar" onClick={closeNavigation}>Yorumlar</Link>
          <Link href="/#faq" onClick={closeNavigation}>Merak edilenler</Link>
          <a href="mailto:destek@eistatistik.com" onClick={closeNavigation}>İletişim</a>
        </nav>
        <div className="landing-nav-actions">
          <Link href="/giris" className="landing-login">Giriş yap</Link>
          <Link href="/giris" className="landing-start">Talep oluştur <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </header>
  );
}
