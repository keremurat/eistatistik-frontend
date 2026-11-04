import { accountStorageKey } from "../lib/accountStorage";

export type OrderDiscount = {
  id: string;
  orderCode: string;
  code: string;
  type: "percentage" | "amount";
  value: number;
  expiresAt: string;
  createdAt: string;
};

export type OrderTask = {
  id: string;
  orderCode: string;
  title: string;
  assignee: string;
  dueDate: string;
  description: string;
  createdAt: string;
};

function readRecords<T>(base: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(accountStorageKey(base));
    return raw ? JSON.parse(raw) as T[] : [];
  } catch {
    return [];
  }
}

function appendRecord<T>(base: string, record: T) {
  const records = readRecords<T>(base);
  localStorage.setItem(accountStorageKey(base), JSON.stringify([record, ...records]));
}

const ORDER_DISCOUNTS_KEY = "eistatistik_order_discounts_v1";

function writeRecords<T>(base: string, records: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(accountStorageKey(base), JSON.stringify(records));
}

export const readOrderDiscounts = () => readRecords<OrderDiscount>(ORDER_DISCOUNTS_KEY);
export const saveOrderDiscount = (record: OrderDiscount) => appendRecord(ORDER_DISCOUNTS_KEY, record);
export function updateOrderDiscount(id: string, patch: Partial<OrderDiscount>) {
  writeRecords(ORDER_DISCOUNTS_KEY, readOrderDiscounts().map((record) => record.id === id ? { ...record, ...patch } : record));
}
export function deleteOrderDiscount(id: string) {
  writeRecords(ORDER_DISCOUNTS_KEY, readOrderDiscounts().filter((record) => record.id !== id));
}
export const readOrderTasks = () => readRecords<OrderTask>("eistatistik_order_tasks_v1");
export const saveOrderTask = (record: OrderTask) => appendRecord("eistatistik_order_tasks_v1", record);
