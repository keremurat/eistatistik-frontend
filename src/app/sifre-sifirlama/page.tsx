"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type IconName = "arrow" | "mail" | "shield" | "check" | "back";
function AuthIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    back: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!emailValid) return;
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setSent(true); }, 700);
  }

  return <main className="auth-page">
    <section className="auth-card">
      <aside className="auth-brand-panel">
        <span className="auth-brand-art" aria-hidden="true" />
        <Link href="/" className="auth-logo-shortcut" aria-label="eistatistik landing page'e dön">
          <span className="auth-back-home" aria-hidden="true">←</span>
          <Image className="auth-logo-white" src="/Beyaz e-istatistik.png" alt="eistatistik" width={300} height={69} priority />
        </Link>
        <div className="auth-brand-copy">
          <p>ANALİZ · EĞİTİM · DANIŞMANLIK</p>
          <h1>Şifrenizi<br /><em>sıfırlayın.</em></h1>
          <span>E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</span>
        </div>
        <div className="auth-security"><span><AuthIcon name="shield" size={21} /></span><div><strong>Güvenli sıfırlama</strong><small>Bağlantı yalnızca hesabınıza gönderilir.</small></div></div>
      </aside>

      <section className="auth-form-area">
        <div className="auth-form-inner">
          <header className="auth-login-header"><h2>Şifre<br /><span>sıfırlama.</span></h2><p>Hesabınıza bağlı e-posta adresine bir sıfırlama bağlantısı göndereceğiz.</p></header>

          {sent ? (
            <div style={{ display: "grid", gap: ".7rem", justifyItems: "center", textAlign: "center", padding: "1.4rem 0 .6rem" }}>
              <span style={{ width: 54, height: 54, display: "grid", placeItems: "center", borderRadius: "50%", background: "#e8f4f0", color: "#3a826c" }}><AuthIcon name="check" size={24} /></span>
              <strong style={{ color: "var(--navy)", fontSize: "1rem", letterSpacing: "-.01em" }}>Bağlantı gönderildi</strong>
              <p style={{ maxWidth: 320, margin: 0, color: "#758796", fontSize: ".72rem", lineHeight: 1.6 }}>
                <b style={{ color: "#3f556a" }}>{email}</b> adresine şifre sıfırlama bağlantısı gönderdik. Gelen kutunuzu ve spam klasörünüzü kontrol edin.
              </p>
            </div>
          ) : (
            <form className="auth-login-form auth-reset-form" onSubmit={handleSubmit} autoComplete="on" noValidate>
              <label className={`auth-field ${submitted && !emailValid ? "invalid" : ""}`}>
                <div>
                  <AuthIcon name="mail" size={16} />
                  <input name="reset-email" type="email" placeholder="E-posta adresi" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} aria-invalid={submitted && !emailValid} />
                </div>
                {submitted && !emailValid && <small>Geçerli bir e-posta adresi girin.</small>}
              </label>
              <button className="auth-primary-button" disabled={loading}>{loading ? <span className="login-loader" /> : <>Sıfırlama bağlantısı gönder <AuthIcon name="arrow" size={16} /></>}</button>
            </form>
          )}

          <div className="auth-form-footer">
            <div className="auth-divider"><span>veya</span></div>
            <p className="auth-switch-copy"><Link href="/giris">Giriş ekranına dön</Link></p>
          </div>
        </div>
      </section>
    </section>
    <p className="auth-page-note">© 2026 eistatistik · Güvenli müşteri platformu</p>
  </main>;
}
