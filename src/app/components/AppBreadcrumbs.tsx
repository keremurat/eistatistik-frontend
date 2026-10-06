"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Crumb = {
  href?: string;
  label: string;
};

const SEGMENT_LABELS: Record<string, string> = {
  abonelikler: "Abonelikler",
  "analiz-sablonlari": "Analiz şablonları",
  "analizor-degistir": "Analizör değiştir",
  "anasayfa-ayarlari": "Anasayfa ayarları",
  arsiv: "Arşiv",
  ayarlar: "Ayarlar",
  "bulten-onizleme": "Bülten önizleme",
  bultenler: "Bültenler",
  "ders-listesi": "Ders listesi",
  duzenle: "Düzenle",
  duyurular: "Duyurular",
  "egitim-listesi": "Eğitim listesi",
  "egitim-talepleri": "Eğitim talepleri",
  egitimler: "Eğitimler",
  ekle: "Yeni ekle",
  "favori-kategorileri": "Favori kategorileri",
  "gorev-isleri": "Görev işlemleri",
  "gorev-listesi": "Görev listesi",
  "gorev-listesi-kart": "Görev panosu",
  gorusmeler: "Görüşmeler",
  hizmetler: "Hizmetler",
  icerik: "İçerik",
  icerikler: "İçerikler",
  "indirim-kodlari": "İndirim kodları",
  islerim: "İşlerim",
  istekler: "Eğitim istekleri",
  katalog: "Eğitim kataloğu",
  kullanici: "Kullanıcı",
  "kullanici-yonetimi": "Kullanıcı yönetimi",
  kullanicilar: "Kullanıcılar",
  "mentorluk-ayari": "Mentörlük ayarları",
  "mesaj-sablonlari": "Mesaj şablonları",
  "modul-listesi": "Modül listesi",
  "plan-ayarlari": "Plan ayarları",
  "proje-muhasebesi": "Proje muhasebesi",
  randevular: "Randevular",
  "rehber-adimlari": "Rehber adımları",
  "rol-yonetimi": "Rol yönetimi",
  "sablon-gorunumu": "Şablon görünümü",
  "satin-alinan": "Satın alınan eğitimler",
  siparisler: "Siparişler",
  siparislerim: "Siparişlerim",
  "siparis-turleri": "Sipariş türleri",
  takvim: "Takvim",
  "toplu-mesaj": "Toplu mesaj",
  yonetim: "Yönetim",
  yeni: "Yeni eğitim satın al",
  "yeni-analiz-talebi": "Yeni analiz talebi",
  "5li-bir-arada": "5'li bir arada",
};

const NON_LINKABLE_PATHS = new Set([
  "/admin/bultenler/icerik",
  "/admin/egitimler",
  "/admin/egitim-talepleri",
  "/admin/gorev-isleri",
  "/asistan/egitimler",
  "/asistan/yonetim",
  "/editor/egitimler",
  "/editor/egitim-talepleri",
  "/editor/gorev-isleri",
]);

const APP_ROUTE = /^(\/dashboard|\/siparislerim(?:\/|$)|\/ayarlar$|\/yeni-analiz-talebi$|\/egitimler(?:\/katalog|\/5li-bir-arada)?\/?$|\/hizmetler\/?$|\/(?:admin|analizor|asistan|editor)(?:\/|$))/;

function Chevron() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>;
}

function titleFromSegment(segment: string, index: number, segments: string[]) {
  const decoded = decodeURIComponent(segment);
  if (SEGMENT_LABELS[decoded]) return SEGMENT_LABELS[decoded];
  if (/^[A-Z]{2}\d{6,}$/i.test(decoded)) return decoded.toUpperCase();
  if (/^\d+$/.test(decoded)) return index === segments.length - 1 ? "Detay" : decoded;
  return decoded
    .replaceAll("-", " ")
    .replace(/^./u, (letter) => letter.toLocaleUpperCase("tr-TR"));
}

function createCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const role = ["admin", "analizor", "asistan", "editor"].includes(segments[0]) ? segments[0] : null;
  const homeHref = role ? `/${role}` : "/dashboard";
  const routeSegments = role ? segments.slice(1) : segments[0] === "dashboard" ? [] : segments;

  if (routeSegments.length === 0) return [{ label: "Anasayfa" }];

  const crumbs: Crumb[] = [{ href: homeHref, label: "Anasayfa" }];
  routeSegments.forEach((segment, index) => {
    const consumed = routeSegments.slice(0, index + 1);
    const href = `${role ? `/${role}` : ""}/${consumed.join("/")}`;
    const isCurrent = index === routeSegments.length - 1;
    crumbs.push({
      href: !isCurrent && !NON_LINKABLE_PATHS.has(href) ? href : undefined,
      label: titleFromSegment(segment, index, routeSegments),
    });
  });
  return crumbs;
}

export function AppBreadcrumbs() {
  const pathname = usePathname();
  if (!APP_ROUTE.test(pathname)) return null;

  const crumbs = createCrumbs(pathname);
  return <nav className="app-breadcrumb" aria-label="Sayfa yolu">
    <ol>
      {crumbs.map((crumb, index) => {
        const current = index === crumbs.length - 1;
        return <li key={`${crumb.label}-${index}`}>
          {index > 0 && <span className="app-breadcrumb-separator"><Chevron /></span>}
          {crumb.href && !current
            ? <Link href={crumb.href}>{crumb.label}</Link>
            : <span aria-current={current ? "page" : undefined}>{crumb.label}</span>}
        </li>;
      })}
    </ol>
  </nav>;
}
