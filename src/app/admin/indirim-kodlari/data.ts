import { deleteOrderDiscount, readOrderDiscounts, updateOrderDiscount } from "../orderActionData";

export type KodTip = "percentage" | "amount";

export type IndirimKodu = {
  id: number | string;
  kod: string;
  aciklama: string;
  aciklamaLink: boolean;
  tip: KodTip;
  tutar: number;
  limit: number;
  kullanilan: number;
  baslama: string;
  bitis: string;
};

export const discountCodes: IndirimKodu[] = [
  { id: 1,  kod: "deneme61",   aciklama: "Deneme",                                     aciklamaLink: false, tip: "percentage", tutar: 100,         limit: 1,   kullanilan: 1,  baslama: "20.07.2026", bitis: "31.07.2026" },
  { id: 2,  kod: "5454200764", aciklama: "PR260727007 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "27.07.2026", bitis: "27.07.2027" },
  { id: 3,  kod: "5073921340", aciklama: "SA260715002 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 4000,    limit: 1,   kullanilan: 1,  baslama: "17.07.2026", bitis: "17.07.2027" },
  { id: 4,  kod: "5324015626", aciklama: "PA260709007 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "09.07.2026", bitis: "09.07.2027" },
  { id: 5,  kod: "5324015626", aciklama: "SA260706018 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "09.07.2026", bitis: "09.07.2027" },
  { id: 6,  kod: "5373506973", aciklama: "SA260707014 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 1000,    limit: 1,   kullanilan: 1,  baslama: "08.07.2026", bitis: "08.07.2027" },
  { id: 7,  kod: "5077364511", aciklama: "TR260703006 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "03.07.2026", bitis: "03.07.2027" },
  { id: 8,  kod: "5428850748", aciklama: "SA260626003 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 1000,    limit: 1,   kullanilan: 1,  baslama: "01.07.2026", bitis: "01.07.2027" },
  { id: 9,  kod: "faseka",     aciklama: "",                                            aciklamaLink: false, tip: "percentage", tutar: 100,         limit: 2,   kullanilan: 2,  baslama: "29.06.2026", bitis: "01.07.2026" },
  { id: 10, kod: "5397483968", aciklama: "TR260630020 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 5397483968, limit: 1, kullanilan: 0, baslama: "30.06.2026", bitis: "30.06.2027" },
  { id: 11, kod: "5419039758", aciklama: "SA260628001 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 2000,    limit: 1,   kullanilan: 1,  baslama: "28.06.2026", bitis: "28.06.2027" },
  { id: 12, kod: "5361234567", aciklama: "PA260625004 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 50,      limit: 1,   kullanilan: 1,  baslama: "25.06.2026", bitis: "25.06.2027" },
  { id: 13, kod: "EIST2026",   aciklama: "Kampanya kodu",                               aciklamaLink: false, tip: "percentage", tutar: 10,          limit: 100, kullanilan: 43, baslama: "01.06.2026", bitis: "31.12.2026" },
  { id: 14, kod: "5287364511", aciklama: "TR260620008 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "20.06.2026", bitis: "20.06.2027" },
  { id: 15, kod: "5098765432", aciklama: "SA260618005 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 500,     limit: 1,   kullanilan: 1,  baslama: "18.06.2026", bitis: "18.06.2027" },
  { id: 16, kod: "5312345678", aciklama: "PA260615002 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "15.06.2026", bitis: "15.06.2027" },
  { id: 17, kod: "YAZ2026",    aciklama: "Yaz kampanyası",                              aciklamaLink: false, tip: "percentage", tutar: 15,          limit: 50,  kullanilan: 22, baslama: "01.06.2026", bitis: "31.08.2026" },
  { id: 18, kod: "5478901234", aciklama: "TR260612003 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "12.06.2026", bitis: "12.06.2027" },
  { id: 19, kod: "5198765432", aciklama: "SA260610007 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "amount",     tutar: 750,     limit: 1,   kullanilan: 0,  baslama: "10.06.2026", bitis: "10.06.2027" },
  { id: 20, kod: "5534567890", aciklama: "PA260608001 nolu sipariş üzerinden oluşturuldu", aciklamaLink: true, tip: "percentage", tutar: 100,     limit: 1,   kullanilan: 1,  baslama: "08.06.2026", bitis: "08.06.2027" },
];

const STORAGE_KEY = "eistatistik.discount-codes.v1";

function dayStamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

export function formatTutar(tip: KodTip, tutar: number) {
  const amount = tutar.toLocaleString("tr-TR");
  return tip === "percentage" ? `%${amount}` : `${amount} ₺`;
}

export function generatedCode() {
  return String(Math.floor(1000000000 + Math.random() * 9000000000));
}

export function readDiscountCodes() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return discountCodes;
    const parsed = JSON.parse(raw) as IndirimKodu[];
    return Array.isArray(parsed) ? parsed : discountCodes;
  } catch {
    return discountCodes;
  }
}

export function writeDiscountCodes(items: IndirimKodu[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function readVisibleDiscounts() {
  const catalog = readDiscountCodes();
  const shadowed = new Set(catalog.map((item) => String(item.id)));
  const fromOrders: IndirimKodu[] = readOrderDiscounts()
    .filter((record) => !shadowed.has(record.id))
    .map((record) => ({
      id: record.id,
      kod: record.code,
      aciklama: `${record.orderCode} nolu sipariş üzerinden oluşturuldu`,
      aciklamaLink: true,
      tip: record.type,
      tutar: record.value,
      limit: 1,
      kullanilan: 0,
      baslama: dayStamp(record.createdAt),
      bitis: record.expiresAt,
    }));
  return [...fromOrders, ...catalog];
}

export function saveDiscount(item: IndirimKodu) {
  if (readOrderDiscounts().some((record) => record.id === String(item.id))) {
    updateOrderDiscount(String(item.id), { code: item.kod, type: item.tip, value: item.tutar, expiresAt: item.bitis });
  }
  const current = readDiscountCodes();
  const exists = current.some((row) => String(row.id) === String(item.id));
  writeDiscountCodes(exists ? current.map((row) => String(row.id) === String(item.id) ? item : row) : [item, ...current]);
}

export function deleteDiscount(id: string) {
  writeDiscountCodes(readDiscountCodes().filter((item) => String(item.id) !== id));
  if (readOrderDiscounts().some((record) => record.id === id)) deleteOrderDiscount(id);
}
