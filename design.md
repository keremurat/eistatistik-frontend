# eistatistik — Tasarım Sistemi (Kaynak: mevcut kod)

Bu belge, uygulamada **halihazırda var olan** tasarım kalıplarını sabitler. Amaç: her yeni
sayfa/bileşen/CSS bu belgedeki token, düzen ve bileşen sözleşmelerine uysun; LLM'ler bu
belgenin dışına çıkıp yeni görsel dil, yeni class sistemi veya paralel bileşen icat etmesin.

> Kanonik uygulamalar (değişiklik yaparken bunları referans al):
> - Profil dropdown → [src/app/components/ProfileMenu.tsx](src/app/components/ProfileMenu.tsx)
> - Sipariş detay + Ödeme + Ödeme sözleşme modalı → [src/app/siparislerim/DS260723008/page.tsx](src/app/siparislerim/DS260723008/page.tsx)
> - Kayıt Ol sözleşme modalı → [src/app/page.tsx](src/app/page.tsx) (`LegalModal`)
> - Tüm stiller → [src/app/globals.css](src/app/globals.css)

---

## Yönetici analitik paneli

- Yönetici ana ekranında mevcut `daily-brief` Günaydın kartı korunur. Önceki ciro, iş planları, teslimat, kullanıcı, ödeme ve eski son sipariş kartları kullanılmaz; `.admin-analytics` doğrudan Günaydın kartının devamında yer alır.
- Yönetici `daily-brief` kartının sağ aksiyon alanı `.admin-brief-actions` ile dikey iki bağlantı taşır: birincil `Sipariş Yönetimi`, ikincil `Yaklaşan görüşmeler`. İkincil bağlantı `/admin/takvim` rotasına gider ve koyu kart üzerinde şeffaf/çerçeveli görünerek birincil aksiyonla yarışmaz.
- Yönetici analitik grafiklerindeki gerçek veri öğeleri hover ve klavye focus durumunda `.chart-tooltip` bilgi kutusu gösterir. Sütunda dönem ve sipariş sayısı, alan grafiğinde dönem ve gelir, halka diliminde kategori ve adet, analizör çubuğunda kişi/seri ve sipariş sayısı okunur. Tooltip yalnızca etkileşim sırasında görünür ve filtrelenmiş güncel veriyi kullanır.
- Filtre sırası tarih aralığı, analizör ve sipariş türüdür. Seçimler tek veri kapsamıdır; bütün KPI, grafik ve son siparişler aynı kapsama göre güncellenir.
- Analitik kartlar mevcut 14-16 px radius, `--line`, `--navy`, `--blue` ve açık yüzey yaklaşımını sürdürür. Grafikler bağımlılıksız SVG bileşenleridir.
- Okuma sırası: filtreler, altı özet metrik, sipariş hacmi ve durum, gelir, hizmet ve teslimat, ekip performansı, son siparişler.
- Masaüstünde içerik ekran genişliğini kullanır; 1000 px altında ikili grafikler tek kolona, 760 px altında metrikler iki kolona ve filtreler dikey akışa geçer.

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
- Giriş sonrası rol ekranlarında içerik genişliği sabit bir `max-width` ile sınırlandırılmaz.
  `dashboard`, `orders-page`, `detail-page`, `request-page`, `education-page`, `admin-dash` ve
  asistan içerik kabukları `calc(100% - clamp(2rem, 3vw, 3.5rem))` kullanır. Böylece geniş
  ekranlardaki ölü yan alanlar çalışma alanına katılırken güvenli kenar boşluğu korunur. Landing
  sayfalarının kendi içerik genişliği sözleşmeleri bu kuralın dışındadır.
- Giriş sonrası liste ve katalog ekranlarının ana sayfa başlığı yalnızca `h1` içerir. Başlığın
  üzerinde tekrar eden eyebrow ve altında açıklama paragrafı gösterilmez; sağdaki işlevsel
  aksiyonlar veya özet sayaçları korunabilir. Bu sadeleştirme yalnızca sayfa seviyesindeki
  hero/heading alanına uygulanır, panel ve kart başlıklarındaki bağlamsal etiketleri kaldırmaz.
  Eğitimlerim ve Eğitim Kataloğu ekranlarında bu başlık üst bara yakın, `.7rem` sayfa üst
  boşluğu ve kompakt `82px` başlık yüksekliğiyle hizalanır; eğitim detay akışları etkilenmez.
- Hizmet seçim ekranında başlık ile altı hizmet kartı ilk viewportu oluşturur. Yönlendirme
  paneli kaldırılmaz; ilk bakışta görünmez ve kullanıcı sayfayı aşağı kaydırdığında açığa çıkar.
- Graphical Abstract landing detayı eğitim sayfası kalıbını kullanmaz; diğer hizmet detayları
  gibi hero, güven şeridi, hizmet kapsamı, süreç, SSS ve CTA akışına sahiptir. Hero'nun sağında
  YouTube videosu doğrudan oynatılabilen masaüstü monitör çerçevesinde gösterilir.
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
- Favori aksiyonları her yerde üst bardaki favori menüsüyle aynı yıldız ikonunu kullanır;
  kalp veya yer imi ikonu kullanılmaz. Aktif durumda aynı yıldız dolu gösterilir.
- Renkli/PNG dosya ikonları (Excel, SPSS, PDF…) yalnızca dosya-tipi göstermek için
  `/icons/*.png` + `next/image` ile kullanılır (bkz. `FileTypeIcon` / `RequestFileIcon`).

---

## 3. Uygulama iskeleti (her sayfada aynı)

### Sistem dropdown sözleşmesi

- Form, filtre ve sıralama seçimlerinde tarayıcının native `<select>` arayüzü kullanılmaz.
- Ortak `SystemDropdown` bileşeni ve mevcut `.cs-wrap`, `.cs-trigger`, `.cs-panel`,
  `.cs-option` sınıfları kullanılır. Panel `document.body` altında portal olarak açılır; böylece
  tablo, kart ve overflow alanlarında kesilmez ve sayfa kaydırılırken tetikleyiciye bağlı kalır.
- Seçim değeri ve sayfanın filtre/form mantığı değişmez; bu kural yalnızca görsel ve etkileşim
  tutarlılığı sağlar.

```tsx
<div className="app-shell">
  <a className="skip-link" href="#main-content">İçeriğe geç</a>
  <header className="topbar">
    <Link className="brand" href="/dashboard" aria-label="eistatistik ana sayfa">
      <Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik"
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
- Geniş landing header `1600px` üst sınır kullanır; `1681px+` görünümde orta kolon
  `minmax(0,1fr)` olur ve menü aralıkları sıkılaşır. Sağ aksiyon grubu küçülmez veya taşmaz.
- Marka logosu koyu sayfalarda `Siyah e-istatistik.png`, koyu zeminlerde (auth) `Beyaz…`.
- Auth ekranında beyaz logo ve solundaki sade `auth-back-home` oku tek `auth-logo-shortcut`
  bağlantısıdır; grubun herhangi bir yerine tıklamak landing page'e (`/`) döner.
- Alt içerik sayfaları `back-link` ile bir üst listeye döner:
  `<Link className="back-link" href="..."><Icon name="back" size={16} />… dön</Link>`.
- `editor` rolü girişten sonra bağımsız `/editor` çalışma alanına yönlenir; yönetici rotasına
  düşmez. Editör kabuğu ortak `app-shell`, `topbar`, `BrandLogo`, `NotificationMenu` ve
  `ProfileMenu` bileşenlerini kullanır.
- Editör rotaları yeni ve paralel ekranlar üretmez; mevcut sipariş, eğitim, içerik, kullanıcı,
  duyuru, görev ve takvim ekranlarını `/editor/*` altında yeniden kullanır. `AdminShell`,
  `usePathname()` ile editör kipini belirler; editör menüsünde rol yönetimi, proje muhasebesi,
  toplu mesaj ve analizör değiştirme gibi yöneticiye özel bağlantılar gösterilmez.
- Rol anasayfalarında üst `daily-brief` kartından sonraki operasyon akışı mevcut asistan
  kalıbını (`assistant-workspace` → öncelik listesi + iş planları, ardından
  `assistant-queue-strip`) yeniden kullanır. Rol bazında yalnızca metin, sayaç ve hedef rotalar
  değişir; yeni kart ya da paralel CSS dili oluşturulmaz.
- Editör anasayfasında `editor-home-fold`, masaüstünde üst `daily-brief` ile ilk
  `assistant-workspace` bölümünü tek görünür alana sığdırır. Sıkılaştırma yalnızca dikey
  padding, satır yüksekliği ve aralıklar üzerinden yapılır; operasyon kartı kalan viewport
  yüksekliğine esnetilmez, içeriği kadar yüksek kalır.
- Tüm giriş yapılmış rol kabuklarında üst bar aynı genişlik yönetimini kullanır: orta kolon
  `minmax(0,1fr)`, sağ aksiyonlar `flex-shrink:0`, İstabot alanı 96px ve navigasyon iç
  padding'leri akışkan/kompakttır. `801–1500px` arasında uzun profil metni gizlenir; avatar,
  profil menüsü ve rolün tüm navigasyon bağlantıları korunur. Orta navigasyon sağ aksiyon
  kolonunun altına giremez.
- Yönetici/editör ortak takviminde `.cal-sidebar`, masaüstünde `position:sticky; top:88px`
  kullanır; takvim içeriği kaydırılırken renk göstergesi ve kullanıcı filtresi görünür kalır.
  `900px` altında grid tek kolona düşer ve kenar paneli doğal akışa döner.

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

**Proforma Faturanız:** Yönetici sipariş detayında `messages` sonrasında ayrı bir `proforma`
sekmesidir. İçerik `.detail-stack` içinde aynı `.detail-panel`, `.detail-panel-heading` ve
`.result-file-row` kalıplarını kullanır. İlk panel teslim edilen proforma PDF'yi, teslim mesajını
ve indirme aksiyonunu gösterir. Devamındaki paneller ek analiz ve analizör raporlarını aynı dosya
satırı düzeninde gösterir; dosya yoksa sade `.proforma-report-empty` durum satırı kullanılır.
Mavi teslimat, amber ek analiz ve yeşil analizör ayrımı yalnızca sol vurgu çizgisi, durum noktası
ve küçük rozet üzerinde kullanılır; yeni kart veya paralel renk sistemi oluşturulmaz.

**Görüşmeler / Randevu:** Yönetici, editör ve asistan sipariş detayında `appointments`
bölümü `Randevu` etiketiyle yer alır. Bu bölüm müşteriyle yapılacak siparişe bağlı çevrim içi
görüşmeleri listeler; yetkili kullanıcı aynı panel içinde tarih, saat, süre, kanal ve başlık seçerek
yeni görüşme oluşturabilir. Müşteri sipariş detayında aynı kayıtlar salt okunur `Görüşmeler`
sekmesinde görünür. Müşteri menüsündeki belge sekmesi `Fatura` değil `Proforma Faturanız` olarak
adlandırılır ve teslim edilen PDF'yi mevcut dosya satırı kalıbıyla sunar.

### 5.1 Yönetici özel ayarları

Yönetici sipariş detayında `Sipariş Ayrıntıları` bağlantısının hemen altında `Özel Ayarlar`
bulunur. Bu bölüm yalnızca `audience="admin"` için gösterilir; analizör, asistan ve editörün
paylaşılan detay menüsüne eklenmez. İçerik yeni bir sayfa değildir, mevcut `detail-content`
alanında `detail-stack` ve `detail-panel` kalıplarıyla açılır.

- Sipariş bilgileri: çalışma türü ve sipariş durumu.
- Fatura durumu: oluşturulmamış/oluşturulmuş durum özeti.
- Teslimat ayarları: teslimat şekli, süresi ve `DatePicker` ile özel teslim tarihi.
- Portal tabanlı `DatePicker`, açıldığı inputun üst/alt yerleşimini açılış anında belirler ve
  pencere ya da iç panel kaydırmalarında konumunu `requestAnimationFrame` ile yeniden hesaplar.
  Böylece takvim scroll sırasında alanından kopmaz; hareket boyunca aynı tarafta bağlı kalır.
- Proforma fatura: oluşturma tercihi, iş tanımı, adet, birim fiyat ve KDV özeti.
- İstatistiksel analiz sertifikası: sertifika tercihi ve kimlik/tarih alanları.
- Bağlantılı sipariş: sistemin standart açılır seçim kalıbıyla ilişkili sipariş seçimi.

Bu bölümdeki bütün açılır seçimler `.cs-wrap`, `.cs-trigger`, `.cs-panel`, `.cs-option`; tarihler
ise ortak `DatePicker` bileşenini kullanır. Native `select`, native date picker veya paralel dropdown
görsel dili kullanılmaz. Bölüme özgü `.special-settings-*` sınıfları yalnızca panel içi hizalama,
özet ve durum satırlarını düzenler; renk, radius ve gölge mevcut tokenlardan gelir.

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

Eğitim satın alma ödeme ekranı da ödeme yöntemini özet panelinde değil, ana ödeme panelinin
başındaki aynı `.payment-method-switch > .payment-tabs` yapısıyla seçtirir. Buton sırası,
aktif durum, Havale/EFT ve Akbank 3D Secure metinleri sipariş detayıyla aynıdır.

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

### 8.1 Landing footer — `LandingFooter`

Kaynak: `src/app/components/LandingFooter.tsx`. Landing header kullanan tüm tanıtım, hizmet,
eğitim ve referans sayfaları bu ortak bileşeni kullanır; sayfa içinde footer kopyalanmaz.
Koyu lacivert zemin üzerinde dört bilgi kolonundan ve ayrı bir alt bardan oluşur:

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

### 8.3 Landing hizmet listesi — `landing-service-grid`

Landing hizmetleri büyük bento blokları yerine tek kolonlu, sağ-sol dönüşümlü yatay liste
kartlarıyla sunulur. Kart yüzeyi mevcut `landing-service-card` sınır, radius ve renklerini korur.

- Masaüstünde kartlar bölüm genişliğinden daha dar tutulur; tek numaralılar sola, çift
  numaralılar sağa yaslanır.
- Çift numaralı kartlarda görsel sağa alınarak akış ritmi dönüşümlü hale gelir.
- Görsel alanı kart yüksekliğini büyütmez; metin ve eylem tek bakışta taranabilir kalır.
- Tablet görünümünde tüm kartlar bölüm genişliğini kullanır. Mobilde kompakt yatay düzen
  korunur; çok dar ekranlarda görsel metnin üstüne geçer.
- Hizmet sırası, metinleri ve bağlantıları değişmez.

### 8.4 Landing güven kanıtları — `landing-trust-list`

"Nasıl Çalışır?" bölümünden sonra gelen alan bir hizmet listesi değil, kullanıcının
"Neden eistatistik'e güvenmeliyim?" sorusunu yanıtlayan kanıt bölümüdür.

- Üst başlık `.landing-trust-heading`: "Neden eistatistik?" etiketi, güven/süreç mesajı,
  kısa açıklama ve çalışma alanı CTA'sı.
- Alt akış üç `.landing-trust-row` satırından oluşur: güvenli çalışma alanı, şeffaf süreç
  yönetimi ve doğrudan uzman iletişimi.
- Her satır numara, kısa kanıt metni ve gerçek ürün davranışını temsil eden tek mikro arayüz
  içerir. Mikro arayüz dekor değil; dosya durumu, sipariş adımları veya uzman mesajını gösterir.
- Masaüstünde yatay üç kolon, tablet ve mobilde tek kolon kullanılır. Mobilde mikro arayüz
  metinden sonra gelir ve yatay taşma oluşturmaz.

### 8.5 Landing kullanıcı yorumları — `landing-testimonials-shell`

Sosyal kanıt bölümü güven kanıtlarından sonra, SSS'den önce yer alır ve `id="yorumlar"`
taşır. Üst bar ile footer hızlı erişimde bu anchor'a doğrudan bağlantı bulunur.

- Koyu lacivert yüzey içinde solda 9:16 telefon çerçeveli YouTube oynatıcı, sağda iki katlı yorum akışı bulunur.
  Üst sıra sola, alt sıra sağa kesintisiz ilerler; hover durumunda okunabilirlik için durur.
- Telefon güncel cihaz oranına yakın uzun ve dar bir gövde kullanır. Oynatıcı bölüm en az %35 görünür
  olduğunda sessiz biçimde otomatik başlar; kullanıcı YouTube kontrollerinden sesi açabilir.
- Yorumlar yıldız, alıntı, baş harf avatarı, ad, rol ve kurum bilgisini koruyan kompakt yatay
  kartlardır. Akış kenarlarında maske kullanılarak kartların sert biçimde kesilmesi önlenir.
- Masaüstünde video ve yorum akışları yan yana, mobilde tek kolon akar. Hareket azaltma tercihi
  bulunan kullanıcılar için animasyon devre dışı kalır ve şerit manuel kaydırılabilir olur.

### 8.6 Hizmet detay hero ölçeği

`analysis-hero`, `power-hero`, `validity-hero` ve `proforma-hero` masaüstünde ortak kompakt
içerik ölçeğini kullanırken `100svh` yüksekliğinde kalır; böylece ilk açılışta sonraki bölüm
görünmez. Başlık en fazla 5.35rem, CTA 50px, ürün görseli %94 genişliktedir. Mobil hero
kuralları bu ortak masaüstü ölçeğinin dışında kalır.

İstatistiksel Analiz sayfasındaki ikinci süreç görseli (`visual-analyse`) gerçek bir regresyon
çıktısı dili kullanır: model durumu, güven bandı, gözlem noktaları ve R²/β/p özetleri tek panelde
sunulur. Grafik salt dekoratif olduğundan erişilebilirlik ağacından gizlidir.

Hero içindeki trend çizgisi `analysis-window-chart` sınırlarında kırpılır. Teslim Paketi kartları
boş metin yüzeyleri değildir: rapor sayfası, XLSX hücreleri, yayın grafiği ve video oynatıcı
önizlemeleri ilgili teslim biçiminin üstünde gösterilir.

### 8.7 Danışmanlık hizmet sayfası

Kaynak: `src/app/hizmetler/danismanlik/page.tsx`. Sayfa diğer hizmet detaylarıyla aynı
`LandingHeader`, `analysis-service-page`, `analysis-hero-actions`, `analysis-trust-strip`,
`analysis-faq-section`, `analysis-final-cta` ve `LandingFooter` sözleşmelerini kullanır.

- Hero masaüstünde ilk görünür alanı dolduran asimetrik metin ve gerçek danışmanlık fotoğrafı
  düzenidir. Fotoğraf `next/image` ile sabit oranlı, kırpılmış ve öncelikli yüklenir.
- Uzun hizmet kapsamı tek metin akışı olarak gösterilmez. Konular araştırma tasarımı, veri ve
  analiz, yayın ve sunum gruplarında taranabilir bir kapsam düzenine ayrılır.
- Süreç dört kısa karar adımıyla; uzmanlık kapsamı ise tekrar eden kartlar yerine iki kolonlu
  editoryal satırlarla anlatılır.
- SSS başlıkları diğer analiz hizmetleriyle aynı yedi standart başlığı kullanır ve ortak
  `LandingFaq` bileşeninden render edilir.
- Tüm çok kolonlu yapılar `900px` altında tek kolona iner; fotoğraf ve metin taşma oluşturmaz.

### 8.8 Landing iletişim bölümü

Kaynak: `src/app/components/LandingContact.tsx`. Landing navigasyonu ve footer'daki
`İletişim` bağlantıları ana sayfadaki `#iletisim` bölümüne gider. Ayrı iletişim sayfası yoktur.

- İletişim bölümü kurum logo şeridinden sonra ve ortak footer'dan önce yer alır. Landing
  akışında ikinci bir hero oluşturmaz.
- İletişim bilgileri üç eşit kart olarak tekrarlanmaz. Çalışma saatleri koyu ana yüzeyde;
  adres ve iletişim kanalları sağdaki iki tamamlayıcı yüzeyde gösterilir.
- E-posta eylemi ortak Gmail şablon bağlantısını, telefonlar `tel:` bağlantısını kullanır.
  Instagram ve X bağlantıları yeni sekmede açılır.
- Harita, Google'da doğrulanmış Ondokuz Mayıs Üniversitesi Teknopark adresini Google Maps
  iframe ile ekranın iki kenarına kadar tam genişlikte ve işaretli olarak gösterir. Haritanın
  üzerinde ayrı başlık veya konum etiketi bulunmaz.
  iframe sabit yüksekliğe, açıklayıcı `title` değerine ve `loading="lazy"` niteliğine sahiptir.
- Bölümde otomatik animasyon yoktur. Hover ve aktif geri bildirimleri mevcut landing
  buton geçişleriyle sınırlıdır.

### 8.9 Hizmet seçimi ve tek sayfa analiz talebi

Kaynaklar: `src/app/hizmetler/page.tsx` ve `src/app/yeni-analiz-talebi/page.tsx`. Giriş sonrası
genel `Hizmetler` / `Yeni analiz talebi` eylemleri önce `/hizmetler` kataloğunu açar. Kullanıcı
bir hizmet seçince `service` sorgu değeriyle tek sayfa forma geçer; belirli hizmet kartları
aynı sorgu değeriyle forma doğrudan bağlanabilir.

- Stepper, ileri/geri adımları ve ayrı onay ekranı bulunmaz.
- Form hero'su tek büyük `Yeni analiz talebi` başlığını kullanır; aynı metni tekrarlayan küçük
  eyebrow etiketi veya başlık altında açıklama metni gösterilmez.
- Ana düzen geniş masaüstünde mevcut `request-form-layout` kalıbını üç işlevsel bölgeye yayar:
  solda form, ortada eklenen dosyaların dikey listesi, en sağda talep özeti bulunur. Sayfa yatay
  alanın tamamına yakınını kullanır. Dar masaüstünde özet ve dosyalar sağ sütunda üst üste,
  mobilde formun altında doğal akışta gösterilir.
- `801px` ve üzerindeki ekranlarda form, üst barın altında tek viewport içine sığar ve sayfa
  dikey kaydırma üretmez. Alanlar kompaktlaşır; eklenen dosyalar panel içinde kaydırılır.
  Mobilde erişilebilirlik için doğal sayfa kaydırması korunur.
- Tek viewport sıkılığı metni küçülterek sağlanmaz: form etiketleri en az `.72rem`, alan ve
  özet değerleri `.7rem` civarında tutulur; yardımcı metinler `.58rem` altına düşmez.
- Form hizmet, çalışma başlığı, teslim türü, teslim süresi, çalışma açıklaması ve isteğe bağlı
  dosyaları tek akışta toplar. Zorunlu alanlar dolmadan gönderim etkinleşmez.
- Katalogda seçilen hizmet formda kilitli, salt okunur bir satır olarak gösterilir; form
  içinden değiştirilemez. Farklı hizmet için kullanıcı `/hizmetler` kataloğuna döner.
- `Teslim türü` ve `Teslim zamanı` alanları tarayıcının yerel select görünümünü değil, sistemin
  mevcut `cs-trigger` / `cs-panel` / `cs-option` dropdown kalıbını kullanır. Panel form düzenini
  büyütmeden üstte açılır; dışarı tıklama ve `Escape` ile kapanır.
- Power analizi talebinde teslim türü seçilemez ve `Standart` olarak kilitli gösterilir. Alanın
  altında `Sipariş Görüşmesinde detaylı bilgi aktarılacaktır.` bilgi notu yer alır; teslim zamanı
  diğer analiz talepleriyle aynı seçenek listesini kullanır.
- Online mentörlük talebinde teslim türü `Standart` olarak kilitlidir. `Teslim zamanı` alanı
  `Mentörlük saati` adını alır ve 30 dakika, 1 saat, 2 saat, 3 saat ve 12 saat seçeneklerini
  fiyat metni olmadan gösterir. Sabit fiyat yalnızca en sağdaki talep özetine anlık yansır.
  Kilitli teslim türü alanı ile mentörlük saati dropdown'u aynı genişlik ve yüksekliği kullanır.
- Graphical Abstract talebi açıldığında teslim türü `PowerPoint`, teslim zamanı ise yalnızca
  `7 iş günü` seçeneğiyle önceden doldurulur. Bu hizmette ayrıntılı teslim günü açıklaması gösterilmez.
- Proforma Fatura talebi açıldığında teslim türünde yalnızca `Proforma Fatura Gönderimi`, teslim
  süresinde yalnızca `12 saat` bulunur ve iki değer de başlangıçta seçili gelir.
- Akademik mobil uygulama talebinde iş başlığının hemen altında zorunlu platform seçimi bulunur;
  seçenekler `İOS (Iphone/Ipad)`, `Android` ve `Cross-Platform` değerleridir. Teslim türü bu
  hizmete özel olarak ihtiyaç analizi ve tasarım, mobil uygulama, akademik dokümantasyon, mağaza
  yayınlama ve tam araştırma paketi seçeneklerini; teslim zamanı ise 3 iş gününden 6 aya uzanan
  hizmete özel süre listesini kullanır. Platform seçimi talep özetinde ayrıca gösterilir.
- Dosya yükleme mevcut `request-upload`, `request-file-list` ve `RequestFileIcon` kalıplarını
  değil, sipariş kalemlerindeki kanonik `upload-zone clickable-upload` yapısını;
  sağdaki bağımsız `request-file-panel` içindeki `request-file-list` ve `RequestFileIcon` ile
  birlikte kullanır. Dosya başına üst sınır 25 MB'dir.
- Online mentörlük dışındaki hizmetlerde gerçek fiyat verisi bulunmadığı için sahte tutar
  gösterilmez. Bu hizmetlerde özet, ücretin uzman kapsam incelemesinden sonra bildirileceğini açıklar.
- Başarılı gönderim mevcut `request-success` kalıbıyla aynı sayfada gösterilir.

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
- **Grafik etkileşimi:** sütun, alan, halka ve analizör çubukları fare/klavye odağında mevcut
  etiketi ve değeri küçük bilgi kartında gösterir. Halka grafiklerde aktif dilimin kategori adı,
  adedi ve toplam içindeki yüzdesi halkanın merkezindeki toplam bilgisinin yerini geçici olarak alır;
  Halka çevresi SVG sınırından `3px` içeride tutulur; hover sırasında stroke kalınlığı değişmez ve
  böylece hiçbir kenar kırpılmaz. Aktif dilim en son boyanıp yalnızca hafif renk vurgusu alır, diğer
  dilimler sınırlı oranda geri çekilir.
  Halka grafiklerde ayrıca yüzen tooltip kullanılmaz; kategori, adet ve yüzde merkezde okunur. Odak
  ayrılınca merkez ve dilimler toplam görünümüne döner. Aylık gelir çizgisi veri noktalarını değiştirmeden
  kübik Bézier geçişleriyle yumuşatılır; sol eksende sıfırdan başlayan, okunabilir aralıklara
  yuvarlanmış Türkçe sayı formatlı `TL` değerleri gösterilir. Eksen metinleri esneyen SVG'nin
  içinde tutulmaz; sistem fontunun oranlarını koruyan mutlak konumlu HTML etiketleridir. Y ekseni
  geniş ekranda büyümeyen sabit `82px` kolondur; değerler sola hizalanır, çizim bu kolonun hemen
  ardından başlar ve kartın sağ iç kenarına kadar uzanır.
- Teslim Süresi Analizi'ndeki tek değerli radial halka statik bir özet görselidir; hover/focus sırasında
  tooltip ya da yüzen kart açmaz. Performans yüzdesi yalnızca halkanın merkezinde okunur.
- Analitik panelin `Son siparişler` bölümü bağımsız HTML tablo dili kullanmaz. Diğer rollerle aynı
  `.orders-table`, `.orders-table-head`, `.orders-row`, `.order-identity`, `.order-state` ve
  `.context-action` kalıbını yeniden kullanır; yalnızca yöneticiye gerekli müşteri, hizmet ve tutar
  kolonları `.analytics-recent-orders` grid modifier'ıyla eklenir.
- Sütun ve alan grafiklerinin tooltip'i kartın içinde bütünüyle görünür kalır: ilk iki veri noktasında
  sağa, son iki veri noktasında sola açılır; orta noktalarda veri üzerinde merkezlenir. Grafik kartının
  `overflow` sınırında yarım görünmesine izin verilmez.
- Aylık gelir alan grafiğinde aktif dönemi işaretlemek için eğri üzerinde nokta kullanılmaz; hover/focus
  edilen ay, yalnızca ilgili veri noktasından grafiğin sıfır tabanına kadar uzanan ince ve kesik dikey
  kılavuz çizgisiyle belirtilir. Kılavuz ile tooltip, sert belirme yerine 240–300ms `cubic-bezier`
  giriş kullanır; halka vurguları da aynı yumuşak hareket eğrisini izler. Ay etiketleri metin
  genişliğine göre `space-between` ile dağıtılmaz; her biri ilgili veri noktasının yüzde konumuna
  mutlak yerleştirilir, böylece kılavuz çizgisi ve etiket merkezi tam hizalanır.

### 7.6.1 Mevcut Siparişler / Analizler — `/admin/siparisler`

Kaynak: [src/app/admin/siparisler/page.tsx](src/app/admin/siparisler/page.tsx).
**Müşterinin Siparişlerim sayfasıyla (`/siparislerim`) aynı görsel düzeni paylaşır** — aynı CSS sınıfları, aynı
kart-grup yapısı. Tek fark: her satırda müşteri, analizör bilgisi de gösterilir ve grid 5 sütundur.

**Düzen (müşteri §4'teki `orders-page` kalıbı yeniden kullanılır):**

`orders-page` kullanan müşteri, analizör, asistan, editör ve yönetici sipariş listelerinde üst bar
ile ana başlık arasında ikinci bir geniş boşluk bırakılmaz. Ortak sayfa üst padding'i `.45rem`,
`.orders-hero` minimum yüksekliği `68px`'dir; başlık ve aksiyon ilk görünür alana yukarıdan yerleşir.

`Tümü` filtresinde durum bazlı `order-group` başlıkları gösterilmez; bütün kayıtlar tek sipariş tablosunda
birleşir ve satırdaki `order-state` alanı durumu taşır. Durum sekmelerinden biri seçildiğinde yalnızca o
durumdaki kayıtlar gösterilir. Tüm sipariş listeleri varsayılan olarak son güncellenme zamanı azalan
sırada (en güncel üstte) çizilir; müşteri ekranındaki eski/yeni sıralaması da aynı güncellenme alanını kullanır.
Yönetici sipariş listesinin ortak `.orders-toolbar` alanında, aramanın yanında sistemin standart
`.cs-wrap` → `.cs-trigger` → `.cs-panel` → `.cs-option` açılır seçim kalıbını kullanan bir `Analizör`
filtresi bulunur. `.orders-analyst-filter` yalnızca toolbar genişliğini ve 38px kontrol yüksekliğini
ayarlar. Seçim listeyi ve durum sekmelerindeki sayaçları aynı veri kapsamına göre daraltır; editör ve
asistan rotalarında bu yönetici filtresi gösterilmez.

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
