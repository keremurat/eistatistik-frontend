export type Bulten = {
  id: string;
  baslik: string;
  aciklama: string;
  yayinTarihi: string; // "GG.AA.YYYY SS:DD"
  yayinda: boolean;
  kapak?: string;
};

export type IcerikTuru = "video" | "dosya" | "metin";

export type Icerik = {
  id: string;
  bultenId: string;
  baslik: string;
  aciklama: string;
  tur: IcerikTuru;
  yayinTarihi: string;
  youtubeUrl: string;
  dosya: string;
  genislik: "normal" | "tam";
  yayinda: boolean;
};

export const BULTENLER: Bulten[] = [
  { id: "b1", baslik: "MAkale Okur Yazarlığı", aciklama: "Harika bir bültenle karşınızdayız", yayinTarihi: "23.07.2026 22:31", yayinda: true },
];

export const ICERIKLER: Icerik[] = [
  { id: "i1", bultenId: "b1", baslik: "Tablo Okuma", aciklama: "Tablo Nasıl Okunur onu anlatacağım", tur: "video", yayinTarihi: "23.07.2026 22:22", youtubeUrl: "https://www.youtube.com/watch?v=xrNzkArvkdc", dosya: "Power Analysis.docx", genislik: "normal", yayinda: true },
];

const STORAGE_KEY = "eistatistik.newsletters.v1";

export function readBultenler(): Bulten[] {
  if (typeof window === "undefined") return BULTENLER;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return BULTENLER;
    const parsed = JSON.parse(raw) as Bulten[];
    return Array.isArray(parsed) ? parsed : BULTENLER;
  } catch {
    return BULTENLER;
  }
}

export function writeBultenler(items: Bulten[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const CONTENT_KEY = "eistatistik.newsletter-contents.v1";

export function readIcerikler(): Icerik[] {
  if (typeof window === "undefined") return ICERIKLER;
  try {
    const raw = window.localStorage.getItem(CONTENT_KEY);
    if (!raw) return ICERIKLER;
    const parsed = JSON.parse(raw) as Icerik[];
    return Array.isArray(parsed) ? parsed : ICERIKLER;
  } catch {
    return ICERIKLER;
  }
}

export function writeIcerikler(items: Icerik[]) {
  window.localStorage.setItem(CONTENT_KEY, JSON.stringify(items));
}

export function getBulten(id: string) { return BULTENLER.find((b) => b.id === id); }
export function getIcerik(id: string) { return ICERIKLER.find((i) => i.id === id); }
export function bultenIcerikler(bultenId: string) { return ICERIKLER.filter((i) => i.bultenId === bultenId); }

export const bultenOptions = () => BULTENLER.map((b) => ({ value: b.id, label: b.baslik }));
