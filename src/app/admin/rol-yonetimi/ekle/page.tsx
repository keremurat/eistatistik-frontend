"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { ApiRequestError } from "@/lib/api/auth";
import { createRole, listPermissions, type PermissionRecord, type RoleInput } from "@/lib/api/roles";
import { ALL_PERMS } from "../data";
import { RoleEditor } from "../RoleEditor";

export default function RolEklePage() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/rol-yonetimi" : "/admin/rol-yonetimi";
  const [catalog, setCatalog] = useState<PermissionRecord[]>(ALL_PERMS);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listPermissions().then(setCatalog).catch(() => undefined);
  }, []);

  async function save(value: RoleInput) {
    setSaving(true);
    setError("");
    try {
      await createRole(value);
      toast.success("Rol oluşturuldu. Bu rol mevcut sayfaları kullanır.");
      router.push(basePath);
    } catch (saveError) {
      setError(saveError instanceof ApiRequestError ? saveError.message : "Rol oluşturulamadı.");
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <RoleEditor catalog={catalog} basePath={basePath} submitLabel="Kaydet" saving={saving} error={error} onSubmit={save} />
    </AdminShell>
  );
}
