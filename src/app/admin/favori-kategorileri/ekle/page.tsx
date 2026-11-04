"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { CategoryEditor } from "../CategoryEditor";
import { FavoriteCategory, readFavoriteCategories, writeFavoriteCategories } from "../categoryData";

export default function AddFavoriteCategoryPage() {
  const router = useRouter();
  const [order, setOrder] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setOrder(readFavoriteCategories().length + 1);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function save(value: Pick<FavoriteCategory, "name" | "order" | "color" | "icon">) {
    const current = readFavoriteCategories();
    writeFavoriteCategories([...current, {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      favoriteCount: 0,
      ...value,
    }]);
    router.push("/admin/favori-kategorileri");
  }

  return (
    <AdminShell>
      {ready && <CategoryEditor initial={{ order }} submitLabel="Kaydet" onSubmit={save} />}
    </AdminShell>
  );
}
