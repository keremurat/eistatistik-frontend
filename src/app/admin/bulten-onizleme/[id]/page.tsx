"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { Bulten, Icerik, readBultenler, readIcerikler } from "../../bultenler/data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  play: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm40.44,110.66-48,32A8,8,0,0,1,108,160V96a8,8,0,0,1,12.44-6.66l48,32a8,8,0,0,1,0,13.32Z",
  file: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,44l44,44H152ZM200,216H56V40h80V88a8,8,0,0,0,8,8h56Z",
  shield: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm-42.34,74.83-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L104,154.34l50.34-50.35a8,8,0,0,1,11.32,11.32Z",
} as const;

function Icon({ name, size = 16 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const KIND: Record<Icerik["tur"], string> = { video: "Video", dosya: "Belge", metin: "Metin" };

function youtubeId(url: string) {
  return url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? "";
}

export default function BultenOnizlemeDetayPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Bulten | null | undefined>(undefined);
  const [items, setItems] = useState<Icerik[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const found = readBultenler().find((record) => record.id === params.id) ?? null;
      setItem(found);
      setItems(found ? readIcerikler().filter((entry) => entry.bultenId === found.id && entry.yayinda) : []);
    });
    return () => cancelAnimationFrame(frame);
  }, [params.id]);

  if (item === undefined) return <AdminShell>{null}</AdminShell>;
  if (item === null) {
    return (
      <AdminShell>
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Bülten bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/bulten-onizleme">Listeye dön</Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  const videos = items.filter((entry) => entry.tur === "video").length;
  const files = items.filter((entry) => entry.tur === "dosya").length;

  return (
    <AdminShell>
      <div className="fav-page">
        <Link className="fav-back" href="/admin/bulten-onizleme"><Icon name="back" size={16} />Önizlemeye dön</Link>
        <section className="preview-hero">
          <span className="preview-kicker">Özel içerik</span>
          <h1>{item.baslik}</h1>
          <p>Hoş geldiniz — içeriklere tam erişiminiz var.</p>
          {item.aciklama.trim() && <p>{item.aciklama}</p>}
          <span className="preview-access"><Icon name="shield" size={15} />Tam erişim</span>
          <p className="preview-meta">{items.length} içerik · {videos} video · {files} belge</p>
        </section>

        {items.length === 0 ? (
          <section className="fav-card">
            <div className="fav-empty">
              <strong>Yayınlanan içerik yok</strong>
              <p>Bu bültende henüz yayınlanmış içerik bulunmuyor.</p>
            </div>
          </section>
        ) : (
          <div className="preview-grid">
            {items.map((entry) => {
              const video = youtubeId(entry.youtubeUrl);
              return (
                <article className={`fav-card preview-card${entry.genislik === "tam" ? " wide" : ""}`} key={entry.id}>
                  {entry.tur === "video" && video ? (
                    <div className="preview-media"><iframe src={`https://www.youtube.com/embed/${video}`} title={entry.baslik} allowFullScreen /></div>
                  ) : (
                    <div className="preview-media empty"><Icon name={entry.tur === "dosya" ? "file" : "play"} size={28} /></div>
                  )}
                  <div className="preview-body">
                    <span className="user-chip">{KIND[entry.tur]}</span>
                    <h2>{entry.baslik}</h2>
                    {entry.aciklama.trim() && <p>{entry.aciklama}</p>}
                  </div>
                  <div className="preview-foot">
                    <span>{entry.yayinTarihi.split(" ")[0]}</span>
                    {entry.tur === "video" && entry.youtubeUrl ? (
                      <a href={entry.youtubeUrl} target="_blank" rel="noopener noreferrer"><Icon name="play" size={14} />İzle</a>
                    ) : entry.tur === "dosya" && entry.dosya ? (
                      <span className="preview-action"><Icon name="file" size={14} />İndir</span>
                    ) : null}
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
