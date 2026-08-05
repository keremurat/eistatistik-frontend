"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TemplateScope = "order" | "education";

const templates: Record<TemplateScope, { title: string; category: string; content: string }[]> = {
  order: [
    { title: "Dosya kontrolü", category: "DOSYALAR", content: "Merhaba, çalışmanıza ait dosyaları inceledik. Analiz sürecine devam edebilmemiz için eksik veya güncel dosyaları Sipariş Kalemleri bölümüne yüklemenizi rica ederiz." },
    { title: "Ödeme hatırlatması", category: "ÖDEME", content: "Merhaba, siparişinize ait ücret teklifi hazırlanmıştır. Analiz sürecinin başlayabilmesi için Ödeme bölümündeki adımları tamamlamanızı rica ederiz." },
    { title: "Görüşme bilgilendirmesi", category: "GÖRÜŞME", content: "Merhaba, çalışmanızla ilgili görüşme planlanmıştır. Tarih ve bağlantı bilgilerine Randevu/Görüşme bölümünden ulaşabilirsiniz." },
    { title: "Teslimat bilgilendirmesi", category: "TESLİMAT", content: "Merhaba, analiz çalışmanız tamamlanmıştır. Teslim edilen dosyalara Analiz Sonuçları bölümünden ulaşabilirsiniz." },
  ],
  education: [
    { title: "Ödeme hatırlatması", category: "ÖDEME", content: "Merhaba, eğitim kaydınıza ait ödeme henüz tamamlanmamıştır. Eğitime erişebilmek için Ödeme İşlemleri bölümündeki adımları tamamlamanızı rica ederiz." },
    { title: "Erişim bilgilendirmesi", category: "ERİŞİM", content: "Merhaba, eğitim içeriklerine erişiminiz açılmıştır. Dersleri Eğitim İçerikleri bölümünden görüntüleyebilirsiniz." },
    { title: "Program başlangıcı", category: "EĞİTİM", content: "Merhaba, eğitim programınız başlamıştır. Ders içerikleri ve dokümanlar hesabınıza tanımlanmıştır. İyi çalışmalar dileriz." },
    { title: "Belge bilgilendirmesi", category: "BELGE", content: "Merhaba, eğitim belgeniz hazırlanmıştır. İlgili dosyaya eğitim detay sayfasından ulaşabilirsiniz." },
  ],
};

export function MessageTemplatePicker({ scope = "order", onSelect }: { scope?: TemplateScope; onSelect: (content: string) => void }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 310 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(340, window.innerWidth - 24);
      const menuHeight = menuRef.current?.offsetHeight ?? 280;
      const top = window.innerHeight - rect.bottom < menuHeight ? Math.max(12, rect.top - menuHeight - 6) : rect.bottom + 6;
      const left = Math.min(Math.max(12, rect.right - width), window.innerWidth - width - 12);
      setPosition({ top, left, width });
    };
    const close = (event: MouseEvent) => {
      const node = event.target as Node;
      if (!buttonRef.current?.contains(node) && !menuRef.current?.contains(node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [open]);

  return <>
    <button ref={buttonRef} className={`message-template-trigger${open ? " active" : ""}`} type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h5"/></svg>
      Mesaj şablonları
    </button>
    {open && typeof document !== "undefined" && createPortal(<div ref={menuRef} className="message-template-menu" role="menu" aria-label="Mesaj şablonları" style={{ position: "fixed", top: position.top, left: position.left, width: position.width, zIndex: 10000 }}>
      <header><div><span>HAZIR YANITLAR</span><strong>Mesaj şablonları</strong></div><small>{templates[scope].length} şablon</small></header>
      <div>{templates[scope].map(template => <button key={template.title} type="button" role="menuitem" onClick={() => { onSelect(template.content); setOpen(false); }}><span>{template.category}</span><strong>{template.title}</strong><p>{template.content}</p></button>)}</div>
      <footer>Şablonu seçtikten sonra metni düzenleyebilirsiniz.</footer>
    </div>, document.body)}
  </>;
}
