"use client";

import { useState } from "react";
import { LandingFaq } from "./LandingFaq";

type TabKey = "content" | "faq" | "gallery";

type Props = {
  content: string[];
  materials: string[];
  faqs: Array<[string, string]>;
  gallery: string[];
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "content", label: "Eğitim İçeriği ve Materyalleri" },
  { key: "faq", label: "Sıkça Sorulan Sorular" },
  { key: "gallery", label: "Galeri" },
];

export function EduDetailTabs({ content, materials, faqs, gallery }: Props) {
  const [tab, setTab] = useState<TabKey>("content");

  return (
    <section className="edu-detail-tabs">
      <nav className="edu-tab-nav" role="tablist" aria-label="Eğitim bilgileri">
        {tabs.map((item) => (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={tab === item.key}
            className={tab === item.key ? "active" : ""}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="edu-tab-panel" role="tabpanel">
        {tab === "content" && (
          <div className="edu-content-cols">
            <div>
              <h3>Eğitim içeriği</h3>
              <ul className="edu-check-list">{content.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3>Eğitim materyalleri</h3>
              <ul className="edu-check-list">{materials.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        )}

        {tab === "faq" && <LandingFaq items={faqs} />}

        {tab === "gallery" && (
          <div className="edu-gallery-grid">
            {gallery.map((code) => (
              <div className="edu-gallery-item" key={code}>
                <iframe
                  src={`https://www.instagram.com/p/${code}/embed`}
                  title="Instagram gönderisi"
                  loading="lazy"
                  scrolling="no"
                  allowTransparency
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
