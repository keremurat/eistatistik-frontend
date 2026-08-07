"use client";

import { NewEducationContent } from "../../../admin/egitimler/yeni/page";
import { AssistantHeader } from "../../AssistantHeader";

export default function AssistantNewEducationPage() {
  return <div className="app-shell assistant-shell">
    <AssistantHeader />
    <main className="admin-dash"><NewEducationContent basePath="/asistan/egitimler" /></main>
  </div>;
}
