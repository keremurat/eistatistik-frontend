"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { permissionForPath } from "@/lib/access";
import { useAccess } from "./AccessProvider";

export function RouteAccess() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, role, permissions, home } = useAccess();

  useEffect(() => {
    if (!ready || !role || pathname === home) return;
    const required = permissionForPath(pathname);
    if (required && !permissions.includes(required)) router.replace(home || "/giris");
  }, [ready, role, permissions, home, pathname, router]);

  return null;
}
