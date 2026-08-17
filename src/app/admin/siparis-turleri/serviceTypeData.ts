export type ServiceStatus = "aktif" | "pasif";

export type ServiceOption = {
  label: string;
  value: string;
};

export type ServiceType = {
  id: string;
  code: string;
  title: string;
  description: string;
  order: number;
  status: ServiceStatus;
  initialFee: number;
  helpVideo: string;
  deliveryTimes: ServiceOption[];
  deliveryTypes: ServiceOption[];
  logoUrl: string;
  automaticPricing: boolean;
};

export const SERVICE_TYPES_STORAGE_KEY = "eistatistik.service-types.v1";

export const defaultServiceTypes: ServiceType[] = [
  { id:"SA", code:"SA", title:"İstatistiksel Veri Analizi", description:"", order:1, status:"aktif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"KPA", code:"KPA", title:"Kampanyalı Power Analizi", description:"3 Power analizi tek fiyat", order:2, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"KDS", code:"KDS", title:"Kampanya Online Danışmanlık", description:"", order:2, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"PA", code:"PA", title:"Power Analizi", description:"", order:2, status:"aktif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"ODP", code:"ODP", title:"Kampanyalı Online Mentörlük", description:"3 saatlik mentörlük tek fiyat", order:2, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"DS", code:"DS", title:"Online Mentörlük", description:"", order:3, status:"aktif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"GA", code:"GA", title:"Graphical Abstract", description:"", order:6, status:"aktif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"RV", code:"RV", title:"Geçerlilik Analizi", description:"", order:7, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"PR", code:"PR", title:"Proforma Fatura", description:"", order:8, status:"aktif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"HP", code:"HP", title:"Patoloji İnceleme", description:"İnceleme yapıyoruz", order:9, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"APP", code:"APP", title:"Akademik Mobil Uygulama", description:"", order:9, status:"aktif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"RE", code:"RE", title:"Raporlama", description:"", order:10, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"DP", code:"DP", title:"Veri İşleme", description:"", order:11, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
  { id:"IDP", code:"IDP", title:"İstatistiksel Danışmanlık Paketi", description:"", order:12, status:"pasif", initialFee:0, helpVideo:"", deliveryTimes:[], deliveryTypes:[], logoUrl:"", automaticPricing:false },
];

export function readServiceTypes(): ServiceType[] {
  if (typeof window === "undefined") return defaultServiceTypes;
  try {
    const raw = window.localStorage.getItem(SERVICE_TYPES_STORAGE_KEY);
    if (!raw) return defaultServiceTypes;
    const saved = JSON.parse(raw) as ServiceType[];
    return Array.isArray(saved) ? saved.sort((a,b) => a.order - b.order) : defaultServiceTypes;
  } catch {
    return defaultServiceTypes;
  }
}

export function writeServiceTypes(types: ServiceType[]) {
  window.localStorage.setItem(SERVICE_TYPES_STORAGE_KEY, JSON.stringify(types));
}
