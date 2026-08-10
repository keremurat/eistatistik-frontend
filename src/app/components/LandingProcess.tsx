"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const steps = [
  {
    title: "Talep et",
    body: "Üyelik ile giriş yaparak size uygun analiz türünü seçip kolayca talep oluşturabilirsiniz. Size uygun teslim süresini ve sonuçlarınızı almak istediğiniz formatı belirleyebilirsiniz.",
    meta: "Hizmet · Dosyalar · Teslim",
    visual: "request",
  },
  {
    title: "Ücret belirlenmesi",
    body: "İsteklerinizi ayrıntılı biçimde inceliyor, çalışma kapsamını sizinle görüşüyor ve alanınıza uygun uzmanla eşleştiriyoruz. Hazırlanan fiyat teklifini hesabınız ve e-posta üzerinden iletiyoruz.",
    meta: "Uzman değerlendirmesi",
    visual: "review",
  },
  {
    title: "Analiz süreci",
    body: "Onayınızın ardından belirlediğiniz çalışma takvimi başlar. Analizleriniz, alanında uzman ekibimiz tarafından hazırlanır ve süreç boyunca hesabınızdan takip edilebilir.",
    meta: "Planlanan çalışma",
    visual: "track",
  },
  {
    title: "Rapor teslimi",
    body: "Raporunuzu seçtiğiniz süre içinde, talep ettiğiniz tablo, yorum ve grafik formatlarıyla hesabınıza teslim ediyoruz.",
    meta: "Rapor · Tablo · Video",
    visual: "result",
  },
  {
    title: "Ücretsiz ek analiz talebi",
    body: "Teslim edilen raporu inceledikten sonra ihtiyaç duyduğunuz tamamlayıcı analizleri siparişiniz üzerinden ek analiz talebi olarak iletebilirsiniz.",
    meta: "Teslim sonrası destek",
    visual: "request",
  },
  {
    title: "Sürekli iletişim",
    body: "Analiz talebinizden tez veya makale sürecinizin tamamlanmasına kadar ekibimize yazışma ve görüşme araçları üzerinden ulaşabilirsiniz.",
    meta: "Yazışma · Görüşme",
    visual: "review",
  },
];

export function LandingProcess() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".landing-process-card"));
    const track = section.querySelector<HTMLElement>(".landing-process-track");
    const line = section.querySelector<HTMLElement>(".landing-process-line");
    const end = section.querySelector<HTMLElement>(".landing-process-end");
    const endNode = section.querySelector<HTMLElement>(".landing-process-end-node");
    const revealCard = (card: Element) => card.classList.add("visible");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      cards.forEach(revealCard);
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (reduceMotion) return;
        entry.target.classList.toggle("visible", entry.isIntersecting);
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    cards.forEach((card) => observer.observe(card));

    const alignLineWithEndNode = () => {
      if (!track || !line || !end || !endNode) return;
      const endPoint = end.offsetTop + endNode.offsetTop + endNode.offsetHeight / 2;
      line.style.bottom = `${Math.max(0, track.clientHeight - endPoint)}px`;
    };
    const lineResizeObserver = new ResizeObserver(alignLineWithEndNode);
    if (track) lineResizeObserver.observe(track);
    if (end) lineResizeObserver.observe(end);
    if (endNode) lineResizeObserver.observe(endNode);
    alignLineWithEndNode();

    // Anchor navigation and restored scroll positions can happen before the
    // observer's first delivery. Reveal cards already inside the viewport.
    window.requestAnimationFrame(() => {
      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) revealCard(card);
      });
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const start = window.innerHeight * 0.62;
      const distance = bounds.height - window.innerHeight * 0.35;
      const progress = Math.min(1, Math.max(0, (start - bounds.top) / Math.max(distance, 1)));
      section.style.setProperty("--process-progress", String(progress));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      lineResizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="landing-process" id="process" ref={sectionRef}>
      <div className="landing-process-aura" aria-hidden="true" />
      <header className="landing-process-heading">
        <p className="landing-kicker">NASIL ÇALIŞIR?</p>
        <h2>Talebinizden teslimata, görünür bir süreç.</h2>
        <p>Her adım kayıt altında; siz her zaman nerede olduğunuzu bilirsiniz.</p>
      </header>
      <div className="landing-process-track">
        <div className="landing-process-line" aria-hidden="true"><i /></div>
        {steps.map((step, index) => (
          <article className={`landing-process-card ${index % 2 ? "process-right" : "process-left"}`} key={step.title}>
            <span className="landing-process-node">{String(index + 1).padStart(2, "0")}</span>
            <div className="landing-process-content">
              <small>{step.meta}</small>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <div className={`landing-process-visual visual-${step.visual}`} aria-hidden="true">
                <span /><span /><span /><span />
              </div>
            </div>
          </article>
        ))}
        <footer className="landing-process-end">
          <span className="landing-process-end-node" aria-hidden="true">07</span>
          <p className="landing-kicker">BAŞLAYALIM</p>
          <h3>Çalışmanızın ilk adımını birlikte atalım.</h3>
          <p>İhtiyacınızı birkaç adımda anlatın; uzman ekibimiz talebinizi inceleyip sizinle iletişime geçsin.</p>
          <Link href="/giris">
            Analiz talebi oluştur
            <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
