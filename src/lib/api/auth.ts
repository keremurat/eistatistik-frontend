export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string[]>;
  };
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type CsrfResponse = {
  data: {
    csrf_token: string;
  };
};

type ConfirmationResponse = {
  data: {
    status: "confirmed";
  };
};

export type AccountRole = "musteri" | "analizor" | "asistan" | "editor" | "admin";

export type AuthenticatedUser = {
  id: number;
  email: string;
  role: string;
  roleName: string;
  homePath: string;
  permissions: string[];
};

type RawAuthenticatedUser = {
  id: number;
  email: string;
  role: string;
  role_name?: string;
  home_path?: string;
  permissions?: string[];
};

const roleLandings: Record<AccountRole, string> = {
  musteri: "/dashboard",
  analizor: "/analizor",
  asistan: "/asistan",
  editor: "/editor",
  admin: "/admin",
};

export function landingForRole(role: string) {
  return roleLandings[role as AccountRole] ?? "/dashboard";
}

export function rememberSession(user: AuthenticatedUser) {
  localStorage.setItem("eistatistik_role", user.role);
  localStorage.setItem("eistatistik_home", user.homePath);
  localStorage.setItem("eistatistik_permissions", JSON.stringify(user.permissions));
}

export function clearSession() {
  localStorage.removeItem("eistatistik_role");
  localStorage.removeItem("eistatistik_home");
  localStorage.removeItem("eistatistik_permissions");
}

function normalizeUser(user: RawAuthenticatedUser): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    roleName: user.role_name || user.role,
    homePath: user.home_path || landingForRole(user.role),
    permissions: user.permissions ?? [],
  };
}

type LoginResponse = {
  data: {
    user: RawAuthenticatedUser;
    csrf_token: string;
  };
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegistrationDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  membershipTermsAccepted: boolean;
  kvkkNoticeAccepted: boolean;
};

type RegistrationResponse = {
  data: {
    user: { id: number; email: string };
    next_step: "confirmation_required";
  };
};

type CurrentUserResponse = {
  data: {
    user: RawAuthenticatedUser;
  };
};

export async function getCsrfToken(): Promise<string> {
  const response = await fetch("/api/v1/auth/csrf", {
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw await apiErrorFrom(response);

  const body = (await response.json()) as CsrfResponse;
  return body.data.csrf_token;
}

export async function confirmAccount(confirmationToken: string): Promise<void> {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/v1/auth/confirmation", {
    method: "PATCH",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ confirmation_token: confirmationToken }),
  });

  if (!response.ok) throw await apiErrorFrom(response);

  const body = (await response.json()) as ConfirmationResponse;
  if (body.data.status !== "confirmed") {
    throw new ApiRequestError("Beklenmeyen doğrulama cevabı", response.status, "unexpected_response");
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthenticatedUser> {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({
      user: {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        remember_me: credentials.rememberMe,
      },
    }),
  });

  if (!response.ok) throw await apiErrorFrom(response);

  const body = (await response.json()) as LoginResponse;
  if (!body.data?.user?.id || !body.data.user.role || !body.data.csrf_token) {
    throw new ApiRequestError("Beklenmeyen giriş cevabı", response.status, "unexpected_response");
  }

  const user = normalizeUser(body.data.user);
  rememberSession(user);
  return user;
}

export async function registerUser(details: RegistrationDetails): Promise<{ id: number; email: string }> {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/v1/auth/register", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({
      user: {
        first_name: details.firstName.trim(),
        last_name: details.lastName.trim(),
        email: details.email.trim().toLowerCase(),
        password: details.password,
        password_confirmation: details.passwordConfirmation,
        agreements: {
          membership_terms: details.membershipTermsAccepted,
          kvkk_notice: details.kvkkNoticeAccepted,
        },
      },
    }),
  });

  if (!response.ok) throw await apiErrorFrom(response);

  const body = (await response.json()) as RegistrationResponse;
  if (!body.data?.user?.id || body.data.next_step !== "confirmation_required") {
    throw new ApiRequestError("Beklenmeyen kayıt cevabı", response.status, "unexpected_response");
  }

  return body.data.user;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const response = await fetch("/api/v1/auth/me", {
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (response.status === 401) {
    const error = await apiErrorFrom(response);
    if (error.code === "authentication_required") return null;
    throw error;
  }

  if (!response.ok) throw await apiErrorFrom(response);

  const body = (await response.json()) as CurrentUserResponse;
  if (!body.data?.user?.id || !body.data.user.email || !body.data.user.role) {
    throw new ApiRequestError("Beklenmeyen oturum cevabı", response.status, "unexpected_response");
  }

  const user = normalizeUser(body.data.user);
  rememberSession(user);
  return user;
}

export async function logoutUser(): Promise<void> {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/v1/auth/logout", {
    method: "DELETE",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
  });

  if (!response.ok) throw await apiErrorFrom(response);
}

async function apiErrorFrom(response: Response): Promise<ApiRequestError> {
  let body: ApiErrorBody = {};

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    // Upstream may be unavailable and return a non-JSON proxy response.
  }

  return new ApiRequestError(
    body.error?.message ?? "Sunucu isteği tamamlanamadı",
    response.status,
    body.error?.code ?? "request_failed",
    body.error?.fields,
  );
}
