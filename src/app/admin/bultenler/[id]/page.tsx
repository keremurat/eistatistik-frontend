"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../../AdminShell";
import { getBulten, bultenIcerikler } from "../data";

type IconName = "back" | "edit" | "play" | "file" | "doc" | "trash";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
    doc: <><path d="M4 4h13a1 1 0 0 1 1 1v13a2 2 0 0 0 2 2H5a2 2 0 0 1-1-1.7V4Z" /><path d="M8 8h6M8 12h6M8 16h4" /></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const turIcon = (t: string): IconName => t === "video" ? "play" : t === "dosya" ? "file" : "doc";

export default function BultenDetayPage() {
  const params = useParams<{ id: string }>();
  const bulten = getBulten(params.id);
  const [icerikler,  setIcerikler]  = useState(() => bulten ? bultenIcerikler(bulten.id) : []);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  if (!bulten) return (
    <AdminShell><div className="st-page">
      <header className="favorite-category-create-header"><Link className="back-link" href="/admin/bultenler"><Icon name="back" size={16} />Bültenlere dön</Link><h1>Bülten</h1></header>
      <section className="detail-panel"><div className="settings-panel-body"><p style={{ color: "var(--muted)", fontSize: ".72rem" }}>Bülten bulunamadı.</p></div></section>
    </div></AdminShell>
  );

  function confirmDelete() {
    setIcerikler((prev) => prev.filter((i) => i.id !== confirmDel));
    setConfirmDel(null);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="favorite-category-create-header">
          <Link className="back-link" href="/admin/bultenler"><Icon name="back" size={16} />Bültenlere dön</Link>
          <div className="bulten-detail-titlebar">
            <div>
              <h1>{bulten.baslik}</h1>
              <p className="bulten-detail-sub">{icerikler.length} içerik · {bulten.yayinTarihi.split(" ")[0]}</p>
            </div>
            <Link className="orders-create" href={`/admin/bultenler/duzenle?id=${bulten.id}`}>
              <Icon name="edit" size={15} />Düzenle
            </Link>
          </div>
        </header>

        {icerikler.length === 0 ? (
          <section className="detail-panel"><div className="bulten-empty"><Icon name="doc" size={28} /><strong style={{ color: "var(--navy)" }}>Bu bültende içerik yok</strong><span>Bültene içerik ekleyerek başlayın.</span></div></section>
        ) : (
          <div>
            {icerikler.map((ic) => (
              <div className="icerik-row" key={ic.id}>
                <span className="icerik-row-icon"><Icon name={turIcon(ic.tur)} size={16} /></span>
                <strong title={ic.baslik}>{ic.baslik}</strong>
                <small>{ic.yayinTarihi.split(" ")[0]}</small>
                <div className="bulten-card-actions">
                  <Link className="bulten-icon-btn" href={`/admin/bultenler/icerik/duzenle?id=${ic.id}`} aria-label="İçeriği düzenle"><Icon name="edit" size={15} /></Link>
                  <button className="bulten-icon-btn danger" type="button" onClick={() => setConfirmDel(ic.id)} aria-label="İçeriği sil"><Icon name="trash" size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDel && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setConfirmDel(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }} role="dialog" aria-modal="true" aria-labelledby="del-icerik-title">
            <header>
              <div><p className="eyebrow">DİKKAT</p><h2 id="del-icerik-title" style={{ fontSize: ".9rem" }}>İçeriği sil</h2></div>
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
