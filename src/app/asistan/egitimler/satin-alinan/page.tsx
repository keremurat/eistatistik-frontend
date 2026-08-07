"use client";

import { PurchasedEducationsContent } from "../../../admin/egitimler/satin-alinan/page";
import { AssistantHeader } from "../../AssistantHeader";

export default function AssistantPurchasedEducationsPage() {
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><PurchasedEducationsContent basePath="/asistan/egitimler" /></main>
  </div>;
}
