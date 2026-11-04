export type AbonelikDurum = "Aktif" | "Pasif" | "İptal";
export type OdemeDurum = "Ödendi" | "Bekliyor" | "Başarısız";

export type Abonelik = {
  id: number;
  musteri: string;
  durum: AbonelikDurum;
  baslangic: string;
  bitis: string;
  ucret: number;
  odeme: OdemeDurum;
};

export const ABONELIKLER: Abonelik[] = [
  { id: 1, musteri: "Kerem Murat", durum: "Aktif", baslangic: "12.01.2026", bitis: "12.01.2027", ucret: 2400, odeme: "Ödendi" },
  { id: 2, musteri: "Yeşim Yaptırmış", durum: "Aktif", baslangic: "03.02.2026", bitis: "03.02.2027", ucret: 2400, odeme: "Ödendi" },
  { id: 3, musteri: "Ayşe Kaya", durum: "Pasif", baslangic: "20.11.2025", bitis: "20.11.2026", ucret: 1800, odeme: "Bekliyor" },
  { id: 4, musteri: "Mehmet Arslan", durum: "Aktif", baslangic: "08.03.2026", bitis: "08.03.2027", ucret: 3600, odeme: "Ödendi" },
  { id: 5, musteri: "Ebru Buket Erken", durum: "İptal", baslangic: "14.09.2025", bitis: "14.09.2026", ucret: 1800, odeme: "Başarısız" },
  { id: 6, musteri: "Naci Murat", durum: "Aktif", baslangic: "01.02.2026", bitis: "01.02.2027", ucret: 2400, odeme: "Ödendi" },
  { id: 7, musteri: "Rabia Aktaş", durum: "Pasif", baslangic: "17.12.2025", bitis: "17.12.2026", ucret: 1800, odeme: "Bekliyor" },
  { id: 8, musteri: "Fatih Akar", durum: "Aktif", baslangic: "25.01.2026", bitis: "25.01.2027", ucret: 3600, odeme: "Ödendi" },
  { id: 9, musteri: "Başak Sözüdoğru", durum: "Aktif", baslangic: "09.02.2026", bitis: "09.02.2027", ucret: 2400, odeme: "Ödendi" },
  { id: 10, musteri: "Emine Dilara Çolpak", durum: "İptal", baslangic: "28.06.2025", bitis: "28.06.2026", ucret: 1800, odeme: "Başarısız" },
  { id: 11, musteri: "Tuğçe Koç", durum: "Aktif", baslangic: "22.04.2026", bitis: "22.04.2027", ucret: 2400, odeme: "Ödendi" },
  { id: 12, musteri: "Aliihsan Şükür", durum: "Pasif", baslangic: "05.12.2025", bitis: "05.12.2026", ucret: 1800, odeme: "Bekliyor" },
  { id: 13, musteri: "Hale Sarı", durum: "Aktif", baslangic: "18.03.2026", bitis: "18.03.2027", ucret: 3600, odeme: "Ödendi" },
  { id: 14, musteri: "E Yönetim", durum: "Aktif", baslangic: "30.01.2026", bitis: "30.01.2027", ucret: 2400, odeme: "Ödendi" },
];

export function formatUcret(value: number) {
  return `${value.toLocaleString("tr-TR")} TL`;
}
