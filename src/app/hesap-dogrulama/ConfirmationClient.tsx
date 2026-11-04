"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApiRequestError, confirmAccount } from "@/lib/api/auth";

type Status = "idle" | "loading" | "success" | "error";
type IconName = "check" | "shield" | "x";

function AuthIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    check: <path d="m5 12 4 4L19 6" />,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    x: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function ConfirmationClient() {
  const searchParams = useSearchParams();
  const confirmationToken = searchParams.get("confirmation_token");
  const [status, setStatus] = useState<Status>(confirmationToken ? "idle" : "error");
  const [message, setMessage] = useState(
    confirmationToken ? "" : "Doğrulama bağlantısında gerekli token bulunamadı.",
  );

  async function handleConfirmation() {
    if (!confirmationToken || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      await confirmAccount(confirmationToken);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof ApiRequestError && error.code === "invalid_confirmation_token"
          ? "Bu doğrulama bağlantısı geçersiz, daha önce kullanılmış veya süresi dolmuş."
          : "Doğrulama şu anda tamamlanamadı. Lütfen daha sonra tekrar deneyin.",
      );
    }
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
          <h1>Hesabınızı<br /><em>etkinleştirin.</em></h1>
          <span>E-posta adresinizi doğrulayın ve güvenli çalışma alanınıza erişin.</span>
        </div>
        <div className="auth-security"><span><AuthIcon name="shield" size={21} /></span><div><strong>Tek kullanımlık bağlantı</strong><small>Doğrulama bağlantısı 3 gün boyunca geçerlidir.</small></div></div>
      </aside>

      <section className="auth-form-area">
        <div className="auth-form-inner">
          <header className="auth-login-header"><h2>E-posta<br /><span>doğrulama.</span></h2><p>Hesabınızı etkinleştirmek için aşağıdaki işlemi onaylayın.</p></header>

          {status === "success" ? (
            <div className="auth-reset-success auth-confirmation-panel" role="status">
              <span className="auth-reset-success-icon"><AuthIcon name="check" size={24} /></span>
              <strong className="auth-reset-success-title">Hesabınız doğrulandı</strong>
              <p className="auth-reset-success-copy">Artık e-posta adresiniz ve parolanızla güvenli çalışma alanınıza giriş yapabilirsiniz.</p>
              <Link className="auth-primary-button" href="/giris">Giriş ekranına git</Link>
            </div>
          ) : status === "error" ? (
            <div className="auth-reset-success auth-confirmation-panel error" role="alert">
              <span className="auth-reset-success-icon"><AuthIcon name="x" size={24} /></span>
              <strong className="auth-reset-success-title">Doğrulama tamamlanamadı</strong>
              <p className="auth-reset-success-copy">{message}</p>
              <Link className="auth-primary-button" href="/giris">Giriş ve kayıt ekranına dön</Link>
            </div>
          ) : (
            <div className="auth-confirmation-panel" role="status" aria-live="polite">
              <span className="auth-reset-success-icon"><AuthIcon name="shield" size={24} /></span>
              <strong className="auth-reset-success-title">E-posta adresinizi doğrulayın</strong>
              <p className="auth-reset-success-copy">Bu işlem hesabınızı etkinleştirir. Bağlantı yalnızca bir kez kullanılabilir.</p>
              <button className="auth-primary-button" type="button" disabled={status === "loading"} onClick={handleConfirmation}>
                {status === "loading" ? <span className="login-loader" /> : "E-posta adresimi doğrula"}
              </button>
            </div>
          )}
        </div>
      </section>
    </section>
    <p className="auth-page-note">© 2026 eistatistik · Güvenli müşteri platformu</p>
  </main>;
}
