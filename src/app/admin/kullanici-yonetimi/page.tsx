"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminShell } from "../AdminShell";
import { KULLANICILAR, KullaniciDurum, KullaniciRol } from "./data";

type IconName = "search" | "user" | "arrow";
function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>,
    user:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    arrow:  <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const ROL_RENK: Record<KullaniciRol, { bg: string; color: string }> = {
  Admin:   { bg: "#ede9fb", color: "#5b3fcc" },
  Analist: { bg: "#e9f4fb", color: "#1775a9" },
  Editör:  { bg: "#edf7f1", color: "#287a55" },
  Asistan: { bg: "#fdf3e7", color: "#b66d2e" },
  Müşteri: { bg: "#f0f4f7", color: "#526a7d" },
};

const DURUM_RENK: Record<KullaniciDurum, { bg: string; color: string; dot: string }> = {
  Aktif: { bg: "#edf7f1", color: "#287a55", dot: "#3c8a6b" },
  Pasif: { bg: "#f5f7f8", color: "#8493a0", dot: "#b0bfc9" },
};

export default function KullaniciListesiPage() {
  const [search, setSearch] = useState("");

  const filtered = KULLANICILAR.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      u.adSoyad.toLowerCase().includes(q) ||
      u.eposta.toLowerCase().includes(q) ||
      u.gsm.includes(q) ||
      String(u.id).includes(q) ||
      u.rol.toLowerCase().includes(q)
    );
  });

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">KULLANICI YÖNETİMİ</p>
            <h1>Kullanıcı Listesi</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <span style={{ fontSize: ".65rem", color: "#8493a0", fontWeight: 700 }}>
              {filtered.length} kullanıcı
            </span>
            <div style={{
              display: "flex", alignItems: "center", gap: ".45rem",
              padding: ".38rem .75rem", border: "1px solid var(--line)",
              borderRadius: 8, background: "#fff", minWidth: 220,
            }}>
              <span style={{ color: "#94aab7", display: "flex" }}><Icon name="search" size={14} /></span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ad, e-posta, GSM veya ID ara…"
                style={{
                  flex: 1, border: 0, outline: "none", background: "transparent",
                  fontSize: ".7rem", color: "var(--ink)", fontFamily: "inherit",
                }}
              />
            </div>
          </div>
        </header>

        <section className="detail-panel st-list-panel" style={{ padding: 0 }}>
          <div className="ur-table-wrap">
            <table className="ur-table">
              <thead>
                <tr>
                  <th style={{ width: 56 }}>ID</th>
                  <th>Adı Soyadı</th>
                  <th>E-posta</th>
                  <th>GSM</th>
                  <th style={{ textAlign: "center" }}>Tür</th>
                  <th style={{ textAlign: "center" }}>Durum</th>
                  <th style={{ textAlign: "center" }}>Rol</th>
                  <th style={{ textAlign: "right" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem", color: "#8493a0", fontSize: ".75rem" }}>
                      Kullanıcı bulunamadı
                    </td>
                  </tr>
                ) : filtered.map((u) => {
                  const rol    = ROL_RENK[u.rol];
                  const durum  = DURUM_RENK[u.durum];
                  return (
                    <tr key={u.id}>
                      <td style={{ color: "#8493a0", fontSize: ".68rem", fontVariantNumeric: "tabular-nums" }}>
                        {u.id}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                          <span style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: "#edf1f5", color: "#54687a",
                            display: "grid", placeItems: "center", flexShrink: 0,
                          }}>
                            <Icon name="user" size={13} />
                          </span>
                          <span style={{ fontSize: ".72rem", fontWeight: 800, color: "var(--ink)" }}>
                            {u.adSoyad}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: "#54687a", fontSize: ".7rem" }}>{u.eposta}</td>
                      <td style={{ color: "#54687a", fontSize: ".7rem", fontVariantNumeric: "tabular-nums" }}>
                        {u.gsm}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ fontSize: ".62rem", fontWeight: 800, color: "#617689" }}>
                          {u.tur}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: ".3rem",
                          padding: ".22rem .6rem", borderRadius: 99,
                          background: durum.bg, color: durum.color,
                          fontSize: ".62rem", fontWeight: 800,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: durum.dot, flexShrink: 0 }} />
                          {u.durum}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          display: "inline-block", padding: ".22rem .6rem", borderRadius: 99,
                          background: rol.bg, color: rol.color,
                          fontSize: ".62rem", fontWeight: 800,
                        }}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          href={`/admin/kullanici-yonetimi/${u.id}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: ".3rem",
                            padding: ".3rem .75rem", border: 0, borderRadius: 7,
                            background: "var(--navy)", color: "#fff",
                            fontSize: ".67rem", fontWeight: 800, textDecoration: "none",
                          }}>
                          Detay <Icon name="arrow" size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
