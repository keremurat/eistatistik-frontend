"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { DuyuruForm } from "../DuyuruForm";
import { Duyuru, readAnnouncements } from "../data";

export default function DuyuruDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <AnnouncementDetail id={params.id} basePath="/admin/duyurular" />
    </AdminShell>
  );
}

export function AnnouncementDetail({ id, basePath }: { id: string; basePath: string }) {
  const [item, setItem] = useState<Duyuru | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItem(readAnnouncements().find((record) => String(record.id) === id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Duyuru bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href={basePath}>Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <DuyuruForm key={item.id} mode="duzenle" initial={item} basePath={basePath} embedded />;
}
