"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError, AuthenticatedUser, getCurrentUser, landingForRole } from "@/lib/api/auth";

const CustomerSessionContext = createContext<AuthenticatedUser | null>(null);

export function useCustomerSession() {
  return useContext(CustomerSessionContext);
}

export function CustomerSessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "error">("loading");
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then(currentUser => {
        if (!active) return;
        if (!currentUser) {
          router.replace("/giris");
          return;
        }

        if (currentUser.role && currentUser.role !== "musteri") {
          router.replace(currentUser.homePath || landingForRole(currentUser.role));
          return;
        }
        setUser(currentUser);
        setStatus("authenticated");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStatus("error");
        if (error instanceof ApiRequestError) return;
      });

    return () => { active = false; };
  }, [attempt, router]);

  if (status === "loading") {
    return <main className="auth-page" aria-busy="true"><section className="auth-card auth-session-state"><span className="login-loader" /><p>Oturumunuz kontrol ediliyor…</p></section></main>;
  }

  if (status === "error") {
    return <main className="auth-page"><section className="auth-card auth-session-state" role="alert"><strong>Oturum kontrolü tamamlanamadı</strong><p>Bağlantınızı kontrol edip yeniden deneyin.</p><button className="auth-primary-button" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }}>Yeniden dene</button></section></main>;
  }

  return <CustomerSessionContext.Provider value={user}>{children}</CustomerSessionContext.Provider>;
}
