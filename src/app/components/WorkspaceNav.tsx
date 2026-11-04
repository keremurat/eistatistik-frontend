"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CustomerEducationMenu } from "./CustomerEducationMenu";
import { CustomerNavIcon } from "./CustomerNavIcon";
import { useAccess } from "./AccessProvider";

export function WorkspaceNav({ kind }: { kind: "customer" | "analyst" }) {
  const pathname = usePathname();
  const { can } = useAccess();

  if (kind === "analyst") {
    return <nav className="main-nav" aria-label="Analizör navigasyonu">
      {can("menu.dashboard") && <Link className={pathname === "/analizor" ? "active" : ""} href="/analizor"><CustomerNavIcon name="overview" />Genel bakış</Link>}
      {can("menu.siparis") && <Link className={pathname.startsWith("/analizor/islerim") ? "active" : ""} href="/analizor/islerim"><CustomerNavIcon name="tasks" />İşlerim</Link>}
      {can("menu.egitim") && <CustomerEducationMenu />}
      {can("menu.gorusme") && <Link className={pathname.startsWith("/analizor/gorusmeler") ? "active" : ""} href="/analizor/gorusmeler"><CustomerNavIcon name="meetings" />Görüşmeler</Link>}
      {can("menu.takvim") && <Link className={pathname.startsWith("/analizor/takvim") ? "active" : ""} href="/analizor/takvim"><CustomerNavIcon name="calendar" />Takvim</Link>}
    </nav>;
  }

  return <nav className="main-nav" aria-label="Ana navigasyon">
    {can("menu.dashboard") && <Link className={pathname === "/dashboard" ? "active" : ""} href="/dashboard"><CustomerNavIcon name="overview" />Genel bakış</Link>}
    {can("menu.siparis") && <Link className={pathname.startsWith("/siparislerim") ? "active" : ""} href="/siparislerim"><CustomerNavIcon name="orders" />Siparişlerim</Link>}
    {can("menu.egitim") && <CustomerEducationMenu />}
    {can("menu.hizmet") && <Link className={pathname.startsWith("/hizmetler") || pathname.startsWith("/yeni-analiz-talebi") ? "active" : ""} href="/hizmetler"><CustomerNavIcon name="services" />Hizmetler</Link>}
  </nav>;
}
