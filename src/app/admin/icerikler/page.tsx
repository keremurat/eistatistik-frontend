"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { ICERIKLER, Icerik } from "../bultenler/data";

type IconName = "plus" | "doc" | "grip" | "edit" | "trash";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    doc: <><path d="M4 4h13a1 1 0 0 1 1 1v13a2 2 0 0 0 2 2H5a2 2 0 0 1-1-1.7V4Z" /><path d="M8 8h6M8 12h6M8 16h4" /></>,
    grip: <><circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none" /><circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" /><circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none" /><circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const turLabel = (t: string) => t === "video" ? "Video" : t === "dosya" ? "Dosya" : "Metin";

export default function OzelIceriklerPage() {
  const [rows, setRows] = useState<Icerik[]>(ICERIKLER);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  function confirmDelete() {
    setRows((prev) => prev.filter((i) => i.id !== confirmDel));
    setConfirmDel(null);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Özel İçerikler</h1>
          </div>
          <Link className="orders-create" href="/admin/bultenler/icerik/ekle">
            <Icon name="plus" size={16} />Yeni İçerik
          </Link>
        </header>

        <span className="result-count" style={{ margin: "0 0 .8rem" }}>{rows.length} içerik</span>

        {rows.length === 0 ? (
          <section className="detail-panel"><div className="bulten-empty"><Icon name="doc" size={30} /><strong style={{ color: "var(--navy)" }}>Henüz içerik yok</strong><span>Yeni bir içerik oluşturarak başlayın.</span></div></section>
        ) : (
          <div className="icerik-list">
            {rows.map((ic) => (
              <div className="icerik-list-row" key={ic.id}>
                <span className="icerik-drag" aria-hidden="true"><Icon name="grip" size={16} /></span>
                <span className={`icerik-type-badge ${ic.tur}`}>{turLabel(ic.tur)}</span>
                <div className="icerik-info">
                  <strong title={ic.baslik}>{ic.baslik}</strong>
                  <small>{ic.yayinTarihi.split(" ")[0]}</small>
                </div>
                <span className={`icerik-status ${ic.yayinda ? "yayinda" : "taslak"}`}>{ic.yayinda ? "Yayında" : "Taslak"}</span>
                <div className="bulten-card-actions">
                  <Link className="bulten-icon-btn" href={`/admin/bultenler/icerik/duzenle?id=${ic.id}`} aria-label="Düzenle"><Icon name="edit" size={15} /></Link>
                  <button className="bulten-icon-btn danger" type="button" onClick={() => setConfirmDel(ic.id)} aria-label="Sil"><Icon name="trash" size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDel && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setConfirmDel(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }} role="dialog" aria-modal="true" aria-labelledby="del-oi-title">
            <header>
              <div><p className="eyebrow">DİKKAT</p><h2 id="del-oi-title" style={{ fontSize: ".9rem" }}>İçeriği sil</h2></div>
              <button aria-label="Kapat" onClick={() => setConfirmDel(null)}>×</button>
            </header>
            <div className="ms-edit-body"><p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>Bu içeriği silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p></div>
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
