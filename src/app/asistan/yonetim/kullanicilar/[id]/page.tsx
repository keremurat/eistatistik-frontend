"use client";

import { UserDetailContent } from "../../../../admin/kullanici-yonetimi/[id]/page";
import { AssistantHeader } from "../../../AssistantHeader";

export default function AssistantUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <div className="app-shell customer-shell">
    <AssistantHeader />
    <UserDetailContent params={params} basePath="/asistan/yonetim/kullanicilar" />
  </div>;
}
