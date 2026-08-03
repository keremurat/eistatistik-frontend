export type DuyuruDurum = "Aktif" | "Pasif";

export type Duyuru = {
  id: number;
  baslik: string;
  icerik: string;
  eklemeTarihi: string;
  yayinTarihi: string;
  durum: DuyuruDurum;
  modalGoster: boolean;
};

export const DUYURULAR: Duyuru[] = [
  {
    id: 42,
    baslik: "15 TEMMUZ RESMİ TATİL DUYURUSU",
    icerik: `**SİPARİŞLERİN TESLİMİ**

Değerli Hocalarımız,

15 Temmuz resmi tatil dolayısıyla, bu tarihi kapsayan tüm analizlerin teslimat sürelerinde, ilgili resmi tatil gün sayısı kadar (**1 iş günü**) ertelenme yaşanacaktır.

Bilgilerinize sunar, anlayışınız için teşekkür ederiz.

Saygılarımızla`,
    eklemeTarihi: "21.04.2026 08:29",
    yayinTarihi: "13.07.2026 09:00",
    durum: "Aktif",
    modalGoster: true,
  },
  {
    id: 41,
    baslik: "BAYRAM TATİLİ",
    icerik: `**SİPARİŞLERİN TESLİMİ**

Değerli Hocalarımız,

Sevdiklerinizle birlikte sağlıklı, huzurlu ve mutlu bir Ramazan Bayramı geçirmenizi diler, bayramın bereketi ve huzurunun tüm yıl boyunca sizinle olmasını temenni ederiz.

**ÖNEMLİ BİLGİLENDİRME**

Bayram tatili nedeniyle, teslimatı resmi tatil gününe denk gelen siparişlerimizin teslimat süresi, resmi tatil gün sayısı kadar **{1,5 gün}** uzayacaktır.

Bilgilerinize sunar, anlayışınız için teşekkür ederiz.

Saygılarımızla`,
    eklemeTarihi: "18.03.2026 11:38",
    yayinTarihi: "18.03.2026 11:00",
    durum: "Pasif",
    modalGoster: false,
  },
  {
    id: 40,
    baslik: "Ramazan Ayı Çalışma Saatleri Duyurusu",
    icerik: `Değerli Hocalarımız,

Ramazan ayı boyunca çalışma saatlerimiz ***08:00 – 17:00*** olarak düzenlenmiştir. Bu saatler içerisinde sizlere hizmet vermeye devam edeceğiz.

Anlayışınız için teşekkür eder, hayırlı ve bereketli bir Ramazan ayı dileriz.

Saygılarımızla`,
    eklemeTarihi: "14.02.2026 12:05",
    yayinTarihi: "16.02.2026 10:00",
    durum: "Pasif",
    modalGoster: false,
  },
  {
    id: 39,
    baslik: "Yılbaşı Resmi Tatil Duyurusu",
    icerik: `**SİPARİŞLERİN TESLİMİ**

Değerli Hocalarımız,

1 Ocak resmi tatil nedeniyle; 1 Ocak gününe denk gelen analizlerin teslimat süreleri **1 iş günü** uzayacaktır.

Bilgilerinize sunar, sağlıklı ve huzurlu bir yıl geçirmenizi dileriz.`,
    eklemeTarihi: "29.12.2025 09:13",
    yayinTarihi: "29.12.2025 09:00",
    durum: "Pasif",
    modalGoster: false,
  },
  {
    id: 38,
    baslik: "RESMİ TATİL",
    icerik: `**BİLGİLENDİRME**

***30 Ağustos Zafer Bayramı***, resmi tatil kapsamında olduğundan dolayı, 30 Ağustos cumartesi günü kurumumuzda mesai yapılmayacaktır.

Çalışmalarımız 1 Eylül tarihinde kaldığı yerden devam edecektir.

Saygılarımızla`,
    eklemeTarihi: "29.08.2025 14:48",
    yayinTarihi: "29.08.2025 15:00",
    durum: "Pasif",
    modalGoster: false,
  },
  {
    id: 37,
    baslik: "29 EKİM RESMİ TATİL",
    icerik: `**Duyuru: 29 Ekim Cumhuriyet Bayramı Teslimat Bilgilendirmesi**

Değerli Hocalarımız, 29 Ekim Cumhuriyet Bayramı nedeniyle 28 Ekim Salı günü yarım gün, 29 Ekim Çarşamba günü ise tam gün resmi tatil olacaktır.

Bu kapsamda, **29 Ekim Çarşamba gününe denk gelen gönderilerinizin teslimat süreleri 1 iş günü uzayacaktır.**

Teslimatlar, resmi tatil sonrasında planlanan sırayla gerçekleştirilecektir.

Anlayışınız için teşekkür eder, Cumhuriyet Bayramınızı kutlarız.

Saygılarımızla`,
    eklemeTarihi: "01.05.2025 15:33",
    yayinTarihi: "23.10.2025 17:00",
    durum: "Pasif",
    modalGoster: false,
  },
];
