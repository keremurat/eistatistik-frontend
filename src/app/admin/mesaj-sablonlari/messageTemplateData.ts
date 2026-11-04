export type MessageTemplate = { id: string; title: string; body: string };

export const MESSAGE_VARIABLES = [
  { token: "{musteri_adi}", label: "Müşteri adı" },
  { token: "{siparis_kodu}", label: "Sipariş kodu" },
  { token: "{tarih}", label: "Tarih" },
] as const;

const STORAGE_KEY = "eistatistik.message-templates.v1";

const SAMPLE_VALUES: Record<string, string> = {
  musteri_adi: "Kerem Murat",
  siparis_kodu: "ES-2041",
  tarih: "12 Kasım 2026",
  ek_ucret: "1.250",
  ucret: "4.800",
  tutar: "4.800",
  link: "meet.eistatistik.com/gorusme",
  ozet: "Kapsam netleştirildi, teslim 12 Kasım.",
  belge: "etik kurul formu",
  bilgi: "Analiz kapsamı onaylandı.",
  saat: "14:30",
  anket_linki: "eistatistik.com/anket",
  eksik_belgeler: "etik kurul, veri seti",
  adimlar: "Veri setini yükleyin.",
  ornek_buyuklugu: "128",
  etki_buyuklugu: "0,35",
  silinen_satir: "14",
  duzeltilen_deger: "6",
  fatura_no: "EIS20260041",
  guncelleme: "Grafikler rapora eklendi.",
  bitis_saati: "18:00",
  indirim_orani: "15",
  indirim_kodu: "EI15",
  egitim_adi: "SPSS ile Temel Analiz",
  sure: "2 saat",
  konu: "Güç analizi",
  form_linki: "eistatistik.com/geri-bildirim",
  referans_linki: "eistatistik.com/r/kerem",
  dogrulama_linki: "eistatistik.com/dogrula",
  email: "kerem@eistatistik.com",
};

const defaultTemplates: MessageTemplate[] = [
  { id: "49", title: "Ek Analize Yönlendirme", body: "Sayın {musteri_adi},\n\nSiparişinizde ek analiz gereksinimi tespit edilmiştir. Ek analiz ücreti {ek_ucret} TL olarak belirlenmiştir.\n\nOnayınız halinde analize devam edilecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "48", title: "Ücret İptal Üzüntü", body: "Sayın {musteri_adi},\n\nSiparişinizin iptal edildiğini üzülerek bildiriyoruz. Ödediğiniz {ucret} TL tutarın iadesi işleme alınmıştır.\n\nİleride tekrar hizmetlerimizden faydalanmanızı dileriz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "47", title: "Teslimat Sonrası Görüşmeye Gelmeme", body: "Sayın {musteri_adi},\n\nPlanlanmış görüşmemize katılım sağlayamadığınızı gördük. Yeni bir görüşme zamanı belirlemek ister misiniz?\n\nLütfen takvimimizden uygun bir saat seçiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "46", title: "email", body: "Sayın {musteri_adi},\n\nSiparişinizle ilgili e-posta bilgilendirmesi gönderilmiştir. Lütfen spam klasörünüzü de kontrol ediniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "45", title: "Proforma Yönlendirme", body: "Sayın {musteri_adi},\n\nProforma faturanız hazırlanmıştır. Fatura tutarı {tutar} TL olup ödeme bilgileri ekte yer almaktadır.\n\nÖdemenizi gerçekleştirdikten sonra siparişiniz aktif hale gelecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "44", title: "Mentörlük Yönlendirme", body: "Sayın {musteri_adi},\n\nMentörlük seansınız için hazırlıkları tamamlamanız gerekmektedir.\n\nGörüşme tarihi: {tarih}\nGörüşme linki: {link}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "43", title: "ONLİNE GÖRÜŞME SONRASI MESAJ ŞABLONU", body: "Sayın {musteri_adi},\n\nOnline görüşmemize katıldığınız için teşekkür ederiz. Görüşme özeti ve aksiyon maddeleri aşağıda yer almaktadır:\n\n{ozet}\n\nHerhangi bir sorunuz olursa iletişime geçmekten çekinmeyiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "42", title: "SERT", body: "Sayın {musteri_adi},\n\nBirden fazla hatırlatmaya rağmen gerekli belgeler tarafınızca iletilmemiştir. Siparişinizin devam edebilmesi için {belge} belgelerini en geç {tarih} tarihine kadar sisteme yüklemenizi önemle rica ederiz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "41", title: "BİLGİLENDİRME", body: "Sayın {musteri_adi},\n\nSiparişinizle ilgili güncel bilgilendirme aşağıda yer almaktadır:\n\n{bilgi}\n\nHerhangi bir sorunuz olursa destek ekibimizle iletişime geçebilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "40", title: "YENİ TALEP BİLGİLENDİRME", body: "Sayın {musteri_adi},\n\nYeni analiz talebiniz alınmıştır. Sipariş kodunuz: {siparis_kodu}\n\nEkibimiz en kısa sürede sizinle iletişime geçecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "39", title: "Ödeme Hatırlatma", body: "Sayın {musteri_adi},\n\nSiparişinize ait ödeme henüz gerçekleştirilmemiştir. Hesabınıza giriş yaparak ödemenizi tamamlayabilirsiniz.\n\nÖdenecek tutar: {tutar} TL\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "38", title: "Teslim Bildirimi", body: "Sayın {musteri_adi},\n\nAnaliz çalışmanız tamamlanmış ve sisteme yüklenmiştir. Hesabınıza giriş yaparak teslim edilen dosyaları indirebilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "37", title: "Revizyon Talebi", body: "Sayın {musteri_adi},\n\nRevizyon talebiniz alınmıştır. Belirttiğiniz notlar incelenecek ve en kısa sürede güncellenen dosyalar tarafınıza iletilecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "36", title: "Analiz Başladı", body: "Sayın {musteri_adi},\n\nAnaliz çalışmanız başlamıştır. Tahmini teslim tarihi: {tarih}\n\nÇalışma sürecinde ek bilgi gerekirse sizinle iletişime geçeceğiz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "35", title: "Dosya Eksik", body: "Sayın {musteri_adi},\n\nSiparişinizin tamamlanabilmesi için eksik belgeler bulunmaktadır:\n\n{eksik_belgeler}\n\nLütfen belirtilen dosyaları sisteme yükleyiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "34", title: "Ek Ücret Bildirimi", body: "Sayın {musteri_adi},\n\nSiparişinizde kapsam dışı analiz talep edilmiştir. Bu analiz için {ek_ucret} TL ek ücret uygulanacaktır.\n\nOnayınız halinde işleme devam edilecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "33", title: "Randevu Hatırlatma", body: "Sayın {musteri_adi},\n\nYarın {saat} saatinde planlanmış çevrimiçi görüşmenizi hatırlatmak isteriz.\n\nGörüşme linki: {link}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "32", title: "İptal Onayı", body: "Sayın {musteri_adi},\n\nSiparişiniz talebiniz doğrultusunda iptal edilmiştir.\n\nİptal edilen sipariş: {siparis_kodu}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "31", title: "Memnuniyet Anketi", body: "Sayın {musteri_adi},\n\nHizmet kalitenizi artırmak adına görüşleriniz bizim için değerlidir. Lütfen kısa anketi doldurunuz:\n\n{anket_linki}\n\nTeşekkürler,\neistatistik Ekibi" },
  { id: "30", title: "Teşekkür Mesajı", body: "Sayın {musteri_adi},\n\neistatistik hizmetlerini tercih ettiğiniz için teşekkür ederiz. Analiziniz başarıyla tamamlanmıştır.\n\nYeni siparişlerinizde sizi bekliyoruz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "29", title: "Onay Bekleniyor", body: "Sayın {musteri_adi},\n\nSiparişiniz onay aşamasındadır. Ekibimiz tarafından incelendikten sonra analiz sürecine geçilecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "28", title: "Veri Yükleme Hatırlatma", body: "Sayın {musteri_adi},\n\nSiparişinizin işleme alınabilmesi için veri dosyalarınızı sisteme yüklemeniz gerekmektedir.\n\nLütfen hesabınıza giriş yaparak dosya yükleme işlemini tamamlayınız.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "27", title: "Görüşme Özeti", body: "Sayın {musteri_adi},\n\nBugünkü görüşmemizin özeti:\n\n{ozet}\n\nBir sonraki adımlar:\n{adimlar}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "26", title: "Power Analizi Tamamlandı", body: "Sayın {musteri_adi},\n\nPower analizi çalışmanız tamamlanmıştır. Raporunuz sisteme yüklenmiştir.\n\nÖrnek büyüklüğü: {ornek_buyuklugu}\nEtki büyüklüğü: {etki_buyuklugu}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "25", title: "SPSS Çıktısı Hazır", body: "Sayın {musteri_adi},\n\nSPSS analiz çıktılarınız hazırlanmıştır. Sisteme giriş yaparak dosyaları indirebilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "24", title: "Grafik Revizyon", body: "Sayın {musteri_adi},\n\nGrafik revizyonu talebiniz alınmıştır. Belirttiğiniz düzeltmeler uygulandıktan sonra güncel dosyalar tarafınıza iletilecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "23", title: "Yorum Ekleme", body: "Sayın {musteri_adi},\n\nSiparişinize yorum eklenmiştir. Yorumu görmek için hesabınıza giriş yaparak ilgili siparişi açabilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "22", title: "Makale Düzenleme", body: "Sayın {musteri_adi},\n\nMakale düzenleme süreciniz başlamıştır. İstatistik bölümünde gerekli düzenlemeler yapıldıktan sonra revize makale tarafınıza iletilecektir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "21", title: "Danışma Özeti", body: "Sayın {musteri_adi},\n\nDanışma seansı özetiniz:\n\n{ozet}\n\nBir sonraki seansınız için takvim üzerinden randevu alabilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "20", title: "Proje Güncelleme", body: "Sayın {musteri_adi},\n\nProjenizde yapılan güncellemeler hakkında bilgilendirmek istedik:\n\n{guncelleme}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "19", title: "Tez Analizi Hazır", body: "Sayın {musteri_adi},\n\nTez analiziniz tamamlanmış ve sisteme yüklenmiştir. Dosyaları hesabınızdan indirebilirsiniz.\n\nÇalışmanızda başarılar dileriz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "18", title: "Anket Tasarım", body: "Sayın {musteri_adi},\n\nAnket tasarım çalışmanız tamamlanmıştır. Taslak anket sisteme yüklenmiştir, lütfen inceleyiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "17", title: "Veri Temizleme", body: "Sayın {musteri_adi},\n\nVeri temizleme işleminiz tamamlanmıştır.\n\nTemizleme özetinde {silinen_satir} satır kaldırılmış, {duzeltilen_deger} değer düzeltilmiştir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "16", title: "Veri Girişi Hatırlatma", body: "Sayın {musteri_adi},\n\nSiparişinizin devam edebilmesi için veri girişini tamamlamanız gerekmektedir.\n\nLütfen hesabınıza giriş yaparak eksik bilgileri doldurunuz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "15", title: "Rapor Hazır", body: "Sayın {musteri_adi},\n\nİstatistik raporunuz hazırlanmış ve sisteme yüklenmiştir. Hesabınıza giriş yaparak raporu indirebilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "14", title: "Fatura Gönderimi", body: "Sayın {musteri_adi},\n\nSiparişinize ait resmi fatura sisteme yüklenmiştir.\n\nFatura no: {fatura_no}\nFatura tutarı: {tutar} TL\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "13", title: "Ödeme Alındı", body: "Sayın {musteri_adi},\n\nÖdemeniz başarıyla alınmıştır. Siparişiniz aktif hale getirilmiştir.\n\nÖdeme tutarı: {tutar} TL\nSipariş kodu: {siparis_kodu}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "12", title: "Sipariş Onayı", body: "Sayın {musteri_adi},\n\nSiparişiniz onaylanmıştır. Analiz süreci başlamıştır.\n\nSipariş kodu: {siparis_kodu}\nTahmini teslim tarihi: {tarih}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "11", title: "Hoş Geldiniz", body: "Sayın {musteri_adi},\n\neistatistik ailesine hoş geldiniz! Hesabınız başarıyla oluşturulmuştur.\n\nHizmetlerimizden faydalanmak için giriş yapabilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "10", title: "Sistem Güncellemesi", body: "Sayın Kullanıcılarımız,\n\nSistemimiz {tarih} tarihinde {saat}–{bitis_saati} saatleri arasında bakım nedeniyle erişime kapalı olacaktır.\n\nAnlayışınız için teşekkür ederiz.\n\neistatistik Ekibi" },
  { id: "9", title: "Bakım Bildirimi", body: "Sayın {musteri_adi},\n\nPlanlanmış bakım çalışması tamamlanmıştır. Sistemimiz normal çalışmasına devam etmektedir.\n\nTeşekkür ederiz.\n\neistatistik Ekibi" },
  { id: "8", title: "Özel İndirim", body: "Sayın {musteri_adi},\n\nSize özel %{indirim_orani} indirim kodunuz: {indirim_kodu}\n\nKod geçerlilik tarihi: {tarih}\n\nBu fırsatı kaçırmayın!\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "7", title: "Eğitim Daveti", body: "Sayın {musteri_adi},\n\nYeni eğitim programımıza katılmanızı dileriz.\n\nEğitim adı: {egitim_adi}\nTarihi: {tarih} — Süresi: {sure}\n\nDetay ve kayıt için hesabınıza giriş yapınız.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "6", title: "Webinar Hatırlatma", body: "Sayın {musteri_adi},\n\nYarın saat {saat}'de gerçekleşecek webinarımızı hatırlatmak isteriz.\n\nKonu: {konu}\nLink: {link}\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "5", title: "Başarı Tebriği", body: "Sayın {musteri_adi},\n\nMakale/tezinizin kabul edildiğini öğrendik. Tebrikler!\n\nBaşarılarınızın devamını diler, ilerideki çalışmalarınızda da yanınızda olmaktan mutluluk duyarız.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "4", title: "Geri Bildirim Talebi", body: "Sayın {musteri_adi},\n\nHizmet kalitenizi artırmak adına görüşleriniz bizim için değerlidir. Lütfen aşağıdaki formu doldurunuz:\n\n{form_linki}\n\nTeşekkürler,\neistatistik Ekibi" },
  { id: "3", title: "Referans Talebi", body: "Sayın {musteri_adi},\n\nHizmetlerimizden memnun kaldıysanız bizi çevrenize önermekten çekinmeyiniz.\n\nReferans linki: {referans_linki}\n\nDesteğiniz için teşekkür ederiz.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "2", title: "Hesap Doğrulama", body: "Sayın {musteri_adi},\n\nHesabınızı doğrulamak için aşağıdaki linke tıklayınız:\n\n{dogrulama_linki}\n\nLink 24 saat geçerlidir.\n\nSaygılarımızla,\neistatistik Ekibi" },
  { id: "1", title: "Kayıt Onayı", body: "Sayın {musteri_adi},\n\neistatistik'e kaydınız başarıyla tamamlanmıştır.\n\nE-posta: {email}\n\nHizmetlerimizden yararlanmak için giriş yapabilirsiniz.\n\nSaygılarımızla,\neistatistik Ekibi" },
];

export function previewMessage(body: string) {
  return body.replace(/\{([a-z0-9_]+)\}/g, (token, name: string) => SAMPLE_VALUES[name] ?? token);
}

export function templateSnippet(body: string) {
  return body.split("\n").map((line) => line.trim()).find(Boolean) ?? "";
}

export function readMessageTemplates() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTemplates;
    const parsed = JSON.parse(raw) as MessageTemplate[];
    return Array.isArray(parsed) ? parsed : defaultTemplates;
  } catch {
    return defaultTemplates;
  }
}

export function writeMessageTemplates(templates: MessageTemplate[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}
