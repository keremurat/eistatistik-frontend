export const CURRENT_ACCOUNT_KEY = "eistatistik_account";

export function getCurrentAccountId() {
  if (typeof window === "undefined") return "guest";
  return localStorage.getItem(CURRENT_ACCOUNT_KEY)
    ?? localStorage.getItem("eistatistik_role")
    ?? "guest";
}

export function accountStorageKey(base: string) {
  return `${base}:${getCurrentAccountId().trim().toLocaleLowerCase("tr")}`;
}
