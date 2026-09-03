"use client";

import { AdminShell } from "../AdminShell";
import { SABLONLAR } from "../analiz-sablonlari/data";

type IconName = "layout" | "play" | "file" | "download";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function youtubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : "";
}

export default function SablonGorunumuPage() {
  const sablonlar = [...SABLONLAR].filter((s) => s.yayinda).sort((a, b) => a.sira - b.sira);

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Şablonlar</h1>
          </div>
        </header>

        <span className="result-count" style={{ margin: "0 0 .8rem" }}>Bilgi amaçlı analiz şablonları · {sablonlar.length} şablon</span>

        {sablonlar.length === 0 ? (
          <section className="detail-panel"><div className="bulten-empty" style={{ padding: "3rem 2rem" }}>
            <span style={{ width: 58, height: 58, display: "grid", placeItems: "center", borderRadius: 14, color: "#8197a7", background: "#eef3f5" }}><Icon name="layout" size={28} /></span>
            <strong style={{ color: "var(--navy)", marginTop: ".6rem" }}>Henüz şablon eklenmemiş</strong>
            <span>Yönetim ekibi şablon eklediğinde burada görünecek.</span>
          </div></section>
        ) : (
          <div className="bp-content-grid">
            {sablonlar.map((s) => {
              const ytId = youtubeId(s.videoUrl);
              return (
                <article className="bp-card" key={s.id}>
                  {ytId ? (
                    <div className="bp-card-media"><iframe src={`https://www.youtube.com/embed/${ytId}`} title={s.baslik} allowFullScreen /></div>
                  ) : (
                    <div className="bp-card-media empty"><Icon name={s.dosya ? "file" : "layout"} size={30} /></div>
                  )}
                  <div className="bp-card-body">
                    <span className="bp-card-type"><Icon name={s.videoUrl ? "play" : "file"} size={11} />{s.videoUrl ? "VIDEO" : s.dosya ? "BELGE" : "ŞABLON"}</span>
                    <h3>{s.baslik}</h3>
                    {s.aciklama && <p>{s.aciklama}</p>}
                  </div>
                  <div className="bp-card-foot">
                    <span className="date"><Icon name="layout" size={12} />Sıra {s.sira}</span>
                    <span style={{ display: "flex", gap: ".8rem" }}>
                      {s.videoUrl && <a className="action" href={s.videoUrl} target="_blank" rel="noopener noreferrer"><Icon name="play" size={13} />İzle</a>}
                      {s.dosya && <span className="action"><Icon name="download" size={13} />İndir</span>}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
