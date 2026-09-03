export type Sablon = {
  id: string;
  sira: number;
  baslik: string;
  aciklama: string;
  videoUrl: string;
  dosya: string;
  yayinda: boolean;
};

export const SABLONLAR: Sablon[] = [
  { id: "s1", sira: 1, baslik: "SPSS Çıktı Raporlama Şablonu", aciklama: "Analiz çıktılarının akademik raporda nasıl sunulacağını gösteren örnek şablon.", videoUrl: "https://www.youtube.com/watch?v=xrNzkArvkdc", dosya: "SPSS-Rapor-Sablonu.docx", yayinda: true },
  { id: "s2", sira: 2, baslik: "APA Tablo Formatı Şablonu", aciklama: "APA 7 standardına uygun tablo ve şekil düzeni için hazır şablon.", videoUrl: "", dosya: "APA-Tablo-Sablonu.docx", yayinda: true },
  { id: "s3", sira: 3, baslik: "Power Analizi Sunum Şablonu", aciklama: "G*Power çıktılarının müşteriye sunumu için örnek video anlatım.", videoUrl: "https://www.youtube.com/watch?v=abc", dosya: "", yayinda: false },
];

export function getSablon(id: string) { return SABLONLAR.find((s) => s.id === id); }
