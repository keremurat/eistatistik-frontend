export type Hizmet = {
  id: string;
  sira: number;
  baslik: string;
  slug: string;
  kartOzeti: string;
  icerik: string;
  ikon: string;       // lucide icon adı
  videoUrl: string;
  seoMeta: string;
  aktif: boolean;
};

export const HIZMETLER: Hizmet[] = [
  {
    id: "h1", sira: 1,
    baslik: "İstatistiksel Veri Analizi ve Akademik Danışmanlık",
    slug: "istatistiksel-veri-analizi",
    kartOzeti: "Tez, makale ve projeler için SPSS, R ve güncel yazılımlarla akademik standartlarda veri analizi ve danışmanlık.",
    icerik: "Bilimsel araştırmaların başarısı yalnızca veri toplamakla değil, doğru planlama, doğru analiz ve doğru raporlama süreçlerinin yürütülmesiyle mümkündür.\n\nAraştırmanızın ilk aşamasından yayın sürecine kadar ihtiyaç duyduğunuz tüm istatistiksel destekleri tek çatı altında sunuyoruz.",
    ikon: "bar-chart-2",
    videoUrl: "https://www.youtube.com/embed/Oqz",
    seoMeta: "Yüksek lisans, doktora ve uzmanlık tezleri ile akademik makaleler için profesyonel istatistiksel veri analizi, raporlama ve danışmanlık hizmeti.",
    aktif: true,
  },
  {
    id: "h2", sira: 2,
    baslik: "Güç Analizi (Power Analizi) ve Örneklem Büyüklüğü Hesaplama",
    slug: "guc-analizi-power-analizi",
    kartOzeti: "Araştırmanızın ihtiyaç duyduğu örneklem büyüklüğünü ve istatistiksel gücü güvenle planlayın.",
    icerik: "Örneklem büyüklüğü ve istatistiksel güç, araştırma tasarımının en kritik parçalarındandır.",
    ikon: "target",
    videoUrl: "https://www.youtube.com/embed/abc",
    seoMeta: "G*Power ile güç analizi ve örneklem büyüklüğü hesaplama; araştırma planlaması için profesyonel danışmanlık.",
    aktif: true,
  },
  {
    id: "h3", sira: 3,
    baslik: "Proforma Fatura ve Akademik Proje Bütçe Teklifi",
    slug: "proforma-fatura",
    kartOzeti: "Kurumsal satın alma ve akademik bütçe süreçleri için gerekli proforma belgelerinizi oluşturun.",
    icerik: "Kurumsal satın alma ve bütçe onay süreçleri için proforma fatura ve bütçe teklifleri hazırlıyoruz.",
    ikon: "file-text",
    videoUrl: "https://www.youtube.com/embed/def",
    seoMeta: "Akademik proje bütçe teklifi ve proforma fatura hizmeti.",
    aktif: true,
  },
  {
    id: "h4", sira: 4,
    baslik: "Online İstatistik Danışmanlığı ve Akademik Araştırma Danışmanlığı",
    slug: "online-istatistik-danismanligi",
    kartOzeti: "Yöntem, bulgular ve akademik süreç boyunca alanında deneyimli bir uzmanla birebir çalışın.",
    icerik: "Araştırma yöntemi, bulgular ve yayın süreci boyunca birebir online danışmanlık.",
    ikon: "activity",
    videoUrl: "https://www.youtube.com/embed/ghi",
    seoMeta: "Online istatistik ve akademik araştırma danışmanlığı; birebir uzman desteği.",
    aktif: true,
  },
];

export function getHizmet(id: string) { return HIZMETLER.find((h) => h.id === id); }

export function slugify(text: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u" };
  return text.toLocaleLowerCase("tr").replace(/[çğıİöşü]/g, (c) => map[c] ?? c).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
