import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";
import { AppBreadcrumbs } from "./components/AppBreadcrumbs";
import { IamxChatbot } from "./components/IamxChatbot";

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
      <body className="min-h-full flex flex-col"><ToastProvider><AppBreadcrumbs />{children}<IamxChatbot /></ToastProvider></body>
    </html>
  );
}
