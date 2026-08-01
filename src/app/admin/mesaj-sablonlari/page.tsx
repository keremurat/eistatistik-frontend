"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminShell } from "../AdminShell";

type IconName = "plus";
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type Template = { id: number; title: string; body: string };

const allTemplates: Template[] = [
  { id: 49, title: "Ek Analize Yönlendirme", body: "Sayın {musteri_adi},\n\nSiparişinizde ek analiz gereksinimi tespit edilmiştir. Ek analiz ücreti {ek_ucret} TL olarak belirlenmiştir.\n\nOnayınız halinde analize devam edilecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 48, title: "Ücret İptal Üzüntü", body: "Sayın {musteri_adi},\n\nSiparişinizin iptal edildiğini üzülerek bildiriyoruz. Ödediğiniz {ucret} TL tutarın iadesi işleme alınmıştır.\n\nİleride tekrar hizmetlerimizden faydalanmanızı dileriz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 47, title: "Teslimat Sonrası Görüşmeye Gelmeme", body: "Sayın {musteri_adi},\n\nPlanlanmış görüşmemize katılım sağlayamadığınızı gördük. Yeni bir görüşme zamanı belirlemek ister misiniz?\n\nLütfen takvimimizden uygun bir saat seçiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 46, title: "email", body: "Sayın {musteri_adi},\n\nSiparişinizle ilgili e-posta bilgilendirmesi gönderilmiştir. Lütfen spam klasörünüzü de kontrol ediniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 45, title: "Proforma Yönlendirme", body: "Sayın {musteri_adi},\n\nProforma faturanız hazırlanmıştır. Fatura tutarı {tutar} TL olup ödeme bilgileri ekte yer almaktadır.\n\nÖdemenizi gerçekleştirdikten sonra siparişiniz aktif hale gelecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 44, title: "Mentörlük Yönlendirme", body: "Sayın {musteri_adi},\n\nMentörlük seansınız için hazırlıkları tamamlamanız gerekmektedir.\n\nGörüşme tarihi: {tarih}\nGörüşme linki: {link}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 43, title: "ONLİNE GÖRÜŞME SONRASI MESAJ ŞABLONU", body: "Sayın {musteri_adi},\n\nOnline görüşmemize katıldığınız için teşekkür ederiz. Görüşme özeti ve aksiyon maddeleri aşağıda yer almaktadır:\n\n{ozet}\n\nHerhangi bir sorunuz olursa iletişime geçmekten çekinmeyiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 42, title: "SERT", body: "Sayın {musteri_adi},\n\nBirden fazla hatırlatmaya rağmen gerekli belgeler tarafınızca iletilmemiştir. Siparişinizin devam edebilmesi için {belge} belgelerini en geç {tarih} tarihine kadar sisteme yüklemenizi önemle rica ederiz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 41, title: "BİLGİLENDİRME", body: "Sayın {musteri_adi},\n\nSiparişinizle ilgili güncel bilgilendirme aşağıda yer almaktadır:\n\n{bilgi}\n\nHerhangi bir sorunuz olursa destek ekibimizle iletişime geçebilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 40, title: "YENİ TALEP BİLGİLENDİRME", body: "Sayın {musteri_adi},\n\nYeni analiz talebiniz alınmıştır. Sipariş kodunuz: {siparis_kodu}\n\nEkibimiz en kısa sürede sizinle iletişime geçecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 39, title: "Ödeme Hatırlatma", body: "Sayın {musteri_adi},\n\nSiparişinize ait ödeme henüz gerçekleştirilmemiştir. Hesabınıza giriş yaparak ödemenizi tamamlayabilirsiniz.\n\nÖdenecek tutar: {tutar} TL\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 38, title: "Teslim Bildirimi", body: "Sayın {musteri_adi},\n\nAnaliz çalışmanız tamamlanmış ve sisteme yüklenmiştir. Hesabınıza giriş yaparak teslim edilen dosyaları indirebilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 37, title: "Revizyon Talebi", body: "Sayın {musteri_adi},\n\nRevizyon talebiniz alınmıştır. Belirttiğiniz notlar incelenecek ve en kısa sürede güncellenen dosyalar tarafınıza iletilecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 36, title: "Analiz Başladı", body: "Sayın {musteri_adi},\n\nAnaliz çalışmanız başlamıştır. Tahmini teslim tarihi: {tarih}\n\nÇalışma sürecinde ek bilgi gerekirse sizinle iletişime geçeceğiz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 35, title: "Dosya Eksik", body: "Sayın {musteri_adi},\n\nSiparişinizin tamamlanabilmesi için eksik belgeler bulunmaktadır:\n\n{eksik_belgeler}\n\nLütfen belirtilen dosyaları sisteme yükleyiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 34, title: "Ek Ücret Bildirimi", body: "Sayın {musteri_adi},\n\nSiparişinizde kapsam dışı analiz talep edilmiştir. Bu analiz için {ek_ucret} TL ek ücret uygulanacaktır.\n\nOnayınız halinde işleme devam edilecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 33, title: "Randevu Hatırlatma", body: "Sayın {musteri_adi},\n\nYarın {saat} saatinde planlanmış çevrimiçi görüşmenizi hatırlatmak isteriz.\n\nGörüşme linki: {link}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 32, title: "İptal Onayı", body: "Sayın {musteri_adi},\n\nSiparişiniz talebiniz doğrultusunda iptal edilmiştir.\n\nİptal edilen sipariş: {siparis_kodu}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 31, title: "Memnuniyet Anketi", body: "Sayın {musteri_adi},\n\nHizmet kalitenizi artırmak adına görüşleriniz bizim için değerlidir. Lütfen kısa anketi doldurunuz:\n\n{anket_linki}\n\nTeşekkürler,\nEİstatistik Ekibi" },
  { id: 30, title: "Teşekkür Mesajı", body: "Sayın {musteri_adi},\n\nEİstatistik hizmetlerini tercih ettiğiniz için teşekkür ederiz. Analiziniz başarıyla tamamlanmıştır.\n\nYeni siparişlerinizde sizi bekliyoruz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 29, title: "Onay Bekleniyor", body: "Sayın {musteri_adi},\n\nSiparişiniz onay aşamasındadır. Ekibimiz tarafından incelendikten sonra analiz sürecine geçilecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 28, title: "Veri Yükleme Hatırlatma", body: "Sayın {musteri_adi},\n\nSiparişinizin işleme alınabilmesi için veri dosyalarınızı sisteme yüklemeniz gerekmektedir.\n\nLütfen hesabınıza giriş yaparak dosya yükleme işlemini tamamlayınız.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 27, title: "Görüşme Özeti", body: "Sayın {musteri_adi},\n\nBugünkü görüşmemizin özeti:\n\n{ozet}\n\nBir sonraki adımlar:\n{adimlar}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 26, title: "Power Analizi Tamamlandı", body: "Sayın {musteri_adi},\n\nPower analizi çalışmanız tamamlanmıştır. Raporunuz sisteme yüklenmiştir.\n\nÖrnek büyüklüğü: {ornek_buyuklugu}\nEtki büyüklüğü: {etki_buyuklugu}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 25, title: "SPSS Çıktısı Hazır", body: "Sayın {musteri_adi},\n\nSPSS analiz çıktılarınız hazırlanmıştır. Sisteme giriş yaparak dosyaları indirebilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 24, title: "Grafik Revizyon", body: "Sayın {musteri_adi},\n\nGrafik revizyonu talebiniz alınmıştır. Belirttiğiniz düzeltmeler uygulandıktan sonra güncel dosyalar tarafınıza iletilecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 23, title: "Yorum Ekleme", body: "Sayın {musteri_adi},\n\nSiparişinize yorum eklenmiştir. Yorumu görmek için hesabınıza giriş yaparak ilgili siparişi açabilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 22, title: "Makale Düzenleme", body: "Sayın {musteri_adi},\n\nMakale düzenleme süreciniz başlamıştır. İstatistik bölümünde gerekli düzenlemeler yapıldıktan sonra revize makale tarafınıza iletilecektir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 21, title: "Danışma Özeti", body: "Sayın {musteri_adi},\n\nDanışma seansı özetiniz:\n\n{ozet}\n\nBir sonraki seansınız için takvim üzerinden randevu alabilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 20, title: "Proje Güncelleme", body: "Sayın {musteri_adi},\n\nProjenizde yapılan güncellemeler hakkında bilgilendirmek istedik:\n\n{guncelleme}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 19, title: "Tez Analizi Hazır", body: "Sayın {musteri_adi},\n\nTez analiziniz tamamlanmış ve sisteme yüklenmiştir. Dosyaları hesabınızdan indirebilirsiniz.\n\nÇalışmanızda başarılar dileriz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 18, title: "Anket Tasarım", body: "Sayın {musteri_adi},\n\nAnket tasarım çalışmanız tamamlanmıştır. Taslak anket sisteme yüklenmiştir, lütfen inceleyiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 17, title: "Veri Temizleme", body: "Sayın {musteri_adi},\n\nVeri temizleme işleminiz tamamlanmıştır.\n\nTemizleme özetinde {silinen_satir} satır kaldırılmış, {duzeltilen_deger} değer düzeltilmiştir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 16, title: "Veri Girişi Hatırlatma", body: "Sayın {musteri_adi},\n\nSiparişinizin devam edebilmesi için veri girişini tamamlamanız gerekmektedir.\n\nLütfen hesabınıza giriş yaparak eksik bilgileri doldurunuz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 15, title: "Rapor Hazır", body: "Sayın {musteri_adi},\n\nİstatistik raporunuz hazırlanmış ve sisteme yüklenmiştir. Hesabınıza giriş yaparak raporu indirebilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 14, title: "Fatura Gönderimi", body: "Sayın {musteri_adi},\n\nSiparişinize ait resmi fatura sisteme yüklenmiştir.\n\nFatura no: {fatura_no}\nFatura tutarı: {tutar} TL\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 13, title: "Ödeme Alındı", body: "Sayın {musteri_adi},\n\nÖdemeniz başarıyla alınmıştır. Siparişiniz aktif hale getirilmiştir.\n\nÖdeme tutarı: {tutar} TL\nSipariş kodu: {siparis_kodu}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 12, title: "Sipariş Onayı", body: "Sayın {musteri_adi},\n\nSiparişiniz onaylanmıştır. Analiz süreci başlamıştır.\n\nSipariş kodu: {siparis_kodu}\nTahmini teslim tarihi: {tarih}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 11, title: "Hoş Geldiniz", body: "Sayın {musteri_adi},\n\nEİstatistik ailesine hoş geldiniz! Hesabınız başarıyla oluşturulmuştur.\n\nHizmetlerimizden faydalanmak için giriş yapabilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 10, title: "Sistem Güncellemesi", body: "Sayın Kullanıcılarımız,\n\nSistemimiz {tarih} tarihinde {saat}–{bitis_saati} saatleri arasında bakım nedeniyle erişime kapalı olacaktır.\n\nAnlayışınız için teşekkür ederiz.\n\nEİstatistik Ekibi" },
  { id: 9, title: "Bakım Bildirimi", body: "Sayın {musteri_adi},\n\nPlanlanmış bakım çalışması tamamlanmıştır. Sistemimiz normal çalışmasına devam etmektedir.\n\nTeşekkür ederiz.\n\nEİstatistik Ekibi" },
  { id: 8, title: "Özel İndirim", body: "Sayın {musteri_adi},\n\nSize özel %{indirim_orani} indirim kodunuz: {indirim_kodu}\n\nKod geçerlilik tarihi: {tarih}\n\nBu fırsatı kaçırmayın!\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 7, title: "Eğitim Daveti", body: "Sayın {musteri_adi},\n\nYeni eğitim programımıza katılmanızı dileriz.\n\nEğitim adı: {egitim_adi}\nTarihi: {tarih} — Süresi: {sure}\n\nDetay ve kayıt için hesabınıza giriş yapınız.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 6, title: "Webinar Hatırlatma", body: "Sayın {musteri_adi},\n\nYarın saat {saat}'de gerçekleşecek webinarımızı hatırlatmak isteriz.\n\nKonu: {konu}\nLink: {link}\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 5, title: "Başarı Tebriği", body: "Sayın {musteri_adi},\n\nMakale/tezinizin kabul edildiğini öğrendik. Tebrikler!\n\nBaşarılarınızın devamını diler, ilerideki çalışmalarınızda da yanınızda olmaktan mutluluk duyarız.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 4, title: "Geri Bildirim Talebi", body: "Sayın {musteri_adi},\n\nHizmet kalitenizi artırmak adına görüşleriniz bizim için değerlidir. Lütfen aşağıdaki formu doldurunuz:\n\n{form_linki}\n\nTeşekkürler,\nEİstatistik Ekibi" },
  { id: 3, title: "Referans Talebi", body: "Sayın {musteri_adi},\n\nHizmetlerimizden memnun kaldıysanız bizi çevrenize önermekten çekinmeyiniz.\n\nReferans linki: {referans_linki}\n\nDesteğiniz için teşekkür ederiz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 2, title: "Hesap Doğrulama", body: "Sayın {musteri_adi},\n\nHesabınızı doğrulamak için aşağıdaki linke tıklayınız:\n\n{dogrulama_linki}\n\nLink 24 saat geçerlidir.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
  { id: 1, title: "Kayıt Onayı", body: "Sayın {musteri_adi},\n\nEİstatistik'e kaydınız başarıyla tamamlanmıştır.\n\nE-posta: {email}\n\nHizmetlerimizden yararlanmak için giriş yapabilirsiniz.\n\nSaygılarımızla,\nEİstatistik Ekibi" },
];

const PER_PAGE = 10;

export default function MesajSablonlariPage() {
  const [page, setPage]         = useState(1);
  const [deletedIds, setDeletedIds] = useState(new Set<number>());
  const [confirmId, setConfirmId]   = useState<number | null>(null);
  const [overrides, setOverrides]   = useState(new Map<number, Template>());
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody,  setEditBody]  = useState("");
  const [editSaved, setEditSaved] = useState(false);

  const displayTemplates = allTemplates
    .map((t) => overrides.get(t.id) ?? t)
    .filter((t) => !deletedIds.has(t.id));

  const totalPages = Math.max(1, Math.ceil(displayTemplates.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = displayTemplates.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function openEdit(t: Template) {
    setEditingTemplate(t);
    setEditTitle(t.title);
    setEditBody(t.body);
    setEditSaved(false);
  }

  function saveEdit() {
    if (!editingTemplate || !editTitle.trim() || !editBody.trim()) return;
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(editingTemplate.id, { ...editingTemplate, title: editTitle.trim(), body: editBody });
      return next;
    });
    setEditSaved(true);
    setTimeout(() => { setEditSaved(false); setEditingTemplate(null); }, 1500);
  }

  function doDelete(id: number) {
    setDeletedIds((prev) => new Set(prev).add(id));
    setConfirmId(null);
    if (safePage > Math.ceil((displayTemplates.length - 1) / PER_PAGE)) {
      setPage(Math.max(1, safePage - 1));
    }
  }

  return (
    <AdminShell>
      <div className="st-page">
        <header className="orders-hero">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1>Mesaj Şablonları</h1>
            <p>Sipariş mesajlaşma alanında kullanılan hazır şablonları yönetin.</p>
          </div>
        </header>

        <section className="detail-panel st-list-panel">
          <div className="ms-panel-toolbar">
            <Link className="orders-create" href="/admin/mesaj-sablonlari/ekle">
              <Icon name="plus" size={16} />Ekle
            </Link>
          </div>

          <div className="ur-table-wrap">
            <table className="ur-table ms-table">
              <thead>
                <tr>
                  <th className="ms-id-th">ID</th>
                  <th>Mesaj Başlığı</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => (
                  <tr key={t.id}>
                    <td className="ms-id-cell">{t.id}</td>
                    <td className="ms-title-cell">{t.title}</td>
                    <td className="ms-actions-cell">
                      {confirmId === t.id ? (
                        <div className="ms-confirm">
                          <span>Emin misiniz?</span>
                          <button className="ms-btn confirm" onClick={() => doDelete(t.id)}>Evet</button>
                          <button className="ms-btn cancel"  onClick={() => setConfirmId(null)}>Hayır</button>
                        </div>
                      ) : (
                        <div className="ms-actions">
                          <button className="ms-btn edit"   onClick={() => openEdit(t)}>Düzenle</button>
                          <button className="ms-btn delete" onClick={() => setConfirmId(t.id)}>Sil</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".7rem" }}>Şablon bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="ms-pagination" role="navigation" aria-label="Sayfalama">
              <button disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹ Önceki</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === safePage ? "active" : ""} aria-current={p === safePage ? "page" : undefined} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Sonraki ›</button>
            </div>
          )}
        </section>

        {editingTemplate && (
          <div
            className="legal-modal-backdrop"
            role="presentation"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingTemplate(null); }}
          >
            <section
              className="legal-modal ms-edit-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ms-edit-dlg-title"
            >
              <header>
                <div>
                  <p className="eyebrow">MESAJ ŞABLONU</p>
                  <h2 id="ms-edit-dlg-title">Şablonu Düzenle</h2>
                </div>
                <button aria-label="Pencereyi kapat" onClick={() => setEditingTemplate(null)}>×</button>
              </header>
              <div className="ms-edit-body">
                <div className="form-field">
                  <label htmlFor="ms-edit-baslik">Mesaj Başlığı <em>*</em></label>
                  <input
                    id="ms-edit-baslik"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="ms-edit-icerik">Mesaj İçeriği <em>*</em></label>
                  <textarea
                    id="ms-edit-icerik"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={9}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>
              <footer>
                <div />
                <div>
                  <button className="legal-cancel" onClick={() => setEditingTemplate(null)}>Vazgeç</button>
                  <button
                    className={`legal-accept${editSaved ? " saved" : ""}`}
                    disabled={!editTitle.trim() || !editBody.trim()}
                    onClick={saveEdit}
                  >
                    {editSaved ? "Kaydedildi ✓" : "Kaydet"}
                  </button>
                </div>
              </footer>
            </section>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
