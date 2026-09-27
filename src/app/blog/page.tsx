import type { Metadata } from "next";
import Image from "next/image";
import { LandingFooter } from "../components/LandingFooter";
import { LandingHeader } from "../components/LandingHeader";

export const metadata: Metadata = {
  title: "Blog | eistatistik",
  description: "İstatistiksel analiz, araştırma tasarımı ve akademik çalışma süreçleri için uygulamalı içerikler.",
};

const articles = [
  {
    category: "Araştırma tasarımı",
    title: "Analize başlamadan önce veri setinizi nasıl hazırlamalısınız?",
    summary: "Eksik değerlerden değişken adlarına kadar analiz öncesi kontrol etmeniz gereken temel adımlar.",
    image: "/service-illustrations/statistical-analysis-v2.png",
    readTime: "6 dk okuma",
  },
  {
    category: "Power analizi",
    title: "Örneklem büyüklüğü belirlerken en sık yapılan hatalar",
    summary: "Etki büyüklüğü, güç ve anlamlılık düzeyi arasındaki ilişkiyi araştırmanız için doğru kurun.",
    image: "/service-illustrations/power-analysis-v2.png",
    readTime: "5 dk okuma",
  },
  {
    category: "Raporlama",
    title: "İstatistiksel sonuçları akademik metinde açık biçimde sunmak",
    summary: "Tablo, grafik ve yorumları tekrar etmeden bulgular bölümünüzü daha okunabilir hale getirin.",
    image: "/service-illustrations/graphical-abstract-v2.png",
    readTime: "7 dk okuma",
  },
];

export default function BlogPage() {
  return (
    <main className="landing-page blog-page">
      <LandingHeader />

      <section className="blog-hero">
        <div className="blog-hero-copy">
          <p className="landing-kicker">eistatistik BLOG</p>
          <h1>Araştırmanızı daha sağlam temellere oturtun.</h1>
          <p>Analiz seçimi, veri hazırlığı ve akademik raporlama için uzmanlarımızın hazırladığı anlaşılır kaynaklar.</p>
        </div>
        <div className="blog-hero-media">
          <Image src="/blog-research-desk.png" alt="İstatistiksel araştırma notları ve veri görselleştirmeleri bulunan çalışma masası" fill priority sizes="(max-width: 900px) 100vw, 52vw" />
        </div>
      </section>

      <section className="blog-featured" aria-labelledby="featured-article-title">
        <div className="blog-featured-index"><span>ÖNE ÇIKAN</span><small>8 dk okuma</small></div>
        <article>
          <p>İstatistiksel analiz</p>
          <h2 id="featured-article-title">Doğru analiz yöntemini seçmek için nereden başlamalısınız?</h2>
          <p>Araştırma sorusu, veri türü ve örneklem yapısı arasındaki ilişkiyi kurarak uygun yönteme sistemli biçimde yaklaşın.</p>
        </article>
      </section>

      <section className="blog-latest" aria-labelledby="latest-articles-title">
        <header>
          <p className="landing-kicker">GÜNCEL İÇERİKLER</p>
          <h2 id="latest-articles-title">Araştırma sürecinde işinize yarayacak notlar.</h2>
        </header>
        <div className="blog-article-grid">
          {articles.map((article) => (
            <article className="blog-article" key={article.title}>
              <div className="blog-article-media">
                <Image src={article.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
              <div className="blog-article-copy">
                <div><span>{article.category}</span><small>{article.readTime}</small></div>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
