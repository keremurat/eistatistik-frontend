export type RolKey = "admin" | "analyzer" | "customer" | "editor" | "asistan";
export type PermCategory = "menu" | "siparis" | "egitim" | "kupon" | "kullanici" | "pano" | "diger";

export type Permission = {
  key: string;
  label: string;
  category: PermCategory;
};

export type Rol = {
  key: RolKey;
  adi: string;
  aciklama: string;
  gorevAtamasi: boolean;
  perms: Set<string>;
};

export const CATEGORIES: { key: PermCategory; label: string }[] = [
  { key: "menu",      label: "Menü" },
  { key: "siparis",   label: "Sipariş" },
  { key: "egitim",    label: "Eğitim" },
  { key: "kupon",     label: "Kupon" },
  { key: "kullanici", label: "Kullanıcı" },
  { key: "pano",      label: "Pano" },
  { key: "diger",     label: "Diğer" },
];

export const ALL_PERMS: Permission[] = [
  // Menü
  { key: "menu.siparis",        label: "Sipariş Menüsü",           category: "menu" },
  { key: "menu.egitim",         label: "Eğitim Menüsü",            category: "menu" },
  { key: "menu.indirim",        label: "İndirim Kodu Menüsü",      category: "menu" },
  { key: "menu.kullanici",      label: "Kullanıcı Menüsü",         category: "menu" },
  { key: "menu.pano",           label: "Pano Menüsü",              category: "menu" },
  { key: "menu.duyuru",         label: "Duyuru Menüsü",            category: "menu" },
  { key: "menu.mesaj",          label: "Mesaj Şablonları Menüsü",  category: "menu" },
  { key: "menu.dashboard",      label: "Dashboard Menüsü",         category: "menu" },
  { key: "menu.takvim",         label: "Takvim Menüsü",            category: "menu" },

  // Sipariş
  { key: "siparis.listele",     label: "Sipariş Listele",          category: "siparis" },
  { key: "siparis.goruntule",   label: "Sipariş Görüntüle",        category: "siparis" },
  { key: "siparis.olustur",     label: "Sipariş Oluştur",          category: "siparis" },
  { key: "siparis.sil",         label: "Sipariş Sil",              category: "siparis" },
  { key: "siparis.dashboard",   label: "Sipariş Dashboard",        category: "siparis" },
  { key: "siparis.analizor",    label: "Analizör Atama",           category: "siparis" },
  { key: "siparis.tum_yazisma", label: "Tüm Yazışmalar",           category: "siparis" },
  { key: "siparis.eft",         label: "EFT/Havale Kayıt",         category: "siparis" },
  { key: "siparis.kredi",       label: "Kredi Kartı İşlemi",       category: "siparis" },
  { key: "siparis.iptal",       label: "Sipariş İptal",            category: "siparis" },
  { key: "siparis.teslim",      label: "Teslim Et",                category: "siparis" },

  // Eğitim
  { key: "egitim.listele",      label: "Eğitim Listele",           category: "egitim" },
  { key: "egitim.goruntule",    label: "Eğitim Görüntüle",         category: "egitim" },
  { key: "egitim.olustur",      label: "Eğitim Oluştur",           category: "egitim" },
  { key: "egitim.guncelle",     label: "Eğitim Güncelle",          category: "egitim" },
  { key: "egitim.sil",          label: "Eğitim Sil",               category: "egitim" },
  { key: "egitim.yonetim",      label: "Eğitim Yönetim Düzenle",   category: "egitim" },
  { key: "egitim.icerik",       label: "Eğitim İçeriklerine Eriş", category: "egitim" },

  // Kupon
  { key: "kupon.listele",       label: "Kupon Listele",            category: "kupon" },
  { key: "kupon.olustur",       label: "Kupon Oluştur",            category: "kupon" },
  { key: "kupon.goruntule",     label: "Kupon Görüntüle",          category: "kupon" },
  { key: "kupon.guncelle",      label: "Kupon Güncelle",           category: "kupon" },
  { key: "kupon.sil",           label: "Kupon Sil",                category: "kupon" },
  { key: "kupon.siparis_tanimla", label: "İndirim Kodu Tanımla (Sipariş)", category: "kupon" },

  // Kullanıcı
  { key: "kullanici.listele",   label: "Kullanıcı Listele",        category: "kullanici" },
  { key: "kullanici.goruntule", label: "Kullanıcı Görüntüle",      category: "kullanici" },
  { key: "kullanici.duzenle",   label: "Kullanıcı Düzenle",        category: "kullanici" },
  { key: "kullanici.guncelle",  label: "Kullanıcı Güncelle",       category: "kullanici" },
  { key: "kullanici.sil",       label: "Kullanıcı Sil",            category: "kullanici" },
  { key: "kullanici.rapor",     label: "Müşteri Raporları",        category: "kullanici" },
  { key: "kullanici.whatsapp",  label: "Toplu Mesaj (WhatsApp)",   category: "kullanici" },

  // Pano
  { key: "pano.listele",        label: "Pano Listele",             category: "pano" },
  { key: "pano.olustur",        label: "Pano Oluştur",             category: "pano" },
  { key: "pano.duzenle",        label: "Pano Düzenle",             category: "pano" },
  { key: "pano.sil",            label: "Pano Sil",                 category: "pano" },
  { key: "kart.olustur",        label: "Kart Oluştur",             category: "pano" },
  { key: "kart.duzenle",        label: "Kart Düzenle",             category: "pano" },
  { key: "kart.sil",            label: "Kart Sil",                 category: "pano" },

  // Diğer
  { key: "diger.duyuru",        label: "Duyuru Yönetimi",          category: "diger" },
  { key: "diger.mesaj",         label: "Mesaj Şablonu Yönetimi",   category: "diger" },
  { key: "diger.takvim",        label: "Takvim Görüntüle",         category: "diger" },
  { key: "diger.dashboard",     label: "Dashboard Metrikleri",      category: "diger" },
  { key: "diger.rol",           label: "Rol Düzenleme",            category: "diger" },
];

const adminPerms = new Set(ALL_PERMS.map((p) => p.key));

const analyzerPerms = new Set([
  "menu.siparis","menu.egitim","menu.indirim","menu.pano","menu.dashboard",
  "siparis.listele","siparis.goruntule","siparis.dashboard","siparis.tum_yazisma",
  "siparis.analizor","siparis.eft","siparis.kredi","siparis.teslim",
  "egitim.listele","egitim.goruntule","egitim.icerik",
  "kupon.siparis_tanimla",
  "pano.listele","pano.olustur","pano.duzenle","kart.olustur","kart.duzenle",
  "diger.takvim","diger.dashboard",
]);

const customerPerms = new Set([
  "menu.siparis","menu.egitim","menu.dashboard",
  "siparis.listele","siparis.goruntule","siparis.olustur","siparis.eft","siparis.kredi",
  "egitim.listele","egitim.goruntule","egitim.icerik",
  "diger.takvim",
]);

const editorPerms = new Set([
  "menu.siparis","menu.egitim","menu.indirim","menu.kullanici","menu.pano","menu.duyuru","menu.mesaj","menu.dashboard","menu.takvim",
  "siparis.listele","siparis.goruntule","siparis.dashboard","siparis.tum_yazisma","siparis.analizor","siparis.eft","siparis.kredi","siparis.iptal","siparis.teslim",
  "egitim.listele","egitim.goruntule","egitim.olustur","egitim.guncelle","egitim.sil","egitim.yonetim","egitim.icerik",
  "kupon.listele","kupon.olustur","kupon.goruntule","kupon.guncelle","kupon.sil","kupon.siparis_tanimla",
  "kullanici.listele","kullanici.goruntule","kullanici.duzenle","kullanici.guncelle","kullanici.rapor",
  "pano.listele","pano.olustur","pano.duzenle","kart.olustur","kart.duzenle",
  "diger.duyuru","diger.mesaj","diger.takvim","diger.dashboard",
]);

const asistanPerms = new Set([
  "menu.siparis","menu.egitim","menu.indirim","menu.kullanici","menu.pano","menu.duyuru","menu.dashboard","menu.takvim",
  "siparis.listele","siparis.goruntule","siparis.dashboard","siparis.tum_yazisma","siparis.analizor","siparis.eft","siparis.kredi","siparis.iptal","siparis.teslim",
  "egitim.listele","egitim.goruntule","egitim.olustur","egitim.guncelle","egitim.icerik",
  "kupon.listele","kupon.goruntule","kupon.siparis_tanimla",
  "kullanici.listele","kullanici.goruntule","kullanici.rapor","kullanici.whatsapp",
  "pano.listele","pano.olustur","pano.duzenle","kart.olustur","kart.duzenle",
  "diger.duyuru","diger.takvim","diger.dashboard",
]);

export const ROLLER: Rol[] = [
  { key: "admin",    adi: "admin",    aciklama: "Tüm sistem yetkilerine sahip süper yönetici.",         gorevAtamasi: false, perms: adminPerms   },
  { key: "analyzer", adi: "analyzer", aciklama: "Analiz ve sipariş süreçlerini yürüten analizör.",       gorevAtamasi: true,  perms: analyzerPerms },
  { key: "customer", adi: "customer", aciklama: "Sipariş verebilen ve eğitimlere erişen müşteri rolü.", gorevAtamasi: false, perms: customerPerms },
  { key: "editor",   adi: "editor",   aciklama: "Geniş yetkili düzenleyici; rol yönetimi dışında tam.", gorevAtamasi: false, perms: editorPerms  },
  { key: "asistan",  adi: "asistan",  aciklama: "Analizöre destek veren ve görev alabilen yardımcı.",   gorevAtamasi: true,  perms: asistanPerms  },
];
