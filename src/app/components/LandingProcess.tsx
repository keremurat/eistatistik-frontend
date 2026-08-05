"use client";

import { useEffect, useRef } from "react";

const steps = [
  { title: "İhtiyacınızı anlatın", body: "Hizmeti seçin, teslim beklentinizi belirtin ve çalışma dosyalarınızı güvenle yükleyin.", meta: "Hizmet · Dosyalar · Teslim", visual: "request" },
  { title: "Kapsam birlikte netleşsin", body: "Uzmanınız talebi incelesin, gerekli ayrıntıları sizinle görüşsün ve çalışma planını hazırlasın.", meta: "Uzman değerlendirmesi", visual: "review" },
  { title: "Süreci anlık takip edin", body: "Teklif, ödeme, mesaj, görüşme ve analiz aşamalarını aynı sipariş üzerinden izleyin.", meta: "Tek çalışma alanı", visual: "track" },
  { title: "Sonuçları güvenle teslim alın", body: "Rapor, sonuç dosyaları ve varsa videolu anlatım hesabınıza eklensin; ihtiyaç halinde ek analiz isteyin.", meta: "Rapor · Video · Ek analiz", visual: "result" },
];

export function LandingProcess() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".landing-process-card"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("visible", entry.isIntersecting)),
      { rootMargin: "-12% 0px -18% 0px", threshold: 0.28 },
    );
    cards.forEach((card) => observer.observe(card));

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
      </div>
    </section>
  );
}
