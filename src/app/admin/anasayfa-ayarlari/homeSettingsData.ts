export type HomeStep = { id:string; icon:string; title:string; description:string; videoUrl:string };
export type HomeEducation = { id:string; title:string; format:string; duration:string; price:string; level:string; coverUrl:string; description:string };
export type HomeFaq = { id:string; question:string; answer:string };
export type HomeReview = { id:string; name:string; role:string; institution:string; quote:string; rating:string; avatarUrl:string };
export type HomeSettings = {
  hero:{ badge:string; title:string; description:string; primaryText:string; primaryUrl:string; secondaryText:string; secondaryUrl:string };
  introVideoUrl:string;
  process:{ title:string; intro:string; steps:HomeStep[] };
  educations:HomeEducation[];
  corporate:{ title:string; description:string; benefits:string; buttonText:string; email:string };
  contact:{ email:string; phone:string; address:string; instagram:string; linkedin:string; x:string; facebook:string; googleReview:string };
  visibility:{ services:boolean; blog:boolean; faq:boolean; reviews:boolean };
  faqs:HomeFaq[];
  videos:string[];
  reviews:HomeReview[];
};

const id = (prefix:string,index:number) => `${prefix}-${index + 1}`;
const faqPairs:Array<[string,string]> = [
  ["İstatistik analizi hizmeti ne kadar sürer?","Analiz süresi veri seti büyüklüğüne ve analiz türüne göre değişir. Standart SPSS veya R analizleri genellikle 1–3 iş günü içinde teslim edilir. Acil siparişlerde 24 saat içinde teslimat seçeneği de mevcuttur."],
  ["Hangi istatistik programlarıyla analiz yapıyorsunuz?","SPSS, R, Python, STATA, AMOS, LISREL ve Minitab başta olmak üzere tüm yaygın istatistik yazılımlarıyla analiz gerçekleştiriyoruz. Danışmanınızın talep ettiği program hangisi olursa olsun destek sağlayabiliriz."],
  ["Tez analizi için hangi dosyaları göndermem gerekir?","Ham veri dosyanızı (Excel, SPSS .sav, CSV vb.), anket formunuzu ve tez konunuzu/araştırma sorularınızı paylaşmanız yeterlidir. Sipariş sonrası sistem üzerinden güvenli biçimde yükleyebilirsiniz."],
  ["Fiyatlandırma nasıl belirleniyor?","Fiyat; analiz türü, değişken sayısı ve teslimat süresine göre otomatik olarak hesaplanır. Sipariş formunu doldurduğunuzda fiyat teklifinizi hesabınızdan takip edebilirsiniz. Gizli ek ücret yoktur."],
  ["Analiz sonuçları nasıl teslim edilir?","Analiz çıktıları, yorumlu rapor ve orijinal program çıktıları (SPSS output, R Markdown vb.) ile birlikte platform üzerinden iletilir. Bulguların tez yazımına aktarılması konusunda da destek sunuyoruz."],
  ["Hangi analiz türlerini yapabiliyorsunuz?","Güvenilirlik ve geçerlilik, faktör analizi, regresyon, ANOVA, MANOVA, kümeleme, SEM/YEM, survival analizi, meta-analiz ve daha pek çok yöntem sunulmaktadır."],
  ["Analizin doğruluğu garanti ediliyor mu?","Evet. Tüm analizler alanında uzman istatistikçiler tarafından gerçekleştirilir ve kalite kontrolden geçirilir. Teslim sonrası makul süre içinde revizyon talep etme hakkınız bulunmaktadır."],
  ["İstatistik eğitimi de veriliyor mu?","Evet. Bireysel ve kurumsal istatistik eğitimleri düzenlenmektedir. SPSS, R, Python ve STATA için temel–orta–ileri düzey canlı eğitimler mevcuttur."],
];
const reviewRows = [
  ["Zeynep K.","Yüksek Lisans Öğrencisi","Hacettepe Üniversitesi","SPSS analizlerimi eksiksiz teslim ettiler. Danışmanım sonuçlardan çok memnun kaldı, kesinlikle tavsiye ederim."],
  ["Mehmet A.","Doktora Adayı","İstanbul Üniversitesi","Regresyon ve faktör analizimi iki günde hallettiler. Açıklamalar çok anlaşılır, tez savunmasında sıkıntı yaşamadım."],
  ["Elif S.","Araştırmacı","Marmara Üniversitesi","Kurumsal eğitim programı harika hazırlanmıştı. Ekibimiz SPSS'e hızlıca adapte oldu; pratik ve kaliteli içerik."],
  ["Burak T.","Lisans Öğrencisi","Ege Üniversitesi","Bitirme projem için anket verilerimi yorumlamam gerekiyordu. Detaylı rapor ve yorumlu çıktılar çok işime yaradı."],
  ["Selin Ö.","Yüksek Lisans Öğrencisi","ODTÜ","SEM analizini başka firmalar yapamadı; eistatistik birkaç günde tamamladı. Fiyat performans açısından benzersiz."],
  ["Ahmet D.","Akademisyen","Ankara Üniversitesi","Makale için meta-analiz yaptırdım. Hakemler metodoloji konusunda hiç soru sormadı, süreç tamamen sorunsuz geçti."],
];

export const defaultHomeSettings:HomeSettings = {
  hero:{ badge:"Türkiye’nin lider analiz platformu",title:"Araştırmanızın her adımında netlik.",description:"Uzman desteği, güvenli dosya paylaşımı ve şeffaf süreç yönetimi tek çalışma alanında.",primaryText:"Analiz talebi oluştur",primaryUrl:"/giris",secondaryText:"Platformu görün",secondaryUrl:"#platform" },
  introVideoUrl:"https://www.youtube.com/watch?v=HN2KNjCArLA",
  process:{ title:"Talebinizden teslimata, görünür bir süreç.",intro:"Her adım kayıt altında; siz her zaman nerede olduğunuzu bilirsiniz.",steps:[
    ["file-plus","Talep et","Size uygun analiz türünü seçip talebinizi ve dosyalarınızı güvenle iletin."],
    ["video","Ön inceleme ve online görüşme","Uzman ekibimiz kapsamı incelesin, ihtiyaçlarınızı görüşmede netleştirsin."],
    ["credit-card","Ücretlendirme ve onay","Hazırlanan teklifi hesabınızdan inceleyip onaylayın."],
    ["bar-chart-2","Analiz süreci ve raporlama","Çalışmanız alanında uzman ekip tarafından yürütülsün ve raporlansın."],
    ["package-check","Teslimat ve sonuçların yorumlanması","Rapor, tablo ve çıktılarınız çalışma alanınıza teslim edilsin."],
    ["life-buoy","Ek analiz ve sürekli destek","Teslim sonrasında ek analiz ve iletişim araçlarından yararlanın."],
  ].map((row,index) => ({ id:id("step",index),icon:row[0],title:row[1],description:row[2],videoUrl:"" }))},
  educations:[
    { id:"education-1",title:"Temel Düzey İstatistiksel Veri Analizi",format:"online",duration:"3 Gün",price:"",level:"Başlangıç",coverUrl:"",description:"İstatistiğe giriş, merkezi eğilim ve dağılım ölçüleri, temel hipotez testleri." },
    { id:"education-2",title:"SPSS ile İstatistiksel Analiz",format:"online",duration:"2 Gün",price:"",level:"Orta",coverUrl:"",description:"SPSS ortamında veri girişi, frekans tabloları, parametrik ve non-parametrik testler." },
  ],
  corporate:{ title:"Kurumsal Eğitim",description:"Kurumunuzun ihtiyaçlarına özel, esnek zamanlı ve yüz yüze / online seçenekleriyle sunulan istatistik eğitimleri.",benefits:"İhtiyaç analizine göre özelleştirilmiş müfredat\nOnline veya yüz yüze esnek seçenekler\nSertifikalı eğitim programları\nKurumsal fatura ve KDV’li ödeme",buttonText:"Teklif alın",email:"info@eistatistik.com" },
  contact:{ email:"info@eistatistik.com",phone:"+90 850 885 12 56",address:"Ondokuz Mayıs Üniversitesi, Teknopark, Kurupelit Yerleşkesi, 55139 Atakum/Samsun",instagram:"https://www.instagram.com/eistatistik/",linkedin:"",x:"https://x.com/naci_murat",facebook:"",googleReview:"" },
  visibility:{ services:true,blog:true,faq:true,reviews:true },
  faqs:faqPairs.map(([question,answer],index) => ({ id:id("faq",index),question,answer })),
  videos:["https://www.youtube.com/watch?v=HN2KNjCArLA"],
  reviews:reviewRows.map(([name,role,institution,quote],index) => ({ id:id("review",index),name,role,institution,quote,rating:"5",avatarUrl:"" })),
};

const STORAGE_KEY = "eistatistik.admin.home-settings.v1";
export function readHomeSettings():HomeSettings {
  if (typeof window === "undefined") return defaultHomeSettings;
  try { const value = window.localStorage.getItem(STORAGE_KEY); return value ? { ...defaultHomeSettings,...JSON.parse(value) } : defaultHomeSettings; } catch { return defaultHomeSettings; }
}
export function writeHomeSettings(value:HomeSettings) { if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY,JSON.stringify(value)); }
