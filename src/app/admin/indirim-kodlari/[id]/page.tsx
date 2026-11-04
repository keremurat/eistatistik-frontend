"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { DiscountDraft, DiscountEditor } from "../DiscountEditor";
import { deleteDiscount, IndirimKodu, readVisibleDiscounts, saveDiscount } from "../data";

export default function IndirimKoduDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <DiscountDetail id={params.id} />
    </AdminShell>
  );
}

export function DiscountDetail({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/indirim-kodlari" : "/admin/indirim-kodlari";
  const [item, setItem] = useState<IndirimKodu | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItem(readVisibleDiscounts().find((code) => String(code.id) === id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  function save(value: DiscountDraft) {
    if (!item) return;
    saveDiscount({ ...item, ...value, kod: value.kod || item.kod });
    toast.success("İndirim kodu güncellendi.");
    router.push(basePath);
  }

  function remove() {
    deleteDiscount(id);
    toast.success("İndirim kodu silindi.");
    router.push(basePath);
  }

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>İndirim kodu bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href={basePath}>Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <DiscountEditor initial={item} basePath={basePath} submitLabel="Değişiklikleri kaydet" onSubmit={save} onDelete={remove} />;
}
