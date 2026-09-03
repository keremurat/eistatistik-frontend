"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { HIZMETLER, Hizmet } from "./data";

type IconName = "plus" | "video";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function HizmetlerPage() {
  const [rows, setRows] = useState<Hizmet[]>([...HIZMETLER].sort((a, b) => a.sira - b.sira));
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  function confirmDelete() {
    setRows((prev) => prev.filter((h) => h.id !== confirmDel));
    setConfirmDel(null);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Hizmetler</h1>
          </div>
          <Link className="orders-create" href="/admin/hizmetler/ekle">
            <Icon name="plus" size={16} />Yeni Hizmet
          </Link>
        </header>

        <span className="result-count" style={{ margin: "0 0 .8rem" }}>Ana sayfada listelenen hizmetler ve SEO sayfaları · {rows.length} hizmet</span>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="ur-table-wrap">
            <table className="ur-table edu-table">
              <colgroup>
                <col style={{ width: "60px" }} />
                <col style={{ width: "34%" }} />
                <col />
                <col style={{ width: "70px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "168px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="nowrap">SIRA</th>
                  <th>Başlık</th>
                  <th>Slug</th>
                  <th style={{ textAlign: "center" }}>Video</th>
                  <th style={{ textAlign: "center" }}>Durum</th>
                  <th aria-label="İşlem"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((h) => (
                  <tr key={h.id}>
                    <td className="nowrap" style={{ color: "#8493a0", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{h.sira}</td>
                    <td><span className="edu-name-link" title={h.baslik} style={{ color: "var(--navy)" }}>{h.baslik}</span></td>
                    <td><span className="hz-slug" title={`/hizmetler/${h.slug}`}>/hizmetler/{h.slug}</span></td>
                    <td className="nowrap" style={{ textAlign: "center", color: h.videoUrl ? "var(--blue)" : "#c8d2d9" }}>{h.videoUrl ? <Icon name="video" size={16} /> : "—"}</td>
                    <td className="nowrap" style={{ textAlign: "center" }}>
                      <span style={{ padding: ".22rem .55rem", borderRadius: 99, fontSize: ".62rem", fontWeight: 800, background: h.aktif ? "#edf7f1" : "#f5f7f8", color: h.aktif ? "#287a55" : "#8493a0" }}>{h.aktif ? "Aktif" : "Pasif"}</span>
                    </td>
                    <td className="nowrap">
                      <div className="hz-actions">
                        <Link className="hz-action-btn" href={`/admin/hizmetler/duzenle?id=${h.id}`}>Düzenle</Link>
                        <button className="hz-action-btn danger" type="button" onClick={() => setConfirmDel(h.id)}>Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>Hizmet bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {confirmDel && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setConfirmDel(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }} role="dialog" aria-modal="true" aria-labelledby="del-hz-title">
            <header>
              <div><p className="eyebrow">DİKKAT</p><h2 id="del-hz-title" style={{ fontSize: ".9rem" }}>Hizmeti sil</h2></div>
              <button aria-label="Kapat" onClick={() => setConfirmDel(null)}>×</button>
            </header>
            <div className="ms-edit-body"><p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>Bu hizmet sayfasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p></div>
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
