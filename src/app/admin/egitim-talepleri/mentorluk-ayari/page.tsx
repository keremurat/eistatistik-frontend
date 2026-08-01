"use client";

import { useState } from "react";
import { AdminShell } from "../../AdminShell";

type IconName = "edit" | "save" | "check";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    edit:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    save:  <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const DEFAULT = {
  url:     "https://meet.google.com/rne-huav-tcx",
  aralik:  "6",
  baslama: "2026-08-12 12:00:00 +0300",
};

export default function MentorlukAyariPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [values,    setValues]    = useState({ ...DEFAULT });
  const [draft,     setDraft]     = useState({ ...DEFAULT });

  function startEdit() { setDraft({ ...values }); setIsEditing(true); setSaved(false); }
  function cancel()    { setIsEditing(false); }

  function save() {
    setValues({ ...draft });
    setSaved(true);
    setTimeout(() => { setSaved(false); setIsEditing(false); }, 1500);
  }

  const canSave = draft.url.trim() && draft.aralik.trim() && draft.baslama.trim();

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM · EĞİTİM TALEPLERİ</p>
            <h1>Mentörlük Ayarları</h1>
          </div>
        </header>

        <section className="detail-panel st-list-panel" style={{ maxWidth: 700 }}>
          <div className="mentorluk-toolbar">
            {!isEditing ? (
              <button className="orders-create" onClick={startEdit} style={{ fontSize: ".65rem" }}>
                <Icon name="edit" size={15} />Düzenle
              </button>
            ) : (
              <div style={{ display: "flex", gap: ".5rem" }}>
                <button className="orders-create" onClick={save} disabled={!canSave}
                  style={{ fontSize: ".65rem", background: saved ? "#287a55" : undefined }}>
                  {saved ? <><Icon name="check" size={15} />Kaydedildi</> : <><Icon name="save" size={15} />Kaydet</>}
                </button>
                <button onClick={cancel} style={{ minHeight: 40, padding: "0 .85rem", border: "1px solid var(--line)", borderRadius: 8, background: "#fff", color: "#526a7d", fontSize: ".65rem", fontWeight: 800 }}>
                  Vazgeç
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <table className="mentorluk-view">
              <tbody>
                <tr>
                  <td>Mentörlük URL</td>
                  <td>
                    <a href={values.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>
                      {values.url}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Mentörlük Zaman Aralığı</td>
                  <td>{values.aralik}</td>
                </tr>
                <tr>
                  <td>Mentörlük Başlama Zamanı</td>
                  <td>{values.baslama}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="mentorluk-edit-grid">
              <div className="form-field">
                <label htmlFor="ml-url">Mentörlük URL</label>
                <input
                  id="ml-url"
                  value={draft.url}
                  onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                  autoFocus
                />
              </div>
              <div className="form-field">
                <label htmlFor="ml-aralik">Mentörlük Zaman Aralığı <span style={{ fontWeight: 600, color: "#9baab6", fontSize: ".85em" }}>(dakika)</span></label>
                <input
                  id="ml-aralik"
                  value={draft.aralik}
                  onChange={(e) => setDraft((d) => ({ ...d, aralik: e.target.value }))}
                  type="number"
                  min="1"
                  placeholder="6"
                />
              </div>
              <div className="form-field">
                <label htmlFor="ml-baslama">Mentörlük Başlama Zamanı</label>
                <input
                  id="ml-baslama"
                  value={draft.baslama}
                  onChange={(e) => setDraft((d) => ({ ...d, baslama: e.target.value }))}
                  placeholder="2026-08-12 12:00:00 +0300"
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
