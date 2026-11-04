"use client";

import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { GuideDraft, GuideEditor } from "../GuideEditor";
import { readGuideSteps, writeGuideSteps } from "../guideData";

export default function AddGuideStepPage() {
  const router = useRouter();
  const toast = useToast();

  function create(value: GuideDraft) {
    writeGuideSteps([...readGuideSteps(), { id: crypto.randomUUID(), ...value }]);
    toast.success("Rehber adımı oluşturuldu.");
    router.push("/admin/rehber-adimlari");
  }

  return (
    <AdminShell>
      <GuideEditor basePath="/admin/rehber-adimlari" submitLabel="Kaydet" onSubmit={create} />
    </AdminShell>
  );
}
