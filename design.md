# Eİstatistik — Tasarım Sistemi (Kaynak: mevcut kod)

Bu belge, uygulamada **halihazırda var olan** tasarım kalıplarını sabitler. Amaç: her yeni
sayfa/bileşen/CSS bu belgedeki token, düzen ve bileşen sözleşmelerine uysun; LLM'ler bu
belgenin dışına çıkıp yeni görsel dil, yeni class sistemi veya paralel bileşen icat etmesin.

> Kanonik uygulamalar (değişiklik yaparken bunları referans al):
> - Profil dropdown → [src/app/components/ProfileMenu.tsx](src/app/components/ProfileMenu.tsx)
> - Sipariş detay + Ödeme + Ödeme sözleşme modalı → [src/app/siparislerim/DS260723008/page.tsx](src/app/siparislerim/DS260723008/page.tsx)
> - Kayıt Ol sözleşme modalı → [src/app/page.tsx](src/app/page.tsx) (`LegalModal`)
> - Tüm stiller → [src/app/globals.css](src/app/globals.css)

---

## 0. Bağlayıcı kurallar (ZORUNLU)

1. **Yeni görsel kalıp üretme.** UI/CSS gerektiren her işte önce buradaki bir kalıbı ara ve
   **aynı class'ları / bileşenleri yeniden kullan**. Uygun kalıp yoksa, en yakın mevcut kalıbı
   uyarla; sıfırdan yeni bir sistem kurma.
2. **Token'ların dışına renk/gölge/radius yazma.** Renkler `:root` değişkenlerinden
   (`var(--navy)` vb.) veya §1'deki tekrar eden değerlerden gelir. Rastgele hex kullanma.
3. **Bu dosyada tanımlı bileşenlerin yapısını (JSX iskeleti + class adları) koru.** Profil
   dropdown, sipariş detay düzeni, ödeme sekmesi ve sözleşme modalı §4–§7'deki iskeletlere
   birebir uymak zorundadır.
4. **Global uygulama iskeletini (`app-shell` → `topbar` → `main` → `support-button`) her
   sayfada aynı kur.** §3'e bak.
5. **İkonlar** yalnızca §2'deki inline-SVG `Icon` kalıbıyla çizilir. İkon kütüphanesi ekleme,
   `<img>` ile ikon getirme.
6. Yeni bir kalıp gerçekten gerekliyse: önce bu belgeye ekle, sonra kodla. Belge ile kod
   birbirini yansıtmalı.

---

## 1. Tasarım token'ları

### Renk değişkenleri (`:root`, globals.css)
| Değişken | Değer | Kullanım |
|---|---|---|
| `--navy` | `#132b46` | Birincil koyu; başlıklar, koyu butonlar, sidebar, aktif tab |
| `--navy-deep` | `#0d2137` | Daha koyu lacivert varyant |
| `--blue` | `#1775a9` | Vurgu / link / marka mavisi |
| `--blue-soft` | `#eaf4f8` | Mavi yumuşak zemin, focus halkası |
| `--ink` | `#17283a` | Gövde metin rengi (`body`) |
| `--muted` | `#6b7c8d` | İkincil metin |
| `--line` | `#dce5ea` | Kenarlık / ayraç |
| `--canvas` | `#f3f6f7` | Sayfa arka planı |
| `--surface` | `#fff` | Kart / panel zemini |
| `--amber` | `#b66d2e` | Uyarı / "onay bekliyor" vurgusu |

### Tekrar eden yardımcı renkler (token değilse bu değerleri kullan)
- Gri metin skalası (koyudan açığa): `#3f556a` → `#54687a` → `#617689` → `#758695` → `#8493a0`
- Başarı yeşili: `#287a55`, `#3c8a6b`, `#3a826c` · yumuşak zemin `#f2faf6`
- Hata / çıkış kırmızısı: `#ad4f4f`, `#c85a51` · yumuşak zemin `#fff3f2`
- Amber rozet zemini: `#b97738`

### Yarıçap (radius)
- Kart/panel/modal: **12–15px** (kartlar 14–15, paneller 13, dropdown 12)
- Buton / input / kutu: **7–9px**
- Küçük çip / ikon kutusu: **5–8px**
- Hap (pill) / nokta: `99px`

### Gölge
- Kart (durağan): `0 8px 25px rgba(19,43,70,.035)`
- Yükseltilmiş / sticky panel: `0 12px 30px rgba(19,43,70,.06)`
- Dropdown: `0 18px 45px rgba(19,43,70,.16)`
- Modal: `0 35px 90px rgba(7,21,36,.32)`

### Tipografi
- Font: **Inter** — `next/font/google`, `--font-inter` değişkeni ([layout.tsx](src/app/layout.tsx)).
- Kompakt ölçek (bilinçli): çoğu gövde **.6–.7rem**, küçük etiketler **.5–.56rem**.
- `.eyebrow` üst etiket: `.63rem`, `font-weight:800`, `letter-spacing:.13em`, BÜYÜK HARF,
  renk `#788b9b` (`.light` varyantı `#83b6d1`).
- Panel başlığı `h2`: `1rem`, `letter-spacing:-.02em`, `var(--navy)`.
- Hero `h1`: ~`2rem` civarı, `letter-spacing` negatif.
- Ağırlıklar: gövde 700, vurgu 800–850.

### Ölçü sabitleri
- `topbar` yüksekliği: **72px**. Sticky paneller/sidebar: **`top: 88px`**.
- İçerik genişlikleri: detay sayfası `min(1380px, 100% - 3rem)`; talep sayfası benzer merkezli.
- Kırılım noktaları globals.css'te tanımlı; yeni responsive kural eklerken mevcut
  `@media` bloklarının mantığını izle (kartlar 3→2→1 kolon, sidebar yatay kaydırmaya döner).

---

## 2. İkon sistemi (ZORUNLU kalıp)

Her sayfa kendi içinde tipli bir `Icon` bileşeni tanımlar. Kural:

```tsx
type IconName = "arrow" | "bell" | /* ... o sayfanın kullandıkları */;

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    /* ... */
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
```

- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.8"`,
  yuvarlak uç/köşe, `aria-hidden="true"`.
- İkon rengi daima `currentColor` (üst elementin `color`'undan gelir).
- Yeni ikon gerektiğinde **mevcut path setinden** kopyala; aynı path'i yeniden çizme.
- Renkli/PNG dosya ikonları (Excel, SPSS, PDF…) yalnızca dosya-tipi göstermek için
  `/icons/*.png` + `next/image` ile kullanılır (bkz. `FileTypeIcon` / `RequestFileIcon`).

---

## 3. Uygulama iskeleti (her sayfada aynı)

```tsx
<div className="app-shell">
  <a className="skip-link" href="#main-content">İçeriğe geç</a>
  <header className="topbar">
    <Link className="brand" href="/dashboard" aria-label="Eİstatistik ana sayfa">
      <Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik"
        width={300} height={69} priority />
    </Link>
    <nav className="main-nav" aria-label="Ana navigasyon">
      <Link href="/dashboard"><Icon name="home" size={17} />Genel bakış</Link>
      <Link href="/siparislerim"><Icon name="file" size={17} />Siparişlerim</Link>
      <Link href="/egitimler"><Icon name="book" size={17} />Eğitimlerim</Link>
      <Link href="/yeni-analiz-talebi"><Icon name="spark" size={17} />Hizmetler</Link>
    </nav>
    <div className="top-actions">
      <a className="istabot-link" href="https://www.istabot.com/" target="_blank"
        rel="noopener noreferrer" aria-label="İstabot web sitesini yeni sekmede aç">
        <Image src="/istabot-header.png" alt="İstabot" width={1226} height={404} />
      </a>
      <button className="icon-button" aria-label="Bildirimler">
        <Icon name="bell" /><span className="notification-dot">2</span>
      </button>
      <ProfileMenu />
    </div>
  </header>
  <main id="main-content" className="...">{/* sayfa içeriği */}</main>
  <button className="support-button" aria-label="Destek"><Icon name="message" /><span>Destek</span></button>
</div>
```

Kurallar:
- Aktif menü öğesi `className="active"` alır.
- Topbar grid: `auto 1fr auto` (marka / nav / aksiyonlar), `position: sticky; top: 0`.
- Marka logosu koyu sayfalarda `Siyah e-istatistik.png`, koyu zeminlerde (auth) `Beyaz…`.
- Alt içerik sayfaları `back-link` ile bir üst listeye döner:
  `<Link className="back-link" href="..."><Icon name="back" size={16} />… dön</Link>`.

---

## 4. Profil dropdown (üst bar) — `ProfileMenu`

Kaynak: [src/app/components/ProfileMenu.tsx](src/app/components/ProfileMenu.tsx). Üst bardaki
profil butonuna tıklanınca açılan menü **bu bileşendir**; her yerde `<ProfileMenu />` olarak
kullanılır, yeniden yazılmaz.

**Yapı:**
```tsx
<div className="profile-menu-wrap" ref={menuRef}>
  <button className={`profile-button ${open ? "open" : ""}`} aria-expanded={open}
    aria-haspopup="menu" aria-label="Profil menüsünü aç">
    <span className="avatar">KM</span>
    <span className="profile-copy"><strong>Kerem Murat</strong><small>Müşteri hesabı</small></span>
    <span className="profile-caret">⌄</span>
  </button>
  {open && (
    <div className="profile-dropdown" role="menu">
      <div className="profile-dropdown-head">
        <span className="avatar">KM</span>
        <span><strong>Kerem Murat</strong><small>kerem@example.com</small></span>
      </div>
      <nav aria-label="Profil işlemleri">
        <Link href="/dashboard#ayarlar" role="menuitem"><Icon name="settings" /><span>Ayarlar</span></Link>
        <Link href="/siparislerim" role="menuitem"><Icon name="orders" /><span>Siparişler</span></Link>
        <Link className="logout" href="/" role="menuitem"><Icon name="logout" /><span>Çıkış yap</span></Link>
      </nav>
    </div>
  )}
</div>
```

**Davranış sözleşmesi (değiştirilemez):**
- Dropdown `profile-menu-wrap` içine konumlanır: `position:absolute; top:calc(100% + 10px); right:0`, genişlik `248px`.
- Açılış animasyonu `profile-menu-in .18s ease-out`.
- Dışarı tıklama (`mousedown`) ve `Escape` menüyü kapatır; her menü öğesine tıklama da kapatır.
- Açıkken caret 180° döner (`.profile-button.open .profile-caret`).
- `aria-expanded`, `aria-haspopup="menu"`, `role="menu"`/`role="menuitem"` zorunlu.
- Çıkış öğesi `.logout` (kırmızı) ve üstünde ayraç. Avatar baş harfleri `.avatar` çipinde.
- Aynı açılır-menü etkileşimi (dış tıklama + Escape + `aria-expanded`) Eğitimler navigasyon
  dropdown'unda da (`education-nav-wrap` / `education-dropdown`) aynı mantıkla kullanılır.

### 4.1 Bildirim menüsü (üst bar zil) — `NotificationMenu`

Kaynak: [src/app/components/NotificationMenu.tsx](src/app/components/NotificationMenu.tsx). Üst
bardaki zil ikonu **bu bileşendir**; `<NotificationMenu />` olarak kullanılır, statik buton bırakılmaz.
Profil dropdown'ıyla **aynı etkileşim sözleşmesini** paylaşır ve `profile-menu-in` animasyonunu kullanır.

```tsx
<div className="notification-menu-wrap" ref={menuRef}>
  <button className={`icon-button ${open ? "open" : ""}`} aria-expanded={open}
    aria-haspopup="menu" aria-label="Bildirimler, N okunmamış">
    <Icon bell /> {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
  </button>
  {open && (
    <div className="notification-dropdown" role="menu">
      <div className="notification-dropdown-head">
        <div><strong>Bildirimler</strong><span>{unreadCount} yeni</span></div>
        <button onClick={markAllRead} disabled={unreadCount === 0}>Tümünü okundu işaretle</button>
      </div>
      <div className="notification-list">
        <Link className="notification-item unread" role="menuitem" href="..." onClick={/* markRead + kapat */}>
          <span className="notification-icon"><Icon /></span>
          <span className="notification-text"><strong>Başlık</strong><small>Meta</small></span>
          <span className="notification-unread-dot" aria-hidden="true" />
        </Link>
        {/* okunmuşlarda .unread ve .notification-unread-dot yok */}
      </div>
      <Link className="notification-dropdown-foot" role="menuitem" href="/dashboard">Tüm bildirimleri gör</Link>
    </div>
  )}
</div>
```

**Davranış sözleşmesi:**
- Zil butonu `.icon-button` kalır; açıkken `.open` (aynı hover zemini). Okunmamış sayısı
  `.notification-dot` (kırmızı `#c85a51`) ile gösterilir, **sıfırsa nokta gizlenir**.
- Dropdown `notification-menu-wrap` içine konumlanır: `top:calc(100% + 10px); right:0`,
  genişlik `min(344px, 100vw - 1.5rem)` (mobilde taşmaz).
- Dış tıklama + `Escape` kapatır; `aria-expanded` / `aria-haspopup="menu"` / `role="menu"`/`"menuitem"` zorunlu.
- Öğe okunmamışsa `.notification-item.unread` (mavi ikon zemini + kalın başlık + sağda mavi
  `.notification-unread-dot`). Öğeye tıklama onu okundu işaretler ve menüyü kapatır.
- Baştaki "Tümünü okundu işaretle" hepsini okundu yapar; okunmamış yokken pasiftir.
- İkon zemini `.notification-icon` (okunmuşta `#eef4f6`, okunmamışta `var(--blue-soft)`),
  dashboard "Son güncellemeler" (`.update-icon`) görsel diliyle uyumludur.

---

## 5. Sipariş detay sayfası düzeni

Kaynak: [src/app/siparislerim/DS260723008/page.tsx](src/app/siparislerim/DS260723008/page.tsx).
Tüm sipariş detayları bu iskeleti kullanır.

```
main.detail-page
├─ back-link                      → "Siparişlerime dön"
├─ header.detail-hero             → grid: 1.2fr | 1fr | auto
│   ├─ .detail-title  (ikon + eyebrow(kod·tarih) + h1)
│   ├─ .detail-current-state  (.state-pulse + MEVCUT DURUM + açıklama)
│   └─ button  → aktif bölüme (ör. "Ödemeye git")
└─ .detail-workspace              → grid: 235px | 1fr
    ├─ aside.detail-sidebar       → koyu (var(--navy)), sticky top:88px
    │   ├─ p  "SİPARİŞ MENÜSÜ"
    │   ├─ nav → button.{active} [Icon + label + opsiyonel <i> rozet]
    │   └─ .sidebar-help
    └─ section.detail-content     → aktif bölümü render eder
```

**Bölümler (sidebar `Section` state'i ile değişir):** `overview`, `files` (Sipariş
Kalemleri), `payment`, `messages`, `deliveries`, `appointments`, `invoice`, (+teslim
sonrası `extra`). Sidebar öğesi bildirim rozetini `<i>1</i>` ile gösterir (amber `#b97738`).

**Panel kalıbı — her bölüm içeriği bunu kullanır:**
```tsx
<section className="detail-panel">
  <PanelHeading eyebrow="ÜST ETİKET" title="Başlık" description="Opsiyonel açıklama" />
  {/* panel gövdesi */}
</section>
```
`PanelHeading`: `.detail-panel-heading` (min-height 76px, alt kenarlık) → `.eyebrow` + `h2`(1rem) + opsiyonel `span`.
Birden çok panel dikeyde `.detail-stack` (gap:1rem) ile dizilir.

**Tekrar eden panel içerik kalıpları:**
- **Süreç zaman çizelgesi:** `.detail-timeline` → adımlar `done` / `current` / (boş) durumlu.
- **Bilgi listesi:** `<dl className="detail-facts">` → `dt`/`dd` çiftleri; kritik değer `dd.warning`.
- **Kilitli durum** (ödeme öncesi teslim/fatura): `.locked-panel` içinde `.locked-state`
  (ikon + h3 + açıklama + "Ödemeye git" butonu). Kompakt varyant `.locked-state.compact`.
- **Dosya satırı:** `FileTypeIcon` (uzantıya göre PNG ikon) + ad/meta + indir butonu.

---

## 6. Ödeme sekmesi

Kaynak: `Payment` bileşeni, [DS260723008/page.tsx](src/app/siparislerim/DS260723008/page.tsx).
Detay sayfasının `payment` bölümü **bu düzeni** kullanır; eğitim ödeme sayfası da (`payment-summary`) aynı özet/indirim kalıbını paylaşır.

```
.payment-layout                    → grid: minmax(0,1fr) | 340px
├─ section.detail-panel.payment-main
│   ├─ PanelHeading (yönteme göre başlık/açıklama)
│   ├─ [Havale/EFT] .bank-box  (banka bilgileri dl + IBAN/açıklama "Kopyala" + .receipt-upload dekont)
│   │   veya
│   │   [Kart] .secure-card-redirect  (Akbank 3D Secure yönlendirme kartı) + .payment-privacy-note
│   ├─ button.payment-contract-consent[.accepted]   → sözleşme modalını açar (§7)
│   └─ button.pay-button[disabled]                   → sözleşme onaylanana kadar pasif
└─ aside.payment-summary            → sticky top:88px, ÖDEME ÖZETİ
    ├─ h2 (hizmet adı)
    ├─ dl.payment-price-lines  (Hizmet bedeli / İndirim[.discounted])
    ├─ .discount-entry.summary-discount  → İndirim kodu aç/kapa + form (§6.1)
    ├─ dl.payment-total  (Toplam)
    └─ .summary-payment-methods → .payment-tabs (Havale/EFT ↔ Kredi kartı)
```

**Sözleşme onayı kutusu (`.payment-contract-consent`):** `auto 1fr auto` grid →
onay kutucuğu (`span`, onaylıysa `check` + yeşil) + `<strong>` (altı çizili "Sözleşmeyi") +
`<i>` durum ("İncele" / "Onaylandı"). Onaylanınca `.accepted` (yeşil çerçeve/zemin) ve
`pay-button` etkinleşir.

**Ödeme yöntemi tabları (`.payment-tabs`):** iki buton (Havale/EFT · Manuel onay) ve
(Kredi kartı · 3D Secure). Aktif buton `.active` → dolu lacivert. Özet içindeki varyant
dikey/iki satırlı (`.payment-summary .payment-tabs`).

### 6.1 İndirim kodu (`.discount-entry`)
- Tetik `.discount-trigger` (`% · İndirim kodu gir · +/−`), `aria-expanded` ile açılır.
- Açık form `.discount-form`: `label`+`input` (BÜYÜK harf) + "Uygula" butonu; girdi boşken buton pasif.
- Durum: `idle | success | error`. Prototipte kod **client tarafında** `EISTATISTIK10` → %10.
  Başarı `p.success` "Kod uygulandı.", hata `p.error` "Kod geçerli değil."
- Not: gerçek sistemde indirim doğrulaması sunucu tarafında olmalı; bu görsel/etkileşim kalıbı korunur.

---

## 7. Sözleşme modalı (kayıt + ödeme öncesi) — `legal-modal`

İki yerde **aynı görsel kalıp** kullanılır ve aynı kalmalıdır:
- **Kayıt Ol** sayfası — `LegalModal` ([src/app/page.tsx](src/app/page.tsx)): Üyelik Sözleşmesi + KVKK.
- **Ödeme** öncesi — `PaymentAgreementModal` ([DS260723008/page.tsx](src/app/siparislerim/DS260723008/page.tsx)): Havale/EFT veya Kart öncesi onay.

```tsx
<div className="legal-modal-backdrop" role="presentation">
  <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="...-title">
    <header>
      <div><p>ÜST ETİKET</p><h2 id="...-title">Başlık</h2></div>
      <button aria-label="Pencereyi kapat">×</button>
    </header>
    <div className="legal-scroll-progress" role="progressbar"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={/* % */}>
      <span style={{ width: `${progress}%` }} />
    </div>
    <div className="legal-document-content" onScroll={handleScroll} tabIndex={0}>
      {loading ? <div className="legal-loading">… yükleniyor…</div> : <pre>{content}</pre>}
    </div>
    <footer>
      <div><Icon name="shield|card" size={18} /><span>{reachedEnd ? "Belgenin sonuna ulaştınız." : "Kabul edebilmek için belgenin sonuna kadar ilerleyin."}</span></div>
      <div>
        <button className="legal-cancel">Vazgeç</button>
        <button className="legal-accept" disabled={!reachedEnd}>Okudum ve kabul ediyorum</button>
      </div>
    </footer>
  </section>
</div>
```

**Davranış sözleşmesi (değiştirilemez):**
- Modal iskeleti `grid-template-rows: auto 3px minmax(0,1fr) auto` (header / progress / içerik / footer).
- Metin `/legal/*.txt`'ten `fetch` ile alınır ve `<pre>` içinde gösterilir
  (`uyelik-sozlesmesi.txt`, `kvkk-aydinlatma-metni.txt`).
- **Sonuna kadar okumadan kabul edilemez:** içerik kaydırıldıkça üstteki `legal-scroll-progress`
  dolar; ilerleme `>= %99` olduğunda `reachedEnd=true` ve ancak o zaman `legal-accept` etkinleşir.
- `Escape` ve `×` / "Vazgeç" modalı kapatır; `role="dialog"` + `aria-modal="true"` zorunlu.

---

## 8. Landing kurum logo şeridi — `landing-logo-marquee`

Kaynak: [src/app/page.tsx](src/app/page.tsx). Landing sayfasının son CTA alanı ile footer'ı
arasında, `/public/davet` altındaki kurum logolarını kesintisiz gösteren tek yatay şerittir.

```tsx
<section className="landing-logo-marquee" aria-label="Birlikte çalıştığımız kurumlar">
  <div className="landing-logo-marquee-track">
    <div className="landing-logo-marquee-group">{/* logolar */}</div>
    <div className="landing-logo-marquee-group" aria-hidden="true">{/* aynı logolar */}</div>
  </div>
</section>
```

Kurallar:
- Sayfada yalnızca bir logo marquee bulunur; ikinci bir kayan metin/logo şeridi eklenmez.
- Kesintisiz döngü için aynı logo grubu iki kez render edilir; ikinci grup ekran okuyuculardan gizlenir.
- Logolar kendi oranları korunarak `next/image` ile gösterilir ve `grayscale(1)` filtresiyle tek gri
  tona indirilir. Logo kartı, renkli vurgu veya kurum adı etiketi eklenmez.
- Hareket yalnızca `transform` üzerindedir. `prefers-reduced-motion: reduce` durumunda animasyon kapanır
  ve şerit yatay kaydırılabilir statik bir listeye döner.
- Şerit footer'ın koyu temasına geçmeden önce açık landing zemininde kalır; kenarlıklar mevcut
  `--line` / landing nötr skalasından gelir.

### 8.1 Landing footer — `landing-footer`

Landing footer koyu lacivert zemin üzerinde dört bilgi kolonundan ve ayrı bir alt bardan oluşur:

1. Marka logosu + kısa açıklama.
2. `Hızlı Erişim`: landing üst navigasyonundaki bağlantılar.
3. `Hizmetlerimiz`: landing servis rotaları.
4. `İletişim`: adres, telefonlar ve e-posta.

Alt bar solda telif metnini, sağda Instagram ve X sosyal profil ikonlarını taşır. Sosyal
bağlantılar yeni sekmede açılır; `aria-label`, `rel="noopener noreferrer"` ve görünür
focus durumu zorunludur. İkonlar mevcut ikon sözleşmesine uygun `currentColor` inline SVG'dir.

Masaüstünde kolonlar `minmax(250px,1.35fr) repeat(3,minmax(150px,1fr))`, mobilde tek kolon olur.
Footer içeriği landing genişlik sözleşmesine göre `1480px` içinde merkezlenir.

### 8.2 Hero analiz araçları kartı — `float-tools`

Landing hero'nun sağındaki platform önizlemesi üzerinde, kullanılan analiz yazılımlarını
gösteren tek bir `.landing-float-card.float-tools` bulunur. Kart mevcut yüzen kart yüzeyini,
radius ve gölgesini yeniden kullanır; yeni renk veya ikon sistemi eklemez.

- Araçlar: SPSS, R, Python, STATA, AMOS, LISREL ve Minitab.
- Masaüstünde platform görselinin sağ üstünde konumlanır.
- Mobilde absolute konumdan çıkar, platform önizlemesinin altında statik ve yatay kaydırılabilir olur.
- Kart dekoratif değil bilgilendiricidir; araç adları metin olarak okunabilir kalır.

### 8.3 Hero ürün ailesi arka planı — `HeroFamilyField`

Kaynak: [src/app/components/HeroFamilyField.tsx](src/app/components/HeroFamilyField.tsx). Landing
hero arka planı, Eİstatistik Akademi'nin fiber akışları ile İstabot'un hareketli noktalarını
aynı hafif canvas katmanında birleştirir.

- Renkler yalnızca landing mavi/yeşil ailesinden gelir; mor/neon veya yeni vurgu rengi eklenmez.
- Canvas `pointer-events:none` ve `aria-hidden="true"` olmalı, hero içeriğinin arkasında kalmalıdır.
- Animasyon React state kullanmaz; canvas çizimi `requestAnimationFrame` ile doğrudan güncellenir.
- `ResizeObserver` ile kapsayıcıya uyar, component unmount olduğunda observer ve animation frame temizlenir.
- `prefers-reduced-motion: reduce` durumunda yalnızca tek statik kare çizilir.
- Normal açılışta fiberler soldan sağa yaklaşık 1.6 saniyede çizilir; hareketli ışık
  noktaları ve parçacık ağı ancak bu çizim tamamlanırken yumuşak biçimde görünür ve akmaya başlar.
- Fiber üzerindeki hareketli öğeler büyük bulanık ışık küreleri değildir; kablonun yönüne
  oturan kısa sinyal kapsülü, beyaz veri çekirdeği ve kontrollü ince kuyruktan oluşur.
- Metin okunabilirliği için alan merkezde ve sol metin bölgesinde maskeyle zayıflatılır;
  hareketli noktalar CTA ve başlık kontrastını bozamaz.

### 8.4 Landing hizmet listesi — `landing-service-grid`

Landing hizmetleri büyük bento blokları yerine tek kolonlu, sağ-sol dönüşümlü yatay liste
kartlarıyla sunulur. Kart yüzeyi mevcut `landing-service-card` sınır, radius ve renklerini korur.

- Masaüstünde kartlar bölüm genişliğinden daha dar tutulur; tek numaralılar sola, çift
  numaralılar sağa yaslanır.
- Çift numaralı kartlarda görsel sağa alınarak akış ritmi dönüşümlü hale gelir.
- Görsel alanı kart yüksekliğini büyütmez; metin ve eylem tek bakışta taranabilir kalır.
- Tablet görünümünde tüm kartlar bölüm genişliğini kullanır. Mobilde kompakt yatay düzen
  korunur; çok dar ekranlarda görsel metnin üstüne geçer.
- Hizmet sırası, metinleri ve bağlantıları değişmez.

- Kayıt akışında Üyelik onaylanınca sıradaki KVKK modalı otomatik açılır; her onay ilgili
  onay kutusunu (`membershipAccepted` / `kvkkAccepted`) işaretler.
- Ödeme akışında modal onayı ilgili `...AgreementAccepted` state'ini `true` yapar ve
  `pay-button`'u açar.

---

## 7.5 Ayarlar sayfası (`/ayarlar`)

Kaynak: [src/app/ayarlar/page.tsx](src/app/ayarlar/page.tsx). Profil dropdown'ındaki **Ayarlar**
öğesi buraya gider (`/ayarlar`). Kullanıcı yalnızca **kendi** bilgilerini günceller.

- **Düzen §5'i yeniden kullanır:** `detail-page` → `detail-hero` (başlık + `detail-current-state`
  hesap özeti) → `detail-workspace` (koyu `detail-sidebar` + `detail-content`).
- Sidebar bölümleri (`Section` state'i): **Hesap bilgileri** (`account`), **Fatura bilgileri**
  (`billing`), **Güvenlik** (`security`).
- Her bölüm bir `<form className="detail-stack">`; içinde `detail-panel` + `PanelHeading`.
  Panel gövdesi `.settings-panel-body` (padding + `gap`); ikili alanlar `.form-grid` (2 kolon,
  ≤760px'te tek kolon). Alanlar §yeni-analiz'deki gibi `.form-field` (label + input/textarea)
  ve segment seçimler `.choice-field` (pill buton grubu) ile kurulur.
- Panel altı işlem barı `.settings-actions` → solda `role="status"` `.settings-note`
  (`.success` yeşil / `.error` kırmızı) + sağda `.settings-save` (lacivert buton, `check`/`shield` ikon).
- **Bölümler ve alanlar:**
  - Hesap: Ad Soyad*, E-posta*, Cep telefonu · (ek) Akademik: seviye (choice), Üniversite, Fakülte, Bölüm.
  - Fatura: `.choice-field` **Bireysel / Kurumsal**. Bireysel → TC Kimlik No (11 hane). Kurumsal →
    Firma ünvanı, Vergi dairesi, Vergi no. Ortak → İl, İlçe, Fatura adresi (textarea).
  - Güvenlik: Mevcut parola, Yeni parola (≥6), Yeni parola tekrar.
- Doğrulamalar client-side ve prototip amaçlıdır; başarı/hata `.settings-note` ile bildirilir.

---

## 7.6 Yönetici (admin) paneli

Kaynak: [src/app/admin/](src/app/admin/). `admin@eistatistik.com` ile giriş buraya yönlenir
([[demoAccounts]]). Müşteri arayüzüyle **aynı tasarım dilini** (token, kart, panel) kullanır;
fark, veri yoğun "yönetim" düzeni ve custom SVG grafiklerdir.

- **Kabuk:** [AdminShell.tsx](src/app/admin/AdminShell.tsx) — `app-shell` + `topbar`; ortada
  `.admin-nav` (Anasayfa · Sipariş Yönetimi ▾ · Eğitimler ▾ · Yönetim ▾ · Takvim). Dropdown'lar
  §4 davranışını izler (tek `openMenu` state, dış tıklama + Escape kapatır, `aria-expanded`).
  Menü paneli `.admin-menu` (kompakt liste). Üst sağda `NotificationMenu` + `ProfileMenu` yeniden kullanılır.
- **Grafikler:** [charts.tsx](src/app/admin/charts.tsx) — bağımlılıksız custom SVG. `Donut`
  (parça-bütün; merkez `children`), `AreaChart` (zaman serisi, gradient dolgu, `preserveAspectRatio="none"`
  + `vectorEffect="non-scaling-stroke"`), `Sparkline` (KPI trend). Segment/çizgi renkleri **hex** verilir
  (SVG `stroke` attribute'ü CSS değişkeni çözmez), marka tonlarına sadık: navy `#132b46`, blue `#1775a9`.
- **Anasayfa düzeni** ([page.tsx](src/app/admin/page.tsx)), yukarıdan aşağıya:
  1. **Hero:** müşteri panelindeki `.daily-brief` (navy kart) **yeniden kullanılır** — `.admin-brief`
     modifier'ı ile. `.brief-copy` (tarih eyebrow + "Merhaba, Kerem." + bilgilendirme metni) +
     `.brief-stats` (5 bekleyen-işlem metriği: geçen 13 · yaklaşan 44 · ücretlendirilecek 1 · havale onayı 0 ·
     cevap bekleyen 0) + `.primary-button`. İki panelin görsel dili tek tip olsun diye ayrı bir "aksiyon şeridi" yoktur.
  3. `.admin-grid-2` — solda Ciro `AreaChart` (Aylık/Yıllık `.rev-toggle`), sağda Görev `Donut` + `.chart-legend` + `.completion-bar`.
  4. `.admin-grid-3` — Teslimat `.bar-list` + Ek analiz `.split-track`; Kullanıcı KPI + `Sparkline`; Ödeme `Donut`.
     Üç kart **eşit yükseklikte** (`align-items:stretch` + flex kolon kartlar); referans/en uzun kart
     Kullanıcılar'dır (`.user-spark` flex ile kalan alanı doldurur), diğer ikisi ona uzar, footer'lar alta yaslanır.
  5. Son siparişler `.admin-table` (`.t-status` rozetleri: action/active/completed).
- Paneller mevcut `detail-panel` + `.detail-panel-heading` kalıbını kullanır; gövde `.admin-panel-body`
  / `.donut-panel-body`, panel altı hızlı bağlantılar `.admin-panel-foot` (orijinal Ciro/Kullanıcı
  istatistik linkleri buraya gömülür). Grafik renkleri ve durum tonları §1 token/paletinden gelir.
- **İlk bölüm görünür alana sığar:** selam + aksiyon şeridi + ciro/görev satırı `.admin-fold`
  içine alınır; geniş ekranda (`min-width:1121px`) `min-height:calc(100dvh - 72px - 1.6rem)` ile
  topbar altındaki alana tam oturur ve ciro `AreaChart` kalan boşluğu doldurur (`.rev-chart` flex).
  Dar ekranda doğal akışa (scroll) döner.
- **Gizlilik (göz) toggle'ı:** üst bardaki göz ikonu (`AdminShell`, `dataHidden` state) durumu
  `DataHiddenContext` ile sayfaya taşır (`useDataHidden()`). Gizliyken **veriler blur değil, gerçekten
  maskelenir**: sayılar `•` ile değişir, grafikler sıfırlanmış veriyle boşalır (donut boş halka, area/spark
  düz çizgi, barlar 0), tablo "Veriler gizlendi" satırına döner. Etiket/başlıklar okunur kalır; göz açılınca
  orijinal veriler geri gelir.
- **Alt sayfalar** `AdminShell` içinde kurulur. Üst kısımda `.admin-breadcrumb` (Anasayfa · bölüm · **sayfa**).
- Veriler şimdilik statik/mock; gerçek sistemde backend'den beslenmeli.

### 7.6.1 Mevcut Siparişler / Analizler — `/admin/siparisler`

Kaynak: [src/app/admin/siparisler/page.tsx](src/app/admin/siparisler/page.tsx).
**Müşterinin Siparişlerim sayfasıyla (`/siparislerim`) aynı görsel düzeni paylaşır** — aynı CSS sınıfları, aynı
kart-grup yapısı. Tek fark: her satırda müşteri, analizör bilgisi de gösterilir ve grid 5 sütundur.

**Düzen (müşteri §4'teki `orders-page` kalıbı yeniden kullanılır):**
```
.orders-page.admin-orders-page
├─ nav.admin-breadcrumb
├─ header.orders-hero (eyebrow + h1 + .orders-create butonu)
├─ nav.order-tabs  (Tümü · Bekleyen · Aktif · Teslim edilen · İptal edilen — sayaçlı)
├─ section.orders-toolbar  (.orders-search + .result-count)
└─ div.order-groups.admin-orders
    └─ section.order-group[.subdued]
        ├─ header (eyebrow + h2 + sayaç)
        └─ div.orders-table
            ├─ div.orders-table-head  (5 sütun başlık)
            └─ article.orders-row ×N
                ├─ .order-identity   (file ikon + Hizmet tipi + kod·tarih)
                ├─ .order-identity   (user ikon + Müşteri adı + platform)
                ├─ .order-state      (.state-dot[.action/.completed/.cancelled] + Durum + kalan gün)
                ├─ .delivery-cell    (clock ikon + Analizör adı)
                └─ .order-actions    (.context-action "Detay")
```

**5-sütun grid override (globals.css, `.admin-orders` modifier'ı):**
```css
.admin-orders .orders-table-head,
.admin-orders .orders-row { grid-template-columns: 1.35fr 1fr 1.15fr 0.9fr 0.65fr; }
```

**Durum grupları ve `.state-dot` renk eşleşmesi:**
| Grup | Statüler | `.state-dot` sınıfı |
|---|---|---|
| Bekleyen (action) | siparis-verildi | `state-dot action` (amber) |
| Aktif (active) | yapiliyor, yapildi, ek-ucret, ek-yapiliyor | `state-dot` (mavi, default) |
| Teslim edilen (completed) | teslim | `state-dot completed` (muted yeşil) |
| İptal edilen (cancelled) | iptal | `state-dot cancelled` (kırmızı) |

Filtre: tabs (durum grubu) + tek arama input'u (`kod · müşteri · analizör · platform` üzerinde).
Sayfalama yoktur; tab seçimi ve arama satır sayısını yönetir.

---

## 8. Yeni bir şey eklerken

1. İhtiyacın §3–§7'deki bir kalıpla karşılanıyorsa **onu yeniden kullan** (aynı class'lar).
2. Renk/gölge/radius/tipografi için **§1 token'larını** kullan.
3. İkon için **§2 kalıbını** kullan.
4. Gerçekten yeni bir kalıp gerekiyorsa: önce bu belgeye ekle (iskelet + class + davranış),
   sonra kodla. Kod ve belge tutarlı kalmalı.
5. Erişilebilirlik mevcut seviyede korunur: `aria-*`, `role`, skip-link, focus/Escape/dış-tıklama
   davranışları eklenen her etkileşimde sürdürülür.
