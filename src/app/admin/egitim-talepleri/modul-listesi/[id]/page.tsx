"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../../AdminShell";
import { useToast } from "../../../../components/ToastProvider";
import { ModuleDraft, ModuleEditor } from "../ModuleEditor";
import { Modul, readModules, writeModules } from "../data";

export default function ModulDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <ModuleDetail id={params.id} />
    </AdminShell>
  );
}

export function ModuleDetail({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/egitim-talepleri/modul-listesi" : "/admin/egitim-talepleri/modul-listesi";
  const [item, setItem] = useState<Modul | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItem(readModules().find((module) => String(module.id) === id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  function save(value: ModuleDraft) {
    writeModules(readModules().map((module) => module.id === item?.id ? { ...module, ...value } : module));
    toast.success("Modül güncellendi.");
    router.push(basePath);
  }

  function remove() {
    writeModules(readModules().filter((module) => module.id !== item?.id));
    toast.success("Modül silindi.");
    router.push(basePath);
  }

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Modül bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href={basePath}>Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <ModuleEditor initial={item} basePath={basePath} submitLabel="Değişiklikleri kaydet" onSubmit={save} onDelete={remove} />;
}
