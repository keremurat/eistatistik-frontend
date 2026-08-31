"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { getBulten, bultenIcerikler } from "../../bultenler/data";

type IconName = "back" | "shield" | "bookmark" | "play" | "calendar" | "download" | "file";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const turLabel = (t: string) => t === "video" ? "VIDEO" : t === "dosya" ? "BELGE" : "METİN";
function youtubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : "";
}

export default function BultenOnizlemeDetayPage() {
  const params = useParams<{ id: string }>();
  const bulten = getBulten(params.id);
  const icerikler = bulten ? bultenIcerikler(bulten.id).filter((i) => i.yayinda) : [];

  if (!bulten) return (
    <AdminShell><div className="st-page">
      <Link className="back-link" href="/admin/bulten-onizleme"><Icon name="back" size={16} />Önizlemeye dön</Link>
      <section className="detail-panel"><div className="settings-panel-body"><p style={{ color: "var(--muted)", fontSize: ".72rem" }}>Bülten bulunamadı.</p></div></section>
    </div></AdminShell>
  );

  const videoSayisi = icerikler.filter((i) => i.tur === "video").length;
  const belgeSayisi = icerikler.filter((i) => i.tur === "dosya").length;

  return (
    <AdminShell>
      <div className="st-page">
        <Link className="back-link" href="/admin/bulten-onizleme"><Icon name="back" size={16} />Önizlemeye dön</Link>

        <div className="bp-hero">
          <span className="bp-hero-badge"><Icon name="bookmark" size={12} />ÖZEL İÇERİK</span>
          <h1>{bulten.baslik}</h1>
          <p className="bp-hero-sub">Hoş geldiniz — içeriklere tam erişiminiz var.</p>
          <span className="bp-access"><Icon name="shield" size={15} />Tam erişim</span>
          <div className="bp-hero-meta">
            <span>{icerikler.length} içerik</span>
            <span>{videoSayisi} video</span>
            <span>{belgeSayisi} belge</span>
          </div>
        </div>

        {icerikler.length === 0 ? (
          <section className="detail-panel" style={{ marginTop: "1.5rem" }}><div className="bulten-empty"><Icon name="file" size={28} /><strong style={{ color: "var(--navy)" }}>Yayınlanan içerik yok</strong><span>Bu bültende henüz yayınlanmış içerik bulunmuyor.</span></div></section>
        ) : (
          <div className="bp-content-grid">
            {icerikler.map((ic) => {
              const ytId = youtubeId(ic.youtubeUrl);
              return (
                <article className="bp-card" key={ic.id}>
                  {ic.tur === "video" && ytId ? (
                    <div className="bp-card-media"><iframe src={`https://www.youtube.com/embed/${ytId}`} title={ic.baslik} allowFullScreen /></div>
                  ) : (
                    <div className="bp-card-media empty"><Icon name={ic.tur === "dosya" ? "file" : "play"} size={30} /></div>
                  )}
                  <div className="bp-card-body">
                    <span className="bp-card-type"><Icon name={ic.tur === "dosya" ? "file" : "play"} size={11} />{turLabel(ic.tur)}</span>
                    <h3>{ic.baslik}</h3>
                    {ic.aciklama && <p>{ic.aciklama}</p>}
                  </div>
                  <div className="bp-card-foot">
                    <span className="date"><Icon name="calendar" size={12} />{ic.yayinTarihi.split(" ")[0]}</span>
                    {ic.tur === "video" && ic.youtubeUrl
                      ? <a className="action" href={ic.youtubeUrl} target="_blank" rel="noopener noreferrer"><Icon name="play" size={13} />İzle</a>
                      : ic.tur === "dosya" && ic.dosya
                        ? <span className="action"><Icon name="download" size={13} />İndir</span>
                        : null}
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
