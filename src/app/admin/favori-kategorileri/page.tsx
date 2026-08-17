"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "../AdminShell";
import { CategoryIcon, FavoriteCategory, readFavoriteCategories } from "./categoryData";

type IconName = "plus" | "tag";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    tag: <><path d="M20 13 13 20 4 11V4h7l9 9Z" /><circle cx="8.5" cy="8.5" r="1" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function FavoriteCategoriesPage() {
  const [categories, setCategories] = useState<FavoriteCategory[]>([]);

  useEffect(() => {
    setCategories(readFavoriteCategories());
  }, []);

  return (
    <AdminShell>
      <div className="st-page favorite-categories-page">
        <header className="orders-hero">
          <div><h1>Favori Kategorileri</h1></div>
          <Link className="orders-create" href="/admin/favori-kategorileri/ekle">
            <Icon name="plus" size={17} />Yeni kategori
          </Link>
        </header>

        <section className="detail-panel favorite-category-list-panel" aria-label="Favori kategorileri listesi">
          <div className="ur-table-wrap">
            <table className="ur-table favorite-category-table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Kategori</th>
                  <th>İkon</th>
                  <th>Favori sayısı</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="favorite-category-empty-cell">
                      <div className="favorite-category-empty">
                        <span><Icon name="tag" size={22} /></span>
                        <strong>Henüz kategori eklenmedi</strong>
                        <p>Favorilerinizi gruplamak için ilk kategorinizi oluşturun.</p>
                        <Link href="/admin/favori-kategorileri/ekle">Yeni kategori ekle</Link>
                      </div>
                    </td>
                  </tr>
                ) : categories.map((category) => (
                  <tr key={category.id}>
                    <td className="favorite-category-order">{category.order}</td>
                    <td>
                      <span className="favorite-category-name">
                        <i style={{ backgroundColor: category.color }} />{category.name}
                      </span>
                    </td>
                    <td>
                      <span className="favorite-category-row-icon" style={{ color: category.color }}>
                        <CategoryIcon name={category.icon} size={17} />
                      </span>
                    </td>
                    <td>{category.favoriteCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
