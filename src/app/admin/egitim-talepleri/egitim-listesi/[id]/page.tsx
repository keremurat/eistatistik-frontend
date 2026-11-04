"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../../AdminShell";
import { useToast } from "../../../../components/ToastProvider";
import { EducationDraft, EducationEditor } from "../EducationEditor";
import { Egitim, readEducations, writeEducations } from "../data";

export default function EgitimDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <EducationDetail id={params.id} />
    </AdminShell>
  );
}

export function EducationDetail({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/egitim-listesi" : "/admin/egitim-talepleri/egitim-listesi";
  const [item, setItem] = useState<Egitim | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItem(readEducations().find((education) => String(education.id) === id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  function save(value: EducationDraft) {
    writeEducations(readEducations().map((education) => education.id === item?.id ? { ...education, ...value } : education));
    toast.success("Eğitim güncellendi.");
    router.push(basePath);
  }

  function remove() {
    writeEducations(readEducations().filter((education) => education.id !== item?.id));
    toast.success("Eğitim silindi.");
    router.push(basePath);
  }

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Eğitim bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href={basePath}>Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <EducationEditor initial={item} basePath={basePath} submitLabel="Değişiklikleri kaydet" onSubmit={save} onDelete={remove} />;
}
