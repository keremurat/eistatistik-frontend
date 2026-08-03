export type KullaniciTur    = "Bireysel" | "Kurumsal";
export type KullaniciDurum  = "Aktif" | "Pasif";
export type KullaniciRol    = "Müşteri" | "Admin" | "Analist" | "Editör" | "Asistan";

export type Siparis = {
  kod: string;
  hizmet: string;
  tarih: string;
  tutar: number;
  durum: "yapiliyor" | "teslim" | "beklemede" | "iptal";
};

export type EgitimTalebi = {
  egitim: string;
  tarih: string;
  durum: "devam" | "tamamlandi" | "beklemede";
};

export type AktiviteKaydi = {
  tarih: string;
  islem: string;
  ip: string;
};

export type CariHareket = {
  tarih: string;
  aciklama: string;
  tutar: number;
  tur: "odeme" | "iade" | "borc";
};

export type Kullanici = {
  id: number;
  adSoyad: string;
  eposta: string;
  gsm: string;
  tur: KullaniciTur;
  durum: KullaniciDurum;
  rol: KullaniciRol;
  kayitTarihi: string;
  universite?: string;
  fakulte?: string;
  bolum?: string;
  il?: string;
  ilce?: string;
  adres?: string;
  siparisler: Siparis[];
  egitimTalepleri: EgitimTalebi[];
  aktivite: AktiviteKaydi[];
  cariHareketler: CariHareket[];
};

export const KULLANICILAR: Kullanici[] = [
  {
    id: 10157, adSoyad: "EBRU BUKET ERKEN", eposta: "ebrubuket11058@gmail.com",
    gsm: "5438425414", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "12.03.2025",
    universite: "İstanbul Üniversitesi", fakulte: "İktisat Fakültesi", bolum: "İktisat",
    il: "İstanbul", ilce: "Kadıköy", adres: "Moda Cad. No:12",
    siparisler: [
      { kod: "DS120325001", hizmet: "SPSS Analizi", tarih: "15.03.2025", tutar: 1200, durum: "teslim" },
      { kod: "DS120325002", hizmet: "Anket Değerlendirme", tarih: "20.04.2025", tutar: 850, durum: "yapiliyor" },
    ],
    egitimTalepleri: [
      { egitim: "SPSS Temel Eğitim", tarih: "01.04.2025", durum: "tamamlandi" },
    ],
    aktivite: [
      { tarih: "20.07.2026 14:32", islem: "Giriş yapıldı", ip: "88.247.12.45" },
      { tarih: "18.07.2026 09:15", islem: "Sipariş oluşturuldu", ip: "88.247.12.45" },
      { tarih: "10.07.2026 11:00", islem: "Profil güncellendi", ip: "88.247.12.45" },
    ],
    cariHareketler: [
      { tarih: "15.03.2025", aciklama: "DS120325001 ödemesi", tutar: 1200, tur: "odeme" },
      { tarih: "20.04.2025", aciklama: "DS120325002 ödemesi", tutar: 850, tur: "odeme" },
    ],
  },
  {
    id: 10156, adSoyad: "MEHMET DOĞRUL", eposta: "dogrultur@gmail.com",
    gsm: "5335107177", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "05.02.2025",
    universite: "Hacettepe Üniversitesi", fakulte: "Fen Bilimleri Enstitüsü", bolum: "İstatistik",
    il: "Ankara", ilce: "Çankaya", adres: "Kızılay Mah. 14/3",
    siparisler: [
      { kod: "DS050225001", hizmet: "R Analizi", tarih: "10.02.2025", tutar: 2200, durum: "teslim" },
    ],
    egitimTalepleri: [],
    aktivite: [
      { tarih: "19.07.2026 10:00", islem: "Giriş yapıldı", ip: "78.189.45.22" },
    ],
    cariHareketler: [
      { tarih: "10.02.2025", aciklama: "DS050225001 ödemesi", tutar: 2200, tur: "odeme" },
    ],
  },
  {
    id: 10155, adSoyad: "GİZEM ÇAKIR", eposta: "cakirgzem@gmail.com",
    gsm: "5300858879", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "18.01.2025",
    universite: "Gazi Üniversitesi", fakulte: "Sağlık Bilimleri Fakültesi", bolum: "Hemşirelik",
    il: "Ankara", ilce: "Keçiören", adres: "Bağlum Cad. No:7",
    siparisler: [],
    egitimTalepleri: [
      { egitim: "SPSS İleri Eğitim", tarih: "15.06.2025", durum: "devam" },
    ],
    aktivite: [
      { tarih: "21.07.2026 08:45", islem: "Giriş yapıldı", ip: "46.155.20.8" },
    ],
    cariHareketler: [],
  },
  {
    id: 10154, adSoyad: "AYÇA ÜNAL", eposta: "aycaunal97@hotmail.com",
    gsm: "5063015305", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "22.11.2024",
    universite: "Ege Üniversitesi", fakulte: "Mühendislik Fakültesi", bolum: "Bilgisayar Mühendisliği",
    il: "İzmir", ilce: "Bornova", adres: "Atatürk Cad. 88",
    siparisler: [
      { kod: "DS221124001", hizmet: "Python Analizi", tarih: "25.11.2024", tutar: 1800, durum: "teslim" },
      { kod: "DS221124002", hizmet: "Görselleştirme", tarih: "15.01.2025", tutar: 600, durum: "iptal" },
    ],
    egitimTalepleri: [],
    aktivite: [
      { tarih: "15.07.2026 16:20", islem: "Giriş yapıldı", ip: "88.100.35.90" },
      { tarih: "10.07.2026 09:30", islem: "Sipariş oluşturuldu", ip: "88.100.35.90" },
    ],
    cariHareketler: [
      { tarih: "25.11.2024", aciklama: "DS221124001 ödemesi", tutar: 1800, tur: "odeme" },
      { tarih: "15.01.2025", aciklama: "DS221124002 iadesi", tutar: 600, tur: "iade" },
    ],
  },
  {
    id: 10153, adSoyad: "BAŞAK SÖZÜDOĞRU ARDOĞAN", eposta: "sozudogru.1999@gmail.com",
    gsm: "5345870785", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "14.09.2024",
    universite: "Marmara Üniversitesi", fakulte: "Sosyal Bilimler Enstitüsü", bolum: "Psikoloji",
    il: "İstanbul", ilce: "Üsküdar", adres: "Burhaniye Mah. 22/B",
    siparisler: [
      { kod: "DS140924001", hizmet: "Ölçek Geliştirme", tarih: "20.09.2024", tutar: 3200, durum: "teslim" },
    ],
    egitimTalepleri: [
      { egitim: "SPSS Temel Eğitim", tarih: "01.10.2024", durum: "tamamlandi" },
      { egitim: "Amos Yapısal Eşitlik", tarih: "01.11.2024", durum: "tamamlandi" },
    ],
    aktivite: [
      { tarih: "22.07.2026 11:00", islem: "Giriş yapıldı", ip: "94.54.77.14" },
    ],
    cariHareketler: [
      { tarih: "20.09.2024", aciklama: "DS140924001 ödemesi", tutar: 3200, tur: "odeme" },
    ],
  },
  {
    id: 10152, adSoyad: "BEYZA NUR CAN", eposta: "beyza.nur.can07@gmail.com",
    gsm: "5466732076", tur: "Bireysel", durum: "Pasif", rol: "Müşteri", kayitTarihi: "03.07.2024",
    il: "Bursa", ilce: "Nilüfer", adres: "Beşevler Mah. 4/1",
    siparisler: [],
    egitimTalepleri: [],
    aktivite: [
      { tarih: "01.01.2025 12:00", islem: "Hesap pasife alındı", ip: "admin" },
    ],
    cariHareketler: [],
  },
  {
    id: 10151, adSoyad: "KEREM MURAT", eposta: "keremurats@gmail.com",
    gsm: "5334123982", tur: "Bireysel", durum: "Aktif", rol: "Admin", kayitTarihi: "01.01.2024",
    universite: "Ondokuz Mayıs Üniversitesi", fakulte: "Mühendislik Fakültesi", bolum: "Endüstri Mühendisliği",
    il: "Samsun", ilce: "İlkadım", adres: "Batıkent Mah. No:1",
    siparisler: [],
    egitimTalepleri: [],
    aktivite: [
      { tarih: "03.08.2026 09:00", islem: "Giriş yapıldı", ip: "88.247.55.200" },
      { tarih: "02.08.2026 14:30", islem: "Kullanıcı düzenlendi (#10155)", ip: "88.247.55.200" },
    ],
    cariHareketler: [],
  },
  {
    id: 10150, adSoyad: "EMİNE DİLARA ÇOLPAK", eposta: "dilara.colpak@alanya.edu.tr",
    gsm: "5330342548", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "28.06.2024",
    universite: "Alanya Alaaddin Keykubat Üniversitesi", fakulte: "İİBF", bolum: "İşletme",
    il: "Antalya", ilce: "Alanya", adres: "Atatürk Bul. 55",
    siparisler: [
      { kod: "DS280624001", hizmet: "Regresyon Analizi", tarih: "05.07.2024", tutar: 1500, durum: "teslim" },
    ],
    egitimTalepleri: [],
    aktivite: [
      { tarih: "18.07.2026 15:00", islem: "Giriş yapıldı", ip: "78.162.4.8" },
    ],
    cariHareketler: [
      { tarih: "05.07.2024", aciklama: "DS280624001 ödemesi", tutar: 1500, tur: "odeme" },
    ],
  },
  {
    id: 10149, adSoyad: "BEUZA SONGÜL BAL", eposta: "sngl.akc@gmail.com",
    gsm: "5549466667", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "10.05.2024",
    il: "Konya", ilce: "Selçuklu", adres: "Meram Yeni Yol 8/3",
    siparisler: [],
    egitimTalepleri: [
      { egitim: "SPSS Temel Eğitim", tarih: "15.06.2024", durum: "tamamlandi" },
    ],
    aktivite: [
      { tarih: "05.07.2026 10:30", islem: "Giriş yapıldı", ip: "195.14.5.20" },
    ],
    cariHareketler: [],
  },
  {
    id: 10148, adSoyad: "TUĞÇE KOÇ", eposta: "mtugceay@gmail.com",
    gsm: "5446703854", tur: "Bireysel", durum: "Aktif", rol: "Müşteri", kayitTarihi: "22.04.2024",
    universite: "Selçuk Üniversitesi", fakulte: "Sağlık Bilimleri Enstitüsü", bolum: "Fizyoterapi",
    il: "Konya", ilce: "Meram", adres: "Sarıcalar Mah. 12",
    siparisler: [
      { kod: "DS220424001", hizmet: "SPSS Analizi", tarih: "30.04.2024", tutar: 900, durum: "teslim" },
    ],
    egitimTalepleri: [],
    aktivite: [
      { tarih: "20.07.2026 13:00", islem: "Giriş yapıldı", ip: "78.162.100.50" },
    ],
    cariHareketler: [
      { tarih: "30.04.2024", aciklama: "DS220424001 ödemesi", tutar: 900, tur: "odeme" },
    ],
  },
];
