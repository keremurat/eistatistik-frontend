"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { ABONELIKLER, formatUcret } from "../data";

const ICONS = {
  back: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
  card: "M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM32,64H224v32H32ZM224,192H32V112H224v80Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function paymentClass(status: string) {
  if (status === "Ödendi") return "user-chip odeme";
  if (status === "Bekliyor") return "user-chip beklemede";
  return "user-chip iptal";
}

export default function AbonelikDetailPage() {
  const params = useParams<{ id: string }>();
  const item = ABONELIKLER.find((record) => String(record.id) === params.id);

  return (
    <AdminShell>
      {!item ? (
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Abonelik bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/abonelikler">Listeye dön</Link>
          </div>
        </div>
      ) : (
        <div className="fav-page stype-page">
          <Link className="fav-back" href="/admin/abonelikler"><Icon name="back" size={16} />Aboneliklere dön</Link>
          <div className="stype-layout">
            <section className="fav-card stype-section">
              <header><span className="fav-mark"><Icon name="card" /></span><h2>{item.musteri}</h2></header>
              <dl className="acct-rows">
                <div><dt>Durum</dt><dd>{item.durum}</dd></div>
                <div><dt>Başlangıç</dt><dd>{item.baslangic}</dd></div>
                <div><dt>Bitiş</dt><dd>{item.bitis}</dd></div>
                <div><dt>Ödeme</dt><dd>{item.odeme}</dd></div>
                <div><dt>Ücret</dt><dd>{formatUcret(item.ucret)}</dd></div>
              </dl>
              <Link href="/admin/kullanici">Müşteri detayına git</Link>
            </section>
            <aside className="fav-card acct-summary" aria-label="Abonelik özeti">
              <header><span className="fav-mark"><Icon name="card" /></span><h2>Özet</h2></header>
              <span className={paymentClass(item.odeme)}>{item.odeme}</span>
              <p className="acct-figure">{formatUcret(item.ucret)}</p>
              <dl className="acct-rows">
                <div><dt>Müşteri</dt><dd>{item.musteri}</dd></div>
                <div><dt>Durum</dt><dd>{item.durum}</dd></div>
                <div><dt>Süre</dt><dd className="wrap">{item.baslangic} – {item.bitis}</dd></div>
              </dl>
            </aside>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
