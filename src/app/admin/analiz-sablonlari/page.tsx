"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AdminShell } from "../AdminShell";
import { SABLONLAR, Sablon } from "./data";

type IconName = "plus" | "video" | "file" | "inbox";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></>,
    inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AnalizSablonlariPage() {
  const [rows, setRows] = useState<Sablon[]>([...SABLONLAR].sort((a, b) => a.sira - b.sira));
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  function confirmDelete() {
    setRows((prev) => prev.filter((s) => s.id !== confirmDel));
    setConfirmDel(null);
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Şablonlar</h1>
          </div>
          <Link className="orders-create" href="/admin/analiz-sablonlari/ekle">
            <Icon name="plus" size={16} />Yeni Şablon
          </Link>
        </header>

        <span className="result-count" style={{ margin: "0 0 .8rem" }}>Analizörlere görünen şablonlar · {rows.length} şablon</span>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="ur-table-wrap">
            <table className="ur-table edu-table">
              <colgroup>
                <col style={{ width: "56px" }} />
                <col />
                <col style={{ width: "80px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "168px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="nowrap">#</th>
                  <th>Başlık</th>
                  <th style={{ textAlign: "center" }}>Video</th>
                  <th style={{ textAlign: "center" }}>Dosya</th>
                  <th style={{ textAlign: "center" }}>Durum</th>
                  <th aria-label="İşlem"></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={6}><div className="bulten-empty"><Icon name="inbox" size={30} /><span>Henüz şablon eklenmemiş.</span></div></td></tr>
                ) : rows.map((s) => (
                  <tr key={s.id}>
                    <td className="nowrap" style={{ color: "#8493a0", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{s.sira}</td>
                    <td><span className="edu-name-link" title={s.baslik} style={{ color: "var(--navy)" }}>{s.baslik}</span></td>
                    <td className="nowrap" style={{ textAlign: "center", color: s.videoUrl ? "var(--blue)" : "#c8d2d9" }}>{s.videoUrl ? <Icon name="video" size={16} /> : "—"}</td>
                    <td className="nowrap" style={{ textAlign: "center", color: s.dosya ? "#3c8a6b" : "#c8d2d9" }}>{s.dosya ? <Icon name="file" size={16} /> : "—"}</td>
                    <td className="nowrap" style={{ textAlign: "center" }}>
                      <span style={{ padding: ".22rem .55rem", borderRadius: 99, fontSize: ".62rem", fontWeight: 800, background: s.yayinda ? "#edf7f1" : "#f5f7f8", color: s.yayinda ? "#287a55" : "#8493a0" }}>{s.yayinda ? "Yayında" : "Taslak"}</span>
                    </td>
                    <td className="nowrap">
                      <div className="hz-actions">
                        <Link className="hz-action-btn" href={`/admin/analiz-sablonlari/duzenle?id=${s.id}`}>Düzenle</Link>
                        <button className="hz-action-btn danger" type="button" onClick={() => setConfirmDel(s.id)}>Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {confirmDel && typeof document !== "undefined" && createPortal(
        <div className="legal-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setConfirmDel(null); }}>
          <section className="legal-modal ms-edit-modal" style={{ maxWidth: 400, minHeight: 0 }} role="dialog" aria-modal="true" aria-labelledby="del-sb-title">
            <header>
              <div><p className="eyebrow">DİKKAT</p><h2 id="del-sb-title" style={{ fontSize: ".9rem" }}>Şablonu sil</h2></div>
              <button aria-label="Kapat" onClick={() => setConfirmDel(null)}>×</button>
            </header>
            <div className="ms-edit-body"><p style={{ color: "#3f556a", fontSize: ".72rem", lineHeight: 1.6 }}>Bu şablonu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p></div>
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
