"use client";

import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { useToast } from "../../../../components/ToastProvider";
import { EducationDraft, EducationEditor } from "../EducationEditor";
import { readEducations, writeEducations } from "../data";

export default function EgitimEklePage() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/egitim-listesi" : "/admin/egitim-talepleri/egitim-listesi";

  function save(value: EducationDraft) {
    const current = readEducations();
    const nextId = current.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    writeEducations([{
      id: nextId,
      katilan: 0,
      baslamaFull: "",
      bitisFull: "",
      ...value,
    }, ...current]);
    toast.success("Eğitim kaydedildi.");
    router.push(basePath);
  }

  return (
    <AdminShell>
      <EducationEditor basePath={basePath} submitLabel="Kaydet" onSubmit={save} />
    </AdminShell>
  );
}
