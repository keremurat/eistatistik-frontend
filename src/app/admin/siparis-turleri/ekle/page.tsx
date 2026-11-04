"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { ServiceTypeEditor } from "../ServiceTypeEditor";
import { readServiceTypes, ServiceType, writeServiceTypes } from "../serviceTypeData";

export default function SiparisTuruEklePage() {
  const router = useRouter();
  const [existingCodes, setExistingCodes] = useState<string[]>([]);
  const [nextOrder, setNextOrder] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const current = readServiceTypes();
      setExistingCodes(current.map((type) => type.code));
      setNextOrder(current.length + 1);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function save(value: Omit<ServiceType, "id">) {
    const current = readServiceTypes();
    writeServiceTypes([...current, {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      ...value,
    }]);
    router.push("/admin/siparis-turleri");
  }

  return (
    <AdminShell>
      {ready && (
        <ServiceTypeEditor
          initial={{ id: "", code: "", title: "", description: "", order: nextOrder, status: "aktif", initialFee: 0, helpVideo: "", deliveryTimes: [], deliveryTypes: [], logoUrl: "", automaticPricing: false }}
          existingCodes={existingCodes}
          submitLabel="Kaydet"
          onSubmit={save}
        />
      )}
    </AdminShell>
  );
}
