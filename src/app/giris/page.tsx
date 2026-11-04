"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError, landingForRole, loginUser, registerUser } from "@/lib/api/auth";

type IconName = "arrow" | "eye" | "eyeOff" | "lock" | "mail" | "shield" | "user";
type LegalDocument = "membership" | "kvkk";
type RegisterField = "firstName" | "lastName" | "email" | "password" | "confirm";
type RegisterErrors = Partial<Record<RegisterField, string>>;

function AuthIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a15 15 0 0 1-2.2 2.8M6.2 6.2C3.4 8 2 12 2 12s3.5 6 10 6a10 10 0 0 0 4.1-.8" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [hasNavigated, setHasNavigated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState("");
  const [register, setRegister] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [registrationCompleteEmail, setRegistrationCompleteEmail] = useState("");
  const [membershipAccepted, setMembershipAccepted] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [legalDocument, setLegalDocument] = useState<LegalDocument | null>(null);
  const isRegister = mode === "register";

  function changeMode(next: "login" | "register") {
    if (next === mode) return;
    setHasNavigated(true);
    setMode(next);
    setSubmitted(false);
    setShowPassword(false);
    setAuthError("");
    setRegisterErrors({});
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setAuthError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.email) || !login.password) return;

    setLoading(true);

    try {
      const user = await loginUser({
        email: login.email,
        password: login.password,
        rememberMe,
      });
      router.replace(user.homePath || landingForRole(user.role));
      router.refresh();
    } catch (error) {
      setAuthError(
        error instanceof ApiRequestError && error.code === "invalid_credentials"
          ? "E-posta veya şifre hatalı. Bilgilerinizi kontrol edip tekrar deneyin."
          : "Giriş şu anda tamamlanamadı. Lütfen biraz sonra tekrar deneyin.",
      );
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setAuthError("");

    const errors: RegisterErrors = {};
    if (!register.firstName.trim()) errors.firstName = "Adınızı girin.";
    if (!register.lastName.trim()) errors.lastName = "Soyadınızı girin.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(register.email)) errors.email = "Geçerli bir e-posta adresi girin.";
    if (register.password.length < 12) errors.password = "Şifreniz en az 12 karakter olmalı.";
    if (register.password !== register.confirm) errors.confirm = "Şifreler birbiriyle eşleşmiyor.";
    setRegisterErrors(errors);

    if (Object.keys(errors).length > 0 || !membershipAccepted || !kvkkAccepted) return;

    setLoading(true);

    try {
      const user = await registerUser({
        firstName: register.firstName,
        lastName: register.lastName,
        email: register.email,
        password: register.password,
        passwordConfirmation: register.confirm,
        membershipTermsAccepted: membershipAccepted,
        kvkkNoticeAccepted: kvkkAccepted,
      });
      setRegistrationCompleteEmail(user.email);
    } catch (error) {
      if (error instanceof ApiRequestError && error.code === "validation_failed") {
        setRegisterErrors(registrationErrorsFrom(error.fields));
        setAuthError("Bazı bilgileri düzelttikten sonra tekrar deneyin.");
      } else if (error instanceof ApiRequestError && error.code === "legal_acceptance_required") {
        setAuthError("Devam etmek için güncel üyelik ve KVKK metinlerini kabul etmelisiniz.");
      } else {
        setAuthError("Kayıt şu anda tamamlanamadı. Lütfen biraz sonra tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page">
    <section className="auth-card">
      <aside className={`auth-brand-panel ${hasNavigated ? (isRegister ? "move-right" : "move-left") : isRegister ? "at-right" : ""}`}>
        <span className="auth-brand-art" aria-hidden="true" />
        <Link href="/" className="auth-logo-shortcut" aria-label="eistatistik landing page'e dön">
          <span className="auth-back-home" aria-hidden="true">←</span>
          <Image className="auth-logo-white" src="/Beyaz e-istatistik.png" alt="eistatistik" width={300} height={69} priority />
        </Link>
        <div className="auth-brand-copy">
          <p>ANALİZ · EĞİTİM · DANIŞMANLIK</p>
          <h1>{isRegister ? <>Çalışma alanınızı<br /><em>bugün oluşturun.</em></> : <>Akademik sürecinize<br /><em>hoş geldiniz.</em></>}</h1>
          <span>{isRegister ? "Analizlerinizi, görüşmelerinizi ve eğitimlerinizi tek hesap üzerinden yönetin." : "Siparişlerinizi takip edin, uzmanınızla görüşün ve eğitimlerinize devam edin."}</span>
        </div>
        <div className="auth-security"><span><AuthIcon name="shield" size={21} /></span><div><strong>Güvenli müşteri alanı</strong><small>Verileriniz şifreli bağlantıyla korunur.</small></div></div>
      </aside>

      <section className={`auth-form-area ${isRegister ? "show-register" : ""}`}>
        <div className="auth-form-inner">
          {!isRegister ? <>
            <header className="auth-login-header"><h2>Tekrar<br /><span>hoş geldiniz.</span></h2><p>Hesabınıza giriş yapın ve çalışmalarınıza devam edin.</p></header>
            <form className="auth-login-form" onSubmit={handleLogin} autoComplete="on" noValidate>
              <AuthField name="login-email" autoComplete="section-login username" icon="mail" type="email" placeholder="E-posta adresi" value={login.email} onChange={value => { setLogin(current => ({ ...current, email: value })); setAuthError(""); }} invalid={submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.email)} error="Geçerli bir e-posta adresi girin." />
              <AuthField name="login-password" autoComplete="section-login current-password" icon="lock" type={showPassword ? "text" : "password"} placeholder="Şifre" value={login.password} onChange={value => { setLogin(current => ({ ...current, password: value })); setAuthError(""); }} invalid={submitted && !login.password} error="Şifrenizi girin." action={<button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}><AuthIcon name={showPassword ? "eyeOff" : "eye"} size={16} /></button>} />
              {authError && <p className="auth-error" role="alert">{authError}</p>}
              <div className="auth-form-options"><label><input type="checkbox" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} />Beni hatırla</label><Link href="/sifre-sifirlama">Şifremi unuttum</Link></div>
              <button className="auth-primary-button" disabled={loading}>{loading ? <span className="login-loader" /> : <>Giriş yap <AuthIcon name="arrow" size={16} /></>}</button>
            </form>
            <div className="auth-form-footer">
              <div className="auth-divider"><span>veya</span></div>
              <button className="auth-google" type="button"><GoogleIcon />Google ile devam et</button>
              <p className="auth-switch-copy">Hesabınız yok mu? <button onClick={() => changeMode("register")}>Hemen kaydolun</button></p>
            </div>
          </> : registrationCompleteEmail ? <div className="auth-reset-success" role="status">
            <span className="auth-reset-success-icon" aria-hidden="true">✓</span>
            <strong className="auth-reset-success-title">Doğrulama e-postası gönderildi</strong>
            <p className="auth-reset-success-copy"><b>{registrationCompleteEmail}</b> adresine gönderdiğimiz bağlantıyı açarak hesabınızı doğrulayın. E-postayı doğruladıktan sonra giriş yapabilirsiniz.</p>
            <button className="auth-primary-button" type="button" onClick={() => changeMode("login")}>Giriş ekranına dön <AuthIcon name="arrow" size={16} /></button>
          </div> : <>
            <header className="auth-register-header"><h2>Hesap<br /><span>oluşturun.</span></h2><p>Birkaç adımda eistatistik çalışma alanınıza katılın.</p></header>
            <form className="auth-register-form" onSubmit={handleRegister} autoComplete="on" noValidate>
              <div className="auth-field-row">
                <AuthField name="given-name" autoComplete="section-register given-name" icon="user" placeholder="Adınızı girin" value={register.firstName} onChange={value => { setRegister(current => ({ ...current, firstName: value })); clearRegisterError("firstName", setRegisterErrors); }} invalid={Boolean(registerErrors.firstName)} error={registerErrors.firstName} />
                <AuthField name="family-name" autoComplete="section-register family-name" icon="user" placeholder="Soyadınızı girin" value={register.lastName} onChange={value => { setRegister(current => ({ ...current, lastName: value })); clearRegisterError("lastName", setRegisterErrors); }} invalid={Boolean(registerErrors.lastName)} error={registerErrors.lastName} />
              </div>
              <AuthField name="register-email" autoComplete="section-register email" icon="mail" type="email" placeholder="E-posta adresinizi girin" value={register.email} onChange={value => { setRegister(current => ({ ...current, email: value })); clearRegisterError("email", setRegisterErrors); }} invalid={Boolean(registerErrors.email)} error={registerErrors.email} />
              <div className="auth-field-row">
                <AuthField name="new-password" autoComplete="section-register new-password" icon="lock" type="password" placeholder="En az 12 karakter" value={register.password} onChange={value => { setRegister(current => ({ ...current, password: value })); clearRegisterError("password", setRegisterErrors); }} invalid={Boolean(registerErrors.password)} error={registerErrors.password} />
                <AuthField name="confirm-password" autoComplete="section-register new-password" icon="lock" type="password" placeholder="Şifreyi tekrar girin" value={register.confirm} onChange={value => { setRegister(current => ({ ...current, confirm: value })); clearRegisterError("confirm", setRegisterErrors); }} invalid={Boolean(registerErrors.confirm)} error={registerErrors.confirm} />
              </div>
              <div className="auth-legal-consents">
                <button type="button" className={submitted && !membershipAccepted ? "invalid" : ""} onClick={() => setLegalDocument("membership")}><span className={membershipAccepted ? "accepted" : ""}>{membershipAccepted ? "✓" : ""}</span><strong><u>Üyelik Sözleşmesi</u> şartlarını okudum ve kabul ediyorum.</strong></button>
                <button type="button" className={submitted && !kvkkAccepted ? "invalid" : ""} onClick={() => setLegalDocument("kvkk")}><span className={kvkkAccepted ? "accepted" : ""}>{kvkkAccepted ? "✓" : ""}</span><strong><u>KVKK Aydınlatma Metni</u>’ni okudum ve kabul ediyorum.</strong></button>
              </div>
              {authError && <p className="auth-error" role="alert">{authError}</p>}
              <button className="auth-primary-button" disabled={loading}>{loading ? <span className="login-loader" /> : <>Kayıt ol <AuthIcon name="arrow" size={16} /></>}</button>
            </form>
            <div className="auth-form-footer">
              <div className="auth-divider"><span>veya</span></div>
              <button className="auth-google" type="button"><GoogleIcon />Google ile kayıt ol</button>
              <p className="auth-switch-copy register">Zaten hesabınız var mı? <button onClick={() => changeMode("login")}>Giriş yapın</button></p>
            </div>
          </>}
        </div>
      </section>
    </section>
    <p className="auth-page-note">© 2026 eistatistik · Güvenli müşteri platformu</p>
    {legalDocument && <LegalModal key={legalDocument} document={legalDocument} onClose={() => setLegalDocument(null)} onAccept={() => {
      if (legalDocument === "membership") {
        setMembershipAccepted(true);
        setLegalDocument("kvkk");
      } else {
        setKvkkAccepted(true);
        setLegalDocument(null);
      }
    }} />}
  </main>;
}

function registrationErrorsFrom(fields?: Record<string, string[]>): RegisterErrors {
  if (!fields) return {};

  const hasError = (...keys: string[]) => keys.some(key => (fields[key]?.length ?? 0) > 0);
  const errors: RegisterErrors = {};

  if (hasError("first_name", "profile.first_name", "profile_first_name")) errors.firstName = "Ad bilgisi geçerli değil.";
  if (hasError("last_name", "profile.last_name", "profile_last_name", "profile")) errors.lastName = "Soyad bilgisi geçerli değil.";
  if (hasError("email")) errors.email = "Bu e-posta adresi kullanılamıyor veya zaten kayıtlı.";
  if (hasError("password")) errors.password = "Şifre en az 12 karakter olmalı.";
  if (hasError("password_confirmation")) errors.confirm = "Şifreler birbiriyle eşleşmiyor.";

  return errors;
}

function clearRegisterError(
  field: RegisterField,
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrors>>,
) {
  setErrors(current => {
    if (!current[field]) return current;

    const next = { ...current };
    delete next[field];
    return next;
  });
}

function AuthField({ name, autoComplete, icon, type = "text", placeholder, value, onChange, invalid = false, error, action }: { name: string; autoComplete: string; icon: IconName; type?: string; placeholder: string; value: string; onChange: (value: string) => void; invalid?: boolean; error?: string; action?: React.ReactNode }) {
  return <label className={`auth-field ${invalid ? "invalid" : ""}`}><div><AuthIcon name={icon} size={16} /><input name={name} type={type} placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} inputMode={type === "email" ? "email" : undefined} autoCapitalize={type === "email" || type === "password" ? "none" : "words"} spellCheck={type === "email" || type === "password" ? false : undefined} aria-invalid={invalid} />{action}</div>{invalid && error && <small>{error}</small>}</label>;
}

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.3-4.8 3.3-8.2Z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2V17A11 11 0 0 0 12 23Z" /><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.2A11 11 0 0 0 1 12c0 1.8.4 3.5 1.2 4.9l3.6-2.8Z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.5 4.2 1.6l3.2-3.1A10.6 10.6 0 0 0 12 1a11 11 0 0 0-9.8 6.1l3.6 2.8c.9-2.6 3.3-4.5 6.2-4.5Z" /></svg>;
}

function LegalModal({ document, onClose, onAccept }: { document: LegalDocument; onClose: () => void; onAccept: () => void }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const title = document === "membership" ? "Üyelik Sözleşmesi" : "KVKK Aydınlatma Metni";

  useEffect(() => {
    let active = true;
    fetch(document === "membership" ? "/legal/uyelik-sozlesmesi.txt" : "/legal/kvkk-aydinlatma-metni.txt")
      .then(response => response.text())
      .then(text => { if (active) { setContent(text); setLoading(false); } });
    return () => { active = false; };
  }, [document]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function handleScroll() {
    const element = contentRef.current;
    if (!element) return;

    const scrollableDistance = element.scrollHeight - element.clientHeight;
    const progress = scrollableDistance <= 0
      ? 100
      : Math.min(100, Math.max(0, (element.scrollTop / scrollableDistance) * 100));

    setScrollProgress(progress);
    if (progress >= 99 || scrollableDistance <= 0) setReachedEnd(true);
  }

  return <div className="legal-modal-backdrop" role="presentation">
    <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
      <header><div><p>ONAYLANMASI GEREKEN BELGE</p><h2 id="legal-modal-title">{title}</h2></div><button onClick={onClose} aria-label="Pencereyi kapat">×</button></header>
      <div
        className="legal-scroll-progress"
        role="progressbar"
        aria-label={`${title} okuma ilerlemesi`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollProgress)}
      >
        <span style={{ width: `${scrollProgress}%` }} />
      </div>
      <div className="legal-document-content" ref={contentRef} onScroll={handleScroll} tabIndex={0}>
        {loading ? <div className="legal-loading"><span className="login-loader" />Belge yükleniyor…</div> : <pre>{content}</pre>}
      </div>
      <footer><div><AuthIcon name="shield" size={18} /><span>{reachedEnd ? "Belgenin sonuna ulaştınız." : "Kabul edebilmek için belgenin sonuna kadar ilerleyin."}</span></div><div><button className="legal-cancel" onClick={onClose}>Vazgeç</button><button className="legal-accept" onClick={onAccept} disabled={!reachedEnd}>Okudum ve kabul ediyorum</button></div></footer>
    </section>
  </div>;
}
