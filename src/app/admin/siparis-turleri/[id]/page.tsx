"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { ServiceTypeEditor } from "../ServiceTypeEditor";
import { readServiceTypes, ServiceType, writeServiceTypes } from "../serviceTypeData";

export default function SiparisTuruDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [serviceType, setServiceType] = useState<ServiceType | null | undefined>(undefined);
  const [existingCodes, setExistingCodes] = useState<string[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const current = readServiceTypes();
      const found = current.find((item) => item.id === params.id) ?? null;
      setServiceType(found);
      setExistingCodes(current.filter((item) => item.id !== params.id).map((item) => item.code));
    });
    return () => cancelAnimationFrame(frame);
  }, [params.id]);

  function save(value: Omit<ServiceType, "id">) {
    const next = readServiceTypes().map((item) => item.id === params.id ? { ...item, ...value } : item);
    writeServiceTypes(next);
    router.push("/admin/siparis-turleri");
  }

  function remove() {
    writeServiceTypes(readServiceTypes().filter((item) => item.id !== params.id));
    router.push("/admin/siparis-turleri");
  }

  return (
    <AdminShell>
      {serviceType === undefined ? null : serviceType === null ? (
        <div className="fav-page">
          <div className="fav-card fav-empty">
            <strong>Sipariş türü bulunamadı</strong>
            <p>Bu kayıt listede yok.</p>
            <Link className="orders-create" href="/admin/siparis-turleri">Listeye dön</Link>
          </div>
        </div>
      ) : (
        <ServiceTypeEditor initial={serviceType} existingCodes={existingCodes} submitLabel="Değişiklikleri kaydet" onSubmit={save} onDelete={remove} />
      )}
    </AdminShell>
  );
}
