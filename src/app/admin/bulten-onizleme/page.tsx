"use client";

import Link from "next/link";
import { AdminShell } from "../AdminShell";
import { BULTENLER, bultenIcerikler } from "../bultenler/data";

type IconName = "news" | "calendar" | "file" | "eye";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    news: <><path d="M4 4h13a1 1 0 0 1 1 1v13a2 2 0 0 0 2 2H5a2 2 0 0 1-1-1.7V4Z" /><path d="M8 8h6M8 12h6M8 16h4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function BultenOnizlemePage() {
  const yayinda = BULTENLER.filter((b) => b.yayinda);

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Bülten Önizleme</h1>
          </div>
        </header>

        <span className="result-count" style={{ margin: "0 0 .8rem" }}>{yayinda.length} yayınlanan bülten</span>

        {yayinda.length === 0 ? (
          <section className="detail-panel"><div className="bulten-empty"><Icon name="news" size={30} /><strong style={{ color: "var(--navy)" }}>Yayınlanan bülten yok</strong><span>Bir bülteni yayına aldığınızda burada önizlenir.</span></div></section>
        ) : (
          <div className="bulten-list">
            {yayinda.map((b) => {
              const icerikler = bultenIcerikler(b.id);
              return (
                <Link className="bulten-card" href={`/admin/bulten-onizleme/${b.id}`} key={b.id} style={{ textDecoration: "none" }}>
                  <span className="bulten-card-icon"><Icon name="news" size={24} /></span>
                  <div className="bulten-card-body">
                    <h3><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.baslik}</span><span className="bulten-badge yayinda">Yayında</span></h3>
                    <div className="bulten-card-meta">
                      <span><Icon name="calendar" size={13} />{b.yayinTarihi.split(" ")[0]}</span>
                      <span><Icon name="file" size={13} />{icerikler.length} içerik</span>
                    </div>
                  </div>
                  <span className="bulten-icon-btn" aria-hidden="true"><Icon name="eye" size={15} /></span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
