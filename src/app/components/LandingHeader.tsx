"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);

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
    <header className={`landing-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="landing-nav-shell">
        <Link href="/" className="landing-logo" aria-label="Eİstatistik ana sayfa">
          <Image src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority />
        </Link>
        <button className="landing-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Menüyü aç veya kapat">
          <span /><span />
        </button>
        <nav className={open ? "open" : ""} aria-label="Ana menü">
          <a href="#services" onClick={() => setOpen(false)}>Hizmetler</a>
          <a href="#platform" onClick={() => setOpen(false)}>Platform</a>
          <a href="#process" onClick={() => setOpen(false)}>Nasıl çalışır?</a>
          <a href="#faq" onClick={() => setOpen(false)}>Merak edilenler</a>
        </nav>
        <div className="landing-nav-actions">
          <Link href="/giris" className="landing-login">Giriş yap</Link>
          <Link href="/giris" className="landing-start">Talep oluştur <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </header>
  );
}
