"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { Sablon, readSablonlar } from "../analiz-sablonlari/data";

const ICONS = {
  play: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm40.44,110.66-48,32A8,8,0,0,1,108,160V96a8,8,0,0,1,12.44-6.66l48,32a8,8,0,0,1,0,13.32Z",
  file: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,44l44,44H152ZM200,216H56V40h80V88a8,8,0,0,0,8,8h56Z",
  layout: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V88H40ZM216,200H104V104H216Z",
} as const;

function Icon({ name, size = 16 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function youtubeId(url: string) {
  return url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? "";
}

function kind(item: Sablon) {
  if (item.videoUrl) return "Video";
  if (item.dosya) return "Belge";
  return "Şablon";
}

export default function SablonGorunumuPage() {
  const [rows, setRows] = useState<Sablon[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRows(readSablonlar().filter((item) => item.yayinda)));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return rows;
    return rows.filter((item) => `${item.baslik} ${item.aciklama}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [rows, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Şablon görünümü <span>{rows.length}</span></h1>
            <p>Bilgi amaçlı analiz şablonları. Yalnızca yayındakiler görünür.</p>
          </div>
        </header>

        <section className="fav-card" aria-label="Şablon araması">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık veya açıklamada ara" aria-label="Şablon görünümünde ara" />
          </label>
        </section>

        {visible.length === 0 ? (
          <section className="fav-card">
            <div className="fav-empty">
              <strong>{rows.length === 0 ? "Henüz şablon eklenmemiş" : "Eşleşen şablon yok"}</strong>
              <p>{rows.length === 0 ? "Yönetim ekibi şablon eklediğinde burada görünecek." : "Aramayı değiştirin."}</p>
            </div>
          </section>
        ) : (
          <div className="preview-grid">
            {visible.map((item) => {
              const video = youtubeId(item.videoUrl);
              return (
                <article className="fav-card preview-card" key={item.id}>
                  {video ? (
                    <div className="preview-media"><iframe src={`https://www.youtube.com/embed/${video}`} title={item.baslik} allowFullScreen /></div>
                  ) : (
                    <div className="preview-media empty"><Icon name={item.dosya ? "file" : "layout"} size={28} /></div>
                  )}
                  <div className="preview-body">
                    <span className="user-chip">{kind(item)}</span>
                    <h2>{item.baslik}</h2>
                    {item.aciklama.trim() && <p>{item.aciklama}</p>}
                  </div>
                  <div className="preview-foot">
                    <span>Sıra {item.sira}</span>
                    <span className="preview-actions">
                      {item.videoUrl && <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"><Icon name="play" size={14} />İzle</a>}
                      {item.dosya && <span className="preview-action"><Icon name="file" size={14} />İndir</span>}
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
