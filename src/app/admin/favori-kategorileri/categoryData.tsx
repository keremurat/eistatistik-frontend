export type CategoryIconName =
  | "tag"
  | "bookmark"
  | "star"
  | "heart"
  | "folder"
  | "layers"
  | "briefcase"
  | "archive"
  | "award"
  | "chart"
  | "users"
  | "calendar";

export type FavoriteCategory = {
  id: string;
  name: string;
  order: number;
  color: string;
  icon: CategoryIconName;
  favoriteCount: number;
};

export const FAVORITE_CATEGORY_STORAGE_KEY = "eistatistik.favorite-categories.v1";

export const CATEGORY_COLORS = [
  { value: "#1775a9", label: "Mavi" },
  { value: "#22877f", label: "Turkuaz" },
  { value: "#287a55", label: "Yeşil" },
  { value: "#b66d2e", label: "Amber" },
  { value: "#ad4f4f", label: "Kırmızı" },
  { value: "#7157cf", label: "Mor" },
  { value: "#c95784", label: "Pembe" },
  { value: "#238ca8", label: "Camgöbeği" },
  { value: "#c96824", label: "Turuncu" },
  { value: "#54687a", label: "Füme" },
] as const;

export const CATEGORY_ICONS: { value: CategoryIconName; label: string }[] = [
  { value: "tag", label: "Etiket" },
  { value: "bookmark", label: "Yer imi" },
  { value: "star", label: "Yıldız" },
  { value: "heart", label: "Kalp" },
  { value: "folder", label: "Klasör" },
  { value: "layers", label: "Katmanlar" },
  { value: "briefcase", label: "Çanta" },
  { value: "archive", label: "Arşiv" },
  { value: "award", label: "Rozet" },
  { value: "chart", label: "Grafik" },
  { value: "users", label: "Kullanıcılar" },
  { value: "calendar", label: "Takvim" },
];

export function CategoryIcon({ name, size = 18 }: { name: CategoryIconName; size?: number }) {
  const paths: Record<CategoryIconName, React.ReactNode> = {
    tag: <><path d="M20 13 13 20 4 11V4h7l9 9Z" /><circle cx="8.5" cy="8.5" r="1" /></>,
    bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    folder: <path d="M3 6h7l2 2h9v11H3V6Z" />,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" /></>,
    archive: <><path d="M4 7h16v13H4V7Z" /><path d="M3 3h18v4H3V3ZM9 11h6" /></>,
    award: <><circle cx="12" cy="8" r="5" /><path d="m8.5 12-1 9 4.5-2 4.5 2-1-9" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function readFavoriteCategories(): FavoriteCategory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITE_CATEGORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteCategory[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => a.order - b.order) : [];
  } catch {
    return [];
  }
}

export function writeFavoriteCategories(categories: FavoriteCategory[]) {
  window.localStorage.setItem(FAVORITE_CATEGORY_STORAGE_KEY, JSON.stringify(categories));
}
