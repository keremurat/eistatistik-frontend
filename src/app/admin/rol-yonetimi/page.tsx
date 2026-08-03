"use client";

import Link from "next/link";
import { AdminShell } from "../AdminShell";
import { ROLLER } from "./data";

type IconName = "check" | "x" | "edit" | "plus";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    check: <path d="m5 12 4 4L19 6" />,
    x:     <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    edit:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></>,
    plus:  <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function RolYonetimiPage() {
  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Rol Listesi</h1>
          </div>
          <Link
            href="/admin/rol-yonetimi/ekle"
            style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              minHeight: 38, padding: "0 1.1rem", border: 0, borderRadius: 8,
              background: "var(--navy)", color: "#fff",
              fontSize: ".7rem", fontWeight: 800, textDecoration: "none",
            }}>
            <Icon name="plus" size={14} />Yeni Rol
          </Link>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="ur-table-wrap">
            <table className="ur-table">
              <thead>
                <tr>
                  <th>Rol Adı</th>
                  <th>Açıklama</th>
                  <th style={{ textAlign: "center" }}>Görev Ataması</th>
                  <th style={{ textAlign: "center" }}>Yetki Sayısı</th>
                  <th style={{ textAlign: "right" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {ROLLER.map((rol) => (
                  <tr key={rol.key}>
                    <td>
                      <code style={{
                        padding: ".2rem .55rem", borderRadius: 6,
                        background: "#f0f4f7", color: "var(--navy)",
                        fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace",
                        fontSize: ".75rem", fontWeight: 700,
                      }}>
                        {rol.adi}
                      </code>
                    </td>
                    <td style={{ color: "#54687a", fontSize: ".72rem", maxWidth: "34ch" }}>
                      {rol.aciklama}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {rol.gorevAtamasi
                        ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "#edf7f1", color: "#287a55" }}><Icon name="check" size={13} /></span>
                        : <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "#fff3f2", color: "#c85a51" }}><Icon name="x" size={13} /></span>
                      }
                    </td>
                    <td style={{ textAlign: "center", color: "#526a7d", fontSize: ".72rem", fontWeight: 700 }}>
                      {rol.perms.size}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={`/admin/rol-yonetimi/duzenle?rol=${rol.key}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: ".35rem",
                          padding: ".3rem .75rem", border: 0, borderRadius: 7,
                          background: "var(--navy)", color: "#fff",
                          fontSize: ".67rem", fontWeight: 800, textDecoration: "none",
                        }}>
                        <Icon name="edit" size={13} />Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
