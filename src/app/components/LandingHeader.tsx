"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"services" | "education" | "work" | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const closeNavigation = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown: "services" | "education" | "work") => {
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
          <Link href="/" onClick={closeNavigation}>Anasayfa</Link>

          <details className="landing-nav-dropdown" open={activeDropdown === "services"}>
            <summary onClick={(event) => { event.preventDefault(); toggleDropdown("services"); }}>Hizmetlerimiz</summary>
            <div className="landing-nav-dropdown-menu">
              <Link href="/hizmetler/istatistiksel-analiz" onClick={closeNavigation}>İstatistiksel Analiz</Link>
              <Link href="/hizmetler/power-analizi" onClick={closeNavigation}>Power Analizi</Link>
              <a href="#services" onClick={closeNavigation}>Graphical Abstract</a>
              <a href="#services" onClick={closeNavigation}>Veri İşleme</a>
              <Link href="/hizmetler/gecerlilik-guvenilirlik" onClick={closeNavigation}>Geçerlilik ve Güvenilirlik Analizi</Link>
              <Link href="/hizmetler/proforma" onClick={closeNavigation}>Proforma</Link>
              <a href="#services" onClick={closeNavigation}>Danışmanlık</a>
            </div>
          </details>

          <details className="landing-nav-dropdown" open={activeDropdown === "education"}>
            <summary onClick={(event) => { event.preventDefault(); toggleDropdown("education"); }}>Eğitimler</summary>
            <div className="landing-nav-dropdown-menu compact">
              <Link href="/egitimler/bireysel" onClick={closeNavigation}>Bireysel Eğitim</Link>
              <a href="#services" onClick={closeNavigation}>Kurumsal Eğitim</a>
            </div>
          </details>

          <a href="#platform" onClick={closeNavigation}>Platform</a>
          <a href="#process" onClick={closeNavigation}>Nasıl çalışır?</a>
          <a href="#faq" onClick={closeNavigation}>Merak edilenler</a>
          <a href="#faq" onClick={closeNavigation}>Blog</a>

          <details className="landing-nav-dropdown" open={activeDropdown === "work"}>
            <summary onClick={(event) => { event.preventDefault(); toggleDropdown("work"); }}>Neler Yaptık?</summary>
            <div className="landing-nav-dropdown-menu compact">
              <a href="#platform" onClick={closeNavigation}>Davetli Konuşmalar</a>
              <a href="#platform" onClick={closeNavigation}>Referanslar</a>
            </div>
          </details>

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
