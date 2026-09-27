# Güvenlik İnceleme Raporu

**Proje:** eistatistik frontend  
**İnceleme tarihi:** 27 Eylül 2026  
**Kapsam:** Next.js frontend deposu, istemci tarafı kimlik/rol akışları, yerel veri saklama, bağımlılıklar, hassas veriler, dosya ve URL girdileri, güvenlik başlıkları

## Yönetici özeti

Bu proje şu anda ağırlıklı olarak bir frontend/demo prototipidir. Gerçek bir API, sunucu taraflı oturum yönetimi, merkezi veri deposu, API route veya Server Action bulunmamaktadır. Bu nedenle `localStorage`, demo hesaplar ve sahte işlem akışları prototipleme açısından anlaşılabilir.

Bununla birlikte uygulama mevcut haliyle gerçek kullanıcı verileriyle internete açık üretim ortamında kullanılmamalıdır. Backend'in sonradan bağlanması aşağıdaki riskleri kendiliğinden çözmez. Kimlik doğrulama, rol/yetki ve veri sahipliği kontrollerinin backend tarafından açıkça uygulanması; frontend'deki demo mekanizmalarının kaldırılması gerekir.

En önemli mevcut riskler:

1. Kimlik doğrulama ve yetkilendirmenin yalnızca istemci tarafında simüle edilmesi.
2. Yönetim ve rol rotalarının anonim kullanıcılar tarafından doğrudan açılabilmesi.
3. Kaynak kodda gerçek görünümlü kişisel ve finansal verilerin bulunması.
4. Kritik/yüksek önem dereceli bağımlılık açıkları.
5. Güvenlik başlıklarının bulunmaması.
6. URL ve dosya girdilerinin üretim kullanımı için yeterince doğrulanmaması.

---

## 1. Kritik: Gerçek kimlik doğrulama ve yetkilendirme yok

Giriş işlemi tamamen tarayıcıda gerçekleştirilmektedir:

- Demo kullanıcılar ve rolleri frontend kaynak kodundadır.
- Bütün demo hesapların ortak parolası `password123` olarak kaynak kodunda açıktır.
- Başarılı giriş yalnızca `localStorage` içine rol ve hesap e-postası yazar.
- İmzalı oturum, sunucu doğrulaması, güvenli cookie, süre aşımı veya token yenileme mekanizması yoktur.
- Kullanıcı `localStorage` içindeki rolü geliştirici konsolundan değiştirebilir.

İlgili dosyalar:

- `src/app/lib/demoAccounts.ts`
- `src/app/giris/page.tsx`
- `src/app/lib/accountStorage.ts`

### Rota koruması

`/admin`, `/editor`, `/asistan` ve `/analizor` rotalarında sunucu taraflı erişim kontrolü yoktur. `AdminShell` yalnızca URL'den admin/editör görünümünü seçmekte, oturum veya yetki doğrulamamaktadır. Projede korumalı rota layout'u, `proxy.ts` veya eşdeğer bir sunucu koruması bulunmamaktadır.

**Olası sonuç:** Anonim erişim, rol yükseltme ve yönetim ekranlarının görüntülenmesi.

### Backend entegrasyonunda yapılacaklar

- Gerçek kullanıcı doğrulaması kurulmalı.
- Parolalar Argon2id veya uygun maliyet ayarlı bcrypt ile hash'lenmeli.
- Tercihen `HttpOnly`, `Secure`, uygun `SameSite` niteliğine sahip cookie tabanlı oturum kullanılmalı.
- Her API isteğinde oturum doğrulanmalı.
- Her endpoint'te rol/yetki kontrolü yapılmalı.
- Nesne sahipliği kontrol edilmelidir. Örneğin müşteri yalnızca kendi siparişini görebilmelidir.
- Frontend'deki menü gizleme işlemleri güvenlik kontrolü kabul edilmemelidir.

Örnek güvenli veri akışı:

```text
GET /api/orders/DS260723008
        ↓
Oturum geçerli mi?
        ↓
Kullanıcı admin mi veya siparişin sahibi mi?
        ↓
Yalnızca bu ekranın ihtiyaç duyduğu alanları döndür
```

Yalnızca kayıt ID'sinin veya sipariş kodunun bilinmesine dayanarak veri döndürülmesi IDOR/BOLA açığı oluşturur.

---

## 2. Kritik: Kişisel ve finansal veriler kaynak kodunda

`src/app/admin/kullanici-yonetimi/data.ts` içinde gerçek görünümlü aşağıdaki veriler bulunmaktadır:

- Ad ve soyadlar
- Gerçek alan adlarına ait e-posta adresleri
- Telefon numaraları
- Açık adresler
- Üniversite, fakülte ve bölüm bilgileri
- IP adresleri ve giriş hareketleri
- Sipariş ve ödeme geçmişleri
- Kullanıcı rolleri

Bu dosya istemci tarafında kullanılan kodun parçası olduğundan veriler oluşturulan JavaScript paketlerine de girebilir. Yönetim rotalarının korunmaması riski ayrıca artırmaktadır.

`src/app/siparislerim/DS260723008/page.tsx` içinde ad-soyad, banka, hesap numarası ve IBAN bilgileri de kaynakta sabit olarak bulunmaktadır.

### Yapılacaklar

- Bu verilerin gerçek olup olmadığı doğrulanmalı.
- Gerçekse derhal anonim/sentetik verilerle değiştirilmeli.
- Yalnızca mevcut dosyadan silmek yeterli değildir; Git geçmişi, eski deployment'lar, CDN/cache ve build artefaktları değerlendirilmelidir.
- Gerekirse KVKK kapsamında olay değerlendirmesi yapılmalıdır.
- Gerçek veriler backend'e taşındığında API yalnızca gerekli en az alanı döndürmelidir.
- Hassas veri frontend bundle'ına veya statik sayfa kaynağına gömülmemelidir.

---

## 3. Kritik/Yüksek: Bağımlılık açıkları

27 Eylül 2026 tarihinde çalıştırılan:

```bash
npm audit --omit=dev
```

sonucu:

- 1 kritik
- 3 yüksek
- Toplam 4 etkilenen paket

### Etkilenen bağımlılıklar

- `next@16.2.11`: Windows sunucularında ve AVIF Image Optimization akışında kimlik doğrulamasız uzaktan kod çalıştırma bildirimleri.
- `postcss`: XSS ve saldırgan kontrollü source map girdileri üzerinden dosya okuma/path traversal bildirimleri.
- `sharp`: libvips/libheif kaynaklı yüksek önem dereceli açıklar.
- `nanoid`: Bazı özel generator kullanımlarında sonsuz döngü/DoS bildirimi.

`npm audit`, Next.js için `16.3.6` sürümünü düzeltme olarak önermiştir. Güncelleme yapılırken bu projedeki Next.js sürümüne ait `node_modules/next/dist/docs/` dokümantasyonu ve kırıcı değişiklikler kontrol edilmelidir.

Backend'in eklenmesi frontend bağımlılık açıklarını çözmez.

### Yapılacaklar

- Next.js ve ilişkili kilitli bağımlılıklar güvenli sürümlere yükseltilmeli.
- Sonrasında yeniden `npm audit`, lint, build ve fonksiyonel test çalıştırılmalı.
- CI içinde bağımlılık güvenlik taraması zorunlu hale getirilmelidir.

---

## 4. Yüksek: `localStorage` güvenilir veri deposu gibi kullanılıyor

Rol, hesap kimliği ve çok sayıda yönetim kaydı tarayıcı deposunda tutulmaktadır:

- Randevular
- Görevler
- İndirimler
- Hizmet türleri
- Ana sayfa ayarları
- Rehber adımları
- Favoriler

İlgili örnekler:

- `src/app/admin/orderActionData.ts`
- `src/app/admin/anasayfa-ayarlari/homeSettingsData.ts`
- `src/app/admin/randevular/appointmentData.ts`
- `src/app/admin/siparis-turleri/serviceTypeData.ts`

Bu yaklaşım demo için kullanılabilir; üretimde veri bütünlüğü veya yetkilendirme sağlamaz. Kullanıcı değerleri değiştirebilir, silebilir veya başka hesap kimliği altında kayıt oluşturabilir. Aynı origin'de oluşacak XSS de bu verilere ulaşabilir.

### Backend entegrasyonunda yapılacaklar

- Yetkili kayıtlar backend/veritabanına taşınmalı.
- `localStorage` yalnızca hassas olmayan kullanıcı tercihlerinde kullanılmalı.
- Rol ve kullanıcı kimliği istemci tarafından gönderilen değere güvenilerek belirlenmemeli.
- Backend kullanıcıyı doğrulanmış oturumdan çıkarmalıdır.

---

## 5. Orta: Güvenlik başlıkları yok

`next.config.ts` içinde güvenlik başlıkları tanımlanmamıştır. Özellikle şunlar bulunmamaktadır:

- `Content-Security-Policy`
- `frame-ancestors` veya `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- HTTPS dağıtımında HSTS

### Olası sonuç

- XSS etkisini sınırlayan ikinci savunma katmanının bulunmaması
- Clickjacking riski
- Gereksiz referrer veya tarayıcı yetkisi paylaşımı

### Yapılacaklar

- Uygulamanın kullandığı resim, video, font ve harici servisler envanterlenmeli.
- Next.js 16 dokümantasyonuna uygun CSP kurulmalı.
- Üretim ortamında güvenlik başlıkları otomatik test edilmelidir.

---

## 6. Orta: Kullanıcı kontrollü URL'ler doğrulanmıyor

Bazı yönetim formlarında girilen URL değerleri doğrudan `href` veya `img src` olarak kullanılmaktadır.

Örnek dosyalar:

- `src/app/admin/siparis-turleri/ekle/page.tsx`
- `src/app/admin/egitim-talepleri/mentorluk-ayari/page.tsx`
- `src/app/admin/egitim-talepleri/modul-listesi/page.tsx`

### Riskler

- `javascript:` veya istenmeyen protokoller
- Kimlik avı bağlantıları
- Saldırgan kontrollü harici görseller üzerinden takip
- Veriler ortak backend'e taşınırsa stored-XSS veya kalıcı zararlı bağlantı riski

### Yapılacaklar

- URL'ler `new URL()` ile parse edilmelidir.
- Yalnızca `https:` kabul edilmelidir.
- YouTube alanlarında izin verilen alan adı listesi kullanılmalıdır.
- Logo/görsel kaynakları için güvenilir alan adı veya kontrollü medya servisi kullanılmalıdır.
- Aynı doğrulama backend'de tekrar edilmelidir.

---

## 7. Orta: Dosya yükleme kontrolleri tutarsız ve istemci tarafında

Dosya seçim ekranlarındaki kontroller birbirinden farklıdır:

- Bazı ekranlar yalnızca dosya boyutunu kontrol eder.
- Bazıları yalnızca uzantı kontrol eder.
- Bazıları yalnızca tarayıcının bildirdiği MIME değerini kontrol eder.
- Bazılarında boyut veya tür kontrolü bulunmaz.
- Bazı görseller `FileReader` ile boyut sınırı olmadan tarayıcı belleğine alınır.
- SVG ve arşiv dosyaları bazı akışlarda kabul edilir.

İlgili örnekler:

- `src/app/yeni-analiz-talebi/page.tsx`
- `src/app/siparislerim/DS260723008/page.tsx`
- `src/app/admin/rehber-adimlari/ekle/page.tsx`
- `src/app/admin/egitim-talepleri/ders-listesi/ekle/page.tsx`
- `src/app/admin/duyurular/DuyuruForm.tsx`

Frontend kontrolleri yalnızca kullanıcı deneyimi sağlar ve kolayca atlatılabilir.

### Backend entegrasyonunda yapılacaklar

- Dosya boyutu ve adet sınırı
- İzin verilen uzantı listesi
- Gerçek MIME/magic-byte kontrolü
- Güvenli, sunucu tarafından üretilen dosya adı
- Path traversal engelleme
- Arşiv açma limiti ve zip bomb koruması
- Antivirüs/kötücül içerik taraması
- Dosyaları uygulama kodunun ve doğrudan çalıştırılabilir web kökünün dışında saklama
- İndirmelerde güvenli `Content-Disposition` ve `X-Content-Type-Options`
- SVG kabul edilecekse sanitize etme veya güvenli biçime dönüştürme
- Yetkili yükleme ve indirme kontrolü

---

## 8. Şifre sıfırlama, kayıt, ödeme ve diğer kritik akışlar demo durumunda

Mevcut şifre sıfırlama ekranı yalnızca gecikmeden sonra başarı mesajı göstermektedir. Kayıt işlemi gerçek hesap oluşturmamakta; ödeme ve dosya yükleme akışları da büyük ölçüde görseldir.

Bu durum prototip için kabul edilebilir ancak kullanıcıya gerçek işlem yapılmış izlenimi verilmemelidir.

### Backend entegrasyonunda yapılacaklar

- Şifre sıfırlama token'ı tek kullanımlık, kısa ömürlü ve güvenli rastgele olmalı.
- Token veritabanında düz metin yerine hash olarak saklanmalı.
- Şifre sıfırlama yanıtı hesap varlığını ifşa etmemeli.
- Giriş, kayıt ve parola sıfırlama endpoint'lerine rate limit uygulanmalı.
- Ödeme tutarı ve sipariş bilgisi frontend'den gelen değere göre kabul edilmemeli.
- Ödeme sonucu yalnızca ödeme sağlayıcısının imzalı callback/webhook doğrulamasından sonra işlenmeli.
- Kritik değişiklikler audit log'a yazılmalıdır.

---

## 9. Kod kalitesi ve doğrulama durumu

`npm run lint` çalıştırılmış ve başarısız olmuştur:

- 5 hata
- 6 uyarı

Başlıca hatalar bazı `useEffect` bloklarında senkron `setState` çağrılarıdır. Bunlar doğrudan güvenlik açığı değildir ancak güvenlik ve kalite kontrollerinin CI içinde zorunlu tutulmasını engeller.

### Yapılacaklar

- Mevcut lint hataları düzeltilmeli.
- Pull request kontrollerine en az lint, type-check, build ve bağımlılık taraması eklenmeli.
- Backend bağlandıktan sonra rol ve sahiplik senaryoları için entegrasyon testleri yazılmalıdır.

---

## Olumlu gözlemler

- `dangerouslySetInnerHTML`, `eval` veya `new Function` kullanımı tespit edilmedi.
- React metin çıktıları varsayılan olarak escape edilmektedir.
- Yeni sekmede açılan mevcut bağlantıların çoğunda `rel="noopener noreferrer"` bulunmaktadır.
- Kaynak kodda API anahtarı, özel anahtar veya bearer token tespit edilmedi.
- Mevcut sürümde veritabanı sorgusu/API route/Server Action olmadığı için doğrudan SQL injection yüzeyi bulunmamaktadır.
- TypeScript `strict` modu açıktır.

Bu olumlu noktalar kimlik doğrulama ve yetkilendirme eksikliğini telafi etmez.

---

## Frontend ve backend sorumluluk ayrımı

| Konu | Frontend | Backend |
|---|---|---|
| Oturum | Kullanıcı durumunu gösterir; `401`/`403` işler | Oturumu oluşturur ve her istekte doğrular |
| Rol | Yetkisiz butonları gizleyebilir | Her endpoint'te yetkiyi zorunlu uygular |
| Veri sahipliği | Doğru kaydı ister | Kaydın kullanıcıya ait olduğunu doğrular |
| Form doğrulama | Hızlı kullanıcı geri bildirimi verir | Bütün alanları yeniden doğrular |
| Dosya yükleme | Tür/boyut hakkında erken uyarı verir | İçeriği, boyutu, yetkiyi ve depolamayı güvenli doğrular |
| Ödeme | Sağlayıcıya yönlendirme arayüzünü sunar | Tutarı hesaplar ve imzalı sonucu doğrular |
| Hassas veri | Gereksiz alanları saklamaz/göstermez | Minimum DTO döndürür ve erişimi denetler |

Frontend'de bir bağlantının veya butonun gizlenmesi güvenlik kontrolü değildir.

---

## Önerilen çalışma sırası

### Frontend geliştirmeye devam ederken

- Gerçek görünümlü kişisel verileri sentetik verilerle değiştirin.
- Demo olduğunu README ve ortam göstergelerinde açıkça belirtin.
- Yeni gerçek veri veya gizli bilgi commit etmeyin.
- Yeni ekranları API sözleşmesine uygun tiplerle hazırlayın.
- Backend'den gelecek `401`, `403`, `404`, `409`, `422` ve `429` durumlarını tasarlayın.
- URL ve dosya doğrulamalarını ortak yardımcı fonksiyonlarda toplamaya başlayın.
- Next.js güvenlik güncellemesini backend'i beklemeden yapın.

### Backend/API hazır olduğunda

- `demoAccounts.ts` ve ortak demo parola kaldırılmalı.
- `localStorage` tabanlı rol/hesap kimliği kaldırılmalı.
- Güvenli oturum mekanizması bağlanmalı.
- Korumalı rotalarda sunucu taraflı oturum kontrolü kurulmalı.
- Bütün API çağrılarında hata ve yetki durumları ele alınmalı.
- Tarayıcı deposundaki yönetim kayıtları API/veritabanına taşınmalı.
- Dosya ve URL kontrolleri backend'de zorunlu uygulanmalı.
- CSP ve diğer güvenlik başlıkları devreye alınmalı.
- Yetkilendirme ve IDOR testleri yapılmalı.

### Üretime çıkmadan önce

- Kritik/yüksek bağımlılık açıkları sıfırlanmalı veya belgeli risk kabulü yapılmalı.
- Lint, type-check ve production build hatasız olmalı.
- Anonim, müşteri, analizör, asistan, editör ve admin rolleri ayrı ayrı test edilmeli.
- Bir kullanıcının başka kullanıcının kayıtlarına erişemediği doğrulanmalı.
- Dosya yükleme, ödeme, parola sıfırlama ve rate-limit testleri yapılmalı.
- Loglarda parola, token, kimlik numarası ve gereksiz kişisel veri bulunmadığı doğrulanmalı.
- Eski demo veri ve erişilebilir build çıktıları temizlenmelidir.

---

## Durum özeti

| Bulgu | Önem | Mevcut durum |
|---|---|---|
| Sunucu taraflı kimlik doğrulama/yetkilendirme yok | Kritik | Açık |
| Yönetim rotaları korunmuyor | Kritik | Açık |
| Kaynak kodda kişisel/finansal veri | Kritik | İncelenmeli ve temizlenmeli |
| Next.js ve dolaylı bağımlılık açıkları | Kritik/Yüksek | Açık |
| Yetkili kayıtlar `localStorage` içinde | Yüksek | Demo uygulama |
| Güvenlik başlıkları/CSP yok | Orta | Açık |
| URL protokol/alan doğrulaması yok | Orta | Açık |
| Dosya doğrulaması tutarsız | Orta | Açık |
| Lint kontrolü başarısız | Düşük/Kalite | Açık |

Bu rapor mevcut frontend deposunun statik incelemesine dayanır. Backend deposu ve API sözleşmeleri ayrıca güvenlik incelemesinden geçirilmelidir.
