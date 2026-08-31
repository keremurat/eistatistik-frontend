"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { BULTENLER, Bulten, bultenIcerikler } from "./data";

type IconName = "plus" | "news" | "calendar" | "file" | "eye" | "edit" | "trash";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    news: <><path d="M4 4h13a1 1 0 0 1 1 1v13a2 2 0 0 0 2 2H5a2 2 0 0 1-1-1.7V4Z" /><path d="M8 8h6M8 12h6M8 16h4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function BultenlerPage() {
  const [rows, setRows] = useState<Bulten[]>(BULTENLER);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  function confirmDelete() {
    if (!confirmDel) return;
    setRows((prev) => prev.filter((b) => b.id !== confirmDel));
    setConfirmDel(null);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Bültenler</h1>
          </div>
          <Link className="orders-create" href="/admin/bultenler/ekle">
            <Icon name="plus" size={16} />Yeni Bülten
          </Link>
        </header>

        <span className="result-count" style={{ margin: "0 0 .8rem" }}>{rows.length} bülten</span>

        {rows.length === 0 ? (
          <section className="detail-panel"><div className="bulten-empty"><Icon name="news" size={30} /><strong style={{ color: "var(--navy)" }}>Henüz bülten yok</strong><span>Yeni bir bülten oluşturarak başlayın.</span></div></section>
        ) : (
          <div className="bulten-list">
            {rows.map((b) => {
              const icerikSayisi = bultenIcerikler(b.id).length;
              return (
                <article className="bulten-card" key={b.id}>
                  <span className="bulten-card-icon"><Icon name="news" size={24} /></span>
                  <div className="bulten-card-body">
                    <h3>
                      <Link href={`/admin/bultenler/${b.id}`}>{b.baslik}</Link>
                      <span className={`bulten-badge ${b.yayinda ? "yayinda" : "taslak"}`}>{b.yayinda ? "Yayında" : "Taslak"}</span>
                    </h3>
                    <div className="bulten-card-meta">
                      <span><Icon name="calendar" size={13} />{b.yayinTarihi.split(" ")[0]}</span>
                      <span><Icon name="file" size={13} />{icerikSayisi} içerik</span>
                    </div>
                  </div>
                  <div className="bulten-card-actions">
                    <Link className="bulten-icon-btn" href={`/admin/bultenler/${b.id}`} aria-label="Görüntüle"><Icon name="eye" size={15} /></Link>
                    <Link className="bulten-icon-btn" href={`/admin/bultenler/duzenle?id=${b.id}`} aria-label="Düzenle"><Icon name="edit" size={15} /></Link>
                    <button className="bulten-icon-btn danger" type="button" onClick={() => setConfirmDel(b.id)} aria-label="Sil"><Icon name="trash" size={15} /></button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {confirmDel && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setConfirmDel(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }} role="dialog" aria-modal="true" aria-labelledby="del-bulten-title">
            <header>
              <div><p className="eyebrow">DİKKAT</p><h2 id="del-bulten-title" style={{ fontSize: ".9rem" }}>Bülteni sil</h2></div>
              <button aria-label="Kapat" onClick={() => setConfirmDel(null)}>×</button>
            </header>
            <div className="ms-edit-body"><p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>Bu bülteni ve içeriklerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p></div>
            <footer>
              <div />
              <div>
                <button className="legal-cancel" onClick={() => setConfirmDel(null)}>Vazgeç</button>
                <button className="legal-accept" style={{ background: "#c85a51" }} onClick={confirmDelete}>Evet, Sil</button>
              </div>
            </footer>
          </section>
        </div>,
        document.body
      )}
    </AdminShell>
  );
}
