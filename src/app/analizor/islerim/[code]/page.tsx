import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SharedOrderDetail } from "../../../admin/siparisler/DS260723008/OrderDetailContent";
import { CustomerEducationMenu } from "../../../components/CustomerEducationMenu";
import { NotificationMenu } from "../../../components/NotificationMenu";
import { ProfileMenu } from "../../../components/ProfileMenu";

const workByCode = {
  SA260803014: "Yüksek lisans tezi veri analizi",
  SA260801009: "Regresyon analizi ve yorumlama",
  EA260729004: "Ek analiz değerlendirmesi",
  PA260802006: "Power ve örneklem analizi",
  SA260728002: "Ölçek geçerlilik ve güvenilirlik analizi",
} as const;

type WorkCode = keyof typeof workByCode;

export function generateStaticParams() {
  return Object.keys(workByCode).map((code) => ({ code }));
}

export default async function AnalystWorkDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const title = workByCode[code as WorkCode];
  if (!title) notFound();

  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" href="/analizor"><Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority /></Link>
      <nav className="main-nav" aria-label="Analizör navigasyonu">
        <Link href="/analizor">Genel bakış</Link>
        <Link className="active" href="/analizor/islerim">İşlerim</Link>
        <CustomerEducationMenu />
        <Link href="/analizor/gorusmeler">Görüşmeler</Link>
        <Link href="/analizor/takvim">Takvim</Link>
      </nav>
      <div className="top-actions">
        <a className="istabot-link" href="https://www.istabot.com/" target="_blank" rel="noopener noreferrer"><Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} /></a>
        <NotificationMenu role="analizor" />
        <ProfileMenu roleLabel="Analizör hesabı" ordersHref="/analizor/islerim" ordersLabel="İşlerim" name="Naci Yılmaz" email="analizor@eistatistik.com" initials="NY" />
      </div>
    </header>
    <Suspense><SharedOrderDetail audience="analizor" orderCode={code} orderTitle={title} /></Suspense>
  </div>;
}
