"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { BultenForm } from "../BultenForm";
import { Bulten, readBultenler } from "../data";

function EditBulten() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const [item, setItem] = useState<Bulten | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItem(readBultenler().find((record) => record.id === id) ?? null));
    return () => cancelAnimationFrame(frame);
  }, [id]);

  if (item === undefined) return null;
  if (item === null) {
    return (
      <AdminShell>
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Bülten bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/bultenler">Listeye dön</Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  return <BultenForm key={item.id} mode="duzenle" initial={item} />;
}

export default function BultenDuzenlePage() {
  return <Suspense fallback={null}><EditBulten /></Suspense>;
}
