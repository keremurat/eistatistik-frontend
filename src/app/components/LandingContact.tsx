import { GMAIL_CONTACT_URL } from "../lib/contact";

type ContactIconName = "clock" | "location" | "phone";

function ContactIcon({ name }: { name: ContactIconName }) {
  const paths: Record<ContactIconName, React.ReactNode> = {
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" /></>,
  };

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function LandingContact() {
  return (
    <section className="landing-contact" id="iletisim" aria-labelledby="contact-details-title">
      <div className="contact-details">
        <header>
          <p className="analysis-eyebrow">İLETİŞİM</p>
          <h2 id="contact-details-title">Mesai saatlerinde bize ulaşın.</h2>
          <p>Hizmet, süreç veya çalışma alanınızla ilgili sorularınız için telefon, e-posta ya da sosyal medya üzerinden ekibimizle iletişime geçebilirsiniz.</p>
        </header>

        <div className="contact-details-grid">
          <article className="contact-hours">
            <span><ContactIcon name="clock" /></span>
            <div><h3>Çalışma saatleri</h3><p>Hafta içi</p><strong>09:00 - 18:00</strong><p>Cumartesi</p><strong>09:00 - 14:00</strong></div>
          </article>

          <div className="contact-detail-stack">
            <address>
              <span><ContactIcon name="location" /></span>
              <div><h3>Adres</h3><p>Ondokuz Mayıs Üniversitesi<br />Teknopark, Kurupelit Yerleşkesi<br />55139 Atakum/Samsun</p></div>
              <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x40887f008eeee8b5:0x799cc17acd8132a3?sa=X&ved=1t:8290&ictx=111" target="_blank" rel="noopener noreferrer">Yol tarifi <span aria-hidden="true">→</span></a>
            </address>

            <article className="contact-channels">
              <span><ContactIcon name="phone" /></span>
              <div><h3>Telefon ve e-posta</h3><a href="tel:+908508851256">0 (850) 885 12 56</a><a href="tel:+905386150444">0 (538) 615 04 44</a><a href={GMAIL_CONTACT_URL} target="_blank" rel="noopener noreferrer">info@eistatistik.com</a></div>
              <nav aria-label="Sosyal medya hesapları"><a className="contact-social-icon" href="https://www.instagram.com/eistatistik/" target="_blank" rel="noopener noreferrer" aria-label="eistatistik Instagram hesabı"><InstagramIcon /></a><a href="https://x.com/naci_murat" target="_blank" rel="noopener noreferrer">X</a></nav>
            </article>
          </div>
        </div>
      </div>

      <div className="contact-map">
        <iframe
          title="eistatistik Atakum ofisi haritası"
          src="https://maps.google.com/maps?q=EISTATISTIK%2C%20Ondokuz%20May%C4%B1s%20%C3%9Cniversitesi%2C%20Teknopark%2C%20Kurupelit%20Yerle%C5%9Fkesi%2C%2055139%20Atakum%2FSamsun&t=m&z=16&output=embed&iwloc=near"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
