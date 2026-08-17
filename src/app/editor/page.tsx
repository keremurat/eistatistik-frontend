import Link from "next/link";
import { AdminShell } from "../admin/AdminShell";

export default function EditorPage() {
  return (
    <AdminShell>
      <div className="editor-home-fold">
      <section className="daily-brief admin-brief">
        <div className="brief-copy">
          <p className="eyebrow light">EDİTÖR ÇALIŞMA ALANI</p>
          <h1>Günaydın.</h1>
          <p>Sipariş, eğitim ve içerik operasyonlarındaki güncel işleri buradan takip edebilirsiniz.</p>
        </div>
        <div className="brief-stats" aria-label="Editör çalışma özeti">
          <div><strong>44</strong><span>devam eden sipariş</span></div>
          <div><strong>13</strong><span>yapılacak görev</span></div>
          <div><strong>49</strong><span>ek analiz talebi</span></div>
        </div>
        <Link className="primary-button" href="/editor/siparisler">Siparişleri görüntüle</Link>
      </section>

      <section className="assistant-workspace">
        <div className="assistant-priority-panel">
          <header className="assistant-section-head">
            <div><p className="eyebrow">BUGÜNKÜ İŞ AKIŞI</p><h2>Öncelikleriniz</h2></div>
            <span>3 işlem bekliyor</span>
          </header>
          <div className="assistant-priority-list">
            <article><time>09:30</time><i className="danger" aria-hidden="true"/><div><small className="danger">TESLİM KONTROLÜ</small><h3>Teslim süresi geçen siparişleri inceleyin</h3><p>7 sipariş işlem bekliyor</p></div><Link href="/editor/siparisler">Siparişleri aç</Link></article>
            <article><time>11:00</time><i className="amber" aria-hidden="true"/><div><small className="amber">İÇERİK YÖNETİMİ</small><h3>Eğitim içeriklerini kontrol edin</h3><p>Güncellenmesi beklenen içerikler bulunuyor</p></div><Link href="/editor/egitim-talepleri/egitim-listesi">İçerikleri aç</Link></article>
            <article><time>14:30</time><i className="blue" aria-hidden="true"/><div><small className="blue">EK ANALİZ</small><h3>Yeni ek analiz taleplerini sınıflandırın</h3><p>49 açık talep bulunuyor</p></div><Link href="/editor/siparisler">Talepleri aç</Link></article>
          </div>
        </div>

        <aside className="assistant-side-panel">
          <header className="assistant-section-head">
            <div><p className="eyebrow">OPERASYON ÖZETİ</p><h2>İş planları</h2></div>
            <span>16 toplam</span>
          </header>
          <div className="assistant-todo-summary">
            <div><span>Yapılacak</span><strong>13</strong><small>Başlanmayı bekleyen görevler</small></div>
            <div><span>Yapılıyor</span><strong>1</strong><small>Aktif olarak işleniyor</small></div>
            <div><span>Tamamlandı</span><strong>2</strong><small>Tamamlanan görevler</small></div>
          </div>
          <div className="assistant-status-note"><div><strong>Görev akışı güncel</strong><p>Bugün için 14 açık görev bulunuyor.</p></div></div>
          <Link className="assistant-all-tasks" href="/editor/gorev-isleri/gorev-listesi-kart">Tüm görevleri görüntüle</Link>
        </aside>
      </section>
      </div>

      <section className="assistant-queue-strip" aria-label="Hızlı durum özeti">
        <div><p><strong>7 geciken teslim</strong><small>Kontrol ve yönlendirme gerekiyor</small></p></div>
        <div><p><strong>29 yaklaşan teslim</strong><small>Önümüzdeki iş günleri</small></p></div>
        <div><p><strong>49 ek analiz talebi</strong><small>Sınıflandırma bekliyor</small></p></div>
      </section>
    </AdminShell>
  );
}
