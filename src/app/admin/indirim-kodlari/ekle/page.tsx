"use client";

import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { DiscountDraft, DiscountEditor } from "../DiscountEditor";
import { generatedCode, readDiscountCodes, saveDiscount } from "../data";

export default function IndirimKoduEklePage() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/indirim-kodlari" : "/admin/indirim-kodlari";

  function save(value: DiscountDraft) {
    const current = readDiscountCodes();
    const nextId = current.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    saveDiscount({ id: nextId, ...value, kod: value.kod || generatedCode() });
    toast.success("İndirim kodu kaydedildi.");
    router.push(basePath);
  }

  return (
    <AdminShell>
      <DiscountEditor basePath={basePath} submitLabel="Kaydet" onSubmit={save} />
    </AdminShell>
  );
}
