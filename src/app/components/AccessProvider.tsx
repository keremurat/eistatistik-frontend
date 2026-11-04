"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/lib/api/auth";

type AccessState = {
  ready: boolean;
  role: string;
  roleName: string;
  home: string;
  permissions: string[];
  can: (permission: string) => boolean;
};

const AccessContext = createContext<AccessState>({
  ready: false,
  role: "",
  roleName: "",
  home: "/dashboard",
  permissions: [],
  can: () => true,
});

export function useAccess() {
  return useContext(AccessContext);
}

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState("");
  const [roleName, setRoleName] = useState("");
  const [home, setHome] = useState("/dashboard");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const storedRole = localStorage.getItem("eistatistik_role") ?? "";
    const storedHome = localStorage.getItem("eistatistik_home") ?? "/dashboard";
    let storedPermissions: string[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem("eistatistik_permissions") ?? "[]") as unknown;
      if (Array.isArray(parsed)) storedPermissions = parsed.filter(item => typeof item === "string");
    } catch {
      storedPermissions = [];
    }
    setRole(storedRole);
    setHome(storedHome);
    setPermissions(storedPermissions);

    const refresh = () => getCurrentUser()
      .then(user => {
        if (!active || !user) return;
        setRole(user.role);
        setRoleName(user.roleName);
        setHome(user.homePath);
        setPermissions(user.permissions);
      })
      .catch(() => undefined);
    const onAccess = () => { void refresh(); };

    window.addEventListener("eistatistik-access", onAccess);
    if (storedRole) {
      void refresh().finally(() => { if (active) setReady(true); });
    } else {
      setReady(true);
    }

    return () => { active = false; window.removeEventListener("eistatistik-access", onAccess); };
  }, []);

  const value = useMemo<AccessState>(() => ({
    ready,
    role,
    roleName,
    home,
    permissions,
    can: permission => !ready || permissions.includes(permission),
  }), [ready, role, roleName, home, permissions]);

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}
