// Bireysel eğitim modülleri — katalog kartları ve modül detay sayfaları bu tek kaynaktan beslenir.
// Görseller /public/egitimler/*.webp; içerik şimdilik statik/prototip.

export type EduModule = {
  slug: string;
  tag: string;
  title: string;
  days: string;
  img: string;
  tone: string;
};

export const modules: EduModule[] = [
  { slug: "bilimsel-arastirmalarda-microsoft-office-endnote", tag: "Başlangıç", title: "Bilimsel Araştırmalarda Microsoft Office ve EndNote Uygulamaları", days: "5 Gün", img: "/egitimler/1.webp", tone: "navy" },
  { slug: "temel-duzey-istatistiksel-veri-analizi", tag: "Modül 1", title: "Temel Düzey İstatistiksel Veri Analizi Eğitimi", days: "5 Gün", img: "/egitimler/2.webp", tone: "blue" },
  { slug: "ileri-duzey-istatistiksel-veri-analizi", tag: "Modül 2", title: "İleri Düzey İstatistiksel Veri Analizi Eğitimi", days: "5 Gün", img: "/egitimler/3.webp", tone: "green" },
  { slug: "olcek-gelistirme-yapisal-esitlik", tag: "Modül 3", title: "Ölçek Geliştirme ve Yapısal Eşitlik Modellemesi", days: "5 Gün", img: "/egitimler/4.webp", tone: "purple" },
  { slug: "gpower-guc-analizi", tag: "Modül 4", title: "GPower ile Güç Analizi Eğitimi", days: "5 Gün", img: "/egitimler/5.webp", tone: "orange" },
  { slug: "meta-analizi", tag: "Modül 6", title: "Meta Analizi Eğitimi", days: "5 Gün", img: "/egitimler/6.webp", tone: "sand" },
  { slug: "kategorik-veri-analizi", tag: "Modül 7", title: "Kategorik Veri Analizi", days: "5 Gün", img: "/egitimler/7.webp", tone: "blue" },
  { slug: "istatistiksel-okuryazarlik", tag: "Modül 8", title: "İstatistiksel Okuryazarlık", days: "5 Gün", img: "/egitimler/8.webp", tone: "navy" },
  { slug: "bilimsel-calisma-planlama", tag: "Modül 9", title: "Bilimsel Çalışma Planlama", days: "5 Gün", img: "/egitimler/9.webp", tone: "green" },
  { slug: "nitel-arastirma-nitel-veri-analizi", tag: "Modül 10", title: "Nitel Araştırmaya Giriş ve Nitel Veri Analizi", days: "5 Gün", img: "/egitimler/10.webp", tone: "purple" },
  { slug: "lineer-meta-regresyon-analizi", tag: "Modül 11", title: "Lineer ve Meta Regresyon Analizi", days: "2 Gün", img: "/egitimler/11.webp", tone: "orange" },
  { slug: "graphical-abstract", tag: "Modül 12", title: "Graphical Abstract Eğitimi", days: "5 Gün", img: "/egitimler/12.webp", tone: "sand" },
  { slug: "veri-kazima-metin-madenciligi", tag: "Modül 14", title: "Veri Kazıma ve Metin Madenciliği Eğitimi", days: "5 Gün", img: "/egitimler/13.webp", tone: "blue" },
  { slug: "bibliyometrik-veri-analizi", tag: "Modül 15", title: "Bibliyometrik Veri Analizi Eğitimi", days: "2 Gün", img: "/egitimler/14.webp", tone: "navy" },
  { slug: "yapisal-esitlik-modellemesi", tag: "Modül 16", title: "Yapısal Eşitlik Modellemesi Eğitimi", days: "1 Gün", img: "/egitimler/15.webp", tone: "green" },
  { slug: "duzenleyici-etki-analizi", tag: "Modül 17", title: "Düzenleyici Etki Analizi Eğitimi", days: "1 Gün", img: "/egitimler/16.webp", tone: "purple" },
  { slug: "araci-etki-analizi", tag: "Modül 18", title: "Aracı Etki Analizi Eğitimi", days: "1 Gün", img: "/egitimler/17.webp", tone: "orange" },
];

export type EduDetail = {
  kontenjan: string;
  sertifika: string;
  level: string;
  note: string;
  /** Modüle özel tanıtım videosu (YouTube ID). Varsa banner yerine sessiz otomatik oynatılır. */
  videoId?: string;
  content: string[];
  materials: string[];
  faqs: Array<[string, string]>;
  gallery: string[];
};

const defaultMaterials = ["Alana özgü hazırlanmış ders notları", "Tüm derslere ait video kayıtları"];
// Galeri, Instagram gönderi kısa kodlarını tutar (instagram.com/p/<kod>). Embed olarak önizlenir.
const defaultGallery = ["CafiJ6ntKJL", "CTu9cBlKW5r"];

const defaultFaqs: Array<[string, string]> = [
  ["Eğitim süresi ne kadar?", "Eğitim süresi modülün kapsamına göre belirlenir; program içeriği ve uygulama seansları bu süreye göre planlanır."],
  ["Eğitimden sonra destek alabiliyor muyuz?", "Evet. Eğitim sonunda belirli bir süre boyunca online mentörlük desteği sunulur; amaç kendi analizlerinizi doğru biçimde yürütebilmenizdir."],
  ["Eğitim videolarına erişim sınırı var mı?", "Derslere ait video kayıtlarına eğitim kapsamında tanımlı süre boyunca çalışma alanınızdan erişebilirsiniz."],
  ["Online eğitimlerde sorun yaşadığımızda nasıl bir süreç izlenir?", "Teknik veya içerik kaynaklı bir sorun yaşarsanız destek ekibimize ulaşabilir, çözüm için sizinle birlikte ilerleriz."],
  ["Eğitimden sonra da kendi analizlerimi yapabilecek miyim?", "Eğitimin amacı analizleri kendi başınıza yürütebilecek yetkinliğe ulaşmanızdır; mentörlük desteği bu süreçte doğrulama sağlar."],
  ["Eğitimlerde makale okuması yapılıyor mu?", "Konuya uygun örnek makaleler üzerinden yöntem ve raporlama tartışılarak uygulamalı okuma yapılır."],
];

const mentorNote = (tag: string) =>
  `Eğitim sonunda katılımcılarımıza 6 ay boyunca 2 haftada bir çarşamba günleri online mentörlük desteği sunulmaktadır. Bu desteğin amacı analizlerin tarafımızca yapılması değil, sizler tarafından yapılan analizlerin doğruluğunun kontrolüdür. Kontenjan ile sınırlı eğitimde yerinizi almak için bizimle irtibat kurunuz. Eğitim aktif olduğunda web sayfamız üzerinden Eğitim Talebi sekmesine girerek “${tag}” kodlu eğitime kaydınızı yapabilirsiniz. Kayıt işleminden sonra sizlerle gerekli tüm dokümanlar paylaşılacaktır.`;

function defaultContent(module: EduModule): string[] {
  return [
    `${module.title} kapsamında temel kavramların ele alınması`,
    "Yöntemin araştırma tasarımındaki yeri ve doğru kullanımı",
    "Uygun analiz seçimi ve varsayımların kontrolü",
    "Uygulamalı örneklerle adım adım çözümleme",
    "Program çıktılarının doğru okunması",
    "Sonuçların akademik biçimde yorumlanması ve raporlanması",
  ];
}

// Ekran görüntülerinden gelen, modüle özel gerçek içerik. Diğer modüller varsayılanları kullanır.
const overrides: Record<string, Partial<EduDetail>> = {
  "bilimsel-arastirmalarda-microsoft-office-endnote": {
    videoId: "cb6QgsbGeWw",
    content: [
      "Microsoft Word ile bilimsel çalışma süreci pratikleri",
      "Microsoft Excel ile veri işleme, görselleştirme ve özet tablo özellikleri",
      "EndNote ile kaynakça yönetimi",
      "Online veri toplama ve paket programa aktarma süreçleri",
      "Bilimsel çalışma planlama sürecinde istatistiğin önemi",
      "Etik kurul başvurusunda istatistiksel süreç",
      "Power analizi ve örneklem genişliği",
      "Temel istatistiksel kavramlar",
      "İstatistiksel test seçim yöntemleri",
    ],
  },
  "temel-duzey-istatistiksel-veri-analizi": {
    videoId: "jdYNW2fze2k",
    gallery: ["CiSsBnHqT2A", "CiN1XPGqkM3", "Ce_xEcrqh-H"],
    content: [
      "IBM SPSS'in genel tanıtımı",
      "Veri girişi ve veri dönüştürme işlemleri",
      "Tanımlayıcı istatistiklerin elde edilmesi",
      "Normallik testleri",
      "Parametrik ve parametrik olmayan yöntemler",
      "Basit ve kısmi korelasyon",
      "Ki-kare testi",
      "Test seçim yöntemi için geliştirdiğimiz “Analiz Seçim Diyagramı”nın kullanımı",
      "Raporlama teknikleri için geliştirilen Excel formülleri ile tablolaştırma",
      "Veri görselleştirme",
      "Makale okuryazarlığı saati",
    ],
    materials: [
      "Alana özgü hazırlanmış ders notları",
      "Alana özgü veri setleri",
      "Microsoft Word örnek rapor şablonları",
      "Analiz Seçim Diyagramı",
      "Tüm derslere ait video kayıtları",
    ],
  },
};

export function getModule(slug: string): EduModule | undefined {
  return modules.find((module) => module.slug === slug);
}

export function getDetail(module: EduModule): EduDetail {
  const override = overrides[module.slug] ?? {};
  return {
    kontenjan: override.kontenjan ?? "30 Kişi",
    sertifika: override.sertifika ?? "Eğitimi alan tüm kursiyerlere verilecektir.",
    level: override.level ?? module.tag,
    videoId: override.videoId,
    note: override.note ?? mentorNote(module.tag),
    content: override.content ?? defaultContent(module),
    materials: override.materials ?? defaultMaterials,
    faqs: override.faqs ?? defaultFaqs,
    gallery: override.gallery ?? defaultGallery,
  };
}
