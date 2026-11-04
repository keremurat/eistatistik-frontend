"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { Bulten, Icerik, readBultenler, readIcerikler, writeIcerikler } from "../data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  news: "M216,40H40A16,16,0,0,0,24,56V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V80H40ZM216,192H40V96H216Zm-16-24a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,168Z",
  caret: "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const KIND: Record<Icerik["tur"], string> = { video: "Video", dosya: "Dosya", metin: "Metin" };

export default function BultenDetayPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Bulten | null | undefined>(undefined);
  const [items, setItems] = useState<Icerik[]>([]);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const found = readBultenler().find((record) => record.id === params.id) ?? null;
      setItem(found);
      setItems(found ? readIcerikler().filter((entry) => entry.bultenId === found.id) : []);
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
            <Link className="orders-create" href="/admin/bultenler">Listeye dön</Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="fav-page">
        <Link className="fav-back" href="/admin/bultenler"><Icon name="back" size={16} />Bültenlere dön</Link>
        <header className="fav-head">
          <div>
            <h1>{item.baslik}</h1>
            <p>{items.length} içerik · {item.yayinTarihi}</p>
          </div>
          <Link className="orders-create" href={`/admin/bultenler/duzenle?id=${item.id}`}>Düzenle</Link>
        </header>

        <section className="fav-card stype-section">
          <header>
            <span className="fav-mark"><Icon name="news" /></span>
            <h2>Bülten</h2>
            <span className={`stype-status ${item.yayinda ? "aktif" : "pasif"}`}>{item.yayinda ? "Yayında" : "Taslak"}</span>
          </header>
          <p className="llist-empty">{item.aciklama.trim() || "Açıklama eklenmedi."}</p>
        </section>

        <section className="fav-card" aria-label="Bülten içerikleri">
          {items.length === 0 ? (
            <div className="fav-empty">
              <strong>Bu bültende içerik yok</strong>
              <p>Bültene içerik ekleyerek başlayın.</p>
            </div>
          ) : (
            <ul className="fav-list">
              {items.map((content) => (
                <li key={content.id}>
                  {confirming === content.id ? (
                    <div className="user-row">
                      <span className="fav-copy"><strong>{content.baslik}</strong><small>Bu işlem geri alınamaz.</small></span>
                      <button className="user-cancel" type="button" onClick={() => setConfirming(null)}>Vazgeç</button>
                      <button className="fav-delete" type="button" onClick={() => { const next = readIcerikler().filter((entry) => entry.id !== content.id); writeIcerikler(next); setItems(next.filter((entry) => entry.bultenId === item.id)); setConfirming(null); }}>Evet, sil</button>
                    </div>
                  ) : (
                    <div className="appt-row">
                      <Link href={`/admin/icerikler/${content.id}`}>
                        <span className="fav-mark"><Icon name="news" size={16} /></span>
                        <span className="fav-copy">
                          <strong>{content.baslik}</strong>
                          <small className="mtpl-snippet">{KIND[content.tur]} · {content.yayinTarihi}</small>
                        </span>
                        <span className={`stype-status ${content.yayinda ? "aktif" : "pasif"}`}>{content.yayinda ? "Yayında" : "Taslak"}</span>
                        <Icon name="caret" size={16} />
                      </Link>
                      <button className="user-cancel" type="button" onClick={() => setConfirming(content.id)}>Sil</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
