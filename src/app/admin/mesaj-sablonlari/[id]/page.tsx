"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { MessageTemplateEditor } from "../MessageTemplateEditor";
import { MessageTemplate, readMessageTemplates, writeMessageTemplates } from "../messageTemplateData";

export default function MesajSablonuDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [template, setTemplate] = useState<MessageTemplate | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setTemplate(readMessageTemplates().find((item) => item.id === params.id) ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [params.id]);

  function save(value: Omit<MessageTemplate, "id">) {
    writeMessageTemplates(readMessageTemplates().map((item) => item.id === params.id ? { ...item, ...value } : item));
    toast.success("Mesaj şablonu güncellendi.");
    router.push("/admin/mesaj-sablonlari");
  }

  function remove() {
    writeMessageTemplates(readMessageTemplates().filter((item) => item.id !== params.id));
    toast.success("Mesaj şablonu silindi.");
    router.push("/admin/mesaj-sablonlari");
  }

  return (
    <AdminShell>
      {template === undefined ? null : template === null ? (
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Mesaj şablonu bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/mesaj-sablonlari">Listeye dön</Link>
          </div>
        </div>
      ) : (
        <MessageTemplateEditor initial={template} submitLabel="Değişiklikleri kaydet" onSubmit={save} onDelete={remove} />
      )}
    </AdminShell>
  );
}
