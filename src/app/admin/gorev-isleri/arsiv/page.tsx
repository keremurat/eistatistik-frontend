"use client";

import { useState } from "react";
import { AdminShell } from "../../AdminShell";

// ── Tipler ────────────────────────────────────────────────────────────────────
type EtiketKey = "Acil" | "Arama Talebi" | "Önemli" | "Düşük Öncelikli" | "Hatırlatma";
type PanoKey   = "yapilacaklar" | "yapiliyor" | "yapildi";

interface ArsivGorev {
  id: number;
  baslik: string;
  etiket: EtiketKey;
  atanan: string;
  tarih: string;
  arsivTarihi: string;
  pano: PanoKey;
  aciklama: string;
  siparisKodu?: string;
  musteriAdi?: string;
  musteriTel?: string;
}

// ── Etiket ────────────────────────────────────────────────────────────────────
const ETIKET_CLS: Record<EtiketKey, string> = {
  "Acil":            "gorev-etiket gorev-etiket-acil",
  "Arama Talebi":    "gorev-etiket gorev-etiket-aramatalebi",
  "Önemli":          "gorev-etiket gorev-etiket-onemli",
  "Düşük Öncelikli": "gorev-etiket gorev-etiket-dusuk",
  "Hatırlatma":      "gorev-etiket gorev-etiket-hatirlatma",
};

const PANO_LABEL: Record<PanoKey, string> = {
  yapilacaklar: "YAPILACAKLAR",
  yapiliyor:    "YAPILIYOR",
  yapildi:      "YAPILDI",
};

// ── Mock arşiv verisi ─────────────────────────────────────────────────────────
const INIT_ARSIV: ArsivGorev[] = [
  { id: 901, baslik: "HATIRLATMA",           etiket: "Hatırlatma",    atanan: "SÜMEYYE İNAN",  tarih: "15.06.2026 09:00", arsivTarihi: "20.07.2026 14:32", pano: "yapildi",      aciklama: "Hocaya ödeme hatırlatması yapıldı.", musteriAdi: "AYŞE KAYA",     musteriTel: "532 111 22 33" },
  { id: 902, baslik: "Ek Analiz Talebi",     etiket: "Önemli",        atanan: "NACİ MURAT",    tarih: "22.06.2026 11:15", arsivTarihi: "18.07.2026 10:05", pano: "yapildi",      aciklama: "Ek analiz talebi karşılandı ve teslim edildi.", siparisKodu: "SA260622001" },
  { id: 903, baslik: "BİLGİLENDİRME",        etiket: "Acil",          atanan: "MEHMET MEŞE",   tarih: "01.07.2026 16:40", arsivTarihi: "15.07.2026 09:20", pano: "yapildi",      aciklama: "Müşteri bilgilendirildi ve süreç kapandı.", siparisKodu: "SA260701003", musteriAdi: "MURAT DEMİR", musteriTel: "544 987 65 43" },
  { id: 904, baslik: "Rapor Teslimi",         etiket: "Arama Talebi",  atanan: "ALİHSAN ŞÜKÜR", tarih: "28.06.2026 14:00", arsivTarihi: "10.07.2026 16:55", pano: "yapildi",      aciklama: "Rapor teslim edildi, müşteri onayladı.", siparisKodu: "SA260628002" },
  { id: 905, baslik: "EĞİTİM TAKİBİ",        etiket: "Düşük Öncelikli", atanan: "DİLARA YILMAZ", tarih: "10.07.2026 10:30", arsivTarihi: "01.08.2026 11:00", pano: "yapiliyor", aciklama: "Eğitim takibi tamamlandı." },
  { id: 906, baslik: "Teslimat Onayı",        etiket: "Acil",          atanan: "ESRA ÖZTÜRK",   tarih: "05.07.2026 08:45", arsivTarihi: "28.07.2026 17:30", pano: "yapildi",      aciklama: "Teslimat müşteri tarafından onaylandı.", siparisKodu: "SA260705004", musteriAdi: "ZEYNEPNur Şahin", musteriTel: "505 321 76 54" },
  { id: 907, baslik: "ARAMA TAKİBİ",          etiket: "Arama Talebi",  atanan: "SÜMEYYE İNAN",  tarih: "18.07.2026 13:20", arsivTarihi: "31.07.2026 09:10", pano: "yapilacaklar", aciklama: "Müşteri arandı, mesaj bırakıldı.", musteriAdi: "BURCU AKSOY", musteriTel: "532 654 32 10" },
];

// ── İkon ─────────────────────────────────────────────────────────────────────
type IName = "archive" | "undo" | "trash" | "inbox";
function Icon({ name, size = 16 }: { name: IName; size?: number }) {
  const p: Record<IName, React.ReactNode> = {
    archive: <><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></>,
    undo:    <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>,
    trash:   <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></>,
    inbox:   <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>;
}

// ── Ana sayfa ─────────────────────────────────────────────────────────────────
export default function ArsivPage() {
  const [gorevler, setGorevler] = useState<ArsivGorev[]>(INIT_ARSIV);
  const [silOnay,  setSilOnay]  = useState<number | null>(null);

  function geriAl(id: number) {
    setGorevler(prev => prev.filter(g => g.id !== id));
  }

  function sil(id: number) {
    setGorevler(prev => prev.filter(g => g.id !== id));
    setSilOnay(null);
  }

  return (
    <AdminShell>
      <div className="arsiv-page">

        {/* Başlık */}
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Arşiv</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span style={{ fontSize: ".68rem", fontWeight: 800, color: "var(--muted)" }}>
              {gorevler.length} arşivlenmiş görev
            </span>
          </div>
        </header>

        {/* İçerik */}
        {gorevler.length === 0 ? (
          <div className="arsiv-empty">
            <Icon name="inbox" size={36} />
            <p>Arşivde görev bulunmuyor</p>
          </div>
        ) : (
          <div className="detail-panel" style={{ padding: 0, overflow: "hidden" }}>
            <table className="admin-table arsiv-table">
              <thead>
                <tr>
                  <th>Görev</th>
                  <th>Atanan</th>
                  <th>Etiket</th>
                  <th>Orijinal Pano</th>
                  <th>Görev Tarihi</th>
                  <th>Arşiv Tarihi</th>
                  <th style={{ textAlign: "right" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {gorevler.map(g => (
                  <tr key={g.id}>
                    {/* Görev */}
                    <td style={{ maxWidth: 340 }}>
                      <p style={{ margin: 0, fontWeight: 850, color: "var(--navy)", fontSize: ".7rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {g.baslik}
                      </p>
                      {(g.musteriAdi || g.siparisKodu) && (
                        <p style={{ margin: ".18rem 0 0", fontSize: ".61rem", color: "var(--muted)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {g.siparisKodu && <span style={{ marginRight: ".4rem" }}>{g.siparisKodu}</span>}
                          {g.musteriAdi && <span>{g.musteriAdi}{g.musteriTel ? ` — ${g.musteriTel}` : ""}</span>}
                        </p>
                      )}
                      {g.aciklama && (
                        <p style={{ margin: ".14rem 0 0", fontSize: ".6rem", color: "#8493a0", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 320 }}>
                          {g.aciklama}
                        </p>
                      )}
                    </td>

                    {/* Atanan */}
                    <td style={{ whiteSpace: "nowrap", fontSize: ".63rem", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                      {g.atanan}
                    </td>

                    {/* Etiket */}
                    <td><span className={ETIKET_CLS[g.etiket]}>{g.etiket}</span></td>

                    {/* Orijinal pano */}
                    <td>
                      <span style={{ fontSize: ".62rem", fontWeight: 800, padding: ".2rem .55rem", borderRadius: 99, background: "var(--canvas)", color: "var(--muted)", border: "1px solid var(--line)", whiteSpace: "nowrap" }}>
                        {PANO_LABEL[g.pano]}
                      </span>
                    </td>

                    {/* Görev tarihi */}
                    <td style={{ whiteSpace: "nowrap", color: "#54687a", fontSize: ".63rem", fontWeight: 700 }}>{g.tarih}</td>

                    {/* Arşiv tarihi */}
                    <td style={{ whiteSpace: "nowrap", color: "var(--muted)", fontSize: ".63rem", fontWeight: 700 }}>{g.arsivTarihi}</td>

                    {/* İşlemler */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: ".4rem", justifyContent: "flex-end" }}>
                        {silOnay === g.id ? (
                          <>
                            <span style={{ fontSize: ".63rem", fontWeight: 700, color: "#54687a" }}>Silinsin mi?</span>
                            <button onClick={() => sil(g.id)} className="arsiv-btn arsiv-btn-danger">Evet</button>
                            <button onClick={() => setSilOnay(null)} className="arsiv-btn">İptal</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => geriAl(g.id)} className="arsiv-btn arsiv-btn-restore" title="Görev listesine geri al">
                              <Icon name="undo" size={13} /> Geri Al
                            </button>
                            <button onClick={() => setSilOnay(g.id)} className="arsiv-btn arsiv-btn-delete" title="Kalıcı olarak sil">
                              <Icon name="trash" size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminShell>
  );
}
