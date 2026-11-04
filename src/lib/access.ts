const staffSections: [string, string][] = [
  ["/siparisler", "siparis.listele"],
  ["/yeni-analiz-talebi", "siparis.olustur"],
  ["/arsiv", "siparis.listele"],
  ["/egitimler", "menu.egitim"],
  ["/rol-yonetimi", "diger.rol"],
  ["/siparis-turleri", "siparis.dashboard"],
  ["/analizor-degistir", "siparis.analizor"],
  ["/mesaj-sablonlari", "diger.mesaj"],
  ["/egitim-talepleri", "egitim.yonetim"],
  ["/indirim-kodlari", "kupon.listele"],
  ["/kullanici-yonetimi", "kullanici.listele"],
  ["/kullanici", "kullanici.goruntule"],
  ["/toplu-mesaj", "kullanici.whatsapp"],
  ["/randevular", "diger.takvim"],
  ["/duyurular", "diger.duyuru"],
  ["/gorev-isleri", "pano.listele"],
  ["/takvim", "menu.takvim"],
  ["/favori-kategorileri", "siparis.dashboard"],
  ["/proje-muhasebesi", "siparis.dashboard"],
  ["/abonelikler", "diger.dashboard"],
  ["/plan-ayarlari", "diger.dashboard"],
  ["/bultenler", "diger.dashboard"],
  ["/icerikler", "diger.dashboard"],
  ["/bulten-onizleme", "diger.dashboard"],
  ["/hizmetler", "diger.dashboard"],
  ["/analiz-sablonlari", "diger.dashboard"],
  ["/sablon-gorunumu", "diger.dashboard"],
  ["/anasayfa-ayarlari", "diger.dashboard"],
  ["/rehber-adimlari", "diger.dashboard"],
];

const customerRoutes: [string, string][] = [
  ["/siparislerim", "menu.siparis"],
  ["/yeni-analiz-talebi", "siparis.olustur"],
  ["/hizmetler", "menu.hizmet"],
  ["/egitimler", "menu.egitim"],
  ["/dashboard", "menu.dashboard"],
];

const analystRoutes: [string, string][] = [
  ["/analizor/islerim", "menu.siparis"],
  ["/analizor/gorusmeler", "menu.gorusme"],
  ["/analizor/takvim", "menu.takvim"],
  ["/analizor", "menu.dashboard"],
];

function withRoots(roots: string[], sections: [string, string][]) {
  return roots.flatMap(root => sections.map(([path, permission]) => ({ prefix: `${root}${path}`, permission })));
}

const accessRoutes = [
  { prefix: "/admin/dashboard", permission: "menu.dashboard" },
  ...withRoots(["/admin", "/editor", "/asistan"], staffSections),
  ...customerRoutes.map(([prefix, permission]) => ({ prefix, permission })),
  ...analystRoutes.map(([prefix, permission]) => ({ prefix, permission })),
].sort((left, right) => right.prefix.length - left.prefix.length);

export function permissionForPath(pathname: string) {
  return accessRoutes.find(route => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`))?.permission;
}
