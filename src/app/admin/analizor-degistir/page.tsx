"use client";

import { useState } from "react";
import { AdminShell } from "../AdminShell";
import { SystemDropdown } from "../../components/SystemDropdown";

const analysts = [
  "NACİ MURAT",
  "ALİİHSAN ŞÜKÜR",
  "MEHMET MEŞE",
  "eistatistik ANALİZÖR",
  "RABİA AKTAŞ",
  "FATİH AKAR",
  "KAAN KARAKAYA",
  "eistatistik Genel Analizör",
  "YASİN YILDIRIM",
  "ERTUĞRUL 2 GÜMÜŞSU",
];

function ChevronIcon({ up }: { up: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, transform: up ? "rotate(180deg)" : undefined, transition: ".15s" }}
      aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function AnalizorDegistirPage() {
  const [fromAnalyst, setFromAnalyst] = useState<string | null>(null);
  const [toAnalyst,   setToAnalyst]   = useState("");
  const [fromOpen,    setFromOpen]    = useState(false);
  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState<"idle" | "done">("idle");

  const filtered    = analysts.filter((a) =>
    a.toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr"))
  );
  const targetList  = analysts.filter((a) => a !== fromAnalyst);
  const canTransfer = fromAnalyst && toAnalyst;

  function transfer() {
    if (!canTransfer) return;
    setStatus("done");
    setTimeout(() => setStatus("idle"), 2800);
  }

  function selectFrom(name: string) {
    setFromAnalyst(name);
    setFromOpen(false);
    setSearch("");
    if (toAnalyst === name) setToAnalyst("");
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Sipariş Analizör Değiştir</h1>
            <p>Bir analizörün tüm siparişlerini seçeceğiniz başka bir analizöre aktarın.</p>
          </div>
        </header>

        <section className="detail-panel adc-card">
          <div className="adc-layout">

            {/* Sol — kaynak analizör */}
            <div className="adc-from-wrap">
              <button
                className={`adc-trigger${fromOpen ? " open" : ""}`}
                onClick={() => setFromOpen((o) => !o)}
                aria-expanded={fromOpen}
                aria-haspopup="listbox"
              >
                <span className={fromAnalyst ? "adc-selected-label" : "adc-placeholder"}>
                  {fromAnalyst ?? "Analizör Seçiniz"}
                </span>
                <ChevronIcon up={fromOpen} />
              </button>

              {fromOpen && (
                <div className="adc-panel" role="listbox" aria-label="Kaynak analizör listesi">
                  <input
                    className="adc-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ara..."
                    autoFocus
                    aria-label="Analizör ara"
                  />
                  <div className="adc-list">
                    {filtered.length === 0 ? (
                      <p className="adc-empty">Sonuç bulunamadı.</p>
                    ) : filtered.map((a) => (
                      <button
                        key={a}
                        role="option"
                        aria-selected={fromAnalyst === a}
                        className={`adc-option${fromAnalyst === a ? " selected" : ""}`}
                        onClick={() => selectFrom(a)}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sağ — hedef analizör + aktar */}
            <div className="adc-to-wrap">
              <SystemDropdown value={toAnalyst} onChange={setToAnalyst} placeholder="Analizör Seçiniz" ariaLabel="Hedef analizör seç" options={targetList.map(item => ({ value: item, label: item }))} />

              <button
                className={`adc-transfer-btn${status === "done" ? " done" : ""}${!canTransfer ? " disabled" : ""}`}
                onClick={transfer}
                disabled={!canTransfer}
              >
                {status === "done" ? "Aktarıldı ✓" : "Siparişleri Aktar >>>"}
              </button>
            </div>

          </div>
        </section>
      </div>
    </AdminShell>
  );
}
