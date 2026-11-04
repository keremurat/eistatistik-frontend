import { ApiRequestError, getCsrfToken, type ApiErrorBody } from "./auth";

export type PermissionRecord = {
  key: string;
  label: string;
  category: string;
};

export type RoleRecord = {
  key: string;
  name: string;
  description: string;
  assignable: boolean;
  system: boolean;
  homePath: string;
  permissions: string[];
};

type RawRole = Omit<RoleRecord, "homePath"> & { home_path: string };

export type RoleInput = {
  name: string;
  description: string;
  assignable: boolean;
  permissions: string[];
};

function normalizeRole(role: RawRole): RoleRecord {
  return {
    key: role.key,
    name: role.name,
    description: role.description ?? "",
    assignable: role.assignable,
    system: role.system,
    homePath: role.home_path,
    permissions: role.permissions,
  };
}

export async function listRoles() {
  const body = await request<{ data: RawRole[] }>("/api/v1/roles");
  return body.data.map(normalizeRole);
}

export async function getRole(key: string) {
  const body = await request<{ data: RawRole }>(`/api/v1/roles/${encodeURIComponent(key)}`);
  return normalizeRole(body.data);
}

export async function listPermissions() {
  const body = await request<{ data: PermissionRecord[] }>("/api/v1/permissions");
  return body.data;
}

export async function createRole(input: RoleInput) {
  const body = await request<{ data: RawRole }>("/api/v1/roles", "POST", { role: input });
  return normalizeRole(body.data);
}

export async function updateRole(key: string, input: RoleInput) {
  const body = await request<{ data: RawRole }>(`/api/v1/roles/${encodeURIComponent(key)}`, "PATCH", { role: input });
  return normalizeRole(body.data);
}

async function request<T>(path: string, method = "GET", payload?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
    headers["X-CSRF-Token"] = await getCsrfToken();
  }

  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers,
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // Proxy failures may not be JSON.
    }
    throw new ApiRequestError(
      body.error?.message ?? "Sunucu isteği tamamlanamadı",
      response.status,
      body.error?.code ?? "request_failed",
      body.error?.fields,
    );
  }

  return (await response.json()) as T;
}
