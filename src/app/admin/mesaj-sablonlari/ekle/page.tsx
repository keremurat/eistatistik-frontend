"use client";

import { useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { MessageTemplateEditor } from "../MessageTemplateEditor";
import { MessageTemplate, readMessageTemplates, writeMessageTemplates } from "../messageTemplateData";

export default function MesajSablonuEklePage() {
  const router = useRouter();
  const toast = useToast();

  function save(value: Omit<MessageTemplate, "id">) {
    const current = readMessageTemplates();
    writeMessageTemplates([{
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      ...value,
    }, ...current]);
    toast.success("Mesaj şablonu kaydedildi.");
    router.push("/admin/mesaj-sablonlari");
  }

  return (
    <AdminShell>
      <MessageTemplateEditor submitLabel="Kaydet" onSubmit={save} />
    </AdminShell>
  );
}
