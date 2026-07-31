// Demo hesaplar — prototip amaçlı, tamamen client-side.
// Giriş, girilen e-postaya göre ilgili rolün iniş sayfasına yönlendirir.
// Not: Gerçek sistemde kimlik doğrulama sunucu tarafında yapılmalıdır.

export type Role = "musteri" | "admin";

export type DemoAccount = {
  email: string;
  role: Role;
  name: string;
  /** Başarılı girişte yönlendirilecek sayfa. */
  landing: string;
};

/** Tüm demo hesapların ortak şifresi. */
export const DEMO_PASSWORD = "password123";

/** Yeni rol eklemek için buraya bir kayıt ekle: `{role}@eistatistik.com`. */
export const demoAccounts: DemoAccount[] = [
  { email: "musteri@eistatistik.com", role: "musteri", name: "Kerem Murat", landing: "/dashboard" },
  { email: "admin@eistatistik.com", role: "admin", name: "Yönetici", landing: "/admin" },
];

/**
 * Girilen e-posta + şifre bir demo hesapla eşleşiyorsa o hesabı döndürür, yoksa null.
 * E-posta karşılaştırması locale'den bağımsız (düz toLowerCase) yapılır — "tr" locale'i
 * "I" harfini "ı"ya çevirip eşleşmeyi bozar.
 */
export function findDemoAccount(email: string, password: string): DemoAccount | null {
  if (password !== DEMO_PASSWORD) return null;
  const normalized = email.trim().toLowerCase();
  return demoAccounts.find((account) => account.email === normalized) ?? null;
}
