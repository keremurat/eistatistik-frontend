"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CategoryIcon,
  CategoryIconName,
  readFavoriteCategories,
  writeFavoriteCategories,
} from "../categoryData";

type IconName = "back" | "save";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AddFavoriteCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [order, setOrder] = useState("1");
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0].value);
  const [categoryIcon, setCategoryIcon] = useState<CategoryIconName>("tag");
  const [error, setError] = useState("");

  useEffect(() => {
    setOrder(String(readFavoriteCategories().length + 1));
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanOrder = Number.parseInt(order, 10);
    if (!cleanName) {
      setError("Kategori adı zorunludur.");
      return;
    }
    if (!Number.isFinite(cleanOrder) || cleanOrder < 1) {
      setError("Sıra değeri 1 veya daha büyük olmalıdır.");
      return;
    }
    const current = readFavoriteCategories();
    writeFavoriteCategories([...current, {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      name: cleanName,
      order: cleanOrder,
      color,
      icon: categoryIcon,
      favoriteCount: 0,
    }]);
    router.push("/admin/favori-kategorileri");
  }

  return (
    <AdminShell>
      <div className="st-page favorite-category-create-page">
        <header className="favorite-category-create-header">
          <Link className="back-link" href="/admin/favori-kategorileri">
            <Icon name="back" size={16} />Favori kategorilerine dön
          </Link>
          <h1>Yeni Favori Kategorisi</h1>
        </header>

        <form className="detail-panel favorite-category-form" onSubmit={handleSubmit}>
          <div className="detail-panel-heading">
            <div>
              <p className="eyebrow">KATEGORİ BİLGİLERİ</p>
              <h2>Kategoriyi tanımlayın</h2>
            </div>
          </div>

          <div className="settings-panel-body">
            <div className="favorite-category-preview" aria-live="polite">
              <span className="favorite-category-preview-label">Önizleme</span>
              <span className="favorite-category-preview-chip" style={{ color, borderColor: `${color}55`, backgroundColor: `${color}12` }}>
                <CategoryIcon name={categoryIcon} size={16} />{name.trim() || "Kategori adı"}
              </span>
            </div>

            <div className="form-grid favorite-category-primary-fields">
              <div className="form-field">
                <label htmlFor="category-name">Kategori adı <em>*</em></label>
                <input id="category-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="Örn. Acil, Öncelikli, VIP" autoFocus />
              </div>
              <div className="form-field">
                <label htmlFor="category-order">Sıra <em>*</em></label>
                <input id="category-order" value={order} onChange={(event) => { setOrder(event.target.value); setError(""); }} type="number" min="1" inputMode="numeric" />
              </div>
            </div>

            <fieldset className="favorite-category-choice">
              <legend>Renk <em>*</em></legend>
              <div className="favorite-category-colors">
                {CATEGORY_COLORS.map((option) => (
                  <button key={option.value} type="button" className={color === option.value ? "active" : ""} style={{ "--category-color": option.value } as React.CSSProperties} aria-label={option.label} aria-pressed={color === option.value} onClick={() => setColor(option.value)}>
                    <span />
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="favorite-category-choice">
              <legend>İkon <em>*</em></legend>
              <div className="favorite-category-icons">
                {CATEGORY_ICONS.map((option) => (
                  <button key={option.value} type="button" className={categoryIcon === option.value ? "active" : ""} title={option.label} aria-label={option.label} aria-pressed={categoryIcon === option.value} onClick={() => setCategoryIcon(option.value)}>
                    <CategoryIcon name={option.value} size={18} />
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="settings-actions">
            {error && <p className="settings-note error" role="alert">{error}</p>}
            <Link className="favorite-category-cancel" href="/admin/favori-kategorileri"><Icon name="back" size={15} />Geri</Link>
            <button className="settings-save" type="submit"><Icon name="save" size={16} />Kaydet</button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
