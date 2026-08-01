"use client";

import Link from "next/link";
import { AdminShell } from "../AdminShell";

type IconName = "plus";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type ServiceStatus = "aktif" | "pasif";
type ServiceType = {
  code: string; title: string; description: string; order: number; status: ServiceStatus;
};

const serviceTypes: ServiceType[] = [
  { code: "SA",  title: "İstatistiksel Veri Analizi",       description: "",                              order: 1,  status: "aktif" },
  { code: "KPA", title: "Kampanyalı Power Analizi",         description: "3 Power analizi tek fiyat",    order: 2,  status: "pasif" },
  { code: "KDS", title: "Kampanya Online Danışmanlık",      description: "",                              order: 2,  status: "pasif" },
  { code: "PA",  title: "Power Analizi",                    description: "",                              order: 2,  status: "aktif" },
  { code: "ODP", title: "Kampanyalı Online Mentörlük",      description: "3 saatlik mentörlük tek fiyat",order: 2,  status: "pasif" },
  { code: "DS",  title: "Online Mentörlük",                 description: "",                              order: 3,  status: "aktif" },
  { code: "GA",  title: "Graphical Abstract",               description: "",                              order: 6,  status: "aktif" },
  { code: "RV",  title: "Geçerlilik Analizi",               description: "",                              order: 7,  status: "pasif" },
  { code: "PR",  title: "Proforma Fatura",                  description: "",                              order: 8,  status: "aktif" },
  { code: "HP",  title: "Patoloji İnceleme",                description: "İnceleme yapıyoruz",           order: 9,  status: "pasif" },
  { code: "APP", title: "Akademik Mobil Uygulama",          description: "",                              order: 9,  status: "aktif" },
  { code: "RE",  title: "Raporlama",                        description: "",                              order: 10, status: "pasif" },
  { code: "DP",  title: "Veri İşleme",                     description: "",                              order: 11, status: "pasif" },
  { code: "IDP", title: "İstatistiksel Danışmanlık Paketi", description: "",                              order: 12, status: "pasif" },
];

export default function SiparisTurleriPage() {
  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Sipariş Türleri</h1>
            <p>Sistemdeki hizmet türlerini, ücretlendirme ve teslimat yapılarını yönetin.</p>
          </div>
          <Link className="orders-create" href="/admin/siparis-turleri/ekle">
            <Icon name="plus" size={17} />Ekle
          </Link>
        </header>

        <section className="detail-panel st-list-panel">
          <div className="ur-table-wrap">
            <table className="ur-table st-table">
              <thead>
                <tr>
                  <th>Kod</th>
                  <th>Sipariş Türü</th>
                  <th>Açıklama</th>
                  <th>Sıralama</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {serviceTypes.map((st) => (
                  <tr key={st.code} className="st-row">
                    <td className="st-code">{st.code}</td>
                    <td className={st.status === "aktif" ? "st-title-cell active" : "st-title-cell"}>
                      {st.title}
                    </td>
                    <td className="st-desc-cell">{st.description}</td>
                    <td className="st-order-cell">{st.order}</td>
                    <td>
                      <span className={`st-badge ${st.status}`}>
                        {st.status === "aktif" ? "Aktif" : "Pasif"}
                      </span>
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
