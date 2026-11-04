"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../../AdminShell";
import { useToast } from "../../../../components/ToastProvider";
import { LessonDraft, LessonEditor } from "../LessonEditor";
import { Ders, readLessons, writeLessons } from "../data";

export default function DersDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <LessonDetail id={params.id} />
    </AdminShell>
  );
}

export function LessonDetail({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/ders-listesi" : "/admin/egitim-talepleri/ders-listesi";
  const [item, setItem] = useState<Ders | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItem(readLessons().find((lesson) => String(lesson.id) === id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  function save(value: LessonDraft) {
    writeLessons(readLessons().map((lesson) => lesson.id === item?.id ? { ...lesson, ...value } : lesson));
    toast.success("Ders güncellendi.");
    router.push(basePath);
  }

  function remove() {
    writeLessons(readLessons().filter((lesson) => lesson.id !== item?.id));
    toast.success("Ders silindi.");
    router.push(basePath);
  }

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Ders bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href={basePath}>Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <LessonEditor initial={item} basePath={basePath} submitLabel="Değişiklikleri kaydet" onSubmit={save} onDelete={remove} />;
}
