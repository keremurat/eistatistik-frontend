"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type ToastTone = "success" | "error" | "warning" | "info";
type ToastItem = { id: number; message: string; tone: ToastTone; leaving: boolean };
type ToastApi = {
  show: (message: string, tone?: ToastTone, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

function ToastIcon({ tone }: { tone: ToastTone }) {
  if (tone === "success") return <path d="m5 12 4 4L19 6" />;
  if (tone === "info") return <><path d="M12 11v5" /><path d="M12 8h.01" /></>;
  return <><path d="M12 8v5" /><path d="M12 16h.01" /></>;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, leaving: true } : item));
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 260);
  }, []);

  const show = useCallback((message: string, tone: ToastTone = "info", duration = 3000) => {
    const id = ++counter.current;
    setItems((current) => [...current.slice(-2), { id, message, tone, leaving: false }]);
    timers.current.set(id, setTimeout(() => dismiss(id), duration));
  }, [dismiss]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach((timer) => clearTimeout(timer));
  }, []);

  const api: ToastApi = {
    show,
    success: (message, duration) => show(message, "success", duration),
    error: (message, duration) => show(message, "error", duration),
    warning: (message, duration) => show(message, "warning", duration),
    info: (message, duration) => show(message, "info", duration),
  };

  return <ToastContext.Provider value={api}>
    {children}
    <section className="toast-viewport" aria-label="Bildirimler" aria-live="polite" aria-atomic="false">
      {items.map((item) => <article className={`app-toast ${item.tone}${item.leaving ? " leaving" : ""}`} role={item.tone === "error" ? "alert" : "status"} key={item.id}>
        <span className="app-toast-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><ToastIcon tone={item.tone} /></svg></span>
        <p>{item.message}</p>
        <button type="button" onClick={() => dismiss(item.id)} aria-label="Bildirimi kapat">×</button>
      </article>)}
    </section>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
