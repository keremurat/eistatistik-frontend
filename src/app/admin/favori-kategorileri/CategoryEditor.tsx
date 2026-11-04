"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CategoryIcon,
  CategoryIconName,
  FavoriteCategory,
} from "./categoryData";

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

export function CategoryEditor({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial?: Partial<FavoriteCategory>;
  submitLabel: string;
  onSubmit: (value: Pick<FavoriteCategory, "name" | "order" | "color" | "icon">) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [order, setOrder] = useState(String(initial?.order ?? 1));
  const [color, setColor] = useState(initial?.color ?? CATEGORY_COLORS[0].value);
  const [icon, setIcon] = useState<CategoryIconName>(initial?.icon ?? "tag");
  const [error, setError] = useState("");
  const preview = name.trim() || "Kategori adı";

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
    onSubmit({ name: cleanName, order: cleanOrder, color, icon });
  }

  return (
    <div className="fav-page">
      <Link className="fav-back" href="/admin/favori-kategorileri"><ArrowLeft />Favori kategorilerine dön</Link>
      <form className="fav-card fav-form" onSubmit={handleSubmit}>
        <header className="fav-form-hero">
          <span className="fav-mark" style={{ "--fav": color } as React.CSSProperties}><CategoryIcon name={icon} size={22} /></span>
          <div>
            <h1>{preview}</h1>
            <p>{initial?.favoriteCount ? `${initial.favoriteCount} favori bu kategoride.` : "Ad, sıra, renk ve ikon bu kartta birlikte görünür."}</p>
          </div>
        </header>

        <div className="fav-fields">
          <label className="fav-field">
            <span>Kategori adı</span>
            <input value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="Örn. Acil, Öncelikli, VIP" autoFocus />
          </label>
          <label className="fav-field">
            <span>Sıra</span>
            <input value={order} onChange={(event) => { setOrder(event.target.value); setError(""); }} type="number" min="1" inputMode="numeric" />
          </label>
        </div>

        <fieldset className="fav-choice">
          <legend>Renk</legend>
          <div className="fav-colors">
            {CATEGORY_COLORS.map((option) => (
              <button key={option.value} type="button" className={color === option.value ? "active" : ""} style={{ "--fav": option.value } as React.CSSProperties} aria-label={option.label} aria-pressed={color === option.value} onClick={() => setColor(option.value)}>
                <span />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="fav-choice">
          <legend>İkon</legend>
          <div className="fav-icons">
            {CATEGORY_ICONS.map((option) => (
              <button key={option.value} type="button" className={icon === option.value ? "active" : ""} style={{ "--fav": color } as React.CSSProperties} title={option.label} aria-label={option.label} aria-pressed={icon === option.value} onClick={() => setIcon(option.value)}>
                <CategoryIcon name={option.value} size={20} />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="fav-actions">
          {error && <p role="alert">{error}</p>}
          {onDelete && <button className="fav-delete" type="button" onClick={onDelete}>Kategoriyi sil</button>}
          <button className="fav-save" type="submit">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}
