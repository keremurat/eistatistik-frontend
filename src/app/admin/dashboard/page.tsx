"use client";

import { AdminShell } from "../AdminShell";
import { AdminAnalyticsSection } from "../AnalyticsDashboard";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="dash-page">
        <header className="dash-page-head">
          <h1>Dashboard</h1>
          <p>Sipariş, gelir ve ekip bugün nerede duruyor.</p>
        </header>
        <AdminAnalyticsSection />
      </div>
    </AdminShell>
  );
}
