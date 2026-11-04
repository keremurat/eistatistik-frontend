"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { GuideDraft, GuideEditor } from "../GuideEditor";
import { GuideStep, readGuideSteps, writeGuideSteps } from "../guideData";

export default function GuideStepDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminShell>
      <GuideStepDetail id={params.id} />
    </AdminShell>
  );
}

export function GuideStepDetail({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const [item, setItem] = useState<GuideStep | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItem(readGuideSteps().find((step) => step.id === id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  function save(value: GuideDraft) {
    writeGuideSteps(readGuideSteps().map((step) => step.id === id ? { ...step, ...value } : step));
    toast.success("Rehber adımı güncellendi.");
    router.push("/admin/rehber-adimlari");
  }

  function remove() {
    writeGuideSteps(readGuideSteps().filter((step) => step.id !== id));
    toast.success("Rehber adımı silindi.");
    router.push("/admin/rehber-adimlari");
  }

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Rehber adımı bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href="/admin/rehber-adimlari">Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <GuideEditor initial={item} basePath="/admin/rehber-adimlari" submitLabel="Güncelle" onSubmit={save} onDelete={remove} />;
}
