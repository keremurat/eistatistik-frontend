"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { CategoryEditor } from "../CategoryEditor";
import { FavoriteCategory, readFavoriteCategories, writeFavoriteCategories } from "../categoryData";

export default function FavoriteCategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<FavoriteCategory | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCategory(readFavoriteCategories().find((item) => item.id === params.id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [params.id]);

  function save(value: Pick<FavoriteCategory, "name" | "order" | "color" | "icon">) {
    const next = readFavoriteCategories().map((item) => item.id === params.id ? { ...item, ...value } : item);
    writeFavoriteCategories(next);
    router.push("/admin/favori-kategorileri");
  }

  function remove() {
    writeFavoriteCategories(readFavoriteCategories().filter((item) => item.id !== params.id));
    router.push("/admin/favori-kategorileri");
  }

  return (
    <AdminShell>
      {category === undefined ? null : category === null ? (
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Kategori bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/favori-kategorileri">Listeye dön</Link>
          </div>
        </div>
      ) : (
        <CategoryEditor initial={category} submitLabel="Değişiklikleri kaydet" onSubmit={save} onDelete={remove} />
      )}
    </AdminShell>
  );
}
