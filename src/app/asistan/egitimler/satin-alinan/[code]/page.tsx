"use client";

import { PurchasedEducationDetailContent } from "../../../../admin/egitimler/satin-alinan/[code]/page";
import { AssistantHeader } from "../../../AssistantHeader";

export default function AssistantPurchasedEducationDetailPage() {
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <PurchasedEducationDetailContent basePath="/asistan/egitimler" />
  </div>;
}
