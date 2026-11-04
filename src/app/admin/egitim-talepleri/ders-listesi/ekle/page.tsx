"use client";

import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { useToast } from "../../../../components/ToastProvider";
import { LessonDraft, LessonEditor } from "../LessonEditor";
import { readLessons, writeLessons } from "../data";

export default function DersEklePage() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/ders-listesi" : "/admin/egitim-talepleri/ders-listesi";

  function save(value: LessonDraft) {
    const current = readLessons();
    const nextId = current.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    writeLessons([{ id: nextId, ...value }, ...current]);
    toast.success("Ders kaydedildi.");
    router.push(basePath);
  }

  return (
    <AdminShell>
      <LessonEditor basePath={basePath} submitLabel="Kaydet" onSubmit={save} />
    </AdminShell>
  );
}
