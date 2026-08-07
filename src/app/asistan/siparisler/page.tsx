"use client";

import { SharedOrdersList } from "../../admin/siparisler/page";
import { FavoritesProvider } from "../../admin/FavoritesContext";
import { AssistantHeader } from "../AssistantHeader";

export default function AssistantOrdersPage() {
  return (
    <FavoritesProvider>
      <div className="app-shell assistant-shell">
        <AssistantHeader />
        <main className="admin-dash">
          <SharedOrdersList basePath="/asistan/siparisler" />
        </main>
      </div>
    </FavoritesProvider>
  );
}
