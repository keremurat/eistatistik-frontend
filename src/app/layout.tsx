import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/role-settings.css";
import "./styles/workspace.css";
import "./styles/education.css";
import "./styles/auth.css";
import "./styles/analyst.css";
import "./styles/admin.css";
import "./styles/public-pages.css";
import { ToastProvider } from "./components/ToastProvider";
import { AppBreadcrumbs } from "./components/AppBreadcrumbs";
import { IamxChatbot } from "./components/IamxChatbot";
import { AccessProvider } from "./components/AccessProvider";
import { RouteAccess } from "./components/RouteAccess";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "eistatistik | Analiz, Eğitim ve Akademik Danışmanlık",
  description: "İstatistiksel analiz, akademik danışmanlık, uzman görüşmeleri ve eğitim süreçlerinizi tek çalışma alanından yönetin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col"><ToastProvider><AccessProvider><RouteAccess /><AppBreadcrumbs />{children}</AccessProvider><IamxChatbot /></ToastProvider></body>
    </html>
  );
}
