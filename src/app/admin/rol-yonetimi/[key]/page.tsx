"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "../../AdminShell";
import { useToast } from "../../../components/ToastProvider";
import { getCurrentUser } from "@/lib/api/auth";
import { getRole, listPermissions, updateRole, type PermissionRecord, type RoleInput, type RoleRecord } from "@/lib/api/roles";
import { RoleEditor } from "../RoleEditor";

export default function RolDetailPage() {
  const params = useParams<{ key: string }>();
  return (
    <AdminShell>
      <RoleDetail roleKey={params.key} />
    </AdminShell>
  );
}

export function RoleDetail({ roleKey }: { roleKey: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const basePath = pathname.startsWith("/editor") ? "/editor/rol-yonetimi" : "/admin/rol-yonetimi";
  const [role, setRole] = useState<RoleRecord | null | undefined>(undefined);
  const [catalog, setCatalog] = useState<PermissionRecord[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getRole(roleKey), listPermissions()])
      .then(([nextRole, permissions]) => {
        if (!active) return;
        setRole(nextRole);
        setCatalog(permissions);
      })
      .catch(() => { if (active) setRole(null); });
    return () => { active = false; };
  }, [roleKey]);

  async function save(value: RoleInput) {
    setSaving(true);
    setError("");
    try {
      await updateRole(roleKey, value);
      if (localStorage.getItem("eistatistik_role") === roleKey) {
        await getCurrentUser();
        window.dispatchEvent(new Event("eistatistik-access"));
      }
      toast.success("Rol güncellendi.");
      router.push(basePath);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Rol kaydedilemedi.");
      setSaving(false);
    }
  }

  if (role === undefined) {
    return <div className="fav-page"><div className="fav-card fav-empty"><strong>Rol yükleniyor</strong><p>Yetkiler hazırlanıyor.</p></div></div>;
  }
  if (role === null) {
    return (
      <div className="fav-page">
        <div className="fav-card fav-empty">
          <strong>Rol bulunamadı</strong>
          <p>Bu kayıt listede yok.</p>
          <Link className="orders-create" href={basePath}>Listeye dön</Link>
        </div>
      </div>
    );
  }

  return <RoleEditor key={role.key} initial={role} catalog={catalog} basePath={basePath} submitLabel="Değişiklikleri kaydet" saving={saving} error={error} onSubmit={save} />;
}
