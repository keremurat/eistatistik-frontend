"use client";

import { useState } from "react";

type LandingFaqProps = {
  items: Array<[string, string]>;
};

export function LandingFaq({ items }: LandingFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="landing-faq-list">
      {items.map(([question, answer], index) => {
        const isOpen = openIndex === index;
        const panelId = `landing-faq-panel-${index}`;

        return (
          <div className={`landing-faq-item${isOpen ? " open" : ""}`} key={question}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{question}</span>
              <i aria-hidden="true">+</i>
            </button>
            <div className="landing-faq-answer" id={panelId} role="region" aria-label={question}>
              <div><p>{answer}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
