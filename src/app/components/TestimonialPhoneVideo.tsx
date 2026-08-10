"use client";

import { useEffect, useRef, useState } from "react";

export function TestimonialPhoneVideo() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const phone = phoneRef.current;
    if (!phone) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.35 });

    observer.observe(phone);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-testimonial-video" ref={phoneRef}>
      <span className="testimonial-phone-button phone-silent" aria-hidden="true" />
      <span className="testimonial-phone-button phone-volume-up" aria-hidden="true" />
      <span className="testimonial-phone-button phone-volume-down" aria-hidden="true" />
      <span className="testimonial-phone-button phone-power" aria-hidden="true" />
      <div className="testimonial-phone-screen">
        {visible ? (
          <iframe
            src="https://www.youtube-nocookie.com/embed/HN2KNjCArLA?autoplay=1&mute=1&playsinline=1&rel=0"
            title="Eİstatistik kullanıcı deneyimi"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : <div className="testimonial-phone-poster" aria-label="Video yorum yükleniyor" />}
        <span className="testimonial-phone-island" aria-hidden="true"><i /></span>
        <span className="testimonial-phone-home" aria-hidden="true" />
      </div>
    </div>
  );
}
