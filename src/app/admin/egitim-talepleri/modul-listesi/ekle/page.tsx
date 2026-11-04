"use client";

import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "../../../AdminShell";
import { useToast } from "../../../../components/ToastProvider";
import { ModuleDraft, ModuleEditor } from "../ModuleEditor";
import { readModules, writeModules } from "../data";

export default function ModulEklePage() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/modul-listesi" : "/admin/egitim-talepleri/modul-listesi";

  function save(value: ModuleDraft) {
    const current = readModules();
    const nextId = current.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    writeModules([{ id: nextId, ...value }, ...current]);
    toast.success("Modül kaydedildi.");
    router.push(basePath);
  }

  return (
    <AdminShell>
      <ModuleEditor basePath={basePath} submitLabel="Kaydet" onSubmit={save} />
    </AdminShell>
  );
}
