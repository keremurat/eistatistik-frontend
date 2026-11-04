"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { CategoryIcon, FavoriteCategory, readFavoriteCategories } from "./categoryData";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

function Caret() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

export default function FavoriteCategoriesPage() {
  const [categories, setCategories] = useState<FavoriteCategory[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCategories(readFavoriteCategories()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    if (!needle) return categories;
    return categories.filter((category) => category.name.toLocaleLowerCase("tr").includes(needle));
  }, [categories, query]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Favori Kategorileri <span>{categories.length}</span></h1>
            <p>Favorileri renk ve ikonla gruplayın. Bir satıra girince kategori ayrıntısı açılır.</p>
          </div>
          <Link className="orders-create" href="/admin/favori-kategorileri/ekle"><PlusIcon />Yeni kategori</Link>
        </header>

        <section className="fav-card" aria-label="Favori kategorileri listesi">
          {categories.length > 0 && (
            <label className="fav-search">
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kategori ara" aria-label="Kategori ara" />
            </label>
          )}

          {categories.length === 0 ? (
            <div className="fav-empty">
              <span className="fav-mark"><CategoryIcon name="tag" size={22} /></span>
              <strong>Henüz kategori yok</strong>
              <p>Favorileri gruplamak için ilk kategoriyi oluşturun.</p>
              <Link className="orders-create" href="/admin/favori-kategorileri/ekle"><PlusIcon />Yeni kategori</Link>
            </div>
          ) : visible.length === 0 ? (
            <div className="fav-empty">
              <strong>Eşleşen kategori yok</strong>
              <p>Aramayı değiştirin ya da yeni bir kategori ekleyin.</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((category) => (
                <li key={category.id}>
                  <Link href={`/admin/favori-kategorileri/${category.id}`}>
                    <span className="fav-mark" style={{ "--fav": category.color } as React.CSSProperties}><CategoryIcon name={category.icon} size={20} /></span>
                    <span className="fav-copy"><strong>{category.name}</strong><small>Sıra {category.order}</small></span>
                    <span className="fav-count">{category.favoriteCount} favori</span>
                    <Caret />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
